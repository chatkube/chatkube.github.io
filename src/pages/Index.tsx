import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Hero from "@/components/Hero";
import EnhancedWaitlistForm from "@/components/EnhancedWaitlistForm";
import { LogOut, Calendar, ChevronDown } from "lucide-react";

const Index = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showCalendlyDropdown, setShowCalendlyDropdown] = useState(false);
  const { user, signOut } = useAuth();
  const calendlyRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendlyRef.current && !calendlyRef.current.contains(event.target as Node)) {
        setShowCalendlyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Replace these with your actual Calendly links
  const calendlyLinks = {
    jade: 'https://calendly.com/jadeyutseng/15min',
    chalmers: 'https://calendly.com/YOUR_CALENDLY/chalmers-15min'
  };

  const openCalendly = (founderKey: 'jade' | 'chalmers') => {
    if (window.Calendly) {
      try {
        window.Calendly.initPopupWidget({
          url: calendlyLinks[founderKey]
        });
      } catch (error) {
        // Fallback: open in new tab if popup fails
        window.open(calendlyLinks[founderKey], '_blank');
      }
    } else {
      // Fallback: open in new tab if Calendly not loaded
      window.open(calendlyLinks[founderKey], '_blank');
    }
    setShowCalendlyDropdown(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-4 right-4 z-50 flex gap-2">
        <div className="relative" ref={calendlyRef}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowCalendlyDropdown(!showCalendlyDropdown)}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book a Meeting
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
          
          {showCalendlyDropdown && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-black/95 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => openCalendly('jade')}
                  className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                >
                  <img 
                    src="/Jade.jpg" 
                    alt="Jade" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">Jade</div>
                    <div className="text-xs text-gray-400">15 min meeting</div>
                  </div>
                </button>
                <button
                  onClick={() => openCalendly('chalmers')}
                  className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                >
                  <img 
                    src="/Chalmers.jpg" 
                    alt="Chalmers" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">Chalmers</div>
                    <div className="text-xs text-gray-400">15 min meeting</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {user ? (
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        ) : (
          <Link to="/auth">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </nav>

      <Hero onJoinWaitlist={() => setShowWaitlist(true)} />
      <EnhancedWaitlistForm 
        isOpen={showWaitlist} 
        onClose={() => setShowWaitlist(false)} 
      />
    </div>
  );
};

export default Index;