import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell, User, Globe, Eye, Type } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import NotificationModal from "./NotificationModal";
import navigationData from "@/translations/navigation.json";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi" | "mr" | "gu">("en");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const buttonHighContrastStyle = "text-blue-400 border-blue-400 bg-black";

  // Load settings from localStorage
  useEffect(() => {
    const storedContrast = localStorage.getItem("highContrast");
    const storedLanguage = localStorage.getItem("language") as
      | "en"
      | "hi"
      | "mr"
      | "gu"
      | null;
    const token = localStorage.getItem("authToken");

    if (storedContrast === "true") {
      setIsHighContrast(true);
    }

    if (storedLanguage && ["en", "hi", "mr", "gu"].includes(storedLanguage)) {
      setLanguage(storedLanguage);
    }

    setIsLoggedIn(!!token);
  }, []);

  // Save high contrast setting
  useEffect(() => {
    localStorage.setItem("highContrast", isHighContrast ? "true" : "false");
  }, [isHighContrast]);

  const changeLanguage = (lang: "en" | "hi" | "mr" | "gu") => {
    localStorage.setItem("language", lang);
    window.location.reload(); // Force full reload to apply new language everywhere
  };

  const toggleAccessibility = (type: "contrast" | "font") => {
    if (type === "contrast") {
      setIsHighContrast((prev) => !prev);
    } else {
      setIsLargeFont((prev) => !prev);
    }
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 ${
          isHighContrast
            ? "bg-black text-white border-blue-400"
            : "bg-background/80 text-foreground border-border"
        } backdrop-blur-md border-b transition-colors duration-300 ${
          isLargeFont ? "text-lg" : "text-base"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-civic flex items-center justify-center">
                <span className="text-white font-bold text-sm">CR</span>
              </div>
              <span className="text-xl font-bold text-gradient">CivicReport</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`hover:text-primary transition-colors ${
                  isHighContrast ? "text-blue-400" : "text-foreground"
                }`}
              >
                {navigationData[language].home}
              </Link>
              <Link
                to="/report"
                className={`hover:text-primary transition-colors ${
                  isHighContrast ? "text-blue-400" : "text-foreground"
                }`}
              >
                {navigationData[language].reportIssue}
              </Link>
              <Link
                to="/dashboard"
                className={`hover:text-primary transition-colors ${
                  isHighContrast ? "text-blue-400" : "text-foreground"
                }`}
              >
                {navigationData[language].dashboard}
              </Link>
              <Link
                to="/track-reports"
                className={`hover:text-primary transition-colors ${
                  isHighContrast ? "text-blue-400" : "text-foreground"
                }`}
              >
                {navigationData[language].trackReports}
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${isHighContrast ? buttonHighContrastStyle : ""}`}
                  >
                    <Globe className="w-4 h-4" />
                    {navigationData[language].language}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => changeLanguage("en")}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("hi")}>
                    हिंदी (Hindi)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("mr")}>
                    मराठी (Marathi)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("gu")}>
                    ગુજરાતી (Gujarati)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Accessibility Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${isHighContrast ? buttonHighContrastStyle : ""}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => toggleAccessibility("contrast")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {isHighContrast ? "Normal Contrast" : "High Contrast"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toggleAccessibility("font")}
                  >
                    <Type className="w-4 h-4 mr-2" />
                    {isLargeFont ? "Normal Font" : "Large Font"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className={`relative ${
                  isHighContrast ? buttonHighContrastStyle : ""
                }`}
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emergency rounded-full"></span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${isHighContrast ? buttonHighContrastStyle : ""}`}
                  >
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
                className={`${isHighContrast ? buttonHighContrastStyle : ""}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              className={`md:hidden py-4 border-t ${
                isHighContrast ? "border-blue-400" : "border-border"
              }`}
            >
              <div className="flex flex-col space-y-3">
                <Link
                  to="/"
                  className={`hover:text-primary transition-colors px-3 py-2 ${
                    isHighContrast ? "text-blue-400" : "text-foreground"
                  }`}
                >
                  {navigationData[language].home}
                </Link>
                <Link
                  to="/report"
                  className={`hover:text-primary transition-colors px-3 py-2 ${
                    isHighContrast ? "text-blue-400" : "text-foreground"
                  }`}
                >
                  {navigationData[language].reportIssue}
                </Link>
                <Link
                  to="/dashboard"
                  className={`hover:text-primary transition-colors px-3 py-2 ${
                    isHighContrast ? "text-blue-400" : "text-foreground"
                  }`}
                >
                  {navigationData[language].dashboard}
                </Link>
                <Link
                  to="/track-reports"
                  className={`hover:text-primary transition-colors px-3 py-2 ${
                    isHighContrast ? "text-blue-400" : "text-foreground"
                  }`}
                >
                  {navigationData[language].trackReports}
                </Link>

                <div className="flex items-center justify-between px-3 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={isHighContrast ? buttonHighContrastStyle : ""}
                    onClick={() =>
                      changeLanguage(language === "en" ? "hi" : "en")
                    }
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
                </div>

                <div className="px-3">
                  <Button
                    className={`btn-civic w-full ${
                      isHighContrast ? buttonHighContrastStyle : ""
                    }`}
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
