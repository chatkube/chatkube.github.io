import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Mail, User, Building, Wrench, AlertTriangle, ArrowRight, ArrowLeft, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WaitlistFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// DevOps domains based on the table you provided
const DEVOPS_DOMAINS = [
  { value: "ci-cd", label: "CI/CD (Continuous Integration/Delivery)" },
  { value: "iac", label: "Infrastructure as Code (IaC)" },
  { value: "containerization", label: "Containerization & Orchestration" },
  { value: "config-management", label: "Configuration Management" },
  { value: "observability", label: "Observability & Monitoring" },
  { value: "artifact-management", label: "Artifact & Package Management" },
  { value: "security", label: "Security (DevSecOps)" },
  { value: "other", label: "Other" }
];



// Company size options
const COMPANY_SIZE_OPTIONS = [
  { value: "1-10", label: "1-10", description: "Startup" },
  { value: "11-50", label: "11-50", description: "Small" },
  { value: "51-200", label: "51-200", description: "Medium" },
  { value: "201-1000", label: "201-1000", description: "Large" },
  { value: "1000+", label: "1000+", description: "Enterprise" }
];



const EnhancedWaitlistForm = ({ isOpen, onClose }: WaitlistFormProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company_size: "",
    primary_devops_domain: [] as string[],
    tech_stack: ""
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDevOpsDomain = (value: string) => {
    setFormData(prev => ({
      ...prev,
      primary_devops_domain: prev.primary_devops_domain.includes(value)
        ? prev.primary_devops_domain.filter(item => item !== value)
        : [...prev.primary_devops_domain, value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Email is required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          company_size: formData.company_size || null,
          primary_devops_domain: formData.primary_devops_domain.length > 0 ? formData.primary_devops_domain.join(', ') : null,
          tech_stack: formData.tech_stack.trim() || null
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already on the waitlist!",
            description: "This email is already registered. We'll be in touch soon!",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        toast({
          title: "Welcome to the waitlist!",
          description: "We'll notify you when ChatKube is ready.",
        });
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = (e?: React.MouseEvent) => {
    e?.preventDefault(); // Prevent form submission
    e?.stopPropagation(); // Stop event bubbling
    
    // Validate required fields before allowing progression
    if (step === 1) {
      if (!formData.name.trim()) {
        toast({
          title: "Name is required",
          description: "Please enter your name to continue.",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.email.trim()) {
        toast({
          title: "Email is required",
          description: "Please enter your email address to continue.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setStep(prev => Math.min(prev + 1, 2));
  };
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Handle escape key to close form
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Name
        </Label>
                                   <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            required
            className={`bg-black/50 focus:border-primary/40 text-white placeholder-gray-400 ${
              step === 1 && !formData.name.trim() ? 'border-red-500' : 'border-gray-700'
            }`}
          />
      </div>
      
             <div className="space-y-2">
         <Label htmlFor="email" className="flex items-center gap-2">
           <Mail className="w-4 h-4" />
           Email
         </Label>
                                    <Input
             id="email"
             type="email"
             placeholder="your@email.com"
             value={formData.email}
             onChange={(e) => updateFormData('email', e.target.value)}
             required
             className={`bg-black/50 focus:border-primary/40 text-white placeholder-gray-400 ${
               step === 1 && !formData.email.trim() ? 'border-red-500' : 'border-gray-700'
             }`}
           />
       </div>

       <div className="space-y-2">
         <Label className="flex items-center gap-2">
           <Building className="w-4 h-4" />
           Company Size (Optional)
         </Label>
         <div className="grid grid-cols-2 gap-2">
           {COMPANY_SIZE_OPTIONS.map((option) => (
             <button
               key={option.value}
               type="button"
               onClick={() => updateFormData('company_size', option.value)}
               className={`p-3 rounded-lg border-2 transition-all ${
                 formData.company_size === option.value
                   ? 'border-gradient-border bg-black/80 text-white'
                   : 'border-gray-700 hover:border-primary/40 bg-black/50 text-gray-300'
               }`}
             >
               <div className="font-medium">{option.label}</div>
               <div className="text-xs text-muted-foreground">{option.description}</div>
             </button>
           ))}
         </div>
       </div>

             
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
            <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Wrench className="w-4 h-4" />
          What DevOps domains do you work in?
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {DEVOPS_DOMAINS.map((domain) => (
            <button
              key={domain.value}
              type="button"
              onClick={() => toggleDevOpsDomain(domain.value)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                formData.primary_devops_domain.includes(domain.value)
                  ? 'border-gradient-border bg-black/80 text-white'
                  : 'border-gray-700 hover:border-primary/40 bg-black/50 text-gray-300'
              }`}
            >
              <div className="font-medium">{domain.label}</div>
            </button>
          ))}
        </div>
      </div>

            <div className="space-y-2">
        <Label>What technologies are you currently using?</Label>
        <Textarea
          placeholder="Docker, Kubernetes, AWS, Terraform, GitHub Actions, Prometheus, Grafana..."
          value={formData.tech_stack}
          onChange={(e) => updateFormData('tech_stack', e.target.value)}
          className="bg-black/50 border-gray-700 focus:border-primary/40 text-white placeholder-gray-400 min-h-[100px]"
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      default: return renderStep1();
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Basic Information";
      case 2: return "Your DevOps Domain";
      default: return "Basic Information";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return "Let's start with some basic information about you and your company.";
      case 2: return "Tell us about your primary DevOps focus and current tech stack.";
      default: return "Let's start with some basic information about you and your company.";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black/95 backdrop-blur-md border-2 border-gradient-border shadow-card max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
        <CardHeader className="text-center">
          {isSubmitted ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">You're on the list!</CardTitle>
              <CardDescription>
                Thank you for sharing your DevOps challenges with us. We'll use this information to build exactly what you need and notify you when ChatKube is ready.
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-2xl text-white font-bold">
                Join the Waitlist
              </CardTitle>
              <CardDescription>
                {getStepDescription()}
              </CardDescription>
              
              {/* Progress indicator */}
              <div className="flex justify-center mt-4">
                <div className="flex space-x-2">
                  {[1, 2].map((stepNumber) => (
                    <div
                      key={stepNumber}
                      className={`w-3 h-3 rounded-full ${
                        stepNumber <= step ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </CardHeader>
        
        <CardContent>
          {isSubmitted ? (
            <Button 
              onClick={onClose} 
              className="w-full" 
              variant="outline"
            >
              Close
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStepContent()}
              
              <div className="flex gap-3 pt-4">
                                 {step > 1 && (
                   <Button
                     type="button"
                     variant="outline"
                     onClick={prevStep}
                     className="flex-1 border-gray-700 hover:border-primary/40 bg-black/50 text-white"
                     disabled={isLoading}
                   >
                     <ArrowLeft className="w-4 h-4 mr-2" />
                     Back
                   </Button>
                 )}
                
                {step < 2 ? (
                  <Button
                    type="button"
                    variant="hero"
                    onClick={nextStep}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="hero"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Joining..." : "Join Waitlist"}
                  </Button>
                )}
                
                                 {step === 1 && (
                   <Button
                     type="button"
                     variant="outline"
                     onClick={onClose}
                     className="flex-1 border-gray-700 hover:border-primary/40 bg-black/50 text-white"
                     disabled={isLoading}
                   >
                     Cancel
                   </Button>
                 )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedWaitlistForm; 