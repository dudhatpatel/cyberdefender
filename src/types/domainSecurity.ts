
export interface DnsRecord {
  type: string;
  value: string;
  name?: string;
  priority?: number;
}

export type SecurityRiskLevel = 'Low' | 'Medium' | 'High';

export interface SecurityScanResult {
  timestamp: Date;
  domain: string;
  overallRisk: SecurityRiskLevel;
  details: Record<string, any>;
}
