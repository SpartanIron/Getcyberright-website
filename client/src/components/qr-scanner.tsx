import { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Camera, 
  CameraOff, 
  QrCode, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Loader2,
  Shield,
  ExternalLink,
  RefreshCw
} from "lucide-react";

interface QRScannerProps {
  onScanResult: (result: string) => void;
  isAnalyzing?: boolean;
}

export function QRScanner({ onScanResult, isAnalyzing }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<string>("qr-reader-" + Math.random().toString(36).substr(2, 9));

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.log("Scanner stop error (may already be stopped):", err);
      }
    }
    setIsScanning(false);
  }, []);

  const startScanner = async () => {
    setError(null);
    setScannedCode(null);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(containerRef.current);
      }

      try {
        await scannerRef.current.stop();
      } catch {
      }

      setIsScanning(true);

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          setScannedCode(decodedText);
          stopScanner();
          onScanResult(decodedText);
        },
        () => {}
      );
      setCameraPermission('granted');
    } catch (err: any) {
      setIsScanning(false);
      if (err?.message?.includes("Permission denied") || err?.name === "NotAllowedError") {
        setCameraPermission('denied');
        setError("Camera access was denied. Please allow camera access to scan QR codes.");
      } else if (err?.message?.includes("no camera")) {
        setError("No camera found. Please use a device with a camera.");
      } else {
        setError("Could not start camera. Please try again.");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
        } catch (err) {
          console.log("Cleanup error:", err);
        }
      }
    };
  }, []);

  const resetScanner = () => {
    setScannedCode(null);
    setError(null);
  };

  const isUrl = (text: string): boolean => {
    try {
      const urlPattern = /^(https?:\/\/|www\.)/i;
      return urlPattern.test(text);
    } catch {
      return false;
    }
  };

  const getCodeType = (code: string): { type: string; icon: any; color: string } => {
    if (isUrl(code)) {
      return { type: "URL/Link", icon: ExternalLink, color: "text-blue-500" };
    }
    if (/^tel:/i.test(code) || /^\+?[\d\s-]{7,}$/.test(code)) {
      return { type: "Phone Number", icon: AlertTriangle, color: "text-amber-500" };
    }
    if (/^mailto:/i.test(code) || /^[\w.-]+@[\w.-]+\.\w+$/.test(code)) {
      return { type: "Email", icon: AlertTriangle, color: "text-amber-500" };
    }
    if (/^WIFI:/i.test(code)) {
      return { type: "WiFi Network", icon: AlertTriangle, color: "text-purple-500" };
    }
    return { type: "Text/Other", icon: QrCode, color: "text-slate-500" };
  };

  return (
    <div className="space-y-4">
      {!scannedCode ? (
        <>
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
              <QrCode className="h-5 w-5" />
              <span className="text-sm">Point your camera at a QR code</span>
            </div>
            
            {!isScanning ? (
              <Button 
                onClick={startScanner}
                className="w-full bg-teal-500 hover:bg-teal-600 h-12 text-base"
                data-testid="button-start-scanner"
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Camera Scanner
              </Button>
            ) : (
              <Button 
                onClick={stopScanner}
                variant="outline"
                className="w-full h-12 text-base border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                data-testid="button-stop-scanner"
              >
                <CameraOff className="h-4 w-4 mr-2" />
                Stop Scanner
              </Button>
            )}
          </div>

          <div 
            id={containerRef.current} 
            className={`mx-auto overflow-hidden rounded-lg ${isScanning ? 'block' : 'hidden'}`}
            style={{ maxWidth: '300px' }}
          />

          {error && (
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    {cameraPermission === 'denied' && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        To enable camera access, check your browser settings or tap the camera icon in your address bar.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-medium mb-1">QR Code Safety Tips</p>
                <ul className="text-xs space-y-1 text-amber-600 dark:text-amber-400">
                  <li>• Never scan QR codes from unknown sources</li>
                  <li>• Scammers place fake QR codes on parking meters, menus, and flyers</li>
                  <li>• Always verify the destination before visiting a scanned link</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <Card className="border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-teal-500" />
                <span className="font-medium text-teal-700 dark:text-teal-300">QR Code Scanned!</span>
              </div>
              
              {(() => {
                const codeInfo = getCodeType(scannedCode);
                const CodeIcon = codeInfo.icon;
                return (
                  <div className="flex items-center gap-2 mb-2">
                    <CodeIcon className={`h-4 w-4 ${codeInfo.color}`} />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Type: {codeInfo.type}
                    </span>
                  </div>
                );
              })()}
              
              <div className="bg-white dark:bg-slate-900 p-3 rounded border text-sm font-mono break-all">
                {scannedCode}
              </div>
            </CardContent>
          </Card>

          {isUrl(scannedCode) ? (
            <div className="space-y-3">
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-teal-500" />
                  <span className="text-slate-600 dark:text-slate-400">Analyzing URL for threats...</span>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                  This URL is being checked for potential threats...
                </p>
              )}
            </div>
          ) : (
            <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-700 dark:text-amber-300 mb-1">
                      Non-URL QR Code Detected
                    </p>
                    <p className="text-amber-600 dark:text-amber-400">
                      This QR code contains {getCodeType(scannedCode).type.toLowerCase()}. 
                      Be cautious with any contact information from unknown QR codes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={resetScanner}
            variant="outline"
            className="w-full"
            data-testid="button-scan-another"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Scan Another Code
          </Button>
        </div>
      )}
    </div>
  );
}
