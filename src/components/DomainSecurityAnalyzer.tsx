
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Shield, Globe, Mail, Server, AlertTriangle, Check, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkDomainSecurity } from '@/utils/domainSecurityUtils';
import { SecurityScanResult } from '@/types/domainSecurity';

const DomainSecurityAnalyzer: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SecurityScanResult | null>(null);
  const [activeTab, setActiveTab] = useState('whois');
  const { toast } = useToast();

  const analyzeDomain = async () => {
    if (!domain) {
      toast({
        title: "Domain Required",
        description: "Please enter a domain name to analyze",
        variant: "destructive"
      });
      return;
    }

    // Simple domain format validation
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(domain)) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain name (e.g., example.com)",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const securityResult = await checkDomainSecurity(domain);
      setResult(securityResult);
      setActiveTab('whois'); // Reset to first tab
    } catch (error) {
      console.error('Domain analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not complete the security analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderRiskBadge = (risk: string) => {
    switch (risk) {
      case 'High':
        return <Badge variant="destructive" className="ml-2">High Risk</Badge>;
      case 'Medium':
        return <Badge variant="warning" className="ml-2 bg-orange-500">Medium Risk</Badge>;
      case 'Low':
        return <Badge variant="outline" className="ml-2 bg-green-500 text-white">Low Risk</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter domain name (e.g., example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={analyzeDomain} 
          disabled={isAnalyzing}
          className="bg-cyberguardian hover:bg-cyberguardian/90"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Domain"}
        </Button>
      </div>

      {result && (
        <Card className="w-full mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Domain Security Analysis
              {renderRiskBadge(result.overallRisk)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="whois">WHOIS</TabsTrigger>
                <TabsTrigger value="subdomains">Subdomains</TabsTrigger>
                <TabsTrigger value="email">Email Security</TabsTrigger>
                <TabsTrigger value="tls">TLS Security</TabsTrigger>
              </TabsList>

              <TabsContent value="whois" className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Registrar:</div>
                  <div>{result.details.whois.registrar}</div>
                  <div className="font-medium">Creation Date:</div>
                  <div>{new Date(result.details.whois.creationDate).toLocaleDateString()}</div>
                  <div className="font-medium">Expiry Date:</div>
                  <div>{new Date(result.details.whois.expiryDate).toLocaleDateString()}</div>
                  <div className="font-medium">Registrant:</div>
                  <div>{result.details.whois.registrantName}</div>
                  <div className="font-medium">Organization:</div>
                  <div>{result.details.whois.registrantOrganization}</div>
                  <div className="font-medium">Blacklisted:</div>
                  <div className="flex items-center">
                    {result.details.whois.blacklisted ? (
                      <><AlertTriangle className="h-4 w-4 text-red-500 mr-1" /> Yes</>
                    ) : (
                      <><Check className="h-4 w-4 text-green-500 mr-1" /> No</>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="subdomains" className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">Discovered Subdomains:</div>
                  <div className="grid grid-cols-1 gap-2">
                    {result.details.subdomains.map((subdomain, index) => (
                      <div key={index} className="flex items-center">
                        <Server className="h-4 w-4 mr-2" />
                        <span>{subdomain}</span>
                        {(subdomain.includes('admin') || subdomain.includes('dev')) && (
                          <Badge variant="outline" className="ml-2 bg-orange-500 text-white">Sensitive</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">SPF Record:</div>
                    <div className="flex items-center">
                      {result.details.emailSecurity.spf ? (
                        <><Check className="h-4 w-4 text-green-500 mr-1" /> Valid</>
                      ) : (
                        <><AlertTriangle className="h-4 w-4 text-red-500 mr-1" /> Missing</>
                      )}
                    </div>
                    <div className="font-medium">DKIM Record:</div>
                    <div className="flex items-center">
                      {result.details.emailSecurity.dkim ? (
                        <><Check className="h-4 w-4 text-green-500 mr-1" /> Valid</>
                      ) : (
                        <><AlertTriangle className="h-4 w-4 text-red-500 mr-1" /> Missing</>
                      )}
                    </div>
                    <div className="font-medium">DMARC Record:</div>
                    <div className="flex items-center">
                      {result.details.emailSecurity.dmarc ? (
                        <><Check className="h-4 w-4 text-green-500 mr-1" /> Valid</>
                      ) : (
                        <><AlertTriangle className="h-4 w-4 text-red-500 mr-1" /> Missing</>
                      )}
                    </div>
                  </div>
                  
                  {result.details.emailSecurity.recommendations.length > 0 && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertTriangle className="h-4 w-4" aria-label="Warning" />
                      <AlertTitle>Email Security Issues</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5 mt-2">
                          {result.details.emailSecurity.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tls" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">HTTPS/TLS:</div>
                    <div className="flex items-center">
                      {result.details.tlsSecurity.secure ? (
                        <><Check className="h-4 w-4 text-green-500 mr-1" /> Enabled</>
                      ) : (
                        <><AlertTriangle className="h-4 w-4 text-red-500 mr-1" /> Not Secure</>
                      )}
                    </div>
                    <div className="font-medium">TLS Version:</div>
                    <div className="flex items-center">
                      {result.details.tlsSecurity.modern ? (
                        <>{result.details.tlsSecurity.version} <Badge className="ml-2 bg-green-500 text-white">Modern</Badge></>
                      ) : (
                        <>{result.details.tlsSecurity.version} <Badge className="ml-2 bg-orange-500 text-white">Outdated</Badge></>
                      )}
                    </div>
                  </div>
                  
                  {result.details.tlsSecurity.recommendations.length > 0 && (
                    <Alert variant="warning" className="mt-4 border-orange-500">
                      <Info className="h-4 w-4" aria-label="Info" />
                      <AlertTitle>TLS Security Recommendations</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5 mt-2">
                          {result.details.tlsSecurity.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DomainSecurityAnalyzer;
