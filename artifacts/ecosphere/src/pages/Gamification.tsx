import { AppLayout } from '@/components/layout/AppLayout';
import { CHALLENGES, BADGES, LEADERBOARD, REWARDS } from '@/data/mock';
import { motion } from 'framer-motion';
import { Gamepad2, Award, Gift, Trophy, Star, ChevronRight, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Gamification() {
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
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Gamification & Rewards</h2>
            <p className="text-gray-500 text-sm mt-1">Engage employees with challenges, leaderboards, and rewards.</p>
          </div>
          <div className="flex items-center gap-3 bg-violet-50 px-5 py-2.5 rounded-full border border-violet-200 shadow-sm">
            <Zap className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-bold text-violet-800">Company Total: 45,200 XP</span>
          </div>
        </div>

        <Tabs defaultValue="challenges" className="w-full mt-8">
          <TabsList className="bg-gray-100 rounded-xl p-1 inline-flex">
            <TabsTrigger value="challenges" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#7c3aed] data-[state=active]:shadow-sm transition-all">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#7c3aed] data-[state=active]:shadow-sm transition-all">Leaderboard</TabsTrigger>
            <TabsTrigger value="badges" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#7c3aed] data-[state=active]:shadow-sm transition-all">Badges</TabsTrigger>
            <TabsTrigger value="rewards" className="rounded-lg px-4 py-1.5 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#7c3aed] data-[state=active]:shadow-sm transition-all">Rewards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="challenges" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              {['Draft', 'Active', 'Under Review', 'Completed'].map((column) => (
                <div key={column} className="bg-gray-50/80 rounded-[16px] p-4 border border-gray-100 min-h-[400px]">
                  <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-4 px-1 flex justify-between items-center">
                    {column}
                    <span className="bg-white text-gray-500 px-2 py-0.5 rounded-full text-[10px] shadow-sm border border-gray-100">
                      {CHALLENGES.filter(c => c.status === column).length}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {CHALLENGES.filter(c => c.status === column).map((challenge) => (
                      <div key={challenge.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-grab hover:shadow-md hover:border-violet-200 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 text-sm leading-tight pr-2">{challenge.title}</h4>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-100 shrink-0">
                            <Star className="w-3 h-3" /> {challenge.points}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-gray-500 leading-relaxed mb-4">{challenge.description}</p>
                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                          <div className="flex -space-x-1.5">
                            {[1,2].map((j) => (
                              <div key={j} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-500">
                                U{j}
                              </div>
                            ))}
                          </div>
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">12 joined</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-violet-50 to-purple-50 flex items-end p-6 border-b border-violet-100 relative overflow-hidden">
                <Trophy className="absolute right-8 -bottom-10 w-48 h-48 text-violet-500/10" />
                <h3 className="text-xl font-bold text-violet-900 relative z-10">Global Leaderboard</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em] bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 w-24 text-center">Rank</th>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4 text-right">Total XP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {LEADERBOARD.map((user, index) => (
                      <tr key={user.name} className="hover:bg-violet-50/30 transition-colors bg-white">
                        <td className="px-6 py-4 text-center">
                          {index === 0 ? <span className="inline-flex w-8 h-8 rounded-full bg-amber-100 text-amber-600 items-center justify-center font-bold border border-amber-200 shadow-sm">1</span> :
                           index === 1 ? <span className="inline-flex w-8 h-8 rounded-full bg-gray-100 text-gray-500 items-center justify-center font-bold border border-gray-200 shadow-sm">2</span> :
                           index === 2 ? <span className="inline-flex w-8 h-8 rounded-full bg-orange-100 text-orange-700 items-center justify-center font-bold border border-orange-200 shadow-sm">3</span> :
                           <span className="text-gray-400 font-bold">{user.rank}</span>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${
                              index < 3 ? 'bg-violet-100 text-violet-700 border-violet-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}>
                              {user.avatar}
                            </div>
                            <span className="font-bold text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">{user.department}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-mono font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-lg border border-violet-100">{user.xp.toLocaleString()} XP</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {BADGES.map((badge, i) => (
                <motion.div key={badge.id} variants={item} custom={i}>
                  <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] p-8 text-center hover:-translate-y-1 transition-transform duration-300 cursor-pointer group border border-transparent hover:border-violet-100">
                    <div className="w-20 h-20 mx-auto rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow-md">
                      <Award className="w-10 h-10 text-violet-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{badge.name}</h3>
                    <p className="text-xs font-medium text-gray-500 mb-5 leading-relaxed">{badge.description}</p>
                    <div className="inline-flex px-3 py-1.5 rounded-lg bg-gray-50 text-xs font-mono font-semibold text-gray-500 border border-gray-100">
                      Unlocks at {badge.xp} XP
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {REWARDS.map((reward, i) => (
                <motion.div key={reward.id} variants={item} custom={i}>
                  <div className="bg-white rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full hover:border-violet-200 transition-colors border border-transparent">
                    <div className="h-40 bg-gray-50 flex items-center justify-center border-b border-gray-100">
                      <Gift className="w-12 h-12 text-gray-300" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-900 mb-2 leading-tight">{reward.name}</h3>
                      <div className="text-violet-600 font-mono font-bold text-sm mb-6">{reward.pts.toLocaleString()} Points</div>
                      <button className="mt-auto w-full py-2.5 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-sm font-semibold text-white transition-colors shadow-sm">
                        Redeem Reward
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}