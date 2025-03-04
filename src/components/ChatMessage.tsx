
import React from 'react';
import { cn } from '@/lib/utils';
import { SecurityToolsDisplay } from './SecurityTools';
import { Bot, User } from 'lucide-react';

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
                {content}
              </div>
            )}
            
            {tool && sender === 'bot' && (
              <div className="mt-3">
                <SecurityToolsDisplay tool={tool} />
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
