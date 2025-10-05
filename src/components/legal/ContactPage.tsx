import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Send } from 'lucide-react';

export default function ContactPage() {
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
          <div className="flex items-center justify-center mb-6">
            <Mail className="w-12 h-12 text-red-500 mr-4" />
            <h1 className="text-5xl font-bold">Contact <span className="text-red-500">Us</span></h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We're here to help! Get in touch with us through email or chat with our AI assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email Contact */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-red-500/50 transition-all duration-300">
            <div className="flex items-center mb-6">
              <Mail className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-semibold">Email Support</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-red-400">General Support</h3>
                <a 
                  href="mailto:support@fintraai.com"
                  className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  support@fintraai.com
                </a>
              </div>
              <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-red-400">Business Inquiries</h3>
                <a 
                  href="mailto:business@fintraai.com"
                  className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  business@fintraai.com
                </a>
              </div>
              <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-red-400">Technical Support</h3>
                <a 
                  href="mailto:tech@fintraai.com"
                  className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  tech@fintraai.com
                </a>
              </div>
            </div>
          </div>

          {/* AI Assistant */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-red-500/50 transition-all duration-300">
            <div className="flex items-center mb-6">
              <MessageCircle className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-semibold">AI Assistant</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Get instant answers to your questions with our AI-powered assistant.
            </p>
            <div className="bg-black/50 border border-gray-700 rounded-lg p-6 text-center">
              <MessageCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Chat with our AI</h3>
              <p className="text-gray-400 mb-4">
                Available 24/7 to help with questions about features, pricing, and getting started.
              </p>
              <p className="text-sm text-gray-500">
                Look for the chat bubble in the bottom-right corner of any page to start a conversation.
              </p>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="mt-12 text-center bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Response Times</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-2">AI Assistant</h3>
              <p className="text-gray-300">Instant responses</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-2">Email Support</h3>
              <p className="text-gray-300">Within 24 hours</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-2">Technical Issues</h3>
              <p className="text-gray-300">Within 12 hours</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}