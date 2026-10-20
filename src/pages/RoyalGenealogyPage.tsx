import React, { useState, useEffect } from 'react';
import { GenealogyNode, HistoricalClaim } from '../types';
import { Crown, ShieldCheck, Scroll, Info, AlertTriangle, BookOpen } from 'lucide-react';
import { GenealogyTree } from '../components/GenealogyTree';
import { ClaimCard } from '../components/ClaimCard';

interface RoyalGenealogyPageProps {
  onNavigate: (path: string) => void;
}

export const RoyalGenealogyPage: React.FC<RoyalGenealogyPageProps> = ({ onNavigate }) => {
  const [nodes, setNodes] = useState<GenealogyNode[]>([]);
  const [claims, setClaims] = useState<HistoricalClaim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/content/genealogy').then(r => r.json()),
      fetch('/api/content/claims').then(r => r.json())
    ]).then(([genData, claimsData]) => {
      setNodes(genData.genealogy || []);
      setClaims(claimsData.claims || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="border-b border-stone-800 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#580014] text-[#fcedc7] text-xs font-semibold border border-[#d4af37]/40">
          <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Epigraphic Genealogies vs Traditional Lineages</span>
        </div>
        <h1 className="font-royal-heading font-extrabold text-2xl sm:text-4xl text-[#fcedc7]">
          Royal Genealogy of Suryavamsha Odiyaraju Kshatriya
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 max-w-3xl leading-relaxed">
          Visual family-tree distinguishing verified epigraphically corroborated royal parentage from living community vamsavalis and oral memory. In accordance with professional standards, we do not present conjectural lineages as proven biological facts.
        </p>
      </div>

      {/* Interactive Genealogy Tree */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-royal-heading font-bold text-lg sm:text-xl text-[#fcedc7]">
            Interactive Dynastic Lineage Chart
          </h2>
          <span className="text-xs text-stone-400">
            Click any royal node for inscriptions & citations
          </span>
        </div>

        <GenealogyTree nodes={nodes} />
      </div>

      {/* Historiographical Claims & Evidence Balance Section */}
      <div className="space-y-6 pt-6 border-t border-stone-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#d4af37] font-royal-heading">
            <Scroll className="w-4 h-4" />
            <span>Historiographical Evidence Review</span>
          </div>
          <h2 className="font-royal-heading font-bold text-xl sm:text-2xl text-[#fcedc7]">
            Evaluation of Key Dynastic Claims & Traditions
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-3xl">
            Neutral evaluation of significant dynastic traditions, supporting copper-plate inscriptions, and modern historical consensus.
          </p>
        </div>

        <div className="space-y-4">
          {claims.map(claim => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      </div>
    </div>
  );
};
