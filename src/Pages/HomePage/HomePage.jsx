import { useQuery, useMutation, useQueryClient, useQueries } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import Select from "react-select"
import axios from 'axios'
import { NavBar } from "../../assets/Header"
// import arrowFavicon from "../../../images/arrowfavicon.png"
import "./HomePage.css"
export function HomePage() {

    function wait(duration) {
        return new Promise(resolve => setTimeout(resolve, duration))
    }

    function getFullPOS(posTag) {
        const posMap = {
            ADJ: "Adjective",
            ADP: "Adposition",
            ADV: "Adverb",
            AUX: "Auxiliary Verb",
            CCONJ: "Coordinating Conjunction",
            DET: "Determiner",
            INTJ: "Interjection",
            NOUN: "Noun",
            NUM: "Numeral",
            PART: "Particle",
            PRON: "Pronoun",
            PROPN: "Proper Noun",
            PUNCT: "Punctuation",
            SCONJ: "Subordinating Conjunction",
            SYM: "Symbol",
            VERB: "Verb",
            X: "Other"
        }

        return posMap[posTag] || posTag // fallback if not found
    }

    const [inputText, setInputText] = useState("")
    const [lang, setLang] = useState("en")
    const [translatedText, setTranslatedText] = useState("")
    const [sourceLang, setSourceLang] = useState("en")
    const [wordDefinitions, setWordDefinitions] = useState([])
    const [synDefinitions, setSynDefinitions] = useState([])

    const translatedWords = translatedText.split(/\s+/).filter(Boolean)
    const cleanedWords = translatedText.split(/\s+/).map((word) => word.replace(/^\.+|\.+$/g, ""))
    /* Do useEffect so there's not 1 million rerenders */
    useEffect(() => {
        let active = false
        async function delayedTranslate() {
            if (!inputText.trim()) return
            await wait(300)
            if (!active) {
                getTranslation.mutate()
            }
        }
        delayedTranslate()
        return () => {
            active = true
        }
    }, [inputText, lang])

    useEffect(() => {
        if (!translatedText) return
        let active = false
        async function delayedTranslate() {
            if (!active) {
                fetchAllDefinitions()
            }
        }
        async function fetchAllDefinitions() {
            /* Array of promises for each word in our text
                defs is an array of definitions
            */
            const result = await Promise.all(cleanedWords.map((word) =>
                fetchDefinition(word))
            )

            const defs = result.map(r => r.wordDef)
            const synonyms = result.map(r => r.synonyms)

            setWordDefinitions(defs)
            setSynDefinitions(synonyms)
        }
        fetchAllDefinitions()
        return () => { active = true }
    }, [translatedText, lang])

    async function fetchDefinition(word) {
        try {
            const result = await axios.post("http://127.0.0.1:8000/defineword", { word: word, lang: sourceLang });
            const { worddef, synonyms } = JSON.parse(result.data.definition)
            console.log("HI SIR ", worddef)
            if (!result || !result.data) {
                return { wordDef: null, synonyms: [] }
            }
            console.log("WORDDEF ", worddef, synonyms)
            return { wordDef: worddef, synonyms: synonyms }
        } catch (err) {
            console.error(err)
            return { wordDef: null, synonyms: [] }
        }
    }

    const sendText = async () => {
        const response = await axios.post("http://127.0.0.1:8000/translate", {
            text: inputText,
            target: lang,
            source: sourceLang
        })
        return (
            response.data.translated
        )
    }

    const getTranslation = useMutation({
        mutationFn: sendText,
        onSuccess: (data) => setTranslatedText(data)
    }
    )

    async function getDefinition(word, sentence) {
        const response = await axios.post("http://127.0.0.1:8000/worddefinition", {
            word: word,
            target: sourceLang,
            source: lang,
            sentence: sentence
        })
        console.log(response.data.wordTranslation)
        return response.data
    }

    const definitionQueries = useQueries({
        /* Get the definition of every word using split and map */
        queries: translatedText.split(" ").map((translatedWord, index) => ({
            queryKey: [translatedWord, index],
            queryFn: () => getDefinition(translatedWord, translatedText),
            // We keep translating if we have a translated word and our len text is > 0
            enabled: !!translatedWord && translatedText.length > 0
        }))
    })

    function getDiagram(svgString) {
        if (!svgString) return null
        return (
            <div
                dangerouslySetInnerHTML={{ __html: svgString }}
            >
            </div>
        )
    }


    return (
        <>
            <NavBar />
            <div className="Iwannamakethisbackgroundcool">
                <h1 className="intro-text">
                    LanguageLab: Translate. Define. Master. Every. Word.
                </h1>
                <div className="straighten-that-translation-out">
                    <div className="translation-box">
                        <div className="Translating-From">
                            Translating From {" "}
                        </div>
                        <div className="select-language-container">
                            <select className="selectTab" onChange={(event) => {
                                setSourceLang(event.target.value)
                            }}>
                                <option value="en"> English</option>
                                <option value="fr"> French</option>
                                <option value="de"> German</option>
                                <option value="ja"> Japanese</option>
                                <option value="es"> Spanish</option>
                                <option value="it"> Italian</option>
                                <option value="nl"> Dutch</option>
                                <option value="pt"> Portuguese</option>
                                <option value="el"> Greek</option>
                            </select>
                        </div>
                    </div>

                    <div className="translation-box">
                        <div className="Translating-To">
                            Translating To {" "}
                        </div>
                        <div className="select-language-container">
                            <select className="selectTab" onChange={(event) => {
                                setLang(event.target.value)
                            }}>
                                <option value="en"> English</option>
                                <option value="fr"> French</option>
                                <option value="de"> German</option>
                                <option value="ja"> Japanese</option>
                                <option value="es"> Spanish</option>
                                <option value="it"> Italian</option>
                                <option value="nl"> Dutch</option>
                                <option value="pt"> Portuguese</option>
                                <option value="el"> Greek</option>
                            </select>
                        </div>

                    </div>
                </div>
                <br />
                <div className="box-for-user-translation-input">
                    <br />
                    <textarea className="user-translation-input" value={inputText}
                        onChange={(event) => {
                            setInputText(event.target.value)
                        }}
                        placeholder="Enter your text here">

                    </textarea>
                </div>

                <div className="translated-item">
                    <div className="translated-text-textbox">

                        {/* Loop through query we made to access the translation */}

                        {definitionQueries.map((query, index) => {
                            if (!query.data) return null
                            {/* Removes leading or trailing whitespace*/ }
                            return (
                                <>
                                    <div className="word-pair">
                                        {/* .wordTranslation comes from out translator.py property we set up */}
                                        <div className="wordcontainer">
                                            <div className={"two-word-container"}>
                                                {console.log("The TRANSLATION " + query.data?.wordTranslation)}
                                                <span className="worddefinition"> Definition: {query.data?.wordTranslation || ""}</span>
                                                <br />
                                                <span className="wordpos"> POS: {getFullPOS(query.data?.tokens[0].pos)} </span>
                                                <br />
                                                <span className="actualdefinition"> Definition: {wordDefinitions[index] || "Loading definition..."}</span>
                                                <br />
                                                <span className="synonyms-word"> Synonyms: {synDefinitions[index]?.join(": ") || "Loading synonyms..."}</span>
                                            </div>

                                            <span className="translatedword" key={index + translatedWords[index]} >
                                                {translatedText.length === 0 ? "Translation goes here..." : ""}
                                                {translatedWords[index]}
                                            </span>
                                        </div>
                                        <div>

                                        </div>
                                    </div>
                                </>
                            )

                        })}
                    </div>
                </div>
            </div>
            <br />
            <div className="wordboxthingy">
                <div className="mainphraseyo"> </div>
                If you want to generate multiple sentences, use periods to end the sentence.<br /> <br />
                <div className="mainphraseyo"> A few terms to get familiar with: <br /> </div>
                PROPN = proper noun → names of people, places, organizations <br />
                VERB = verb → actions, states, or occurrences <br />
                NOUN = noun → general objects, people, places <br />
                PRON = pronoun → words replacing nouns (he, she, it) <br />
                ADJ = adjective → describes nouns <br />
                ADV = adverb → modifies verbs, adjectives, or other adverbs <br />
                DET = determiner → articles, demonstratives (the, a, this) <br />
                ADP = adposition → prepositions and postpositions (in, on, under) <br />
                CONJ = coordinating conjunction → links words/clauses (and, or, but) <br />
                SCONJ = subordinating conjunction → introduces clauses (because, although) <br />
                NUM = numeral → numbers (one, two, first) <br />
                PART = particle → small functional words (not, to, up) <br />
                INTJ = interjection → exclamations (oh!, wow!) <br />
                X = other/unknown → words not classified into other categories <br />
                PUNCT = punctuation → marks like ., !, ?, ,
                SYM = symbol → symbols ($, %, @)
            </div>

            <div className="word-diagram-container">
                <div className="word-diagram">
                    <div className="gethimoverheresir">
                        {<span className="actualdiagram">{getDiagram(definitionQueries[0]?.data?.html)}</span>}
                    </div>
                </div>
            </div>
        </>
    )
} 