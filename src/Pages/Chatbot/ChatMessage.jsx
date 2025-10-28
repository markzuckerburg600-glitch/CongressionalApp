import RobotProfile from "../../../images/robotprofile.png"
import UserProfile from "../../../images/userimage.png"
import "./ChatMessage.css"
export function ChatMessage({ sender, message}){
    return(
        <>
        {/* The guard operator allows us to use if statements in the return
            Use terinary operater for updating text */}
          <div className = {sender === "user" ? "chat-message-user": "chat-message-robot"}>
            {sender === "robot" &&  <img className = "partho" src = {RobotProfile} height = "50" width = "50" /> }
            <div className = "chat-message-text">
              {
              message.split(" ").map((word, index)=> (
                word.includes(".com") ? <b key = {index}> {String(word + " ")}</b>:
                String(word + " ")
              ))}
            </div>
            {sender === "user" && <img className = "chris" src = {UserProfile} height = "50" width = "50" /> }
          </div>
        </>
    )
}