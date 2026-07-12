import { AppLayout } from '@/app/AppLayout';
import { POLICIES, AUDITS, COMPLIANCE_ISSUES } from './data';
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Governance & Compliance</h2>
            <p className="text-gray-500 text-sm mt-1">Monitor corporate policies, manage audits, and resolve compliance issues.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#b45309] hover:bg-amber-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <AlertTriangle className="w-4 h-4" />
            Report Issue
          </button>
        </div>

        <Tabs defaultValue="issues" className="w-full mt-8">
          <TabsList className="bg-gray-100 rounded-xl p-1 inline-flex">
            <TabsTrigger value="issues" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#b45309] data-[state=active]:shadow-sm transition-all">Compliance Issues</TabsTrigger>
            <TabsTrigger value="policies" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#b45309] data-[state=active]:shadow-sm transition-all">Policies</TabsTrigger>
            <TabsTrigger value="audits" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#b45309] data-[state=active]:shadow-sm transition-all">Audits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="issues" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] h-full">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Active Compliance Issues</h3>
                    <p className="text-sm text-gray-500 mt-1">Items requiring immediate attention or resolution.</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {COMPLIANCE_ISSUES.map((issue, i) => (
                      <motion.div key={issue.id} variants={item} custom={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:shadow-sm hover:border-amber-200 transition-all gap-4 group">
                        <div className="flex gap-4">
                          <div className="mt-0.5 shrink-0">
                            {issue.severity === 'High' ? <AlertCircle className="w-5 h-5 text-red-600" /> :
                             issue.severity === 'Medium' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
                             <CheckCircle2 className="w-5 h-5 text-gray-400" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{issue.title}</h4>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-medium text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${issue.severity === 'High' ? 'bg-red-500' : issue.severity === 'Medium' ? 'bg-amber-500' : 'bg-gray-400'}`}></span>
                                {issue.severity} Severity
                              </span>
                              <span className="text-gray-300">•</span>
                              <span>{issue.department}</span>
                              <span className="text-gray-300">•</span>
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Due {issue.dueDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            issue.status === 'Open' ? 'bg-red-50 text-red-700 border-red-200' :
                            issue.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {issue.status}
                          </span>
                          <button className="text-sm font-semibold text-[#b45309] hover:text-amber-800 transition-colors">Review</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] h-full flex flex-col">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Governance Health</h3>
                  </div>
                  <div className="p-6 space-y-7 flex-1">
                    <div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-600 font-medium">Policy Acceptance Rate</span>
                        <span className="text-gray-900 font-bold">92%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#16a34a] rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-600 font-medium">Training Completion</span>
                        <span className="text-gray-900 font-bold">78%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-600 font-medium">Audit Readiness</span>
                        <span className="text-gray-900 font-bold">65%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>

                    <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl mt-8">
                      <div className="flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-bold text-amber-800">Action Required</h5>
                          <p className="text-xs font-medium text-amber-700/80 mt-1.5 leading-relaxed">Vendor Code of Conduct policy needs review. Acceptance rate has dropped below 50% threshold.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="policies" className="mt-6">
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em] bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Policy Name</th>
                    <th className="px-6 py-4">Version / Updated</th>
                    <th className="px-6 py-4">Acceptance Rate</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {POLICIES.map((policy) => (
                    <tr key={policy.id} className="hover:bg-amber-50/50 transition-colors bg-white group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                            <FileCheck className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-gray-900">{policy.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {policy.version} <span className="text-gray-400 font-normal ml-2">({policy.updated})</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 max-w-[140px]">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${policy.acceptance < 80 ? 'bg-amber-500' : 'bg-[#16a34a]'}`} 
                              style={{ width: `${policy.acceptance}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-700 w-8">{policy.acceptance}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          policy.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#b45309] hover:text-amber-800 font-bold text-xs uppercase tracking-wider">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="audits" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {AUDITS.map((audit) => (
                <div key={audit.id} className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-6 border border-transparent hover:border-amber-100 transition-colors">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-base font-bold text-gray-900">{audit.title}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                      audit.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                      audit.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {audit.status}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Date</span>
                      <span className="text-gray-900 font-semibold">{audit.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Auditor</span>
                      <span className="text-gray-900 font-semibold">{audit.auditor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Score</span>
                      <span className="font-bold text-gray-900">{audit.score}</span>
                    </div>
                    
                    <button className="w-full mt-4 py-2.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors shadow-sm">
                      View Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}