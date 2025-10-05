import { ChevronRight } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Create a Template",
      description: "Build your custom research framework with our intuitive template builder."
    },
    {
      number: "02", 
      title: "Save & Organize Notes",
      description: "Capture insights and organize them by ticker, sector, or custom categories."
    },
    {
      number: "03",
      title: "Get AI Insights", 
      description: "Let our AI analyze filings and generate actionable investment insights."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It <span className="text-red-500">Works</span></h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get started with our simple 3-step process and transform your research workflow.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                {step.number}
              </div>
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 transform translate-x-full">
                  <ChevronRight className="w-8 h-8 text-red-500/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}