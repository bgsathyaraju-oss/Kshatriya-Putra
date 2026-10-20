import React, { useState, useEffect } from 'react';
import { HistoricalEvent } from '../types';
import { Calendar, Scroll, BookOpen, AlertCircle } from 'lucide-react';
import { TimelineViewer } from '../components/TimelineViewer';

export const HistoricalTimelinePage: React.FC = () => {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/timeline')
      .then(r => r.json())
      .then(d => setEvents(d.events || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-800 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#d4af37] font-royal-heading">
          <Calendar className="w-4 h-4" />
          <span>Chronological Master Record</span>
        </div>
        <h1 className="font-royal-heading font-extrabold text-2xl sm:text-4xl text-[#fcedc7]">
          Comprehensive Historical Timeline
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 max-w-3xl leading-relaxed">
          Chronological milestone timeline spanning the rise, southern military campaigns, administrative golden age, and regional adaptations of the Suryavamshi rulers from 1434 CE forward.
        </p>
      </div>

      <TimelineViewer events={events} />
    </div>
  );
};
