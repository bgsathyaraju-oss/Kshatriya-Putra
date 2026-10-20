import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { BookOpen, Search, Filter, ShieldCheck, Calendar, User, ArrowRight } from 'lucide-react';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { useLanguage } from '../context/LanguageContext';

interface ResearchArticlesPageProps {
  onNavigate: (path: string) => void;
}

export const ResearchArticlesPage: React.FC<ResearchArticlesPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/content/articles?lang=${language}`)
      .then(r => r.json())
      .then(d => setArticles(d.articles || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [language]);

  const filtered = articles.filter(a =>
    a.original_title.toLowerCase().includes(search.toLowerCase()) ||
    a.summary.toLowerCase().includes(search.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-800 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#d4af37] font-royal-heading">
          <BookOpen className="w-4 h-4" />
          <span>Peer-Reviewed Academic Historiography</span>
        </div>
        <h1 className="font-royal-heading font-extrabold text-2xl sm:text-4xl text-[#fcedc7]">
          Research Articles & Historiographical Studies
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 max-w-3xl leading-relaxed">
          Critical monographs examining the Suryavamsha Gajapathi era, epigraphic paleography, territorial borders of Odra Desha, and traditional genealogy methods.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#121622] border border-stone-800">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title or keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#182030] text-stone-200 border border-stone-700 focus:outline-none focus:border-[#c99738]"
          />
        </div>
        <div className="text-xs text-stone-400 hidden sm:block">
          Showing <strong>{filtered.length}</strong> published research articles
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(art => (
          <div
            key={art.id}
            onClick={() => onNavigate(`/documentary?article=${art.id}`)}
            className="rounded-3xl bg-[#121622] border border-stone-800 hover:border-[#c99738]/60 p-6 space-y-4 hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#d4af37]">
                  {art.category}
                </span>
                <EvidenceBadge category={art.evidence_category} size="sm" />
              </div>

              <h3 className="font-royal-heading font-bold text-base sm:text-lg text-stone-100 group-hover:text-[#e8c872] transition-colors leading-snug">
                {(art as any).display_title || art.original_title}
              </h3>

              <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed">
                {(art as any).display_summary || art.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-800/80 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1 text-stone-400">
                  <User className="w-3.5 h-3.5 text-[#d4af37]" />
                  {art.author_name}
                </span>
                <span>{art.publication_date}</span>
              </div>

              <div className="text-xs font-semibold text-[#e8c872] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Read Full Research Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
