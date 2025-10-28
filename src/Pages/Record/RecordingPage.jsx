import "./RecordingPage.css"
import { useState, useRef, useEffect } from "react"
import { NavBar } from "../../assets/Header"
import axios from "axios"

export function RecordingPage({ flashcards, setFlashcards }) {
    const [isRecording, setIsRecording] = useState(false)
    const [doneRecording, setDoneRecording] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [lang, setLang] = useState("en-US")
    const [lang_to, setLang_to] = useState("en")
    const [text, setText] = useState("")
    const [fullTranscript, setFullTranscript] = useState("")
    const [pos, setPos] = useState("Nouns")
    const [userInput, setUserInput] = useState("")
    const [amountOfCards, setAmountOfCards] = useState(1)
    const [downTime, setDownTime] = useState(false)


    const timerRef = useRef(null)
    const recognition = useRef(null)



    const changeLanguage = (newLang) => {
        // If we aint recording don do nothin
        if (!recognition.current) return

        // Speech recognizer
        // If browser has support for speech recognition
        // If our browser is able to have speech recognition
        if ("webkitSpeechRecognition" in window) {
            // Speech API JS
            recognition.current.onend = () => {
                recognition.current = new webkitSpeechRecognition()
                // Make it continous hearing
                recognition.current.continuous = true
                // Set it to our current language
                recognition.current.language = newLang

                // When the recognition hears something it sets our text to what we said and adds onto our full transcript
                recognition.current.onresult = (event) => {
                    const transcripting = event.results[event.results.length - 1][0].transcript
                    setText(transcripting)
                    console.log(event)
                    setFullTranscript(prev => prev + transcripting)
                }
            }
        } else {
            alert("Your browser doens't support voice recording")
        }
        if (isRecording) {
            recognition.current.start()
        }
    }
    // Only want this to change when the language changes

    const startRecording = () => {
        setFullTranscript("")
        setText("")
        setDoneRecording(false)
        setIsRecording(true)
        setSeconds(0)

        if (!recognition.current) {
            // Speech API JS
            recognition.current = new webkitSpeechRecognition()
            recognition.current.continuous = true
            recognition.current.language = lang

            recognition.current.onresult = (event) => {
                const transcripting = event.results[event.results.length - 1][0].transcript
                setText(transcripting)
                console.log(event)
                setFullTranscript(prev => prev + transcripting)
            }
        }
        recognition.current.start()
        timerRef.current = setInterval(() => {
            setSeconds(prev => prev + 1)
        }, 1000)
    }


    const stopRecording = () => {
        setIsRecording(false)
        clearInterval(timerRef.current)
        timerRef.current = null
        setSeconds(0)
        setText("")
        setDoneRecording(true)
        recognition.current.stop()

        return (
            fullTranscript
        )
    }

    const formatTime = (totalseconds) => {
        const hours = Math.floor(totalseconds / 3600)
        const minutes = Math.floor((totalseconds % 3600) / 60)
        const secs = totalseconds % 60
        // Adds 0 in the front if we don't have len 2
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    }


    function pause() {
        if (!isPaused) {
            recognition.current.stop()
            setIsPaused(true)
            clearInterval(timerRef.current)
            timerRef.current = null

        }
        else if (isPaused) {
            recognition.current.start()
            setIsPaused(false)
            timerRef.current = setInterval(() =>
                setSeconds(prev => prev + 1), 1000)
        }
    }
    const generateFlashcards = async () => {
        setDownTime(true)
        const response = await axios.post("http://127.0.0.1:8000/createflashcards",
            {
                transcription: fullTranscript,
                lang_from: lang,
                lang_to: lang_to,
                pos: pos,
                amount: amountOfCards,
                user_wants: userInput
            }
        )
        let flash = response.data.flashcards
        if (typeof flash === "string"){
            flash = JSON.parse(flash)
        }

        setFlashcards(prev =>[...prev, ...flash])
        setDownTime(false)

        /* Debug */
        console.log("flashcards:", flashcards)
        console.log("raw:", response.data.flashcards);
        console.log("typeof:", typeof JSON.parse(response.data.flashcards));
        console.log("isArray:", Array.isArray(response.data.flashcards));
        console.log("stringified:", JSON.stringify(response.data.flashcards));

        return response.data
    }

    return (
        <>
            <div className="literally-everything">
                <NavBar />
                <div>
                    <h1 className="catchphrase">
                        Every Word Counts — Capture It.
                    </h1>
                    <br />
                    <br />
                </div>
                <div className="translatingfromtranslatingtobuttons">
                    <div className="translatethatthangfrom">
                        <div className="textthingy1" >
                            Translating From {" "}
                        </div>
                        <br />
                        <select className="selectTab" onChange={(event) => {
                            setLang(event.target.value)
                            changeLanguage(event.target.value)
                        }}>
                            <option value="en-US"> English</option>
                            <option value="fr-FR"> French</option>
                            <option value="de-DE"> German</option>
                            <option value="ja-JP"> Japanese</option>
                            <option value="es-ES"> Spanish</option>
                        </select>
                    </div>

                    <div className="translatethatthangto">
                        <div className="textthingy2">
                            Translating To {" "}
                        </div>
                        <br />
                        <select className="selectTab" onChange={(event) => {
                            setLang_to(event.target.value)
                        }}>
                            <option value="en-US"> English</option>
                            <option value="fr-FR"> French</option>
                            <option value="de-DE"> German</option>
                            <option value="ja-JP"> Japanese</option>
                            <option value="es-ES"> Spanish</option>
                            <option value="it-IT"> Italian</option>
                            <option value="nl-NL"> Dutch</option>
                            <option value="pt-PT"> Portuguese</option>
                            <option value="el-GR"> Greek</option>
                        </select>
                    </div>
                </div>
                {/* Put your live transcription here*/}
                <div className = "text-in-time">
                    <div className = "true-texty">
                    {text}
                    </div>
                </div>
                <div className="Recording-Timer-Box">
                    <h2 className="Timer">
                        {formatTime(seconds)}
                    </h2>

                    {isRecording ? <button className="pause-button" onClick={pause}> {!isPaused ? "Pause" : "Resume"} </button> : null}
                    <button className={!isRecording ? "recorder-button" : "stop-button"}
                        onClick={() => !isRecording ? startRecording() : stopRecording()}>
                        {!isRecording ? "Start Recording" : "Stop Recording"}
                    </button>

                    {doneRecording ?
                        <>
                            <div className="topicstotest">
                                <div className="youreallyisthemanman">
                                    Topics to test
                                </div>
                            </div>
                            <span className="mygoodsirthisisthecontainer">
                                <div className="wordandinputthingystuff">
                                    <div className="amountcardstogenerate">
                                        <div className="thistheguyrighthere">
                                            # cards
                                        </div>
                                    </div>
                                    <input className="numberinputboxthing" type="number" min="1" placeholder="1" onChange={(event) => setAmountOfCards(event.target.value)} />
                                </div>
                                <select className="WhatPOSWouldulikemygoodsir" onChange={(event) => setPos(event.target.value)}>
                                    <option> Nouns</option>
                                    <option> Verbs </option>
                                    <option> Adjectives</option>
                                    <option> Adverbs </option>
                                    <option> Interjections </option>
                                    <option> Prepositions </option>
                                    <option> I want a mix!</option>
                                </select>

                            </span>
                            <textarea className="anymoredetailsgoodsir" placeholder="Write any additional details you want for you flashcards" onChange={(event) => {
                                setUserInput(event.target.value)
                            }} />
                            <button className="sendittotheaiforflashcards"
                                onClick={() => generateFlashcards()}
                                disabled={downTime}
                            >
                                Generate Flashcards
                            </button>
                        </>
                        : null}
                </div>
            </div>
        </>
    )
}