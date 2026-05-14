import React from 'react';
import { Bell, Search as SearchIcon, Sun, Zap, Command, Globe, Server } from 'lucide-react';
import { Input } from '@nput';
import { Button } from '@utton';
import { cn } from '@/lib/utils';

export function Navbar() {
  return (
    <header className="h-20 border-b bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-10 flex items-center justify-between">
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <SearchIcon className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          </div>
          <Input 
            placeholder="Search transactions, creators, or global system nodes..." 
            className="pl-12 pr-12 h-12 bg-slate-50 border-slate-100 rounded-2xl focus-visible:ring-4 focus-visible:ring-indigo-500/5 focus-visible:bg-white transition-all text-sm font-medium"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-sm">
            <Command className="h-3 w-3 text-slate-400" />
            <span className="text-[10px] font-black text-slate-400">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-8">
        <div className="hidden xl:flex items-center gap-6 mr-6">
          <StatusIndicator icon={Server} label="Cloud Core" status="online" />
          <StatusIndicator icon={Globe} label="Edge Nodes" status="online" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
            <Sun className="h-5 w-5" />
          </Button>
          <div className="relative">
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
              <Bell className="h-5 w-5" />
            </Button>
            <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-indigo-600 border-2 border-white animate-pulse" />
          </div>
        </div>

        <div className="h-8 w-[1px] bg-slate-100 mx-2" />
        
        <Button className="h-12 px-6 bg-slate-900 hover:bg-black text-white rounded-2xl shadow-xl shadow-slate-200 gap-3 group transition-all active:scale-95">
          <div className="relative">
            <Zap className="h-4 w-4 text-indigo-400 fill-indigo-400 group-hover:animate-pulse" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">System Live</span>
        </Button>
      </div>
    </header>
  );
}

function StatusIndicator({ icon: Icon, label, status }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</span>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="h-1 w-1 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-black text-slate-900 uppercase">{status}</span>
        </div>
      </div>
    </div>
  );
}

