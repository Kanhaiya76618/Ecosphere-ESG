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
  Menu,
  X
} from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, color: 'text-zinc-300', activeColor: 'text-zinc-100', activeBg: 'bg-zinc-800' },
  { name: 'Environmental', path: '/environmental', icon: Leaf, color: 'text-green-500', activeColor: 'text-green-400', activeBg: 'bg-green-500/10' },
  { name: 'Social', path: '/social', icon: Users, color: 'text-blue-500', activeColor: 'text-blue-400', activeBg: 'bg-blue-500/10' },
  { name: 'Governance', path: '/governance', icon: ShieldCheck, color: 'text-orange-500', activeColor: 'text-orange-400', activeBg: 'bg-orange-500/10' },
  { name: 'Gamification', path: '/gamification', icon: Gamepad2, color: 'text-purple-500', activeColor: 'text-purple-400', activeBg: 'bg-purple-500/10' },
  { name: 'Reports', path: '/reports', icon: BarChart3, color: 'text-teal-500', activeColor: 'text-teal-400', activeBg: 'bg-teal-500/10' },
  { name: 'Settings', path: '/settings', icon: Settings, color: 'text-zinc-400', activeColor: 'text-zinc-300', activeBg: 'bg-zinc-800' },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();

  const currentModule = NAV_ITEMS.find(item => location === item.path || (item.path !== '/' && location.startsWith(item.path))) || NAV_ITEMS[0];

  return (
    <div className="min-h-[100dvh] flex bg-background text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white">
              <Leaf className="w-5 h-5" />
            </div>
            EcoSphere
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">
            Main Menu
          </div>
          
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? `${item.activeBg} ${item.activeColor}` 
                    : `text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200`
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? item.activeColor : item.color}`} />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">Jane Doe</span>
              <span className="text-xs text-zinc-500 mt-1">Sustainability Officer</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-card-border flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-zinc-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold flex items-center gap-2">
              {currentModule.name}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-background border border-border rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64"
              />
            </div>
            
            <button className="relative p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
