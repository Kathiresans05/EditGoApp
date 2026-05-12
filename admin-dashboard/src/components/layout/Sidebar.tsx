import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Briefcase, ShoppingBag, 
  DollarSign, BarChart3, ShieldAlert, Zap, 
  Settings, Megaphone, Bell, MessageSquare,
  ShieldCheck, Map, CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Customers', href: '/users', icon: Users },
  { name: 'Editors', href: '/editors', icon: Briefcase },
  { name: 'Orders', href: '/orders', icon: ShoppingBag },
  { name: 'Payments', href: '/payments', icon: DollarSign },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Disputes', href: '/disputes', icon: ShieldAlert },
  { name: 'AI Systems', href: '/ai', icon: Zap },
  { name: 'Marketing', href: '/marketing', icon: Megaphone },
  { name: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
  { name: 'Support', href: '/support', icon: MessageSquare },
  { name: 'Moderation', href: '/moderation', icon: ShieldCheck },
  { name: 'Live Map', href: '/map', icon: Map },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white/50 backdrop-blur-xl">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200 flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-900">
            EditGo <span className="text-sm font-medium text-indigo-600/60 uppercase tracking-widest">Admin</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto scrollbar-hide">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 transition-colors",
                isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t bg-slate-50/50">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            KV
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 truncate">Kavin Admin</p>
            <p className="text-xs text-slate-500 truncate">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
