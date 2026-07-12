import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CARBON_TRANSACTIONS, SUSTAINABILITY_GOALS } from '@/data/mock';
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Environmental Dashboard</h2>
            <p className="text-zinc-400 text-sm mt-1">Track emissions, energy usage, and sustainability goals.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Add Record
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Scope 1 Emissions', value: '4,250', unit: 'tCO2e', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { label: 'Scope 2 Emissions', value: '8,100', unit: 'tCO2e', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
            { label: 'Water Usage', value: '12.5k', unit: 'kL', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Waste Diverted', value: '68', unit: '%', icon: Leaf, color: 'text-green-500', bg: 'bg-green-500/10' },
          ].map((stat, i) => (
            <motion.div key={i} variants={item}>
              <Card className="bg-card border-card-border">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {stat.value} <span className="text-sm font-normal text-zinc-500">{stat.unit}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="bg-card border border-border p-1">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Transactions</TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Goals</TabsTrigger>
            <TabsTrigger value="factors" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Emission Factors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="mt-6">
            <Card className="bg-card border-card-border">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-semibold">Carbon Transactions Log</CardTitle>
                <button className="p-2 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-400 uppercase border-b border-card-border bg-zinc-900/50">
                      <tr>
                        <th className="px-4 py-3 font-medium rounded-tl-md">Transaction ID</th>
                        <th className="px-4 py-3 font-medium">Fuel Type</th>
                        <th className="px-4 py-3 font-medium">Department</th>
                        <th className="px-4 py-3 font-medium">Progress to Limit</th>
                        <th className="px-4 py-3 font-medium">Deadline</th>
                        <th className="px-4 py-3 font-medium rounded-tr-md">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CARBON_TRANSACTIONS.map((tx) => (
                        <tr key={tx.id} className="border-b border-card-border/50 hover:bg-zinc-800/30 transition-colors group">
                          <td className="px-4 py-4 font-mono text-xs text-zinc-500">{tx.id.toUpperCase()}</td>
                          <td className="px-4 py-4 font-medium text-zinc-200">{tx.fuelType}</td>
                          <td className="px-4 py-4 text-zinc-400">{tx.department}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">{tx.current.toLocaleString()} / {tx.target.toLocaleString()}</span>
                                <span className="font-medium text-zinc-300">{tx.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${tx.progress > 100 ? 'bg-red-500' : tx.progress > 80 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                  style={{ width: `${Math.min(tx.progress, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-zinc-400">{tx.deadline}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              tx.status === 'On Track' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              tx.status === 'At Risk' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUSTAINABILITY_GOALS.map((goal) => (
                <Card key={goal.id} className="bg-card border-card-border hover:border-green-500/50 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 text-zinc-100">{goal.title}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Current: <span className="text-white font-medium">{goal.current}</span></span>
                        <span className="text-zinc-400">Target: <span className="text-white font-medium">{goal.target}</span></span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all duration-1000" 
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-2 text-zinc-500">
                        <span>{goal.progress}% Complete</span>
                        <span>{goal.unit}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="factors" className="mt-6">
            <Card className="bg-card border-card-border p-8 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <Leaf className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-300">Emission Factors Configuration</h3>
                <p className="text-zinc-500 mt-2 max-w-sm">Manage global conversion factors used to calculate CO2e from your activity data.</p>
                <button className="mt-6 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm font-medium transition-colors">
                  Manage Factors
                </button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}
