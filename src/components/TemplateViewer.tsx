import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard as Edit, Save, X, Building, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface Template {
  id: string;
  title: string;
  ticker: string | null;
  sector: string | null;
  created_at: string;
  content: string;
}

export default function TemplateViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});

  useEffect(() => {
    if (user && supabase && id) {
      fetchTemplate();
    }
  }, [user, id]);

  const fetchTemplate = async () => {
    if (!user || !supabase || !id) return;

    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setTemplate(data);
      
      // Parse the content and set it as edited data
      try {
        const parsedContent = JSON.parse(data.content);
        setEditedData(parsedContent);
      } catch {
        setEditedData({});
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      setError('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !supabase || !template) return;

    try {
      const { error } = await supabase
        .from('templates')
        .update({
          content: JSON.stringify(editedData),
          title: editedData.companyName || template.title,
          ticker: editedData.tickerSymbol || template.ticker
        })
        .eq('id', template.id);

      if (error) throw error;
      
      setIsEditing(false);
      fetchTemplate(); // Refresh the data
    } catch (error) {
      console.error('Error saving template:', error);
      setError('Failed to save changes');
    }
  };

  const formatCurrency = (value: string | number) => {
    if (!value || value === '' || value === '0' || value === 0) return '$0.00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '$0.00';
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (value: string | number) => {
    if (!value || value === '' || value === '0' || value === 0) return '0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-US');
  };

  const getValue = (field: string) => {
    return editedData[field] || 'Not specified';
  };

  const updateValue = (field: string, value: any) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Template Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'The requested template could not be found.'}</p>
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
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-red-400 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Template</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Template Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Building className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-3xl font-bold">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.companyName || ''}
                      onChange={(e) => updateValue('companyName', e.target.value)}
                      className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white"
                      placeholder="Company Name"
                    />
                  ) : (
                    getValue('companyName')
                  )}
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  {template.ticker && (
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-mono">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedData.tickerSymbol || ''}
                          onChange={(e) => updateValue('tickerSymbol', e.target.value)}
                          className="bg-transparent border-none text-red-400 w-20"
                          placeholder="TICKER"
                        />
                      ) : (
                        getValue('tickerSymbol')
                      )}
                    </span>
                  )}
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created {new Date(template.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Company Profile */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-red-400">Company Profile</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Company Name</h3>
                <p className="text-gray-300">{getValue('companyName')}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Ticker Symbol</h3>
                <p className="text-gray-300">{getValue('tickerSymbol')}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Business Model</h3>
                <p className="text-xs text-gray-500 mb-2">What they sell, who they sell to...</p>
                {isEditing ? (
                  <textarea
                    value={editedData.businessModel || ''}
                    onChange={(e) => updateValue('businessModel', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{getValue('businessModel')}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Revenue Breakdown</h3>
                <p className="text-xs text-gray-500 mb-2">Main segments/products and % of revenue each...</p>
                {isEditing ? (
                  <textarea
                    value={editedData.revenueBreakdown || ''}
                    onChange={(e) => updateValue('revenueBreakdown', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{getValue('revenueBreakdown')}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Moats & Competitive Advantages</h3>
                <p className="text-xs text-gray-500 mb-2">Brand, patents, network effects, cost advantages...</p>
                {isEditing ? (
                  <textarea
                    value={editedData.moatsAdvantages || ''}
                    onChange={(e) => updateValue('moatsAdvantages', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{getValue('moatsAdvantages')}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Risks & Weaknesses</h3>
                <p className="text-xs text-gray-500 mb-2">Regulation, disruption, debt dependency, concentration of customers...</p>
                {isEditing ? (
                  <textarea
                    value={editedData.risksWeaknesses || ''}
                    onChange={(e) => updateValue('risksWeaknesses', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{getValue('risksWeaknesses')}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Industry Trends</h3>
                <p className="text-xs text-gray-500 mb-2">Macro tailwinds/headwinds affecting the industry...</p>
                {isEditing ? (
                  <textarea
                    value={editedData.industryTrends || ''}
                    onChange={(e) => updateValue('industryTrends', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{getValue('industryTrends')}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Competitor Landscape</h3>
                <p className="text-xs text-gray-500 mb-2">Key competitors and competitive positioning...</p>
                {isEditing ? (
                  <textarea
                    value={editedData.competitorLandscape || ''}
                    onChange={(e) => updateValue('competitorLandscape', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{getValue('competitorLandscape')}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Regulatory Environment</h3>
                <p className="text-xs text-gray-500 mb-2">Regulatory factors affecting the business...</p>
                {isEditing ? (
                  <textarea
                    value={editedData.regulatoryEnvironment || ''}
                    onChange={(e) => updateValue('regulatoryEnvironment', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{getValue('regulatoryEnvironment')}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Customer Concentration Risk</h3>
                <p className="text-xs text-gray-500 mb-2">Customer concentration analysis (e.g., one client = 40% revenue)...</p>
                {isEditing ? (
                  <textarea
                    value={editedData.customerConcentration || ''}
                    onChange={(e) => updateValue('customerConcentration', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{getValue('customerConcentration')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Executive Management */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-red-400">Executive Management</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-4">CEO Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">CEO Name</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.ceoName || ''}
                        onChange={(e) => updateValue('ceoName', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{getValue('ceoName')}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">CEO Start Date</h4>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedData.ceoStartDate || ''}
                        onChange={(e) => updateValue('ceoStartDate', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{getValue('ceoStartDate')}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-6 mt-4">
                  <div className="flex items-center">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={editedData.founderLed || false}
                        onChange={(e) => updateValue('founderLed', e.target.checked)}
                        className="mr-2"
                      />
                    ) : (
                      <span className="mr-2">{editedData.founderLed ? '✓' : '✗'}</span>
                    )}
                    <span className="text-gray-300">Founder-led company</span>
                  </div>
                  <div className="flex items-center">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={editedData.promotedInternally || false}
                        onChange={(e) => updateValue('promotedInternally', e.target.checked)}
                        className="mr-2"
                      />
                    ) : (
                      <span className="mr-2">{editedData.promotedInternally ? '✓' : '✗'}</span>
                    )}
                    <span className="text-gray-300">Promoted internally (vs. external hire)</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">CEO Background & Track Record</h3>
                <p className="text-xs text-gray-500 mb-2">Previous experience, education, notable achievements...</p>
                {isEditing ? (
                  <textarea
                    value={editedData.ceoBackground || ''}
                    onChange={(e) => updateValue('ceoBackground', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{getValue('ceoBackground')}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-4">Leadership History</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">CEO Turnover History</h4>
                    <p className="text-xs text-gray-500 mb-2">Stable leadership or revolving door? Frequency of CEO changes...</p>
                    {isEditing ? (
                      <textarea
                        value={editedData.ceoTurnoverHistory || ''}
                        onChange={(e) => updateValue('ceoTurnoverHistory', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white resize-none"
                      />
                    ) : (
                      <p className="text-gray-300 whitespace-pre-wrap">{getValue('ceoTurnoverHistory')}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Previous CEO</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.previousCeo || ''}
                        onChange={(e) => updateValue('previousCeo', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{getValue('previousCeo')}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Management Culture</h3>
                <p className="text-xs text-gray-500 mb-2">Founder-led vs professional management culture differences...</p>
                {isEditing ? (
                  <textarea
                    value={editedData.managementCulture || ''}
                    onChange={(e) => updateValue('managementCulture', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{getValue('managementCulture')}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-4">Performance Comparison Across Leadership</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Under Current CEO</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-gray-500">Average Annual Revenue ($M)</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedData.currentCeoRevenue || ''}
                            onChange={(e) => updateValue('currentCeoRevenue', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                          />
                        ) : (
                          <p className="text-gray-300">${formatNumber(getValue('currentCeoRevenue'))}</p>
                        )}
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Average Annual Earnings ($M)</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedData.currentCeoEarnings || ''}
                            onChange={(e) => updateValue('currentCeoEarnings', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                          />
                        ) : (
                          <p className="text-gray-300">${formatNumber(getValue('currentCeoEarnings'))}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Under Previous CEO</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-gray-500">Average Annual Revenue ($M)</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedData.previousCeoRevenue || ''}
                            onChange={(e) => updateValue('previousCeoRevenue', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                          />
                        ) : (
                          <p className="text-gray-300">${formatNumber(getValue('previousCeoRevenue'))}</p>
                        )}
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Average Annual Earnings ($M)</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedData.previousCeoEarnings || ''}
                            onChange={(e) => updateValue('previousCeoEarnings', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                          />
                        ) : (
                          <p className="text-gray-300">${formatNumber(getValue('previousCeoEarnings'))}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-4">Additional Management Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Key Executives</h4>
                    <p className="text-xs text-gray-500 mb-2">Other important leadership team members and their roles...</p>
                    {isEditing ? (
                      <textarea
                        value={editedData.keyExecutives || ''}
                        onChange={(e) => updateValue('keyExecutives', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      />
                    ) : (
                      <p className="text-gray-300 whitespace-pre-wrap">{getValue('keyExecutives')}</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Recent Leadership Changes</h4>
                    <p className="text-xs text-gray-500 mb-2">Recent changes in leadership team and their potential impact...</p>
                    {isEditing ? (
                      <textarea
                        value={editedData.recentLeadershipChanges || ''}
                        onChange={(e) => updateValue('recentLeadershipChanges', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      />
                    ) : (
                      <p className="text-gray-300 whitespace-pre-wrap">{getValue('recentLeadershipChanges')}</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Management Notes</h4>
                    <p className="text-xs text-gray-500 mb-2">Additional observations about management quality, governance, compensation...</p>
                    {isEditing ? (
                      <textarea
                        value={editedData.managementNotes || ''}
                        onChange={(e) => updateValue('managementNotes', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      />
                    ) : (
                      <p className="text-gray-300 whitespace-pre-wrap">{getValue('managementNotes')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Valuation Snapshot */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-red-400">Valuation Snapshot</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Current Price ($)</h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.currentPrice || ''}
                    onChange={(e) => updateValue('currentPrice', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-xl font-semibold text-white">{formatCurrency(getValue('currentPrice'))}</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Market Cap ($B)</h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.marketCap || ''}
                    onChange={(e) => updateValue('marketCap', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-xl font-semibold text-white">${formatNumber(getValue('marketCap'))}B</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">P/E Ratio</h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.peRatio || ''}
                    onChange={(e) => updateValue('peRatio', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-xl font-semibold text-white">{getValue('peRatio') === 'Not specified' ? 'N/A' : getValue('peRatio')}</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Forward P/E</h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.forwardPE || ''}
                    onChange={(e) => updateValue('forwardPE', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-xl font-semibold text-white">{getValue('forwardPE') === 'Not specified' ? 'N/A' : getValue('forwardPE')}</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">PEG Ratio</h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.pegRatio || ''}
                    onChange={(e) => updateValue('pegRatio', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-xl font-semibold text-white">{getValue('pegRatio') === 'Not specified' ? 'N/A' : getValue('pegRatio')}</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">EV/EBITDA</h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.evEbitda || ''}
                    onChange={(e) => updateValue('evEbitda', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-xl font-semibold text-white">{getValue('evEbitda') === 'Not specified' ? 'N/A' : getValue('evEbitda')}</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Dividend Yield (%)</h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.dividendYield || ''}
                    onChange={(e) => updateValue('dividendYield', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-xl font-semibold text-white">{formatNumber(getValue('dividendYield'))}%</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Price-to-Book</h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.priceToBook || ''}
                    onChange={(e) => updateValue('priceToBook', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  />
                ) : (
                  <p className="text-xl font-semibold text-white">{getValue('priceToBook') === 'Not specified' ? 'N/A' : getValue('priceToBook')}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">Peer Comparison</h3>
              <p className="text-xs text-gray-500 mb-2">Where they stand vs competitors (valuation multiples, growth rates, margins)...</p>
              {isEditing ? (
                <textarea
                  value={editedData.peerComparison || ''}
                  onChange={(e) => updateValue('peerComparison', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                />
              ) : (
                <p className="text-gray-300 whitespace-pre-wrap">{getValue('peerComparison')}</p>
              )}
            </div>
          </div>

          {/* Balance Sheet Health */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-red-400">Balance Sheet Health</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-300 mb-4">Balance Sheet Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Cash & Equivalents ($M)</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.cashEquivalents || ''}
                        onChange={(e) => updateValue('cashEquivalents', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('cashEquivalents'))}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Long-term Investments ($M)</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.longTermInvestments || ''}
                        onChange={(e) => updateValue('longTermInvestments', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('longTermInvestments'))}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Long-term Debt ($M)</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.longTermDebt || ''}
                        onChange={(e) => updateValue('longTermDebt', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('longTermDebt'))}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Current Assets ($M)</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.currentAssets || ''}
                        onChange={(e) => updateValue('currentAssets', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('currentAssets'))}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Short-term Investments ($M)</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.shortTermInvestments || ''}
                        onChange={(e) => updateValue('shortTermInvestments', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('shortTermInvestments'))}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Short-term Debt ($M)</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.shortTermDebt || ''}
                        onChange={(e) => updateValue('shortTermDebt', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('shortTermDebt'))}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Total Assets ($M)</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.totalAssets || ''}
                        onChange={(e) => updateValue('totalAssets', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('totalAssets'))}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Current Liabilities ($M)</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.currentLiabilities || ''}
                        onChange={(e) => updateValue('currentLiabilities', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('currentLiabilities'))}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Calculated Ratios */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-300 mb-4">Calculated Ratios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Cash & Investments:</span>
                  <span className="text-green-400 font-mono">${formatNumber(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Debt-to-Assets Ratio:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400 font-mono">0.0%</span>
                    <span className="text-xs text-green-400">Low Risk</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Debt:</span>
                  <span className="text-green-400 font-mono">${formatNumber(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current Ratio:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 font-mono">0.00</span>
                    <span className="text-xs text-gray-400">Weak</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Net Cash/Debt:</span>
                  <span className="text-green-400 font-mono">${formatNumber(0)} Cash</span>
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
            <h2 className="text-2xl font-semibold mb-6 text-red-400">Cash Flow Quality</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Operating Cash Flow ($M)</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">2025</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.operatingCashFlow2025 || ''}
                        onChange={(e) => updateValue('operatingCashFlow2025', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('operatingCashFlow2025'))}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">2024</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.operatingCashFlow2024 || ''}
                        onChange={(e) => updateValue('operatingCashFlow2024', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('operatingCashFlow2024'))}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">2023</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.operatingCashFlow2023 || ''}
                        onChange={(e) => updateValue('operatingCashFlow2023', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('operatingCashFlow2023'))}</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Net Income ($M)</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">2025</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.netIncome2025 || ''}
                        onChange={(e) => updateValue('netIncome2025', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('netIncome2025'))}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">2024</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.netIncome2024 || ''}
                        onChange={(e) => updateValue('netIncome2024', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('netIncome2024'))}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">2023</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.netIncome2023 || ''}
                        onChange={(e) => updateValue('netIncome2023', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('netIncome2023'))}</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Capital Expenditure ($M)</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">2025</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.capex2025 || ''}
                        onChange={(e) => updateValue('capex2025', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('capex2025'))}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">2024</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.capex2024 || ''}
                        onChange={(e) => updateValue('capex2024', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('capex2024'))}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">2023</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.capex2023 || ''}
                        onChange={(e) => updateValue('capex2023', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('capex2023'))}</p>
                    )}
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
                      <td className="text-right py-2 text-white">${formatNumber(getValue('operatingCashFlow2023'))}</td>
                      <td className="text-right py-2 text-white">${formatNumber(getValue('operatingCashFlow2024'))}</td>
                      <td className="text-right py-2 text-white">${formatNumber(getValue('operatingCashFlow2025'))}</td>
                      <td className="text-right py-2 text-red-400">0.0%</td>
                      <td className="text-right py-2 text-red-400">0.0%</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-300">Net Income</td>
                      <td className="text-right py-2 text-white">${formatNumber(getValue('netIncome2023'))}</td>
                      <td className="text-right py-2 text-white">${formatNumber(getValue('netIncome2024'))}</td>
                      <td className="text-right py-2 text-white">${formatNumber(getValue('netIncome2025'))}</td>
                      <td className="text-right py-2 text-red-400">0.0%</td>
                      <td className="text-right py-2 text-red-400">0.0%</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-300">Free Cash Flow</td>
                      <td className="text-right py-2 text-white">${formatNumber(0)}</td>
                      <td className="text-right py-2 text-white">${formatNumber(0)}</td>
                      <td className="text-right py-2 text-white">${formatNumber(0)}</td>
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
            <h2 className="text-2xl font-semibold mb-6 text-red-400">Income Statement Trends</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Total Revenue ($M)</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">2025</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.totalRevenue2025 || ''}
                        onChange={(e) => updateValue('totalRevenue2025', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('totalRevenue2025'))}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">2024</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.totalRevenue2024 || ''}
                        onChange={(e) => updateValue('totalRevenue2024', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('totalRevenue2024'))}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">2023</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.totalRevenue2023 || ''}
                        onChange={(e) => updateValue('totalRevenue2023', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('totalRevenue2023'))}</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Net Income ($M)</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">2025</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.netIncomeStatement2025 || ''}
                        onChange={(e) => updateValue('netIncomeStatement2025', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('netIncomeStatement2025'))}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">2024</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.netIncomeStatement2024 || ''}
                        onChange={(e) => updateValue('netIncomeStatement2024', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('netIncomeStatement2024'))}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">2023</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.netIncomeStatement2023 || ''}
                        onChange={(e) => updateValue('netIncomeStatement2023', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">${formatNumber(getValue('netIncomeStatement2023'))}</p>
                    )}
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
                      <td className="text-right py-2 text-white">${formatNumber(getValue('totalRevenue2023'))}</td>
                      <td className="text-right py-2 text-white">${formatNumber(getValue('totalRevenue2024'))}</td>
                      <td className="text-right py-2 text-white">${formatNumber(getValue('totalRevenue2025'))}</td>
                      <td className="text-right py-2 text-red-400">0.0%</td>
                      <td className="text-right py-2 text-red-400">0.0%</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-300">Net Income</td>
                      <td className="text-right py-2 text-white">${formatNumber(getValue('netIncomeStatement2023'))}</td>
                      <td className="text-right py-2 text-white">${formatNumber(getValue('netIncomeStatement2024'))}</td>
                      <td className="text-right py-2 text-white">${formatNumber(getValue('netIncomeStatement2025'))}</td>
                      <td className="text-right py-2 text-red-400">0.0%</td>
                      <td className="text-right py-2 text-red-400">0.0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Your Thesis & Investment Decision */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-red-400">Your Thesis & Investment Decision</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-4">Investment Cases</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Bull Case</h4>
                    <p className="text-xs text-gray-500 mb-2">Why this stock can work - key drivers, positive scenarios, upside potential...</p>
                    {isEditing ? (
                      <textarea
                        value={editedData.bullCase || ''}
                        onChange={(e) => updateValue('bullCase', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      />
                    ) : (
                      <p className="text-gray-300 whitespace-pre-wrap">{getValue('bullCase')}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Bear Case</h4>
                    <p className="text-xs text-gray-500 mb-2">Main risks and what breaks your thesis - key concerns, negative scenarios...</p>
                    {isEditing ? (
                      <textarea
                        value={editedData.bearCase || ''}
                        onChange={(e) => updateValue('bearCase', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                      />
                    ) : (
                      <p className="text-gray-300 whitespace-pre-wrap">{getValue('bearCase')}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Key Catalysts</h4>
                <p className="text-xs text-gray-500 mb-2">What events or developments could move the stock significantly...</p>
                {isEditing ? (
                  <textarea
                    value={editedData.keyCatalysts || ''}
                    onChange={(e) => updateValue('keyCatalysts', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{getValue('keyCatalysts')}</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Primary Risk Factors</h4>
                <p className="text-xs text-gray-500 mb-2">Most concerning risks that could impact the investment...</p>
                {isEditing ? (
                  <textarea
                    value={editedData.primaryRiskFactors || ''}
                    onChange={(e) => updateValue('primaryRiskFactors', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{getValue('primaryRiskFactors')}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-4">Investment Decision</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Investment Decision</h4>
                    {isEditing ? (
                      <select
                        value={editedData.investmentDecision || ''}
                        onChange={(e) => updateValue('investmentDecision', e.target.value)}
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
                      <p className="text-gray-300">{getValue('investmentDecision')}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Confidence Level</h4>
                    {isEditing ? (
                      <select
                        value={editedData.confidenceLevel || ''}
                        onChange={(e) => updateValue('confidenceLevel', e.target.value)}
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
                      <p className="text-gray-300">{getValue('confidenceLevel')}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Investment Time Horizon</h4>
                  <p className="text-xs text-gray-500 mb-2">e.g., 2-3 years, 5+ years</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.investmentTimeHorizon || ''}
                      onChange={(e) => updateValue('investmentTimeHorizon', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    />
                  ) : (
                    <p className="text-gray-300">{getValue('investmentTimeHorizon')}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Recommended Position Size</h4>
                  <p className="text-xs text-gray-500 mb-2">e.g., 3-5% of portfolio</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.recommendedPositionSize || ''}
                      onChange={(e) => updateValue('recommendedPositionSize', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    />
                  ) : (
                    <p className="text-gray-300">{getValue('recommendedPositionSize')}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-4">Valuation Assessment</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Target Price ($)</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.targetPrice || ''}
                        onChange={(e) => updateValue('targetPrice', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{formatCurrency(getValue('targetPrice'))}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Fair Value Estimate ($)</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.fairValueEstimate || ''}
                        onChange={(e) => updateValue('fairValueEstimate', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{formatCurrency(getValue('fairValueEstimate'))}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">DCF Valuation ($)</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.dcfValuation || ''}
                        onChange={(e) => updateValue('dcfValuation', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{formatCurrency(getValue('dcfValuation'))}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Multiples Valuation ($)</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.multiplesValuation || ''}
                        onChange={(e) => updateValue('multiplesValuation', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{formatCurrency(getValue('multiplesValuation'))}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Additional Thesis Notes</h4>
                <p className="text-xs text-gray-500 mb-2">Any additional thoughts, assumptions, or considerations for your investment thesis...</p>
                {isEditing ? (
                  <textarea
                    value={editedData.additionalThesisNotes || ''}
                    onChange={(e) => updateValue('additionalThesisNotes', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap">{getValue('additionalThesisNotes')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}