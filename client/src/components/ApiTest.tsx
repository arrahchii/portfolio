import { useEffect, useState } from 'react';

// Helper function to safely get error message
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export function ApiTest() {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/portfolio/profile', {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        const message = getErrorMessage(err);
        console.error('❌ API Error:', message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) return (
    <div style={{ padding: '20px', background: '#f0f0f0', border: '2px solid #ccc', margin: '20px' }}>
      🧪 Testing API connection...
    </div>
  );
  
  if (error) return (
    <div style={{ padding: '20px', background: '#ffe6e6', border: '2px solid #ff0000', margin: '20px' }}>
      ❌ API Error: {error}
    </div>
  );
  
  if (data) return (
    <div style={{ padding: '20px', background: '#e6ffe6', border: '2px solid #00ff00', margin: '20px' }}>
      ✅ API Connection Successful! Portfolio data loaded. Check console for details.
    </div>
  );
  
  return (
    <div style={{ padding: '20px', background: '#fffacd', border: '2px solid #ffa500', margin: '20px' }}>
      ⚠️ No data received
    </div>
  );
}

