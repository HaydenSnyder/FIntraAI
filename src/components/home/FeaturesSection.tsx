import { FileText, Brain, Target, BarChart3 } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Save Unlimited Templates",
      description: "Create and save research templates for any stock analysis. Never lose your methodology again."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Summaries of 10-K / 10-Q",
      description: "Get instant AI-powered insights from SEC filings. Save hours of manual reading and analysis."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Organize by Ticker & Sector",
      description: "Keep your research organized with smart categorization by company ticker and industry sector."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Track performance metrics and get automated alerts on your portfolio companies."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features for <span className="text-red-500">Smart Investors</span></h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to conduct thorough stock research and make informed investment decisions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-black/80 border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 hover:scale-105 group">
              <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}