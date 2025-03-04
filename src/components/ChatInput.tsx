
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = "Type your message...",
  showSuggestions = true
}) => {
  const [message, setMessage] = useState('');
  const [recording, setRecording] = useState(false);
  const [suggestions] = useState([
    "Check my password strength",
    "Generate a strong password",
    "What's my IP information?",
    "Help me encrypt my data",
    "Check if this is a fraud",
    "Transfer a file securely",
    "Indian cybersecurity laws",
    "How to report cyber fraud",
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleMicToggle = () => {
    // This would normally handle voice recognition
    // For now, we'll just toggle the state
    setRecording(!recording);
    
    if (!recording) {
      // Simulate voice recognition delay
      setTimeout(() => {
        setRecording(false);
      }, 3000);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  return (
    <div className="w-full space-y-3">
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((suggestion, index) => (
            <Badge
              key={index}
              variant="outline"
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer hover:bg-secondary transition-colors duration-200 py-1.5"
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={recording ? "Listening..." : placeholder}
          className={cn(
            "pr-20 py-6 rounded-full border-slate-200",
            recording && "animate-pulse border-cyberguardian"
          )}
          disabled={recording}
        />
        
        <div className="absolute right-2 flex space-x-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleMicToggle}
            className={cn(
              "rounded-full h-8 w-8",
              recording && "text-cyberguardian animate-pulse"
            )}
          >
            {recording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            disabled={!message.trim() || recording}
            className={cn(
              "bg-cyberguardian hover:bg-cyberguardian-accent rounded-full h-8 w-8",
              (!message.trim() || recording) && "opacity-50 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

