
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, Upload, FileSearch, Globe } from 'lucide-react';
import { SecurityToolIcon } from './SecurityTools';
import { ToolType } from '@/utils/chatUtils';

interface ChatHeaderProps {
  activeTool: ToolType;
  setActiveTool: (value: ToolType) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ activeTool, setActiveTool }) => {
  return (
    <div className="p-4 border-b glass-panel flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-cyberguardian" />
        <h1 className="text-xl font-medium">CyberDefender</h1>
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
  );
};

export default ChatHeader;
