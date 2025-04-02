
import React, { useState, useEffect } from 'react';
import { ChatMessageProps } from './ChatMessage';
import ChatInput from './ChatInput';
import { useToast } from '@/hooks/use-toast';
import { getBotResponse, getInitialBotMessage, animateTyping, ToolType } from '@/utils/chatUtils';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';

interface ChatProps {
  initialMessages?: ChatMessageProps[];
}

const Chat: React.FC<ChatProps> = ({ initialMessages = [] }) => {
  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingContent, setTypingContent] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    if (messages.length === 0) {
      const initialBotMessage = getInitialBotMessage();
      
      animateTyping(
        initialBotMessage.content, 
        setTypingContent, 
        setIsTyping, 
        () => setMessages([initialBotMessage])
      );
    }
  }, []);
  
  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessageProps = {
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    handleBotResponse(content);
  };
  
  const handleBotResponse = (userMessage: string) => {
    const { response, tool } = getBotResponse(userMessage);
    
    if (tool === 'secure-transfer') {
      setActiveTool(tool);
      toast({
        title: "Secure Transfer",
        description: "For secure file transfers, we use AES-256 encryption with a 4-digit password.",
      });
    }
    
    if (tool) {
      setActiveTool(tool);
    }
    
    animateTyping(response, setTypingContent, setIsTyping, (text) => {
      const botMessage: ChatMessageProps = {
        content: text,
        sender: 'bot',
        timestamp: new Date(),
        tool: tool || undefined
      };
      
      setMessages(prev => [...prev, botMessage]);
    });
  };
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader activeTool={activeTool} setActiveTool={setActiveTool} />
      
      <ChatMessages 
        messages={messages}
        isTyping={isTyping}
        typingContent={typingContent}
      />
      
      <div className="p-4 border-t glass-panel">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Chat;
