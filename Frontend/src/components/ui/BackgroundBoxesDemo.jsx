import React from "react";
import { Boxes } from "./background-boxes";
import { ChatBot } from "./ChatBot";

export function BackgroundBoxesDemo() {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-900 flex items-center justify-center">
      {/* Masked overlay for glow/fade effect */}
      <div className="absolute inset-0 bg-slate-900 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      
      {/* Animated Background Boxes */}
      <Boxes />

      {/* ChatBot Component */}
      <ChatBot />
    </div>
  );
}
