import React, { useEffect, useState } from 'react';
import { ApiKeySelection } from './components/ApiKeySelection';
import { ImageGenerator } from './components/ImageGenerator';

const App: React.FC = () => {
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  const checkAccess = async () => {
    try {
      const aiStudio = (window as any).aistudio;
      if (aiStudio && aiStudio.hasSelectedApiKey) {
        const hasKey = await aiStudio.hasSelectedApiKey();
        setHasAccess(hasKey);
      } else {
        // Fallback for development if window.aistudio is mock/missing
        // In production on the specific platform, this would be available.
        // We default to false to force the "Select Key" screen if standard logic applies.
        console.warn("window.aistudio not found. Defaulting to no access.");
        setHasAccess(false);
      }
    } catch (e) {
      console.error("Error checking API key status:", e);
      setHasAccess(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkAccess();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center text-emerald-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return <ApiKeySelection onKeySelected={() => setHasAccess(true)} />;
  }

  return <ImageGenerator />;
};

export default App;