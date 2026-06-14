import React, { useState } from "react";

export default function WelcomeScreen({ onEnter }) {
  const [isTearing, setIsTearing] = useState(false);

  const handleTear = () => {
    setIsTearing(true);
    setTimeout(() => {
      onEnter();
    }, 1000);
  };

  return (
    <div className={`w-full h-screen flex items-center justify-center bg-[#020508] transition-opacity duration-1000 ${isTearing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center">
        <h1 className="text-[12vw] font-tech font-black tracking-widest text-white/90 flex items-center justify-center">
          <span>C</span>
          <div className={`split-o-container mx-2 ${isTearing ? 'torn' : ''}`} onClick={handleTear}>
            <span className="opacity-0">O</span> 
            <span className="split-half split-top font-tech flex items-center justify-center absolute top-0 left-0">O</span>
            <span className="split-half split-bottom font-tech flex items-center justify-center absolute top-0 left-0">O</span>
            {!isTearing && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 animate-pulse">
                  <div className="w-[120%] h-[2px] bg-[#20b8db] absolute transform rotate-45"></div>
               </div>
            )}
          </div>
          <span>R</span>
          <span>O</span>
          <span>C</span>
        </h1>
        <p className="text-[#20b8db] mt-4 tracking-[0.3em] uppercase text-sm font-light">Click the core to initialize</p>
      </div>
    </div>
  );
}