import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief loading period to allow webhook processing
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const sessionId = searchParams.get('session_id');

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold mb-2">Processing your payment...</h1>
          <p className="text-gray-400">Please wait while we confirm your subscription.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Thank you for your purchase. Your subscription has been activated and you now have access to all premium features.
          </p>

          {sessionId && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">Transaction Details</h3>
              <p className="text-gray-400 text-sm">Session ID: {sessionId}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 flex items-center justify-center"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="border border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          </div>

          <div className="mt-12 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <h4 className="font-semibold text-red-400 mb-2">Start Creating</h4>
                <p className="text-gray-300 text-sm">Create unlimited research templates and organize your analysis.</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-400 mb-2">AI Analysis</h4>
                <p className="text-gray-300 text-sm">Use AI-powered SEC filing analysis to save hours of research time.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}