import React, { useState } from 'react';
import { Key, ExternalLink, AlertTriangle } from 'lucide-react';

interface ApiKeySelectionProps {
  onKeySelected: () => void;
}

export const ApiKeySelection: React.FC<ApiKeySelectionProps> = ({ onKeySelected }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectKey = async () => {
    setLoading(true);
    setError(null);
    try {
      const aiStudio = (window as any).aistudio;
      if (aiStudio) {
        await aiStudio.openSelectKey();
        // Assume success if no error was thrown
        onKeySelected();
      } else {
        setError("AI Studio environment not detected. Please run this app in the correct environment.");
      }
    } catch (err: any) {
      console.error("Key selection failed:", err);
      // Check for specific error message as per instructions
      if (err.message && err.message.includes("Requested entity was not found")) {
        setError("Key selection failed. Please try selecting a valid project again.");
      } else {
        setError("An unexpected error occurred during key selection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-950 p-4">
      <div className="max-w-md w-full bg-emerald-900/50 backdrop-blur-lg border border-emerald-500/30 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
            <Key size={32} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Access Required</h1>
            <p className="text-emerald-200/80">
              To use the high-fidelity <b>gemini-3-pro-image-preview</b> model, you must select a paid API key associated with a Google Cloud Project.
            </p>
          </div>

          <div className="w-full bg-emerald-950/50 rounded-lg p-4 text-sm text-left border border-emerald-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-emerald-100/70">
                This feature requires a billed project. Please refer to the 
                <a 
                  href="https://ai.google.dev/gemini-api/docs/billing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 ml-1 inline-flex items-center underline"
                >
                  billing documentation <ExternalLink size={12} className="ml-0.5" />
                </a> for more details.
              </p>
            </div>
          </div>

          {error && (
             <div className="w-full bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                {error}
             </div>
          )}

          <button
            onClick={handleSelectKey}
            disabled={loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Connecting...</span>
            ) : (
              <>
                <span>Select API Key</span>
                <Key size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};