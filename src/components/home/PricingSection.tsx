import { useNavigate } from 'react-router-dom';
import { CheckCircle, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { stripeProducts } from '../../stripe-config';
import { useStripeCheckout } from '../../hooks/useStripeCheckout';

export default function PricingSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createCheckoutSession, loading } = useStripeCheckout();

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        { text: "1 Template", included: true },
        { text: "Basic Organization", included: true },
        { text: "Community Support", included: true },
        { text: "AI Analysis", included: false },
        { text: "Unlimited Templates", included: false }
      ],
      highlighted: false
    },
    {
      name: "Basic",
      price: "$9.99",
      period: "per month",
      features: [
        { text: "Unlimited Templates", included: true },
        { text: "Cloud Sync", included: true },
        { text: "Email Support", included: true },
        { text: "Export to PDF", included: true },
        { text: "AI Analysis", included: false }
      ],
      highlighted: false
    },
    {
      name: "Pro",
      price: "$20",
      period: "per month",
      features: [
        { text: "Unlimited Templates", included: true },
        { text: "AI Analysis & Summaries", included: true },
        { text: "Advanced Analytics", included: true },
        { text: "Priority Support", included: true },
        { text: "Export Tools", included: true }
      ],
      highlighted: true
    }
  ];

  const handleGetStarted = async (planName: string) => {
    if (!user) {
      // Not signed in, go to signup
      navigate('/signup');
      return;
    }

    // User is signed in
    if (planName === 'Free') {
      // Free plan - go to dashboard
      navigate('/dashboard');
    } else {
      // Paid plans - create Stripe checkout session
      const product = stripeProducts.find(p => p.name === planName);
      if (product) {
        try {
          await createCheckoutSession({
            priceId: product.priceId,
            mode: product.mode,
            successUrl: `${window.location.origin}/success`,
            cancelUrl: `${window.location.origin}/#pricing`
          });
        } catch (error) {
          console.error('Checkout error:', error);
        }
      }
    }
  };
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Choose Your <span className="text-red-500">Plan</span></h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Start free and upgrade as your research needs grow.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`relative bg-black/80 border rounded-xl p-8 transition-all duration-300 hover:scale-105 ${
              plan.highlighted 
                ? 'border-red-500 ring-2 ring-red-500/20' 
                : 'border-gray-800 hover:border-red-500/50'
            }`}>
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 ml-2">/{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    {typeof feature === 'string' ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </>
                    ) : (
                      <>
                        {feature.included ? (
                          <CheckCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                        )}
                        <span className={feature.included ? "text-gray-300" : "text-gray-500"}>
                          {feature.text}
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleGetStarted(plan.name)}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                plan.highlighted
                  ? 'bg-red-500 hover:bg-red-600 text-white hover:shadow-xl hover:shadow-red-500/25'
                  : 'border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' :
                 !user ? 'Get Started' : 
                 plan.name === 'Free' ? 'Go to Dashboard' : 
                 `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}