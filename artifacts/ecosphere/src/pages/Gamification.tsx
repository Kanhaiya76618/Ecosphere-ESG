import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Gamification & Rewards</h2>
            <p className="text-zinc-400 text-sm mt-1">Engage employees with challenges, leaderboards, and rewards.</p>
          </div>
          <div className="flex items-center gap-3 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Company Total: 45,200 XP</span>
          </div>
        </div>

        <Tabs defaultValue="challenges" className="w-full">
          <TabsList className="bg-card border border-border p-1">
            <TabsTrigger value="challenges" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Leaderboard</TabsTrigger>
            <TabsTrigger value="badges" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Badges</TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Rewards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="challenges" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              {['Draft', 'Active', 'Under Review', 'Completed'].map((column) => (
                <div key={column} className="bg-zinc-900/50 rounded-xl p-3 border border-border/50 min-h-[400px]">
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 px-2 flex justify-between items-center">
                    {column}
                    <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-full text-[10px]">
                      {CHALLENGES.filter(c => c.status === column).length}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {CHALLENGES.filter(c => c.status === column).map((challenge) => (
                      <Card key={challenge.id} className="bg-card border-card-border cursor-grab hover:border-purple-500/50 transition-colors">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-zinc-100 text-sm">{challenge.title}</h4>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                              <Star className="w-3 h-3" /> {challenge.points}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 leading-snug">{challenge.description}</p>
                          <div className="pt-3 border-t border-card-border flex justify-between items-center">
                            <div className="flex -space-x-1.5">
                              {[1,2].map((j) => (
                                <div key={j} className="w-5 h-5 rounded-full bg-zinc-700 border border-card"></div>
                              ))}
                            </div>
                            <span className="text-[10px] text-zinc-500">12 joined</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <Card className="bg-card border-card-border overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-purple-900/40 to-card flex items-end p-6 border-b border-card-border relative">
                <Trophy className="absolute right-8 bottom-[-20px] w-48 h-48 text-purple-500/5" />
                <h3 className="text-xl font-bold text-white relative z-10">Global Leaderboard</h3>
              </div>
              <CardContent className="p-0">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-400 uppercase border-b border-card-border bg-zinc-900/30">
                    <tr>
                      <th className="px-6 py-4 font-medium w-24 text-center">Rank</th>
                      <th className="px-6 py-4 font-medium">Employee</th>
                      <th className="px-6 py-4 font-medium">Department</th>
                      <th className="px-6 py-4 font-medium text-right">Total XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LEADERBOARD.map((user, index) => (
                      <tr key={user.name} className="border-b border-card-border/50 hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 text-center">
                          {index === 0 ? <span className="inline-flex w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 items-center justify-center font-bold">1</span> :
                           index === 1 ? <span className="inline-flex w-8 h-8 rounded-full bg-zinc-400/20 text-zinc-400 items-center justify-center font-bold">2</span> :
                           index === 2 ? <span className="inline-flex w-8 h-8 rounded-full bg-orange-700/30 text-orange-600 items-center justify-center font-bold">3</span> :
                           <span className="text-zinc-500 font-medium">{user.rank}</span>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              index < 3 ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {user.avatar}
                            </div>
                            <span className="font-medium text-zinc-200">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-400">{user.department}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-mono text-purple-400 font-medium">{user.xp.toLocaleString()} XP</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {BADGES.map((badge, i) => (
                <motion.div key={badge.id} variants={item} custom={i}>
                  <Card className="bg-card border-card-border text-center hover:-translate-y-1 transition-transform duration-300 cursor-pointer group">
                    <CardContent className="p-8">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]">
                        <Award className="w-10 h-10 text-purple-400" />
                      </div>
                      <h3 className="font-bold text-zinc-100 mb-2">{badge.name}</h3>
                      <p className="text-xs text-zinc-500 mb-4">{badge.description}</p>
                      <div className="inline-flex px-2 py-1 rounded bg-zinc-800 text-xs font-mono text-zinc-400">
                        Unlocks at {badge.xp} XP
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {REWARDS.map((reward, i) => (
                <motion.div key={reward.id} variants={item} custom={i}>
                  <Card className="bg-card border-card-border overflow-hidden flex flex-col h-full hover:border-purple-500/30 transition-colors">
                    <div className="h-40 bg-zinc-900 flex items-center justify-center border-b border-card-border">
                      <Gift className="w-12 h-12 text-zinc-700" />
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <h3 className="font-semibold text-zinc-100 mb-1">{reward.name}</h3>
                      <div className="text-purple-400 font-mono font-medium text-sm mb-4">{reward.pts.toLocaleString()} Points</div>
                      <button className="mt-auto w-full py-2 rounded-md bg-zinc-800 hover:bg-purple-600 text-sm font-medium transition-colors text-white">
                        Redeem
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}
