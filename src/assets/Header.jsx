import "./Header.css"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export function NavBar(){
    const navigate = useNavigate()
    return(
        <>

        <nav>
            <ul>
                <li> <Link to = "/dashboard"> Home </Link> </li>
                <li> <Link to = "/record"> Record </Link></li>
                <li> <Link to = "/flashcards"> Flashcards </Link> </li>
                <li> <Link to = "/chatbot"> Chatbot </Link> </li>
                <li> <Link to = "/" > Logout</Link> </li>

            </ul>
        </nav>
        </>
    )
}