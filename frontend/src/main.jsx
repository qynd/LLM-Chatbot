// === FRONTEND (React - Enhanced UI) ===
// src/App.jsx
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { backend } from 'declarations/backend';
import botImg from '/bot.svg';
import userImg from '/user.svg';
import '/index.css';

const App = () => {
  const [chat, setChat] = useState([
    {
      system: { content: "I'm a sovereign AI agent living on the Internet Computer. Ask me anything." }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  const formatDate = (date) => {
    const h = '0' + date.getHours();
    const m = '0' + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
  };

  const askAgent = async (messages) => {
    try {
      const textsOnly = messages.map(m => m.user?.content || m.system?.content || '');
      const response = await backend.chat(textsOnly);
      setChat((prevChat) => {
        const newChat = [...prevChat];
        newChat.pop();
        newChat.push({ system: { content: response } });
        return newChat;
      });
    } catch (e) {
      console.log(e);
      setChat((prevChat) => {
        const newChat = [...prevChat];
        newChat.pop();
        return newChat;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      user: { content: inputValue }
    };
    const thinkingMessage = {
      system: { content: 'Thinking ...' }
    };
    setChat((prevChat) => [...prevChat, userMessage, thinkingMessage]);
    setInputValue('');
    setIsLoading(true);

    const messagesToSend = chat.slice(1).concat(userMessage);
    askAgent(messagesToSend);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 p-4">
      <div className="flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold">
          <span>💬 Sovereign AI Chat</span>
          <span className="text-sm font-light">Built on Internet Computer</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50" ref={chatBoxRef}>
          {chat.map((message, index) => {
            const isUser = 'user' in message;
            const img = isUser ? userImg : botImg;
            const name = isUser ? 'You' : 'AI';
            const text = isUser ? message.user.content : message.system.content;

            return (
              <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="mr-3 h-10 w-10 shrink-0 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }}></div>
                )}
                <div className={`max-w-[75%] p-4 rounded-2xl text-sm ${isUser ? 'bg-blue-600 text-white' : 'bg-white shadow-md text-gray-800'}`}>
                  <div className="mb-1 text-xs opacity-70 flex justify-between">
                    <span>{name}</span>
                    <span>{formatDate(new Date())}</span>
                  </div>
                  <div className="whitespace-pre-wrap break-words">{text}</div>
                </div>
                {isUser && (
                  <div className="ml-3 h-10 w-10 shrink-0 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }}></div>
                )}
              </div>
            );
          })}
        </div>

        <form className="flex border-t bg-white p-4" onSubmit={handleSubmit}>
          <input
            type="text"
            className="flex-1 rounded-l-full border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="rounded-r-full bg-blue-500 px-6 text-sm font-medium text-white hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
