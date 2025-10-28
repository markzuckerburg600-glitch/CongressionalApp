import "./Flashcards.css"
import { CreateFlashCard } from "./SingleFlashCard"
import { NavBar } from "../../assets/Header"
import axios from "axios"

export function FlashCards({ flashcards, setFlashcards }) {
    
    return (
        <>
            <div className = {flashcards.length !== 0 ? "flashbody": "other"} >
            <NavBar/>
                <h1 className = "title"> Flashcards </h1>
                {/* Convert to object first */}
                {flashcards.map((word, index) => {
                    return(
                    /* Always return something in .map 
                    Each item in flashcards is a word
                    */
                     <CreateFlashCard 
                     key = {index} 
                     flashcards = {flashcards} 
                     index = {index} 
                     word = {word} 
                     setFlashcards={setFlashcards}/>
                    )
                })}
            </div>
        </>
    )
}