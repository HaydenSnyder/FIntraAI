import { useNavigate } from 'react-router-dom';
import { ChevronRight, Play } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-900/20"></div>
      
      {/* Animated Stock Charts */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="charts-container">
          <div className="chart chart-1">
            <div className="chart-line"></div>
            <div className="chart-bars">
              <div className="bar bar-1"></div>
              <div className="bar bar-2"></div>
              <div className="bar bar-3"></div>
              <div className="bar bar-4"></div>
              <div className="bar bar-5"></div>
            </div>
          </div>
          <div className="chart chart-2">
            <div className="chart-line chart-line-2"></div>
            <div className="chart-dots">
              <div className="dot dot-1"></div>
              <div className="dot dot-2"></div>
              <div className="dot dot-3"></div>
              <div className="dot dot-4"></div>
            </div>
          </div>
          <div className="chart chart-3">
            <div className="candlestick candlestick-1"></div>
            <div className="candlestick candlestick-2"></div>
            <div className="candlestick candlestick-3"></div>
            <div className="candlestick candlestick-4"></div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Organize Your
            <span className="block text-red-500">Stock Research.</span>
            <span className="text-4xl md:text-5xl text-gray-300">Smarter.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Save templates, track companies, and get insights from SEC filings — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-red-500/25 hover:scale-105"
            >
              Start Free
              <ChevronRight className="inline-block ml-2 w-5 h-5" />
            </button>
            <button className="border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}