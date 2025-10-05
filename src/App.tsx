import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/home/Navbar';
import HeroSection from './components/home/HeroSection';
import FeaturesSection from './components/home/FeaturesSection';
import HowItWorksSection from './components/home/HowItWorksSection';
import PricingSection from './components/home/PricingSection';
import TestimonialsSection from './components/home/TestimonialsSection';
import Footer from './components/shared/Footer';
import SignUpPage from './components/auth/SignUpPage';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import ChatBubble from './components/shared/ChatBubble';
import AboutPage from './components/legal/AboutPage';
import ReviewsPage from './components/legal/ReviewsPage';
import TermsPage from './components/legal/TermsPage';
import PrivacyPage from './components/legal/PrivacyPage';
import SecurityPage from './components/legal/SecurityPage';
import CompliancePage from './components/legal/CompliancePage';
import ContactPage from './components/legal/ContactPage';
import CreateTemplate from './components/templates/CreateTemplate';
import TemplateViewer from './components/templates/TemplateViewer';
import AIAnalysis from './components/templates/AIAnalysis';
import SuccessPage from './components/SuccessPage';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function HomePage() {
  const location = useLocation();
  
  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <Footer />
    </>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">
            <span className="text-white">Fintra</span>
            <span className="text-red-500">AI</span>
          </div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <SignUpPage />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-template" element={
            <ProtectedRoute>
              <CreateTemplate />
            </ProtectedRoute>
          } />
          <Route path="/template/:id" element={
            <ProtectedRoute>
              <TemplateViewer />
            </ProtectedRoute>
          } />
          <Route path="/ai-analysis" element={
            <ProtectedRoute>
              <AIAnalysis />
            </ProtectedRoute>
          } />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
        <ChatBubble />
      </div>
    </Router>
  );
}

export default App;