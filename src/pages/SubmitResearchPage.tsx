import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Upload, Scroll, ShieldCheck, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

interface SubmitResearchProps {
  onNavigate: (path: string) => void;
}

export const SubmitResearchPage: React.FC<SubmitResearchProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    submission_type: 'article',
    title: '',
    description: '',
    content_data: '',
    source_citations: '',
    copyright_agreed: false
  });

  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <p className="text-stone-300">You must be logged in as a registered member to submit archival materials or research.</p>
        <button
          onClick={() => onNavigate('/login')}
          className="px-6 py-2.5 rounded-xl font-semibold text-xs bg-[#c99738] text-[#300207]"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setErrorMsg(null);

    if (!formData.title || !formData.description || !formData.content_data || !formData.source_citations) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!formData.copyright_agreed) {
      setErrorMsg('You must declare that you hold the necessary rights or permission to share this material.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/community/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setSubmitting(false);

      if (res.ok) {
        setStatusMsg('Your material has been submitted to the Editorial Board for peer review and provenance verification.');
        setFormData({
          submission_type: 'article',
          title: '',
          description: '',
          content_data: '',
          source_citations: '',
          copyright_agreed: false
        });
      } else {
        setErrorMsg(data.error || 'Submission failed.');
      }
    } catch {
      setSubmitting(false);
      setErrorMsg('Network error submitting research.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-stone-800 pb-4 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#d4af37] font-royal-heading">
          <Upload className="w-4 h-4" />
          <span>Archival Contribution Workflow</span>
        </div>
        <h1 className="font-royal-heading font-extrabold text-2xl sm:text-4xl text-[#fcedc7]">
          Submit Historical Research, Manuscripts & Photographs
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
          All submitted materials enter the Editorial Board's review queue. Material is vetted against known epigraphs before publication and is never automatically accepted as historical fact.
        </p>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs sm:text-sm text-emerald-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-xs sm:text-sm text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-[#121622] border border-[#c99738]/40 space-y-5 shadow-2xl">
        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1">
            Category of Submitted Material <span className="text-rose-400">*</span>
          </label>
          <select
            name="submission_type"
            value={formData.submission_type}
            onChange={handleChange}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#182030] text-stone-100 border border-stone-700"
          >
            <option value="article">Historical Research Article</option>
            <option value="genealogy">Family Genealogy / Vamsavali Record</option>
            <option value="old_photo">Archival Photograph / Seal</option>
            <option value="inscription">Stone Inscription / Copper-Plate Transcription</option>
            <option value="manuscript">Palm-Leaf Manuscript Folio</option>
            <option value="oral_history">Oral History / Regional Community Account</option>
            <option value="reference">Scholarly Book Reference / Citation</option>
            <option value="correction">Proposed Correction to Published Record</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1">
            Title of the Material / Document <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Copper Plate Grant Found at Draksharama Outpost"
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#182030] text-stone-100 border border-stone-700"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1">
            Summary & Context <span className="text-rose-400">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Describe the historical context, where it was discovered or preserved, and its significance..."
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#182030] text-stone-100 border border-stone-700"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1">
            Detailed Content / Transcription / Document Text <span className="text-rose-400">*</span>
          </label>
          <textarea
            name="content_data"
            value={formData.content_data}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Provide full text, transcription, lineage tree details, or image hosting links..."
            className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#182030] text-stone-100 border border-stone-700"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1">
            Sources, Provenance & Custody <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            name="source_citations"
            value={formData.source_citations}
            onChange={handleChange}
            required
            placeholder="e.g. Ancestral family trust custody in Ballari; references Mackenzie MSS Vol. 14"
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#182030] text-stone-100 border border-stone-700"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="copyright_agreed"
              checked={formData.copyright_agreed}
              onChange={handleChange}
              required
              className="mt-1 w-4 h-4 text-[#c99738] rounded border-stone-700"
            />
            <span className="text-xs text-stone-300 leading-relaxed">
              I affirm that I am the legal owner or authorized custodian of this material, or that it is in the public domain. I grant this project permission to index, review, and preserve this record for open educational and historical research.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-[#997022] to-[#c99738] text-[#290106] hover:from-[#b38328] hover:to-[#dfab43] shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {submitting ? 'Submitting to Review Queue...' : 'Submit Material for Peer Review'}
        </button>
      </form>
    </div>
  );
};
