import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { POLICIES, AUDITS, COMPLIANCE_ISSUES } from '@/data/mock';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, FileCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Governance() {
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
            <h2 className="text-2xl font-bold text-white tracking-tight">Governance & Compliance</h2>
            <p className="text-zinc-400 text-sm mt-1">Monitor corporate policies, manage audits, and resolve compliance issues.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition-colors">
            <AlertTriangle className="w-4 h-4" />
            Report Issue
          </button>
        </div>

        <Tabs defaultValue="issues" className="w-full">
          <TabsList className="bg-card border border-border p-1">
            <TabsTrigger value="issues" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">Compliance Issues</TabsTrigger>
            <TabsTrigger value="policies" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">Policies</TabsTrigger>
            <TabsTrigger value="audits" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">Audits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="issues" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-card border-card-border h-full">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Active Compliance Issues</CardTitle>
                    <CardDescription>Items requiring immediate attention or resolution.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {COMPLIANCE_ISSUES.map((issue, i) => (
                        <motion.div key={issue.id} variants={item} custom={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-card-border bg-background hover:bg-zinc-800/50 transition-colors gap-4">
                          <div className="flex gap-4">
                            <div className="mt-1 shrink-0">
                              {issue.severity === 'High' ? <AlertCircle className="w-5 h-5 text-red-500" /> :
                               issue.severity === 'Medium' ? <AlertTriangle className="w-5 h-5 text-orange-500" /> :
                               <CheckCircle2 className="w-5 h-5 text-zinc-500" />}
                            </div>
                            <div>
                              <h4 className="font-medium text-zinc-200">{issue.title}</h4>
                              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-zinc-400">
                                <span className="flex items-center gap-1">
                                  <span className={`w-2 h-2 rounded-full ${issue.severity === 'High' ? 'bg-red-500' : issue.severity === 'Medium' ? 'bg-orange-500' : 'bg-zinc-500'}`}></span>
                                  {issue.severity} Severity
                                </span>
                                <span>•</span>
                                <span>{issue.department}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due {issue.dueDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                              issue.status === 'Open' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              issue.status === 'Resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              'bg-orange-500/10 text-orange-400 border-orange-500/20'
                            }`}>
                              {issue.status}
                            </span>
                            <button className="text-sm font-medium text-orange-500 hover:text-orange-400">Review</button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="bg-card border-card-border h-full">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Governance Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-zinc-400">Policy Acceptance Rate</span>
                        <span className="text-white font-medium">92%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-zinc-400">Training Completion</span>
                        <span className="text-white font-medium">78%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-zinc-400">Audit Readiness</span>
                        <span className="text-white font-medium">65%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg mt-8">
                      <div className="flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                        <div>
                          <h5 className="text-sm font-medium text-orange-400">Action Required</h5>
                          <p className="text-xs text-orange-400/80 mt-1">Vendor Code of Conduct policy needs review. Acceptance rate has dropped below 50% threshold.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="policies" className="mt-6">
            <Card className="bg-card border-card-border">
              <CardContent className="p-0">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-400 uppercase border-b border-card-border bg-zinc-900/50">
                    <tr>
                      <th className="px-6 py-4 font-medium">Policy Name</th>
                      <th className="px-6 py-4 font-medium">Version / Updated</th>
                      <th className="px-6 py-4 font-medium">Acceptance Rate</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {POLICIES.map((policy) => (
                      <tr key={policy.id} className="border-b border-card-border/50 hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <FileCheck className="w-4 h-4 text-zinc-500" />
                          <span className="font-medium text-zinc-200">{policy.title}</span>
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                          {policy.version} <span className="text-zinc-600 ml-2">({policy.updated})</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 max-w-[120px]">
                            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${policy.acceptance < 80 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                style={{ width: `${policy.acceptance}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-zinc-400">{policy.acceptance}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            policy.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                          }`}>
                            {policy.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-orange-500 hover:text-orange-400 font-medium text-xs uppercase tracking-wider">Manage</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audits" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {AUDITS.map((audit) => (
                <Card key={audit.id} className="bg-card border-card-border">
                  <CardHeader className="pb-3 border-b border-card-border/50">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-semibold">{audit.title}</CardTitle>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        audit.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        audit.status === 'In Progress' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                        'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}>
                        {audit.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Date</span>
                      <span className="text-zinc-200">{audit.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Auditor</span>
                      <span className="text-zinc-200">{audit.auditor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Score</span>
                      <span className="font-bold text-white">{audit.score}</span>
                    </div>
                    
                    <button className="w-full py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition-colors text-white mt-2">
                      View Report
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}
