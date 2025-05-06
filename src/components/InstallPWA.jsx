import React, { useState, useEffect } from 'react';

function InstallPWA({ onClick }) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if the user has previously dismissed the prompt
    const hasPromptBeenDismissed = localStorage.getItem('pwaPromptDismissed');
    
    // Only show the prompt if it hasn't been dismissed before
    if (!hasPromptBeenDismissed) {
      setShowPrompt(true);
    }
  }, []);

  const handleInstall = () => {
    // Call the provided onClick handler
    if (onClick) {
      onClick();
    }
    // Hide the prompt after installation attempt
    setShowPrompt(false);
    // Remember that user interacted with the prompt
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    // Remember that user dismissed the prompt
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <p className="text-gray-800 mr-4">Install this app on your device for a better experience!</p>
        <div className="flex items-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mr-2"
            onClick={handleInstall}
          >
            Install App
          </button>
          <button
            className="text-gray-600 hover:text-gray-800 py-2 px-2 rounded"
            onClick={dismissPrompt}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPWA;