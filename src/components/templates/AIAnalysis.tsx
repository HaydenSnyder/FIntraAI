import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Search, Loader, AlertCircle, FileText, Building, TrendingUp, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { supabase } from '../../lib/supabase';

interface AnalysisResult {
  ticker: string;
  companyName: string;
  templateData: any;
  filingsSummary: {
    tenK: string;
    tenQ: string;
    lastUpdated: string;
  };
}

export default function AIAnalysis() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, canCreateTemplate, refreshSubscription } = useSubscription(user);
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Check if user has AI access
  const hasAIAccess = subscription.hasAIAccess;

  if (!hasAIAccess) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
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

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-gray-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">AI Analysis Requires Pro Plan</h1>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Upgrade to Pro to access AI-powered SEC filing analysis and automatic template generation.
            </p>
            <button
              onClick={() => navigate('/', { state: { scrollTo: 'pricing' } })}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Upgrade to Pro
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleGenerateTemplate = async () => {
    if (!ticker.trim()) {
      setError('Please enter a ticker symbol');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisResult(null);

    try {
      // Call our edge function to generate the template
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ai-template`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ticker: ticker.toUpperCase(),
          userId: user?.id 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate template');
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err: any) {
      console.error('AI Analysis error:', err);
      setError(err.message || 'Failed to generate template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!analysisResult || !user || !supabase || !canCreateTemplate()) {
      setError('Unable to save template. Please check your subscription status.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('templates')
        .insert({
          user_id: user.id,
          title: `${analysisResult.companyName} (${analysisResult.ticker}) - AI Generated`,
          content: JSON.stringify(analysisResult.templateData),
          ticker: analysisResult.ticker,
          sector: analysisResult.templateData.basicInfo?.sector || null
        });

      if (error) throw error;

      setSaved(true);
      await refreshSubscription();
      
      // Show success message briefly then redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err: any) {
      console.error('Save template error:', err);
      setError('Failed to save template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditTemplate = () => {
    if (!analysisResult) return;
    
    // Navigate to create template with pre-filled data
    navigate('/create-template', {
      state: {
        prefilledData: analysisResult.templateData,
        ticker: analysisResult.ticker,
        isAIGenerated: true
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysisResult ? (
          /* Input Section */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">AI Stock Analysis</h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Generate comprehensive research templates using AI analysis of SEC filings
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
              <div className="mb-6">
                <label htmlFor="ticker" className="block text-lg font-semibold text-gray-300 mb-3">
                  Company Ticker Symbol
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="ticker"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="e.g., AAPL, MSFT, GOOGL"
                    className="w-full px-4 py-4 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg font-mono"
                    disabled={loading}
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                  <span className="text-red-400">{error}</span>
                </div>
              )}

              <button
                onClick={handleGenerateTemplate}
                disabled={loading || !ticker.trim()}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 flex items-center justify-center text-lg"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-3 animate-spin" />
                    Analyzing SEC Filings...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-3" />
                    Generate AI Template
                  </>
                )}
              </button>

              <div className="mt-6 text-sm text-gray-400 space-y-2">
                <p className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Analyzes latest 10-K and 10-Q filings from SEC EDGAR
                </p>
                <p className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Extracts key business metrics and financial data
                </p>
                <p className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generates comprehensive research template
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {analysisResult.companyName} ({analysisResult.ticker})
                </h1>
                <p className="text-gray-400">AI-Generated Research Template</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleEditTemplate}
                  className="border border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Edit Template
                </button>
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
            </div>

            {/* Comprehensive Template Preview */}
            <div className="space-y-6">
              {/* Structured Data Display */}
              {analysisResult.templateData.structuredData && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-6 text-red-400">AI-Extracted Structured Data</h2>
                  
                  {/* Company Profile */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Company Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Ticker:</span>
                            <span className="text-white font-mono">{analysisResult.templateData.structuredData.companyProfile.ticker}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Company:</span>
                            <span className="text-white">{analysisResult.templateData.structuredData.companyProfile.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Sector:</span>
                            <span className="text-white">{analysisResult.templateData.structuredData.companyProfile.industrySector}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Revenue Streams</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {analysisResult.templateData.structuredData.companyProfile.revenueStreams.map((stream, index) => (
                            <li key={index}>• {stream}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Business Description</h4>
                      <p className="text-gray-300 text-sm">{analysisResult.templateData.structuredData.companyProfile.businessDescription}</p>
                    </div>
                  </div>

                  {/* Financial Metrics */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Financial Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{analysisResult.templateData.structuredData.financialMetrics.peRatio}</div>
                        <div className="text-xs text-gray-400">P/E Ratio</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{analysisResult.templateData.structuredData.financialMetrics.forwardPe}</div>
                        <div className="text-xs text-gray-400">Forward P/E</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{analysisResult.templateData.structuredData.financialMetrics.pegRatio}</div>
                        <div className="text-xs text-gray-400">PEG Ratio</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{analysisResult.templateData.structuredData.financialMetrics.dividendYield}%</div>
                        <div className="text-xs text-gray-400">Dividend Yield</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{analysisResult.templateData.structuredData.financialMetrics.expectedEpsGrowth}%</div>
                        <div className="text-xs text-gray-400">Expected EPS Growth</div>
                      </div>
                    </div>
                  </div>

                  {/* Balance Sheet */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Balance Sheet Health</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Assets ($M)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Cash & Equivalents:</span>
                            <span className="text-white">${analysisResult.templateData.structuredData.balanceSheet.cashAndEquivalents}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Short-term Investments:</span>
                            <span className="text-white">${analysisResult.templateData.structuredData.balanceSheet.shortTermInvestments}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Long-term Investments:</span>
                            <span className="text-white">${analysisResult.templateData.structuredData.balanceSheet.longTermInvestments}</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-600 pt-2">
                            <span className="text-gray-300 font-medium">Total Liquid Assets:</span>
                            <span className="text-green-400 font-bold">${analysisResult.templateData.structuredData.balanceSheet.totalLiquidAssets}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Debt ($M)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Short-term Debt:</span>
                            <span className="text-white">${analysisResult.templateData.structuredData.balanceSheet.shortTermDebt}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Long-term Debt:</span>
                            <span className="text-white">${analysisResult.templateData.structuredData.balanceSheet.longTermDebt}</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-600 pt-2">
                            <span className="text-gray-300 font-medium">Total Debt:</span>
                            <span className="text-red-400 font-bold">${analysisResult.templateData.structuredData.balanceSheet.totalDebt}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300 font-medium">Assets/Debt Ratio:</span>
                            <span className={`font-bold ${analysisResult.templateData.structuredData.balanceSheet.assetsToDebtRatio > 1.5 ? 'text-green-400' : 'text-yellow-400'}`}>
                              {analysisResult.templateData.structuredData.balanceSheet.assetsToDebtRatio}x
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cash Flow Analysis */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Cash Flow Analysis (3-Year)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-600">
                            <th className="text-left py-2 text-gray-400">Year</th>
                            <th className="text-right py-2 text-gray-400">Net Income ($M)</th>
                            <th className="text-right py-2 text-gray-400">NI Growth</th>
                            <th className="text-right py-2 text-gray-400">Operating CF ($M)</th>
                            <th className="text-right py-2 text-gray-400">OCF Growth</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysisResult.templateData.structuredData.cashFlow.map((year) => (
                            <tr key={year.year}>
                              <td className="py-2 text-gray-300">{year.year}</td>
                              <td className="text-right py-2 text-white">${year.netIncome}</td>
                              <td className={`text-right py-2 ${year.netIncomeYoYGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {year.netIncomeYoYGrowth > 0 ? '+' : ''}{year.netIncomeYoYGrowth}%
                              </td>
                              <td className="text-right py-2 text-white">${year.operatingCashFlow}</td>
                              <td className={`text-right py-2 ${year.operatingCashFlowYoYGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {year.operatingCashFlowYoYGrowth > 0 ? '+' : ''}{year.operatingCashFlowYoYGrowth}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Income Statement */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Income Statement Trends (3-Year)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-600">
                            <th className="text-left py-2 text-gray-400">Year</th>
                            <th className="text-right py-2 text-gray-400">Revenue ($M)</th>
                            <th className="text-right py-2 text-gray-400">Revenue Growth</th>
                            <th className="text-right py-2 text-gray-400">Net Income ($M)</th>
                            <th className="text-right py-2 text-gray-400">NI Growth</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysisResult.templateData.structuredData.incomeStatement.map((year) => (
                            <tr key={year.year}>
                              <td className="py-2 text-gray-300">{year.year}</td>
                              <td className="text-right py-2 text-white">${year.totalRevenue}</td>
                              <td className={`text-right py-2 ${year.totalRevenueYoYGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {year.totalRevenueYoYGrowth > 0 ? '+' : ''}{year.totalRevenueYoYGrowth}%
                              </td>
                              <td className="text-right py-2 text-white">${year.netIncome}</td>
                              <td className={`text-right py-2 ${year.netIncomeYoYGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {year.netIncomeYoYGrowth > 0 ? '+' : ''}{year.netIncomeYoYGrowth}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Executive Management */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-300 mb-4">Executive Management</h3>
                    {analysisResult.templateData.structuredData.executiveManagement.map((exec, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-semibold text-white">{exec.name}</h4>
                            <p className="text-gray-400">{exec.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400">Start Date: {exec.startDate}</p>
                            {exec.founder && <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">Founder</span>}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{exec.notesPerformance}</p>
                      </div>
                    ))}
                  </div>

                  {/* AI Summary */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-300 mb-4">AI Analysis Summary</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-green-400 mb-3">Strengths</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {analysisResult.templateData.structuredData.summary.strengths.map((strength, index) => (
                            <li key={index}>• {strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-400 mb-3">Weaknesses & Risks</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {[...analysisResult.templateData.structuredData.summary.weaknesses, ...analysisResult.templateData.structuredData.summary.risks].map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-blue-400 mb-3">Final Verdict</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{analysisResult.templateData.structuredData.summary.finalVerdict}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Profile Section */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6 text-red-400">1. Company Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-3">Basic Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Company Name:</span>
                        <span className="text-white font-semibold">{analysisResult.templateData.companyName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ticker:</span>
                        <span className="text-white font-mono">{analysisResult.templateData.tickerSymbol || analysisResult.ticker}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sector:</span>
                        <span className="text-white">{analysisResult.templateData.basicInfo?.sector || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Cap:</span>
                        <span className="text-white">{analysisResult.templateData.basicInfo?.marketCap || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Price:</span>
                        <span className="text-white">${analysisResult.templateData.basicInfo?.currentPrice || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-3">Valuation Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">P/E Ratio:</span>
                        <span className="text-white">{analysisResult.templateData.valuation?.peRatio || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">P/B Ratio:</span>
                        <span className="text-white">{analysisResult.templateData.valuation?.pbRatio || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">EV/EBITDA:</span>
                        <span className="text-white">{analysisResult.templateData.valuation?.evEbitda || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price/Sales:</span>
                        <span className="text-white">{analysisResult.templateData.valuation?.priceToSales || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-300 mb-3">Business Model</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {analysisResult.templateData.businessModel || analysisResult.templateData.basicInfo?.description || 'Business model analysis not available'}
                  </p>
                </div>
              </div>

              {/* Financial Health Section */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6 text-red-400">2. Financial Health</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-3">Revenue & Profitability</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Revenue (TTM):</span>
                        <span className="text-white">{analysisResult.templateData.financials?.revenue || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Net Income:</span>
                        <span className="text-white">{analysisResult.templateData.financials?.netIncome || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Operating Cash Flow:</span>
                        <span className="text-white">{analysisResult.templateData.financials?.operatingCashFlow || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-3">Balance Sheet</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Assets:</span>
                        <span className="text-white">{analysisResult.templateData.financials?.totalAssets || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Debt:</span>
                        <span className="text-white">{analysisResult.templateData.financials?.totalDebt || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cash & Equivalents:</span>
                        <span className="text-white">{analysisResult.templateData.financials?.cashAndEquivalents || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-3">Key Ratios</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Ratio:</span>
                        <span className="text-white">N/A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Debt-to-Assets:</span>
                        <span className="text-white">N/A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">ROE:</span>
                        <span className="text-white">N/A</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis Section */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6 text-red-400">3. AI Analysis Summary</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-green-400 mb-3">Key Strengths</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {analysisResult.templateData.analysis?.strengths || analysisResult.templateData.bullCase || 'Strengths analysis not available'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-red-400 mb-3">Key Risks</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {analysisResult.templateData.analysis?.risks || analysisResult.templateData.bearCase || 'Risk analysis not available'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-blue-400 mb-3">Investment Thesis</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {analysisResult.templateData.analysis?.thesis || analysisResult.templateData.additionalThesisNotes || 'Investment thesis not available'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-yellow-400 mb-3">Key Catalysts</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {analysisResult.templateData.keyCatalysts || 'Key catalysts analysis not available'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Management Section */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6 text-red-400">4. Executive Management</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-3">Leadership Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">CEO:</span>
                        <span className="text-white">{analysisResult.templateData.ceoName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">CEO Start Date:</span>
                        <span className="text-white">{analysisResult.templateData.ceoStartDate || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Founder-led:</span>
                        <span className="text-white">{analysisResult.templateData.founderLed ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-3">Management Quality</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {analysisResult.templateData.ceoBackground || analysisResult.templateData.managementNotes || 'Management analysis not available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Filing Sources */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6 text-red-400">5. SEC Filing Sources</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-3">Latest 10-K</h3>
                    <p className="text-gray-400 text-sm">{analysisResult.filingsSummary.tenK}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-3">Latest 10-Q</h3>
                    <p className="text-gray-400 text-sm">{analysisResult.filingsSummary.tenQ}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-3">Last Updated</h3>
                    <p className="text-gray-400 text-sm">{analysisResult.filingsSummary.lastUpdated}</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 text-red-400">AI-Generated Template</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    This comprehensive research template was automatically generated using AI analysis of the company's latest SEC filings. 
                    All data points, financial metrics, and analysis sections have been populated based on information extracted from 
                    10-K and 10-Q documents. You can edit this template to add your own insights and analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}