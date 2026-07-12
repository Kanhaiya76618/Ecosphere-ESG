import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
        className="max-w-5xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Settings</h2>
            <p className="text-zinc-400 text-sm mt-1">Configure application defaults, organizational structure, and integrations.</p>
          </div>
        </div>

        <Tabs defaultValue="departments" className="w-full flex flex-col md:flex-row gap-6">
          <TabsList className="bg-transparent border-none flex flex-col h-auto p-0 gap-2 items-stretch w-full md:w-64 shrink-0">
            <TabsTrigger value="departments" className="justify-start px-4 py-3 bg-card data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg border border-transparent data-[state=active]:border-border hover:bg-zinc-800/50 transition-colors">
              <Building2 className="w-4 h-4 mr-3" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="notifications" className="justify-start px-4 py-3 bg-card data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg border border-transparent data-[state=active]:border-border hover:bg-zinc-800/50 transition-colors">
              <Bell className="w-4 h-4 mr-3" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="justify-start px-4 py-3 bg-card data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg border border-transparent data-[state=active]:border-border hover:bg-zinc-800/50 transition-colors">
              <Shield className="w-4 h-4 mr-3" />
              Security
            </TabsTrigger>
            <TabsTrigger value="integrations" className="justify-start px-4 py-3 bg-card data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg border border-transparent data-[state=active]:border-border hover:bg-zinc-800/50 transition-colors">
              <Database className="w-4 h-4 mr-3" />
              Integrations
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 min-w-0">
            <TabsContent value="departments" className="m-0">
              <Card className="bg-card border-card-border shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-base font-semibold">Organizational Structure</CardTitle>
                    <CardDescription>Manage departments and heads for accurate ESG reporting.</CardDescription>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-md text-sm font-medium transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Dept
                  </button>
                </CardHeader>
                <CardContent>
                  <div className="border border-card-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-card-border">
                        <tr>
                          <th className="px-4 py-3 font-medium">Name</th>
                          <th className="px-4 py-3 font-medium">Code</th>
                          <th className="px-4 py-3 font-medium">Head</th>
                          <th className="px-4 py-3 font-medium text-right">Employees</th>
                          <th className="px-4 py-3 font-medium text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-card-border/50">
                        {DEPARTMENTS.map((dept) => (
                          <tr key={dept.id} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="px-4 py-3 font-medium text-zinc-200">{dept.name}</td>
                            <td className="px-4 py-3 font-mono text-zinc-500 text-xs">{dept.code}</td>
                            <td className="px-4 py-3 text-zinc-400">{dept.head}</td>
                            <td className="px-4 py-3 text-right text-zinc-400">{dept.employees}</td>
                            <td className="px-4 py-3 text-right">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-green-500/10 text-green-400 border border-green-500/20">
                                {dept.status}
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

            <TabsContent value="notifications" className="m-0 space-y-4">
              <Card className="bg-card border-card-border shadow-md">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Alert Preferences</CardTitle>
                  <CardDescription>Choose what you want to be notified about.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { title: 'Weekly ESG Digest', desc: 'Summary of company performance every Monday morning.' },
                    { title: 'Goal At Risk Alerts', desc: 'Immediate notification when a sustainability goal falls behind schedule.' },
                    { title: 'New Compliance Issues', desc: 'Alert when high-severity compliance issues are logged.' },
                    { title: 'Gamification Approvals', desc: 'Daily digest of pending employee CSR proofs.' },
                  ].map((setting, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 pb-6 border-b border-card-border last:border-0 last:pb-0">
                      <div className="flex gap-4">
                        <Mail className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-zinc-200 text-sm">{setting.title}</p>
                          <p className="text-sm text-zinc-500 mt-1">{setting.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                        <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="m-0">
              <Card className="bg-card border-card-border shadow-md h-64 flex items-center justify-center">
                <div className="text-center text-zinc-500">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Security settings are managed by your SSO provider.</p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="m-0">
              <Card className="bg-card border-card-border shadow-md h-64 flex items-center justify-center">
                <div className="text-center text-zinc-500">
                  <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>API Keys and webhooks configuration coming soon.</p>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}
