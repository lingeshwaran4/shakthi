
import React from 'react';
import { UserRole } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

interface LandingViewProps {
  t: (key: string) => string;
  onRoleSelect: (role: UserRole) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ t, onRoleSelect }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 px-8 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1] tracking-tighter">
            {t('welcome')}
          </h2>
          <p className="text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('tagline')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-5xl mx-auto">
            {/* Seller Path */}
            <button
              onClick={() => onRoleSelect(UserRole.SELLER)}
              className="group relative bg-orange-50/30 border border-orange-100 hover:border-orange-400 p-12 rounded-[3rem] transition-all hover:shadow-3xl text-left overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-6xl mb-8 block">🧵</span>
                <h3 className="text-4xl font-black text-orange-950 mb-4 tracking-tighter">{t('i_am_seller')}</h3>
                <p className="text-orange-900/60 text-lg font-medium leading-relaxed mb-10">{t('seller_desc')}</p>
                <div className="flex items-center text-orange-600 font-black text-sm uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform">
                  {t('start_now')} <span className="ml-3">→</span>
                </div>
              </div>
            </button>

            {/* Buyer Path */}
            <button
              onClick={() => onRoleSelect(UserRole.BUYER)}
              className="group relative bg-indigo-50/30 border border-indigo-100 hover:border-indigo-400 p-12 rounded-[3rem] transition-all hover:shadow-3xl text-left overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-6xl mb-8 block">🛒</span>
                <h3 className="text-4xl font-black text-indigo-950 mb-4 tracking-tighter">{t('i_am_buyer')}</h3>
                <p className="text-indigo-900/60 text-lg font-medium leading-relaxed mb-10">{t('buyer_desc')}</p>
                <div className="flex items-center text-indigo-600 font-black text-sm uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform">
                  {t('browse_gallery')} <span className="ml-3">→</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section (As requested: Product Name & Price in Login/Landing) */}
      <section className="w-full py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-16">
            <div className="max-w-xl">
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.5em] mb-4">Current Exhibition</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Featured Treasures</h3>
            </div>
            <button 
              onClick={() => onRoleSelect(UserRole.BUYER)}
              className="text-xs font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1"
            >
              Shop Collection
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {INITIAL_PRODUCTS.map((p) => (
              <div key={p.id} className="group cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden bg-white mb-6 rounded-sm shadow-sm group-hover:shadow-2xl transition-all duration-700">
                  <img src={p.imageUrl} alt={p.nameEn} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{p.category}</p>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter">{p.nameEn}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">₹{p.price}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Handmade</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Third placeholder item for visual balance */}
            <div className="group cursor-pointer hidden lg:block border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center p-12 text-center">
               <span className="text-4xl mb-4 opacity-20">🎨</span>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Discover more in the full gallery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="w-full py-16 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-8 flex flex-wrap justify-between gap-12 items-center">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">12,000+</span>
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Artisans</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">100%</span>
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Verified Identity</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">Global</span>
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Export Ready</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">Managed</span>
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Logistics</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
