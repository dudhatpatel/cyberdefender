
import React from 'react';
import { cn } from '@/lib/utils';
import { SecurityToolsDisplay } from './SecurityTools';
import { Bot, User, AlertTriangle, Upload, FileSearch, Globe, Link } from 'lucide-react';

export interface ChatMessageProps {
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  tool?: string;
  typing?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  sender,
  timestamp,
  tool,
  typing = false
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderToolIcon = () => {
    switch (tool) {
      case 'fraud-detection':
        return <AlertTriangle className="h-5 w-5" />;
      case 'secure-transfer':
        return <Upload className="h-5 w-5" />;
      case 'compliance':
        return <FileSearch className="h-5 w-5" />;
      case 'domain-security':
        return <Globe className="h-5 w-5" />;
      default:
        return null;
    }
  };

  // Helper function to process URLs in text for rendering
  const processTextWithLinks = (text: string) => {
    // URL regex pattern
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    
    if (!text.match(urlPattern)) {
      return <span>{text}</span>;
    }
    
    const parts = text.split(urlPattern);
    const result: React.ReactNode[] = [];
    
    let i = 0;
    text.match(urlPattern)?.forEach((url) => {
      // Add text before URL
      if (parts[i]) {
        result.push(<span key={`text-${i}`}>{parts[i]}</span>);
      }
      
      // Add URL as link
      result.push(
        <a 
          key={`link-${i}`} 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cyberguardian hover:underline inline-flex items-center"
        >
          {url} <Link className="h-3 w-3 ml-1" />
        </a>
      );
      
      i++;
    });
    
    // Add remaining text
    if (parts[i]) {
      result.push(<span key={`text-${i}`}>{parts[i]}</span>);
    }
    
    return result;
  };

  // Helper to format list-like content
  const formatContent = (content: string) => {
    if (content.includes('1.') && content.includes('2.') && content.includes('\n')) {
      const lines = content.split('\n').filter(line => line.trim());
      return (
        <div>
          {lines.map((line, index) => {
            if (line.match(/^\d+\./)) {
              // This is a numbered line (e.g., "1. Something")
              return (
                <p key={index} className="font-medium mt-2">
                  {processTextWithLinks(line)}
                </p>
              );
            } else if (line.match(/^\s*•/)) {
              // This is a bullet point
              return (
                <p key={index} className="ml-4 mt-1">
                  {processTextWithLinks(line)}
                </p>
              );
            } else {
              // Regular line
              return <p key={index} className="mt-1">{processTextWithLinks(line)}</p>;
            }
          })}
        </div>
      );
    }
    
    return processTextWithLinks(content);
  };

  return (
    <div className={cn(
      "flex w-full mb-4 animate-scale-in",
      sender === 'user' ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[80%]",
        sender === 'user' ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "flex items-center justify-center h-10 w-10 rounded-full text-white",
          sender === 'user' ? "bg-cyberguardian ml-3" : "bg-cyberguardian-dark mr-3"
        )}>
          {sender === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>

        <div className="flex flex-col">
          <div className={cn(
            "px-4 py-3 rounded-xl",
            sender === 'user' 
              ? "bg-cyberguardian text-white" 
              : "glass-panel"
          )}>
            {typing ? (
              <div className="typing-indicator">{content}</div>
            ) : (
              <div className="text-sm">
                {formatContent(content)}
                {tool === 'fraud-detection' && (
                  <div className="mt-2 flex items-center text-orange-500">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="text-xs font-medium">Fraud detection activated</span>
                  </div>
                )}
                {content.includes('cybercrime.gov.in') && (
                  <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-md text-xs">
                    <span className="font-medium">Official Resource:</span> Indian Cybercrime Reporting Portal
                  </div>
                )}
              </div>
            )}
            
            {tool && sender === 'bot' && (
              <div className="mt-3">
                {(['password-checker', 'password-generator', 'ip-info', 'hash-encrypt', 'encode-decode'].includes(tool)) ? (
                  <SecurityToolsDisplay tool={tool} />
                ) : (
                  <div className="flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                    {renderToolIcon()}
                    <span className="ml-2 text-xs">
                      {tool === 'fraud-detection' && "Fraud Detection Tool"}
                      {tool === 'secure-transfer' && "Secure File Transfer"}
                      {tool === 'compliance' && "Indian Cybersecurity Compliance"}
                      {tool === 'domain-security' && "Domain Security Analysis"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className={cn(
            "text-xs text-muted-foreground mt-1",
            sender === 'user' ? "text-right" : "text-left"
          )}>
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
