import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard as Edit3, Save, X, Building2, TrendingUp, DollarSign, Users, FileText, Target } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
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

export default function TemplateViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [template, setTemplate] = useState<any>(null);
  const [templateData, setTemplateData] = useState<TemplateData>({
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchTemplate();
    }
  }, [id, user]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      setTemplate(data);
      
      // Parse the content and extract templateData
      if (data.content) {
        try {
          const parsedContent = JSON.parse(data.content);
          
          // Handle different content structures
          if (parsedContent.basicInfo) {
            // New structure with nested data
            setTemplateData(parsedContent.basicInfo);
          } else {
            // Direct structure
            setTemplateData(parsedContent);
          }
        } catch (parseError) {
          console.error('Error parsing template content:', parseError);
          setError('Error loading template data');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!template || !user) return;

    try {
      setSaving(true);
      
      const updatedContent = JSON.stringify(templateData);
      
      const { error } = await supabase
        .from('templates')
        .update({
          content: updatedContent,
          title: templateData.companyName || template.title,
          ticker: templateData.tickerSymbol || template.ticker,
          updated_at: new Date().toISOString()
        })
        .eq('id', template.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setEditMode(false);
      await fetchTemplate(); // Refresh data
    } catch (err: any) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value: string) => {
    if (!value || value === '0' || value === '') return '$0.00';
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return `$${num.toLocaleString()}`;
  };

  const formatNumber = (value: string) => {
    if (!value || value === '0' || value === '') return '0';
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString();
  };

  const formatPercentage = (value: string) => {
    if (!value || value === '0' || value === '') return '0.0%';
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return `${num}%`;
  };

  const calculateRatios = () => {
    const cash = parseFloat(templateData.cashEquivalents) || 0;
    const shortTermInv = parseFloat(templateData.shortTermInvestments) || 0;
    const longTermInv = parseFloat(templateData.longTermInvestments) || 0;
    const shortTermDebt = parseFloat(templateData.shortTermDebt) || 0;
    const longTermDebt = parseFloat(templateData.longTermDebt) || 0;
    const totalAssets = parseFloat(templateData.totalAssets) || 0;
    const currentAssets = parseFloat(templateData.currentAssets) || 0;
    const currentLiabilities = parseFloat(templateData.currentLiabilities) || 0;

    const totalCashInvestments = cash + shortTermInv + longTermInv;
    const totalDebt = shortTermDebt + longTermDebt;
    const debtToAssetsRatio = totalAssets > 0 ? (totalDebt / totalAssets) * 100 : 0;
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const netCashDebt = totalCashInvestments - totalDebt;

    return {
      totalCashInvestments,
      totalDebt,
      debtToAssetsRatio,
      currentRatio,
      netCashDebt
    };
  };

  const calculateCashFlowMetrics = () => {
    const ocf2023 = parseFloat(templateData.operatingCashFlow2023) || 0;
    const ocf2024 = parseFloat(templateData.operatingCashFlow2024) || 0;
    const ocf2025 = parseFloat(templateData.operatingCashFlow2025) || 0;
    
    const ni2023 = parseFloat(templateData.netIncome2023) || 0;
    const ni2024 = parseFloat(templateData.netIncome2024) || 0;
    const ni2025 = parseFloat(templateData.netIncome2025) || 0;
    
    const capex2023 = parseFloat(templateData.capex2023) || 0;
    const capex2024 = parseFloat(templateData.capex2024) || 0;
    const capex2025 = parseFloat(templateData.capex2025) || 0;

    const fcf2023 = ocf2023 - capex2023;
    const fcf2024 = ocf2024 - capex2024;
    const fcf2025 = ocf2025 - capex2025;

    const ocfGrowth2024 = ocf2023 !== 0 ? ((ocf2024 - ocf2023) / Math.abs(ocf2023)) * 100 : 0;
    const ocfGrowth2025 = ocf2024 !== 0 ? ((ocf2025 - ocf2024) / Math.abs(ocf2024)) * 100 : 0;
    
    const niGrowth2024 = ni2023 !== 0 ? ((ni2024 - ni2023) / Math.abs(ni2023)) * 100 : 0;
    const niGrowth2025 = ni2024 !== 0 ? ((ni2025 - ni2024) / Math.abs(ni2024)) * 100 : 0;
    
    const fcfGrowth2024 = fcf2023 !== 0 ? ((fcf2024 - fcf2023) / Math.abs(fcf2023)) * 100 : 0;
    const fcfGrowth2025 = fcf2024 !== 0 ? ((fcf2025 - fcf2024) / Math.abs(fcf2024)) * 100 : 0;

    return {
      fcf2023, fcf2024, fcf2025,
      ocfGrowth2024, ocfGrowth2025,
      niGrowth2024, niGrowth2025,
      fcfGrowth2024, fcfGrowth2025
    };
  };

  const calculateRevenueMetrics = () => {
    const rev2023 = parseFloat(templateData.totalRevenue2023) || 0;
    const rev2024 = parseFloat(templateData.totalRevenue2024) || 0;
    const rev2025 = parseFloat(templateData.totalRevenue2025) || 0;
    
    const ni2023 = parseFloat(templateData.netIncomeStatement2023) || 0;
    const ni2024 = parseFloat(templateData.netIncomeStatement2024) || 0;
    const ni2025 = parseFloat(templateData.netIncomeStatement2025) || 0;

    const revGrowth2024 = rev2023 !== 0 ? ((rev2024 - rev2023) / Math.abs(rev2023)) * 100 : 0;
    const revGrowth2025 = rev2024 !== 0 ? ((rev2025 - rev2024) / Math.abs(rev2024)) * 100 : 0;
    
    const niGrowth2024 = ni2023 !== 0 ? ((ni2024 - ni2023) / Math.abs(ni2023)) * 100 : 0;
    const niGrowth2025 = ni2024 !== 0 ? ((ni2025 - ni2024) / Math.abs(ni2024)) * 100 : 0;

    return {
      revGrowth2024, revGrowth2025,
      niGrowth2024, niGrowth2025
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">
            <span className="text-white">Fintra</span>
            <span className="text-red-500">AI</span>
          </div>
          <p className="text-gray-400">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-400">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const ratios = calculateRatios();
  const cashFlowMetrics = calculateCashFlowMetrics();
  const revenueMetrics = calculateRevenueMetrics();

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
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Template</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Header */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Building2 className="w-8 h-8 text-red-400" />
              <div>
                {editMode ? (
                  <input
                    type="text"
                    value={templateData.companyName}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="text-3xl font-bold bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white"
                  />
                ) : (
                  <h1 className="text-3xl font-bold">{templateData.companyName || 'Company Name'}</h1>
                )}
                {editMode ? (
                  <input
                    type="text"
                    value={templateData.tickerSymbol}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, tickerSymbol: e.target.value }))}
                    className="text-lg text-gray-400 bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1"
                  />
                ) : (
                  <p className="text-lg text-gray-400">{templateData.tickerSymbol || 'Ticker Symbol'}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Last Updated</p>
              <p className="text-white">{template?.updated_at ? new Date(template.updated_at).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Company Profile Section */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-semibold text-red-400">1. Company Profile (The Story)</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Company Name</h3>
                <p className="text-white">{templateData.companyName || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Ticker Symbol</h3>
                <p className="text-white">{templateData.tickerSymbol || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Business Model</h3>
                <p className="text-xs text-gray-500 mb-2">What they sell, who they sell to...</p>
                {editMode ? (
                  <textarea
                    value={templateData.businessModel}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, businessModel: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{templateData.businessModel || 'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Revenue Breakdown</h3>
                <p className="text-xs text-gray-500 mb-2">Main segments/products and % of revenue each...</p>
                {editMode ? (
                  <textarea
                    value={templateData.revenueBreakdown}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, revenueBreakdown: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{templateData.revenueBreakdown || 'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Moats & Competitive Advantages</h3>
                <p className="text-xs text-gray-500 mb-2">Brand, patents, network effects, cost advantages...</p>
                {editMode ? (
                  <textarea
                    value={templateData.moatsAdvantages}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, moatsAdvantages: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{templateData.moatsAdvantages || 'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Risks & Weaknesses</h3>
                <p className="text-xs text-gray-500 mb-2">Regulation, disruption, debt dependency, concentration of customers...</p>
                {editMode ? (
                  <textarea
                    value={templateData.risksWeaknesses}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, risksWeaknesses: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{templateData.risksWeaknesses || 'Not specified'}</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Industry Trends</h3>
                <p className="text-xs text-gray-500 mb-2">Macro tailwinds/headwinds affecting the industry...</p>
                {editMode ? (
                  <textarea
                    value={templateData.industryTrends}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, industryTrends: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{templateData.industryTrends || 'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Competitor Landscape</h3>
                <p className="text-xs text-gray-500 mb-2">Key competitors and competitive positioning...</p>
                {editMode ? (
                  <textarea
                    value={templateData.competitorLandscape}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, competitorLandscape: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{templateData.competitorLandscape || 'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Regulatory Environment</h3>
                <p className="text-xs text-gray-500 mb-2">Regulatory factors affecting the business...</p>
                {editMode ? (
                  <textarea
                    value={templateData.regulatoryEnvironment}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, regulatoryEnvironment: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{templateData.regulatoryEnvironment || 'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Customer Concentration Risk</h3>
                <p className="text-xs text-gray-500 mb-2">Customer concentration analysis (e.g., one client = 40% revenue)...</p>
                {editMode ? (
                  <textarea
                    value={templateData.customerConcentration}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, customerConcentration: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{templateData.customerConcentration || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Executive Management Section */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-semibold text-red-400">7. Executive Management</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-4">CEO Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">CEO Name</h4>
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData.ceoName}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, ceoName: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">{templateData.ceoName || 'Not specified'}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">CEO Start Date</h4>
                    {editMode ? (
                      <input
                        type="date"
                        value={templateData.ceoStartDate}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, ceoStartDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">{templateData.ceoStartDate || 'Not specified'}</p>
                    )}
                  </div>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={templateData.founderLed}
                        onChange={(e) => editMode && setTemplateData(prev => ({ ...prev, founderLed: e.target.checked }))}
                        disabled={!editMode}
                        className="mr-2 rounded"
                      />
                      <span className="text-sm text-gray-300">Founder-led company</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={templateData.promotedInternally}
                        onChange={(e) => editMode && setTemplateData(prev => ({ ...prev, promotedInternally: e.target.checked }))}
                        disabled={!editMode}
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
                {editMode ? (
                  <textarea
                    value={templateData.ceoBackground}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, ceoBackground: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{templateData.ceoBackground || 'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Leadership History</h3>
                {editMode ? (
                  <textarea
                    value={templateData.leadershipHistory}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, leadershipHistory: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{templateData.leadershipHistory || 'Not specified'}</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">CEO Turnover History</h3>
                <p className="text-xs text-gray-500 mb-2">Stable leadership or revolving door? Frequency of CEO changes...</p>
                {editMode ? (
                  <textarea
                    value={templateData.ceoTurnoverHistory}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, ceoTurnoverHistory: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{templateData.ceoTurnoverHistory || 'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Previous CEO</h3>
                {editMode ? (
                  <input
                    type="text"
                    value={templateData.previousCeo}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, previousCeo: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-white">{templateData.previousCeo || 'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Management Culture</h3>
                <p className="text-xs text-gray-500 mb-2">Founder-led vs professional management culture differences...</p>
                {editMode ? (
                  <textarea
                    value={templateData.managementCulture}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, managementCulture: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{templateData.managementCulture || 'Not specified'}</p>
                )}
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
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData.currentCeoRevenue}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, currentCeoRevenue: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${templateData.currentCeoRevenue || '0'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Average Annual Earnings ($M)</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData.currentCeoEarnings}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, currentCeoEarnings: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${templateData.currentCeoEarnings || '0'}</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-400 mb-3">Under Previous CEO</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Average Annual Revenue ($M)</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData.previousCeoRevenue}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, previousCeoRevenue: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${templateData.previousCeoRevenue || '0'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Average Annual Earnings ($M)</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData.previousCeoEarnings}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, previousCeoEarnings: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${templateData.previousCeoEarnings || '0'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">Key Executives</h3>
              <p className="text-xs text-gray-500 mb-2">Other important leadership team members and their roles...</p>
              {editMode ? (
                <textarea
                  value={templateData.keyExecutives}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, keyExecutives: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                />
              ) : (
                <p className="text-white whitespace-pre-wrap">{templateData.keyExecutives || 'Not specified'}</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">Recent Leadership Changes</h3>
              <p className="text-xs text-gray-500 mb-2">Recent changes in leadership team and their potential impact...</p>
              {editMode ? (
                <textarea
                  value={templateData.recentLeadershipChanges}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, recentLeadershipChanges: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                />
              ) : (
                <p className="text-white whitespace-pre-wrap">{templateData.recentLeadershipChanges || 'Not specified'}</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">Management Notes</h3>
              <p className="text-xs text-gray-500 mb-2">Additional observations about management quality, governance, compensation...</p>
              {editMode ? (
                <textarea
                  value={templateData.managementNotes}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, managementNotes: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                />
              ) : (
                <p className="text-white whitespace-pre-wrap">{templateData.managementNotes || 'Not specified'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Valuation Snapshot */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <DollarSign className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-semibold text-red-400">2. Valuation Snapshot</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Current Price ($)</h3>
              {editMode ? (
                <input
                  type="text"
                  value={templateData.currentPrice}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, currentPrice: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              ) : (
                <p className="text-xl font-semibold text-white">{formatCurrency(templateData.currentPrice)}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Market Cap ($B)</h3>
              {editMode ? (
                <input
                  type="text"
                  value={templateData.marketCap}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, marketCap: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              ) : (
                <p className="text-xl font-semibold text-white">${templateData.marketCap || '0.0'}B</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">P/E Ratio</h3>
              {editMode ? (
                <input
                  type="text"
                  value={templateData.peRatio}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, peRatio: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              ) : (
                <p className="text-xl font-semibold text-white">{templateData.peRatio || 'N/A'}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Forward P/E</h3>
              {editMode ? (
                <input
                  type="text"
                  value={templateData.forwardPE}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, forwardPE: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              ) : (
                <p className="text-xl font-semibold text-white">{templateData.forwardPE || 'N/A'}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">PEG Ratio</h3>
              {editMode ? (
                <input
                  type="text"
                  value={templateData.pegRatio}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, pegRatio: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              ) : (
                <p className="text-xl font-semibold text-white">{templateData.pegRatio || 'N/A'}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">EV/EBITDA</h3>
              {editMode ? (
                <input
                  type="text"
                  value={templateData.evEbitda}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, evEbitda: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              ) : (
                <p className="text-xl font-semibold text-white">{templateData.evEbitda || 'N/A'}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Dividend Yield (%)</h3>
              {editMode ? (
                <input
                  type="text"
                  value={templateData.dividendYield}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, dividendYield: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              ) : (
                <p className="text-xl font-semibold text-white">{formatPercentage(templateData.dividendYield)}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Price-to-Book</h3>
              {editMode ? (
                <input
                  type="text"
                  value={templateData.priceToBook}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, priceToBook: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              ) : (
                <p className="text-xl font-semibold text-white">{templateData.priceToBook || 'N/A'}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Peer Comparison</h3>
            <p className="text-xs text-gray-500 mb-2">Where they stand vs competitors (valuation multiples, growth rates, margins)...</p>
            {editMode ? (
              <textarea
                value={templateData.peerComparison}
                onChange={(e) => setTemplateData(prev => ({ ...prev, peerComparison: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
              />
            ) : (
              <p className="text-white whitespace-pre-wrap">{templateData.peerComparison || 'Not specified'}</p>
            )}
          </div>
        </div>

        {/* Balance Sheet Health */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-semibold text-red-400">3. Balance Sheet Health</h2>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-300 mb-4">Balance Sheet Data</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Cash & Equivalents ($M)</h4>
                {editMode ? (
                  <input
                    type="text"
                    value={templateData.cashEquivalents}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, cashEquivalents: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-white">${templateData.cashEquivalents || '0'}</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Long-term Investments ($M)</h4>
                {editMode ? (
                  <input
                    type="text"
                    value={templateData.longTermInvestments}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, longTermInvestments: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-white">${templateData.longTermInvestments || '0'}</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Long-term Debt ($M)</h4>
                {editMode ? (
                  <input
                    type="text"
                    value={templateData.longTermDebt}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, longTermDebt: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-white">${templateData.longTermDebt || '0'}</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Current Assets ($M)</h4>
                {editMode ? (
                  <input
                    type="text"
                    value={templateData.currentAssets}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, currentAssets: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-white">${templateData.currentAssets || '0'}</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Short-term Investments ($M)</h4>
                {editMode ? (
                  <input
                    type="text"
                    value={templateData.shortTermInvestments}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, shortTermInvestments: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-white">${templateData.shortTermInvestments || '0'}</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Short-term Debt ($M)</h4>
                {editMode ? (
                  <input
                    type="text"
                    value={templateData.shortTermDebt}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, shortTermDebt: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-white">${templateData.shortTermDebt || '0'}</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Total Assets ($M)</h4>
                {editMode ? (
                  <input
                    type="text"
                    value={templateData.totalAssets}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, totalAssets: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-white">${templateData.totalAssets || '0'}</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Current Liabilities ($M)</h4>
                {editMode ? (
                  <input
                    type="text"
                    value={templateData.currentLiabilities}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, currentLiabilities: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-white">${templateData.currentLiabilities || '0'}</p>
                )}
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
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-semibold text-red-400">4. Cash Flow Quality</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-4">Operating Cash Flow ($M)</h3>
              <div className="space-y-3">
                {['2025', '2024', '2023'].map((year) => (
                  <div key={year}>
                    <h4 className="text-sm text-gray-500 mb-1">{year}</h4>
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData[`operatingCashFlow${year}` as keyof TemplateData] as string}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, [`operatingCashFlow${year}`]: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${templateData[`operatingCashFlow${year}` as keyof TemplateData] || '0'}</p>
                    )}
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
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData[`netIncome${year}` as keyof TemplateData] as string}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, [`netIncome${year}`]: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${templateData[`netIncome${year}` as keyof TemplateData] || '0'}</p>
                    )}
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
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData[`capex${year}` as keyof TemplateData] as string}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, [`capex${year}`]: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${templateData[`capex${year}` as keyof TemplateData] || '0'}</p>
                    )}
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
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-semibold text-red-400">5. Income Statement Trends</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-4">Total Revenue ($M)</h3>
              <div className="space-y-3">
                {['2025', '2024', '2023'].map((year) => (
                  <div key={year}>
                    <h4 className="text-sm text-gray-500 mb-1">{year}</h4>
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData[`totalRevenue${year}` as keyof TemplateData] as string}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, [`totalRevenue${year}`]: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${templateData[`totalRevenue${year}` as keyof TemplateData] || '0'}</p>
                    )}
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
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData[`netIncomeStatement${year}` as keyof TemplateData] as string}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, [`netIncomeStatement${year}`]: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${templateData[`netIncomeStatement${year}` as keyof TemplateData] || '0'}</p>
                    )}
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

        {/* Investment Decision */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-semibold text-red-400">9. Your Thesis & Investment Decision</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-4">Investment Cases</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Bull Case</h4>
                    <p className="text-xs text-gray-500 mb-2">Why this stock can work - key drivers, positive scenarios, upside potential...</p>
                    {editMode ? (
                      <textarea
                        value={templateData.bullCase}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, bullCase: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      />
                    ) : (
                      <p className="text-white whitespace-pre-wrap">{templateData.bullCase || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Bear Case</h4>
                    <p className="text-xs text-gray-500 mb-2">Main risks and what breaks your thesis - key concerns, negative scenarios...</p>
                    {editMode ? (
                      <textarea
                        value={templateData.bearCase}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, bearCase: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      />
                    ) : (
                      <p className="text-white whitespace-pre-wrap">{templateData.bearCase || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Key Catalysts</h4>
                    <p className="text-xs text-gray-500 mb-2">What events or developments could move the stock significantly...</p>
                    {editMode ? (
                      <textarea
                        value={templateData.keyCatalysts}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, keyCatalysts: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      />
                    ) : (
                      <p className="text-white whitespace-pre-wrap">{templateData.keyCatalysts || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Primary Risk Factors</h4>
                    <p className="text-xs text-gray-500 mb-2">Most concerning risks that could impact the investment...</p>
                    {editMode ? (
                      <textarea
                        value={templateData.primaryRiskFactors}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, primaryRiskFactors: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      />
                    ) : (
                      <p className="text-white whitespace-pre-wrap">{templateData.primaryRiskFactors || 'Not specified'}</p>
                    )}
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
                    {editMode ? (
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
                    ) : (
                      <p className="text-white">{templateData.investmentDecision || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Confidence Level</h4>
                    {editMode ? (
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
                    ) : (
                      <p className="text-white">{templateData.confidenceLevel || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Investment Time Horizon</h4>
                    <p className="text-xs text-gray-500 mb-2">e.g., 2-3 years, 5+ years</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData.investmentTimeHorizon}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, investmentTimeHorizon: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{templateData.investmentTimeHorizon || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Recommended Position Size</h4>
                    <p className="text-xs text-gray-500 mb-2">e.g., 3-5% of portfolio</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData.recommendedPositionSize}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, recommendedPositionSize: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{templateData.recommendedPositionSize || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-4">Valuation Assessment</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Target Price ($)</h4>
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData.targetPrice}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, targetPrice: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{formatCurrency(templateData.targetPrice)}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Fair Value Estimate ($)</h4>
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData.fairValueEstimate}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, fairValueEstimate: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{formatCurrency(templateData.fairValueEstimate)}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">DCF Valuation ($)</h4>
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData.dcfValuation}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, dcfValuation: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{formatCurrency(templateData.dcfValuation)}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Multiples Valuation ($)</h4>
                    {editMode ? (
                      <input
                        type="text"
                        value={templateData.multiplesValuation}
                        onChange={(e) => setTemplateData(prev => ({ ...prev, multiplesValuation: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{formatCurrency(templateData.multiplesValuation)}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Additional Thesis Notes</h3>
                <p className="text-xs text-gray-500 mb-2">Any additional thoughts, assumptions, or considerations for your investment thesis...</p>
                {editMode ? (
                  <textarea
                    value={templateData.additionalThesisNotes}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, additionalThesisNotes: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-white whitespace-pre-wrap">{templateData.additionalThesisNotes || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}