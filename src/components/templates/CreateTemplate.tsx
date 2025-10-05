import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, Download, RotateCcw, CheckCircle, Users, DollarSign, TrendingUp, Target } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { supabase } from '../../lib/supabase';

interface TemplateData {
  companyName: string;
  tickerSymbol: string;
  businessModel: string;
  revenueBreakdown: string;
  moatsAdvantages: string;
  risksWeaknesses: string;
  industryTrends: string;
  competitorLandscape: string;
  regulatoryEnvironment: string;
  customerConcentration: string;
  currentPrice: string;
  marketCap: string;
  peRatio: string;
  forwardPE: string;
  pegRatio: string;
  evEbitda: string;
  dividendYield: string;
  priceToBook: string;
  peerComparison: string;
  cashEquivalents: string;
  shortTermInvestments: string;
  longTermInvestments: string;
  shortTermDebt: string;
  longTermDebt: string;
  totalAssets: string;
  currentAssets: string;
  currentLiabilities: string;
  operatingCashFlow2025: string;
  operatingCashFlow2024: string;
  operatingCashFlow2023: string;
  netIncome2025: string;
  netIncome2024: string;
  netIncome2023: string;
  capex2025: string;
  capex2024: string;
  capex2023: string;
  totalRevenue2025: string;
  totalRevenue2024: string;
  totalRevenue2023: string;
  netIncomeStatement2025: string;
  netIncomeStatement2024: string;
  netIncomeStatement2023: string;
  ceoName: string;
  ceoStartDate: string;
  founderLed: boolean;
  promotedInternally: boolean;
  ceoBackground: string;
  leadershipHistory: string;
  ceoTurnoverHistory: string;
  previousCeo: string;
  managementCulture: string;
  currentCeoRevenue: string;
  currentCeoEarnings: string;
  previousCeoRevenue: string;
  previousCeoEarnings: string;
  keyExecutives: string;
  recentLeadershipChanges: string;
  managementNotes: string;
  bullCase: string;
  bearCase: string;
  keyCatalysts: string;
  primaryRiskFactors: string;
  investmentDecision: string;
  confidenceLevel: string;
  investmentTimeHorizon: string;
  recommendedPositionSize: string;
  targetPrice: string;
  fairValueEstimate: string;
  dcfValuation: string;
  multiplesValuation: string;
  additionalThesisNotes: string;
}

export default function CreateTemplate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, canCreateTemplate, refreshSubscription } = useSubscription(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('files');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [templateData, setTemplateData] = useState<TemplateData>({
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

  // Calculate ratios
  const ratios = {
    totalCashInvestments: (parseFloat(templateData.cashEquivalents) || 0) + (parseFloat(templateData.shortTermInvestments) || 0) + (parseFloat(templateData.longTermInvestments) || 0),
    totalDebt: (parseFloat(templateData.shortTermDebt) || 0) + (parseFloat(templateData.longTermDebt) || 0),
    debtToAssetsRatio: ((parseFloat(templateData.shortTermDebt) || 0) + (parseFloat(templateData.longTermDebt) || 0)) / (parseFloat(templateData.totalAssets) || 1) * 100,
    currentRatio: (parseFloat(templateData.currentAssets) || 0) / (parseFloat(templateData.currentLiabilities) || 1),
    netCashDebt: ((parseFloat(templateData.cashEquivalents) || 0) + (parseFloat(templateData.shortTermInvestments) || 0) + (parseFloat(templateData.longTermInvestments) || 0)) - ((parseFloat(templateData.shortTermDebt) || 0) + (parseFloat(templateData.longTermDebt) || 0))
  };

  // Calculate cash flow metrics
  const cashFlowMetrics = {
    fcf2023: (parseFloat(templateData.operatingCashFlow2023) || 0) - (parseFloat(templateData.capex2023) || 0),
    fcf2024: (parseFloat(templateData.operatingCashFlow2024) || 0) - (parseFloat(templateData.capex2024) || 0),
    fcf2025: (parseFloat(templateData.operatingCashFlow2025) || 0) - (parseFloat(templateData.capex2025) || 0),
    ocfGrowth2024: ((parseFloat(templateData.operatingCashFlow2024) || 0) - (parseFloat(templateData.operatingCashFlow2023) || 0)) / (parseFloat(templateData.operatingCashFlow2023) || 1) * 100,
    ocfGrowth2025: ((parseFloat(templateData.operatingCashFlow2025) || 0) - (parseFloat(templateData.operatingCashFlow2024) || 0)) / (parseFloat(templateData.operatingCashFlow2024) || 1) * 100,
    niGrowth2024: ((parseFloat(templateData.netIncome2024) || 0) - (parseFloat(templateData.netIncome2023) || 0)) / (parseFloat(templateData.netIncome2023) || 1) * 100,
    niGrowth2025: ((parseFloat(templateData.netIncome2025) || 0) - (parseFloat(templateData.netIncome2024) || 0)) / (parseFloat(templateData.netIncome2024) || 1) * 100,
    fcfGrowth2024: (((parseFloat(templateData.operatingCashFlow2024) || 0) - (parseFloat(templateData.capex2024) || 0)) - ((parseFloat(templateData.operatingCashFlow2023) || 0) - (parseFloat(templateData.capex2023) || 0))) / (((parseFloat(templateData.operatingCashFlow2023) || 0) - (parseFloat(templateData.capex2023) || 0)) || 1) * 100,
    fcfGrowth2025: (((parseFloat(templateData.operatingCashFlow2025) || 0) - (parseFloat(templateData.capex2025) || 0)) - ((parseFloat(templateData.operatingCashFlow2024) || 0) - (parseFloat(templateData.capex2024) || 0))) / (((parseFloat(templateData.operatingCashFlow2024) || 0) - (parseFloat(templateData.capex2024) || 0)) || 1) * 100
  };

  // Calculate revenue metrics
  const revenueMetrics = {
    revGrowth2024: ((parseFloat(templateData.totalRevenue2024) || 0) - (parseFloat(templateData.totalRevenue2023) || 0)) / (parseFloat(templateData.totalRevenue2023) || 1) * 100,
    revGrowth2025: ((parseFloat(templateData.totalRevenue2025) || 0) - (parseFloat(templateData.totalRevenue2024) || 0)) / (parseFloat(templateData.totalRevenue2024) || 1) * 100,
    niGrowth2024: ((parseFloat(templateData.netIncomeStatement2024) || 0) - (parseFloat(templateData.netIncomeStatement2023) || 0)) / (parseFloat(templateData.netIncomeStatement2023) || 1) * 100,
    niGrowth2025: ((parseFloat(templateData.netIncomeStatement2025) || 0) - (parseFloat(templateData.netIncomeStatement2024) || 0)) / (parseFloat(templateData.netIncomeStatement2024) || 1) * 100
  };

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

        {activeTab === 'files' && (
          <div className="space-y-8">
            {/* Company Profile Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-semibold text-red-400">Company Profile</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Business Model</h3>
                    <p className="text-xs text-gray-500 mb-2">How they make money, key revenue streams...</p>
                    <textarea
                      value={templateData.businessModel}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, businessModel: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      placeholder="Describe the business model..."
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Revenue Breakdown</h3>
                    <p className="text-xs text-gray-500 mb-2">Segment breakdown, geographic mix, recurring vs one-time...</p>
                    <textarea
                      value={templateData.revenueBreakdown}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, revenueBreakdown: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      placeholder="Break down revenue sources..."
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Moats & Competitive Advantages</h3>
                    <p className="text-xs text-gray-500 mb-2">Brand, patents, network effects, cost advantages...</p>
                    <textarea
                      value={templateData.moatsAdvantages}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, moatsAdvantages: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      placeholder="Describe competitive advantages..."
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Risks & Weaknesses</h3>
                    <p className="text-xs text-gray-500 mb-2">Regulation, disruption, debt dependency, concentration of customers...</p>
                    <textarea
                      value={templateData.risksWeaknesses}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, risksWeaknesses: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      placeholder="Identify key risks and weaknesses..."
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Industry Trends</h3>
                    <p className="text-xs text-gray-500 mb-2">Macro tailwinds/headwinds affecting the industry...</p>
                    <textarea
                      value={templateData.industryTrends}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, industryTrends: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      placeholder="Describe industry trends..."
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Competitor Landscape</h3>
                    <p className="text-xs text-gray-500 mb-2">Key competitors and competitive positioning...</p>
                    <textarea
                      value={templateData.competitorLandscape}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, competitorLandscape: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      placeholder="Analyze the competitive landscape..."
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Regulatory Environment</h3>
                    <p className="text-xs text-gray-500 mb-2">Regulatory factors affecting the business...</p>
                    <textarea
                      value={templateData.regulatoryEnvironment}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, regulatoryEnvironment: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      placeholder="Describe regulatory factors..."
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Customer Concentration Risk</h3>
                    <p className="text-xs text-gray-500 mb-2">Customer concentration analysis (e.g., one client = 40% revenue)...</p>
                    <textarea
                      value={templateData.customerConcentration}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, customerConcentration: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      placeholder="Analyze customer concentration risks..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Management Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-semibold text-red-400">Executive Management</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-4">CEO Information</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">CEO Name</h4>
                        <input
                          type="text"
                          value={templateData.ceoName}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, ceoName: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                          placeholder="Enter CEO name"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">CEO Start Date</h4>
                        <input
                          type="date"
                          value={templateData.ceoStartDate}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, ceoStartDate: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                        />
                      </div>
                      <div className="flex space-x-6">
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
                    <h3 className="text-lg font-medium text-gray-300 mb-2">CEO Background & Track Record</h3>
                    <p className="text-xs text-gray-500 mb-2">Previous experience, education, notable achievements...</p>
                    <textarea
                      value={templateData.ceoBackground}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, ceoBackground: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      placeholder="Describe CEO background and track record..."
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Leadership History</h3>
                    <textarea
                      value={templateData.leadershipHistory}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, leadershipHistory: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      placeholder="Describe leadership history..."
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">CEO Turnover History</h3>
                    <p className="text-xs text-gray-500 mb-2">Stable leadership or revolving door? Frequency of CEO changes...</p>
                    <textarea
                      value={templateData.ceoTurnoverHistory}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, ceoTurnoverHistory: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      placeholder="Describe CEO turnover history..."
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Previous CEO</h3>
                    <input
                      type="text"
                      value={templateData.previousCeo}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, previousCeo: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      placeholder="Enter previous CEO name"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Management Culture</h3>
                    <p className="text-xs text-gray-500 mb-2">Founder-led vs professional management culture differences...</p>
                    <textarea
                      value={templateData.managementCulture}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, managementCulture: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      placeholder="Describe management culture..."
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-300 mb-4">Performance Comparison Across Leadership</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-400 mb-3">Under Current CEO</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Average Annual Revenue ($M)</p>
                        <input
                          type="text"
                          value={templateData.currentCeoRevenue}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, currentCeoRevenue: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Average Annual Earnings ($M)</p>
                        <input
                          type="text"
                          value={templateData.currentCeoEarnings}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, currentCeoEarnings: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-400 mb-3">Under Previous CEO</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Average Annual Revenue ($M)</p>
                        <input
                          type="text"
                          value={templateData.previousCeoRevenue}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, previousCeoRevenue: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Average Annual Earnings ($M)</p>
                        <input
                          type="text"
                          value={templateData.previousCeoEarnings}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, previousCeoEarnings: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Key Executives</h3>
                  <p className="text-xs text-gray-500 mb-2">Other important leadership team members and their roles...</p>
                  <textarea
                    value={templateData.keyExecutives}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, keyExecutives: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                    placeholder="List key executives and their roles..."
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Recent Leadership Changes</h3>
                  <p className="text-xs text-gray-500 mb-2">Recent changes in leadership team and their potential impact...</p>
                  <textarea
                    value={templateData.recentLeadershipChanges}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, recentLeadershipChanges: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                    placeholder="Describe recent leadership changes..."
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Management Notes</h3>
                  <p className="text-xs text-gray-500 mb-2">Additional observations about management quality, governance, compensation...</p>
                  <textarea
                    value={templateData.managementNotes}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, managementNotes: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                    placeholder="Additional management observations..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'research' && (
          <div className="space-y-8">
            {/* Valuation Snapshot */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <DollarSign className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-semibold text-red-400">Valuation Snapshot</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Current Price ($)</h3>
                  <input
                    type="text"
                    value={templateData.currentPrice}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, currentPrice: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Market Cap ($B)</h3>
                  <input
                    type="text"
                    value={templateData.marketCap}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, marketCap: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">P/E Ratio</h3>
                  <input
                    type="text"
                    value={templateData.peRatio}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, peRatio: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                    placeholder="N/A"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Forward P/E</h3>
                  <input
                    type="text"
                    value={templateData.forwardPE}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, forwardPE: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                    placeholder="N/A"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Dividend Yield (%)</h3>
                  <input
                    type="text"
                    value={templateData.dividendYield}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, dividendYield: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Peer Comparison</h3>
                <p className="text-xs text-gray-500 mb-2">Where they stand vs competitors (valuation multiples, growth rates, margins)...</p>
                <textarea
                  value={templateData.peerComparison}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, peerComparison: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  placeholder="Compare with peer companies..."
                />
              </div>
            </div>

            {/* Balance Sheet Health */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-semibold text-red-400">Balance Sheet Health</h2>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-300 mb-4">Balance Sheet Data</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Cash & Equivalents ($M)</h4>
                    <input
                      type="text"
                      value={templateData.cashEquivalents}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, cashEquivalents: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Long-term Investments ($M)</h4>
                    <input
                      type="text"
                      value={templateData.longTermInvestments}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, longTermInvestments: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Long-term Debt ($M)</h4>
                    <input
                      type="text"
                      value={templateData.longTermDebt}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, longTermDebt: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Current Assets ($M)</h4>
                    <input
                      type="text"
                      value={templateData.currentAssets}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, currentAssets: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Short-term Investments ($M)</h4>
                    <input
                      type="text"
                      value={templateData.shortTermInvestments}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, shortTermInvestments: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Short-term Debt ($M)</h4>
                    <input
                      type="text"
                      value={templateData.shortTermDebt}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, shortTermDebt: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Total Assets ($M)</h4>
                    <input
                      type="text"
                      value={templateData.totalAssets}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, totalAssets: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Current Liabilities ($M)</h4>
                    <input
                      type="text"
                      value={templateData.currentLiabilities}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, currentLiabilities: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Ratios */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-300 mb-4">Calculated Ratios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Cash & Investments:</span>
                    <span className="text-green-400 font-mono">${ratios.totalCashInvestments.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Debt-to-Assets Ratio:</span>
                    <div className="flex items-center space-x-2">
                      <span className={`font-mono ${ratios.debtToAssetsRatio < 20 ? 'text-green-400' : ratios.debtToAssetsRatio < 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {ratios.debtToAssetsRatio.toFixed(1)}%
                      </span>
                      <span className={`text-xs ${ratios.debtToAssetsRatio < 20 ? 'text-green-400' : ratios.debtToAssetsRatio < 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {ratios.debtToAssetsRatio < 20 ? 'Low Risk' : ratios.debtToAssetsRatio < 40 ? 'Moderate' : 'High Risk'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Debt:</span>
                    <span className="text-green-400 font-mono">${ratios.totalDebt.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current Ratio:</span>
                    <div className="flex items-center space-x-2">
                      <span className={`font-mono ${ratios.currentRatio > 2 ? 'text-green-400' : ratios.currentRatio > 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {ratios.currentRatio.toFixed(2)}
                      </span>
                      <span className={`text-xs ${ratios.currentRatio > 2 ? 'text-green-400' : ratios.currentRatio > 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {ratios.currentRatio > 2 ? 'Strong' : ratios.currentRatio > 1 ? 'Adequate' : 'Weak'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Net Cash/Debt:</span>
                    <span className={`font-mono ${ratios.netCashDebt >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${Math.abs(ratios.netCashDebt).toFixed(0)} {ratios.netCashDebt >= 0 ? 'Cash' : 'Debt'}
                    </span>
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
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-semibold text-red-400">Cash Flow Quality</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-4">Operating Cash Flow ($M)</h3>
                  <div className="space-y-3">
                    {['2025', '2024', '2023'].map((year) => (
                      <div key={year}>
                        <h4 className="text-sm text-gray-500 mb-1">{year}</h4>
                        <input
                          type="text"
                          value={templateData[`operatingCashFlow${year}` as keyof TemplateData] as string}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, [`operatingCashFlow${year}`]: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-4">Net Income ($M)</h3>
                  <div className="space-y-3">
                    {['2025', '2024', '2023'].map((year) => (
                      <div key={year}>
                        <h4 className="text-sm text-gray-500 mb-1">{year}</h4>
                        <input
                          type="text"
                          value={templateData[`netIncome${year}` as keyof TemplateData] as string}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, [`netIncome${year}`]: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-4">Capital Expenditure ($M)</h3>
                  <div className="space-y-3">
                    {['2025', '2024', '2023'].map((year) => (
                      <div key={year}>
                        <h4 className="text-sm text-gray-500 mb-1">{year}</h4>
                        <input
                          type="text"
                          value={templateData[`capex${year}` as keyof TemplateData] as string}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, [`capex${year}`]: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                          placeholder="0"
                        />
                      </div>
                    ))}
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
                        <td className="text-right py-2 text-white">${templateData.operatingCashFlow2023 || '0'}</td>
                        <td className="text-right py-2 text-white">${templateData.operatingCashFlow2024 || '0'}</td>
                        <td className="text-right py-2 text-white">${templateData.operatingCashFlow2025 || '0'}</td>
                        <td className={`text-right py-2 ${cashFlowMetrics.ocfGrowth2024 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {cashFlowMetrics.ocfGrowth2024.toFixed(1)}%
                        </td>
                        <td className={`text-right py-2 ${cashFlowMetrics.ocfGrowth2025 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {cashFlowMetrics.ocfGrowth2025.toFixed(1)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-300">Net Income</td>
                        <td className="text-right py-2 text-white">${templateData.netIncome2023 || '0'}</td>
                        <td className="text-right py-2 text-white">${templateData.netIncome2024 || '0'}</td>
                        <td className="text-right py-2 text-white">${templateData.netIncome2025 || '0'}</td>
                        <td className={`text-right py-2 ${cashFlowMetrics.niGrowth2024 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {cashFlowMetrics.niGrowth2024.toFixed(1)}%
                        </td>
                        <td className={`text-right py-2 ${cashFlowMetrics.niGrowth2025 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {cashFlowMetrics.niGrowth2025.toFixed(1)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-300">Free Cash Flow</td>
                        <td className="text-right py-2 text-white">${cashFlowMetrics.fcf2023.toFixed(0)}</td>
                        <td className="text-right py-2 text-white">${cashFlowMetrics.fcf2024.toFixed(0)}</td>
                        <td className="text-right py-2 text-white">${cashFlowMetrics.fcf2025.toFixed(0)}</td>
                        <td className={`text-right py-2 ${cashFlowMetrics.fcfGrowth2024 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {cashFlowMetrics.fcfGrowth2024.toFixed(1)}%
                        </td>
                        <td className={`text-right py-2 ${cashFlowMetrics.fcfGrowth2025 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {cashFlowMetrics.fcfGrowth2025.toFixed(1)}%
                        </td>
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
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-semibold text-red-400">Income Statement Trends</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-4">Total Revenue ($M)</h3>
                  <div className="space-y-3">
                    {['2025', '2024', '2023'].map((year) => (
                      <div key={year}>
                        <h4 className="text-sm text-gray-500 mb-1">{year}</h4>
                        <input
                          type="text"
                          value={templateData[`totalRevenue${year}` as keyof TemplateData] as string}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, [`totalRevenue${year}`]: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-4">Net Income ($M)</h3>
                  <div className="space-y-3">
                    {['2025', '2024', '2023'].map((year) => (
                      <div key={year}>
                        <h4 className="text-sm text-gray-500 mb-1">{year}</h4>
                        <input
                          type="text"
                          value={templateData[`netIncomeStatement${year}` as keyof TemplateData] as string}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, [`netIncomeStatement${year}`]: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                          placeholder="0"
                        />
                      </div>
                    ))}
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
                        <td className="text-right py-2 text-white">${templateData.totalRevenue2023 || '0'}</td>
                        <td className="text-right py-2 text-white">${templateData.totalRevenue2024 || '0'}</td>
                        <td className="text-right py-2 text-white">${templateData.totalRevenue2025 || '0'}</td>
                        <td className={`text-right py-2 ${revenueMetrics.revGrowth2024 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {revenueMetrics.revGrowth2024.toFixed(1)}%
                        </td>
                        <td className={`text-right py-2 ${revenueMetrics.revGrowth2025 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {revenueMetrics.revGrowth2025.toFixed(1)}%
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-300">Net Income</td>
                        <td className="text-right py-2 text-white">${templateData.netIncomeStatement2023 || '0'}</td>
                        <td className="text-right py-2 text-white">${templateData.netIncomeStatement2024 || '0'}</td>
                        <td className="text-right py-2 text-white">${templateData.netIncomeStatement2025 || '0'}</td>
                        <td className={`text-right py-2 ${revenueMetrics.niGrowth2024 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {revenueMetrics.niGrowth2024.toFixed(1)}%
                        </td>
                        <td className={`text-right py-2 ${revenueMetrics.niGrowth2025 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {revenueMetrics.niGrowth2025.toFixed(1)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'valuation' && (
          <div className="space-y-8">
            {/* Investment Decision */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-semibold text-red-400">Your Thesis & Investment Decision</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Investment Cases</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Bull Case</h4>
                        <p className="text-xs text-gray-500 mb-2">Why this stock can work - key drivers, positive scenarios, upside potential...</p>
                        <textarea
                          value={templateData.bullCase}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, bullCase: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                          placeholder="Describe the bull case for this investment..."
                        />
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Bear Case</h4>
                        <p className="text-xs text-gray-500 mb-2">Main risks and what breaks your thesis - key concerns, negative scenarios...</p>
                        <textarea
                          value={templateData.bearCase}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, bearCase: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                          placeholder="Describe the bear case and main risks..."
                        />
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Key Catalysts</h4>
                        <p className="text-xs text-gray-500 mb-2">What events or developments could move the stock significantly...</p>
                        <textarea
                          value={templateData.keyCatalysts}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, keyCatalysts: e.target.value }))}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                          placeholder="List key catalysts that could drive the stock..."
                        />
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Primary Risk Factors</h4>
                        <p className="text-xs text-gray-500 mb-2">Most concerning risks that could impact the investment...</p>
                        <textarea
                          value={templateData.primaryRiskFactors}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, primaryRiskFactors: e.target.value }))}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                          placeholder="Identify primary risk factors..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Investment Decision</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Investment Decision</h4>
                        <select
                          value={templateData.investmentDecision}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, investmentDecision: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
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
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Confidence Level</h4>
                        <select
                          value={templateData.confidenceLevel}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, confidenceLevel: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
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
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Investment Time Horizon</h4>
                        <p className="text-xs text-gray-500 mb-2">e.g., 2-3 years, 5+ years</p>
                        <input
                          type="text"
                          value={templateData.investmentTimeHorizon}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, investmentTimeHorizon: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                          placeholder="e.g., 3-5 years"
                        />
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Recommended Position Size</h4>
                        <p className="text-xs text-gray-500 mb-2">e.g., 3-5% of portfolio</p>
                        <input
                          type="text"
                          value={templateData.recommendedPositionSize}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, recommendedPositionSize: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                          placeholder="e.g., 5% of portfolio"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Valuation Assessment</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Target Price ($)</h4>
                        <input
                          type="text"
                          value={templateData.targetPrice}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, targetPrice: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Fair Value Estimate ($)</h4>
                        <input
                          type="text"
                          value={templateData.fairValueEstimate}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, fairValueEstimate: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">DCF Valuation ($)</h4>
                        <input
                          type="text"
                          value={templateData.dcfValuation}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, dcfValuation: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Multiples Valuation ($)</h4>
                        <input
                          type="text"
                          value={templateData.multiplesValuation}
                          onChange={(e) => setTemplateData(prev => ({ ...prev, multiplesValuation: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Additional Thesis Notes</h3>
                    <p className="text-xs text-gray-500 mb-2">Any additional thoughts, assumptions, or considerations for your investment thesis...</p>
                    <textarea
                      value={templateData.additionalThesisNotes}
                      onChange={(e) => setTemplateData(prev => ({ ...prev, additionalThesisNotes: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      placeholder="Additional notes and considerations..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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