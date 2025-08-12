import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
interface HeroProps {
  onJoinWaitlist: () => void;
}
const Hero = ({
  onJoinWaitlist
}: HeroProps) => {
  return <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary mb-8">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Autonomous Infrastructure Agent</span>
        </div>
        
        <div className="flex flex-col items-center mb-8">
          <img src="/lovable-uploads/b5adf042-4274-45f6-a32a-dc365ec6f997.png" alt="QR Code to join ChatKube waitlist" className="w-64 h-64 mb-4" />
          <p className="text-sm text-muted-foreground">Scan to join waitlist</p>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          <span className="bg-gradient-hero bg-clip-text text-transparent">ChatKube</span>
          <br />
          <span className="text-foreground">
            Manages Your Infrastructure
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          The first autonomous agent that monitors, optimizes, and maintains your cloud infrastructure 24/7. No more manual interventions, no more downtime.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button variant="hero" size="lg" onClick={onJoinWaitlist} className="group">
            Join the Waitlist
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-primary/20 hover:border-primary/40"
            onClick={() => {
              const featuresSection = document.querySelector('section:nth-of-type(2)');
              featuresSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>;
};
export default Hero;