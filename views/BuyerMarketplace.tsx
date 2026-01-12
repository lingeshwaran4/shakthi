
import React, { useState } from 'react';
import { Product } from '../types';

interface BuyerMarketplaceProps {
  t: (key: string) => string;
  products: Product[];
  onBack: () => void;
  buyer: { name: string; address: string };
  onSelectProduct: (product: Product) => void;
}

const BuyerMarketplace: React.FC<BuyerMarketplaceProps> = ({ t, products, onBack, buyer, onSelectProduct }) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Home Decor', 'Pottery', 'Fashion', 'Textiles'];

  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <p className="text-orange-600 font-bold text-sm uppercase tracking-widest mb-2">
            {t('welcome')}, {buyer.name}
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            {t('artisan_masterpieces')}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            {t('managed_by')}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                filter === c 
                ? 'bg-slate-900 text-white shadow-xl' 
                : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {c === 'All' ? t('all_categories') : c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        {filtered.map(product => (
          <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all group p-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6">
              <img 
                src={product.imageUrl} 
                alt={product.nameEn}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 border border-slate-100 shadow-sm">
                  {product.category}
                </span>
              </div>
            </div>
            
            <div className="px-2 pb-2">
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{product.nameEn}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-8 font-medium italic">
                {product.descriptionEn}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900">₹{product.price}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t('handmade')}</span>
                </div>
                <button 
                  onClick={() => onSelectProduct(product)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-600/20 active:scale-95 transition-all"
                >
                  {t('contact_team')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-32 bg-slate-900 rounded-[3rem] p-16 md:p-24 flex flex-col items-center text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-16 text-[30rem] text-white/5 font-black leading-none pointer-events-none select-none group-hover:scale-110 transition-transform duration-1000">S</div>
        <h3 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter max-w-2xl relative z-10 leading-[0.9]">Looking for customized tribal crafts?</h3>
        <p className="text-slate-400 max-w-xl mb-12 text-xl font-medium relative z-10">
          We connect luxury brands and boutiques directly with artisan clusters for bulk or bespoke orders. Our team handles the end-to-end logistics.
        </p>
        <button className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-orange-500 hover:text-white transition-all relative z-10">
          Partner With Us
        </button>
      </div>
    </div>
  );
};

export default BuyerMarketplace;
