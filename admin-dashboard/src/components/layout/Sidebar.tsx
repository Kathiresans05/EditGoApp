import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Briefcase, ShoppingBag, 
  DollarSign, BarChart3, ShieldAlert, Zap, 
  Settings, Megaphone, Bell, MessageSquare,
  ShieldCheck, Map, CreditCard, Wallet, 
  TrendingUp, Sparkles, Star, LayoutGrid, 
  Shield, UserCog, FileText, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  {
    title: 'Core Operations',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Live Activity', href: '/live-activity', icon: Activity },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'AI Insights', href: '/ai-insights', icon: Sparkles },
    ]
  },
  {
    title: 'Marketplace',
    items: [
      { name: 'Customers', href: '/users', icon: Users },
      { name: 'Editors', href: '/editors', icon: Briefcase },
      { name: 'Orders', href: '/orders', icon: ShoppingBag },
      { name: 'Reviews', href: '/reviews', icon: Star },
      { name: 'Templates', href: '/templates', icon: LayoutGrid },
    ]
  },
  {
    title: 'Financials',
    items: [
      { name: 'Payments', href: '/payments', icon: DollarSign },
      { name: 'Withdrawals', href: '/withdrawals', icon: Wallet },
      { name: 'Revenue Reports', href: '/revenue', icon: FileText },
      { name: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
    ]
  },
  {
    title: 'Ecosystem',
    items: [
      { name: 'Promotions', href: '/promotions', icon: Megaphone },
      { name: 'Notifications', href: '/notifications', icon: Bell },
      { name: 'Complaints', href: '/complaints', icon: ShieldAlert },
    ]
  },
  {
    title: 'Administration',
    items: [
      { name: 'Security Center', href: '/security', icon: Shield },
      { name: 'Admin Roles', href: '/admin-roles', icon: UserCog },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-72 flex-col border-r bg-white/80 backdrop-blur-xl">
      <div className="flex h-20 items-center px-8 border-b border-slate-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 shadow-xl shadow-indigo-200 flex items-center justify-center transform transition-transform hover:scale-105">
            <Zap className="h-6 w-6 text-white" fill="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
              EditGo
            </span>
            <span className="text-[10px] font-black text-indigo-600/80 uppercase tracking-[0.2em] mt-1">
              Command Center
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-8 px-4 py-8 overflow-y-auto scrollbar-hide">
        {navigation.map((category) => (
          <div key={category.title} className="space-y-2">
            <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
              {category.title}
            </h3>
            <div className="space-y-1">
              {category.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-4 py-2.5 text-sm font-bold rounded-2xl transition-all duration-300",
                      isActive 
                        ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon className={cn(
                      "mr-3 h-5 w-5 transition-all duration-300",
                      isActive ? "text-indigo-600 scale-110" : "text-slate-400 group-hover:text-slate-600"
                    )} />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-4 p-2 rounded-2xl transition-colors hover:bg-white/50 cursor-pointer group">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-black text-sm border border-white shadow-sm">
              KV
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">Kavin Admin</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Super Admin</p>
          </div>
          <Settings className="h-4 w-4 text-slate-400 group-hover:rotate-90 transition-transform duration-500" />
        </div>
      </div>
    </div>
  );
}

