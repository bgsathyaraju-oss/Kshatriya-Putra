import React from 'react';
import { Users, Heart, MapPin, Compass, Shield, BookOpen, ArrowRight } from 'lucide-react';

interface CommunityHeritagePageProps {
  onNavigate: (path: string) => void;
}

export const CommunityHeritagePage: React.FC<CommunityHeritagePageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#240612] via-[#1c1322] to-[#0f1422] border border-[#c99738]/50 p-8 sm:p-12 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#580014] text-[#fcedc7] text-xs font-semibold border border-[#d4af37]/40">
            <Users className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Living Community Heritage</span>
          </div>
          <h1 className="font-royal-heading font-extrabold text-3xl sm:text-5xl text-[#fcedc7] leading-tight">
            Suryavamsha Odiyaraju Kshatriya Community Heritage
          </h1>
          <p className="text-sm sm:text-base text-stone-300 font-royal-serif leading-relaxed">
            Honoring the living memory, migration history, and shared fraternal identity of Suryavamsha Odiyaraju Kshatriya families across Odisha, Andhra Pradesh, Karnataka, Tamil Nadu, and the global diaspora.
          </p>
        </div>
      </div>

      {/* Migration Routes & Regional Settlements */}
      <div className="space-y-6">
        <h2 className="font-royal-heading font-bold text-2xl text-[#fcedc7]">
          Historical Military Settlements & Diaspora Corridors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#121622] border border-stone-800 space-y-3">
            <h3 className="font-royal-heading font-bold text-base text-stone-100">
              Coastal Andhra & Godavari Basin
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Descendants of military commanders and administrative officers stationed around Kondapalli, Rajahmundry, Draksharama, and Kondavidu during the 15th-century campaigns of Hamvira Deva.
            </p>
            <div className="pt-2 text-[11px] text-[#e8c872] font-semibold">
              Districts: Guntur, Krishna, Godavari, Palnadu
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#121622] border border-stone-800 space-y-3">
            <h3 className="font-royal-heading font-bold text-base text-stone-100">
              Karnataka & Deccan Bastions
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Settlements tracing back to garrison officers at Bellamkonda, Malebennur, Hospet, and southern Deccan outposts established under Prince Virabhadra Deva following the 1519 peace treaty.
            </p>
            <div className="pt-2 text-[11px] text-[#e8c872] font-semibold">
              Districts: Ballari, Davanagere, Bengaluru, Raichur
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#121622] border border-stone-800 space-y-3">
            <h3 className="font-royal-heading font-bold text-base text-stone-100">
              Tamil Country & Southern Corridor
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Family clusters remembering ancestral postings in Tiruvannamalai, Gingee, and the Kaveri River basin where Gajapathi armies held military dominance in the 1460s.
            </p>
            <div className="pt-2 text-[11px] text-[#e8c872] font-semibold">
              Districts: Tiruchirappalli, Thanjavur, Chennai
            </div>
          </div>
        </div>
      </div>

      {/* Community Directory and Registration CTA */}
      <div className="p-8 rounded-3xl bg-[#141824] border border-[#c99738]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-royal-heading font-bold text-xl text-[#fcedc7]">
            Connect with Members in the Community Directory
          </h3>
          <p className="text-xs text-stone-400">
            Browse verified profiles of community members with strict privacy protection.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/directory')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#c99738] text-[#300207] hover:bg-[#dfab43] transition-all cursor-pointer"
          >
            Explore Directory
          </button>
          <button
            onClick={() => onNavigate('/register')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#1a2130] text-stone-200 border border-stone-700 hover:border-[#c99738] transition-all cursor-pointer"
          >
            Join Community
          </button>
        </div>
      </div>
    </div>
  );
};
