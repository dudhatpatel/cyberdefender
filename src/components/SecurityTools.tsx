import React, { useState } from 'react';
import { Copy, Check, RefreshCw, ArrowRight, Globe, Lock, Key, Hash, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  checkPasswordStrength,
  generatePassword,
  fetchIPInfo,
  generateHash,
  encryptText,
  decryptText,
  encodeBase64,
  decodeBase64,
  encodeUrl,
  decodeUrl,
  checkPhishingLink,
  validateUpiId,
  indianCybersecurityLaws,
  commonIndianFrauds
} from '@/utils/securityUtils';
import { useToast } from '@/hooks/use-toast';
import SecureFileTransfer from './SecureFileTransfer';
import DomainSecurityAnalyzer from './DomainSecurityAnalyzer';
import axios from 'axios';

export const PasswordStrengthChecker: React.FC = () => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState({ score: 0, feedback: ['Enter a password'] });
  const { toast } = useToast();

  const handleCheck = () => {
    if (!password) {
      toast({
        title: "Empty Password",
        description: "Please enter a password to check.",
        variant: "destructive",
      });
      return;
    }
    const result = checkPasswordStrength(password);
    setStrength(result);
  };

  const getColorByScore = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-green-400';
    return 'bg-emerald-500';
  };

  return (
    <Card className="w-full glass-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Password Strength Checker</CardTitle>
        <CardDescription>Check how secure your password is</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password" 
            className="flex-1" 
          />
          <Button 
            variant="default" 
            onClick={handleCheck}
            className="bg-cyberguardian hover:bg-cyberguardian-accent text-cyberguardian-foreground"
          >
            Check
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Strength: {strength.score}/5</span>
          </div>
          <Progress 
            value={strength.score * 20} 
            className={`progress-bar-animate h-2 ${getColorByScore(strength.score)}`} 
          />
          
          <div className="space-y-1 mt-3">
            {strength.feedback.map((feedback, i) => (
              <div key={i} className="flex items-center space-x-2 text-sm">
                <span className={i === 0 ? 'font-medium' : 'text-muted-foreground'}>
                  {feedback}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    const newPassword = generatePassword(
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols
    );
    setPassword(newPassword);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!password) {
      toast({
        title: "Nothing to Copy",
        description: "Generate a password first",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast({
      title: "Copied to Clipboard",
      description: "Your password has been copied",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  React.useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <Card className="w-full glass-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Password Generator</CardTitle>
        <CardDescription>Create strong, secure passwords</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input 
            value={password} 
            readOnly 
            className="flex-1 font-mono"
          />
          <Button 
            variant="outline" 
            onClick={handleCopy} 
            size="icon" 
            className="hover-shine"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleGenerate} 
            size="icon"
            className="hover-shine"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="length">Length: {length}</Label>
            </div>
            <Slider 
              value={[length]} 
              min={8} 
              max={32} 
              step={1} 
              onValueChange={(value) => setLength(value[0])} 
              className="w-full" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="uppercase" 
                checked={includeUppercase} 
                onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)} 
              />
              <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="lowercase" 
                checked={includeLowercase} 
                onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)} 
              />
              <Label htmlFor="lowercase">Lowercase (a-z)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="numbers" 
                checked={includeNumbers} 
                onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)} 
              />
              <Label htmlFor="numbers">Numbers (0-9)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="symbols" 
                checked={includeSymbols} 
                onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)} 
              />
              <Label htmlFor="symbols">Symbols (@#$%)</Label>
            </div>
          </div>
          
          <Button 
            onClick={handleGenerate} 
            className="w-full bg-cyberguardian hover:bg-cyberguardian-accent text-cyberguardian-foreground"
          >
            Generate New Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const IPInformation: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [ipInfo, setIpInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const fetchInfo = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchIPInfo(ipAddress);
      
      if (data.error) {
        setError(data.reason || 'Invalid IP address');
        toast({
          title: "Error",
          description: data.reason || 'Invalid IP address',
          variant: "destructive",
        });
        setIpInfo(null);
      } else {
        setIpInfo(data);
      }
    } catch (err) {
      setError('Failed to fetch IP information');
      toast({
        title: "Error",
        description: 'Failed to fetch IP information',
        variant: "destructive",
      });
      setIpInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full glass-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">IP Information</CardTitle>
        <CardDescription>Get details about any IP address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input 
            value={ipAddress} 
            onChange={(e) => setIpAddress(e.target.value)} 
            placeholder="Enter IP address (leave empty for your IP)" 
            className="flex-1" 
          />
          <Button 
            onClick={fetchInfo} 
            disabled={loading}
            className="bg-cyberguardian hover:bg-cyberguardian-accent text-cyberguardian-foreground"
          >
            {loading ? 'Loading...' : 'Lookup'}
          </Button>
        </div>
        
        {error && <div className="text-red-500 text-sm">{error}</div>}
        
        {ipInfo && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="bg-cyberguardian/10 text-cyberguardian-accent">
                <Globe className="mr-1 h-3 w-3" />
                {ipInfo.ip}
              </Badge>
              <Badge variant="outline">{ipInfo.country_name}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="font-medium">City</div>
                <div className="text-muted-foreground">{ipInfo.city || 'N/A'}</div>
              </div>
              <div>
                <div className="font-medium">Region</div>
                <div className="text-muted-foreground">{ipInfo.region || 'N/A'}</div>
              </div>
              <div>
                <div className="font-medium">ISP</div>
                <div className="text-muted-foreground">{ipInfo.org || 'N/A'}</div>
              </div>
              <div>
                <div className="font-medium">Timezone</div>
                <div className="text-muted-foreground">{ipInfo.timezone || 'N/A'}</div>
              </div>
              <div>
                <div className="font-medium">Latitude</div>
                <div className="text-muted-foreground">{ipInfo.latitude || 'N/A'}</div>
              </div>
              <div>
                <div className="font-medium">Longitude</div>
                <div className="text-muted-foreground">{ipInfo.longitude || 'N/A'}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const HashAndEncrypt: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [mode, setMode] = useState('hash');
  const [algorithm, setAlgorithm] = useState('sha256');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const handleProcess = () => {
    if (!inputText) {
      toast({
        title: "Empty Input",
        description: "Please enter some text to process.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (mode === 'hash') {
        setOutputText(generateHash(inputText, algorithm));
      } else if (mode === 'encrypt') {
        if (!passphrase) {
          toast({
            title: "Missing Passphrase",
            description: "Please enter a passphrase for encryption.",
            variant: "destructive",
          });
          return;
        }
        setOutputText(encryptText(inputText, passphrase));
      } else if (mode === 'decrypt') {
        if (!passphrase) {
          toast({
            title: "Missing Passphrase",
            description: "Please enter a passphrase for decryption.",
            variant: "destructive",
          });
          return;
        }
        const decrypted = decryptText(inputText, passphrase);
        if (!decrypted) {
          toast({
            title: "Decryption Failed",
            description: "Unable to decrypt. Check your passphrase and input.",
            variant: "destructive",
          });
          return;
        }
        setOutputText(decrypted);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your input.",
        variant: "destructive",
      });
    }
  };
  
  const handleCopy = () => {
    if (!outputText) {
      toast({
        title: "Nothing to Copy",
        description: "Generate output first",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast({
      title: "Copied to Clipboard",
      description: "Output has been copied",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card className="w-full glass-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Hash & Encryption</CardTitle>
        <CardDescription>Secure your data with hashing and encryption</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="hash" onValueChange={(value) => setMode(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hash">Hash</TabsTrigger>
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hash" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Hash Algorithm</Label>
              <RadioGroup 
                value={algorithm} 
                onValueChange={setAlgorithm} 
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="md5" id="md5" />
                  <Label htmlFor="md5">MD5</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sha1" id="sha1" />
                  <Label htmlFor="sha1">SHA-1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sha256" id="sha256" />
                  <Label htmlFor="sha256">SHA-256</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sha512" id="sha512" />
                  <Label htmlFor="sha512">SHA-512</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="encrypt" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="passphrase">Encryption Passphrase</Label>
              <Input 
                id="passphrase" 
                type="password" 
                value={passphrase} 
                onChange={(e) => setPassphrase(e.target.value)} 
                placeholder="Enter your secret passphrase" 
              />
              <p className="text-xs text-muted-foreground">
                This passphrase will be used to encrypt and decrypt your data. Keep it safe!
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="decrypt" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="decryptPassphrase">Decryption Passphrase</Label>
              <Input 
                id="decryptPassphrase" 
                type="password" 
                value={passphrase} 
                onChange={(e) => setPassphrase(e.target.value)} 
                placeholder="Enter your secret passphrase" 
              />
              <p className="text-xs text-muted-foreground">
                Enter the same passphrase that was used for encryption.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-2">
          <Label htmlFor="inputText">Input Text</Label>
          <Input 
            id="inputText" 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)} 
            placeholder={mode === 'decrypt' ? "Enter encrypted text" : "Enter text to process"} 
            className="font-mono"
          />
        </div>
        
        <Button 
          onClick={handleProcess} 
          className="w-full bg-cyberguardian hover:bg-cyberguardian-accent text-cyberguardian-foreground"
        >
          {mode === 'hash' ? 'Generate Hash' : mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
        </Button>
        
        {outputText && (
          <div className="space-y-2 animate-slide-up">
            <div className="flex justify-between items-center">
              <Label htmlFor="outputText">Result</Label>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div 
              className="p-2 rounded bg-muted/50 font-mono text-sm break-all max-h-24 overflow-auto" 
              id="outputText"
            >
              {outputText}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const EncodeAndDecode: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encode');
  const [algorithm, setAlgorithm] = useState('base64');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const handleProcess = () => {
    if (!inputText) {
      toast({
        title: "Empty Input",
        description: "Please enter some text to process.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (mode === 'encode') {
        if (algorithm === 'base64') {
          setOutputText(encodeBase64(inputText));
        } else if (algorithm === 'url') {
          setOutputText(encodeUrl(inputText));
        }
      } else {
        if (algorithm === 'base64') {
          const decoded = decodeBase64(inputText);
          if (!decoded) {
            toast({
              title: "Decoding Failed",
              description: "Invalid Base64 input.",
              variant: "destructive",
            });
            return;
          }
          setOutputText(decoded);
        } else if (algorithm === 'url') {
          const decoded = decodeUrl(inputText);
          if (!decoded) {
            toast({
              title: "Decoding Failed",
              description: "Invalid URL-encoded input.",
              variant: "destructive",
            });
            return;
          }
          setOutputText(decoded);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your input.",
        variant: "destructive",
      });
    }
  };
  
  const handleCopy = () => {
    if (!outputText) {
      toast({
        title: "Nothing to Copy",
        description: "Generate output first",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast({
      title: "Copied to Clipboard",
      description: "Output has been copied",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card className="w-full glass-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Encode & Decode</CardTitle>
        <CardDescription>Convert data between different formats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <div className="space-y-2 flex-1">
            <Label>Mode</Label>
            <RadioGroup 
              value={mode} 
              onValueChange={setMode} 
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="encode" id="encode" />
                <Label htmlFor="encode">Encode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="decode" id="decode" />
                <Label htmlFor="decode">Decode</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2 flex-1">
            <Label>Format</Label>
            <RadioGroup 
              value={algorithm} 
              onValueChange={setAlgorithm} 
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="base64" id="base64" />
                <Label htmlFor="base64">Base64</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="url" id="url" />
                <Label htmlFor="url">URL</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="inputText">Input Text</Label>
          <Input 
            id="inputText" 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)} 
            placeholder={mode === 'decode' ? `Enter ${algorithm} encoded text` : "Enter text to encode"} 
            className="font-mono"
          />
        </div>
        
        <Button 
          onClick={handleProcess} 
          className="w-full bg-cyberguardian hover:bg-cyberguardian-accent text-cyberguardian-foreground"
        >
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </Button>
        
        {outputText && (
          <div className="space-y-2 animate-slide-up">
            <div className="flex justify-between items-center">
              <Label htmlFor="outputText">Result</Label>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div 
              className="p-2 rounded bg-muted/50 font-mono text-sm break-all max-h-24 overflow-auto" 
              id="outputText"
            >
              {outputText}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const FraudDetection: React.FC = () => {
  const [url, setUrl] = useState('');
  const [upiId, setUpiId] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{isSuspicious?: boolean; reasons?: string[]; isValidUpi?: boolean} | null>(null);
  const { toast } = useToast();
  
  const checkUrl = () => {
    if (!url) {
      toast({
        title: "Empty URL",
        description: "Please enter a URL to check",
        variant: "destructive",
      });
      return;
    }
    
    const result = checkPhishingLink(url);
    setAnalysisResult(result);
    
    if (result.isSuspicious) {
      toast({
        title: "Suspicious URL Detected",
        description: "This URL shows signs of being potentially malicious",
        variant: "destructive",
      });
    } else {
      toast({
        title: "URL Check Complete",
        description: "No obvious suspicious indicators found",
      });
    }
  };
  
  const checkUpi = () => {
    if (!upiId) {
      toast({
        title: "Empty UPI ID",
        description: "Please enter a UPI ID to validate",
        variant: "destructive",
      });
      return;
    }
    
    const isValid = validateUpiId(upiId);
    setAnalysisResult({ isValidUpi: isValid });
    
    if (isValid) {
      toast({
        title: "Valid UPI Format",
        description: "The UPI ID format appears to be valid",
      });
    } else {
      toast({
        title: "Invalid UPI Format",
        description: "This does not appear to be a valid UPI ID format",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full glass-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Fraud Detection</CardTitle>
        <CardDescription>Check for phishing sites and analyze suspicious content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="phishing">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="phishing">Check URL</TabsTrigger>
            <TabsTrigger value="upi">Validate UPI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="phishing" className="space-y-4">
            <div className="flex space-x-2">
              <Input 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="Enter URL to check (e.g., https://example.com)" 
                className="flex-1" 
              />
              <Button 
                onClick={checkUrl}
                className="bg-cyberguardian hover:bg-cyberguardian-accent"
              >
                Check
              </Button>
            </div>
            
            {analysisResult && 'isSuspicious' in analysisResult && (
              <div className={`p-4 rounded-md ${analysisResult.isSuspicious ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900'}`}>
                <h3 className={`font-medium flex items-center mb-2 ${analysisResult.isSuspicious ? 'text-red-800 dark:text-red-300' : 'text-green-800 dark:text-green-300'}`}>
                  {analysisResult.isSuspicious ? 'Suspicious URL Detected' : 'No Obvious Threats Detected'}
                </h3>
                
                {analysisResult.isSuspicious && analysisResult.reasons && (
                  <div className="space-y-1 mt-2">
                    <p className="text-sm text-red-700 dark:text-red-400 font-medium">Warning signs:</p>
                    <ul className="text-sm text-red-600 dark:text-red-400 pl-5 list-disc">
                      {analysisResult.reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {!analysisResult.isSuspicious && (
                  <p className="text-sm text-green-700 dark:text-green-400">
                    While this URL doesn't show obvious signs of phishing, always exercise caution.
                  </p>
                )}
              </div>
            )}
            
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-200 dark:border-amber-900">
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">Common Signs of Phishing:</p>
              <ul className="text-sm text-amber-700 dark:text-amber-400 pl-5 list-disc mt-2">
                <li>Misspelled domains (e.g., amaz0n.com)</li>
                <li>URLs with IP addresses instead of domain names</li>
                <li>Excessive subdomains or strange TLDs (.xyz, .tk)</li>
                <li>Urgency to act or threats in messages</li>
                <li>Requests for personal information</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="upi" className="space-y-4">
            <div className="flex space-x-2">
              <Input 
                value={upiId} 
                onChange={(e) => setUpiId(e.target.value)} 
                placeholder="Enter UPI ID (e.g., username@upi)" 
                className="flex-1" 
              />
              <Button 
                onClick={checkUpi}
                className="bg-cyberguardian hover:bg-cyberguardian-accent"
              >
                Validate
              </Button>
            </div>
            
            {analysisResult && 'isValidUpi' in analysisResult && (
              <div className={`p-4 rounded-md ${analysisResult.isValidUpi ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900'}`}>
                <h3 className={`font-medium flex items-center mb-2 ${analysisResult.isValidUpi ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                  {analysisResult.isValidUpi ? 'Valid UPI ID Format' : 'Invalid UPI ID Format'}
                </h3>
                
                <p className={`text-sm ${analysisResult.isValidUpi ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {analysisResult.isValidUpi 
                    ? 'This UPI ID format appears to be valid. However, this only checks the format, not if the ID actually exists.' 
                    : 'This does not appear to be a valid UPI ID format. UPI IDs should follow the pattern username@provider.'}
                </p>
              </div>
            )}
            
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-200 dark:border-amber-900">
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">UPI Safety Tips:</p>
              <ul className="text-sm text-amber-700 dark:text-amber-400 pl-5 list-disc mt-2">
                <li>Never share your UPI PIN with anyone</li>
                <li>Verify the UPI ID before sending money</li>
                <li>Don't scan QR codes from untrusted sources</li>
                <li>Be wary of "send ₹1 to verify" scams</li>
                <li>Check for spelling mistakes in UPI IDs of known merchants</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-900">
          <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Report Cybercrime:</p>
          <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
            Visit <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="underline">cybercrime.gov.in</a> - the official Indian portal for reporting cybercrimes, including online financial fraud, social media harassment, etc.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const ComplianceInfo: React.FC = () => {
  return (
    <Card className="w-full glass-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Indian Cybersecurity Compliance</CardTitle>
        <CardDescription>Information on key laws and regulations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="it-act">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="it-act">IT Act</TabsTrigger>
            <TabsTrigger value="cert-in">CERT-In</TabsTrigger>
            <TabsTrigger value="dpdp">DPDP 2023</TabsTrigger>
          </TabsList>
          
          <TabsContent value="it-act" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">{indianCybersecurityLaws.itAct2000.name}</h3>
              <p className="text-sm">{indianCybersecurityLaws.itAct2000.description}</p>
              
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Key Provisions:</h4>
                <ul className="text-sm space-y-1 pl-5 list-disc">
                  {indianCybersecurityLaws.itAct2000.keyProvisions.map((provision, i) => (
                    <li key={i}>{provision}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-2 text-sm">
                <p><span className="font-medium">Amendments:</span> {indianCybersecurityLaws.itAct2000.amendments}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cert-in" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">{indianCybersecurityLaws.certIn.name}</h3>
              <p className="text-sm">{indianCybersecurityLaws.certIn.description}</p>
              
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Requirements:</h4>
                <ul className="text-sm space-y-1 pl-5 list-disc">
                  {indianCybersecurityLaws.certIn.requirements.map((requirement, i) => (
                    <li key={i}>{requirement}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-2 text-sm">
                <p><span className="font-medium">Contact:</span> {indianCybersecurityLaws.certIn.contactInfo}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="dpdp" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">{indianCybersecurityLaws.dpdp2023.name}</h3>
              <p className="text-sm">{indianCybersecurityLaws.dpdp2023.description}</p>
              
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Key Provisions:</h4>
                <ul className="text-sm space-y-1 pl-5 list-disc">
                  {indianCybersecurityLaws.dpdp2023.keyProvisions.map((provision, i) => (
                    <li key={i}>{provision}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-2 text-sm">
                <p><span className="font-medium">Penalties:</span> {indianCybersecurityLaws.dpdp2023.penalties}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-900">
          <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Common Online Frauds in India:</p>
          <div className="mt-2 space-y-2">
            {commonIndianFrauds.slice(0, 3).map((fraud, i) => (
              <div key={i} className="text-sm">
                <p className="font-medium text-blue-700 dark:text-blue-400">{fraud.type}:</p>
                <p className="text-blue-600 dark:text-blue-500">{fraud.description}</p>
                <p className="mt-1 italic text-blue-500 dark:text-blue-600">Prevention: {fraud.prevention}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SecurityToolsDisplay: React.FC<{ tool: string }> = ({ tool }) => {
  switch (tool) {
    case 'password-checker':
      return <PasswordStrengthChecker />;
    case 'password-generator':
      return <PasswordGenerator />;
    case 'ip-info':
      return <IPInformation />;
    case 'hash-encrypt':
      return <HashAndEncrypt />;
    case 'encode-decode':
      return <EncodeAndDecode />;
    case 'fraud-detection':
      return <FraudDetection />;
    case 'secure-transfer':
      return <SecureFileTransfer />;
    case 'compliance':
      return <ComplianceInfo />;
    case 'domain-security':
      return <DomainSecurityAnalyzer />;
    default:
      return (
        <div className="flex flex-col items-center justify-center h-48 text-center p-6">
          <div className="text-4xl mb-4"><Lock className="w-12 h-12 mx-auto text-cyberguardian" /></div>
          <h3 className="text-lg font-medium">Select a Tool</h3>
          <p className="text-muted-foreground mt-2">Choose a security tool from the options above to get started</p>
        </div>
      );
  }
};

export const SecurityToolIcon: React.FC<{ tool: string }> = ({ tool }) => {
  switch (tool) {
    case 'password-checker':
      return <Lock className="w-4 h-4" />;
    case 'password-generator':
      return <Key className="w-4 h-4" />;
    case 'ip-info':
      return <Globe className="w-4 h-4" />;
    case 'hash-encrypt':
      return <Hash className="w-4 h-4" />;
    case 'encode-decode':
      return <FileCode className="w-4 h-4" />;
    case 'fraud-detection':
      return <Lock className="w-4 h-4" />;
    case 'secure-transfer':
      return <Lock className="w-4 h-4" />;
    case 'compliance':
      return <Lock className="w-4 h-4" />;
    case 'domain-security':
      return <Globe className="h-3 w-3" />;
    default:
      return <Lock className="w-4 h-4" />;
  }
};
