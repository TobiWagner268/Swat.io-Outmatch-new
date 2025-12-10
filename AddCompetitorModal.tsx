import React, { useState } from 'react';
import { X, Loader2, Sparkles, Globe } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, url: string) => Promise<void>;
}

export const AddCompetitorModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      await onAdd(name, url);
      onClose();
      setName('');
      setUrl('');
    } catch (err) {
      console.error(err);
      setError('Failed to generate profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-[#DAE0E7] flex justify-between items-center bg-[#F8F9FA]">
          <h3 className="text-base font-bold text-[#0C3146] flex items-center gap-2">
            <Sparkles className="text-[#2B9CDA]" size={18} />
            Add AI Competitor
          </h3>
          <button onClick={onClose} className="text-[#61768E] hover:text-[#0C3146]">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-sm text-[#405063] leading-relaxed">
            Enter the name and website of a competitor. Our AI agents will research their pricing, features, and weaknesses to build a battle card for you instantly.
          </p>
          
          <div>
            <label className="block text-xs font-bold text-[#0C3146] mb-1.5 uppercase tracking-wide">
              Competitor Name <span className="text-[#E71D36]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Later, Sprinklr, Emplifi..."
              className="w-full px-3 py-2 border border-[#DAE0E7] rounded-md focus:ring-1 focus:ring-[#2B9CDA] focus:border-[#2B9CDA] outline-none transition-all text-[#0C3146] text-sm"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0C3146] mb-1.5 uppercase tracking-wide">
              Website URL <span className="text-[#E71D36]">*</span>
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full pl-9 pr-3 py-2 border border-[#DAE0E7] rounded-md focus:ring-1 focus:ring-[#2B9CDA] focus:border-[#2B9CDA] outline-none transition-all text-[#0C3146] text-sm"
              />
              <Globe className="absolute left-3 top-2.5 text-[#61768E]" size={16} />
            </div>
          </div>

          {error && <p className="text-sm text-[#E71D36]">{error}</p>}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-[#405063] bg-white border border-[#DAE0E7] hover:bg-[#F3F5F7] rounded-md font-medium transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim() || !url.trim()}
              className="flex-1 px-4 py-2 bg-[#2B9CDA] hover:bg-[#18638B] text-white rounded-md font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {loading ? 'Researching...' : 'Generate Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};