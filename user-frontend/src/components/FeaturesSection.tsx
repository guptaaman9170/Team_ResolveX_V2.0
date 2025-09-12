import { 
  Brain, 
  Users, 
  Camera, 
  MapPin, 
  Globe, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import dashboardPreview from "@/assets/dashboard-preview.jpg";
import featuresData from "@/translations/featuresSection.json";

const FeaturesSection = () => {
  const language = (localStorage.getItem("language") as "en" | "hi" | "mr" | "gu") || "en";
  const data = featuresData[language];

  const featureIcons = [Brain, Users, Camera, MapPin, Globe, Eye];
  const statsIcons = [CheckCircle, Users, Clock, Globe];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {data.headerTitle}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {data.headerDescription}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {data.features.map((feature: any, index: number) => {
            const Icon = featureIcons[index];
            return (
              <Card key={index} className="card-civic hover:shadow-elevated transition-all duration-300">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dashboard Preview */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-6">
              {data.dashboardTitle}
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              {data.dashboardDescription}
            </p>
            
            <div className="space-y-4">
              {data.dashboardFeatures.map((feature: string, index: number) => {
                const StatIcon = statsIcons[index % statsIcons.length];
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <StatIcon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={dashboardPreview} 
              alt="Civic reporting dashboard interface"
              className="rounded-2xl shadow-elevated w-full"
            />
            <div className="absolute inset-0 bg-gradient-civic/10 rounded-2xl"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {data.stats.map((stat: any, index: number) => {
            const StatIcon = statsIcons[index % statsIcons.length];
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-civic flex items-center justify-center mx-auto mb-4">
                  <StatIcon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-3xl font-bold text-foreground mb-2">{stat.number}</h4>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
