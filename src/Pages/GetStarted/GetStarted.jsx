// When keeping styles local, use module and import styles
import styles from "./AnimatedHeader.module.css"
import Logo from "../../../images/Logo2.png"
import video1 from "../../../Videos/video1.mp4"
import video2 from "../../../Videos/video2.mp4"
import video3 from "../../../Videos/video3.mp4"
import video4 from "../../../Videos/video4.mp4"
import video5 from "../../../Videos/video5.mp4"
import coolvid from "../../../Videos/coolvid.mp4"
import { useState, useEffect } from "react"

import { Link } from "react-router-dom"
export function GetStarted() {
    const [played, setPlayed] = useState(false)
    useEffect(() => {
        setPlayed(true)
    }, [])

    return (
        <>
            <div className={styles.overallback}>
                <img className={styles.hellothere} src={Logo} />
                <video className={styles.coolvideolol} autoPlay muted loop playsInline src={coolvid} type="video/mp4" />
                <div className={styles.storingdaticonandtext}>
                    <p className={`${styles.text} ${played ? styles.animate : ""}`}>
                        Words won't wait - neither should you
                    </p>
                </div>
                <div className={styles.putliterallyeverythinghere}>
                    {/* Put styles all over here to make it local */}

                    <div className={styles.backgroundthingy}>
                        <div className={styles.textthingthing}>
                            <div className={styles.buttoncontainer}>
                                <Link to="/signin">
                                    <button className={`${styles.signinbutton} ${played ? styles.animate : ""}`}>
                                        Enter
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                                        <div className={`${styles.coolstuffcontainer} ${played ? styles.animate : ""}`}>
                        <div className={styles.particle}>
                            Discover
                            <br />
                            <span className={styles.particlet}>
                                <br />
                                By mastering words and phrases through precise, word for word translation.
                            </span>

                             <span className={styles.particlet}>
                                <video className={styles.video1} src={video1} autoPlay muted loop playsInline> </video>
                            </span>
                        </div>

                        <div className={styles.cells}>
                            Build
                            <br />
                            <span className={styles.particlete}>
                                <br />
                                Textmaps to HIGHLIGHT relationships between words in a sentence.
                            </span>
                            <span className={styles.particlete}>
                                <video className={styles.video2} src={video2} autoPlay muted loop playsInline> </video>
                            </span>
                        </div>
                        <div className={styles.jelly}>
                            Create
                            <br />
                            <span className={styles.particletex}>
                                <br />
                                Flashcards to handle your studying needs through voice recordings.
                            </span>
                            <span className={styles.particletex}>
                                <video className={styles.video2} src={video3} autoPlay muted loop playsInline> </video>
                            </span>
                        </div>
                        <div className={styles.blobbs}>
                            Combine
                            <br />
                            <span className={styles.particletext}>
                                <br />
                                Forces with <br />our custom chatbot to answer any of your needs.
                            </span>
                            <span className={styles.particletext}>
                                <video className={styles.video2} src={video4} autoPlay muted loop playsInline> </video>
                            </span>
                        </div>
                        <div className={styles.chase}>
                            Apply
                            <br />
                            <span className={styles.particletexty}>
                                <br />
                                By transforming your language to real-world fluency
                            </span>
                            <span className={styles.particletexty}>
                                <video className={styles.video2} src={video5} autoPlay muted loop playsInline> </video>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}