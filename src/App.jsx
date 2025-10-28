import './App.css'
import { useState } from "react"
import { HomePage } from "./Pages/HomePage/HomePage"
import { RecordingPage } from './Pages/Record/RecordingPage'
import { FlashCards } from './Pages/FlashCards/FlashCards'
import { ChatMessages } from './Pages/Chatbot/ChatMessages'
import { SignInPage } from './Pages/SignIn/SignIn'
import { GetStarted } from './Pages/GetStarted/GetStarted'
import { LoginPage } from './Pages/Login/login'
import { Routes, Route } from "react-router-dom"
import { ChatInput } from './Pages/Chatbot/ChatInput'

import { ProtectedRoute } from "./ProtectedRoute"

function App() {

      const [chatMessages, setChatMessages]= useState([])
      const [isFetching, setIsFetching] = useState(false)
      const [flashcards, setFlashcards] = useState([])
  return (
    <>
  {/* Add protected routes on the restricted pages */}
    <Routes>
      <Route index element = {<GetStarted/>}></Route>
      <Route path = "signin" element = {<SignInPage/>}></Route>
      <Route path = "login" element = {<LoginPage/>}> </Route>
      <Route path = "dashboard" element = {<ProtectedRoute> <HomePage/></ProtectedRoute>}></Route>
      <Route path = "record" element = { 
        <ProtectedRoute>
        <RecordingPage flashcards = {flashcards} setFlashcards = {setFlashcards}/>
        </ProtectedRoute>
        }> </Route>
      <Route path = "flashcards" element = {
        <ProtectedRoute>
        <FlashCards flashcards= {flashcards} setFlashcards = {setFlashcards}/>
        </ProtectedRoute>
        }> </Route>
      <Route path = "chatbot" element = { 
    <ProtectedRoute>
        <> 
        <ChatMessages chatMessages = {chatMessages} isFetching = {isFetching}/><ChatInput setIsFetching = {setIsFetching} chatMessages={chatMessages} setChatMessages={setChatMessages}/> 
        </>
    </ProtectedRoute>
    }> </Route>
     </Routes>
    </>
  )
}

export default App
