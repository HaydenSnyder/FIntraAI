import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <div className={`max-w-6xl mx-auto transition-all duration-300 rounded-2xl ${
        scrolled ? 'bg-black/30 backdrop-blur-md border-2 border-gray-700/60' : 'bg-black/20 backdrop-blur-md border-2 border-gray-700/40'
      }`}>
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button 
                onClick={() => navigate('/')}
                className="text-2xl font-bold hover:opacity-80 transition-opacity duration-200"
              >
                <span className="text-white">Fintra</span>
                <span className="text-red-500">AI</span>
              </button>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#features" className="text-gray-300 hover:text-red-400 transition-colors duration-200">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-red-400 transition-colors duration-200">Pricing</a>
              <button onClick={() => navigate('/about')} className="text-gray-300 hover:text-red-400 transition-colors duration-200">About</button>
              <button onClick={() => navigate('/reviews')} className="text-gray-300 hover:text-red-400 transition-colors duration-200">Reviews</button>
              <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-red-400 transition-colors duration-200">Login</button>
              <button 
                onClick={() => user ? navigate('/dashboard') : navigate('/signup')}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
              >
                {user ? 'Dashboard' : 'Get Started'}
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-red-400"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/30 backdrop-blur-md border-2 border-gray-700/60 rounded-3xl mt-2 mx-4">
          <div className="px-6 pt-2 pb-3 space-y-1">
            <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-red-400">Features</a>
            <a href="#pricing" className="block px-3 py-2 text-gray-300 hover:text-red-400">Pricing</a>
            <button onClick={() => navigate('/about')} className="block px-3 py-2 text-gray-300 hover:text-red-400 w-full text-left">About</button>
            <button onClick={() => navigate('/reviews')} className="block px-3 py-2 text-gray-300 hover:text-red-400 w-full text-left">Reviews</button>
            <button onClick={() => navigate('/login')} className="block px-3 py-2 text-gray-300 hover:text-red-400 w-full text-left">Login</button>
            <button 
              onClick={() => user ? navigate('/dashboard') : navigate('/signup')}
              className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              {user ? 'Dashboard' : 'Get Started'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}