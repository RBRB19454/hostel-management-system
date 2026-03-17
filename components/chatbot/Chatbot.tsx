import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, UserCircleIcon, CpuChipIcon } from '@heroicons/react/24/solid';
import { isChatbotEnabled, sendMessageToChat } from '../../services/geminiService.ts';

interface Message {
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [chatbotEnabled, setChatbotEnabled] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        isChatbotEnabled()
            .then(enabled => {
                setChatbotEnabled(enabled);
                if (enabled) {
                    setMessages([{ sender: 'bot', text: 'Hello! How can I help you with hostel-related queries today?', timestamp: new Date() }]);
                }
            })
            .catch(() => {
                setError("Could not verify AI Assistant status.");
                setChatbotEnabled(false);
            });
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);
    
    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        
        const userMessage: Message = { 
            sender: 'user', 
            text: input + " (Answer in same language)", 
            timestamp: new Date() 
        };

        try {
            const stream = await sendMessageToChat(userMessage.text, messages);
            if (!stream) throw new Error("Could not get stream from server.");

            setIsLoading(false); // Hide typing indicator, start streaming
            const reader = stream.getReader();
            const decoder = new TextDecoder();
            
            setMessages(prev => [...prev, { sender: 'bot', text: '', timestamp: new Date() }]);
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.sender === 'bot') {
                       lastMessage.text += chunk;
                    }
                    return newMessages;
                });
            }

        } catch (error) {
            console.error(error);
             setMessages(prev => {
                const newMessages = [...prev];
                const errorText = 'Sorry, I am having trouble connecting. Please try again later.';
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage?.sender === 'bot' && lastMessage?.text === '') {
                    lastMessage.text = errorText;
                } else {
                    newMessages.push({ sender: 'bot', text: errorText, timestamp: new Date() });
                }
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!chatbotEnabled) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 p-4">
                <p>{error || "The AI Assistant is currently unavailable."}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                        {msg.sender === 'bot' && <div className="flex-shrink-0"><CpuChipIcon className="h-8 w-8 text-gray-400" /></div>}
                        <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                             <div className={`px-4 py-2 rounded-2xl max-w-md break-words ${msg.sender === 'user' ? 'bg-[#14654d] text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                {msg.text.split('\n').map((line, i) => <p key={i} className="whitespace-pre-wrap">{line}</p>)}
                            </div>
                            <span className="text-xs text-gray-400 mt-1 px-1">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        {msg.sender === 'user' && <div className="flex-shrink-0"><UserCircleIcon className="h-8 w-8 text-[#14654d]" /></div>}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-2 justify-start mb-4">
                        <div className="flex-shrink-0"><CpuChipIcon className="h-8 w-8 text-gray-400" /></div>
                        <div className="px-4 py-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                            <div className="flex items-center justify-center space-x-1">
                                <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t flex items-center bg-white">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#14654d]"
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading} className="p-2 bg-[#14654d] text-white rounded-r-md hover:bg-opacity-90 disabled:bg-[#14654d]/50">
                   <PaperAirplaneIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;