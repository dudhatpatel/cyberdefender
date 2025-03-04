
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Globe, Shield, Mail, Lock, AlertTriangle, CheckCircle2, Search } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  analyzeDomainSecurity, 
  DomainSecurityResult, 
  Subdomain
} from '@/utils/domainSecurityUtils';
import { SecurityRiskLevel } from '@/types/domainSecurity';

const DomainSecurityAnalyzer: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<DomainSecurityResult | null>(null);
  const [activeTab, setActiveTab] = useState<'whois' | 'subdomains' | 'email' | 'tls' | 'summary'>('summary');
  const { toast } = useToast();

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value.trim().toLowerCase());
  };

  const handleAnalyze = async () => {
    if (!domain) {
      toast({
        title: "Missing Domain",
        description: "Please enter a domain name to analyze",
        variant: "destructive",
      });
      return;
    }

    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
    if (!domainRegex.test(domain)) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain name (e.g., example.com)",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      setProgress(0);
      setResult(null);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 200);
      
      const securityResult = await analyzeDomainSecurity(domain);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResult(securityResult);
      setActiveTab('summary');
      
      const riskLevel = securityResult.overallRisk;
      const riskVariant = riskLevel === 'Low' ? 'default' : riskLevel === 'Medium' ? 'warning' : 'destructive';
      
      toast({
        title: `Analysis Complete: ${riskLevel} Risk`,
        description: `${securityResult.recommendations.length} security recommendations found`,
        variant: riskVariant === 'destructive' ? 'destructive' : 'default',
      });
    } catch (error) {
      console.error('Domain analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing this domain",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(100);
    }
  };

  const getRiskBadge = (risk: SecurityRiskLevel) => {
    const variant = risk === 'Low' ? 'default' : risk === 'Medium' ? 'warning' : 'destructive';
    const className = risk === 'Low' ? 'bg-green-500' : risk === 'Medium' ? 'bg-yellow-500' : 'bg-red-500';
    
    return (
      <Badge variant={variant} className={className}>
        {risk === 'Low' ? 
          <CheckCircle2 className="h-3 w-3 mr-1" /> : 
          <AlertTriangle className="h-3 w-3 mr-1" />
        }
        {risk} Risk
      </Badge>
    );
  };

  return (
    <Card className="w-full glass-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Globe className="h-5 w-5 mr-2 text-cyberguardian" />
          Domain Security Analyzer
        </CardTitle>
        <CardDescription>
          Check WHOIS, subdomains, email security & TLS configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Enter domain (e.g., example.com)"
            value={domain}
            onChange={handleDomainChange}
            className="flex-1"
            disabled={isAnalyzing}
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !domain}
            className="bg-cyberguardian hover:bg-cyberguardian-accent"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </div>

        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Scanning domain security...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-4 animate-scale-in">
            <div className="flex space-x-2 border-b pb-2 overflow-x-auto scrollbar-hide">
              <Button 
                variant={activeTab === 'summary' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveTab('summary')}
                className={activeTab === 'summary' ? 'bg-cyberguardian hover:bg-cyberguardian-accent' : ''}
              >
                <Shield className="h-4 w-4 mr-1" />
                Summary
              </Button>
              <Button 
                variant={activeTab === 'whois' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveTab('whois')}
                className={activeTab === 'whois' ? 'bg-cyberguardian hover:bg-cyberguardian-accent' : ''}
              >
                <Globe className="h-4 w-4 mr-1" />
                WHOIS
              </Button>
              <Button 
                variant={activeTab === 'subdomains' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveTab('subdomains')}
                className={activeTab === 'subdomains' ? 'bg-cyberguardian hover:bg-cyberguardian-accent' : ''}
              >
                <Search className="h-4 w-4 mr-1" />
                Subdomains
              </Button>
              <Button 
                variant={activeTab === 'email' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveTab('email')}
                className={activeTab === 'email' ? 'bg-cyberguardian hover:bg-cyberguardian-accent' : ''}
              >
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
              <Button 
                variant={activeTab === 'tls' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveTab('tls')}
                className={activeTab === 'tls' ? 'bg-cyberguardian hover:bg-cyberguardian-accent' : ''}
              >
                <Lock className="h-4 w-4 mr-1" />
                TLS
              </Button>
            </div>

            {activeTab === 'summary' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{result.domain}</h3>
                  {getRiskBadge(result.overallRisk)}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">WHOIS</div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Registrar</span>
                      <span className="text-xs truncate max-w-[120px]">{result.whois.registrar}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Subdomains</div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Found</span>
                      <span className="text-xs">{result.subdomains.length}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Email Security</div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">DMARC</span>
                      <span className="text-xs">{result.emailSecurity.hasDMARC ? '✅' : '❌'}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">TLS</div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">TLS 1.3</span>
                      <span className="text-xs">{result.tlsSecurity.supportsTls13 ? '✅' : '❌'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Security Recommendations</h4>
                  {result.recommendations.length === 0 ? (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      No security issues found. Great job!
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'whois' && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium border-b pb-2">WHOIS Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Registrar:</span>
                      <span className="text-sm">{result.whois.registrar}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Creation Date:</span>
                      <span className="text-sm">{result.whois.creationDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Expiry Date:</span>
                      <span className="text-sm">{result.whois.expiryDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Owner:</span>
                      <span className="text-sm">{result.whois.owner}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">HTTPS:</span>
                      <span className="text-sm">{result.whois.hasHttps ? '✅ Enabled' : '❌ Disabled'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Blacklisted:</span>
                      <span className="text-sm">{result.whois.isBlacklisted ? '❌ Yes' : '✅ No'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Name Servers:</span>
                      <ul className="text-sm mt-1">
                        {result.whois.nameServers.map((ns, index) => (
                          <li key={index} className="text-xs">{ns}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium">Domain Status:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.whois.status.map((status, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subdomains' && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium border-b pb-2">
                  Subdomain Scan Results ({result.subdomains.length})
                </h3>
                
                <div className="grid grid-cols-1 gap-2">
                  {result.subdomains.map((sub, index) => (
                    <div key={index} className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {sub.isSensitive ? (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          ) : (
                            <Globe className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{sub.name}</p>
                          <p className="text-xs text-muted-foreground">{sub.ip}</p>
                        </div>
                      </div>
                      {sub.isSensitive && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                          Sensitive
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p>Sensitive subdomains may contain admin panels or internal services.</p>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium border-b pb-2">Email Security</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">SPF Record:</span>
                      <Badge variant={result.emailSecurity.hasSPF ? 'default' : 'destructive'} className={result.emailSecurity.hasSPF ? 'bg-green-500' : ''}>
                        {result.emailSecurity.hasSPF ? 'Present' : 'Missing'}
                      </Badge>
                    </div>
                    {result.emailSecurity.spfRecord && (
                      <p className="text-xs font-mono bg-slate-200 dark:bg-slate-700 p-2 rounded overflow-x-auto">
                        {result.emailSecurity.spfRecord}
                      </p>
                    )}
                    <p className="text-xs mt-1">
                      {result.emailSecurity.hasSPF 
                        ? 'SPF helps prevent email spoofing by specifying which servers are allowed to send emails on behalf of your domain.' 
                        : 'Missing SPF record: Your domain is vulnerable to email spoofing.'}
                    </p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">DKIM Record:</span>
                      <Badge variant={result.emailSecurity.hasDKIM ? 'default' : 'destructive'} className={result.emailSecurity.hasDKIM ? 'bg-green-500' : ''}>
                        {result.emailSecurity.hasDKIM ? 'Present' : 'Missing'}
                      </Badge>
                    </div>
                    {result.emailSecurity.dkimRecord && (
                      <p className="text-xs font-mono bg-slate-200 dark:bg-slate-700 p-2 rounded overflow-x-auto truncate">
                        {result.emailSecurity.dkimRecord}
                      </p>
                    )}
                    <p className="text-xs mt-1">
                      {result.emailSecurity.hasDKIM 
                        ? 'DKIM adds a digital signature to emails, allowing receiving servers to verify the email was not altered.' 
                        : 'Missing DKIM record: Your emails may be marked as spam or rejected by receiving servers.'}
                    </p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">DMARC Record:</span>
                      <Badge variant={result.emailSecurity.hasDMARC ? 'default' : 'destructive'} className={result.emailSecurity.hasDMARC ? 'bg-green-500' : ''}>
                        {result.emailSecurity.hasDMARC ? 'Present' : 'Missing'}
                      </Badge>
                    </div>
                    {result.emailSecurity.dmarcRecord && (
                      <p className="text-xs font-mono bg-slate-200 dark:bg-slate-700 p-2 rounded overflow-x-auto">
                        {result.emailSecurity.dmarcRecord}
                      </p>
                    )}
                    <p className="text-xs mt-1">
                      {result.emailSecurity.hasDMARC 
                        ? 'DMARC tells receiving servers what to do with emails that fail SPF and DKIM checks.' 
                        : 'Missing DMARC record: Your domain is vulnerable to phishing and spoofing attacks.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tls' && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium border-b pb-2">TLS/SSL Security</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">TLS 1.2:</span>
                        <span className="text-sm">{result.tlsSecurity.supportsTls12 ? '✅ Supported' : '❌ Not Supported'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">TLS 1.3:</span>
                        <span className="text-sm">{result.tlsSecurity.supportsTls13 ? '✅ Supported' : '❌ Not Supported'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Security Status:</span>
                        <span className="text-sm">{result.tlsSecurity.isSecure ? '✅ Secure' : '❌ Insecure'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Certificate Issuer:</span>
                        <span className="text-sm truncate max-w-[150px]">{result.tlsSecurity.certificateIssuer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Certificate Expiry:</span>
                        <span className="text-sm">{result.tlsSecurity.certificateExpiry}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">TLS Vulnerabilities</h4>
                    {result.tlsSecurity.vulnerabilities.length === 0 ? (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        No TLS vulnerabilities detected.
                      </p>
                    ) : (
                      <ul className="space-y-1">
                        {result.tlsSecurity.vulnerabilities.map((vuln, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{vuln}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <p>TLS 1.2 is the minimum recommended version for secure websites. TLS 1.3 offers improved security and performance.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-2 text-xs text-muted-foreground">
          <p className="flex items-center">
            <Shield className="h-3 w-3 mr-1" />
            Analyze domains for security vulnerabilities and compliance with best practices
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainSecurityAnalyzer;
