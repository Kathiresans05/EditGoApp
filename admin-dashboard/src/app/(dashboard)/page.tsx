'use client';

import React from 'react';
import { 
  DollarSign, Users, Briefcase, ShoppingBag, 
  ArrowUpRight, ArrowDownRight, Activity, 
  Clock, CheckCircle2, AlertCircle, Zap,
  TrendingUp, Sparkles, Filter, Download,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@ard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar,
  Cell
} from 'recharts';
import { Badge } from '@adge';
import { Avatar, AvatarFallback, AvatarImage } from '@vatar';
import { cn } from '@/lib/utils';

const data = [
  { name: '00:00', revenue: 4000, orders: 24 },
  { name: '04:00', revenue: 3000, orders: 13 },
  { name: '08:00', revenue: 6000, orders: 98 },
  { name: '12:00', revenue: 8780, orders: 39 },
  { name: '16:00', revenue: 5890, orders: 48 },
  { name: '20:00', revenue: 9390, orders: 38 },
  { name: '23:59', revenue: 10490, orders: 43 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
            <Sparkles className="h-3 w-3" />
            Enterprise Command Center
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Marketplace <span className="text-gradient">Intelligence</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl">
            Real-time monitoring of the global EditGo creator ecosystem. Track every conversion, editor payout, and system health metric in real-time.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          <button className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            Last 24h
          </button>
          <button className="px-4 py-2 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-100">
            Realtime
          </button>
          <div className="w-[1px] h-4 bg-slate-200 mx-1" />
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Gross Volume" 
          value="₹8,24,500" 
          trend="+24.5%" 
          up={true} 
          icon={DollarSign} 
          gradient="from-indigo-600 to-blue-600"
          chartData={[40, 70, 45, 90, 65, 120]}
        />
        <StatsCard 
          title="Creator Network" 
          value="12,842" 
          trend="+12.2%" 
          up={true} 
          icon={Users} 
          gradient="from-purple-600 to-pink-600"
          chartData={[30, 45, 60, 55, 80, 95]}
        />
        <StatsCard 
          title="Active Workflows" 
          value="1,242" 
          trend="-2.4%" 
          up={false} 
          icon={Activity} 
          gradient="from-emerald-500 to-teal-500"
          chartData={[80, 70, 90, 65, 50, 40]}
        />
        <StatsCard 
          title="Avg. Ticket Size" 
          value="₹1,450" 
          trend="+5.7%" 
          up={true} 
          icon={TrendingUp} 
          gradient="from-amber-500 to-orange-500"
          chartData={[40, 50, 45, 60, 75, 90]}
        />
      </div>

      {/* Analytics Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none glass-card rounded-[2rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between px-8 py-8 border-b border-white/20">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black text-slate-900">Revenue Velocity</CardTitle>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction volume per hour</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black border border-emerald-100 animate-pulse">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              LIVE DATA
            </div>
          </CardHeader>
          <CardContent className="px-4 py-10">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                    tickFormatter={(value) => `₹${value/1000}k`}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{
                      borderRadius: '24px', 
                      border: 'none', 
                      boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      padding: '16px'
                    }}
                    itemStyle={{fontWeight: 900, color: '#6366f1'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#6366f1" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none glass-card rounded-[2rem] overflow-hidden flex flex-col">
          <CardHeader className="px-8 py-8 border-b border-white/20">
            <CardTitle className="text-xl font-black text-slate-900">Live Activity Stream</CardTitle>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time system events</p>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-hide">
              <div className="divide-y divide-slate-50">
                <FeedItem 
                  icon={ShoppingBag} 
                  title="Transaction Processing" 
                  desc="Order #ORD-945 finalized by @rahul_vlogs" 
                  time="JUST NOW"
                  color="indigo"
                  status="success"
                />
                <FeedItem 
                  icon={Zap} 
                  title="AI Upscaling" 
                  desc="System automatically enhanced 4K video for @user_22" 
                  time="2m ago"
                  color="purple"
                  status="processing"
                />
                <FeedItem 
                  icon={ShieldCheck} 
                  title="Editor Verified" 
                  desc="Sneha Kapoor (Expert Rank) KYC completed" 
                  time="15m ago"
                  color="emerald"
                  status="success"
                />
                <FeedItem 
                  icon={DollarSign} 
                  title="Instant Payout" 
                  desc="₹12,400 cleared for Top Creator @amit_edits" 
                  time="28m ago"
                  color="amber"
                  status="success"
                />
                <FeedItem 
                  icon={AlertCircle} 
                  title="SLA Warning" 
                  desc="Order #ORD-912 nearing delivery deadline" 
                  time="45m ago"
                  color="rose"
                  status="warning"
                />
              </div>
            </div>
          </CardContent>
          <div className="p-6 border-t border-white/20 bg-slate-50/50">
            <button className="w-full py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black text-indigo-600 hover:shadow-lg transition-all duration-300 uppercase tracking-widest">
              Enter Operations Room
            </button>
          </div>
        </Card>
      </div>

      {/* Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none glass-card rounded-[2rem] overflow-hidden">
          <CardHeader className="px-8 py-8 flex flex-row items-center justify-between border-b border-white/20">
            <div>
              <CardTitle className="text-xl font-black text-slate-900">Regional Performance</CardTitle>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Order distribution by tier-1 cities</p>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                <Map className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 py-10">
            <div className="space-y-6">
              <ProgressItem label="Mumbai Hub" value={78} color="bg-indigo-600" amount="₹2.4M" />
              <ProgressItem label="Delhi / NCR" value={62} color="bg-purple-600" amount="₹1.8M" />
              <ProgressItem label="Bangalore Tech" value={89} color="bg-pink-600" amount="₹3.1M" />
              <ProgressItem label="Hyderabad Area" value={45} color="bg-blue-600" amount="₹1.2M" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none glass-card rounded-[2rem] overflow-hidden">
          <CardHeader className="px-8 py-8 border-b border-white/20">
            <CardTitle className="text-xl font-black text-slate-900">System Integrity</CardTitle>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Infrastructure and API health</p>
          </CardHeader>
          <CardContent className="px-8 py-10 grid grid-cols-2 gap-6">
            <HealthIndicator label="API Response" value="42ms" status="Optimal" color="text-emerald-500" />
            <HealthIndicator label="Uptime (30d)" value="99.99%" status="Stable" color="text-emerald-500" />
            <HealthIndicator label="Socket Latency" value="12ms" status="Fast" color="text-indigo-500" />
            <HealthIndicator label="Error Rate" value="0.02%" status="Negligible" color="text-emerald-500" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, trend, up, icon: Icon, gradient, chartData }: any) {
  return (
    <Card className="border-none glass-card rounded-[2rem] overflow-hidden group hover:-translate-y-2 transition-all duration-500 cursor-pointer">
      <CardContent className="p-0">
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-110 duration-500 bg-gradient-to-br", gradient)}>
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div className={cn(
              "flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-sm",
              up ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
            )}>
              {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {trend}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">{title}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
          </div>
        </div>
        <div className="h-24 w-full mt-2 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.map((v: any, i: any) => ({ v }))}>
              <Area 
                type="monotone" 
                dataKey="v" 
                stroke={up ? "#10b981" : "#f43f5e"} 
                strokeWidth={2} 
                fill={up ? "#10b981" : "#f43f5e"} 
                fillOpacity={0.1} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function FeedItem({ icon: Icon, title, desc, time, color, status }: any) {
  const colorMap: any = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
  };

  return (
    <div className="flex items-start gap-5 p-6 transition-all hover:bg-white/40 cursor-pointer group">
      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm transform group-hover:scale-110 transition-transform duration-500", colorMap[color])}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</p>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-xs font-semibold text-slate-500 leading-relaxed">{desc}</p>
        <div className="flex items-center gap-2 mt-3">
          <div className={cn(
            "h-1.5 w-1.5 rounded-full",
            status === 'success' ? 'bg-emerald-500 animate-pulse' : 
            status === 'processing' ? 'bg-indigo-500 animate-bounce' : 'bg-rose-500'
          )} />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{status}</span>
        </div>
      </div>
    </div>
  );
}

function ProgressItem({ label, value, color, amount }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div className="space-y-0.5">
          <p className="text-sm font-black text-slate-800">{label}</p>
          <p className="text-xs font-bold text-slate-400">{amount} volume</p>
        </div>
        <p className="text-sm font-black text-slate-900">{value}%</p>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out shadow-sm", color)} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}

function HealthIndicator({ label, value, status, color }: any) {
  return (
    <div className="p-6 bg-white/40 rounded-3xl border border-white/20 shadow-sm">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className={cn("text-[10px] font-black uppercase tracking-tighter", color)}>{status}</p>
      </div>
    </div>
  );
}

import { ShieldCheck, Map } from 'lucide-react';

