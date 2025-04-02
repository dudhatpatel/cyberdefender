
import { ChatMessageProps } from '@/components/ChatMessage';

export type ToolType = 'password-checker' | 'password-generator' | 'ip-info' | 'hash-encrypt' | 
                'encode-decode' | 'fraud-detection' | 'secure-transfer' | 'compliance' | 
                'domain-security' | null;

export const getBotResponse = (userMessage: string): { response: string; tool: ToolType } => {
  const lowerMsg = userMessage.toLowerCase();
  
  let response = '';
  let tool: ToolType = null;
  
  if (lowerMsg.includes('password') && (lowerMsg.includes('check') || lowerMsg.includes('strength') || lowerMsg.includes('secure'))) {
    response = "Let me check how strong your password is. Use the tool below to analyze your password's security level:";
    tool = 'password-checker';
  } 
  else if (lowerMsg.includes('generate') && lowerMsg.includes('password')) {
    response = "I'll create a strong password for you. Use the generator below to customize your password:";
    tool = 'password-generator';
  }
  else if ((lowerMsg.includes('ip') || lowerMsg.includes('location') || lowerMsg.includes('vpn')) && 
           (lowerMsg.includes('information') || lowerMsg.includes('details') || lowerMsg.includes('data') || lowerMsg.includes('what') || lowerMsg.includes('where'))) {
    response = "Let me fetch information about your IP address and check for VPN usage:";
    tool = 'ip-info';
  }
  else if ((lowerMsg.includes('encrypt') || lowerMsg.includes('hash') || lowerMsg.includes('decrypt')) && 
           (lowerMsg.includes('data') || lowerMsg.includes('text') || lowerMsg.includes('message'))) {
    response = "You can encrypt or hash your data using the tool below:";
    tool = 'hash-encrypt';
  }
  else if ((lowerMsg.includes('encode') || lowerMsg.includes('decode')) && 
           (lowerMsg.includes('base64') || lowerMsg.includes('url'))) {
    response = "Use this tool to encode or decode your data:";
    tool = 'encode-decode';
  }
  else if (lowerMsg.includes('fraud') || lowerMsg.includes('scam') || lowerMsg.includes('phishing') || 
           lowerMsg.includes('fake') || lowerMsg.includes('spam') || lowerMsg.includes('suspicious')) {
    response = "I can help you detect and report fraud. Let me analyze suspicious links, messages, or guide you to official reporting channels:";
    tool = 'fraud-detection';
  }
  else if (lowerMsg.includes('transfer') || lowerMsg.includes('send file') || lowerMsg.includes('upload') || 
           lowerMsg.includes('secure file') || lowerMsg.includes('encrypted file')) {
    response = "I can help you securely transfer files with end-to-end encryption and password protection:";
    tool = 'secure-transfer';
  }
  else if (lowerMsg.includes('compliance') || lowerMsg.includes('it act') || lowerMsg.includes('cert-in') || 
           lowerMsg.includes('dpdp') || lowerMsg.includes('law') || lowerMsg.includes('legal') || 
           lowerMsg.includes('regulation') || lowerMsg.includes('indian')) {
    response = "Let me provide information about Indian cybersecurity laws and compliance requirements:";
    tool = 'compliance';
  }
  else if ((lowerMsg.includes('domain') || lowerMsg.includes('website') || lowerMsg.includes('site')) &&
           (lowerMsg.includes('security') || lowerMsg.includes('check') || lowerMsg.includes('analyze') || 
            lowerMsg.includes('scan') || lowerMsg.includes('whois') || lowerMsg.includes('tls') || 
            lowerMsg.includes('ssl') || lowerMsg.includes('subdomain') || lowerMsg.includes('email'))) {
    response = "I can analyze domain security, including WHOIS information, subdomains, email security (SPF, DKIM, DMARC), and TLS configuration:";
    tool = 'domain-security';
  }
  else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    response = "Hello! I'm CyberDefender, your personal security assistant. I can help with password security, fraud detection, secure file transfers, domain security analysis, and compliance with Indian cybersecurity laws. How can I assist you today?";
  }
  else if (lowerMsg.includes('help') || lowerMsg.includes('what can you do')) {
    response = "I can help you with various security tasks like checking password strength, generating secure passwords, providing IP information, detecting fraud, securely transferring files, analyzing domain security, and guiding you on Indian cybersecurity compliance. Just ask!";
  }
  else if ((lowerMsg.includes('report') && lowerMsg.includes('cyber') && (lowerMsg.includes('crime') || lowerMsg.includes('fraud'))) ||
          (lowerMsg.includes('how') && lowerMsg.includes('report') && lowerMsg.includes('fraud'))) {
    response = `To report cybercrime, follow these steps:

1. Collect evidence - screenshots, emails, messages, transaction details
2. Report to authorities based on your location:
   • India: Visit https://cybercrime.gov.in or call 1930
   • USA: FBI's Internet Crime Complaint Center (IC3) at https://www.ic3.gov
   • UK: Action Fraud at https://www.actionfraud.police.uk
   • Canada: Canadian Anti-Fraud Centre at https://www.antifraudcentre-centreantifraude.ca
   
3. Contact your bank/payment provider if financial fraud occurred
4. Report to the platform where fraud happened (social media, e-commerce)
5. Document your complaint reference numbers

Would you like more specific information about reporting in India?`;
  }
  else if ((lowerMsg.includes('india') || lowerMsg.includes('indian')) && 
           (lowerMsg.includes('report') || lowerMsg.includes('complaint'))) {
    response = `For reporting cybercrimes in India, you have multiple options:

1. National Cyber Crime Reporting Portal: https://cybercrime.gov.in
   • Report all types of cybercrimes including financial fraud, social media, and child exploitation
   • Available in multiple Indian languages
   
2. Cybercrime Helpline: Call 1930 (toll-free)
   • For immediate assistance with financial frauds
   • Operates 24/7

3. Local Police Station
   • File an FIR at your nearest police station with cybercrime cell
   
4. For financial frauds:
   • Report within 24 hours for higher chances of fund recovery
   • RBI Ombudsman for banking related issues
   
5. Document every communication with case ID numbers

After reporting, keep following up with the authorities for case updates.`;
  }
  else if (lowerMsg.includes('download') && lowerMsg.includes('file')) {
    response = "To download your secure file, I'll need the 4-digit password that was provided to you. Please enter the password to access your encrypted file.";
  }
  else {
    response = "I'm not sure I understand what you need. I can help with password checking, generation, IP information, encryption, fraud detection, secure file transfers, domain security analysis, and Indian cybersecurity compliance. Please try asking in a different way or select a tool from the tabs above.";
  }
  
  return { response, tool };
};

export const getInitialBotMessage = (): ChatMessageProps => {
  return {
    content: "Hello! I'm CyberDefender, your personal security assistant. I can help with password checking, encryption, fraud detection, and Indian cybersecurity compliance. How can I help you today?",
    sender: 'bot',
    timestamp: new Date(),
  };
};

export const animateTyping = (
  text: string, 
  setTypingContent: React.Dispatch<React.SetStateAction<string>>, 
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>, 
  onComplete?: (text: string) => void
) => {
  setIsTyping(true);
  let i = 0;
  
  const typing = setInterval(() => {
    setTypingContent(text.slice(0, i));
    i++;
    if (i > text.length) {
      clearInterval(typing);
      setIsTyping(false);
      if (onComplete) {
        onComplete(text);
      }
    }
  }, 20);
  
  return typing;
};
