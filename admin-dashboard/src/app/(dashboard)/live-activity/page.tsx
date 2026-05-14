'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, ShoppingBag, Users, Zap, 
  Map as MapIcon, Globe, Clock, ArrowUpRight,
  ShieldCheck, AlertCircle, DollarSign, Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@ard';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'order' | 'user' | 'system' | 'payment';
  title: string;
  desc: string;
  time: string;
  location: string;
  status: 'success' | 'warning' | 'processing';
}

const initialActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Enterprise Order',
    desc: 'Cinematic commercial project by BrandX Media',
    time: 'JUST NOW',
    location: 'New York, US',
    status: 'success'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payout Dispatched',
    desc: '₹45,000 sent to editor @alex_vfx',
    time: '2m ago',
    location: 'Mumbai, IN',
    status: 'success'
  },
  {
    id: '3',
    type: 'system',
    title: 'AI Node Scaling',
    desc: 'Automatically adding 4 new GPU instances for rendering',
    time: '5m ago',
    location: 'AWS-East-1',
    status: 'processing'
  },
  {
    id: '4',
    type: 'user',
    title: 'Editor Verified',
    desc: 'Sarah Jenkins completed Master level certification',
    time: '12m ago',
    location: 'London, UK',
    status: 'success'
  }
];

export default function LiveActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Math.random().toString(),
        type: Math.random() > 0.5 ? 'order' : 'payment',
        title: Math.random() > 0.5 ? 'Live Conversion' : 'Revenue Event',
        desc: `Autonomous activity detected in the marketplace cluster`,
        time: 'JUST NOW',
        location: 'Global Edge',
        status: 'success'
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
            <Activity className="h-3 w-3 animate-pulse" />
            Live Marketplace Pulse
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Operations <span className="text-gradient">Control</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 w-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                OP
              </div>
            ))}
            <div className="h-10 w-10 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
              +12
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-slate-900 uppercase">16 Ops Online</p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase">System Nominal</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Feed */}
        <Card className="lg:col-span-2 border-none glass-card rounded-[2.5rem] overflow-hidden flex flex-col min-h-[700px]">
          <CardHeader className="p-8 border-b border-white/20 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black">Event Stream</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter events..." 
                  className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold w-64 focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto scrollbar-hide">
            <div className="divide-y divide-slate-50">
              {activities.map((item) => (
                <div key={item.id} className="p-8 flex items-start gap-6 hover:bg-slate-50/50 transition-all group animate-in slide-in-from-top-4 duration-500">
                  <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-xl transform group-hover:rotate-12 transition-transform duration-500",
                    item.type === 'order' ? 'bg-indigo-50 text-indigo-600' :
                    item.type === 'payment' ? 'bg-emerald-50 text-emerald-600' :
                    item.type === 'system' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
                  )}>
                    {item.type === 'order' ? <ShoppingBag className="h-7 w-7" /> :
                     item.type === 'payment' ? <DollarSign className="h-7 w-7" /> :
                     item.type === 'system' ? <Zap className="h-7 w-7" /> : <Users className="h-7 w-7" />}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-black text-slate-900 tracking-tight">{item.title}</p>
                      <Badge variant="outline" className="rounded-full bg-white border-slate-100 text-[10px] font-black text-slate-400">
                        {item.time}
                      </Badge>
                    </div>
                    <p className="text-slate-500 font-medium">{item.desc}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3 w-3 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          item.status === 'success' ? 'bg-emerald-500' : 
                          item.status === 'processing' ? 'bg-indigo-500 animate-pulse' : 'bg-amber-500'
                        )} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.status}</span>
                      </div>
                    </div>
                  </div>
                  <button className="self-center p-3 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-indigo-600 border border-transparent hover:border-slate-100">
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-6 bg-slate-50/50 border-t border-white/20">
            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98]">
              Download Activity Audit Log
            </button>
          </div>
        </Card>

        {/* Sidebar Diagnostics */}
        <div className="space-y-8">
          <Card className="border-none glass-card rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-white/20">
              <CardTitle className="text-xl font-black">Global Traffic</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center justify-center h-48 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 relative overflow-hidden group">
                <MapIcon className="h-16 w-16 text-slate-200" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent" />
                <div className="absolute top-1/4 left-1/3 h-2 w-2 bg-indigo-500 rounded-full animate-ping" />
                <div className="absolute bottom-1/3 right-1/4 h-2 w-2 bg-purple-500 rounded-full animate-ping" />
                <p className="absolute bottom-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Interactive Live Map Locked</p>
              </div>
              <div className="space-y-4">
                <DiagnosticItem label="Active WebSocket Conns" value="1,242" trend="+12%" up={true} />
                <DiagnosticItem label="Ingress Rate" value="14.2 GB/s" trend="+5%" up={true} />
                <DiagnosticItem label="CDN Cache Hit" value="94.2%" trend="-0.4%" up={false} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none glass-card rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
            <CardContent className="p-8 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Security Protocol Alpha</h3>
                <p className="text-white/70 text-sm font-medium leading-relaxed">System is currently operating under standard security parameters. All transactions are being screened by AI Fraud Detection.</p>
              </div>
              <button className="w-full py-3 bg-white text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-opacity-90 transition-all">
                System Lockdown
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DiagnosticItem({ label, value, trend, up }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/20">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-black text-slate-900 mt-1">{value}</p>
      </div>
      <div className={cn(
        "text-[10px] font-black px-2 py-1 rounded-lg",
        up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
      )}>
        {trend}
      </div>
    </div>
  );
}
