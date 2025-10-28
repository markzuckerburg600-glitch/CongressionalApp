import "./login.css"
import { Link } from "react-router-dom"
import Logo from "../../../public/Logo.png"
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
export function LoginPage(){

    const navigate = useNavigate()
    const [userName, setUserName] = useState("")
    const[password, setPassword] = useState("")
    
    useEffect(()=>{
    function EnterKeyDown(event){
        if (event.key=== "Enter")
        tryLogin()
     }
    // Everytime we do a keydown, we call enter key down func
    window.addEventListener("keydown", EnterKeyDown)
    return () => {
    window.removeEventListener("keydown", EnterKeyDown)
}
    }, [userName, password])
    
    const tryLogin = async () => {
    if (!userName || !password){
        return alert("You must have a username and password")
    }
    try{
        await axios.post("http://127.0.0.1:3000/users/login", {"username": userName,"password": password}) 
        navigate("/dashboard")
    } catch (error){
        alert(error.response.data)
        }
}
        return(
        <>
        <img src = {Logo} className = "logoimagething" onClick = {()=> navigate("/")}/>
            <div className ="sign-in-container">
                <div className = "sign-in-thing">
                    <div className = "sign-in-sign">
                        Log into LanguageLab
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
                            tryLogin()
                        }}>
                            Login
                        </button>
                        <Link to = "/signin">
                            <button className = "button-login">
                                New?  <span className = "smalldetaillol"> Sign up </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}