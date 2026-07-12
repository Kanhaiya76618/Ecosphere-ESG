import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Leaf, Users, Shield, Gamepad2, BarChart2, Settings, Bell, 
  ChevronRight, TrendingUp, Plus, Zap, LayoutDashboard
} from 'lucide-react';

const trendData = [
  { month: 'Jan', score: 72 },
  { month: 'Feb', score: 74 },
  { month: 'Mar', score: 73 },
  { month: 'Apr', score: 76 },
  { month: 'May', score: 79 },
  { month: 'Jun', score: 80 },
  { month: 'Jul', score: 81 },
];

const deptData = [
  { name: 'Engineering', score: 92 },
  { name: 'Operations', score: 78 },
  { name: 'Marketing', score: 86 },
  { name: 'HR', score: 84 },
  { name: 'Sales', score: 72 },
];

const activities = [
  { id: 1, title: 'Energy report generated', time: '10:42 AM', type: 'env', color: '#34C759' },
  { id: 2, title: 'Diversity goal achieved: Q2', time: 'Yesterday', type: 'soc', color: '#007AFF' },
  { id: 3, title: 'New compliance policy active', time: 'Mon, 2:00 PM', type: 'gov', color: '#FF9500' },
  { id: 4, title: 'Carbon offset certificate uploaded', time: 'Jul 8', type: 'env', color: '#34C759' },
];

const RingProgress = ({ value, label, color, size = 110, stroke = 8 }: { value: number; label: string; color: string; size?: number; stroke?: number }) => {
  const radius = size / 2;
  const normalizedRadius = radius - stroke * 1.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg height={size} width={size} className="transform -rotate-90">
          <circle
            stroke="#F2F2F7"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <span className="absolute text-[22px] font-bold tracking-tight text-[#1C1C1E]">{value}</span>
      </div>
      <span className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-[#8E8E93]">{label}</span>
    </div>
  );
};

export function Alpine() {
  return (
    <div 
      className="flex h-screen w-full overflow-hidden bg-white" 
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
        WebkitFontSmoothing: 'antialiased',
        color: '#1C1C1E'
      }}
    >
      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 flex flex-col bg-[#F2F2F7] border-r border-[#E5E5EA]">
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center gap-2 text-[#34C759] font-bold text-xl tracking-tight">
            <Leaf className="w-6 h-6 fill-current" />
            <span>EcoSphere</span>
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] bg-[#34C759]/10 text-[#34C759] font-medium text-sm">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[#8E8E93] hover:text-[#1C1C1E] font-medium text-sm transition-colors cursor-pointer">
            <Leaf className="w-5 h-5" />
            Environmental
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[#8E8E93] hover:text-[#1C1C1E] font-medium text-sm transition-colors cursor-pointer">
            <Users className="w-5 h-5" />
            Social
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[#8E8E93] hover:text-[#1C1C1E] font-medium text-sm transition-colors cursor-pointer">
            <Shield className="w-5 h-5" />
            Governance
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[#8E8E93] hover:text-[#1C1C1E] font-medium text-sm transition-colors cursor-pointer">
            <Gamepad2 className="w-5 h-5" />
            Gamification
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[#8E8E93] hover:text-[#1C1C1E] font-medium text-sm transition-colors cursor-pointer">
            <BarChart2 className="w-5 h-5" />
            Reports
          </div>
        </nav>

        <div className="p-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[#8E8E93] hover:text-[#1C1C1E] font-medium text-sm transition-colors cursor-pointer">
            <Settings className="w-5 h-5" />
            Settings
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        {/* Top Bar */}
        <header className="h-20 flex items-center justify-between px-10 bg-white border-b border-[#E5E5EA] shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Good morning, Sarah</h1>
            <p className="text-sm text-[#8E8E93] font-medium mt-0.5">July 12, 2026</p>
          </div>
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-[#8E8E93] hover:text-[#1C1C1E] transition-colors rounded-full">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#FF3B30] rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#34C759] to-[#34C759]/50 p-[2px]">
              <div className="w-full h-full rounded-full bg-white border-2 border-white overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah" 
                  alt="Avatar" 
                  className="w-full h-full object-cover bg-[#F2F2F7]"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8">
          
          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Environmental', value: 82, color: '#34C759' },
              { label: 'Social', value: 74, color: '#007AFF' },
              { label: 'Governance', value: 88, color: '#FF9500' },
              { label: 'Overall ESG', value: 81, color: '#AF52DE' },
            ].map((metric, i) => (
              <div key={i} className="bg-white rounded-[16px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6 flex items-center justify-center">
                <RingProgress value={metric.value} label={metric.label} color={metric.color} />
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-3 bg-white rounded-[16px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6">
              <div className="mb-6">
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#8E8E93]">ESG Score Trend</h2>
              </div>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34C759" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#34C759" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#8E8E93', fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontWeight: 600 }}
                      itemStyle={{ color: '#34C759' }}
                      cursor={{ stroke: '#E5E5EA', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#34C759" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-2 bg-white rounded-[16px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6 flex flex-col">
              <div className="mb-6">
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#8E8E93]">Department Performance</h2>
              </div>
              <div className="flex-1 w-full min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData} layout="vertical" margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#1C1C1E', fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#F2F2F7', radius: 4 }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontWeight: 600 }}
                    />
                    <Bar dataKey="score" fill="#34C759" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-2 gap-6">
            
            {/* Recent Activity */}
            <div className="bg-white rounded-[16px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#8E8E93]">Recent Activity</h2>
                <button className="text-[13px] font-medium text-[#007AFF] hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {activities.map((activity, i) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-4 shrink-0" style={{ backgroundColor: activity.color }}></div>
                    <div className="flex-1 flex items-center justify-between border-b border-[#E5E5EA] pb-4 last:border-0 last:pb-0">
                      <span className="text-[15px] font-medium text-[#1C1C1E]">{activity.title}</span>
                      <span className="text-[13px] text-[#8E8E93] whitespace-nowrap ml-4">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Quick Actions & Callout */}
            <div className="flex flex-col gap-6">
              
              {/* Full-width Callout */}
              <div className="bg-[#34C759]/10 rounded-[16px] p-6 flex flex-col justify-center border border-[#34C759]/20">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#34C759]">Carbon Tracked This Month</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-[#34C759]">1,247</span>
                  <span className="text-sm font-semibold text-[#34C759]/80">kg CO₂</span>
                </div>
                <div className="mt-4 h-1 w-full bg-[#34C759]/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#34C759] rounded-full w-[65%]"></div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-4 flex-1">
                <button className="bg-white rounded-[16px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 flex flex-col items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  <div className="w-12 h-12 rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-[14px] font-semibold">Log Initiative</span>
                </button>
                <button className="bg-white rounded-[16px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 flex flex-col items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  <div className="w-12 h-12 rounded-full bg-[#FF9500]/10 text-[#FF9500] flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="text-[14px] font-semibold">Generate Report</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
