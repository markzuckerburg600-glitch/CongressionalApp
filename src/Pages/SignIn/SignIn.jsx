import "./SignIn.css"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import Logo from "../../../public/Logo.png"
import { useNavigate } from "react-router-dom"

export function SignInPage(){
    const [userName, setUserName] = useState("")
    const[password, setPassword] = useState("")
    const navigate = useNavigate()
    useEffect(()=>{
    function EnterKeyDown(event){
        if (event.key=== "Enter")
        postInfo()
     }
    // Everytime we do a keydown, we call enter key down func
    window.addEventListener("keydown", EnterKeyDown)
    return () => {
    window.removeEventListener("keydown", EnterKeyDown)
}
    }, [userName, password])

    const postInfo = async () => {
    if (!userName || !password){
        return alert("You must have a username and password")
    }
    try{
        const res = await axios.post("http://127.0.0.1:3000/users", {"username": userName,"password": password})
        // store dat token from the backend 
        localStorage.setItem("token", res.data.token)

        navigate("/dashboard")
    } catch (error){
        console.log(error)
        alert("Username is taken")
        }
}
    return(
        <>
        <img src = {Logo} className = "logoimagething" onClick = {()=> navigate("/")}/>
            <div className ="sign-in-container">
                <div className = "sign-in-thing">
                    <div className = "sign-in-sign">
                        Sign In
                    </div>
                    <div className = "two-input-containers">
                        <div className = "two-input">
                            <div className = "detail1">
                            Username
                            </div>
                    <input className = "sign-in-box" type="text" placeholder = "Username" required onChange = {(event)=>{
                        setUserName(event.target.value)
                    }}/>
                    <br/> <br/>
                        <div className= "detail2">
                        Password
                        </div>
                    <input className = "password-box" placeholder = "Password" type="password" required onChange = {(event)=>{
                        setPassword(event.target.value)
                    }}/>
                        </div>
                        <button className = "sign-in-button-click" onClick = {()=>{
                            postInfo()
                        }}>
                            Sign In
                        </button>
                        <Link to = "/login">
                            <button className = "button-login">
                                Already have a LanguageLab account? <span className = "smalldetaillol">Login here </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}