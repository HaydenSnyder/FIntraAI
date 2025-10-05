import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, Download, RotateCcw, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { supabase } from '../lib/supabase';

export default function CreateTemplate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, canCreateTemplate, refreshSubscription } = useSubscription(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('files');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [templateData, setTemplateData] = useState({
    companyName: '',
    tickerSymbol: '',
    
    // Company Profile
    businessModel: '',
    revenueBreakdown: '',
    moatsAdvantages: '',
    risksWeaknesses: '',
    industryTrends: '',
    competitorLandscape: '',
    regulatoryEnvironment: '',
    customerConcentration: '',
    
    // Valuation Snapshot
    currentPrice: '',
    marketCap: '',
    peRatio: '',
    forwardPE: '',
    pegRatio: '',
    evEbitda: '',
    dividendYield: '',
    priceToBook: '',
    peerComparison: '',
    
    // Balance Sheet Health
    cashEquivalents: '',
    shortTermInvestments: '',
    longTermInvestments: '',
    shortTermDebt: '',
    longTermDebt: '',
    totalAssets: '',
    currentAssets: '',
    currentLiabilities: '',
    
    // Cash Flow Quality
    operatingCashFlow2025: '',
    operatingCashFlow2024: '',
    operatingCashFlow2023: '',
    netIncome2025: '',
    netIncome2024: '',
    netIncome2023: '',
    capex2025: '',
    capex2024: '',
    capex2023: '',
    
    // Income Statement Trends
    totalRevenue2025: '',
    totalRevenue2024: '',
    totalRevenue2023: '',
    netIncomeStatement2025: '',
    netIncomeStatement2024: '',
    netIncomeStatement2023: '',
    
    // Executive Management
    ceoName: '',
    ceoStartDate: '',
    founderLed: false,
    promotedInternally: false,
    ceoBackground: '',
    leadershipHistory: '',
    ceoTurnoverHistory: '',
    previousCeo: '',
    managementCulture: '',
    currentCeoRevenue: '',
    currentCeoEarnings: '',
    previousCeoRevenue: '',
    previousCeoEarnings: '',
    keyExecutives: '',
    recentLeadershipChanges: '',
    managementNotes: '',
    
    // Investment Decision
    bullCase: '',
    bearCase: '',
    keyCatalysts: '',
    primaryRiskFactors: '',
    investmentDecision: '',
    confidenceLevel: '',
    investmentTimeHorizon: '',
    recommendedPositionSize: '',
    targetPrice: '',
    fairValueEstimate: '',
    dcfValuation: '',
    multiplesValuation: '',
    additionalThesisNotes: ''
  });

  // Redirect if user can't create templates
  if (!canCreateTemplate()) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Template Limit Reached</h2>
          <p className="text-gray-400 mb-6">
            You've reached your template limit ({subscription.templatesUsed}/{subscription.maxTemplates}).
            Upgrade to create more templates.
          </p>
          <button
            onClick={() => navigate('/', { state: { scrollTo: 'pricing' } })}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user || !supabase) {
      setError('Authentication required');
      return;
    }

    if (!templateData.companyName.trim()) {
      setError('Please enter a company name');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const content = JSON.stringify(templateData);

      const { error: saveError } = await supabase
        .from('templates')
        .insert({
          user_id: user.id,
          title: templateData.companyName,
          content: content,
          ticker: templateData.tickerSymbol || null,
          sector: null
        });

      if (saveError) throw saveError;

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!user || !supabase || !canCreateTemplate()) {
      alert('Unable to save template. Please check your subscription status.');
      return;
    }

    setSaving(true);
    try {
      // Combine all template data into content
      const templateContent = {
        basicInfo: templateData,
        financialModel: financialModel,
        calculatedRatios: calculatedRatios,
        cashFlowAnalysis: cashFlowAnalysis,
        growthMarginAnalysis: growthMarginAnalysis
      };

      const { error } = await supabase
        .from('templates')
        .insert({
          user_id: user.id,
          title: templateData.companyName || 'Untitled Template',
          content: JSON.stringify(templateContent),
          ticker: templateData.ticker,
          sector: templateData.sector
        });

      if (error) throw error;

      setSaved(true);
      await refreshSubscription();
      
      // Show success message briefly then redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setTemplateData({
        companyName: '',
        tickerSymbol: '',
        businessModel: '',
        revenueBreakdown: '',
        moatsAdvantages: '',
        risksWeaknesses: '',
        industryTrends: '',
        competitorLandscape: '',
        regulatoryEnvironment: '',
        customerConcentration: '',
        currentPrice: '',
        marketCap: '',
        peRatio: '',
        forwardPE: '',
        pegRatio: '',
        evEbitda: '',
        dividendYield: '',
        priceToBook: '',
        peerComparison: '',
        cashEquivalents: '',
        shortTermInvestments: '',
        longTermInvestments: '',
        shortTermDebt: '',
        longTermDebt: '',
        totalAssets: '',
        currentAssets: '',
        currentLiabilities: '',
        operatingCashFlow2025: '',
        operatingCashFlow2024: '',
        operatingCashFlow2023: '',
        netIncome2025: '',
        netIncome2024: '',
        netIncome2023: '',
        capex2025: '',
        capex2024: '',
        capex2023: '',
        totalRevenue2025: '',
        totalRevenue2024: '',
        totalRevenue2023: '',
        netIncomeStatement2025: '',
        netIncomeStatement2024: '',
        netIncomeStatement2023: '',
        ceoName: '',
        ceoStartDate: '',
        founderLed: false,
        promotedInternally: false,
        ceoBackground: '',
        leadershipHistory: '',
        ceoTurnoverHistory: '',
        previousCeo: '',
        managementCulture: '',
        currentCeoRevenue: '',
        currentCeoEarnings: '',
        previousCeoRevenue: '',
        previousCeoEarnings: '',
        keyExecutives: '',
        recentLeadershipChanges: '',
        managementNotes: '',
        bullCase: '',
        bearCase: '',
        keyCatalysts: '',
        primaryRiskFactors: '',
        investmentDecision: '',
        confidenceLevel: '',
        investmentTimeHorizon: '',
        recommendedPositionSize: '',
        targetPrice: '',
        fairValueEstimate: '',
        dcfValuation: '',
        multiplesValuation: '',
        additionalThesisNotes: ''
      });
    }
  };

  const tabs = [
    { id: 'files', label: 'Files & Management' },
    { id: 'research', label: 'Research & Analysis' },
    { id: 'valuation', label: 'Valuation Model' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold hover:opacity-80 transition-opacity duration-200"
          >
            <span className="text-white">Fintra</span>
            <span className="text-red-500">AI</span>
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-2 text-gray-400 hover:text-red-400 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear All</span>
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Template'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Stock Research & Valuation Tool</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Build your comprehensive stock analysis</p>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Company Header */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
              <input
                type="text"
                value={templateData.companyName}
                onChange={(e) => setTemplateData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter company name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ticker Symbol</label>
              <input
                type="text"
                value={templateData.tickerSymbol}
                onChange={(e) => setTemplateData(prev => ({ ...prev, tickerSymbol: e.target.value }))}
                placeholder="Enter ticker symbol"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            {/* Company Profile Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-red-400">1. Company Profile (The Story)</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Business Model</label>
                  <p className="text-xs text-gray-500 mb-2">What they sell, who they sell to...</p>
                  <textarea
                    value={templateData.businessModel}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, businessModel: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Revenue Breakdown</label>
                  <p className="text-xs text-gray-500 mb-2">Main segments/products and % of revenue each...</p>
                  <textarea
                    value={templateData.revenueBreakdown}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, revenueBreakdown: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Moats & Competitive Advantages</label>
                  <p className="text-xs text-gray-500 mb-2">Brand, patents, network effects, cost advantages...</p>
                  <textarea
                    value={templateData.moatsAdvantages}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, moatsAdvantages: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Risks & Weaknesses</label>
                  <p className="text-xs text-gray-500 mb-2">Regulation, disruption, debt dependency, concentration of customers...</p>
                  <textarea
                    value={templateData.risksWeaknesses}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, risksWeaknesses: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Industry Trends</label>
                  <p className="text-xs text-gray-500 mb-2">Macro tailwinds/headwinds affecting the industry...</p>
                  <textarea
                    value={templateData.industryTrends}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, industryTrends: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Competitor Landscape</label>
                  <p className="text-xs text-gray-500 mb-2">Key competitors and competitive positioning...</p>
                  <textarea
                    value={templateData.competitorLandscape}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, competitorLandscape: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Regulatory Environment</label>
                  <p className="text-xs text-gray-500 mb-2">Regulatory factors affecting the business...</p>
                  <textarea
                    value={templateData.regulatoryEnvironment}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, regulatoryEnvironment: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Customer Concentration Risk</label>
                  <p className="text-xs text-gray-500 mb-2">Customer concentration analysis (e.g., one client = 40% revenue)...</p>
                  <textarea
                    value={templateData.customerConcentration}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, customerConcentration: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Executive Management Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-red-400">7. Executive Management</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">CEO Information</label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">CEO Name</label>
                        <input
                          type="text"
                          value={templateData.ceoName}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, ceoName: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">CEO Start Date</label>
                        <input
                          type="date"
                          value={templateData.ceoStartDate}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, ceoStartDate: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={templateData.founderLed}
                            onChange={(e) => setTemplateData(prev => ({ ...prev, founderLed: e.target.checked }))}
                            className="mr-2 rounded"
                          />
                          <span className="text-sm text-gray-300">Founder-led company</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={templateData.promotedInternally}
                            onChange={(e) => setTemplateData(prev => ({ ...prev, promotedInternally: e.target.checked }))}
                            className="mr-2 rounded"
                          />
                          <span className="text-sm text-gray-300">Promoted internally (vs. external hire)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">CEO Background & Track Record</label>
                    <p className="text-xs text-gray-500 mb-2">Previous experience, education, notable achievements...</p>
                    <textarea
                      value={templateData.ceoBackground}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, ceoBackground: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Leadership History</label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">CEO Turnover History</label>
                        <p className="text-xs text-gray-400 mb-2">Stable leadership or revolving door? Frequency of CEO changes...</p>
                        <textarea
                          value={templateData.ceoTurnoverHistory}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, ceoTurnoverHistory: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Previous CEO</label>
                        <input
                          type="text"
                          value={templateData.previousCeo}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, previousCeo: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Management Culture</label>
                    <p className="text-xs text-gray-500 mb-2">Founder-led vs professional management culture differences...</p>
                    <textarea
                      value={templateData.managementCulture}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, managementCulture: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-300 mb-4">Performance Comparison Across Leadership</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Under Current CEO</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Average Annual Revenue ($M)</label>
                        <input
                          type="text"
                          value={templateData.currentCeoRevenue}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, currentCeoRevenue: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Average Annual Earnings ($M)</label>
                        <input
                          type="text"
                          value={templateData.currentCeoEarnings}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, currentCeoEarnings: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Under Previous CEO</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Average Annual Revenue ($M)</label>
                        <input
                          type="text"
                          value={templateData.previousCeoRevenue}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, previousCeoRevenue: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Average Annual Earnings ($M)</label>
                        <input
                          type="text"
                          value={templateData.previousCeoEarnings}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, previousCeoEarnings: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Additional Management Information</label>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Key Executives</label>
                    <p className="text-xs text-gray-400 mb-2">Other important leadership team members and their roles...</p>
                    <textarea
                      value={templateData.keyExecutives}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, keyExecutives: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Recent Leadership Changes</label>
                  <p className="text-xs text-gray-400 mb-2">Recent changes in leadership team and their potential impact...</p>
                  <textarea
                    value={templateData.recentLeadershipChanges}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, recentLeadershipChanges: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Management Notes</label>
                  <p className="text-xs text-gray-400 mb-2">Additional observations about management quality, governance, compensation...</p>
                  <textarea
                    value={templateData.managementNotes}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, managementNotes: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'research' && (
          <div className="space-y-6">
            {/* Valuation Snapshot */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-red-400">2. Valuation Snapshot</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Price ($)</label>
                  <input
                    type="text"
                    value={templateData.currentPrice}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, currentPrice: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Market Cap ($B)</label>
                  <input
                    type="text"
                    value={templateData.marketCap}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, marketCap: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">P/E Ratio</label>
                  <input
                    type="text"
                    value={templateData.peRatio}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, peRatio: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Forward P/E</label>
                  <input
                    type="text"
                    value={templateData.forwardPE}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, forwardPE: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">PEG Ratio</label>
                  <input
                    type="text"
                    value={templateData.pegRatio}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, pegRatio: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">EV/EBITDA</label>
                  <p className="text-xs text-gray-500 mb-2">(Calc: N/A)</p>
                  <input
                    type="text"
                    value={templateData.evEbitda}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, evEbitda: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Dividend Yield (%)</label>
                  <input
                    type="text"
                    value={templateData.dividendYield}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, dividendYield: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price-to-Book</label>
                  <input
                    type="text"
                    value={templateData.priceToBook}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, priceToBook: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Peer Comparison</label>
                <p className="text-xs text-gray-500 mb-2">Where they stand vs competitors (valuation multiples, growth rates, margins)...</p>
                <textarea
                  value={templateData.peerComparison}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, peerComparison: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Balance Sheet Health */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-red-400">3. Balance Sheet Health</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cash & Equivalents ($M)</label>
                    <input
                      type="text"
                      value={templateData.cashEquivalents}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, cashEquivalents: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Long-term Investments ($M)</label>
                    <input
                      type="text"
                      value={templateData.longTermInvestments}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, longTermInvestments: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Long-term Debt ($M)</label>
                    <input
                      type="text"
                      value={templateData.longTermDebt}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, longTermDebt: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Assets ($M)</label>
                    <input
                      type="text"
                      value={templateData.currentAssets}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, currentAssets: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Short-term Investments ($M)</label>
                    <input
                      type="text"
                      value={templateData.shortTermInvestments}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, shortTermInvestments: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Short-term Debt ($M)</label>
                    <input
                      type="text"
                      value={templateData.shortTermDebt}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, shortTermDebt: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Total Assets ($M)</label>
                    <input
                      type="text"
                      value={templateData.totalAssets}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, totalAssets: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Liabilities ($M)</label>
                    <input
                      type="text"
                      value={templateData.currentLiabilities}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, currentLiabilities: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Ratios */}
              <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-300 mb-4">Calculated Ratios</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Cash & Investments:</span>
                    <span className="text-green-400 font-mono">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Debt-to-Assets Ratio:</span>
                    <span className="text-green-400 font-mono">0.0%</span>
                    <span className="text-xs text-green-400">Low Risk</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Debt:</span>
                    <span className="text-green-400 font-mono">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current Ratio:</span>
                    <span className="text-gray-400 font-mono">0.00</span>
                    <span className="text-xs text-gray-400">Weak</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Net Cash/Debt:</span>
                    <span className="text-green-400 font-mono">$0.00</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <p><strong>Analysis:</strong> This shows if they can weather downturns or need to refinance.</p>
                  <p>• Debt-to-Assets &lt;20% = Low Risk, 20-40% = Moderate, &gt;40% = High Risk</p>
                  <p>• Current Ratio &gt;2 = Strong, 1-2 = Adequate, &lt;1 = Weak liquidity</p>
                </div>
              </div>
            </div>

            {/* Cash Flow Quality */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-red-400">4. Cash Flow Quality</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Operating Cash Flow ($M)</label>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500">2025</label>
                      <input
                        type="text"
                        value={templateData.operatingCashFlow2025}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, operatingCashFlow2025: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">2024</label>
                      <input
                        type="text"
                        value={templateData.operatingCashFlow2024}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, operatingCashFlow2024: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">2023</label>
                      <input
                        type="text"
                        value={templateData.operatingCashFlow2023}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, operatingCashFlow2023: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Net Income ($M)</label>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500">2025</label>
                      <input
                        type="text"
                        value={templateData.netIncome2025}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, netIncome2025: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">2024</label>
                      <input
                        type="text"
                        value={templateData.netIncome2024}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, netIncome2024: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">2023</label>
                      <input
                        type="text"
                        value={templateData.netIncome2023}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, netIncome2023: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Capital Expenditure ($M)</label>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500">2025</label>
                      <input
                        type="text"
                        value={templateData.capex2025}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, capex2025: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">2024</label>
                      <input
                        type="text"
                        value={templateData.capex2024}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, capex2024: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">2023</label>
                      <input
                        type="text"
                        value={templateData.capex2023}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, capex2023: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cash Flow Analysis Table */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-300 mb-4">Cash Flow Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-2 text-gray-400">Metric</th>
                        <th className="text-right py-2 text-gray-400">2023</th>
                        <th className="text-right py-2 text-gray-400">2024</th>
                        <th className="text-right py-2 text-gray-400">2025</th>
                        <th className="text-right py-2 text-gray-400">2024 Growth</th>
                        <th className="text-right py-2 text-gray-400">2025 Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 text-gray-300">Operating Cash Flow</td>
                        <td className="text-right py-2 text-white">$0.00</td>
                        <td className="text-right py-2 text-white">$0.00</td>
                        <td className="text-right py-2 text-white">$0.00</td>
                        <td className="text-right py-2 text-red-400">0.0%</td>
                        <td className="text-right py-2 text-red-400">0.0%</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-300">Net Income</td>
                        <td className="text-right py-2 text-white">$0.00</td>
                        <td className="text-right py-2 text-white">$0.00</td>
                        <td className="text-right py-2 text-white">$0.00</td>
                        <td className="text-right py-2 text-red-400">0.0%</td>
                        <td className="text-right py-2 text-red-400">0.0%</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-300">Free Cash Flow</td>
                        <td className="text-right py-2 text-white">$0.00</td>
                        <td className="text-right py-2 text-white">$0.00</td>
                        <td className="text-right py-2 text-white">$0.00</td>
                        <td className="text-right py-2 text-red-400">0.0%</td>
                        <td className="text-right py-2 text-red-400">0.0%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-xs text-gray-400">
                  <p><strong>Quality Check:</strong> Compare net income vs cash flow to see if accounting matches reality.</p>
                  <p>• Strong companies typically have OCF &gt; Net Income</p>
                  <p>• Consistent FCF growth indicates profitable scaling</p>
                </div>
              </div>
            </div>

            {/* Income Statement Trends */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-red-400">5. Income Statement Trends</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Revenue ($M)</label>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500">2025</label>
                      <input
                        type="text"
                        value={templateData.totalRevenue2025}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, totalRevenue2025: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">2024</label>
                      <input
                        type="text"
                        value={templateData.totalRevenue2024}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, totalRevenue2024: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">2023</label>
                      <input
                        type="text"
                        value={templateData.totalRevenue2023}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, totalRevenue2023: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Net Income ($M)</label>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500">2025</label>
                      <input
                        type="text"
                        value={templateData.netIncomeStatement2025}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, netIncomeStatement2025: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">2024</label>
                      <input
                        type="text"
                        value={templateData.netIncomeStatement2024}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, netIncomeStatement2024: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">2023</label>
                      <input
                        type="text"
                        value={templateData.netIncomeStatement2023}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, netIncomeStatement2023: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth & Margin Analysis */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-300 mb-4">Growth & Margin Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-2 text-gray-400">Metric</th>
                        <th className="text-right py-2 text-gray-400">2023</th>
                        <th className="text-right py-2 text-gray-400">2024</th>
                        <th className="text-right py-2 text-gray-400">2025</th>
                        <th className="text-right py-2 text-gray-400">2024 Growth</th>
                        <th className="text-right py-2 text-gray-400">2025 Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 text-gray-300">Revenue</td>
                        <td className="text-right py-2 text-white">$0</td>
                        <td className="text-right py-2 text-white">$0</td>
                        <td className="text-right py-2 text-white">$0</td>
                        <td className="text-right py-2 text-red-400">0.0%</td>
                        <td className="text-right py-2 text-red-400">0.0%</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-300">Net Income</td>
                        <td className="text-right py-2 text-white">$0</td>
                        <td className="text-right py-2 text-white">$0</td>
                        <td className="text-right py-2 text-white">$0</td>
                        <td className="text-right py-2 text-red-400">0.0%</td>
                        <td className="text-right py-2 text-red-400">0.0%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'valuation' && (
          <div className="space-y-6">
            {/* Investment Decision */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-red-400">9. Your Thesis & Investment Decision</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Investment Cases</label>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Bull Case</label>
                      <p className="text-xs text-gray-400 mb-2">Why this stock can work - key drivers, positive scenarios, upside potential...</p>
                      <textarea
                        value={templateData.bullCase}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, bullCase: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Bear Case</label>
                    <p className="text-xs text-gray-400 mb-2">Main risks and what breaks your thesis - key concerns, negative scenarios...</p>
                    <textarea
                      value={templateData.bearCase}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, bearCase: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Key Catalysts</label>
                    <p className="text-xs text-gray-400 mb-2">What events or developments could move the stock significantly...</p>
                    <textarea
                      value={templateData.keyCatalysts}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, keyCatalysts: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Primary Risk Factors</label>
                    <p className="text-xs text-gray-400 mb-2">Most concerning risks that could impact the investment...</p>
                    <textarea
                      value={templateData.primaryRiskFactors}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, primaryRiskFactors: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Investment Decision</label>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Investment Decision</label>
                        <select
                          value={templateData.investmentDecision}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, investmentDecision: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Select decision...</option>
                          <option value="Strong Buy">Strong Buy</option>
                          <option value="Buy">Buy</option>
                          <option value="Hold">Hold</option>
                          <option value="Sell">Sell</option>
                          <option value="Avoid">Avoid</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Confidence Level</label>
                        <select
                          value={templateData.confidenceLevel}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, confidenceLevel: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Select confidence...</option>
                          <option value="Very High">Very High</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                          <option value="Very Low">Very Low</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Investment Time Horizon</label>
                        <input
                          type="text"
                          value={templateData.investmentTimeHorizon}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, investmentTimeHorizon: e.target.value }))}
                          placeholder="e.g., 2-3 years, 5+ years"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Recommended Position Size</label>
                        <input
                          type="text"
                          value={templateData.recommendedPositionSize}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, recommendedPositionSize: e.target.value }))}
                          placeholder="e.g., 3-5% of portfolio"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Valuation Assessment</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Target Price ($)</label>
                        <input
                          type="text"
                          value={templateData.targetPrice}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, targetPrice: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Fair Value Estimate ($)</label>
                        <input
                          type="text"
                          value={templateData.fairValueEstimate}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, fairValueEstimate: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">DCF Valuation ($)</label>
                        <input
                          type="text"
                          value={templateData.dcfValuation}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, dcfValuation: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Multiples Valuation ($)</label>
                        <input
                          type="text"
                          value={templateData.multiplesValuation}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, multiplesValuation: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Additional Thesis Notes</label>
                    <p className="text-xs text-gray-400 mb-2">Any additional thoughts, assumptions, or considerations for your investment thesis...</p>
                    <textarea
                      value={templateData.additionalThesisNotes}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, additionalThesisNotes: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end mb-8">
          <button 
            onClick={handleSaveTemplate}
            disabled={saving || saved || !canCreateTemplate()}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center ${
              saved 
                ? 'bg-green-500 text-white' 
                : saving 
                ? 'bg-gray-500 text-white cursor-not-allowed'
                : canCreateTemplate()
                ? 'bg-red-500 hover:bg-red-600 text-white hover:shadow-lg hover:shadow-red-500/25'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Template Saved!
              </>
            ) : saving ? (
              <>
                <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {canCreateTemplate() ? 'Save Template' : 'Upgrade Required'}
              </>
            )}
          </button>
        </div>

        {/* Save Button */}
        <div className="text-center pt-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving Template...' : 'Save Template'}
          </button>
        </div>
      </main>
    </div>
  );
}