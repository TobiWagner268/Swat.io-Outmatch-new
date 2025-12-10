import React, { useState } from 'react';
import { X, Loader2, RefreshCw, Trash2, Globe, Settings2, CheckCircle2, Upload, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { AnalysisData } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  competitors: Record<string, AnalysisData>;
  onRefresh: (id: string, name: string, url: string) => Promise<void>;
  onRefreshAll: () => Promise<void>;
  onDelete: (id: string) => void;
  currentLogo: string | null;
  onLogoUpdate: (logoData: string | null) => void;
}

export const ManageCompetitorsModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  competitors, 
  onRefresh, 
  onRefreshAll,
  onDelete,
  currentLogo,
  onLogoUpdate
}) => {
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRefresh = async (id: string, name: string, url: string) => {
    setRefreshingId(id);
    try {
      await onRefresh(id, name, url);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshingId(null);
    }
  };

  const handleRefreshAll = async () => {
    setIsRefreshingAll(true);
    try {
      await onRefreshAll();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshingAll(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null);

    if (file) {
      // Validate Size (Max 1MB)
      if (file.size > 1024 * 1024) {
        setUploadError("File is too large. Max size is 1MB.");
        return;
      }

      // Validate Type
      if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
        setUploadError("Invalid file format. Please upload PNG, JPG, or SVG.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onLogoUpdate(base64String);
      };
      reader.onerror = () => {
        setUploadError("Failed to read file.");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-[#DAE0E7] flex justify-between items-center bg-[#F8F9FA]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2B9CDA] rounded-md text-white">
               <Settings2 size={20} />
            </div>
            <div>
               <h3 className="text-lg font-bold text-[#0C3146]">Manage App</h3>
               <p className="text-xs text-[#61768E]">Configure branding and competitor data.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#61768E] hover:text-[#0C3146] p-1 hover:bg-[#EEF9FF] rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
           
           {/* Branding Section */}
           <section>
              <h4 className="font-bold text-[#0C3146] text-sm mb-3 flex items-center gap-2">
                <ImageIcon size={16} className="text-[#2B9CDA]" />
                App Branding
              </h4>
              <div className="p-6 bg-[#EEF9FF] border border-[#CBE7F6] rounded-xl">
                 <div className="flex flex-col sm:flex-row gap-8 items-start">
                    {/* Preview */}
                    <div className="flex-shrink-0 text-center">
                       <label className="block text-xs font-bold text-[#18638B] uppercase mb-2">Current Logo</label>
                       <div className="w-24 h-24 bg-white rounded-xl shadow-sm flex items-center justify-center border border-[#CBE7F6] overflow-hidden mx-auto">
                          {currentLogo ? (
                            <img src={currentLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                          ) : (
                            <span className="text-xs text-[#61768E] text-center px-2">Default Logo</span>
                          )}
                       </div>
                       {currentLogo && (
                         <button 
                           onClick={() => onLogoUpdate(null)}
                           className="mt-3 text-xs text-[#E71D36] hover:bg-[#FFE5E8] px-2 py-1 rounded transition-colors flex items-center justify-center gap-1 mx-auto font-medium"
                         >
                           <Trash2 size={12} /> Reset to Default
                         </button>
                       )}
                    </div>

                    {/* Styled Upload Area */}
                    <div className="flex-1 w-full">
                       <label className="block text-xs font-bold text-[#18638B] uppercase mb-2">Upload Custom Logo</label>
                       
                       <div className="relative group">
                          <input 
                            type="file" 
                            accept=".png, .jpg, .jpeg, .svg" 
                            onChange={handleLogoUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            id="logo-upload"
                          />
                          <div className="border-2 border-dashed border-[#86C7EA] group-hover:border-[#2B9CDA] rounded-xl p-6 flex flex-col items-center justify-center bg-white transition-all group-hover:bg-[#F3F9FC]">
                            <div className="p-3 bg-[#EEF9FF] rounded-full mb-3 group-hover:scale-110 transition-transform text-[#2B9CDA]">
                              <Upload size={24} />
                            </div>
                            <span className="font-bold text-[#0C3146] text-sm mb-1 group-hover:text-[#2B9CDA]">Click to upload new logo</span>
                            <span className="text-xs text-[#61768E]">SVG, PNG, JPG (max 1MB)</span>
                          </div>
                       </div>
                       
                       <div className="mt-4 flex flex-col gap-1.5 bg-white/50 p-3 rounded-lg border border-[#DAE0E7]">
                          <p className="text-xs text-[#61768E] flex items-center gap-1.5">
                            <CheckCircle2 size={12} className="text-[#17AA5A]" /> 
                            <span>Recommended ratio: <strong>1:1 (Square)</strong></span>
                          </p>
                          <p className="text-xs text-[#61768E] flex items-center gap-1.5">
                             <CheckCircle2 size={12} className="text-[#17AA5A]" /> 
                             <span>Background: <strong>Transparent</strong> preferred</span>
                          </p>
                       </div>
                       
                       {uploadError && (
                         <div className="mt-3 p-3 bg-[#FFF5F5] border border-[#F17E8B] rounded-lg flex items-center gap-2 text-[#94101F] text-xs font-medium animate-in slide-in-from-top-2">
                           <AlertCircle size={14} className="shrink-0" />
                           {uploadError}
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </section>

           <div className="h-px bg-[#DAE0E7] w-full"></div>

           {/* Competitor Data Section */}
           <section>
              <h4 className="font-bold text-[#0C3146] text-sm mb-3 flex items-center gap-2">
                <RefreshCw size={16} className="text-[#2B9CDA]" />
                Competitor Data
              </h4>

              {/* Bulk Action */}
              <div className="mb-4 p-4 bg-[#F8F9FA] rounded-lg border border-[#DAE0E7] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#0C3146] text-sm">Bulk Update</h4>
                    <p className="text-xs text-[#61768E]">Refresh AI analysis for all {Object.keys(competitors).length} competitors.</p>
                  </div>
                  <button 
                    onClick={handleRefreshAll}
                    disabled={isRefreshingAll || refreshingId !== null}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#2B9CDA] hover:bg-[#18638B] text-white rounded-md font-bold shadow-sm transition-all disabled:opacity-50 text-xs"
                  >
                    {isRefreshingAll ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                    {isRefreshingAll ? 'Updating...' : 'Refresh All'}
                  </button>
              </div>

              {/* Competitor List */}
              <div className="space-y-3">
                  {Object.values(competitors).map((comp: AnalysisData) => (
                    <div key={comp.id} className="flex items-center justify-between p-4 border border-[#DAE0E7] rounded-lg hover:border-[#2B9CDA] transition-colors bg-white shadow-sm">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#F3F5F7] rounded-md flex items-center justify-center text-[#61768E] font-bold text-lg">
                            {comp.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#0C3146] text-sm">{comp.name}</h4>
                            <div className="flex items-center gap-1 text-xs text-[#61768E]">
                              <Globe size={12} />
                              <span className="truncate max-w-[200px]">{comp.url || 'No URL provided'}</span>
                            </div>
                          </div>
                      </div>

                      <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleRefresh(comp.id, comp.name, comp.url)}
                            disabled={refreshingId === comp.id || isRefreshingAll}
                            className="p-2 text-[#61768E] hover:text-[#2B9CDA] hover:bg-[#EEF9FF] rounded-md transition-colors disabled:opacity-30"
                            title="Refresh Analysis"
                          >
                            {refreshingId === comp.id ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                          </button>
                          <div className="w-px h-6 bg-[#DAE0E7] mx-1"></div>
                          <button 
                            onClick={() => onDelete(comp.id)}
                            disabled={Object.keys(competitors).length <= 1 || isRefreshingAll}
                            className="p-2 text-[#61768E] hover:text-[#E71D36] hover:bg-[#F9C8CE]/30 rounded-md transition-colors disabled:opacity-30"
                            title={Object.keys(competitors).length <= 1 ? "Cannot delete last competitor" : "Delete Competitor"}
                          >
                            <Trash2 size={18} />
                          </button>
                      </div>
                    </div>
                  ))}
              </div>
           </section>
        </div>

        <div className="p-4 bg-[#F8F9FA] border-t border-[#DAE0E7] flex justify-end">
           <button onClick={onClose} className="px-4 py-2 bg-white border border-[#DAE0E7] text-[#405063] font-medium rounded-md hover:bg-[#F3F5F7] shadow-sm transition-colors text-sm">
             Close
           </button>
        </div>
      </div>
    </div>
  );
};