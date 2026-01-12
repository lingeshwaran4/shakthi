
import React, { useState, useEffect, useCallback } from 'react';
import { AppLanguage, UserRole, SellerProfile, Product } from './types';
import { TRANSLATIONS, LANGUAGES, INITIAL_PRODUCTS } from './constants';
import LandingView from './views/LandingView';
import SellerOnboarding from './views/SellerOnboarding';
import BuyerMarketplace from './views/BuyerMarketplace';
import AdminDashboard from './views/AdminDashboard';
import SellerHome from './views/SellerHome';
import BuyerLogin from './views/BuyerLogin';
import CheckoutView from './views/CheckoutView';
import LanguageSelector from './components/LanguageSelector';

const App: React.FC = () => {
  const [lang, setLang] = useState<AppLanguage>(AppLanguage.EN);
  const [role, setRole] = useState<UserRole>(UserRole.GUEST);
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [activeSeller, setActiveSeller] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [buyer, setBuyer] = useState<{ name: string; address: string } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const savedSellers = localStorage.getItem('shakti_sellers');
    if (savedSellers) setSellers(JSON.parse(savedSellers));
    
    const savedProducts = localStorage.getItem('shakti_products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));

    const savedLang = localStorage.getItem('shakti_lang');
    if (savedLang) setLang(savedLang as AppLanguage);

    const savedBuyer = localStorage.getItem('shakti_buyer');
    if (savedBuyer) setBuyer(JSON.parse(savedBuyer));
  }, []);

  const t = useCallback((key: string) => {
    return TRANSLATIONS[key]?.[lang] || TRANSLATIONS[key]?.['en'] || key;
  }, [lang]);

  const changeLang = (newLang: AppLanguage) => {
    setLang(newLang);
    localStorage.setItem('shakti_lang', newLang);
  };

  const handleSellerOnboarded = (sellerData: SellerProfile & { initialProduct?: { name: string, price: number } }) => {
    const { initialProduct, ...newSeller } = sellerData;
    
    const updatedSellers = [...sellers, newSeller];
    setSellers(updatedSellers);
    localStorage.setItem('shakti_sellers', JSON.stringify(updatedSellers));
    
    if (newSeller.imageUrls && newSeller.imageUrls.length > 0) {
      const markupPercent = Math.floor(Math.random() * (8 - 5 + 1)) + 5;
      const basePrice = initialProduct?.price || 2500;
      const buyerPrice = Math.round(basePrice * (1 + markupPercent / 100));

      const firstProduct: Product = {
        id: 'prod_' + Date.now(),
        sellerId: newSeller.id,
        nameEn: initialProduct?.name || `${newSeller.craftType} Signature Piece`,
        nameNative: initialProduct?.name || `${newSeller.craftType} की कलाकृति`,
        descriptionEn: newSeller.portfolioEn,
        descriptionNative: newSeller.portfolioNative,
        basePrice: basePrice,
        markupPercent: markupPercent,
        price: buyerPrice,
        imageUrl: newSeller.imageUrls[0],
        category: newSeller.craftType,
        status: 'available',
        rating: 5.0
      };
      
      const updatedProducts = [...products, firstProduct];
      setProducts(updatedProducts);
      localStorage.setItem('shakti_products', JSON.stringify(updatedProducts));
    }

    setActiveSeller(newSeller);
    setRole(UserRole.SELLER);
  };

  const handleBuyerLogin = (buyerData: { name: string; address: string }) => {
    setBuyer(buyerData);
    localStorage.setItem('shakti_buyer', JSON.stringify(buyerData));
  };

  const renderContent = () => {
    switch (role) {
      case UserRole.GUEST:
        return <LandingView t={t} onRoleSelect={setRole} />;
      case UserRole.SELLER:
        if (activeSeller) {
          return (
            <SellerHome 
              t={t} 
              seller={activeSeller} 
              allSellers={sellers}
              allProducts={products}
              onBack={() => {
                setActiveSeller(null);
                setRole(UserRole.GUEST);
              }} 
            />
          );
        }
        return (
          <SellerOnboarding 
            t={t} 
            lang={lang} 
            onComplete={handleSellerOnboarded} 
            onBack={() => setRole(UserRole.GUEST)} 
          />
        );
      case UserRole.BUYER:
        if (!buyer) {
          return (
            <BuyerLogin 
              t={t} 
              onLogin={handleBuyerLogin} 
              onBack={() => setRole(UserRole.GUEST)} 
            />
          );
        }
        if (selectedProduct) {
          return (
            <CheckoutView 
              t={t} 
              product={selectedProduct} 
              buyer={buyer} 
              onBack={() => setSelectedProduct(null)} 
              onOrderSuccess={() => setSelectedProduct(null)} 
            />
          );
        }
        return (
          <BuyerMarketplace 
            t={t} 
            products={products} 
            buyer={buyer}
            onSelectProduct={setSelectedProduct}
            onBack={() => setRole(UserRole.GUEST)} 
          />
        );
      case UserRole.ADMIN:
        return (
          <AdminDashboard 
            t={t} 
            sellers={sellers} 
            products={products} 
            onBack={() => setRole(UserRole.GUEST)} 
          />
        );
      default:
        return <LandingView t={t} onRoleSelect={setRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-200 selection:text-orange-900">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 md:px-12 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            setActiveSeller(null);
            setRole(UserRole.GUEST);
            setSelectedProduct(null);
          }}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-rose-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">S</div>
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-orange-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent">
            SHAKTI BRIDGE
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <LanguageSelector currentLang={lang} onSelect={changeLang} languages={LANGUAGES} />
          {role !== UserRole.ADMIN && (
             <button 
              onClick={() => setRole(UserRole.ADMIN)}
              className="text-[10px] font-black tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors uppercase py-2 px-4 border border-transparent hover:border-slate-100 rounded-full"
            >
              {t('operations_portal')}
            </button>
          )}
        </div>
      </header>

      <main className="pb-24">
        {renderContent()}
      </main>

      <footer className="bg-slate-950 text-slate-400 py-24 px-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2">
            <h3 className="text-white text-2xl font-black mb-6 tracking-tight">SHAKTI BRIDGE</h3>
            <p className="text-lg leading-relaxed max-w-sm">
              Connecting tradition with world-class technology. Empowering the next generation of rural women artisans.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Marketplace</h4>
            <ul className="space-y-4 font-medium">
              <li className="hover:text-orange-500 cursor-pointer transition-colors">Artisan Directory</li>
              <li className="hover:text-orange-500 cursor-pointer transition-colors">Wholesale Portal</li>
              <li className="hover:text-orange-500 cursor-pointer transition-colors">Shipping & Logistics</li>
              <li className="hover:text-orange-500 cursor-pointer transition-colors">Impact Reports</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Support</h4>
            <p className="font-bold text-white mb-2">team@shaktibridge.org</p>
            <p className="text-xs leading-loose">
              Bengaluru Tech Hub<br />
              Karnataka, India 560001
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black tracking-widest uppercase">
          <p>&copy; 2024 SHAKTI BRIDGE INFRASTRUCTURE. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
