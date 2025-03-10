
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SecurityScanResult, SecurityRiskLevel, DnsRecord } from '@/types/domainSecurity';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, Mail, Shield, AlertCircle, Calendar, UserCheck, CheckCircle, XCircle } from 'lucide-react';
import { checkDomainSecurity } from '@/utils/domainSecurityUtils';
import { useToast } from '@/hooks/use-toast';

const DomainSecurityAnalyzer: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<SecurityScanResult | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!domain) {
      toast({
        title: "Please enter a domain",
        description: "Enter a valid domain name to analyze security",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Regular expression to validate domain format
      const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
      
      if (!domainRegex.test(domain)) {
        throw new Error("Invalid domain format");
      }
      
      const result = await checkDomainSecurity(domain);
      setScanResult(result);
      
      toast({
        title: "Domain Security Analysis Complete",
        description: `Overall risk level: ${result.overallRisk}`,
      });
    } catch (error) {
      console.error("Domain security check failed:", error);
      toast({
        title: "Security Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze domain security",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadge = (risk: SecurityRiskLevel) => {
    switch (risk) {
      case 'Low':
        return <Badge className="bg-green-500">Low Risk</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-500">Medium Risk</Badge>;
      case 'High':
        return <Badge variant="destructive">High Risk</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            Domain Security Analyzer
          </CardTitle>
          <CardDescription>
            Check WHOIS, subdomains, email security &amp; TLS configuration
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter domain (e.g., example.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleScan} 
              disabled={isLoading}
            >
              {isLoading ? "Scanning..." : "Analyze Security"}
            </Button>
          </div>
          
          {isLoading && (
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          )}
          
          {scanResult && !isLoading && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Results for {scanResult.domain}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Overall Risk:</span>
                  {getRiskBadge(scanResult.overallRisk)}
                </div>
              </div>
              
              <Tabs defaultValue="whois" className="mt-4">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="whois">WHOIS</TabsTrigger>
                  <TabsTrigger value="subdomains">Subdomains</TabsTrigger>
                  <TabsTrigger value="email">Email Security</TabsTrigger>
                  <TabsTrigger value="tls">TLS</TabsTrigger>
                </TabsList>
                
                <TabsContent value="whois" className="space-y-2">
                  {scanResult.details.whois && (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium mr-2">Creation Date:</span>
                        {scanResult.details.whois.creationDate}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium mr-2">Expiry Date:</span>
                        {scanResult.details.whois.expiryDate}
                      </div>
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium mr-2">Registrar:</span>
                        {scanResult.details.whois.registrar}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="subdomains">
                  {scanResult.details.subdomains && (
                    <div className="space-y-2">
                      <div className="text-sm mb-2">
                        Found {scanResult.details.subdomains.length} subdomains:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {scanResult.details.subdomains.map((subdomain, index) => (
                          <div key={index} className="flex items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                            <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{subdomain}</span>
                            {subdomain.includes('admin') && (
                              <AlertCircle className="h-4 w-4 ml-2 text-orange-500" title="Sensitive subdomain" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="email">
                  {scanResult.details.emailSecurity && (
                    <div className="space-y-3">
                      <div className="flex items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="font-medium mr-2">SPF Record:</span>
                        {scanResult.details.emailSecurity.spf ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="ml-2 text-xs">{scanResult.details.emailSecurity.spf ? "Present" : "Missing (Allows email spoofing)"}</span>
                      </div>
                      
                      <div className="flex items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="font-medium mr-2">DKIM Record:</span>
                        {scanResult.details.emailSecurity.dkim ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="ml-2 text-xs">{scanResult.details.emailSecurity.dkim ? "Present" : "Missing (Decreases email deliverability)"}</span>
                      </div>
                      
                      <div className="flex items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <Shield className="h-4 w-4 mr-2" />
                        <span className="font-medium mr-2">DMARC Record:</span>
                        {scanResult.details.emailSecurity.dmarc ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="ml-2 text-xs">{scanResult.details.emailSecurity.dmarc ? "Present" : "Missing (Makes phishing easier)"}</span>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="tls">
                  {scanResult.details.tlsSecurity && (
                    <div className="space-y-3">
                      <div className="flex items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <Shield className="h-4 w-4 mr-2" />
                        <span className="font-medium mr-2">TLS Version:</span>
                        <span>{scanResult.details.tlsSecurity.version}</span>
                        {scanResult.details.tlsSecurity.version === 'TLS 1.3' ? (
                          <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                        ) : scanResult.details.tlsSecurity.version === 'TLS 1.2' ? (
                          <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 ml-2 text-orange-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <Shield className="h-4 w-4 mr-2" />
                        <span className="font-medium mr-2">Certificate Valid:</span>
                        {scanResult.details.tlsSecurity.certificateValid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="font-medium mr-2">Certificate Expiry:</span>
                        <span>{scanResult.details.tlsSecurity.certificateExpiry}</span>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="text-xs text-muted-foreground pt-1">
          Powered by CyberDefender Domain Security Scanner
        </CardFooter>
      </Card>
    </div>
  );
};

export default DomainSecurityAnalyzer;
