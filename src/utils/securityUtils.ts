
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
    return await response.json();
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
