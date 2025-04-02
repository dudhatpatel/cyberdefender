
import React, { useEffect, useRef } from 'react';
import ChatMessage, { ChatMessageProps } from './ChatMessage';

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isTyping: boolean;
  typingContent: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isTyping, 
  typingContent 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingContent]);
  
  return (
    <div className="flex-1 overflow-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {messages.map((msg, index) => (
        <ChatMessage key={index} {...msg} />
      ))}
      
      {isTyping && (
        <ChatMessage
          content={typingContent}
          sender="bot"
          timestamp={new Date()}
          typing={true}
        />
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
