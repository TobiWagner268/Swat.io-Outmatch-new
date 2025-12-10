import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Scale, 
  TrendingUp, 
  MessageCircle, 
  Target,
  Menu,
  ChevronRight,
  ChevronDown,
  Plus,
  Globe,
  AlertTriangle,
  Trophy,
  Quote,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Star,
  Calendar,
  Settings2,
  Clock,
  LayoutGrid,
  Edit2,
  Download,
  FileText,
  FileSpreadsheet,
  File
} from 'lucide-react';
import { INITIAL_COMPETITORS, SECTION_TITLES } from './data';
import { SectionType, CompetitorId, AnalysisData } from './types';
import { AIChatOverlay } from './components/AIChatOverlay';
import { AddCompetitorModal } from './components/AddCompetitorModal';
import { ManageCompetitorsModal } from './components/ManageCompetitorsModal';
import { generateCompetitorProfile } from './services/geminiService';
import { ReviewChart } from './components/Charts';
import { exportToCSV, exportToDocs, exportToPDF } from './services/exportService';

const AUTO_REFRESH_INTERVAL_MS = 4 * 7 * 24 * 60 * 60 * 1000; // 4 weeks in milliseconds

const getIcon = (type: SectionType) => {
  switch (type) {
    case SectionType.EXECUTIVE_SUMMARY: return <LayoutGrid size={18} />;
    case SectionType.FEATURE_CHECK: return <CheckCircle2 size={18} />;
    case SectionType.PLATFORM_COVERAGE: return <Globe size={18} />;
    case SectionType.PRICING: return <Scale size={18} />;
    case SectionType.MOMENTUM: return <TrendingUp size={18} />;
    case SectionType.REVIEWS: return <MessageCircle size={18} />;
    case SectionType.RED_FLAGS: return <ShieldAlert size={18} />;
    case SectionType.SALES_ARGUMENTS: return <Target size={18} />;
    default: return <Target size={18} />;
  }
};

// Custom Swat.io Logo Component (Default Fallback)
const SwatIoLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill="#0C3146" />
    <path d="M25 32 L43 50 L25 68" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="62" y1="38" x2="85" y2="38" stroke="white" strokeWidth="10" strokeLinecap="round" />
    <line x1="62" y1="62" x2="85" y2="62" stroke="white" strokeWidth="10" strokeLinecap="round" />
    <path d="M30 82 Q57 98 84 82" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface SidebarItemProps {
  type: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ type, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg mb-1 group
      ${isActive 
        ? 'bg-[#EEF9FF] text-[#18638B]' 
        : 'text-[#61768E] hover:bg-[#DAE0E7]/30 hover:text-[#0C3146]'
      }`}
  >
    {getIcon(type)}
    <span>{SECTION_TITLES[type]}</span>
  </button>
);

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>(SectionType.EXECUTIVE_SUMMARY);
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<CompetitorId>('hootsuite');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  
  // Initialize Custom Logo from LocalStorage
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('customLogo');
    } catch (e) {
      return null;
    }
  });

  // Initialize from LocalStorage or Fallback
  const [competitors, setCompetitors] = useState<Record<string, AnalysisData>>(() => {
    try {
      const saved = localStorage.getItem('competitors');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load from local storage", e);
    }
    return INITIAL_COMPETITORS;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);

  // Persistence Effect for Competitors
  useEffect(() => {
    try {
      localStorage.setItem('competitors', JSON.stringify(competitors));
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  }, [competitors]);

  // Handle Logo Update
  const handleLogoUpdate = (newLogo: string | null) => {
    setCustomLogo(newLogo);
    try {
      if (newLogo) {
        localStorage.setItem('customLogo', newLogo);
      } else {
        localStorage.removeItem('customLogo');
      }
    } catch (e) {
      console.error("Failed to save logo", e);
    }
  };

  // Close Export Menu on Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-Refresh Check Effect
  useEffect(() => {
    const checkAndAutoRefresh = async () => {
      const now = Date.now();
      const competitorsList = Object.values(competitors) as AnalysisData[];
      const competitorsToRefresh = competitorsList.filter(comp => {
        // Refresh if lastUpdated is missing (legacy data) or older than interval
        const lastUpdated = comp.lastUpdated || 0;
        return (now - lastUpdated) > AUTO_REFRESH_INTERVAL_MS && comp.url;
      });

      if (competitorsToRefresh.length > 0) {
        setIsAutoRefreshing(true);
        console.log(`Auto-refreshing ${competitorsToRefresh.length} stale competitors...`);
        
        // Refresh one by one to avoid overwhelming API or getting rate limited
        for (const comp of competitorsToRefresh) {
           try {
             const newData = await generateCompetitorProfile(comp.name, comp.url, comp.id);
             setCompetitors(prev => ({
               ...prev,
               [comp.id]: newData
             }));
           } catch (e) {
             console.error(`Failed to auto-refresh ${comp.name}`, e);
           }
        }
        setIsAutoRefreshing(false);
      }
    };

    checkAndAutoRefresh();
  }, []); // Run once on mount

  // Get current data based on selection. If selected ID is missing (deleted), default to first available.
  const currentData = competitors[selectedCompetitorId] || Object.values(competitors)[0];

  const handleAddCompetitor = async (name: string, url: string) => {
    const newData = await generateCompetitorProfile(name, url);
    setCompetitors(prev => ({
      ...prev,
      [newData.id]: newData
    }));
    setSelectedCompetitorId(newData.id);
  };

  const handleRefreshCompetitor = async (id: string, name: string, url: string) => {
    if (!url) return;
    const newData = await generateCompetitorProfile(name, url, id);
    setCompetitors(prev => ({
      ...prev,
      [id]: newData
    }));
  };

  const handleRefreshAll = async () => {
    const promises = Object.values(competitors).map((comp: AnalysisData) => {
      if (comp.url) {
        return generateCompetitorProfile(comp.name, comp.url, comp.id).then(newData => ({
          id: comp.id,
          data: newData
        }));
      }
      return Promise.resolve(null);
    });

    const results = await Promise.all(promises);
    
    setCompetitors(prev => {
      const next = { ...prev };
      results.forEach(res => {
        if (res) {
          next[res.id] = res.data;
        }
      });
      return next;
    });
  };

  const handleDeleteCompetitor = (id: string) => {
    setCompetitors(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    // If we deleted the selected one, switch to first available
    if (selectedCompetitorId === id) {
       const remainingIds = Object.keys(competitors).filter(k => k !== id);
       if (remainingIds.length > 0) {
         setSelectedCompetitorId(remainingIds[0]);
       }
    }
  };

  return (
    <div className="min-h-screen bg-white flex text-[#405063] font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-[260px] bg-[#F8F9FA] border-r border-[#DAE0E7] flex-col fixed h-full z-10">
        <div className="p-4 pt-6">
          {/* Logo Area with Edit Capability */}
          <div 
            className="flex items-center gap-3 text-[#0C3146] font-bold text-lg mb-6 px-2 cursor-pointer group relative rounded-lg hover:bg-[#EEF9FF] p-2 transition-colors -mx-2"
            onClick={() => setIsManageModalOpen(true)}
            title="Click to customize logo"
          >
            <div className="relative">
              {customLogo ? (
                <img 
                  src={customLogo} 
                  alt="Brand Logo" 
                  className="w-8 h-8 object-contain rounded"
                />
              ) : (
                <SwatIoLogo className="w-8 h-8 flex-shrink-0" />
              )}
              {/* Edit Overlay */}
              <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Edit2 size={12} className="text-white" />
              </div>
            </div>
            <span>Swat.io Outmatch</span>
          </div>
          
          <div className="mb-6 px-2">
             <div className="text-xs font-semibold text-[#61768E] uppercase mb-2 ml-1">Analysis Target</div>
             <div className="relative">
                <select 
                  value={selectedCompetitorId}
                  onChange={(e) => setSelectedCompetitorId(e.target.value as CompetitorId)}
                  className="w-full appearance-none bg-white border border-[#DAE0E7] hover:border-[#2B9CDA] text-[#0C3146] text-sm rounded-md shadow-sm focus:ring-1 focus:ring-[#2B9CDA] focus:border-[#2B9CDA] block py-2 pl-3 pr-8 font-medium transition-colors cursor-pointer outline-none"
                >
                  {Object.values(competitors).map((comp: AnalysisData) => (
                    <option key={comp.id} value={comp.id}>vs. {comp.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#61768E]">
                  <ChevronDown size={14} />
                </div>
              </div>
          </div>

          <nav className="space-y-0.5">
            {(Object.values(SectionType) as SectionType[]).map((type) => (
              <SidebarItem 
                key={type} 
                type={type} 
                isActive={activeSection === type}
                onClick={() => {
                  setActiveSection(type);
                  setIsMobileMenuOpen(false);
                }}
              />
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-[#DAE0E7]">
            <div className="flex items-center justify-center p-2 rounded-lg bg-[#E9DFF6]/50 border border-[#BD9FE5]/30">
               <span className="text-xs font-medium text-[#552790]">Internal Use Only</span>
            </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white border-b border-[#DAE0E7] z-20 px-4 py-3 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-2">
           <div className="flex items-center gap-2 text-[#0C3146] font-bold">
              {customLogo ? (
                <img 
                  src={customLogo} 
                  alt="Brand Logo" 
                  className="w-6 h-6 object-contain rounded"
                />
              ) : (
                <SwatIoLogo className="w-6 h-6 flex-shrink-0" />
              )}
              <span className="hidden sm:inline">Swat.io Outmatch</span>
            </div>
            <div className="ml-4">
               <select 
                value={selectedCompetitorId}
                onChange={(e) => setSelectedCompetitorId(e.target.value as CompetitorId)}
                className="bg-[#F8F9FA] border border-[#DAE0E7] text-[#0C3146] text-sm rounded-md focus:ring-[#2B9CDA] focus:border-[#2B9CDA] block p-1.5 font-medium max-w-[120px]"
              >
                {Object.values(competitors).map((comp: AnalysisData) => (
                  <option key={comp.id} value={comp.id}>{comp.name}</option>
                ))}
              </select>
            </div>
         </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-[#F8F9FA] rounded hover:bg-[#DAE0E7]">
            <Menu size={20} />
          </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-30 pt-16 px-4">
           {(Object.values(SectionType) as SectionType[]).map((type) => (
            <SidebarItem 
              key={type} 
              type={type}
              isActive={activeSection === type}
              onClick={() => {
                setActiveSection(type);
                setIsMobileMenuOpen(false);
              }}
            />
          ))}
           <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-[#2B9CDA] text-white py-2 rounded-lg font-bold"
              >
                <Plus size={16} /> Add
              </button>
              <button 
                onClick={() => setIsManageModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold"
              >
                <Settings2 size={16} /> Manage
              </button>
           </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px] p-8 max-w-[1600px] w-full">
        
        {/* Header Section */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-500" key={currentData?.id + '_header'}>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-[#0C3146] tracking-tight">{currentData?.title}</h1>
            
            {isAutoRefreshing && (
               <span className="flex items-center gap-1 text-xs text-[#FF810A] bg-[#FFDFC2]/50 px-2 py-1 rounded-full animate-pulse">
                  <Clock size={12} /> Auto-refreshing...
               </span>
            )}
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 text-xs text-[#61768E] bg-[#F8F9FA] px-3 py-1.5 rounded-md border border-[#DAE0E7]">
               <Clock size={14} />
               <span>Updated: {currentData?.lastUpdated ? new Date(currentData.lastUpdated).toLocaleDateString() : 'Unknown'}</span>
            </div>

            <div className="h-6 w-px bg-[#DAE0E7] hidden md:block"></div>
            
            {/* Export Dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center gap-1.5 bg-white border border-[#DAE0E7] hover:bg-[#F3F5F7] text-[#405063] px-3 py-1.5 rounded-md font-medium text-sm transition-colors shadow-sm"
              >
                <Download size={16} />
                <span>Export</span>
                <ChevronDown size={14} />
              </button>
              
              {isExportOpen && currentData && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#DAE0E7] z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-1">
                    <button 
                      onClick={() => { exportToPDF(currentData); setIsExportOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-[#0C3146] hover:bg-[#EEF9FF] rounded-md flex items-center gap-2"
                    >
                      <FileText size={16} className="text-[#E71D36]" /> PDF Report
                    </button>
                    <button 
                      onClick={() => { exportToDocs(currentData); setIsExportOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-[#0C3146] hover:bg-[#EEF9FF] rounded-md flex items-center gap-2"
                    >
                      <File size={16} className="text-[#2B9CDA]" /> Google Doc / Word
                    </button>
                    <button 
                      onClick={() => { exportToCSV(currentData); setIsExportOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-[#0C3146] hover:bg-[#EEF9FF] rounded-md flex items-center gap-2"
                    >
                      <FileSpreadsheet size={16} className="text-[#17AA5A]" /> CSV Data
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#2B9CDA] hover:bg-[#18638B] text-white px-3 py-1.5 rounded-md font-medium text-sm transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>Add Competitor</span>
            </button>
            <button 
              onClick={() => setIsManageModalOpen(true)}
              className="p-1.5 text-[#61768E] hover:bg-[#F3F5F7] rounded-md transition-colors"
            >
              <Settings2 size={20} />
            </button>
          </div>
        </header>

        {/* Content Renderers */}
        {currentData && (
          <div className="space-y-8 animate-in fade-in duration-500 pb-20" key={currentData.id + '_content'}>

            {activeSection === SectionType.EXECUTIVE_SUMMARY && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-[#DAE0E7] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  <h3 className="text-base font-bold mb-3 text-[#0C3146]">The Verdict: Swat.io vs {currentData.name}</h3>
                  <p className="text-[#405063] leading-relaxed text-base border-l-4 border-[#2B9CDA] pl-4">
                    {currentData.summary.verdict}
                    <br /><br />
                    <span className="font-semibold text-[#0C3146]">Pricing Reality:</span> Starts at {currentData.pricing.entry}. {currentData.pricing.cons.slice(0, 2).join(". ")}.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#F8F9FA] p-6 rounded-lg border border-[#F9C8CE] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#E71D36]"></div>
                    <div className="flex items-center gap-2 mb-4 text-[#94101F] font-bold uppercase tracking-wide text-xs">
                      <XCircle size={16} /> {currentData.name} Weaknesses
                    </div>
                    <ul className="space-y-3">
                      {currentData.summary.painPoints.map((point, i) => (
                        <li key={i} className="flex gap-2 text-[#0C3146] text-sm">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-[#E71D36] rounded-full flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                      {currentData.featureComparison.filter(f => f.reality && f.reality.length > 5).slice(0, 2).map((f, i) => (
                        <li key={`feature-gap-${i}`} className="flex gap-2 text-[#0C3146] text-sm">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-[#E71D36] rounded-full flex-shrink-0" />
                          <span className="font-semibold">{f.category}:</span> {f.reality}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-[#F8F9FA] p-6 rounded-lg border border-[#CEF3DF] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#17AA5A]"></div>
                    <div className="flex items-center gap-2 mb-4 text-[#063F21] font-bold uppercase tracking-wide text-xs">
                      <CheckCircle2 size={16} /> Swat.io Advantages
                    </div>
                    <ul className="space-y-3">
                      {currentData.summary.advantages.map((point, i) => (
                        <li key={i} className="flex gap-2 text-[#0C3146] text-sm">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-[#17AA5A] rounded-full flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === SectionType.FEATURE_CHECK && (
              <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#DAE0E7] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8F9FA] border-b border-[#DAE0E7]">
                        <th className="p-4 font-semibold text-[#61768E] text-xs uppercase tracking-wider w-1/4">Category</th>
                        <th className="p-4 font-semibold text-[#61768E] text-xs uppercase tracking-wider w-1/4">{currentData.name} Promise</th>
                        <th className="p-4 font-semibold text-[#61768E] text-xs uppercase tracking-wider w-1/4">Reality / Critique</th>
                        <th className="p-4 font-semibold text-[#18638B] text-xs uppercase tracking-wider w-1/4 bg-[#EEF9FF]">Swat.io Advantage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DAE0E7]">
                      {currentData.featureComparison.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#F8F9FA] transition-colors group">
                          <td className="p-4 font-medium text-[#0C3146] text-sm">{row.category}</td>
                          <td className="p-4 text-[#405063] text-sm">{row.hootsuite}</td>
                          <td className="p-4 text-[#405063] text-sm">{row.reality}</td>
                          <td className="p-4 text-[#0C3146] font-medium bg-[#EEF9FF]/30 text-sm border-l border-[#DAE0E7] group-hover:bg-[#EEF9FF]/80 transition-colors">{row.swatio_advantage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeSection === SectionType.MOMENTUM && currentData.momentum && (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-lg border border-[#DAE0E7] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="p-2.5 bg-[#F3F5F7] rounded-lg text-[#864FCF]">
                       <TrendingUp size={24} />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-[#0C3146]">Market Momentum</h3>
                        <p className="text-sm text-[#61768E]">Current status and strategic direction</p>
                     </div>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xs font-bold text-[#61768E] uppercase tracking-wider mb-2">Market Position</h4>
                        <p className="text-base font-medium text-[#0C3146]">{currentData.momentum.market_position}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#61768E] uppercase tracking-wider mb-2">Recent Updates</h4>
                        <p className="text-base text-[#405063]">{currentData.momentum.recent_updates}</p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeSection === SectionType.PLATFORM_COVERAGE && currentData.platform_coverage && (
               <div className="grid md:grid-cols-3 gap-6">
                 <div className="md:col-span-2 bg-white p-6 rounded-lg border border-[#DAE0E7] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <h3 className="text-base font-bold text-[#0C3146] mb-4 flex items-center gap-2">
                      <Globe size={18} className="text-[#61768E]"/> Platform Strategy
                    </h3>
                    <p className="text-[#405063] mb-6 text-sm leading-relaxed">{currentData.platform_coverage.summary}</p>
                 </div>
                 <div className="bg-[#F8F9FA] p-6 rounded-lg border border-[#DAE0E7]">
                   <h4 className="text-xs font-bold text-[#61768E] uppercase tracking-wider mb-4">Strongest Networks</h4>
                   <div className="flex flex-wrap gap-2">
                     {currentData.platform_coverage.strengths.map((s, i) => (
                       <span key={i} className="px-3 py-1 bg-white border border-[#DAE0E7] rounded text-sm font-medium text-[#405063] shadow-sm">
                         {s}
                       </span>
                     ))}
                   </div>
                 </div>
               </div>
            )}
            
            {activeSection === SectionType.RED_FLAGS && currentData.red_flags && (
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="bg-[#F8F9FA] p-6 rounded-lg border border-[#F9C8CE] shadow-sm">
                    <h3 className="text-base font-bold text-[#94101F] mb-4 flex items-center gap-2">
                       <AlertTriangle size={20} /> Warning Signs
                    </h3>
                    <ul className="space-y-4">
                      {currentData.red_flags.warnings.map((w, i) => (
                        <li key={i} className="flex gap-3 text-[#0C3146] bg-white p-3 rounded border border-[#F17E8B]/20 shadow-sm">
                          <XCircle className="shrink-0 mt-0.5 text-[#E71D36]" size={16} />
                          <span className="text-sm">{w}</span>
                        </li>
                      ))}
                    </ul>
                 </div>

                 <div className="bg-[#EEF9FF] p-6 rounded-lg border border-[#CBE7F6] shadow-sm">
                    <h3 className="text-base font-bold text-[#18638B] mb-4 flex items-center gap-2">
                       <Trophy size={20} /> Ideal Win Scenario
                    </h3>
                     <ul className="space-y-4">
                      {currentData.red_flags.win_signals.map((w, i) => (
                        <li key={i} className="flex gap-3 text-[#0C3146] bg-white p-3 rounded border border-[#86C7EA]/20 shadow-sm">
                          <CheckCircle2 className="shrink-0 mt-0.5 text-[#2B9CDA]" size={16} />
                          <span className="text-sm">{w}</span>
                        </li>
                      ))}
                    </ul>
                 </div>
              </div>
            )}

            {activeSection === SectionType.PRICING && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-lg border border-[#DAE0E7] shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col items-center text-center">
                  <div className="p-4 bg-[#F8F9FA] rounded-full mb-4">
                    <Scale size={32} className="text-[#61768E]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[#0C3146]">{currentData.name} Pricing</h3>
                  <p className="text-3xl font-bold text-[#2B9CDA] mb-4">{currentData.pricing.entry}</p>
                  <p className="text-[#61768E] text-sm bg-[#F3F5F7] px-3 py-1 rounded-full">Check pricing page for details</p>
                </div>

                <div className="bg-white p-8 rounded-lg border border-[#DAE0E7] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-[#A34F00]">
                    <ShieldAlert className="text-[#FF810A]" size={20} /> Hidden Costs & Limits
                  </h3>
                  <ul className="space-y-3">
                    {currentData.pricing.cons.map((con, i) => (
                      <li key={i} className="flex gap-3 items-start p-3 bg-[#FFDFC2]/20 rounded border border-[#FFDFC2]/50">
                        <XCircle size={16} className="text-[#FF810A] mt-0.5 shrink-0" />
                        <span className="text-[#522900] text-sm">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeSection === SectionType.REVIEWS && (
              <div className="space-y-8">
                {/* Review Analysis Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Competitor Consensus */}
                  <div className="bg-white p-6 rounded-lg border border-[#DAE0E7] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-3 mb-4 text-[#0C3146]">
                      <div className="p-2 bg-[#F3F5F7] rounded-lg">
                         <MessageSquare size={18} className="text-[#61768E]" />
                      </div>
                      <h3 className="font-bold text-base">Market Consensus</h3>
                    </div>
                    <p className="text-[#405063] leading-relaxed text-sm">
                      {currentData.reviewAnalysis ? currentData.reviewAnalysis.competitor_consensus : "Loading review analysis..."}
                    </p>
                  </div>

                  {/* Swat.io Head-to-Head */}
                  <div className="bg-[#0C3146] p-6 rounded-lg shadow-md text-white border-l-4 border-[#2B9CDA]">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                         <Trophy size={18} className="text-[#2B9CDA]" />
                       </div>
                       <h3 className="font-bold text-base">Head-to-Head vs. Swat.io</h3>
                    </div>
                    <p className="text-[#EEF9FF] leading-relaxed text-sm">
                      {currentData.reviewAnalysis ? currentData.reviewAnalysis.swatio_comparison : "Analyzing Swat.io advantages..."}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-[#DAE0E7] shadow-[0_1px_2px_rgba(0,0,0,0.05)] mb-6">
                   <h3 className="font-bold text-base text-[#0C3146] mb-4">Reviews Distribution</h3>
                   <ReviewChart data={currentData.reviews} />
                </div>

                {/* Critical Reviews Section */}
                <div>
                   <h3 className="text-lg font-bold text-[#0C3146] mb-4 flex items-center gap-2">
                     <Quote className="text-[#FF810A] rotate-180" size={20} /> Voice of the Frustrated Customer
                   </h3>
                   <p className="text-[#61768E] mb-6 text-sm">Real 1-star (and occasionally 2-3 star) reviews and common complaints.</p>
                   
                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {currentData.criticalReviews && currentData.criticalReviews.map((review, i) => (
                       <div key={i} className="bg-white p-6 rounded-lg border border-[#F17E8B]/30 shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-[#F9C8CE]/30 rounded-bl-full -mr-8 -mt-8 group-hover:bg-[#F9C8CE] transition-colors"></div>
                         <div className="flex justify-between items-start mb-4 relative z-10">
                           <div className="flex gap-1">
                              {Array.from({ length: review.rating || 1 }).map((_, i) => (
                                <Star key={i} size={14} className="fill-[#E71D36] text-[#E71D36]" />
                              ))}
                           </div>
                           <span className="text-xs font-semibold text-[#61768E] uppercase tracking-wide">{review.source}</span>
                         </div>
                         <h4 className="font-bold text-[#0C3146] mb-2 relative z-10 line-clamp-1 text-sm">{review.title}</h4>
                         <p className="text-[#405063] text-sm leading-relaxed italic relative z-10 mb-4 flex-grow">"{review.comment}"</p>
                         <div className="flex items-center gap-2 text-[#61768E] text-xs mt-auto">
                            <Calendar size={12} />
                            <span>{review.date || 'Recent'}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            )}

            {activeSection === SectionType.SALES_ARGUMENTS && (
              <div className="space-y-6">
                <div className="bg-[#0C3146] text-white p-6 rounded-lg shadow-lg mb-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#2B9CDA]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                  <h2 className="text-xl font-bold mb-2 relative z-10">Kill Shots vs {currentData.name}</h2>
                  <p className="opacity-80 text-[#CBE7F6] text-sm relative z-10">Use these arguments when the prospect is on the fence.</p>
                </div>
                
                <div className="grid gap-6">
                  {currentData.killShots.map((shot, i) => (
                    <div key={i} className="bg-white rounded-lg border border-[#DAE0E7] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-6 relative">
                      <div className="absolute top-4 right-4">
                         <span className="bg-[#EEF9FF] text-[#18638B] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Kill Shot #{i+1}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0C3146] mb-4 pr-20">{shot.title}</h3>
                      <p className="text-lg font-medium text-[#405063] mb-6 italic leading-relaxed">"{shot.statement}"</p>
                      <div className="bg-[#F8F9FA] p-4 rounded border border-[#DAE0E7]">
                        <p className="text-[10px] font-bold text-[#61768E] uppercase tracking-wider mb-2">Sales Talk Track</p>
                        <p className="text-[#0C3146] text-sm">"{shot.talkTrack}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      <AIChatOverlay 
        competitorName={currentData?.name || 'Unknown'} 
        contextData={currentData?.aiContext || 'No context available.'} 
      />
      
      <AddCompetitorModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCompetitor}
      />

      <ManageCompetitorsModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        competitors={competitors}
        onRefresh={handleRefreshCompetitor}
        onRefreshAll={handleRefreshAll}
        onDelete={handleDeleteCompetitor}
        currentLogo={customLogo}
        onLogoUpdate={handleLogoUpdate}
      />
    </div>
  );
};

export default App;