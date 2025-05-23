
import React from 'react';
import Chat from '@/components/Chat';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock } from 'lucide-react';

const Index = () => {
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8 my-[26px] px-[35px]">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <div className="flex items-center justify-center mb-6 space-x-2">
          <Shield className="h-8 w-8 text-cyberguardian animate-pulse-glow" />
          <h1 className="text-3xl font-bold text-gradient">CyberDefender</h1>
        </div>
        
        <Card className="w-full overflow-hidden border-0 shadow-xl glass-panel">
          <CardContent className="p-0 h-[75vh]">
            <Chat />
          </CardContent>
        </Card>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Your personal security assistant. Always encrypted, always secure.
          </p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center">
            <Lock className="h-3 w-3 mr-1" /> 
            Specializing in Indian cybersecurity laws and fraud prevention
          </p>
        </div>
      </div>
    </div>;
};

export default Index;
