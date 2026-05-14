'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#FDFDFF] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/30">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
          <div className="h-20" /> {/* Bottom spacing */}
        </main>
      </div>
    </div>
  );
}

