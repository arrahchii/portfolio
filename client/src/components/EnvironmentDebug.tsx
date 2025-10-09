import React from 'react';

const EnvironmentDebug: React.FC = () => {
  const nodeEnv = process.env.NODE_ENV;
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
  const href = typeof window !== 'undefined' ? window.location.href : 'unknown';

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-4 rounded-lg text-sm z-50 max-w-md">
      <h3 className="font-bold mb-2">🔍 Environment Debug Info</h3>
      <div className="space-y-1">
        <div><strong>NODE_ENV:</strong> {nodeEnv || 'undefined'}</div>
        <div><strong>Is Development:</strong> {isDev ? '✅ Yes' : '❌ No'}</div>
        <div><strong>Is Production:</strong> {isProd ? '✅ Yes' : '❌ No'}</div>
        <div><strong>Hostname:</strong> {hostname}</div>
        <div><strong>Full URL:</strong> {href}</div>
        <div><strong>Vanta Scripts:</strong> {typeof window !== 'undefined' && window.VANTA ? '✅ Loaded' : '❌ Not Loaded'}</div>
        <div><strong>THREE.js:</strong> {typeof window !== 'undefined' && window.THREE ? '✅ Loaded' : '❌ Not Loaded'}</div>
      </div>
    </div>
  );
};

export default EnvironmentDebug;