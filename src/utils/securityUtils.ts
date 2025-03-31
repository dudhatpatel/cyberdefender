
import CryptoJS from 'crypto-js';

// Password strength checking
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  let score = 0;
  const feedback: string[] = [];

  if (!password) {
    return { score: 0, feedback: ["Password is empty"] };
  }

  // Length check
  if (password.length < 8) {
    feedback.push("Password is too short (minimum 8 characters)");
  } else {
    score += Math.min(2, Math.floor(password.length / 8));
  }

  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Add uppercase letters");
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Add lowercase letters");
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push("Add numbers");
  
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push("Add special characters");
  
  // Repeated characters and patterns
  if (/(.)\1\1/.test(password)) {
    score -= 1;
    feedback.push("Avoid repeated characters");
  }
  
  if (/123|abc|qwerty|password|admin|welcome/i.test(password)) {
    score -= 1;
    feedback.push("Avoid common patterns");
  }

  // Clamp score between 0-5
  score = Math.max(0, Math.min(5, score));
  
  if (score >= 4) {
    feedback.unshift("Strong password!");
  } else if (score >= 3) {
    feedback.unshift("Good password, but could be improved");
  } else {
    feedback.unshift("Weak password, please improve");
  }

  return { score, feedback };
};

// Password generation
export const generatePassword = (
  length = 12,
  includeUppercase = true,
  includeLowercase = true,
  includeNumbers = true,
  includeSymbols = true
): string => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  
  let chars = '';
  if (includeUppercase) chars += uppercaseChars;
  if (includeLowercase) chars += lowercaseChars;
  if (includeNumbers) chars += numberChars;
  if (includeSymbols) chars += symbolChars;
  
  // Fallback to ensure we have some character set
  if (chars.length === 0) chars = lowercaseChars + numberChars;
  
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  
  return password;
};

// IP information fetching
export const fetchIPInfo = async (ip?: string): Promise<any> => {
  try {
    const response = await fetch(`https://ipapi.co/${ip ? ip : ''}/json/`);
    const data = await response.json();
    
    // Enhanced with VPN detection logic
    const vpnDetectionFlags = [];
    
    if (data.hosting || data.datacenter) vpnDetectionFlags.push('Hosting/datacenter detected');
    if (data.proxy) vpnDetectionFlags.push('Proxy detected');
    if (data.tor) vpnDetectionFlags.push('TOR exit node detected');
    
    return {
      ...data,
      vpnDetection: {
        isVpnLikely: vpnDetectionFlags.length > 0,
        flags: vpnDetectionFlags
      }
    };
  } catch (error) {
    console.error('Error fetching IP info:', error);
    throw new Error('Failed to fetch IP information');
  }
};

// Hash generation
export const generateHash = (text: string, algorithm: string): string => {
  switch (algorithm.toLowerCase()) {
    case 'md5':
      return CryptoJS.MD5(text).toString();
    case 'sha1':
      return CryptoJS.SHA1(text).toString();
    case 'sha256':
      return CryptoJS.SHA256(text).toString();
    case 'sha512':
      return CryptoJS.SHA512(text).toString();
    default:
      return CryptoJS.SHA256(text).toString();
  }
};

// Symmetric encryption/decryption
export const encryptText = (text: string, passphrase: string): string => {
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};

export const decryptText = (encryptedText: string, passphrase: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, passphrase);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

// Encoding/Decoding utilities
export const encodeBase64 = (text: string): string => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};

export const decodeBase64 = (encoded: string): string => {
  try {
    return CryptoJS.enc.Base64.parse(encoded).toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Base64 decoding error:', error);
    return '';
  }
};

export const encodeUrl = (text: string): string => {
  return encodeURIComponent(text);
};

export const decodeUrl = (encoded: string): string => {
  try {
    return decodeURIComponent(encoded);
  } catch (error) {
    console.error('URL decoding error:', error);
    return '';
  }
};

// New features for CyberGuardian

// Phishing and fraud detection
export const checkPhishingLink = (url: string): {
  isSuspicious: boolean;
  reasons: string[];
} => {
  const reasons: string[] = [];
  let isSuspicious = false;
  
  // Common phishing patterns
  const suspiciousDomains = [
    'secure', 'login', 'signin', 'account', 'verification', 'verify', 
    'authenticate', 'wallet', 'confirm', 'update', 'banking'
  ];
  
  const commonBrands = [
    'paypal', 'apple', 'microsoft', 'amazon', 'netflix', 'facebook',
    'google', 'instagram', 'whatsapp', 'bank', 'wells', 'chase', 'citi',
    'hsbc', 'barclays', 'hdfc', 'sbi', 'icici', 'axis', 'paytm', 'phonepe', 'gpay'
  ];
  
  // Check for IP address instead of domain
  if (/^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
    reasons.push('URL uses IP address instead of domain name');
    isSuspicious = true;
  }
  
  // Check for suspicious TLDs
  if (/\.(xyz|tk|ml|ga|cf|gq|top|xin|club|work|date)$/.test(url)) {
    reasons.push('URL uses suspicious top-level domain');
    isSuspicious = true;
  }
  
  // Check for misspelled domains
  for (const brand of commonBrands) {
    // Look for brand name with slight misspellings
    const brandRegex = new RegExp(`${brand.slice(0, -1)}[a-z]{1,2}|${brand}[a-z]{1,2}`, 'i');
    if (brandRegex.test(url) && !url.includes(brand)) {
      reasons.push(`Possible typosquatting of ${brand}`);
      isSuspicious = true;
      break;
    }
  }
  
  // Check for suspicious words in the URL
  for (const word of suspiciousDomains) {
    if (url.toLowerCase().includes(word)) {
      reasons.push(`URL contains suspicious word: ${word}`);
      isSuspicious = true;
      break;
    }
  }
  
  // Check for excessive subdomains
  const subdomainCount = (url.match(/\./g) || []).length;
  if (subdomainCount > 3) {
    reasons.push('URL has an unusual number of subdomains');
    isSuspicious = true;
  }
  
  return { isSuspicious, reasons };
};

// Check UPI ID validity
export const validateUpiId = (upiId: string): boolean => {
  // UPI ID format: username@provider
  const upiRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+$/;
  return upiRegex.test(upiId);
};

// Secure file transfer with password
export interface SecureFileTransfer {
  fileId: string;
  fileName: string;
  encryptedData: string;
  password: string; // 4-digit password
  expiryTime: Date; // 24 hours from creation
}

export const secureFileRepository: SecureFileTransfer[] = [];

export const generateRandomPassword = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const securelyTransferFile = (file: File): Promise<SecureFileTransfer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const fileData = event.target?.result as string;
        const password = generateRandomPassword();
        
        // Encrypt file data with password
        const encryptedData = CryptoJS.AES.encrypt(fileData, password).toString();
        
        // Create secure file entry
        const secureFile: SecureFileTransfer = {
          fileId: CryptoJS.MD5(file.name + Date.now()).toString(),
          fileName: file.name,
          encryptedData,
          password,
          expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        };
        
        // Store in repository (in actual app, this would be server-side)
        secureFileRepository.push(secureFile);
        
        resolve(secureFile);
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const retrieveSecureFile = (fileId: string, password: string): string | null => {
  const fileEntry = secureFileRepository.find(f => f.fileId === fileId);
  
  if (!fileEntry) {
    return null;
  }
  
  // Check if file has expired
  if (new Date() > fileEntry.expiryTime) {
    // Remove expired file
    const index = secureFileRepository.findIndex(f => f.fileId === fileId);
    secureFileRepository.splice(index, 1);
    return null;
  }
  
  // Verify password
  if (fileEntry.password !== password) {
    return null;
  }
  
  // Decrypt file data
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(fileEntry.encryptedData, password);
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('File decryption error:', error);
    return null;
  }
};

// Indian Cybersecurity Compliance Information
export const indianCybersecurityLaws = {
  itAct2000: {
    name: "Information Technology Act, 2000 (IT Act)",
    description: "The primary law for cybersecurity in India, dealing with electronic transactions, digital signatures, and cybercrimes.",
    keyProvisions: [
      "Section 43: Penalty for damage to computer systems",
      "Section 65: Tampering with computer source documents",
      "Section 66: Computer related offenses",
      "Section 72: Breach of confidentiality and privacy"
    ],
    amendments: "Amended in 2008 to strengthen provisions for data protection and cybercrime."
  },
  certIn: {
    name: "CERT-In (Computer Emergency Response Team - India)",
    description: "The national agency responsible for cybersecurity incident response.",
    requirements: [
      "Mandatory reporting of cybersecurity incidents within 6 hours",
      "Maintenance of logs for 180 days within Indian jurisdiction",
      "Synchronization of system clocks with Network Time Protocol Server"
    ],
    contactInfo: "Incident reporting: incident@cert-in.org.in"
  },
  dpdp2023: {
    name: "Digital Personal Data Protection Act, 2023 (DPDP)",
    description: "Comprehensive law for protecting personal data of Indian citizens.",
    keyProvisions: [
      "Consent requirements for data processing",
      "Rights of data principals (individuals)",
      "Obligations of data fiduciaries (organizations)",
      "Establishment of Data Protection Board of India"
    ],
    penalties: "Up to ₹250 crore for serious violations."
  },
  rbi: {
    name: "RBI Guidelines on Cybersecurity",
    description: "Regulatory framework for banks and financial institutions in India.",
    requirements: [
      "Cybersecurity frameworks for banks",
      "Regular security audits and assessments",
      "Incident reporting procedures"
    ]
  }
};

// Common online frauds in India
export const commonIndianFrauds = [
  {
    type: "UPI Fraud",
    description: "Scammers request money via UPI apps like PhonePe, Google Pay, or Paytm.",
    warningSign: "Any request to send money for 'verification', 'cashback', or 'lottery winnings'.",
    prevention: "Never share OTP or approve collect requests from unknown individuals."
  },
  {
    type: "KYC Fraud",
    description: "Fraudsters claim your account/wallet will be blocked due to incomplete KYC.",
    warningSign: "Urgent messages about account suspension or KYC verification.",
    prevention: "Always visit official bank websites or apps for KYC updates."
  },
  {
    type: "Job Scams",
    description: "Fake job offers requiring payment for 'registration' or 'training'.",
    warningSign: "Jobs with minimal qualifications but promising high salaries, requiring upfront fees.",
    prevention: "Never pay for job applications or interviews."
  },
  {
    type: "Aadhaar/PAN Misuse",
    description: "Scammers collect Aadhaar/PAN details for identity theft.",
    warningSign: "Requests for ID verification via unofficial channels or websites.",
    prevention: "Only share ID details on official government portals."
  },
  {
    type: "Loan Fraud",
    description: "Fake lending apps or services requiring processing fees for loans.",
    warningSign: "Upfront fees before loan disbursal, unrealistically low interest rates.",
    prevention: "Only deal with RBI-registered financial institutions."
  },
  {
    type: "OTP Fraud",
    description: "Tricking victims into sharing OTPs to gain account access.",
    warningSign: "Calls/messages claiming to be from banks requesting OTPs for 'verification'.",
    prevention: "Never share OTPs with anyone, even if they claim to be bank officials."
  }
];
