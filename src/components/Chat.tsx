
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage, { ChatMessageProps } from './ChatMessage';
import ChatInput from './ChatInput';
import { SecurityToolIcon } from './SecurityTools';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, Lock, Upload, FileSearch, Globe, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatProps {
  initialMessages?: ChatMessageProps[];
}

type ToolType = 'password-checker' | 'password-generator' | 'ip-info' | 'hash-encrypt' | 
                'encode-decode' | 'fraud-detection' | 'secure-transfer' | 'compliance' | 
                'domain-security' | null;

const Chat: React.FC<ChatProps> = ({ initialMessages = [] }) => {
  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingContent, setTypingContent] = useState('');
  const { toast } = useToast();
  
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
        content: "Hello! I'm CyberGuardian, your personal security assistant. I can help with password checking, encryption, fraud detection, and Indian cybersecurity compliance. How can I help you today?",
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
    else if ((lowerMsg.includes('ip') || lowerMsg.includes('location') || lowerMsg.includes('vpn')) && 
             (lowerMsg.includes('information') || lowerMsg.includes('details') || lowerMsg.includes('data') || lowerMsg.includes('what') || lowerMsg.includes('where'))) {
      response = "Let me fetch information about your IP address and check for VPN usage:";
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
    else if (lowerMsg.includes('fraud') || lowerMsg.includes('scam') || lowerMsg.includes('phishing') || 
             lowerMsg.includes('fake') || lowerMsg.includes('spam') || lowerMsg.includes('suspicious')) {
      response = "I can help you detect and report fraud. Let me analyze suspicious links, messages, or guide you to official reporting channels:";
      tool = 'fraud-detection';
      setActiveTool('fraud-detection');
    }
    else if (lowerMsg.includes('transfer') || lowerMsg.includes('send file') || lowerMsg.includes('upload') || 
             lowerMsg.includes('secure file') || lowerMsg.includes('encrypted file')) {
      response = "I can help you securely transfer files with end-to-end encryption and password protection:";
      tool = 'secure-transfer';
      setActiveTool('secure-transfer');
      
      toast({
        title: "Secure Transfer",
        description: "For secure file transfers, we use AES-256 encryption with a 4-digit password.",
      });
    }
    else if (lowerMsg.includes('compliance') || lowerMsg.includes('it act') || lowerMsg.includes('cert-in') || 
             lowerMsg.includes('dpdp') || lowerMsg.includes('law') || lowerMsg.includes('legal') || 
             lowerMsg.includes('regulation') || lowerMsg.includes('indian')) {
      response = "Let me provide information about Indian cybersecurity laws and compliance requirements:";
      tool = 'compliance';
      setActiveTool('compliance');
    }
    // New condition for domain security analysis
    else if ((lowerMsg.includes('domain') || lowerMsg.includes('website') || lowerMsg.includes('site')) &&
             (lowerMsg.includes('security') || lowerMsg.includes('check') || lowerMsg.includes('analyze') || 
              lowerMsg.includes('scan') || lowerMsg.includes('whois') || lowerMsg.includes('tls') || 
              lowerMsg.includes('ssl') || lowerMsg.includes('subdomain') || lowerMsg.includes('email'))) {
      response = "I can analyze domain security, including WHOIS information, subdomains, email security (SPF, DKIM, DMARC), and TLS configuration:";
      tool = 'domain-security';
      setActiveTool('domain-security');
    }
    else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      response = "Hello! I'm CyberGuardian, your personal security assistant. I can help with password security, fraud detection, secure file transfers, domain security analysis, and compliance with Indian cybersecurity laws. How can I assist you today?";
    }
    else if (lowerMsg.includes('help') || lowerMsg.includes('what can you do')) {
      response = "I can help you with various security tasks like checking password strength, generating secure passwords, providing IP information, detecting fraud, securely transferring files, analyzing domain security, and guiding you on Indian cybersecurity compliance. Just ask!";
    }
    else if (lowerMsg.includes('report') && lowerMsg.includes('cyber') && (lowerMsg.includes('crime') || lowerMsg.includes('fraud'))) {
      response = "To report cybercrime in India, visit the official portal at https://cybercrime.gov.in. You can file a complaint there, and if you need guidance filling out the form, just let me know!";
    }
    else if (lowerMsg.includes('download') && lowerMsg.includes('file')) {
      response = "To download your secure file, I'll need the 4-digit password that was provided to you. Please enter the password to access your encrypted file.";
    }
    else {
      response = "I'm not sure I understand what you need. I can help with password checking, generation, IP information, encryption, fraud detection, secure file transfers, domain security analysis, and Indian cybersecurity compliance. Please try asking in a different way or select a tool from the tabs above.";
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
          <TabsList className="grid grid-cols-3 h-8 md:grid-cols-9">
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
            <TabsTrigger value="fraud-detection" className="text-xs px-2 py-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Fraud
            </TabsTrigger>
            <TabsTrigger value="secure-transfer" className="text-xs px-2 py-1 flex items-center gap-1">
              <Upload className="h-3 w-3" /> Transfer
            </TabsTrigger>
            <TabsTrigger value="domain-security" className="text-xs px-2 py-1 flex items-center gap-1">
              <Globe className="h-3 w-3" /> Domain
            </TabsTrigger>
            <TabsTrigger value="compliance" className="text-xs px-2 py-1 flex items-center gap-1">
              <FileSearch className="h-3 w-3" /> Compliance
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
