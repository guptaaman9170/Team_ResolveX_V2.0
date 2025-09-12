import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import ReportPage from "./pages/ReportPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import TrackReportsPage from "./pages/TrackReportsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<AuthPage />} />

          {/* Main app pages */}
          <Route path="/index" element={<Index />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/track-reports" element={<TrackReportsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
