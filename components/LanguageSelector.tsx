
import React from 'react';
import { AppLanguage } from '../types';

interface LanguageSelectorProps {
  currentLang: AppLanguage;
  onSelect: (lang: AppLanguage) => void;
  languages: { code: AppLanguage; native: string; label: string }[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onSelect, languages }) => {
  return (
    <div className="relative inline-flex items-center gap-2">
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 hover:bg-white hover:shadow-md transition-all group">
        <span className="text-lg opacity-40 group-hover:opacity-100 transition-opacity">🌐</span>
        <select
          value={currentLang}
          onChange={(e) => onSelect(e.target.value as AppLanguage)}
          className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-slate-600 focus:ring-0 focus:outline-none cursor-pointer appearance-none pr-4"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code} className="font-sans">
              {l.native}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
          ▼
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
