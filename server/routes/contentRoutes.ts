import { Router, type Request, type Response } from 'express';
import { getDb, computeStatistics } from '../db.ts';
import type { LanguageCode } from '../../src/types/index.ts';

export const contentRouter = Router();

// Site Statistics
contentRouter.get('/statistics', (_req: Request, res: Response) => {
  const stats = computeStatistics();
  res.json({ statistics: stats });
});

// Articles
contentRouter.get('/articles', (req: Request, res: Response) => {
  const db = getDb();
  const { category, tag, status, lang } = req.query;

  let list = db.articles;

  if (category && typeof category === 'string' && category !== 'All') {
    list = list.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }

  if (tag && typeof tag === 'string') {
    list = list.filter(a => a.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  }

  if (status && typeof status === 'string' && status !== 'All') {
    list = list.filter(a => a.verification_status.toLowerCase() === status.toLowerCase());
  }

  // Handle translation overlay if lang requested
  const langCode = (lang as LanguageCode) || 'en';
  const mapped = list.map(a => {
    if (langCode !== 'en' && a.translations && a.translations[langCode]) {
      const tr = a.translations[langCode];
      return {
        ...a,
        display_title: tr.title,
        display_content: tr.content,
        display_summary: tr.summary,
        translation_status: tr.status,
        has_translation: true
      };
    }
    return {
      ...a,
      display_title: a.original_title,
      display_content: a.original_content,
      display_summary: a.summary,
      has_translation: langCode === 'en'
    };
  });

  res.json({ articles: mapped });
});

// Single Article by id or slug
contentRouter.get('/articles/:idOrSlug', (req: Request, res: Response) => {
  const db = getDb();
  const { idOrSlug } = req.params;
  const lang = (req.query.lang as LanguageCode) || 'en';

  const article = db.articles.find(a => a.id === idOrSlug || a.slug === idOrSlug);
  if (!article) {
    return res.status(404).json({ error: 'Article not found.' });
  }

  let displayTitle = article.original_title;
  let displayContent = article.original_content;
  let displaySummary = article.summary;
  let translationStatus = undefined;
  let hasTranslation = true;

  if (lang !== 'en') {
    if (article.translations && article.translations[lang]) {
      const tr = article.translations[lang];
      displayTitle = tr.title;
      displayContent = tr.content;
      displaySummary = tr.summary;
      translationStatus = tr.status;
    } else {
      hasTranslation = false;
    }
  }

  return res.json({
    article: {
      ...article,
      display_title: displayTitle,
      display_content: displayContent,
      display_summary: displaySummary,
      translation_status: translationStatus,
      has_translation: hasTranslation
    }
  });
});

// Historical Figures
contentRouter.get('/figures', (req: Request, res: Response) => {
  const db = getDb();
  const { dynasty } = req.query;
  let list = db.figures;

  if (dynasty && typeof dynasty === 'string') {
    list = list.filter(f => f.dynasty_id === dynasty || f.dynasty_name.toLowerCase().includes(dynasty.toLowerCase()));
  }

  res.json({ figures: list });
});

// Single Figure
contentRouter.get('/figures/:id', (req: Request, res: Response) => {
  const db = getDb();
  const figure = db.figures.find(f => f.id === req.params.id);
  if (!figure) return res.status(404).json({ error: 'Historical figure not found.' });
  res.json({ figure });
});

// Dynasties
contentRouter.get('/dynasties', (_req: Request, res: Response) => {
  const db = getDb();
  res.json({ dynasties: db.dynasties });
});

// Genealogy Nodes
contentRouter.get('/genealogy', (_req: Request, res: Response) => {
  const db = getDb();
  res.json({ genealogy: db.genealogy });
});

// Timeline Events
contentRouter.get('/timeline', (_req: Request, res: Response) => {
  const db = getDb();
  const sorted = [...db.events_timeline].sort((a, b) => a.sort_year - b.sort_year);
  res.json({ events: sorted });
});

// Locations
contentRouter.get('/locations', (req: Request, res: Response) => {
  const db = getDb();
  const { region } = req.query;
  let list = db.locations;
  if (region && typeof region === 'string' && region !== 'All') {
    list = list.filter(l => l.region.toLowerCase() === region.toLowerCase());
  }
  res.json({ locations: list });
});

// Inscriptions
contentRouter.get('/inscriptions', (req: Request, res: Response) => {
  const db = getDb();
  const { ruler, language } = req.query;
  let list = db.inscriptions;
  if (ruler && typeof ruler === 'string') {
    list = list.filter(i => i.ruler.toLowerCase().includes(ruler.toLowerCase()));
  }
  if (language && typeof language === 'string') {
    list = list.filter(i => i.language.toLowerCase().includes(language.toLowerCase()));
  }
  res.json({ inscriptions: list });
});

// Monuments
contentRouter.get('/monuments', (_req: Request, res: Response) => {
  const db = getDb();
  res.json({ monuments: db.monuments });
});

// Documents
contentRouter.get('/documents', (_req: Request, res: Response) => {
  const db = getDb();
  res.json({ documents: db.documents });
});

// Gallery
contentRouter.get('/gallery', (req: Request, res: Response) => {
  const db = getDb();
  const { category } = req.query;
  let list = db.gallery;
  if (category && typeof category === 'string' && category !== 'all') {
    list = list.filter(g => g.category.toLowerCase() === category.toLowerCase());
  }
  res.json({ gallery: list });
});

// Historical Claims
contentRouter.get('/claims', (_req: Request, res: Response) => {
  const db = getDb();
  res.json({ claims: db.claims });
});
