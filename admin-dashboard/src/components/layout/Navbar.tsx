import React from 'react';
import { Bell, Search, Moon, Sun, Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="h-16 border-b bg-white/50 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input 
            placeholder="Search for orders, users, or editors..." 
            className="pl-10 bg-slate-100/50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500/20"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Button variant="ghost" size="icon" className="rounded-xl text-slate-500">
          <Sun className="h-5 w-5" />
        </Button>
        <div className="relative">
          <Button variant="ghost" size="icon" className="rounded-xl text-slate-500">
            <Bell className="h-5 w-5" />
          </Button>
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white" />
        </div>
        <div className="h-8 w-[1px] bg-slate-200 mx-2" />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-100 gap-2">
          <Zap className="h-4 w-4" fill="currentColor" />
          Live Status
        </Button>
      </div>
    </header>
  );
}

import { Zap } from 'lucide-react';
