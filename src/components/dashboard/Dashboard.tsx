import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { LogOut, FileText, Plus, Crown, Lock, Calendar, Building, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Template {
  id: string;
  title: string;
  ticker: string | null;
  sector: string | null;
  created_at: string;
  content: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { subscription, loading: subLoading, canCreateTemplate } = useSubscription(user);
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  useEffect(() => {
    if (user && supabase) {
      fetchTemplates();
    }
  }, [user]);

  const fetchTemplates = async () => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('templates')
        .select('id, title, ticker, sector, created_at, content')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTemplatePreview = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      const basicInfo = parsed.basicInfo || {};
      return {
        companyName: basicInfo.companyName || 'Unknown Company',
        currentPrice: basicInfo.currentPrice || 'N/A',
        marketCap: basicInfo.marketCap || 'N/A'
      };
    } catch {
      return {
        companyName: 'Unknown Company',
        currentPrice: 'N/A',
        marketCap: 'N/A'
      };
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getPlanBadge = () => {
    const badges = {
      free: { text: 'Free', color: 'bg-gray-500' },
      basic: { text: 'Basic', color: 'bg-blue-500' },
      pro: { text: 'Pro', color: 'bg-red-500' }
    };
    const badge = badges[subscription.plan];
    return (
      <span className={`${badge.color} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="text-2xl font-bold hover:opacity-80 transition-opacity duration-200"
          >
            <span className="text-white">Fintra</span>
            <span className="text-red-500">AI</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {getPlanBadge()}
              <span className="text-gray-300">Welcome, {user?.user_metadata?.full_name || user?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Research Dashboard</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Organize your stock research and templates</p>
            {subscription.maxTemplates !== Infinity && (
              <p className="text-gray-400">
                Templates: {subscription.templatesUsed}/{subscription.maxTemplates}
              </p>
            )}
          </div>
        </div>

        {/* Upgrade Banner for Free Users */}
        {subscription.plan === 'free' && (
          <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Crown className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">Unlock More Templates</h3>
                  <p className="text-gray-400">Upgrade to Basic for unlimited templates or Pro for AI analysis</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/', { state: { scrollTo: 'pricing' } })}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`bg-gray-900/50 border border-gray-800 rounded-xl p-6 transition-all duration-300 ${
            canCreateTemplate() ? 'hover:border-red-500/50' : 'opacity-60'
          }`}>
            <div className="flex items-center mb-4">
              {canCreateTemplate() ? (
                <Plus className="w-8 h-8 text-red-500 mr-3" />
              ) : (
                <Lock className="w-8 h-8 text-gray-500 mr-3" />
              )}
              <h3 className="text-xl font-semibold">Create Template</h3>
            </div>
            <p className="text-gray-400 mb-4">
              {canCreateTemplate() 
                ? 'Start a new research template for your analysis'
                : `Template limit reached (${subscription.templatesUsed}/${subscription.maxTemplates})`
              }
            </p>
            <button 
              disabled={!canCreateTemplate()}
              onClick={() => canCreateTemplate() ? navigate('/create-template') : navigate('/', { state: { scrollTo: 'pricing' } })}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                canCreateTemplate()
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {canCreateTemplate() ? 'New Template' : 'Upgrade Required'}
            </button>
          </div>

          <div className={`bg-gray-900/50 border border-gray-800 rounded-xl p-6 transition-all duration-300 ${
            subscription.hasAIAccess ? 'hover:border-red-500/50' : 'opacity-60'
          }`}>
            <div className="flex items-center mb-4">
              {subscription.hasAIAccess ? (
                <FileText className="w-8 h-8 text-red-500 mr-3" />
              ) : (
                <Lock className="w-8 h-8 text-gray-500 mr-3" />
              )}
              <h3 className="text-xl font-semibold">AI Analysis</h3>
            </div>
            <p className="text-gray-400 mb-4">
              {subscription.hasAIAccess
                ? 'Get AI insights from SEC filings'
                : 'AI analysis available with Pro plan'
              }
            </p>
            <button 
              disabled={!subscription.hasAIAccess}
              onClick={() => !subscription.hasAIAccess ? navigate('/', { state: { scrollTo: 'pricing' } }) : navigate('/ai-analysis')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                subscription.hasAIAccess
                  ? 'border border-red-500 text-red-400 hover:bg-red-500 hover:text-white'
                  : 'border border-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {subscription.hasAIAccess ? 'Start AI Analysis' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>

        {/* Templates Section */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Your Templates</h2>
            {subscription.maxTemplates !== Infinity && (
              <span className="text-gray-400 text-sm">
                {subscription.templatesUsed}/{subscription.maxTemplates} used
              </span>
            )}
          </div>
          
          {loadingTemplates ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No templates yet</h3>
              <p className="text-gray-500 mb-6">
                {canCreateTemplate() 
                  ? 'Create your first research template to get started'
                  : 'Upgrade your plan to create more templates'
                }
              </p>
              <button 
                disabled={!canCreateTemplate()}
                onClick={() => canCreateTemplate() ? navigate('/create-template') : navigate('/', { state: { scrollTo: 'pricing' } })}
                className={`px-6 py-3 rounded-lg transition-colors duration-200 ${
                  canCreateTemplate()
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {canCreateTemplate() ? 'Create Your First Template' : 'Upgrade Required'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => {
                const preview = getTemplatePreview(template.content);
                return (
                  <div key={template.id} className="bg-black/80 border border-gray-700 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Building className="w-5 h-5 text-red-500" />
                        <h3 className="font-semibold text-lg truncate">{template.title}</h3>
                      </div>
                      {template.ticker && (
                        <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm font-mono">
                          {template.ticker}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Company:</span>
                        <span className="text-gray-300">{preview.companyName}</span>
                      </div>
                      {template.sector && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Sector:</span>
                          <span className="text-gray-300">{template.sector}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Current Price:</span>
                        <span className="text-gray-300">${preview.currentPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Market Cap:</span>
                        <span className="text-gray-300">{preview.marketCap}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(template.created_at)}
                      </div>
                      <button
                        onClick={() => navigate(`/template/${template.id}`)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
                      >
                        View Template
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}