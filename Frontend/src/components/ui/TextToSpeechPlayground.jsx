import React, { useState, useEffect, useContext, useRef } from "react";
import { Boxes } from "./background-boxes";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const styles = [
  { value: "conversational", label: "Conversational", icon: "😊" },
  { value: "formal", label: "Formal", icon: "📜" },
  { value: "casual", label: "Casual", icon: "😎" },
];

function StyleDropdown({ value, setValue }) {
  const [open, setOpen] = useState(false);
  const selected = styles.find(s => s.value === value) || styles[0];
  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-2 bg-[#23234a] text-white px-4 py-2 rounded-full shadow"
        onClick={() => setOpen(o => !o)}
      >
        <span>{selected.icon}</span>
        <span>{selected.label}</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 z-20 bg-[#23234acc] rounded-xl shadow-lg w-56 border border-[#23234a]">
          {styles.map(style => (
            <button
              key={style.value}
              className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-[#18182f]"
              onClick={() => {
                setValue(style.value);
                setOpen(false);
              }}
            >
              <span>{style.icon}</span>
              <span>{style.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CustomAudioPlayer({ audioUrl, onError }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e) => {
      setIsLoading(false);
      onError(e);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [onError]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Playback error:", error);
        onError(error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-6 bg-[#18182fcc] rounded-xl p-4 backdrop-blur-sm">
      <audio
        ref={audioRef}
        src={audioUrl}
        onError={onError}
        className="hidden"
      />
      
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <svg className="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : isPlaying ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSliderChange}
              disabled={isLoading}
              className={`flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <span className="text-sm text-gray-400">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TextToSpeechPlayground() {
  const { backendUrl, token, credit, loadCreditsData } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [text, setText] = useState("");
  const [style, setStyle] = useState(styles[0].value);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  const handleGenerate = async (isRetry = false) => {
    if (!text.trim()) return;
    
    if (!token) {
      toast.error("Please login to use this feature");
      navigate("/");
      return;
    }

    if (credit <= 0) {
      toast.error("You have no credits left!");
      navigate("/app/buy");
      return;
    }
    
    if (!isRetry) {
      setRetryCount(0);
    }
    
    setLoading(true);
    setError(null);
    if (!isRetry) {
      setAudioUrl(null);
    }
    
    try {
      console.log("Sending request to:", `${backendUrl}/api/tts/generate`);
      console.log("Request headers:", { 
        "Content-Type": "application/json",
        "Accept": "application/json",
        "token": token 
      });
      console.log("Request body:", { text: text.trim(), style });

      const res = await fetch(`${backendUrl}/api/tts/generate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "token": token
        },
        body: JSON.stringify({ 
          text: text.trim(),
          style 
        }),
      });
      
      console.log("Response status:", res.status);
      console.log("Response headers:", Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        const errorData = await res.text();
        console.log("Error response:", errorData);
        let errorMessage;
        try {
          const jsonError = JSON.parse(errorData);
          errorMessage = jsonError.error || jsonError.message || "Server error occurred";
          
          // Handle specific error cases
          if (res.status === 429) {
            errorMessage = "The text-to-speech service is currently at capacity. Please try again later.";
            toast.error(errorMessage);
          } else if (res.status === 504 && retryCount < MAX_RETRIES) {
            setRetryCount(prev => prev + 1);
            toast.info(`Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
            // Wait for 2 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
            return handleGenerate(true);
          }
        } catch {
          errorMessage = `Server error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("Success response:", data);
      
      if (!data.audioUrl) {
        throw new Error("No audio URL received from server");
      }
      
      setAudioUrl(data.audioUrl);
      loadCreditsData(); // Refresh credit balance
      toast.success("Speech generated successfully!");
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate speech. Please try again.");
      toast.error(err.message || "Failed to generate speech");
    } finally {
      setLoading(false);
    }
  };

  // Cleanup audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8">
      {/* Background Boxes */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-slate-900 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />
      </div>

      <div className="relative w-full max-w-2xl rounded-xl shadow-lg p-8 z-20" style={{backdropFilter: 'blur(8px)'}}>
        <h1 className="text-3xl font-bold text-white mb-4">Dia Text-to-Speech Playground</h1>
        <p className="text-gray-300 mb-4">Powered by CreativeMndAI Dia-1.6B model</p>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-300">Available Credits: {credit}</p>
          {credit <= 0 && (
            <button 
              onClick={() => navigate("/app/buy")}
              className="text-blue-400 hover:text-blue-300"
            >
              Buy Credits
            </button>
          )}
        </div>
        
        <textarea
          className="w-full p-4 rounded-lg bg-[#18182fcc] text-white mb-4"
          rows={5}
          maxLength={500}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter your text here... (The model will generate speech in a conversational style)"
        />
        
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <StyleDropdown value={style} setValue={setStyle} />
          
          <button
            onClick={() => handleGenerate(false)}
            className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:from-purple-600 hover:to-pink-600 min-w-[120px]"
            disabled={loading || !text.trim() || credit <= 0}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Generating{retryCount > 0 ? ` (Retry ${retryCount}/${MAX_RETRIES})` : '...'}</span>
              </div>
            ) : (
              "Generate"
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
            {retryCount < MAX_RETRIES && error.includes("timeout") && (
              <button
                onClick={() => handleGenerate(true)}
                className="mt-2 text-sm text-red-200 hover:text-red-100 underline"
              >
                Click here to retry
              </button>
            )}
          </div>
        )}

        {audioUrl && (
          <CustomAudioPlayer 
            audioUrl={audioUrl}
              onError={(e) => {
                console.error("Audio playback error:", e);
                setError("Failed to play audio. Please try again.");
              toast.error("Failed to play audio");
              }}
            />
        )}
      </div>
    </div>
  );
}
