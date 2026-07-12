import { AppLayout } from '@/app/AppLayout';
import { DASHBOARD_TREND, DEPARTMENTS, CARBON_TRANSACTIONS } from './data';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Leaf, Users, ShieldCheck, TrendingUp, Plus, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const overallScore = 81;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <AppLayout>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* HERO BANNER */}
        <motion.div variants={item} className="bg-gradient-to-r from-[#F0FBF4] to-[#E8F5EE] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight">Good morning, Sarah</h1>
            <p className="text-gray-500">Here is your ESG performance summary for July 12, 2026.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Background ring */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="40" stroke="#E8EDE6" strokeWidth="8" fill="none" />
                <circle 
                  cx="64" cy="64" r="40" 
                  stroke="#166534" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeLinecap="round"
                  style={{ strokeDasharray: circumference, strokeDashoffset }}
                />
              </svg>
              <div className="text-center z-10 flex items-baseline">
                <span className="text-3xl font-bold text-[#166534]">81</span>
                <span className="text-gray-400 font-medium">/100</span>
              </div>
            </div>
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mt-2">Overall ESG</span>
          </div>
        </motion.div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={item}>
            <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[#16a34a]/10 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-[#16a34a]" />
                </div>
                <h3 className="text-[11px] uppercase tracking-[0.08em] font-medium text-gray-500">Environmental</h3>
              </div>
              <div className="flex items-end justify-between mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#16a34a]">82</span>
                  <span className="text-xl text-gray-300 font-medium">/100</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#16a34a] rounded-full" style={{ width: '82%' }}></div>
                </div>
                <div className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  +2.4%
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[#be185d]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#be185d]" />
                </div>
                <h3 className="text-[11px] uppercase tracking-[0.08em] font-medium text-gray-500">Social</h3>
              </div>
              <div className="flex items-end justify-between mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#be185d]">74</span>
                  <span className="text-xl text-gray-300 font-medium">/100</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#be185d] rounded-full" style={{ width: '74%' }}></div>
                </div>
                <div className="flex items-center text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full shrink-0">
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                  -1.2%
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[#b45309]/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#b45309]" />
                </div>
                <h3 className="text-[11px] uppercase tracking-[0.08em] font-medium text-gray-500">Governance</h3>
              </div>
              <div className="flex items-end justify-between mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#b45309]">88</span>
                  <span className="text-xl text-gray-300 font-medium">/100</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#b45309] rounded-full" style={{ width: '88%' }}></div>
                </div>
                <div className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  +0.8%
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="bg-white rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[#166534]/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#166534]" />
                </div>
                <h3 className="text-[11px] uppercase tracking-[0.08em] font-medium text-gray-500">Overall</h3>
              </div>
              <div className="flex items-end justify-between mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#166534]">81</span>
                  <span className="text-xl text-gray-300 font-medium">/100</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#166534] rounded-full" style={{ width: '81%' }}></div>
                </div>
                <div className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  +1.5%
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2">
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] h-full flex flex-col p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#111827]">ESG Score Trend</h3>
                <p className="text-sm text-gray-500 mt-1">Company-wide aggregated score progression over 12 months</p>
              </div>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DASHBOARD_TREND} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="esgGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                    <XAxis dataKey="month" stroke="transparent" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #E8EDE6', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                      itemStyle={{ color: '#111827', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#16a34a" strokeWidth={2.5} fillOpacity={1} fill="url(#esgGradient)" activeDot={{ r: 4, fill: '#16a34a', strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] h-full flex flex-col p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#111827]">Department ESG</h3>
                <p className="text-sm text-gray-500 mt-1">Current compliance by unit</p>
              </div>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DEPARTMENTS} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 30 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="code" type="category" stroke="transparent" tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#F9FAF9' }}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #E8EDE6', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                    />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
                      {DEPARTMENTS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score > 85 ? '#16a34a' : entry.score > 75 ? '#84cc16' : '#fbbf24'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2">
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-[#111827]">Recent Carbon Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase tracking-wider bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 font-medium">Fuel Type</th>
                      <th className="px-6 py-4 font-medium">Department</th>
                      <th className="px-6 py-4 font-medium">Usage</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {CARBON_TRANSACTIONS.slice(0, 4).map((tx) => (
                      <tr key={tx.id} className="bg-white hover:bg-green-50/80 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{tx.fuelType}</td>
                        <td className="px-6 py-4 text-gray-500">{tx.department}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${tx.progress > 100 ? 'bg-red-500' : tx.progress > 80 ? 'bg-amber-500' : 'bg-[#16a34a]'}`} 
                                style={{ width: `${Math.min(tx.progress, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-500">{tx.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            tx.status === 'On Track' ? 'bg-green-50 text-green-700 border-green-200' :
                            tx.status === 'At Risk' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-6 h-full">
              <h3 className="text-lg font-bold text-[#111827] mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm hover:border-green-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-green-50 text-[#16a34a] flex items-center justify-center group-hover:bg-[#16a34a] group-hover:text-white transition-colors">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">Add Carbon Transaction</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm hover:border-blue-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-[#0284c7] flex items-center justify-center group-hover:bg-[#0284c7] group-hover:text-white transition-colors">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">New CSR Activity</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm hover:border-amber-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-amber-50 text-[#b45309] flex items-center justify-center group-hover:bg-[#b45309] group-hover:text-white transition-colors">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">Log Compliance Issue</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm hover:border-teal-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-teal-50 text-[#0f766e] flex items-center justify-center group-hover:bg-[#0f766e] group-hover:text-white transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">View Latest Report</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}