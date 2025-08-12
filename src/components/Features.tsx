import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Brain, Clock, CloudCog, TrendingUp } from "lucide-react";
const Features = () => {
  const features = [{
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Advanced machine learning algorithms continuously learn from your infrastructure patterns and optimize performance."
  }, {
    icon: Shield,
    title: "Proactive Security",
    description: "Automatically detects vulnerabilities and implements security patches before threats can impact your systems."
  }, {
    icon: Zap,
    title: "Auto-Scaling",
    description: "Intelligently scales resources up or down based on real-time demand, optimizing costs and performance."
  }, {
    icon: Clock,
    title: "24/7 Monitoring",
    description: "Never sleep again worrying about your infrastructure. ChatKube monitors everything around the clock."
  }, {
    icon: CloudCog,
    title: "Multi-Cloud Support",
    description: "Works seamlessly across AWS, Azure, GCP, and hybrid environments with unified management."
  }, {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Forecasts potential issues and resource needs, allowing you to stay ahead of problems before they occur."
  }];
  return <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Why Choose <span className="bg-gradient-hero bg-clip-text text-transparent">ChatKube</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for modern teams who demand reliability, efficiency, and peace of mind from their infrastructure.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-card group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};
export default Features;