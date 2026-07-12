import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Leaf, 
  Users, 
  ShieldCheck, 
  Gamepad2, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  Menu
} from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Environmental', path: '/environmental', icon: Leaf },
  { name: 'Social', path: '/social', icon: Users },
  { name: 'Governance', path: '/governance', icon: ShieldCheck },
  { name: 'Gamification', path: '/gamification', icon: Gamepad2 },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();

  const currentModule = NAV_ITEMS.find(item => location === item.path || (item.path !== '/' && location.startsWith(item.path))) || NAV_ITEMS[0];

  return (
    <div className="min-h-[100dvh] flex bg-[#F6F8F4] text-[#111827] font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-[#E8EDE6] flex-shrink-0 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-5 shrink-0">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-[#166534]" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#111827] tracking-tight leading-none mt-0.5">EcoSphere</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-medium leading-none">ESG Platform</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-1">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mt-6 mb-2">
            Navigation
          </div>
          
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive 
                    ? `bg-green-50 text-[#166534] font-semibold` 
                    : `text-gray-500 hover:bg-gray-50 hover:text-gray-800`
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-[#E8EDE6]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-sm font-semibold text-[#166534]">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 leading-none">Jane Doe</span>
              <span className="text-xs text-gray-500 mt-1">Sustainability Officer</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F6F8F4]">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-[#E8EDE6] flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-500 hover:text-gray-900">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
               <span>Modules</span>
               <span>/</span>
               <span className="text-gray-900">{currentModule.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-100 border-0 rounded-full text-sm pl-9 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-200 w-52 placeholder:text-gray-400"
              />
            </div>
            
            <button className="relative p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}