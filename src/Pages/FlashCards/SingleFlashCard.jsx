import "./SingleFlashCard.css"
import { useState, useEffect } from "react"

export function CreateFlashCard({ index, flashcards, word, setFlashcards }) {
    const [key, setKey] = useState("")
    const [value, setValue] = useState("")
    const [changeKey, setChangeKey] = useState("")
    const [changeValue, setChangeValue] = useState("")
    const [flip, setFlip] = useState(false)

    useEffect(() => {
        setKey(Object.keys(word)[0])
        setValue(Object.values(word)[0])
    }, [])

    const changeFlashcard = () => {
        /* Delete the word */
        const updatedRecording = flashcards.map((word, i) => {
            return (i === index ? { [changeKey || key]: [changeValue || value] } : word)
        })

        setKey(changeKey)
        setValue(changeValue)
        setFlashcards(updatedRecording)
        setChangeKey("")
        setChangeValue("")
    }

    const deleteFlashcard = () => {
        /* Filter out the word we wanna change */
        const renewedFlash = flashcards.filter((word, i) => {
            return (i !== index)
        })
        /* Loop through all recordings and remove that specific recording */
        /* Link that to setFlashcards*/
        setFlashcards(renewedFlash)
    }

    return (
        <>
        <div className = "body">
            <div className="flashcard-container">
                <div className={`flashcard${flip ? "is-flipped": ""}`}>
                    <div className="front">
                        <p>
                            {key} 
                        </p>
                    </div>

                    <div className="back">
                        <p>
                            {value}
                        </p>
                    </div>
                </div>
                <button className = "flip-card" onClick = {()=>
                    setFlip(!flip)
                }> Flip</button>
            </div>

        <div className = "buttons-container">
            <div>
                Change Word:&nbsp;
            </div> 
            <input value={changeKey} onChange={(event) => {
                setChangeKey(event.target.value)
            }}  /> &nbsp;

            <div>
                Change Definition:&nbsp;
            </div>
            <input value={changeValue} onChange={(event) => {
                setChangeValue(event.target.value)
            }} /> &nbsp;
        </div>
        <br/>
            <button className = "changebuttons" onClick={() => {
                changeFlashcard()
            }}>
                Change Flashcard
            </button>
        <br/>
            <button className = "changebuttons" onClick={() => {
                deleteFlashcard()
            }}>
                Delete Flashcard
            </button>
        </div>
        </>
    )

}


