import React, { useState, useEffect, useContext } from "react";
import { cn } from "../../lib/utils";
import { ChatSidebar } from "./ChatSidebar";
import { AppContext } from "../../context/AppContext";

export function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const {
    chatHistory,
    currentChat,
    isChatLoading,
    sendChatMessage,
    deleteChat,
    startNewChat,
    selectChat,
    fetchChatHistory
  } = useContext(AppContext);

  // Update messages when current chat changes
  useEffect(() => {
    if (currentChat) {
      setMessages(currentChat.messages || []);
    } else {
      setMessages([]);
    }
  }, [currentChat]);

  const handleNewChat = () => {
    startNewChat();
    setIsSidebarOpen(false);
  };

  const handleSelectChat = (chat) => {
    selectChat(chat);
    setIsSidebarOpen(false);
  };

  const handleDeleteChat = async (chatId) => {
    await deleteChat(chatId);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    const response = await sendChatMessage(newMessages, currentChat?._id);
    
    if (response.success) {
      setMessages([...newMessages, response.message]);
    }
  };

  return (
    <>
      {/* Logo and Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-gray-900/50 hover:bg-gray-900/80 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-white"
          viewBox="0 0 512 512"
          fill="currentColor"
        >
          <path d="m0 0 2.479 6.973L14.916-28C18.946-39.331 34.97-39.331 39-28l20.304 57.095-50.346 30-43.389-30L-24.084 0C-20.054-11.331-4.03-11.331 0 0" transform="translate(249.473 332.17)" fill="#b9f0ff"/>
          <path d="m0 0 42.182-118.617c4.414-12.412 21.967-12.412 26.381 0L110.745 0Z" transform="translate(91.738 148.876)" fill="#b9f0ff"/>
          <path d="M0 0c4.03-11.331 20.054-11.331 24.084 0l2.479 6.973L39-28c4.03-11.331 20.054-11.331 24.084 0L75.81 7.785 80-4c4.03-11.331 20.054-11.331 24.084 0l17.958 50.502H-16.537Z" transform="translate(205.39 43.998)" fill="#b9f0ff"/>
          <path d="M0 0c4.029-11.331 20.054-11.331 24.083 0l20.305 57.095h-64.693Z" transform="translate(359.39 60.17)" fill="#b9f0ff"/>
          <path d="m0 0 20.305 57.095h-64.693L-24.083 0C-20.054-11.331-4.029-11.331 0 0" transform="translate(391.473 282.17)" fill="#b9f0ff"/>
          <path d="M0 0c23.171 0 44.922-8.946 61.247-25.192 26.282-26.155 68.795-26.153 95.046.263 26.124 26.287 26.004 68.94-.265 95.079-42.676 42.47-98.789 64.216-156.033 64.216l-86.347-41V-82.219c.855 20.808 9.298 41.303 25.098 57.025C-44.926-8.947-23.172 0 0 0" transform="translate(263.986 370.134)" fill="#7ce3ff"/>
          <path d="M0 0c-26.243 26.407-68.755 26.424-95.044.266-33.786-33.621-88.716-33.62-122.502 0-15.87 15.791-24.145 35.986-25.091 56.389V-125.18l86.342-34.124c59 0 114.412 22.808 156.03 64.223C26.005-68.939 26.124-26.287 0 0" transform="translate(420.278 223.804)" fill="#7ce3ff"/>
          <path d="M0 0c.818 77.845 29.586 155.452 86.347 216.585-123.649 0-220.84-99.817-220.843-219.994 0-58.867 23.018-114.192 64.814-155.782 41.62-41.415 97.034-64.224 156.031-64.224C29.74-162.447.973-85.091.007-7.456A85.436 85.436 0 0 0 0 0" transform="translate(177.634 287.915)" fill="#1cbbea"/>
        </svg>
      </button>

      {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        chatHistory={chatHistory}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main Chat Interface */}
      <div className="z-20 text-center px-4 w-full max-w-3xl mx-auto">
        {messages.length === 0 && (
          <>
            <h1 className={cn("text-4xl md:text-6xl font-bold text-white mb-4")}>
              ThinkAI Assistant
            </h1>
            <p className="mb-8 text-neutral-300 text-sm md:text-lg">
              Powered by CreativeMindAI 0.1
            </p>
          </>
        )}
        
        <div className="bg-white/10 rounded-xl p-4 shadow-lg mb-4 max-h-[60vh] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-neutral-400 text-center py-8">
              Start a conversation by typing a message below
            </div>
          ) : (
            messages.map((msg, i) => (
              <div 
                key={i} 
                className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}
              >
                <div 
                  className={`inline-block rounded-lg px-4 py-2 ${
                    msg.role === "user" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {isChatLoading && (
            <div className="text-left">
              <div className="inline-block bg-gray-700 text-gray-100 rounded-lg px-4 py-2">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            className="flex-1 px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isChatLoading}
          />
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg font-medium ${
              isChatLoading 
                ? "bg-gray-600 text-gray-300 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={isChatLoading}
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
} 