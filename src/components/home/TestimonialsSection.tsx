import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const allReviews = [
    {
      name: "Sarah Chen",
      content: "This platform has revolutionized how I conduct stock research. The AI summaries alone save me 10+ hours per week.",
      rating: 5
    },
    {
      name: "Michael Rodriguez", 
      content: "The template system is brilliant. I can standardize my research process and catch details I used to miss.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      content: "Finally, a tool that understands how investment professionals actually work. Intuitive and powerful.",
      rating: 5
    },
    {
      name: "David Kim",
      content: "The AI-powered SEC filing analysis is a game changer. I can process 10-Ks in minutes instead of hours.",
      rating: 5
    },
    {
      name: "Lisa Martinez",
      content: "Love how organized my research has become. The ticker and sector categorization is exactly what I needed.",
      rating: 5
    },
    {
      name: "James Wilson",
      content: "Best investment research tool I've used. The templates save me so much time and keep me consistent.",
      rating: 5
    },
    {
      name: "Rachel Green",
      content: "The platform is incredibly intuitive. My clients are impressed with the quality of my research reports now.",
      rating: 5
    },
    {
      name: "Alex Johnson",
      content: "Perfect for systematic research. The template system helps maintain consistency across all my analysis.",
      rating: 5
    },
    {
      name: "Maria Garcia",
      content: "This tool has transformed our research workflow. The AI insights are incredibly accurate and helpful.",
      rating: 5
    }
  ];

  const [currentReviews, setCurrentReviews] = useState(allReviews.slice(0, 3));

  useEffect(() => {
    const interval = setInterval(() => {
      // Get 3 random reviews from the pool
      const shuffled = [...allReviews].sort(() => 0.5 - Math.random());
      setCurrentReviews(shuffled.slice(0, 3));
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">User <span className="text-red-500">Reviews</span></h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See what our users are saying about FintraAI.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentReviews.map((review, index) => (
            <div key={`${review.name}-${index}`} className="bg-black/80 border border-gray-800 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300">
              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-red-500 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-300 mb-6 leading-relaxed">
                "{review.content}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {review.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold">{review.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}