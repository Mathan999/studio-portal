import React from 'react';

function InstallButton({ onClick }) {
  return (
    <div className="install-prompt">
      <div className="install-container">
        <p>Install this app on your device for a better experience!</p>
        <button 
          className="install-button"
          onClick={onClick}
        >
          Install App
        </button>
      </div>
      <style jsx>{`
        .install-prompt {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #f8f9fa;
          padding: 10px;
          box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
          z-index: 1000;
        }
        .install-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 15px;
        }
        .install-button {
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: bold;
        }
        .install-button:hover {
          background-color: #0069d9;
        }
      `}</style>
    </div>
  );
}

export default InstallButton;