import ChatSidebar from "../components/ChatSidebar";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Sparkles,
  User,
  Plus,
} from "lucide-react";

import api from "../services/api";
import { getToken } from "../services/auth";

function Chat() {
  const { conversationId } = useParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const messagesEndRef = useRef(null);

  async function createNewChat() {
    try {
        const response = await api.post(
        "/api/conversations"
        );

        window.location.href =
        `/chat/${response.data.id}`;
    } catch (error) {
        console.error(
        "Failed to create conversation:",
        error
        );
    }
    }

//   useEffect(() => {
//   async function createConversation() {
//     try {
//       const response = await api.post("/api/conversations");

//       window.location.href = `/chat/${response.data.id}`;
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   if (!conversationId) {
//     createConversation();
//   }
// }, [conversationId]);

  useEffect(() => {
    async function loadConversation() {
      try {
        const response = await api.get(
          `/api/conversations/${conversationId}`
        );

        setMessages(response.data.messages);
      } catch (error) {
        console.error(error);
      }
    }

    if (conversationId) {
      loadConversation();
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage(event) {
    event.preventDefault();

    if (!input.trim() || !conversationId || loading) {
      return;
    }

    const userMessage = input.trim();

    setInput("");
    setLoading(true);

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/conversations/${conversationId}/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            role: "user",
            content: userMessage,
          }),
        }
      );

      setRefreshKey((value) => value + 1);

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantMessage = "";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: "",
        },
      ]);

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value);

        assistantMessage += chunk;

        setMessages((previous) => {
          const updated = [...previous];

          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantMessage,
          };

          return updated;
        });
      }
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-layout">
    <ChatSidebar refreshKey={refreshKey} />
    <div className="chat-page">

      <div className="chat-header">
        <div>
          <div className="chat-title">
            <Sparkles size={18} />
            <span>ProbeAI</span>
          </div>

          <p>Intelligent conversation</p>
        </div>

        <button 
          className="new-chat-button"
          onClick={createNewChat}
        >
          <Plus size={17} />
          New Chat
        </button>
      </div>

      <div className="chat-messages">
        {messages
            .filter((message) => message.content?.trim())
            .map((message, index) => (
            <div
                key={index}
                className={`message ${
                message.role === "user"
                    ? "user-message"
                    : "assistant-message"
                }`}
            >
                <div className="message-avatar">
                {message.role === "user" ? (
                    <User size={16} />
                ) : (
                    <Sparkles size={16} />
                )}
                </div>

                <div className="message-content">
                <span className="message-role">
                    {message.role === "user"
                    ? "You"
                    : "ProbeAI"}
                </span>

                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                </ReactMarkdown>
                </div>
            </div>
            ))}

        {messages.length === 0 && (
            <div className="chat-empty">
            <div className="empty-icon">
                <Sparkles size={28} />
            </div>

            <h1>
                How can I help
                <span> you today?</span>
            </h1>

            <div className="prompt-suggestions">
                <button
                onClick={() =>
                    setInput("Explain this concept in simple terms")
                }
                >
                Explain a concept
                </button>

                <button
                onClick={() =>
                    setInput("Summarize the key points of this topic")
                }
                >
                Summarize a topic
                </button>

                <button
                onClick={() =>
                    setInput("Help me brainstorm ideas for a project")
                }
                >
                Brainstorm ideas
                </button>

                <button
                onClick={() =>
                    setInput("Help me understand this code")
                }
                >
                Understand code
                </button>
            </div>

            <p>
                Ask questions, explore ideas, or
                work with your documents.
            </p>
            </div>
        )}

        <div ref={messagesEndRef} />
        </div>

      <div className="chat-input-area">

        <form
          className="chat-input-wrapper"
          onSubmit={sendMessage}
        >
          <textarea
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            placeholder="Ask anything..."
            rows={1}
            disabled={loading}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();
                sendMessage(event);
              }
            }}
          />

          <button
            type="submit"
            disabled={
              loading ||
              !input.trim() ||
              !conversationId
            }
          >
            <Send size={18} />
          </button>
        </form>

        <span className="input-hint">
          Enter to send · Shift + Enter for new line
        </span>

      </div>

    </div>
    </div>
  );
}

export default Chat;