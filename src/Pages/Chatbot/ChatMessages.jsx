import { ChatMessage } from "./ChatMessage"
import { useRef, useEffect } from "react"
import { NavBar } from "../../assets/Header"
import "./ChatMessages.css"

export function ChatMessages({ chatMessages, isFetching }) {

    // Save an html element from a component
    const chatMessagesRef = useRef(null)

        // useEffect lets you run code after component is created or updated
        // Only runs after chatMessages updates
        useEffect(() => {
          const containerElem = chatMessagesRef.current
          if (containerElem){
            containerElem.scrollTop = containerElem.scrollHeight
          }
        }, [chatMessages])
        // We use React.useState so that if we update the data
        // It also updates in the html 
        return (
          <>
          <NavBar/>
          <div className = "chat-messages-container"
          // Now chatMessagesRef knows that ur refering to this html div
            ref = {chatMessagesRef}
          >
        {chatMessages.map((chatMessage) => {
        return (
                <>
                <ChatMessage
                message = {chatMessage.message}
                sender = {chatMessage.sender}
                key = {chatMessage.id}
                />
                </>
              )
        })}
            {isFetching?
            <>
            
             <p className = "hello"><span className = "hi">G</span><span className = "hi">E</span><span className = "hi">N</span><span className = "hi">E</span><span className = "hi">R</span><span className = "hi">A</span><span className = "hi">T</span><span className = "hi">I</span><span className = "hi">N</span><span className = "hi">G</span><span className = "hi">!</span></p>
            </>
            : null}
          </div>
        </>
        )
      }
