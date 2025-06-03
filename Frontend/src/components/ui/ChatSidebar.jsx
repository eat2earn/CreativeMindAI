import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { AppContext } from "../../context/AppContext";

export function ChatSidebar({ isOpen, onClose, onNewChat, onSelectChat, onDeleteChat }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const { user, chatHistory } = useContext(AppContext);

  const handleDeleteClick = (e, chatId) => {
    e.stopPropagation();
    setShowDeleteConfirm(chatId);
  };

  const handleDeleteConfirm = async (e, chatId) => {
    e.stopPropagation();
    await onDeleteChat(chatId);
    setShowDeleteConfirm(null);
  };

  const handleDeleteCancel = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-800 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">ThinkAI Chat</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* User Section */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-white font-medium">{user?.name || "User"}</p>
                  <p className="text-sm text-gray-400">{user?.email || ""}</p>
                </div>
              </div>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
              <button
                onClick={onNewChat}
                className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Chat</span>
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Chats</h3>
              <div className="space-y-2">
                {chatHistory?.length > 0 ? (
                  chatHistory.map((chat) => (
                    <div
                      key={chat._id}
                      className="group relative"
                    >
                      <button
                        onClick={() => onSelectChat(chat)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white flex items-center justify-between"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{chat.title || "New Chat"}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(chat.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteClick(e, chat._id)}
                          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded-lg transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </button>

                      {/* Delete Confirmation */}
                      {showDeleteConfirm === chat._id && (
                        <div 
                          className="absolute right-0 top-0 mt-1 mr-1 bg-gray-800 rounded-lg shadow-lg p-2 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="text-sm text-gray-300 mb-2">Delete this chat?</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => handleDeleteConfirm(e, chat._id)}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                            <button
                              onClick={handleDeleteCancel}
                              className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No chat history</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 