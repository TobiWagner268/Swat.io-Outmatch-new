import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { generateAnswer } from '../services/geminiService';
import { ChatMessage } from '../types';

interface Props {
  competitorName: string;
  contextData: string;
}

export const AIChatOverlay: React.FC<Props> = ({ competitorName, contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset chat when competitor changes
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: `Hallo! Ich bin dein Battle-Card Assistant für ${competitorName}. Hast du Fragen zu Schwächen oder brauchst du Argumente?`,
        timestamp: new Date()
      }
    ]);
  }, [competitorName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Pass the dynamic context to the service
    const answer = await generateAnswer(userMsg.text, contextData);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: answer,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-[#2B9CDA] hover:bg-[#18638B] text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center gap-2 border-2 border-[#18638B]/10"
        >
          <Bot size={24} />
          <span className="font-bold hidden md:inline">Ask about {competitorName}</span>
          <span className="md:hidden">Ask AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl z-50 flex flex-col border border-[#DAE0E7] animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-[#0C3146] text-white p-4 rounded-t-xl flex justify-between items-center border-b-4 border-[#2B9CDA]">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-[#2B9CDA] rounded text-white">
                <Bot size={18} />
              </div>
              <div className="flex flex-col">
                 <h3 className="font-bold text-sm">Swat.io Sales Bot</h3>
                 <span className="text-xs text-[#86C7EA]">Focus: {competitorName}</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-[#2B9CDA] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#F3F5F7] space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#2B9CDA] text-white rounded-br-none font-medium'
                      : 'bg-white text-[#405063] border border-[#DAE0E7] rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg border border-[#DAE0E7] shadow-sm">
                  <Loader2 className="animate-spin text-[#2B9CDA]" size={16} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-[#DAE0E7] rounded-b-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={`Ask about ${competitorName}...`}
                className="flex-1 px-3 py-2 border border-[#DAE0E7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9CDA] text-sm text-[#0C3146]"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-[#0C3146] hover:bg-[#063146] disabled:bg-[#61768E] text-white p-2 rounded-lg transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};