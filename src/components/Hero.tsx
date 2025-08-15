import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import TesseractAnimation from "./TesseractAnimation";
import { useEffect, useState } from "react";

interface HeroProps {
  onJoinWaitlist: () => void;
}

const Hero = ({
  onJoinWaitlist
}: HeroProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const messages = [
    "Analyzing infrastructure patterns and making autonomous decisions...",
    "Proactively reconfiguring systems before issues arise...",
    "Learning from incidents to prevent future occurrences...",
    "Negotiating with cloud providers for optimal pricing...",
    "Coordinating complex multi-service deployments independently...",
    "Adapting infrastructure strategy based on business metrics...",
    "Making architectural decisions without human oversight...",
    "Continuously evolving its operational intelligence..."
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isTyping) {
      const currentMessage = messages[currentMessageIndex];
      if (displayedText.length < currentMessage.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentMessage.slice(0, displayedText.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 30);
      } else {
        timeout = setTimeout(() => {
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
          setIsTyping(true);
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, currentMessageIndex, messages]);

  return <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-black">
      {/* Top Content Section */}
      <div className="relative z-20 text-center max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-black/50 text-gray-300 mb-8">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Autonomous Infrastructure Agent</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          <span className="text-white">ChatKube</span>
          <br />
          <span className="text-gray-300">
            Manages Your Infrastructure
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          The first autonomous agent that monitors, optimizes, and maintains your cloud infrastructure 24/7. No more manual interventions, no more downtime.
        </p>
      </div>

      {/* Tesseract Animation Section */}
      <div className="relative z-10 w-full max-w-4xl mx-auto mb-8">
        <div className="relative h-96 w-full">
          <TesseractAnimation className="rounded-lg" />
        </div>
        
        {/* Ghost Typing Animation */}
        <div className="relative z-15 text-center mt-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-700 bg-black/30 text-gray-300 font-mono text-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="min-w-[400px] text-left">
              {displayedText}
              <span className={`inline-block w-2 h-6 bg-gray-400 ml-1 ${isTyping ? 'animate-pulse' : ''}`}></span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Bottom Content Section */}
      <div className="relative z-20 text-center max-w-4xl mx-auto">
        <div className="flex justify-center items-center">
          <Button 
            size="lg" 
            onClick={onJoinWaitlist} 
            className="group bg-white text-black hover:bg-gray-200 font-semibold"
          >
            Join the Waitlist
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>;
};
export default Hero;