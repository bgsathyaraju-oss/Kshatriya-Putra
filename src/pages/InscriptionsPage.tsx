import React, { useState, useEffect } from 'react';
import { InscriptionRecord } from '../types';
import { Scroll, Search, ShieldCheck, MapPin, Calendar, BookOpen, Quote, ChevronRight } from 'lucide-react';
import { EvidenceBadge } from '../components/EvidenceBadge';

export const InscriptionsPage: React.FC = () => {
  const [inscriptions, setInscriptions] = useState<InscriptionRecord[]>([]);
  const [selectedInsc, setSelectedInsc] = useState<InscriptionRecord | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/inscriptions')
      .then(r => r.json())
      .then(d => {
        setInscriptions(d.inscriptions || []);
        if (d.inscriptions && d.inscriptions.length > 0) {
          setSelectedInsc(d.inscriptions[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = inscriptions.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.ruler.toLowerCase().includes(search.toLowerCase()) ||
    i.location_found.toLowerCase().includes(search.toLowerCase()) ||
    i.era_or_date.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-800 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#d4af37] font-royal-heading">
          <Scroll className="w-4 h-4" />
          <span>Epigraphic Corpus & Primary Sources</span>
        </div>
        <h1 className="font-royal-heading font-extrabold text-2xl sm:text-4xl text-[#fcedc7]">
          Inscriptions & Archaeological Records
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 max-w-3xl leading-relaxed">
          The bedrock of historical verification. Browse verified stone inscriptions and copper-plate charters with transcription excerpts, scholarly translations, and Epigraphia Indica volume references.
        </p>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-[#121622] border border-stone-800 flex items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ruler, findspot, or charter name..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#182030] text-stone-200 border border-stone-700 focus:outline-none focus:border-[#c99738]"
          />
        </div>
        <div className="text-xs text-stone-400 hidden sm:block">
          Showing <strong>{filtered.length}</strong> reviewed epigraphic records
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inscription Cards */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.map(insc => {
            const isSelected = selectedInsc?.id === insc.id;
            return (
              <div
                key={insc.id}
                onClick={() => setSelectedInsc(insc)}
                className={`p-5 rounded-2xl cursor-pointer border transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#580014]/40 border-[#d4af37] shadow-[0_0_20px_rgba(201,151,56,0.18)]'
                    : 'bg-[#121622] border-stone-800/80 hover:border-stone-700 hover:bg-[#181f2f]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">
                    {insc.dynasty}
                  </span>
                  <EvidenceBadge status={insc.verification_status} size="sm" />
                </div>

                <h3 className="font-royal-heading font-bold text-sm sm:text-base text-stone-100 leading-snug">
                  {insc.name}
                </h3>

                <div className="text-xs text-stone-400 mt-2 space-y-1">
                  <p><strong className="text-stone-300">Ruler:</strong> {insc.ruler}</p>
                  <p><strong className="text-stone-300">Findspot:</strong> {insc.location_found}</p>
                  <p><strong className="text-stone-300">Era:</strong> {insc.era_or_date}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Full Transcription & Translation Dossier */}
        <div className="lg:col-span-7">
          {selectedInsc ? (
            <div className="rounded-3xl bg-[#111520] border border-[#c99738]/40 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                    {selectedInsc.era_or_date}
                  </span>
                  <h2 className="font-royal-heading font-extrabold text-xl sm:text-2xl text-[#fcedc7] mt-1">
                    {selectedInsc.name}
                  </h2>
                </div>
                <EvidenceBadge status={selectedInsc.verification_status} size="md" />
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#161c2a] p-4 rounded-xl border border-stone-800">
                <div>
                  <span className="text-stone-500 block">Ruler / Authority:</span>
                  <strong className="text-stone-200">{selectedInsc.ruler}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Script & Paleography:</span>
                  <strong className="text-stone-200">{selectedInsc.script}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Language:</span>
                  <strong className="text-stone-200">{selectedInsc.language}</strong>
                </div>
              </div>

              {/* Historical Context */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] font-royal-heading">
                  Historical Context & Archaeological Discovery
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed bg-[#0c0f17] p-4 rounded-xl border border-stone-800">
                  {selectedInsc.historical_context}
                </p>
              </div>

              {/* Original Epigraphic Transcription */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] font-royal-heading flex items-center gap-1.5">
                  <Quote className="w-4 h-4 text-[#d4af37]" />
                  <span>Original Epigraphic Text Excerpt</span>
                </h4>
                <div className="p-4 rounded-xl bg-[#171113] border border-[#c99738]/30 text-xs sm:text-sm font-mono text-[#fce8bb] leading-relaxed">
                  {selectedInsc.transcription_excerpt}
                </div>
              </div>

              {/* Verified English Translation */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] font-royal-heading">
                  Scholarly Translation
                </h4>
                <div className="p-4 rounded-xl bg-[#141b2b] border border-stone-800 text-xs sm:text-sm font-royal-serif text-stone-200 leading-relaxed italic">
                  "{selectedInsc.english_translation}"
                </div>
              </div>

              {/* Scholarly References */}
              <div className="space-y-2 pt-4 border-t border-stone-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] font-royal-heading">
                  Published Scholarly Compendiums & Epigraphia Indica Citations
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-400">
                  {selectedInsc.scholarly_references.map((ref, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                      <span>{ref}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-400 bg-[#121622] rounded-3xl border border-stone-800">
              Select an inscription to view transcriptions and translations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
