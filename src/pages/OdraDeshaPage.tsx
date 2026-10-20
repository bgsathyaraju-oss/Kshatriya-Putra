import React from 'react';
import { Compass, MapPin, Landmark, BookOpen, Scroll, ShieldCheck, ArrowRight } from 'lucide-react';
import { EvidenceBadge } from '../components/EvidenceBadge';

interface OdraDeshaPageProps {
  onNavigate: (path: string) => void;
}

export const OdraDeshaPage: React.FC<OdraDeshaPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#170910] via-[#240e18] to-[#111624] border border-[#c99738]/50 p-8 sm:p-12 shadow-2xl">
        <div className="space-y-4 max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#580014] text-[#fcedc7] text-xs font-semibold border border-[#d4af37]/40">
            <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Historical Geography & Regional Nomenclature</span>
          </div>
          <h1 className="font-royal-heading font-extrabold text-3xl sm:text-5xl text-[#fcedc7] leading-tight">
            Odra Desha: The Ancient Heart of Eastern Indian Sovereignty
          </h1>
          <p className="text-sm sm:text-base text-stone-300 font-royal-serif leading-relaxed">
            From early classical accounts of the Oretes to the medieval Audra Vishaya, Odra Desha evolved from an agrarian river basin into the imperial nucleus of the Suryavamshi Gajapathi realm, centered at Varanasi Kataka.
          </p>
        </div>
      </div>

      {/* Nomenclature and Distinction of Historical Regions */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-royal-heading font-bold text-2xl sm:text-3xl text-[#fcedc7]">
            Demarcation of Ancient Eastern Regions
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mx-auto">
            Historiographical analysis distinguishes Odra from Kalinga, Utkala, and Trikalinga based on epigraphic boundary charters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-[#121622] border border-stone-800 space-y-3">
            <div className="p-2 w-fit rounded-lg bg-[#580014] text-[#d4af37]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-royal-heading font-bold text-base text-stone-100">
              Odra Desha (Audra)
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Encompassed the central riverine basin of the Mahanadi, Kathajodi, and Baitarani. Capital was Varanasi Kataka (modern Cuttack). Served as the administrative seat of the Suryavamshi Gajapathis.
            </p>
            <div className="pt-2 text-[11px] text-[#e8c872] font-semibold">
              Core Rulers: Suryavamsha Gajapathis
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121622] border border-stone-800 space-y-3">
            <div className="p-2 w-fit rounded-lg bg-stone-800 text-stone-300">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="font-royal-heading font-bold text-base text-stone-100">
              Utkala
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Stretched across the northern maritime plains towards the Subarnarekha and Kansai rivers, abutting ancient Gauda (Bengal). Famed for trade guilds, artistic schools, and maritime ports.
            </p>
            <div className="pt-2 text-[11px] text-[#e8c872] font-semibold">
              Core Centers: Jajpur, Balasore coastal strip
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121622] border border-stone-800 space-y-3">
            <div className="p-2 w-fit rounded-lg bg-stone-800 text-stone-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-royal-heading font-bold text-base text-stone-100">
              Kalinga
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Stretching from the Rishikulya River in Ganjam southwards across the Godavari to the Krishna. Famed in Ashokan edicts and classical Greco-Roman naval accounts.
            </p>
            <div className="pt-2 text-[11px] text-[#e8c872] font-semibold">
              Core Centers: Kalinganagara, Srikakulam, Simhachalam
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121622] border border-stone-800 space-y-3">
            <div className="p-2 w-fit rounded-lg bg-stone-800 text-stone-300">
              <Scroll className="w-5 h-5" />
            </div>
            <h3 className="font-royal-heading font-bold text-base text-stone-100">
              Trikalinga
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Highland zone and transitional mountain tracts connecting the Eastern Ghats, Kosala (Chhattisgarh basin), and the coastal Kalinga plain, often ruled by Somavamshi monarchs.
            </p>
            <div className="pt-2 text-[11px] text-[#e8c872] font-semibold">
              Core Centers: Kalahandi, Koraput, Sambalpur
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Historical Narrative */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111520] border border-[#c99738]/40 space-y-6">
        <h3 className="font-royal-heading font-bold text-xl text-[#fcedc7]">
          Epigraphic Evolution of the Odra Identity
        </h3>
        <div className="text-xs sm:text-sm text-stone-300 font-royal-serif leading-relaxed space-y-4">
          <p>
            The earliest historical attestations of the Odra people occur in classical Indian literature, including the Mahabharata, the Natyashastra of Bharata Muni (which distinguishes the Odra-Magadhi style of theatre and dance), and the Puranas. Pliny the Elder in his 1st-century CE <em>Naturalis Historia</em> identifies the <em>Oretes</em> inhabiting the country near Mount Maleus.
          </p>
          <p>
            In 639 CE, the celebrated Chinese Buddhist pilgrim Xuanzang (Hiuen Tsang) traversed the realm of <em>Wu-T’u</em> (Odra). He recorded that the climate was temperate, the people tall and intrepid with dark complexions, and noted the famous port city of Charitra (Che-li-ta-lo) on the southeastern shore, from which merchant vessels departed for Sinhala (Sri Lanka) and the South Seas.
          </p>
          <p>
            By the 15th century, during the reign of Kapilendra Deva Gajapathi, "Odra-Rajya" had transformed into the sovereign core of a subcontinent-wide empire. Kapilendra Deva’s copper-plate grants, such as the Veligalani charter (1458 CE), refer explicitly to the administration of Odra officers across the southern military forts of Kondavidu, Vinukonda, and Udayagiri.
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-800">
          <button
            onClick={() => onNavigate('/maps')}
            className="text-xs font-semibold text-[#e8c872] hover:text-white flex items-center gap-1.5"
          >
            <span>Explore Historical Maps of Odra Desha</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('/inscriptions')}
            className="text-xs font-semibold text-[#e8c872] hover:text-white flex items-center gap-1.5"
          >
            <span>View Odra Inscription Records</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
