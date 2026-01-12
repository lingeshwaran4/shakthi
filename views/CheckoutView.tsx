
import React, { useState } from 'react';
import { Product } from '../types';

interface CheckoutViewProps {
  t: (key: string) => string;
  product: Product;
  buyer: { name: string; address: string };
  onBack: () => void;
  onOrderSuccess: () => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ t, product, buyer, onBack, onOrderSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState(buyer.address);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalPrice = product.price * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onOrderSuccess();
    }, 4000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 animate-in zoom-in duration-700">
        <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center text-6xl mb-10 shadow-inner animate-bounce">
          ✅
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">{t('order_success')}</h2>
        <p className="text-xl text-slate-500 max-w-md mx-auto leading-relaxed">
          {t('order_success_msg')}
        </p>
        <div className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
          Redirecting to Gallery...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in duration-700">
      <button 
        onClick={onBack} 
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-all font-semibold group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> {t('back')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Product Info Card */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl overflow-hidden group">
          <div className="aspect-square rounded-[2rem] overflow-hidden mb-10 shadow-2xl bg-slate-50">
            <img src={product.imageUrl} alt={product.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
          </div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">{product.category}</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{product.nameEn}</h3>
              <p className="text-sm text-slate-500 italic mt-2">"{product.descriptionEn}"</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-slate-900">₹{product.price}</span>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Per Unit</p>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
            <span className="text-lg font-black text-slate-900">{t('quantity')}</span>
            <div className="flex items-center gap-6 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-2xl font-black text-slate-400 hover:text-orange-600"
              >-</button>
              <span className="text-2xl font-black text-slate-900 w-8 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-2xl font-black text-slate-400 hover:text-orange-600"
              >+</button>
            </div>
          </div>
        </div>

        {/* Right: Payment Details */}
        <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl relative">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-10 border-b border-slate-100 pb-6">
            {t('checkout_title')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest">{t('buyer_name')}</label>
                <input 
                  disabled
                  value={buyer.name}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 opacity-70"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest">{t('phone_number')} <span className="text-rose-500">*</span></label>
                <input 
                  required
                  type="tel"
                  placeholder="Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest">{t('shipping_address')} <span className="text-rose-500">*</span></label>
              <textarea 
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium text-slate-800"
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest">{t('payment_method')}</label>
              <div className="grid grid-cols-3 gap-4">
                {['UPI', 'Card', 'COD'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-5 rounded-2xl border-4 font-black text-sm tracking-widest transition-all ${
                      paymentMethod === method 
                      ? 'border-orange-600 bg-orange-50 text-orange-900 shadow-lg' 
                      : 'border-slate-50 bg-slate-100 text-slate-400 hover:bg-white'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 uppercase tracking-widest font-bold text-xs">Order Total</span>
                <span className="text-3xl font-black">₹{totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-10">Includes Platform Fee & Shipping</p>
              
              <button 
                type="submit"
                className="w-full bg-white text-slate-900 py-6 rounded-2xl font-black text-lg tracking-[0.2em] uppercase shadow-2xl hover:bg-orange-500 hover:text-white transition-all active:scale-[0.98]"
              >
                {t('confirm_order')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
