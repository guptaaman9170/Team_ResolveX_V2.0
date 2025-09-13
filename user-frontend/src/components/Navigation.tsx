import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import NotificationModal from "./NotificationModal";
import navigationData from "@/translations/navigation.json";
import logoImg from "@/assets/logo.png";
// Lucide icons
import {
  Menu,
  X,
  Bell,
  User,
  Globe,
  Eye,
  Type,
  Accessibility,
} from "lucide-react";

// Ensure OpenDyslexic is loaded globally (see README for font import)

// Add to your index.css or global stylesheet:
/*
@font-face {
  font-family: 'OpenDyslexic';
  src: url('/assets/OpenDyslexic-Regular.woff2') format('woff2'),
       url('/assets/OpenDyslexic-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
.dyslexic-font * {
  font-family: 'OpenDyslexic', Arial, Helvetica, sans-serif !important;
}
*/

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi" | "mr" | "gu">("en");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);

  const navigate = useNavigate();
  const buttonHighContrastStyle = "text-blue-400 border-blue-400 bg-black";

  useEffect(() => {
    const storedContrast = localStorage.getItem("highContrast");
    const storedLanguage = localStorage.getItem("language") as
      | "en"
      | "hi"
      | "mr"
      | "gu"
      | null;
    const token = localStorage.getItem("authToken");
    const storedDyslexic = localStorage.getItem("dyslexicFont");

    if (storedContrast === "true") setIsHighContrast(true);
    if (storedLanguage && ["en", "hi", "mr", "gu"].includes(storedLanguage)) setLanguage(storedLanguage);
    setIsLoggedIn(!!token);
    if (storedDyslexic === "true") setIsDyslexicFont(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("highContrast", isHighContrast ? "true" : "false");
  }, [isHighContrast]);

  useEffect(() => {
    localStorage.setItem("dyslexicFont", isDyslexicFont ? "true" : "false");
    if (isDyslexicFont) {
      document.body.classList.add("dyslexic-font");
    } else {
      document.body.classList.remove("dyslexic-font");
    }
  }, [isDyslexicFont]);

  const changeLanguage = (lang: "en" | "hi" | "mr" | "gu") => {
    localStorage.setItem("language", lang);
    window.location.reload();
  };

  const toggleAccessibility = (type: "contrast" | "font") => {
    if (type === "contrast") {
      setIsHighContrast((prev) => !prev);
    } else {
      setIsLargeFont((prev) => !prev);
    }
  };

  const handleLogin = () => navigate("/auth");
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 ${isHighContrast ? "bg-black text-white border-blue-400" : "bg-background/80 text-foreground border-border"
          } backdrop-blur-md border-b transition-colors duration-300 ${isLargeFont ? "text-lg" : "text-base"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img
                src={logoImg}
                alt="CivicReport Logo"
                className="w-28 mt-2 h-auto object-contain"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={`hover:text-primary transition-colors ${isHighContrast ? "text-blue-400" : "text-foreground"}`}>
                {navigationData[language].home}
              </Link>
              <Link to="/report" className={`hover:text-primary transition-colors ${isHighContrast ? "text-blue-400" : "text-foreground"}`}>
                {navigationData[language].reportIssue}
              </Link>
              <Link to="/dashboard" className={`hover:text-primary transition-colors ${isHighContrast ? "text-blue-400" : "text-foreground"}`}>
                {navigationData[language].dashboard}
              </Link>
              <Link to="/track-reports" className={`hover:text-primary transition-colors ${isHighContrast ? "text-blue-400" : "text-foreground"}`}>
                {navigationData[language].trackReports}
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className={isHighContrast ? buttonHighContrastStyle : ""}>
                    <Globe className="w-4 h-4" />
                    {navigationData[language].language}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => changeLanguage("en")}>English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("hi")}>हिंदी (Hindi)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("mr")}>मराठी (Marathi)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("gu")}>ગુજરાતી (Gujarati)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Accessibility Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className={isHighContrast ? buttonHighContrastStyle : ""}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => toggleAccessibility("contrast")}>
                    <Eye className="w-4 h-4 mr-2" />
                    {isHighContrast ? "Normal Contrast" : "High Contrast"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleAccessibility("font")}>
                    <Type className="w-4 h-4 mr-2" />
                    {isLargeFont ? "Normal Font" : "Large Font"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dyslexia Font Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className={isHighContrast ? buttonHighContrastStyle : ""}
                onClick={() => setIsDyslexicFont((prev) => !prev)}
                aria-label="Toggle dyslexia-friendly font"
              >
                <Accessibility className="w-4 h-4" />
                {isDyslexicFont ? "Normal Font" : "Dyslexia Font"}
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className={`relative ${isHighContrast ? buttonHighContrastStyle : ""}`}
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emergency rounded-full"></span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className={isHighContrast ? buttonHighContrastStyle : ""}>
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Login / Sign Out Button */}
              <Button
                className={`btn-civic ${isHighContrast ? buttonHighContrastStyle : ""}`}
                onClick={isLoggedIn ? handleLogout : handleLogin}
              >
                {isLoggedIn
                  ? navigationData[language].signOut
                  : navigationData[language].login}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className={isHighContrast ? buttonHighContrastStyle : ""}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className={`md:hidden py-4 border-t ${isHighContrast ? "border-blue-400" : "border-border"}`}>
              <div className="flex flex-col space-y-3">
                <Link to="/" className={`hover:text-primary transition-colors px-3 py-2 ${isHighContrast ? "text-blue-400" : "text-foreground"}`}>
                  {navigationData[language].home}
                </Link>
                <Link to="/report" className={`hover:text-primary transition-colors px-3 py-2 ${isHighContrast ? "text-blue-400" : "text-foreground"}`}>
                  {navigationData[language].reportIssue}
                </Link>
                <Link to="/dashboard" className={`hover:text-primary transition-colors px-3 py-2 ${isHighContrast ? "text-blue-400" : "text-foreground"}`}>
                  {navigationData[language].dashboard}
                </Link>
                <Link to="/track-reports" className={`hover:text-primary transition-colors px-3 py-2 ${isHighContrast ? "text-blue-400" : "text-foreground"}`}>
                  {navigationData[language].trackReports}
                </Link>

                <div className="flex items-center justify-between px-3 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={isHighContrast ? buttonHighContrastStyle : ""}
                    onClick={() => changeLanguage(language === "en" ? "hi" : "en")}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {navigationData[language].language}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={isHighContrast ? buttonHighContrastStyle : ""}
                    onClick={() => toggleAccessibility("contrast")}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={isHighContrast ? buttonHighContrastStyle : ""}
                    onClick={() => setIsDyslexicFont((prev) => !prev)}
                    aria-label="Toggle dyslexia-friendly font"
                  >
                    <Accessibility className="w-4 h-4" />
                  </Button>
                </div>

                <div className="px-3">
                  <Button
                    className={`btn-civic w-full ${isHighContrast ? buttonHighContrastStyle : ""}`}
                    onClick={isLoggedIn ? handleLogout : handleLogin}
                  >
                    {isLoggedIn
                      ? navigationData[language].signOut
                      : navigationData[language].login}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
};

export default Navigation;
