import React, { useEffect } from 'react';
import ValuationCalculator from './components/ValuationCalculator';

function App() {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (document.activeElement?.getAttribute('type') === 'number') {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <ValuationCalculator />
    </div>
  );
}

export default App;