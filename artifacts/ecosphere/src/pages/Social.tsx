import { AppLayout } from '@/components/layout/AppLayout';
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Social & CSR</h2>
            <p className="text-gray-500 text-sm mt-1">Manage corporate social responsibility initiatives and employee engagement.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0284c7] hover:bg-sky-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Heart className="w-4 h-4" />
            Create Campaign
          </button>
        </div>

        <Tabs defaultValue="activities" className="w-full mt-8">
          <TabsList className="bg-gray-100 rounded-xl p-1 inline-flex">
            <TabsTrigger value="activities" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#0284c7] data-[state=active]:shadow-sm transition-all">CSR Activities</TabsTrigger>
            <TabsTrigger value="approvals" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#0284c7] data-[state=active]:shadow-sm transition-all flex items-center gap-2">
              Approvals 
              <span className="bg-sky-100 text-sky-700 text-[10px] px-2 py-0.5 rounded-full font-bold">4</span>
            </TabsTrigger>
            <TabsTrigger value="diversity" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#0284c7] data-[state=active]:shadow-sm transition-all">Diversity & Inclusion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activities" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CSR_ACTIVITIES.map((activity, i) => (
                <motion.div key={activity.id} variants={item} custom={i}>
                  <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow group border border-transparent hover:border-sky-100">
                    <div className={`h-2 w-full ${
                      activity.status === 'Active' ? 'bg-[#0284c7]' :
                      activity.status === 'Completed' ? 'bg-[#16a34a]' :
                      'bg-gray-300'
                    }`}></div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          activity.status === 'Active' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                          activity.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-[#0284c7] transition-colors">{activity.title}</h3>
                      
                      <div className="flex flex-col gap-3 text-sm text-gray-600 mb-6 flex-1">
                        <div className="flex items-center gap-2.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{activity.date}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{activity.participants} Participants Confirmed</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Award className="w-4 h-4 text-sky-500" />
                          <span className="text-sky-700 font-medium">{activity.points} Points available</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                        <div className="flex -space-x-2">
                          {[1,2,3].map((j) => (
                            <div key={j} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                              U{j}
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-sky-50 text-sky-700 flex items-center justify-center text-xs font-semibold">
                            +{activity.participants - 3}
                          </div>
                        </div>
                        <button className="text-sm font-semibold text-[#0284c7] hover:text-sky-800 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approvals" className="mt-6">
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Employee Submission Queue</h3>
                <p className="text-sm text-gray-500 mt-1">Review proof of participation in sustainability challenges to award points.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em] bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Challenge</th>
                      <th className="px-6 py-4">Proof Attachment</th>
                      <th className="px-6 py-4">Points</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {EMPLOYEE_APPROVALS.map((approval) => (
                      <tr key={approval.id} className="hover:bg-gray-50/80 transition-colors bg-white">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                              {approval.employee.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-semibold text-gray-900">{approval.employee}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{approval.challenge}</td>
                        <td className="px-6 py-4">
                          <a href="#" className="text-sky-600 hover:text-sky-800 hover:underline flex items-center gap-1.5 font-medium text-xs">
                            <MapPin className="w-3.5 h-3.5" />
                            {approval.proof}
                          </a>
                        </td>
                        <td className="px-6 py-4 font-mono font-medium text-gray-700">{approval.points} XP</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            approval.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                            approval.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {approval.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {approval.status === 'Pending' && (
                            <div className="flex items-center justify-end gap-2">
                              <button className="w-8 h-8 rounded-full flex items-center justify-center text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors border border-gray-200" title="Approve">
                                <Check className="w-4 h-4" />
                              </button>
                              <button className="w-8 h-8 rounded-full flex items-center justify-center text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border border-gray-200" title="Reject">
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
            </div>
          </TabsContent>
          
          <TabsContent value="diversity" className="mt-6">
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-16 flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-20 h-20 bg-sky-50 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-[#0284c7]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Diversity Metrics Dashboard</h3>
              <p className="text-gray-500 max-w-md leading-relaxed">Connect your HRIS (Workday, BambooHR) to automatically populate diversity, equity, and inclusion analytics.</p>
              <button className="mt-8 px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                Connect HRIS Integration
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}