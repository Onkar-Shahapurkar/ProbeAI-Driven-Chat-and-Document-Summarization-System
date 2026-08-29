import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MessageSquare, Plus, Trash2 } from "lucide-react";

import api from "../services/api";

function ChatSidebar({ refreshKey }) {
  const [conversations, setConversations] = useState([]);
  const { conversationId } = useParams();
  const navigate = useNavigate();

  async function loadConversations() {
    try {
      const response = await api.get(
        "/api/conversations"
      );

      setConversations(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadConversations();
  }, [conversationId, refreshKey]);

  async function createNewChat() {
    try {
      const response = await api.post(
        "/api/conversations"
      );

      navigate(`/chat/${response.data.id}`);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteConversation(
    event,
    id
  ) {
    const confirmed = window.confirm(
    "Delete this conversation?"
    );

    if (!confirmed) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    try {
      await api.delete(
        `/api/conversations/${id}`
      );

      setConversations((previous) =>
        previous.filter(
          (conversation) =>
            conversation.id !== id
        )
      );

      if (conversationId === String(id)) {
        navigate("/chat");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <aside className="chat-history">

      <div className="chat-history-header">
        <span>Recent Chats</span>

        <button
          onClick={createNewChat}
          title="New Chat"
        >
          <Plus size={16} />
        </button>
      </div>

      <button
        className="history-new-chat"
        onClick={createNewChat}
      >
        <Plus size={15} />
        New Chat
      </button>

      <div className="conversation-list">

        {conversations.length === 0 ? (
          <div className="history-empty">
            <MessageSquare size={18} />
            <span>No conversations yet</span>
          </div>
        ) : (
          conversations.map((conversation) => (
            <Link
              key={conversation.id}
              to={`/chat/${conversation.id}`}
              className={`conversation-item ${
                String(conversation.id) ===
                String(conversationId)
                  ? "active"
                  : ""
              }`}
            >
              <MessageSquare size={15} />

              <span>
                {conversation.title ||
                  "New conversation"}
              </span>

              <button
                className="delete-conversation"
                onClick={(event) =>
                  deleteConversation(
                    event,
                    conversation.id
                  )
                }
              >
                <Trash2 size={14} />
              </button>
            </Link>
          ))
        )}

      </div>
    </aside>
  );
}

export default ChatSidebar;