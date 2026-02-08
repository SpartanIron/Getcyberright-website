import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Loader2, CheckCircle, AlertTriangle, XCircle, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface URLAnalysisResult {
  isSuspicious: boolean;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  warnings: string[];
  recommendations: string[];
}

function getRiskConfig(level: string) {
  switch (level) {
    case 'safe':
    case 'low':
      return { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle, label: 'Safe' };
    case 'medium':
      return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertTriangle, label: 'Caution' };
    case 'high':
    case 'critical':
      return { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, label: 'Dangerous' };
    default:
      return { color: 'text-slate-600', bg: 'bg-slate-50', icon: Shield, label: 'Unknown' };
  }
}

export default function EmbedWidget() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<URLAnalysisResult | null>(null);

  const urlMutation = useMutation({
    mutationFn: async (urlToCheck: string) => {
      const response = await apiRequest("/api/scam-check/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToCheck })
      });
      return response;
    },
    onSuccess: (data) => {
      setResult(data);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      setResult(null);
      urlMutation.mutate(url.trim());
    }
  };

  const config = result ? getRiskConfig(result.riskLevel) : null;
  const Icon = config?.icon || Shield;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-6 w-6 text-teal-600" />
          <span className="font-bold text-slate-800">URL Safety Check</span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a suspicious link..."
            className="h-11 text-base"
          />
          <Button 
            type="submit" 
            className="w-full bg-teal-600 hover:bg-teal-700 h-11"
            disabled={!url.trim() || urlMutation.isPending}
          >
            {urlMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Check URL
              </>
            )}
          </Button>
        </form>

        {result && config && (
          <div className={`mt-4 p-4 rounded-lg ${config.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-5 w-5 ${config.color}`} />
              <span className={`font-semibold ${config.color}`}>{config.label}</span>
            </div>
            
            {result.warnings.length > 0 && (
              <ul className="space-y-1 mb-3">
                {result.warnings.slice(0, 3).map((warning, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <XCircle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                    {warning}
                  </li>
                ))}
              </ul>
            )}
            
            {result.recommendations.length > 0 && (
              <p className="text-sm text-slate-600">
                {result.recommendations[0]}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 text-center">
          <a 
            href="https://getcyberright.com/scam-checker" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700"
          >
            Powered by GetCyberRight
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
