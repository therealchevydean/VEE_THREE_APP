import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { XCircleIcon, BotIcon, SendIcon } from './icons';
import { ChatMessage } from '../types';

interface AssistantModalProps {
  onClose: () => void;
}

const AssistantModal = ({ onClose }: AssistantModalProps) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const initChat = () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: `You are V3-CoPilot, a friendly and enthusiastic AI assistant for the V3 App. Your goal is to help users, answer their questions about the app, and encourage them. The app has features like Geomining (checking in on a map), Missions (completing tasks for MOBX points), a Vault (for MOBX balance and NFTs), a Leaderboard, and a Profile. Be concise and use emojis to be engaging.`,
          },
        });
        setChat(chatInstance);

        // Start with a welcome message
        setMessages([
          {
            role: 'model',
            parts: [{ text: "Hey there! I'm V3-CoPilot. 🚀 How can I help you navigate the V3 universe today?" }],
          },
        ]);
      } catch (error) {
        console.error("Failed to initialize AI Chat:", error);
        setMessages([
          {
            role: 'model',
            parts: [{ text: "Oops! I'm having a little trouble connecting right now. Please try again later." }],
          },
        ]);
      }
    };
    initChat();
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Add a placeholder for the model's response
    setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

    try {
      const response = await chat.sendMessageStream({ message: input });
      let text = '';
      for await (const chunk of response) {
        text += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', parts: [{ text }] };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMessage = { role: 'model', parts: [{ text: "I seem to be having technical difficulties. Please try again." }] };
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = errorMessage;
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, chat, isLoading]);

  const ChatBubble = ({ message }: { message: ChatMessage }) => {
    const isModel = message.role === 'model';
    const bubbleClass = isModel
      ? 'bg-v3-surface self-start'
      : 'bg-v3-primary self-end text-white';
    
    const content = message.parts.map(p => p.text).join("");

    return (
      <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${bubbleClass}`}>
        <p className="whitespace-pre-wrap">{content}{isModel && isLoading && messages[messages.length - 1] === message ? '...' : ''}</p>
      </div>
    );
  };


  return (
    <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-50 animate-fade-in-up" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-v3-bg rounded-t-2xl w-full max-w-2xl h-[80vh] border-t-2 border-v3-primary flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-v3-border flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold flex items-center">
            <BotIcon className="w-6 h-6 mr-2 text-v3-secondary" />
            V3-CoPilot
          </h2>
          <button onClick={onClose} className="text-v3-text-secondary hover:text-v3-text-primary" aria-label="Close chat">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="flex-grow p-4 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="flex flex-col">
              <ChatBubble message={msg} />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </main>
        <footer className="p-4 border-t border-v3-border flex-shrink-0">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-grow px-4 py-2 bg-v3-surface border border-v3-border rounded-full focus:outline-none focus:ring-2 focus:ring-v3-primary"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 flex-shrink-0 bg-v3-primary rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-v3-primary-hover"
              aria-label="Send message"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AssistantModal;