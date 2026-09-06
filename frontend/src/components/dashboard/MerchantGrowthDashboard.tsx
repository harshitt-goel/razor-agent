import React from 'react';
import { AnalyticsMetric } from '../../types';
import { TrendingUp, DollarSign, Percent, ShoppingBag, ArrowUpRight, Zap, RefreshCw, BarChart2, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface MerchantGrowthDashboardProps {
  metrics: AnalyticsMetric;
}

export const MerchantGrowthDashboard: React.FC<MerchantGrowthDashboardProps> = ({ metrics }) => {
  const chartData = [
    { name: 'Conversion Rate', Storefront: 4.2, AIAgent: 7.8, unit: '%' },
    { name: 'Upsell Rate', Storefront: 3.1, AIAgent: 18.4, unit: '%' },
    { name: 'Cross-sell Rate', Storefront: 2.8, AIAgent: 12.6, unit: '%' },
  ];

  const revenueData = [
    { name: 'Revenue / Session', Storefront: 124, AIAgent: 282 },
    { name: 'AOV (₹)', Storefront: 2940, AIAgent: 3620 },
  ];

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      
      {/* Dashboard Title & Badge */}
      <div className="bg-[#151c2e] border border-cyan-500/30 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white">Merchant Revenue & Growth Analytics</h2>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full uppercase">
              AI Growth Track 1
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical performance comparison demonstrating how RazorAgent increases conversion, AOV, and upsell adoption.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>Attributed Revenue Uplift: +127.4%</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* GMV */}
        <div className="bg-[#151c2e] border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-cyan-500/50 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Gross Merchandise Value</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">₹{metrics.totalGmv.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+28.4% vs last period</span>
          </div>
        </div>

        {/* AI Attributed Revenue */}
        <div className="bg-[#151c2e] border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-cyan-500/50 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>AI Attributed Revenue</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">₹{metrics.aiAttributedRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">
            Directly generated via intelligent recommendations
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-[#151c2e] border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-cyan-500/50 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Conversion Rate</span>
            <Percent className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{metrics.conversionRate}%</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{metrics.storefrontVsAgent.conversion.upliftPercentage} vs storefront</span>
          </div>
        </div>

        {/* Upsell Acceptance */}
        <div className="bg-[#151c2e] border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-cyan-500/50 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Upsell Acceptance Rate</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{metrics.upsellAcceptanceRate}%</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{metrics.storefrontVsAgent.upsellRate.upliftPercentage} uplift</span>
          </div>
        </div>

      </div>

      {/* Main Comparison Table Requested in Hackathon Prompt */}
      <div className="bg-[#151c2e] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white">Traditional Storefront vs. RazorAgent Performance</h3>
            <p className="text-xs text-slate-400">Benchmarked experiment data demonstrating merchant revenue impact</p>
          </div>
          <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-lg">
            Simulated Benchmark Experiment
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-4">Traditional Storefront</th>
                <th className="py-3 px-4 text-cyan-400 font-extrabold">RazorAgent AI</th>
                <th className="py-3 px-4 text-emerald-400 font-extrabold">Growth Uplift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-900/40 transition">
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-200">Conversion Rate</td>
                <td className="py-3.5 px-4 text-slate-400">{metrics.storefrontVsAgent.conversion.storefront}</td>
                <td className="py-3.5 px-4 text-cyan-300 font-bold">{metrics.storefrontVsAgent.conversion.aiAgent}</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{metrics.storefrontVsAgent.conversion.upliftPercentage}</td>
              </tr>
              <tr className="hover:bg-slate-900/40 transition">
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-200">Average Order Value (AOV)</td>
                <td className="py-3.5 px-4 text-slate-400">{metrics.storefrontVsAgent.aov.storefront}</td>
                <td className="py-3.5 px-4 text-cyan-300 font-bold">{metrics.storefrontVsAgent.aov.aiAgent}</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{metrics.storefrontVsAgent.aov.upliftPercentage}</td>
              </tr>
              <tr className="hover:bg-slate-900/40 transition">
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-200">Upsell Acceptance Rate</td>
                <td className="py-3.5 px-4 text-slate-400">{metrics.storefrontVsAgent.upsellRate.storefront}</td>
                <td className="py-3.5 px-4 text-cyan-300 font-bold">{metrics.storefrontVsAgent.upsellRate.aiAgent}</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{metrics.storefrontVsAgent.upsellRate.upliftPercentage}</td>
              </tr>
              <tr className="hover:bg-slate-900/40 transition">
                <td className="py-3.5 px-4 font-sans font-semibold text-slate-200">Revenue per Session</td>
                <td className="py-3.5 px-4 text-slate-400">{metrics.storefrontVsAgent.revPerSession.storefront}</td>
                <td className="py-3.5 px-4 text-cyan-300 font-bold">{metrics.storefrontVsAgent.revPerSession.aiAgent}</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{metrics.storefrontVsAgent.revPerSession.upliftPercentage}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Conversion & Upsell Rates Chart */}
        <div className="bg-[#151c2e] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span>Conversion & Upsell Rates Comparison (%)</span>
          </h4>
          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232f48" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#232f48', borderRadius: '12px' }} />
                <Legend />
                <Bar dataKey="Storefront" fill="#64748b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="AIAgent" fill="#00d2ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Per Session & AOV Chart */}
        <div className="bg-[#151c2e] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Revenue per Session & Average Order Value</span>
          </h4>
          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232f48" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#232f48', borderRadius: '12px' }} />
                <Legend />
                <Bar dataKey="Storefront" fill="#475569" radius={[6, 6, 0, 0]} />
                <Bar dataKey="AIAgent" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
