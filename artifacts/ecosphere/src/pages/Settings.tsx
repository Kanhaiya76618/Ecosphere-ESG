import { AppLayout } from '@/components/layout/AppLayout';
import { DEPARTMENTS } from '@/data/mock';
import { motion } from 'framer-motion';
import { Building2, Bell, Shield, Database, Plus, Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
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
        className="max-w-5xl mx-auto space-y-8"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h2>
          <p className="text-gray-500 text-sm mt-1">Configure application defaults, organizational structure, and integrations.</p>
        </div>

        <Tabs defaultValue="departments" className="w-full flex flex-col md:flex-row gap-8">
          <TabsList className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-2 flex flex-col h-auto gap-1 items-stretch w-full md:w-64 shrink-0 border border-gray-100">
            <TabsTrigger value="departments" className="justify-start px-4 py-3 data-[state=active]:bg-green-50 data-[state=active]:text-[#166534] text-gray-600 rounded-xl transition-colors font-semibold text-sm">
              <Building2 className="w-4 h-4 mr-3" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="notifications" className="justify-start px-4 py-3 data-[state=active]:bg-green-50 data-[state=active]:text-[#166534] text-gray-600 rounded-xl transition-colors font-semibold text-sm">
              <Bell className="w-4 h-4 mr-3" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="justify-start px-4 py-3 data-[state=active]:bg-green-50 data-[state=active]:text-[#166534] text-gray-600 rounded-xl transition-colors font-semibold text-sm">
              <Shield className="w-4 h-4 mr-3" />
              Security
            </TabsTrigger>
            <TabsTrigger value="integrations" className="justify-start px-4 py-3 data-[state=active]:bg-green-50 data-[state=active]:text-[#166534] text-gray-600 rounded-xl transition-colors font-semibold text-sm">
              <Database className="w-4 h-4 mr-3" />
              Integrations
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 min-w-0">
            <TabsContent value="departments" className="m-0 focus:outline-none">
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Organizational Structure</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage departments and heads for accurate ESG reporting.</p>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 rounded-lg text-sm font-semibold transition-colors shadow-sm shrink-0">
                    <Plus className="w-4 h-4" />
                    Add Dept
                  </button>
                </div>
                <div className="overflow-x-auto p-6">
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em] bg-gray-50/80 border-b border-gray-100">
                        <tr>
                          <th className="px-5 py-4">Name</th>
                          <th className="px-5 py-4">Code</th>
                          <th className="px-5 py-4">Head</th>
                          <th className="px-5 py-4 text-right">Employees</th>
                          <th className="px-5 py-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {DEPARTMENTS.map((dept) => (
                          <tr key={dept.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4 font-bold text-gray-900">{dept.name}</td>
                            <td className="px-5 py-4 font-mono font-medium text-gray-500 text-xs">{dept.code}</td>
                            <td className="px-5 py-4 text-gray-600 font-medium">{dept.head}</td>
                            <td className="px-5 py-4 text-right text-gray-600 font-medium">{dept.employees}</td>
                            <td className="px-5 py-4 text-right">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-green-50 text-green-700 border border-green-200">
                                {dept.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="m-0 focus:outline-none">
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Alert Preferences</h3>
                  <p className="text-sm text-gray-500 mt-1">Choose what you want to be notified about.</p>
                </div>
                <div className="p-6 space-y-6">
                  {[
                    { title: 'Weekly ESG Digest', desc: 'Summary of company performance every Monday morning.' },
                    { title: 'Goal At Risk Alerts', desc: 'Immediate notification when a sustainability goal falls behind schedule.' },
                    { title: 'New Compliance Issues', desc: 'Alert when high-severity compliance issues are logged.' },
                    { title: 'Gamification Approvals', desc: 'Daily digest of pending employee CSR proofs.' },
                  ].map((setting, i) => (
                    <div key={i} className="flex items-start justify-between gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{setting.title}</p>
                          <p className="text-sm font-medium text-gray-500 mt-1 leading-relaxed">{setting.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-2">
                        <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#166534]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="m-0 focus:outline-none">
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] h-64 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                  <Shield className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Managed Externally</h3>
                <p className="text-gray-500 max-w-sm text-sm leading-relaxed">Security settings and access control are managed by your SSO provider.</p>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="m-0 focus:outline-none">
              <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] h-64 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                  <Database className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-500 max-w-sm text-sm leading-relaxed">API Keys and webhooks configuration are currently under development.</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}