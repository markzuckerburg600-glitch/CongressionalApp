import { useState, useRef } from 'react'
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import "./ChatInput.css"
export function ChatInput({ chatMessages, setChatMessages, setIsFetching}){
        const [inputText, setInputText] = useState("")
        const [disabled, setDisabled] = useState(false)

        const getAIResponse = async (inputText) => {
            const response = await axios.post("http://127.0.0.1:8000/askAI", { question: inputText })
                return response.data.chatresponse
            }

        async function sendMessage(){
          setDisabled(true)
          const newChatMessages = ([
                // ... makes a copy of our array and our message is what we typed into the input
                // Updates our list of chat messages
                  ...chatMessages,
                  {
                    message: inputText,
                    sender: "user",
                    id: chatMessages.length +1 
                  }
                ])
                setInputText("")
              setChatMessages(newChatMessages)
              setIsFetching(true)
            const response = await getAIResponse(inputText)
            setIsFetching(false)
                setChatMessages([
                // Updates our list of chat messages but for the robot
                  ...newChatMessages,
                  {
                    message: response,
                    sender: "robot",
                    id: chatMessages.length + 1
                  }
                ])
                setDisabled(false)
              }
              function EnterKeyDown(event){
                if (event.key=== "Enter")
                sendMessage()
              }
        return (
          /* This is a fragment, works like a div but you dont create a extra div*/
          <div className = "chatinputcontainer">
            <input
            placeholder = "Ready when you are" 
            size = "50" 
            onChange = {(event) => setInputText(event.target.value)}
            value = {inputText}
            className = "input"
            onKeyDown = {!disabled ? EnterKeyDown : null}
            />
            <button 
            className = "send-button"
            onClick = {!disabled ? sendMessage : null}
            disabled = {disabled}
            > 
              Send 
            </button>
          </div>
        )
      }

