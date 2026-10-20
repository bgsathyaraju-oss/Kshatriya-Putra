import React, { useState, useEffect } from 'react';
import { HistoricalLocation } from '../types';
import { Compass, MapPin, Landmark, ShieldCheck, Info, ExternalLink } from 'lucide-react';
import { EvidenceBadge } from '../components/EvidenceBadge';

interface HistoricalMapsPageProps {
  onNavigate: (path: string) => void;
}

export const HistoricalMapsPage: React.FC<HistoricalMapsPageProps> = ({ onNavigate }) => {
  const [locations, setLocations] = useState<HistoricalLocation[]>([]);
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [selectedLoc, setSelectedLoc] = useState<HistoricalLocation | null>(null);

  useEffect(() => {
    fetch('/api/content/locations')
      .then(res => res.json())
      .then(data => {
        setLocations(data.locations || []);
        if (data.locations && data.locations.length > 0) {
          setSelectedLoc(data.locations[0]);
        }
      })
      .catch(console.error);
  }, []);

  const regions = ['All', 'Odra', 'Utkala', 'Kalinga', 'Deccan & South'];

  const filteredLocations = locations.filter(loc =>
    activeRegion === 'All' || loc.region.toLowerCase() === activeRegion.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-800 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#d4af37] font-royal-heading">
          <Compass className="w-4 h-4" />
          <span>Historical Cartography & Archaeological Geography</span>
        </div>
        <h1 className="font-royal-heading font-extrabold text-2xl sm:text-4xl text-[#fcedc7]">
          Historical Maps, Fortresses & Territorial Corridors
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 max-w-3xl leading-relaxed">
          Cartographic reconstructions grounded in Epigraphia Indica findspots. All maps explicitly designate reconstructed frontiers versus verified military garrison inscriptions.
        </p>
      </div>

      {/* Cartographic Reconstruction Display */}
      <div className="rounded-3xl bg-[#121622] border border-[#c99738]/40 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              Corroborated Reconstruction (c. 1465 CE)
            </span>
            <h2 className="font-royal-heading font-bold text-xl sm:text-2xl text-[#fcedc7] mt-0.5">
              Territorial Extent of Suryavamsha Gajapathi Empire
            </h2>
          </div>
          <div className="p-2 px-3 rounded-lg bg-amber-950/40 border border-amber-900/60 text-xs text-amber-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Epigraphic boundary model; frontiers varied seasonally</span>
          </div>
        </div>

        <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-stone-900 border border-stone-800">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop&q=80"
            alt="Historical Cartography Map of Eastern India"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
            <h3 className="font-royal-heading font-bold text-lg text-white">
              Ganges to Kaveri Hegemony (Zenith under Kapilendra Deva)
            </h3>
            <p className="text-xs text-stone-300 max-w-2xl mt-1 leading-relaxed">
              Based on the findspots of the Veligalani plates, Srirangam donations, Kondavidu inscriptions, and Cuttack Barabati fortress ruins.
            </p>
          </div>
        </div>
      </div>

      {/* Region Filter and Archaeological Locations Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-royal-heading font-bold text-xl text-[#fcedc7]">
            Historical Capitals, Citadels & Sacred Kshetrams
          </h2>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {regions.map(r => (
              <button
                key={r}
                onClick={() => setActiveRegion(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeRegion === r
                    ? 'bg-[#c99738] text-[#300207] shadow-md'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map(loc => (
            <div
              key={loc.id}
              onClick={() => setSelectedLoc(loc)}
              className="rounded-2xl bg-[#121622] border border-stone-800 hover:border-[#c99738]/60 overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={loc.image_url}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#fcedc7] bg-[#580014]/90 px-2.5 py-1 rounded-full border border-[#d4af37]/40">
                    {loc.region}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] text-[#d4af37] font-semibold">
                    Ancient: {loc.ancient_name}
                  </div>
                  <h3 className="font-royal-heading font-bold text-base text-stone-100 group-hover:text-[#e8c872] transition-colors">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed line-clamp-3">
                    {loc.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800/80 text-[11px] text-stone-500 flex items-center justify-between">
                  <span>{loc.modern_district}, {loc.modern_state}</span>
                  <span className="text-[#e8c872] font-semibold">Explore Citations →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
