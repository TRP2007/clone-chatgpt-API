import axios from "axios"
import { useState } from "react"
import "./App.css"

function App() {
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!prompt.trim() || loading) return

    const currentPrompt = prompt.trim()

    const userMessage = {
      role: "user",
      content: currentPrompt,
    }

    const oldMessages = [...messages]

    setMessages([...oldMessages, userMessage])
    setPrompt("")
    setLoading(true)

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/send-prompt",
        {
          text: currentPrompt,
          history: oldMessages,
        }
      )

      const aiMessage = {
        role: "model",
        content: res.data.response,
      }

      setMessages([...oldMessages, userMessage, aiMessage])
    } catch (error) {
      console.error(error)

      setMessages([
        ...oldMessages,
        userMessage,
        {
          role: "model",
          content:
            "Oops 😭 something went wrong. Check your backend and try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleClick()
    }
  }

  function newChat() {
    setMessages([])
    setPrompt("")
  }

  function usePrompt(text) {
    setPrompt(text)
  }

  return (
    <div className="app">

      {/* top navigation */}
      <nav className="navbar">

        <div className="brand">
          <div className="brand-logo">✦</div>

          <div>
            <h2>VibeAI</h2>
            <span>your lil' AI buddy</span>
          </div>
        </div>

        <div className="nav-right">

          <div className="online-pill">
            <span className="online-dot"></span>
            brain online
          </div>

          <button className="new-chat-btn" onClick={newChat}>
            + new chat
          </button>

        </div>

      </nav>


      {/* main chat area */}
      <main className="chat-area">

        {messages.length === 0 ? (

          <section className="hero">

            <div className="hero-glow"></div>

            <div className="hero-icon">
              ✦
            </div>

            <p className="mini-label">
              ✨ welcome to my little AI corner
            </p>

            <h1>
              what's on your
              <span> mind?</span>
            </h1>

            <p className="hero-subtitle">
              Ask stuff. Build stuff. Break stuff.
              <br />
              We figure it out together.
            </p>


            <div className="prompt-grid">

              <button
                onClick={() =>
                  usePrompt("Explain artificial intelligence like I'm 10")
                }
              >
                <span>🧠</span>
                explain AI
              </button>

              <button
                onClick={() =>
                  usePrompt("Write a C++ program for binary search")
                }
              >
                <span>💻</span>
                write some code
              </button>

              <button
                onClick={() =>
                  usePrompt("Give me a unique project idea for my resume")
                }
              >
                <span>🚀</span>
                project ideas
              </button>

              <button
                onClick={() =>
                  usePrompt("Help me prepare for a technical interview")
                }
              >
                <span>🎯</span>
                prep mode
              </button>

            </div>

          </section>

        ) : (

          <section className="messages">

            {messages.map((message, index) => (

              <div
                className={`message ${
                  message.role === "user" ? "user-message" : "ai-message"
                }`}
                key={index}
              >

                <div
                  className={`avatar ${
                    message.role === "user" ? "user-avatar" : "ai-avatar"
                  }`}
                >
                  {message.role === "user" ? "T" : "✦"}
                </div>


                <div className="message-body">

                  <div className="message-top">
                    <span className="message-name">
                      {message.role === "user" ? "you" : "VibeAI"}
                    </span>

                    {message.role === "model" && (
                      <span className="ai-tag">
                        AI
                      </span>
                    )}
                  </div>

                  <div className="message-text">
                    {message.content}
                  </div>

                </div>

              </div>

            ))}


            {loading && (

              <div className="message ai-message">

                <div className="avatar ai-avatar">
                  ✦
                </div>

                <div className="message-body">

                  <div className="message-top">
                    <span className="message-name">
                      VibeAI
                    </span>

                    <span className="ai-tag">
                      thinking...
                    </span>
                  </div>

                  <div className="thinking">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                </div>

              </div>

            )}

          </section>

        )}

      </main>


      {/* input section */}
      <footer className="composer-section">

        <div className="composer">

          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="drop your question here...bro"
            rows="1"
            disabled={loading}
          />

          <button
            className="send-btn"
            onClick={handleClick}
            disabled={!prompt.trim() || loading}
          >
            {loading ? "..." : "↑"}
          </button>

        </div>


        <div className="composer-bottom">

          <span>
            enter ↵ to send
          </span>

          <span>
            built with React + FastAPI + Gemini
          </span>

        </div>

      </footer>

    </div>
  )
}

export default App