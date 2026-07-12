import React from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Leaf, 
  Users, 
  Shield, 
  Gamepad2, 
  BarChart2, 
  Settings, 
  Bell, 
  ChevronRight, 
  TrendingUp, 
  Plus,
  FileText
} from 'lucide-react';

const trendData = [
  { name: 'Jan', value: 72 },
  { name: 'Feb', value: 73 },
  { name: 'Mar', value: 74 },
  { name: 'Apr', value: 74 },
  { name: 'May', value: 76 },
  { name: 'Jun', value: 78 },
  { name: 'Jul', value: 77 },
  { name: 'Aug', value: 79 },
  { name: 'Sep', value: 81 },
  { name: 'Oct', value: 83 },
  { name: 'Nov', value: 84 },
  { name: 'Dec', value: 85 },
];

const departmentData = [
  { name: 'HR', value: 90, color: '#7BA98B' },
  { name: 'Finance', value: 85, color: '#C67C2A' },
  { name: 'IT', value: 80, color: '#2AA58F' },
  { name: 'Logistics', value: 75, color: '#7B5EA7' },
  { name: 'Manufacturing', value: 68, color: '#A09886' },
];

const activityFeed = [
  { id: 1, title: 'Tree Plantation CSR approved', time: '2 hours ago', type: 'env', color: '#2D7A47' },
  { id: 2, title: 'New compliance audit created', time: '4 hours ago', type: 'gov', color: '#C67C2A' },
  { id: 3, title: 'Rahul earned Eco Warrior badge', time: '1 day ago', type: 'gam', color: '#7B5EA7' },
  { id: 4, title: 'Diversity & Inclusion metrics updated', time: '2 days ago', type: 'soc', color: '#2AA58F' },
  { id: 5, title: 'Q3 Carbon Footprint report generated', time: '3 days ago', type: 'env', color: '#2D7A47' },
];

export function Forest() {
  return (
    <div className="flex h-screen w-full overflow-hidden text-[#2C332A]" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#F6F4EE' }}>
      
      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 flex flex-col h-full text-[#E8EAE6] shadow-xl z-10" style={{ backgroundColor: '#1C3A2F' }}>
        <div className="p-8 flex items-center gap-3">
          <div className="bg-[#2D7A47] p-2 rounded-xl text-white">
            <Leaf size={24} strokeWidth={1.5} />
          </div>
          <span className="font-['DM_Serif_Display'] text-2xl tracking-wide text-white">EcoSphere</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavItem icon={<BarChart2 size={20} />} label="Dashboard" active />
          <NavItem icon={<Leaf size={20} />} label="Environmental" />
          <NavItem icon={<Users size={20} />} label="Social" />
          <NavItem icon={<Shield size={20} />} label="Governance" />
          <NavItem icon={<Gamepad2 size={20} />} label="Gamification" />
          
          <div className="pt-8 pb-2 px-4 text-xs font-semibold uppercase tracking-wider text-[#7BA98B]">System</div>
          <NavItem icon={<FileText size={20} />} label="Reports" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-6">
          <div className="bg-[#142A22] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium">B Corp</span>
              <span className="text-xs text-[#7BA98B]">Verification pending</span>
            </div>
            <div className="h-8 w-8 rounded-full border-2 border-[#7BA98B] flex items-center justify-center text-xs font-bold text-[#7BA98B]">
              B
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-24 flex-shrink-0 flex items-center justify-between px-10">
          <div>
            <h1 className="font-['DM_Serif_Display'] text-4xl text-[#1C3A2F]">Dashboard</h1>
            <p className="text-[#656D63] mt-1 font-medium">Executive Overview</p>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-[#1C3A2F] hover:bg-[#E8EAE6] rounded-full transition-colors">
              <Bell size={24} strokeWidth={1.5} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#C67C2A] rounded-full border-2 border-[#F6F4EE]"></span>
            </button>
            <div className="flex items-center gap-3 bg-white pl-2 pr-4 py-2 rounded-full shadow-[0_2px_10px_rgba(28,58,47,0.04)]">
              <img 
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=7BA98B" 
                alt="User" 
                className="w-8 h-8 rounded-full bg-[#E8EAE6]" 
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#1C3A2F]">Eleanor R.</span>
                <span className="text-xs text-[#656D63]">CSO</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto px-10 pb-10">
          
          {/* Metrics */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <MetricCard title="Overall ESG" score={81} color="#1C3A2F" trend="+2.4%" />
            <MetricCard title="Environmental" score={82} color="#2D7A47" trend="+4.1%" />
            <MetricCard title="Social" score={74} color="#2AA58F" trend="-0.8%" />
            <MetricCard title="Governance" score={88} color="#C67C2A" trend="+1.2%" />
          </div>

          <div className="grid grid-cols-12 gap-8 mb-8">
            {/* Trend Chart */}
            <div className="col-span-8 bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(28,58,47,0.03)] border border-transparent">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-[#1C3A2F]">ESG Performance Trend</h3>
                  <p className="text-sm text-[#656D63] mt-1">12-month trailing index</p>
                </div>
                <div className="flex items-center gap-2 bg-[#F6F4EE] px-3 py-1.5 rounded-full text-sm font-medium text-[#2D7A47]">
                  <TrendingUp size={16} />
                  <span>On Track</span>
                </div>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EAE6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#656D63', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      domain={[60, 100]} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#656D63', fontSize: 12 }} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(28,58,47,0.08)', fontWeight: 500 }}
                      itemStyle={{ color: '#1C3A2F' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#2D7A47" 
                      strokeWidth={4} 
                      dot={false}
                      activeDot={{ r: 8, fill: '#1C3A2F', stroke: '#fff', strokeWidth: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="col-span-4 flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-[#1C3A2F] mb-1">Quick Actions</h3>
              <ActionButton icon={<Leaf size={20} />} label="Add Carbon Entry" color="#2D7A47" />
              <ActionButton icon={<Users size={20} />} label="New CSR Activity" color="#2AA58F" />
              <ActionButton icon={<Shield size={20} />} label="Create Audit Report" color="#C67C2A" />
              <ActionButton icon={<FileText size={20} />} label="View Full Report" color="#1C3A2F" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Department Ranking */}
            <div className="col-span-7 bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(28,58,47,0.03)] border border-transparent">
              <h3 className="text-lg font-semibold text-[#1C3A2F] mb-6">Department Readiness</h3>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }} barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E8EAE6" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#1C3A2F', fontSize: 13, fontWeight: 500 }} 
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="col-span-5 bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(28,58,47,0.03)] border border-transparent">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#1C3A2F]">Recent Activity</h3>
                <button className="text-sm font-medium text-[#7BA98B] hover:text-[#2D7A47] transition-colors">View All</button>
              </div>
              <div className="space-y-6">
                {activityFeed.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <div>
                      <p className="text-sm font-medium text-[#1C3A2F] leading-snug">{item.title}</p>
                      <p className="text-xs text-[#8A9386] mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button 
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-[#2D7A47] text-white font-medium' 
          : 'text-[#A0A8A2] hover:bg-[#142A22] hover:text-[#E8EAE6]'
      }`}
    >
      <span className={active ? 'text-white' : 'text-[#7BA98B]'}>{icon}</span>
      <span className="text-sm">{label}</span>
      {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </button>
  );
}

function MetricCard({ title, score, color, trend }: { title: string, score: number, color: string, trend: string }) {
  const isPositive = trend.startsWith('+');
  
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(28,58,47,0.03)] border border-transparent flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[15px] font-semibold text-[#656D63]">{title}</h3>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-[#EAF3EC] text-[#2D7A47]' : 'bg-[#F9EAEA] text-[#B05B5B]'}`}>
          {trend}
        </span>
      </div>
      
      <div className="flex items-end gap-3 mt-auto">
        <span className="font-['DM_Serif_Display'] text-5xl leading-none" style={{ color }}>{score}</span>
        <span className="text-lg font-medium text-[#A0A8A2] mb-1">/100</span>
      </div>

      <div className="mt-6 w-full h-1.5 bg-[#F6F4EE] rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function ActionButton({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) {
  return (
    <button className="group flex items-center justify-between bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(28,58,47,0.02)] hover:shadow-[0_8px_24px_rgba(28,58,47,0.06)] transition-all duration-300 border border-transparent w-full">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl transition-colors duration-300" style={{ backgroundColor: `${color}15`, color }}>
          {icon}
        </div>
        <span className="font-semibold text-[#1C3A2F]">{label}</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-[#F6F4EE] flex items-center justify-center text-[#656D63] group-hover:bg-[#1C3A2F] group-hover:text-white transition-colors duration-300">
        <Plus size={16} strokeWidth={2.5} />
      </div>
    </button>
  );
}
