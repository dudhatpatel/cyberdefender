
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
  decodeUrl
} from '@/utils/securityUtils';
import { useToast } from '@/hooks/use-toast';

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
    default:
      return <Lock className="w-4 h-4" />;
  }
};
