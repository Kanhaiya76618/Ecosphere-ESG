import { AppLayout } from '@/app/AppLayout';
import { CARBON_TRANSACTIONS, SUSTAINABILITY_GOALS } from './data';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Zap, Flame, Plus, Filter, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Environmental() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AppLayout>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Environmental Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">Track emissions, energy usage, and sustainability goals.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#166534] hover:bg-green-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Add Record
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Scope 1 Emissions', value: '4,250', unit: 'tCO2e', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Scope 2 Emissions', value: '8,100', unit: 'tCO2e', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Water Usage', value: '12.5k', unit: 'kL', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Waste Diverted', value: '68', unit: '%', icon: Leaf, color: 'text-[#16a34a]', bg: 'bg-green-50' },
          ].map((stat, i) => (
            <motion.div key={i} variants={item}>
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value} <span className="text-sm font-medium text-gray-400">{stat.unit}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="transactions" className="w-full mt-8">
          <TabsList className="bg-gray-100 rounded-xl p-1 inline-flex">
            <TabsTrigger value="transactions" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#166534] data-[state=active]:shadow-sm transition-all">Transactions</TabsTrigger>
            <TabsTrigger value="goals" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#166534] data-[state=active]:shadow-sm transition-all">Goals</TabsTrigger>
            <TabsTrigger value="factors" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#166534] data-[state=active]:shadow-sm transition-all">Emission Factors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="mt-6">
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-row items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Carbon Transactions Log</h3>
                <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em] bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Fuel Type</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Progress to Limit</th>
                      <th className="px-6 py-4">Deadline</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {CARBON_TRANSACTIONS.map((tx) => (
                      <tr key={tx.id} className="hover:bg-green-50/80 transition-colors bg-white group">
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{tx.id.toUpperCase()}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{tx.fuelType}</td>
                        <td className="px-6 py-4 text-gray-600">{tx.department}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5 w-48">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">{tx.current.toLocaleString()} / {tx.target.toLocaleString()}</span>
                              <span className="font-semibold text-gray-700">{tx.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${tx.progress > 100 ? 'bg-red-500' : tx.progress > 80 ? 'bg-amber-500' : 'bg-[#16a34a]'}`} 
                                style={{ width: `${Math.min(tx.progress, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{tx.deadline}</td>
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
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SUSTAINABILITY_GOALS.map((goal) => (
                <div key={goal.id} className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-6 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-gray-900 mb-6">{goal.title}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current: <span className="text-gray-900 font-semibold">{goal.current}</span></span>
                      <span className="text-gray-500">Target: <span className="text-gray-900 font-semibold">{goal.target}</span></span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#16a34a] rounded-full transition-all duration-1000" 
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
                      <span>{goal.progress}% Complete</span>
                      <span>{goal.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="factors" className="mt-6">
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-12 flex items-center justify-center min-h-[400px]">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-8 h-8 text-[#16a34a]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Emission Factors Configuration</h3>
                <p className="text-gray-500 mt-3 leading-relaxed">Manage global conversion factors used to calculate CO2e from your organizational activity data.</p>
                <button className="mt-8 px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  Manage Factors
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}