import React, { useEffect, useState } from 'react';

export const AnalogClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondHandRotation = seconds * 6;
  const minuteHandRotation = minutes * 6 + seconds * 0.1;
  const hourHandRotation = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div className="relative w-24 h-24 border-4 border-blue-800 rounded-full bg-white shadow-lg flex items-center justify-center">
        {/* Clock Face Markers */}
        {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-full h-full text-center pt-1 text-xs font-bold text-gray-400" 
                 style={{ transform: `rotate(${i * 30}deg)` }}>
                |
            </div>
        ))}

      {/* Hour Hand */}
      <div
        className="absolute w-1 h-6 bg-black rounded origin-bottom"
        style={{
          transform: `translateY(-50%) rotate(${hourHandRotation}deg)`,
          bottom: '50%',
        }}
      />
      {/* Minute Hand */}
      <div
        className="absolute w-0.5 h-8 bg-gray-700 rounded origin-bottom"
        style={{
          transform: `translateY(-50%) rotate(${minuteHandRotation}deg)`,
          bottom: '50%',
        }}
      />
      {/* Second Hand */}
      <div
        className="absolute w-0.5 h-9 bg-red-500 rounded origin-bottom"
        style={{
          transform: `translateY(-50%) rotate(${secondHandRotation}deg)`,
          bottom: '50%',
        }}
      />
      <div className="absolute w-2 h-2 bg-blue-800 rounded-full" />
    </div>
  );
};