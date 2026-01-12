
import React, { useState, useRef, useMemo } from 'react';
import { AppLanguage, SellerProfile } from '../types';
import { generatePortfolio } from '../services/geminiService';

interface SellerOnboardingProps {
  t: (key: string) => string;
  lang: AppLanguage;
  onComplete: (seller: SellerProfile & { initialProduct?: { name: string, price: number } }) => void;
  onBack: () => void;
}

const SellerOnboarding: React.FC<SellerOnboardingProps> = ({ t, lang, onComplete, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [docUploaded, setDocUploaded] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    village: '',
    district: '',
    craftType: '',
    experience: '',
    phone: '',
    productName: '',
    productPrice: '',
    idType: 'PAN' as 'PAN' | 'AADHAR',
    idNumber: '',
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const productInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Validation Logic
  const idValidation = useMemo(() => {
    const val = formData.idNumber.trim();
    if (!val) return { isValid: null, message: '' };
    
    if (formData.idType === 'PAN') {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      const isValid = panRegex.test(val);
      return { 
        isValid, 
        message: isValid ? 'Valid PAN Format' : 'Format: 5 Letters, 4 Digits, 1 Letter (e.g., ABCDE1234F)' 
      };
    } else {
      const aadharRegex = /^[0-9]{12}$/;
      const isValid = aadharRegex.test(val);
      return { 
        isValid, 
        message: isValid ? 'Valid Aadhar Format' : 'Format: 12 Digits (e.g., 123456789012)' 
      };
    }
  }, [formData.idNumber, formData.idType]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'product' | 'document') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please select an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'profile') setProfileImage(reader.result as string);
        else if (type === 'product') setProductImage(reader.result as string);
        else setDocUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const filterAlphabet = (val: string) => val.replace(/[^a-zA-Z\s]/g, '');
  const filterInteger = (val: string) => val.replace(/[^0-9]/g, '');

  const maskIdNumber = (val: string) => {
    if (!val || isFocused) return val;
    if (val.length < 4) return '*'.repeat(val.length);
    const lastFour = val.slice(-4);
    return '*'.repeat(val.length - 4) + lastFour;
  };

  const goToVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productImage) {
      alert("Please upload at least one photo of your craft so our AI can analyze your skill.");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idValidation.isValid) {
      alert("Please provide a valid ID number.");
      return;
    }
    setLoading(true);
    
    try {
      const aiResult = await generatePortfolio({
        ...formData,
        productImageBase64: productImage || undefined
      }, lang);

      const newSeller: SellerProfile = {
        id: 'seller_' + Date.now(),
        ...formData,
        profileImageUrl: profileImage || undefined,
        isVerified: false,
        panStatus: 'pending',
        portfolioEn: aiResult.portfolioEn,
        portfolioNative: aiResult.portfolioNative,
        language: lang,
        imageUrls: productImage ? [productImage] : []
      };

      onComplete({
        ...newSeller,
        initialProduct: {
          name: formData.productName || `${formData.craftType} Masterpiece`,
          price: parseInt(formData.productPrice) || 2500
        }
      });
    } catch (err) {
      console.error("AI Portfolio Generation Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <button 
        onClick={step === 1 ? onBack : () => setStep(1)} 
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-all font-semibold group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> 
        {step === 1 ? 'Cancel Onboarding' : 'Back'}
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Step Indicator Header */}
        <div className="p-10 bg-gradient-to-r from-orange-50 via-rose-50 to-orange-50 border-b border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                {step === 1 ? t('onboarding_title_1') : t('onboarding_title_2')}
              </h2>
              <p className="text-slate-600 mt-2 font-medium max-w-md leading-relaxed">
                {step === 1 
                  ? t('onboarding_desc_1') 
                  : t('onboarding_desc_2')}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`h-3 w-16 rounded-full transition-all duration-500 ${step === 1 ? 'bg-orange-600' : 'bg-orange-200'}`} />
              <div className={`h-3 w-16 rounded-full transition-all duration-500 ${step === 2 ? 'bg-orange-600' : 'bg-orange-200'}`} />
              <span className="ml-2 font-bold text-orange-900 text-sm">{t('step_label')} {step}/2</span>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={goToVerification} className="p-10 space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col items-center gap-4">
              <div 
                onClick={() => profileInputRef.current?.click()}
                className="group relative w-36 h-36 rounded-full border-8 border-white shadow-xl bg-slate-50 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:scale-105"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Artisan" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-4xl block mb-2">👩🏾‍🎨</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('portrait_photo')}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold bg-orange-600 px-4 py-1.5 rounded-full">CHANGE</span>
                </div>
              </div>
              <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'profile')} />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest tracking-[0.2em]">{t('profile_photo_optional')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex justify-between">
                  <span>{t('full_name')} <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400 uppercase">A-Z Only</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: filterAlphabet(e.target.value)})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                  placeholder={t('full_name')}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t('email_optional')}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                  placeholder="artisan@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t('village')} <span className="text-rose-500">*</span></label>
                <input
                  required
                  type="text"
                  value={formData.village}
                  onChange={e => setFormData({...formData, village: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                  placeholder={t('village')}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex justify-between">
                  <span>{t('district')} <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400 uppercase">A-Z Only</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.district}
                  onChange={e => setFormData({...formData, district: filterAlphabet(e.target.value)})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                  placeholder={t('district')}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex justify-between">
                  <span>{t('mobile_number')} <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400 uppercase">Numbers Only</span>
                </label>
                <input
                  required
                  type="text"
                  maxLength={10}
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: filterInteger(e.target.value)})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-mono font-bold tracking-[0.1em]"
                  placeholder="10-digit Phone"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t('experience')} <span className="text-rose-500">*</span></label>
                <select
                  required
                  value={formData.experience}
                  onChange={e => setFormData({...formData, experience: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium appearance-none"
                >
                  <option value="">Select Level</option>
                  <option value="New (1-2 years)">New (1-2 years)</option>
                  <option value="Experienced (3-7 years)">Experienced (3-7 years)</option>
                  <option value="Expert (8-15 years)">Expert (8-15 years)</option>
                  <option value="Master Artisan (15+ years)">Master Artisan (15+ years)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('craft_type')} <span className="text-rose-500">*</span></label>
              <input
                required
                type="text"
                value={formData.craftType}
                onChange={e => setFormData({...formData, craftType: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                placeholder="e.g. Traditional Pottery, Handweaving"
              />
            </div>

            {/* Product Details Section */}
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-8">
               <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                 <span className="text-2xl">🛍️</span> Your First Product Details
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Product Name <span className="text-rose-500">*</span></label>
                    <input
                      required
                      type="text"
                      value={formData.productName}
                      onChange={e => setFormData({...formData, productName: e.target.value})}
                      className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                      placeholder="e.g. Blue Terracotta Vase"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Expected Price (₹) <span className="text-rose-500">*</span></label>
                    <input
                      required
                      type="text"
                      value={formData.productPrice}
                      onChange={e => setFormData({...formData, productPrice: filterInteger(e.target.value)})}
                      className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-mono font-bold"
                      placeholder="e.g. 1500"
                    />
                  </div>
               </div>

               {/* AI Vision Upload Section */}
               <div className="space-y-4">
                 <label className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                   {t('ai_vision_upload')} <span className="text-rose-500 text-lg">*</span>
                 </label>
                 <div 
                   onClick={() => productInputRef.current?.click()}
                   className="group relative min-h-[350px] border-4 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center bg-white hover:border-orange-400 hover:shadow-2xl transition-all cursor-pointer overflow-hidden group"
                 >
                   {productImage ? (
                     <div className="w-full h-[350px] flex items-center justify-center p-8">
                       <img src={productImage} alt="Craft for AI analysis" className="max-w-full max-h-full object-contain rounded-3xl shadow-xl transition-transform group-hover:scale-105" />
                       <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                         <span className="bg-white/90 backdrop-blur px-8 py-3 rounded-full font-black shadow-2xl text-orange-600 uppercase tracking-widest">Change Image</span>
                       </div>
                     </div>
                   ) : (
                     <div className="text-center p-12">
                       <div className="text-8xl mb-6 opacity-80 animate-pulse">✨</div>
                       <p className="text-2xl font-black text-slate-800 leading-tight">{t('showcase_work')}</p>
                       <p className="text-slate-400 mt-3 font-semibold max-w-xs mx-auto">{t('ai_vision_desc')}</p>
                     </div>
                   )}
                 </div>
                 <input type="file" ref={productInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'product')} />
               </div>
            </div>

            <button
              type="submit"
              className="w-full py-7 rounded-3xl bg-slate-900 text-white font-black text-xl tracking-widest shadow-2xl hover:bg-black hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
            >
              {t('next_verification')}
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="p-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-2xl mx-auto space-y-12">
              {/* Type Selection */}
              <div className="grid grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, idType: 'PAN', idNumber: ''})}
                  className={`py-6 rounded-3xl border-4 font-black text-lg transition-all flex flex-col items-center gap-1 ${
                    formData.idType === 'PAN' 
                    ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-xl' 
                    : 'border-slate-50 bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <span>PAN CARD</span>
                  <span className="text-[10px] opacity-60">Personal Tax ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, idType: 'AADHAR', idNumber: ''})}
                  className={`py-6 rounded-3xl border-4 font-black text-lg transition-all flex flex-col items-center gap-1 ${
                    formData.idType === 'AADHAR' 
                    ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-xl' 
                    : 'border-slate-50 bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <span>AADHAR</span>
                  <span className="text-[10px] opacity-60">National UID</span>
                </button>
              </div>

              {/* Input with Real-time Validation */}
              <div className="space-y-4">
                <label className="text-sm font-black text-slate-700 tracking-widest uppercase flex justify-between">
                  <span>{formData.idType} ID NUMBER <span className="text-rose-500">*</span></span>
                  <span className={`text-[10px] transition-colors ${idValidation.isValid === true ? 'text-emerald-600' : idValidation.isValid === false ? 'text-rose-500' : 'text-slate-400'}`}>
                    {idValidation.message}
                  </span>
                </label>
                
                <div className="relative">
                  <input
                    required
                    type="text"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    value={isFocused ? formData.idNumber : maskIdNumber(formData.idNumber)}
                    onChange={e => {
                      const val = e.target.value.toUpperCase().replace(/\s/g, '');
                      setFormData({...formData, idNumber: val});
                    }}
                    className={`w-full bg-slate-50 border-4 rounded-[1.5rem] px-8 py-6 outline-none uppercase font-mono text-2xl tracking-[0.3em] transition-all text-center placeholder:tracking-normal placeholder:font-sans placeholder:text-lg ${
                      idValidation.isValid === true 
                        ? 'border-emerald-500 bg-emerald-50/30' 
                        : idValidation.isValid === false 
                          ? 'border-rose-500 bg-rose-50/30' 
                          : 'border-slate-100 focus:border-orange-500'
                    }`}
                    placeholder={`ENTER ${formData.idType}`}
                  />
                  
                  {idValidation.isValid !== null && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl">
                      {idValidation.isValid ? '✅' : '⚠️'}
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Document Button */}
              <div className="space-y-4">
                <div 
                  onClick={() => docInputRef.current?.click()}
                  className={`group relative p-8 rounded-[2rem] border-4 border-dashed transition-all cursor-pointer flex items-center gap-6 overflow-hidden ${
                    docUploaded ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50/50 hover:border-orange-200 hover:bg-white'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-colors ${docUploaded ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600'}`}>
                    {docUploaded ? '📄' : '📤'}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-black uppercase tracking-widest text-sm ${docUploaded ? 'text-emerald-900' : 'text-slate-700'}`}>
                      {docUploaded ? 'Document Uploaded' : 'Upload ID Document'}
                    </h4>
                    <p className={`text-xs font-bold opacity-60 ${docUploaded ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {docUploaded ? 'We will verify this shortly' : 'Photo of PAN/Aadhar for verification'}
                    </p>
                  </div>
                  {docUploaded && <span className="text-emerald-500 font-black">✓</span>}
                  <input type="file" ref={docInputRef} className="hidden" accept="image/*,application/pdf" onChange={(e) => handleImageUpload(e, 'document')} />
                </div>
              </div>

              {/* Privacy Shield */}
              <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex gap-6 items-start shadow-inner">
                <span className="text-4xl">🛡️</span>
                <div>
                  <h4 className="font-black text-indigo-900 mb-1 uppercase tracking-widest text-sm">Shakti Security Shield</h4>
                  <p className="text-[11px] text-indigo-800 leading-relaxed font-bold opacity-70 uppercase tracking-widest">
                    Your sensitive information is end-to-end encrypted. We never display your ID to buyers or store it in plain text. Only used for financial audit trails.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <button
                disabled={loading || !idValidation.isValid}
                type="submit"
                className="w-full py-8 rounded-[2.5rem] bg-gradient-to-r from-orange-600 via-rose-600 to-indigo-600 text-white font-black text-2xl tracking-[0.2em] shadow-3xl hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-6"
              >
                {loading ? (
                  <>
                    <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="uppercase">AI Analyzing Craft Vision...</span>
                  </>
                ) : (
                  <>
                    CREATE GLOBAL PORTFOLIO
                    <span className="text-3xl">✨</span>
                  </>
                )}
              </button>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-black tracking-[0.6em] uppercase">Shakti Bridge Global Infrastructure</p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SellerOnboarding;
