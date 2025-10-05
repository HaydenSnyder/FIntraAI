import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Zap, Brain } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold hover:opacity-80 transition-opacity duration-200"
          >
            <span className="text-white">Fintra</span>
            <span className="text-red-500">AI</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">About <span className="text-red-500">Us</span></h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transforming how investors conduct stock research, one template at a time.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              Stock research is messy. Investors waste hours digging through 10-Ks and 10-Qs, 
              copy-pasting notes, and juggling tools that weren't built for real analysis. 
              We decided to change that.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300">
              <div className="text-red-500 mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Templates</h3>
              <p className="text-gray-400">
                Save and organize company research in structured, reusable formats.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300">
              <div className="text-red-500 mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Centralized Workspace</h3>
              <p className="text-gray-400">
                Keep all your analysis in one place, always accessible.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300">
              <div className="text-red-500 mb-4">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
              <p className="text-gray-400">
                Automatically extract and summarize key points from SEC filings so you focus on decisions, not data entry.
              </p>
            </div>
          </div>
        </div>

        {/* Who We Serve */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-semibold mb-6">Who We Serve</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Whether you're a student learning markets, a retail investor, or a professional analyst, 
            this tool is designed to make your workflow faster, clearer, and sharper.
          </p>
        </div>

        {/* Mission */}
        <div className="text-center bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-8">
          <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            We believe research should be simple, structured, and powerful. 
            That's exactly what we're building here—one template at a time.
          </p>
        </div>
      </main>
    </div>
  );
}