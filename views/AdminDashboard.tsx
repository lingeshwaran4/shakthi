
import React from 'react';
import { SellerProfile, Product } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminDashboardProps {
  t: (key: string) => string;
  sellers: SellerProfile[];
  products: Product[];
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ t, sellers, products, onBack }) => {
  const data = [
    { name: 'Embroidery', count: 12 },
    { name: 'Pottery', count: 8 },
    { name: 'Basketry', count: 5 },
    { name: 'Jewelry', count: 15 },
  ];

  const totalPlatformRevenue = products.reduce((acc, p) => acc + (p.price - (p.basePrice || p.price)), 0);

  const COLORS = ['#0ea5e9', '#6366f1', '#a855f7', '#ec4899'];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Operations Hub</h2>
          <p className="text-slate-500">Managing {sellers.length} artisans across 4 clusters.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400 block">Pending Approvals</span>
            <span className="text-lg font-bold text-rose-600">{sellers.length}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400 block">Active Logistics</span>
            <span className="text-lg font-bold text-emerald-600">3</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Statistics Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Craft Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-lg">
          <h3 className="text-lg font-bold mb-8">{t('platform_fee')}</h3>
          <div className="space-y-6">
            <div>
              <span className="text-indigo-100 text-sm">Projected Fee Surplus</span>
              <div className="text-4xl font-black mt-1">₹{totalPlatformRevenue.toLocaleString()}</div>
            </div>
            <div className="h-px bg-white/20 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-indigo-100 text-xs">Women Impacted</span>
                <div className="text-xl font-bold">142</div>
              </div>
              <div>
                <span className="text-indigo-100 text-xs">Villages Connected</span>
                <div className="text-xl font-bold">12</div>
              </div>
            </div>
            <button className="w-full bg-white text-indigo-600 font-black py-4 rounded-xl mt-4 hover:bg-indigo-50 transition-colors uppercase tracking-widest text-[10px]">
              Financial Oversight Report
            </button>
          </div>
        </div>
      </div>

      {/* Financial Oversight List (Official Access) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-bold">Financial Oversight (Official Access Only)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <th className="px-8 py-4 font-black">Product</th>
                <th className="px-8 py-4 font-black text-right">{t('base_p')}</th>
                <th className="px-8 py-4 font-black text-right">{t('markup_p')}</th>
                <th className="px-8 py-4 font-black text-right">Buyer Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(p => {
                const markupAmount = p.price - (p.basePrice || p.price);
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900">{p.nameEn}</div>
                      <div className="text-xs text-slate-500">{p.category}</div>
                    </td>
                    <td className="px-8 py-6 text-right font-medium">₹{(p.basePrice || p.price).toLocaleString()}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="text-emerald-600 font-black">+₹{markupAmount.toLocaleString()}</div>
                      <div className="text-[9px] text-slate-400 uppercase font-black">{p.markupPercent}%</div>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-slate-900">₹{p.price.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold">Verification Queue</h3>
          <span className="text-sm text-sky-600 font-medium">Auto-translation Enabled</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-4 font-semibold">Artisan</th>
                <th className="px-8 py-4 font-semibold">Native Portfolio</th>
                <th className="px-8 py-4 font-semibold">AI English Version</th>
                <th className="px-8 py-4 font-semibold">PAN Status</th>
                <th className="px-8 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sellers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400">No pending approvals</td>
                </tr>
              ) : (
                sellers.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.village}, {s.district}</div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-slate-600 line-clamp-2 max-w-xs">{s.portfolioNative}</p>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-xs italic text-slate-600 line-clamp-2 max-w-xs">{s.portfolioEn}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase">Pending</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg">✅</button>
                        <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">❌</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
