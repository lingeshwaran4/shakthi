
import React, { useState } from 'react';

interface BuyerLoginProps {
  t: (key: string) => string;
  onLogin: (buyer: { name: string; address: string }) => void;
  onBack: () => void;
}

const BuyerLogin: React.FC<BuyerLoginProps> = ({ t, onLogin, onBack }) => {
  const [formData, setFormData] = useState({ name: '', address: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.address) {
      onLogin(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 animate-in fade-in duration-700">
      <button 
        onClick={onBack} 
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-all font-semibold group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> {t('exit_portal')}
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-12 md:p-16 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 border-b border-indigo-100">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {t('buyer_login_title')}
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
            {t('buyer_login_desc')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-12 md:p-16 space-y-10">
          <div className="space-y-4">
            <label className="text-sm font-black text-slate-700 uppercase tracking-widest">
              {t('buyer_name')}
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-xl text-slate-900"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-black text-slate-700 uppercase tracking-widest">
              {t('shipping_address')}
            </label>
            <textarea
              required
              rows={4}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full Delivery Address"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-lg text-slate-900"
            />
          </div>

          <button
            type="submit"
            className="w-full py-8 rounded-[2rem] bg-slate-900 text-white font-black text-xl tracking-[0.2em] shadow-3xl hover:bg-black hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-6 group uppercase"
          >
            {t('continue_to_market')}
            <span className="group-hover:translate-x-2 transition-transform text-2xl">→</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyerLogin;
