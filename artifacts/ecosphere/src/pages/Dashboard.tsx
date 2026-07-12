import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DASHBOARD_TREND, DEPARTMENTS, CARBON_TRANSACTIONS } from '@/data/mock';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Leaf, Users, ShieldCheck, TrendingUp, Plus, FileText, CheckCircle2 } from 'lucide-react';
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

  return (
    <AppLayout>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={item}>
            <Card className="bg-card border-card-border overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Leaf className="w-16 h-16 text-green-500" />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-zinc-400">Environmental Score</p>
                    <p className="text-3xl font-bold text-green-400">82<span className="text-lg text-zinc-500">/100</span></p>
                  </div>
                  <div className="flex items-center text-sm font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    2.4%
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-card border-card-border overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users className="w-16 h-16 text-blue-500" />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-zinc-400">Social Score</p>
                    <p className="text-3xl font-bold text-blue-400">74<span className="text-lg text-zinc-500">/100</span></p>
                  </div>
                  <div className="flex items-center text-sm font-medium text-red-400 bg-red-500/10 px-2 py-1 rounded-md">
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                    1.2%
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-card border-card-border overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="w-16 h-16 text-orange-500" />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-zinc-400">Governance Score</p>
                    <p className="text-3xl font-bold text-orange-400">88<span className="text-lg text-zinc-500">/100</span></p>
                  </div>
                  <div className="flex items-center text-sm font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    0.8%
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-card border-card-border overflow-hidden relative border-zinc-700">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="w-16 h-16 text-white" />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-zinc-400">Overall ESG Rating</p>
                    <p className="text-3xl font-bold text-white">81<span className="text-lg text-zinc-500">/100</span></p>
                  </div>
                  <div className="flex items-center text-sm font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    1.5%
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="bg-card border-card-border h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-base font-semibold">ESG Score Trend (12 Months)</CardTitle>
                <CardDescription>Company-wide aggregated score progression</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={DASHBOARD_TREND} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-card border-card-border h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Department Ranking</CardTitle>
                <CardDescription>Current ESG compliance by unit</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DEPARTMENTS} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="code" type="category" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#27272a' }}
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                      {DEPARTMENTS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#10b981' : entry.score > 70 ? '#f59e0b' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="bg-card border-card-border">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Recent Carbon Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-400 uppercase border-b border-card-border">
                      <tr>
                        <th className="px-4 py-3 font-medium">Fuel Type</th>
                        <th className="px-4 py-3 font-medium">Department</th>
                        <th className="px-4 py-3 font-medium">Usage</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CARBON_TRANSACTIONS.slice(0, 4).map((tx) => (
                        <tr key={tx.id} className="border-b border-card-border/50 hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-4 font-medium text-zinc-200">{tx.fuelType}</td>
                          <td className="px-4 py-4 text-zinc-400">{tx.department}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${tx.progress > 100 ? 'bg-red-500' : tx.progress > 80 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                  style={{ width: `${Math.min(tx.progress, 100)}%` }}
                                />
                              </div>
                              <span className="text-xs text-zinc-400">{tx.progress}%</span>
                            </div>
                          </td>
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
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-card border-card-border h-full">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-card-border bg-background hover:bg-zinc-800 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-green-500/10 text-green-500 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Add Carbon Transaction</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-card-border bg-background hover:bg-zinc-800 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">New CSR Activity</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-card-border bg-background hover:bg-zinc-800 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Log Compliance Issue</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-card-border bg-background hover:bg-zinc-800 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-teal-500/10 text-teal-500 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">View Latest Report</span>
                  </div>
                </button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
