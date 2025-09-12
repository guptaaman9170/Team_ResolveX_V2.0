import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import indexData from "@/translations/indexPage.json";

const Index = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const newLang = localStorage.getItem("language") || "en";
      setLanguage(newLang);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const data = indexData[language];

  return (
    <div className="min-h-screen">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        {data.skipLink}
      </a>

      <Navigation />

      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-civic flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CR</span>
                </div>
                <span className="text-xl font-bold text-gradient">{data.footer.about.title}</span>
              </div>
              <p className="text-muted-foreground text-sm">{data.footer.about.description}</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">{data.footer.platform.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/report" className="hover:text-primary transition-colors">{data.footer.platform.links.reportIssue}</a></li>
                <li><a href="/dashboard" className="hover:text-primary transition-colors">{data.footer.platform.links.dashboard}</a></li>
                <li><a href="/track" className="hover:text-primary transition-colors">{data.footer.platform.links.trackReports}</a></li>
                <li><a href="/community" className="hover:text-primary transition-colors">{data.footer.platform.links.community}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">{data.footer.support.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/help" className="hover:text-primary transition-colors">{data.footer.support.links.helpCenter}</a></li>
                <li><a href="/tutorials" className="hover:text-primary transition-colors">{data.footer.support.links.videoTutorials}</a></li>
                <li><a href="/accessibility" className="hover:text-primary transition-colors">{data.footer.support.links.accessibility}</a></li>
                <li><a href="/contact" className="hover:text-primary transition-colors">{data.footer.support.links.contactUs}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">{data.footer.legal.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/privacy" className="hover:text-primary transition-colors">{data.footer.legal.links.privacy}</a></li>
                <li><a href="/terms" className="hover:text-primary transition-colors">{data.footer.legal.links.terms}</a></li>
                <li><a href="/cookies" className="hover:text-primary transition-colors">{data.footer.legal.links.cookies}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>{data.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
