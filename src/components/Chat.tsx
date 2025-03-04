
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage, { ChatMessageProps } from './ChatMessage';
import ChatInput from './ChatInput';
import { SecurityToolIcon } from './SecurityTools';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, LucideIcon } from 'lucide-react';

interface ChatProps {
  initialMessages?: ChatMessageProps[];
}

type ToolType = 'password-checker' | 'password-generator' | 'ip-info' | 'hash-encrypt' | 'encode-decode' | null;

const Chat: React.FC<ChatProps> = ({ initialMessages = [] }) => {
  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingContent, setTypingContent] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    if (messages.length === 0) {
      // Add initial greeting
      const initialBotMessage: ChatMessageProps = {
        content: "Hello! I'm CyberGuardian, your personal security assistant. I can help with password checking, encryption, and more. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setIsTyping(true);
      
      // Simulate typing effect
      let i = 0;
      const typing = setInterval(() => {
        setTypingContent(initialBotMessage.content.slice(0, i));
        i++;
        if (i > initialBotMessage.content.length) {
          clearInterval(typing);
          setIsTyping(false);
          setMessages([initialBotMessage]);
        }
      }, 20);
    }
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingContent]);
  
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
    setIsTyping(true);
    
    // Process the message to determine what the user wants
    const lowerMsg = userMessage.toLowerCase();
    
    // Determine which tool to show based on message content
    let response = '';
    let tool: ToolType = null;
    
    if (lowerMsg.includes('password') && (lowerMsg.includes('check') || lowerMsg.includes('strength') || lowerMsg.includes('secure'))) {
      response = "Let me check how strong your password is. Use the tool below to analyze your password's security level:";
      tool = 'password-checker';
      setActiveTool('password-checker');
    } 
    else if (lowerMsg.includes('generate') && lowerMsg.includes('password')) {
      response = "I'll create a strong password for you. Use the generator below to customize your password:";
      tool = 'password-generator';
      setActiveTool('password-generator');
    }
    else if ((lowerMsg.includes('ip') || lowerMsg.includes('location')) && 
             (lowerMsg.includes('information') || lowerMsg.includes('details') || lowerMsg.includes('data') || lowerMsg.includes('what') || lowerMsg.includes('where'))) {
      response = "Let me fetch information about your IP address:";
      tool = 'ip-info';
      setActiveTool('ip-info');
    }
    else if ((lowerMsg.includes('encrypt') || lowerMsg.includes('hash') || lowerMsg.includes('decrypt')) && 
             (lowerMsg.includes('data') || lowerMsg.includes('text') || lowerMsg.includes('message'))) {
      response = "You can encrypt or hash your data using the tool below:";
      tool = 'hash-encrypt';
      setActiveTool('hash-encrypt');
    }
    else if ((lowerMsg.includes('encode') || lowerMsg.includes('decode')) && 
             (lowerMsg.includes('base64') || lowerMsg.includes('url'))) {
      response = "Use this tool to encode or decode your data:";
      tool = 'encode-decode';
      setActiveTool('encode-decode');
    }
    else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      response = "Hello! I'm CyberGuardian, your personal security assistant. How can I help you today?";
    }
    else if (lowerMsg.includes('help') || lowerMsg.includes('what can you do')) {
      response = "I can help you with various security tasks like checking password strength, generating secure passwords, providing IP information, and encrypting/decrypting data. Just ask!";
    }
    else {
      response = "I'm not sure I understand what you need. I can help with password checking, generation, IP information, encryption, and encoding. Please try asking in a different way or select a tool from the tabs above.";
    }
    
    // Simulate typing effect
    let i = 0;
    const typing = setInterval(() => {
      setTypingContent(response.slice(0, i));
      i++;
      if (i > response.length) {
        clearInterval(typing);
        setIsTyping(false);
        
        const botMessage: ChatMessageProps = {
          content: response,
          sender: 'bot',
          timestamp: new Date(),
          tool: tool || undefined
        };
        
        setMessages(prev => [...prev, botMessage]);
      }
    }, 20);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b glass-panel flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-cyberguardian" />
          <h1 className="text-xl font-medium">CyberGuardian</h1>
        </div>
        
        <Tabs 
          value={activeTool || ''} 
          onValueChange={(value) => setActiveTool(value as ToolType)}
          className="w-auto"
        >
          <TabsList className="grid grid-cols-5 h-8">
            <TabsTrigger value="password-checker" className="text-xs px-2 py-1 flex items-center gap-1">
              <SecurityToolIcon tool="password-checker" /> Check
            </TabsTrigger>
            <TabsTrigger value="password-generator" className="text-xs px-2 py-1 flex items-center gap-1">
              <SecurityToolIcon tool="password-generator" /> Generate
            </TabsTrigger>
            <TabsTrigger value="ip-info" className="text-xs px-2 py-1 flex items-center gap-1">
              <SecurityToolIcon tool="ip-info" /> IP Info
            </TabsTrigger>
            <TabsTrigger value="hash-encrypt" className="text-xs px-2 py-1 flex items-center gap-1">
              <SecurityToolIcon tool="hash-encrypt" /> Encrypt
            </TabsTrigger>
            <TabsTrigger value="encode-decode" className="text-xs px-2 py-1 flex items-center gap-1">
              <SecurityToolIcon tool="encode-decode" /> Encode
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
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
      
      <div className="p-4 border-t glass-panel">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Chat;
