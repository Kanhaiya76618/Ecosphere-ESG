import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CSR_ACTIVITIES, EMPLOYEE_APPROVALS } from '@/data/mock';
import { motion } from 'framer-motion';
import { Users, Heart, Check, X, Calendar, MapPin, Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Social() {
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
            <h2 className="text-2xl font-bold text-white tracking-tight">Social & CSR</h2>
            <p className="text-zinc-400 text-sm mt-1">Manage corporate social responsibility initiatives and employee engagement.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">
            <Heart className="w-4 h-4" />
            Create Campaign
          </button>
        </div>

        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="bg-card border border-border p-1">
            <TabsTrigger value="activities" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">CSR Activities</TabsTrigger>
            <TabsTrigger value="approvals" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex gap-2 items-center">
              Approvals 
              <span className="bg-blue-500/20 text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full">4</span>
            </TabsTrigger>
            <TabsTrigger value="diversity" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Diversity & Inclusion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activities" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CSR_ACTIVITIES.map((activity, i) => (
                <motion.div key={activity.id} variants={item} custom={i}>
                  <Card className="bg-card border-card-border overflow-hidden hover:border-blue-500/50 transition-colors group">
                    <div className="h-32 bg-zinc-900 border-b border-card-border relative p-4 flex items-start justify-end">
                      {/* Decorative pattern for the header area */}
                      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                      
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium relative z-10 shadow-sm backdrop-blur-md ${
                        activity.status === 'Active' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        activity.status === 'Completed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        'bg-zinc-800/80 text-zinc-300 border border-zinc-700/50'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{activity.title}</h3>
                      
                      <div className="flex flex-col gap-2 mt-4 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-zinc-500" />
                          <span>{activity.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-zinc-500" />
                          <span>{activity.participants} Participants Confirmed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-500" />
                          <span className="text-blue-400 font-medium">{activity.points} Points available</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-card-border flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {[1,2,3].map((j) => (
                            <div key={j} className="w-8 h-8 rounded-full border-2 border-card bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-400">
                              U{j}
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-full border-2 border-card bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-medium">
                            +{activity.participants - 3}
                          </div>
                        </div>
                        <button className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
                          View Details
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approvals" className="mt-6">
            <Card className="bg-card border-card-border">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Employee Submission Queue</CardTitle>
                <CardDescription>Review proof of participation in sustainability challenges to award points.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-400 uppercase border-b border-card-border bg-zinc-900/50">
                      <tr>
                        <th className="px-4 py-3 font-medium">Employee</th>
                        <th className="px-4 py-3 font-medium">Challenge</th>
                        <th className="px-4 py-3 font-medium">Proof Attachment</th>
                        <th className="px-4 py-3 font-medium">Points</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {EMPLOYEE_APPROVALS.map((approval) => (
                        <tr key={approval.id} className="border-b border-card-border/50 hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                                {approval.employee.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-medium text-zinc-200">{approval.employee}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-zinc-400">{approval.challenge}</td>
                          <td className="px-4 py-4">
                            <a href="#" className="text-blue-400 hover:underline flex items-center gap-1.5 text-xs">
                              <MapPin className="w-3 h-3" />
                              {approval.proof}
                            </a>
                          </td>
                          <td className="px-4 py-4 font-mono text-zinc-300">{approval.points} XP</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              approval.status === 'Approved' ? 'bg-green-500/10 text-green-400' :
                              approval.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                              'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {approval.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            {approval.status === 'Pending' && (
                              <div className="flex items-center justify-end gap-2">
                                <button className="p-1.5 text-green-500 hover:bg-green-500/20 rounded-md transition-colors" title="Approve">
                                  <Check className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-red-500 hover:bg-red-500/20 rounded-md transition-colors" title="Reject">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="diversity" className="mt-6">
            <Card className="bg-card border-card-border p-12 flex flex-col items-center justify-center text-center">
              <Users className="w-16 h-16 text-zinc-700 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Diversity Metrics Dashboard</h3>
              <p className="text-zinc-400 max-w-md">Connect your HRIS (Workday, BambooHR) to automatically populate diversity, equity, and inclusion analytics.</p>
              <button className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">
                Connect HRIS Integration
              </button>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}
