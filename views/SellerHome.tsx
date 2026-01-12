
import React, { useState, useMemo } from 'react';
import { SellerProfile, Product } from '../types';

interface SellerHomeProps {
  t: (key: string) => string;
  seller: SellerProfile;
  allSellers: SellerProfile[];
  onBack: () => void;
  allProducts: Product[];
}

const SellerHome: React.FC<SellerHomeProps> = ({ t, seller, allSellers, onBack, allProducts = [] }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'products' | 'community'>('profile');

  const sellerProducts = useMemo(() => {
    // Only show products uploaded by this specific seller
    return allProducts.filter(p => p.sellerId === seller.id);
  }, [allProducts, seller.id]);

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-orange-400' : 'text-slate-200'}`}>
            ★
          </span>
        ))}
        <span className="text-xs font-black text-slate-400 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-orange-100">
      {/* Editorial Navigation */}
      <nav className="max-w-7xl mx-auto px-10 py-10 flex justify-between items-center bg-white sticky top-0 z-40">
        <div className="flex gap-12 md:gap-16">
          {['profile', 'products', 'community'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-2 py-1 ${activeTab === tab ? 'text-slate-900 border-slate-900' : 'text-slate-300 border-transparent hover:text-slate-500'}`}
            >
              {tab === 'profile' ? t('my_profile') : tab === 'products' ? t('my_products') : t('artisan_community')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="hidden md:block text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 hover:text-rose-600 transition-colors">
            {t('exit_portal')}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-10 pb-32">
        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-1000">
            {/* HERO: Editorial Spread */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-48 pt-10">
              <div className="lg:col-span-7 pr-0 lg:pr-10">
                <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.6em] mb-10">
                  {t('artisan_series')} 042
                </p>
                <h1 className="text-6xl md:text-[10rem] font-black text-slate-900 leading-[0.85] tracking-tighter mb-12 break-words">
                  {seller.name}
                </h1>
                <div className="flex items-center gap-8 mb-16">
                   <div className="h-px bg-slate-200 flex-1" />
                   <span className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">{t('master_of')} {seller.craftType}</span>
                </div>
                <p className="text-2xl md:text-3xl font-medium text-slate-500 leading-tight max-w-2xl">
                  {seller.portfolioEn.split('.')[0]}.
                </p>
              </div>
              <div className="lg:col-span-5">
                <div className="aspect-[3/4] bg-slate-100 overflow-hidden shadow-3xl rounded-sm group relative">
                  <img 
                    src={seller.profileImageUrl || `https://ui-avatars.com/api/?name=${seller.name}&background=random&size=800`} 
                    alt={seller.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
                  />
                  <div className="absolute inset-0 border-[24px] border-white/10 group-hover:border-white/0 transition-all duration-700" />
                </div>
              </div>
            </div>

            {/* THE STORY: Split Layout */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-48">
              <div className="lg:col-span-4">
                <h2 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] mb-12 border-b border-slate-100 pb-4">
                  {t('philosophy')}
                </h2>
                <div className="space-y-12">
                  <div>
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">{t('origin')}</h4>
                    <p className="text-xl font-black text-slate-900 tracking-tight">{seller.village}, {seller.district}</p>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">{t('heritage_grade')}</h4>
                    <p className="text-xl font-black text-emerald-600 tracking-tight">{t('verified')}</p>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">{t('material_focus')}</h4>
                    <div className="flex flex-wrap gap-3">
                      {seller.tags?.map(tag => (
                        <span key={tag} className="text-[10px] font-black border border-slate-200 px-4 py-1.5 uppercase tracking-widest text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="max-w-3xl">
                  <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-16 leading-none">{t('artisan_voice')}</h3>
                  
                  <div className="space-y-24">
                    <div className="relative pl-12 border-l-4 border-orange-500">
                       <p className="text-2xl text-slate-500 leading-relaxed italic">
                         "{seller.portfolioEn}"
                       </p>
                       <span className="absolute -top-4 -left-6 text-8xl text-orange-100 font-serif pointer-events-none opacity-50">“</span>
                    </div>

                    <div className="relative pl-12 border-l-4 border-indigo-500">
                       <p className="text-3xl text-slate-900 font-black leading-tight">
                         "{seller.portfolioNative}"
                       </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CURATED MASTERPIECES */}
            <section className="border-t border-slate-100 pt-32">
              <div className="flex justify-between items-end mb-20">
                <div className="max-w-lg">
                  <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6">{t('curated_collection')}</h3>
                  <p className="text-lg text-slate-400 font-medium">Each piece is a singular expression of legacy.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('products')}
                  className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 border-b-2 border-slate-900 pb-1"
                >
                  {t('view_inventory')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-24">
                {sellerProducts.length === 0 ? (
                  <div className="col-span-2 py-20 bg-slate-50 text-center border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 uppercase font-black tracking-widest">No pieces archived yet.</p>
                  </div>
                ) : (
                  sellerProducts.slice(0, 4).map((p, idx) => (
                    <div key={p.id} className={`group flex flex-col ${idx % 2 !== 0 ? 'md:mt-32' : ''}`}>
                      <div className="aspect-[5/6] overflow-hidden bg-slate-50 mb-10 shadow-2xl relative">
                        <img 
                          src={p.imageUrl} 
                          alt={p.nameEn} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                        />
                        <div className="absolute top-8 left-8">
                          <span className="bg-white px-5 py-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-900 border border-slate-100">
                            {p.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="max-w-[70%]">
                          <h4 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{p.nameEn}</h4>
                          <p className="text-sm font-black text-orange-600 uppercase tracking-widest opacity-80 mb-6">{p.nameNative}</p>
                          <p className="text-lg text-slate-500 leading-snug line-clamp-2 italic mb-8">"{p.descriptionEn}"</p>
                        </div>
                        <div className="text-right pb-8">
                          <p className="text-5xl font-black text-slate-900 tracking-tighter">₹{p.basePrice || p.price}</p>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">{t('export_quality')}</p>
                        </div>
                      </div>
                      <div className="pt-8 border-t border-slate-50 flex items-center gap-6">
                         {renderStars(p.rating)}
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('available_globally')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="animate-in fade-in duration-700 pt-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-slate-100 pb-20 mb-20">
              <div className="max-w-2xl">
                <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.6em] mb-6">{t('inventory_control')}</p>
                <h2 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">The Artisan’s Archive</h2>
              </div>
              <button className="bg-slate-900 text-white px-12 py-5 font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:bg-black transition-all">
                {t('archive_new_piece')}
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-24">
              {sellerProducts.length === 0 ? (
                <div className="text-center py-40 bg-slate-50 border border-slate-100">
                  <span className="text-8xl mb-10 block opacity-10 grayscale">🧵</span>
                  <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{t('no_items_cataloged')}</h4>
                  <p className="text-slate-400 font-medium mt-4 text-xl">Prepare your masterpieces for the global exhibition.</p>
                </div>
              ) : (
                sellerProducts.map((p) => (
                  <div key={p.id} className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center group">
                    <div className="lg:col-span-5 aspect-square overflow-hidden shadow-2xl bg-slate-50 border border-slate-100">
                      <img 
                        src={p.imageUrl} 
                        alt={p.nameEn} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                    </div>
                    <div className="lg:col-span-7">
                      <div className="flex justify-between items-start mb-10">
                        <div>
                          <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.5em] mb-4">{p.category}</p>
                          <h4 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{p.nameEn}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{p.basePrice || p.price}</span>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Market Valuation</p>
                        </div>
                      </div>
                      
                      <div className="mb-10">
                        {renderStars(p.rating)}
                      </div>
                      
                      <p className="text-xl text-slate-500 leading-relaxed mb-12 max-w-3xl">
                        {p.descriptionEn}
                      </p>

                      <div className="flex gap-10 pt-12 border-t border-slate-50 items-center">
                        <button className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-slate-900 transition-colors">Modify</button>
                        <button className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-slate-900 transition-colors">Media</button>
                        <button className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-rose-600 transition-colors">Withdraw</button>
                        <div className="ml-auto flex items-center gap-4">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">{t('live')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="animate-in fade-in duration-1000 pt-10">
            <div className="bg-slate-950 p-24 mb-32 relative overflow-hidden flex flex-col justify-end min-h-[500px]">
               <div className="absolute top-0 right-0 p-16 text-[30rem] text-white/5 font-black leading-none pointer-events-none select-none">
                 S
               </div>
               <div className="relative z-10 max-w-3xl">
                 <p className="text-orange-500 font-black tracking-[0.6em] mb-8 text-[11px]">{t('guild_network')}</p>
                 <h2 className="text-7xl font-black text-white leading-[0.9] tracking-tighter mb-10">{t('guild_collective')}</h2>
                 <p className="text-2xl text-slate-400 leading-relaxed opacity-80">
                   {allSellers.length} {t('master_artisan_msg')}
                 </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
              {allSellers.map(s => (
                <div key={s.id} className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden mb-10 bg-slate-100 shadow-xl group-hover:shadow-3xl transition-all duration-700">
                     <img 
                      src={s.imageUrls[0]} 
                      alt={s.craftType} 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                     />
                  </div>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.5em] mb-4">
                    {s.craftType}
                  </p>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-1">{s.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">{s.village}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerHome;
