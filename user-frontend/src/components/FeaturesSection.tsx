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
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

const mapCenter: [number, number] = [23.3441, 85.3096]; // Ranchi, Jharkhand

const issuesData = [
  { type: "Pothole", description: "Large pothole near Main Road, Ranchi", lat: 23.3441, lng: 85.3096 },
  { type: "Road Blockage", description: "Fallen tree blocking Ranchi-Bokaro highway", lat: 23.351, lng: 85.302 },
  { type: "Drainage Issue", description: "Waterlogging near Circular Road, Ranchi", lat: 23.348, lng: 85.315 },
  { type: "Pothole", description: "Small pothole near Ranchi station", lat: 23.341, lng: 85.305 },
  { type: "Road Blockage", description: "Under maintenance near Kanke Road", lat: 23.339, lng: 85.310 },
   { type: "Street Light Failure", description: "No lighting at night near Lalpur Chowk", lat: 23.336, lng: 85.310 },
  { type: "Garbage Overflow", description: "Overflowing garbage bin near Morhabadi Market", lat: 23.347, lng: 85.320 },
  { type: "Traffic Signal Malfunction", description: "Traffic signal not working at Main Road intersection", lat: 23.3435, lng: 85.308 },
  { type: "Illegal Parking", description: "Vehicles parked illegally blocking footpath near Kanke Road", lat: 23.340, lng: 85.313 },
  { type: "Sidewalk Damage", description: "Broken sidewalk causing hazard near Ranchi station", lat: 23.3415, lng: 85.306 },
];

const FeaturesSection = () => {
  const language = (localStorage.getItem("language") as "en" | "hi" | "mr" | "gu") || "en";
  const data = featuresData[language];

  const featureIcons = [Brain, Users, Camera, MapPin, Globe, Eye];
  const statsIcons = [CheckCircle, Users, Clock, Globe];

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "Pothole":
        return <MapPin className="w-5 h-5 text-red-600" />;
      case "Road Blockage":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "Drainage Issue":
        return <Camera className="w-5 h-5 text-red-600" />;
      default:
        return <MapPin className="w-5 h-5 text-red-600" />;
    }
  };

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



         {/* Real-Time Map Section */}
        <h2 className="text-3xl font-bold text-foreground text-center mb-8">
          Real-Time Geographical Issue Tracker
        </h2>

        <Card className="rounded-2xl shadow-elevated overflow-hidden mb-10">
          <CardContent className="p-0 relative">
            <MapContainer
              center={mapCenter}
              zoom={12}
              scrollWheelZoom={false}
              className="w-full h-[500px]"
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MarkerClusterGroup
                iconCreateFunction={(cluster) => {
                  return L.divIcon({
                    html: `<div style="
                      background-color: #ff0000;
                      color: white;
                      border-radius: 50%;
                      width: 40px;
                      height: 40px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-weight: bold;
                      border: 2px solid white;
                      box-shadow: 0 0 10px rgba(0,0,0,0.4);
                    ">${cluster.getChildCount()}</div>`,
                    className: "custom-cluster-icon",
                  });
                }}
              >
                {issuesData.map((issue, index) => (
                  <Marker
                    key={index}
                    position={[issue.lat, issue.lng]}
                    icon={L.divIcon({
                      html: `<div style="
                        background-color: ${issue.type === "Pothole" ? "#ff0000" : issue.type === "Road Blockage" ? "#ff0000" : "#ff0000"};
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        border: 2px solid white;
                        box-shadow: 0 0 6px rgba(0,0,0,0.5);
                      "></div>`,
                      className: "",
                    })}
                  >
                    <Popup>
                      <div className="flex items-center gap-2">
                        {getIssueIcon(issue.type)}
                        <div>
                          <h4 className="font-semibold text-foreground">{issue.type}</h4>
                          <p className="text-muted-foreground text-sm">{issue.description}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-background p-4 rounded-lg shadow-lg space-y-2 border border-muted-foreground/20">
              <h4 className="font-semibold text-foreground">Legend</h4>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-semibold">Pothole</span>
              </div>
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="text-orange-600 font-semibold">Road Blockage</span>
              </div>
              <div className="flex items-center gap-4">
                <Camera className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-semibold">Drainage Issue</span>
              </div>
            </div>
          </CardContent>
        </Card>



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
