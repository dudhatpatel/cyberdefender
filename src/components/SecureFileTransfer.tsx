
import React, { useState, useEffect } from 'react';
import { Upload, Download, Lock, Copy, Check, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { securelyTransferFile, retrieveSecureFile, SecureFileTransfer as SecureFileType } from '@/utils/securityUtils';

export const SecureFileTransfer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transferredFile, setTransferredFile] = useState<SecureFileType | null>(null);
  const [downloadPassword, setDownloadPassword] = useState('');
  const [fileId, setFileId] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'upload' | 'download'>('upload');
  const { toast } = useToast();

  // Simulate upload progress
  useEffect(() => {
    if (isUploading && uploadProgress < 100) {
      const timer = setTimeout(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 100));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isUploading, uploadProgress]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate network delay for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = await securelyTransferFile(file);
      setTransferredFile(result);
      
      toast({
        title: "File Uploaded Successfully",
        description: `Your 4-digit password is: ${result.password}. Keep it safe!`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };

  const handleDownload = async () => {
    if (!fileId || !downloadPassword) {
      toast({
        title: "Missing Information",
        description: "Please enter the file ID and password",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDownloading(true);
      
      // Simulate network delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fileData = retrieveSecureFile(fileId, downloadPassword);
      
      if (!fileData) {
        toast({
          title: "Download Failed",
          description: "Invalid file ID or password, or the file has expired",
          variant: "destructive",
        });
        return;
      }
      
      // Create download link
      const link = document.createElement('a');
      link.href = fileData;
      link.download = `secure-file-${fileId.slice(0, 6)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Successful",
        description: "Your file has been downloaded securely",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your file",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to Clipboard",
      description: "The information has been copied",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const resetUpload = () => {
    setFile(null);
    setTransferredFile(null);
    setUploadProgress(0);
  };

  return (
    <Card className="w-full glass-panel">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center w-full">
          <div>
            <CardTitle className="text-lg font-medium">Secure File Transfer</CardTitle>
            <CardDescription>End-to-end encrypted file sharing</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={mode === 'upload' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('upload')}
              className={mode === 'upload' ? 'bg-cyberguardian hover:bg-cyberguardian-accent' : ''}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button
              variant={mode === 'download' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('download')}
              className={mode === 'download' ? 'bg-cyberguardian hover:bg-cyberguardian-accent' : ''}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === 'upload' ? (
          <>
            {!transferredFile ? (
              <>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-slate-400 mb-2" />
                  <p className="text-center text-sm mb-4">
                    Drop your file here, or{" "}
                    <label htmlFor="file-upload" className="text-cyberguardian cursor-pointer hover:underline">
                      browse
                    </label>
                  </p>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    File will be encrypted with AES-256. Max 10MB.
                  </p>
                </div>

                {file && (
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3 bg-cyberguardian/10 p-2 rounded">
                        <Lock className="h-4 w-4 text-cyberguardian" />
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleUpload} 
                      disabled={isUploading}
                      className="bg-cyberguardian hover:bg-cyberguardian-accent"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Encrypting...
                        </>
                      ) : (
                        "Encrypt & Transfer"
                      )}
                    </Button>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Encrypting and uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4 animate-scale-in">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 p-4 rounded-md">
                  <h3 className="text-green-800 dark:text-green-300 font-medium flex items-center mb-2">
                    <Check className="h-5 w-5 mr-2" />
                    File Encrypted Successfully
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Your file has been securely encrypted and is ready to share.
                    The link and password below expire in 24 hours.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">File ID (Share this)</Label>
                    <div className="flex mt-1">
                      <Input value={transferredFile.fileId} readOnly className="flex-1 font-mono" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(transferredFile.fileId)}
                        className="ml-2"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm">Password (4 digits)</Label>
                    <div className="flex items-center mt-1 space-x-2">
                      <div className="flex space-x-2">
                        {transferredFile.password.split('').map((digit, i) => (
                          <div
                            key={i}
                            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center font-mono text-lg border border-slate-300 dark:border-slate-700"
                          >
                            {digit}
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(transferredFile.password)}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      onClick={resetUpload}
                      className="w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Transfer Another File
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fileId">File ID</Label>
              <Input
                id="fileId"
                value={fileId}
                onChange={(e) => setFileId(e.target.value)}
                placeholder="Enter the file ID you received"
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">4-Digit Password</Label>
              <Input
                id="password"
                value={downloadPassword}
                onChange={(e) => setDownloadPassword(e.target.value)}
                placeholder="Enter the 4-digit password"
                maxLength={4}
                className="font-mono"
              />
            </div>

            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full bg-cyberguardian hover:bg-cyberguardian-accent"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Decrypting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Decrypt & Download
                </>
              )}
            </Button>
          </div>
        )}

        <div className="mt-2 text-xs text-muted-foreground">
          <p className="flex items-center">
            <Lock className="h-3 w-3 mr-1" />
            Files are encrypted with AES-256 and stored temporarily (24 hours)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecureFileTransfer;
