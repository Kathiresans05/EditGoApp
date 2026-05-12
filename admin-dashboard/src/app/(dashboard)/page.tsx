'use client';

import React from 'react';
import { 
  DollarSign, Users, Briefcase, ShoppingBag, 
  ArrowUpRight, ArrowDownRight, Activity, 
  Clock, CheckCircle2, AlertCircle, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const data = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 13 },
  { name: 'Wed', revenue: 2000, orders: 98 },
  { name: 'Thu', revenue: 2780, orders: 39 },
  { name: 'Fri', revenue: 1890, orders: 48 },
  { name: 'Sat', revenue: 2390, orders: 38 },
  { name: 'Sun', revenue: 3490, orders: 43 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Platform Overview</h1>
          <p className="text-slate-500 mt-1">Monitor real-time activity and revenue growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
            <Activity className="h-3 w-3 animate-pulse" />
            LIVE SYSTEMS
          </div>
          <div className="h-8 w-[1px] bg-slate-200" />
          <p className="text-sm font-medium text-slate-600">May 12, 2026</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Revenue" 
          value="₹1,24,500" 
          trend="+12.5%" 
          up={true} 
          icon={DollarSign} 
          color="indigo" 
        />
        <StatsCard 
          title="Active Users" 
          value="3,842" 
          trend="+8.2%" 
          up={true} 
          icon={Users} 
          color="purple" 
        />
        <StatsCard 
          title="Live Orders" 
          value="42" 
          trend="-2.4%" 
          up={false} 
          icon={ShoppingBag} 
          color="rose" 
        />
        <StatsCard 
          title="Avg. Payout" 
          value="₹450" 
          trend="+5.7%" 
          up={true} 
          icon={Activity} 
          color="amber" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-8 py-6">
            <CardTitle className="text-lg font-bold">Revenue Analytics</CardTitle>
            <Badge variant="outline" className="rounded-full bg-slate-50 text-slate-600 border-none font-bold">WEEKLY</Badge>
          </CardHeader>
          <CardContent className="px-4 py-8">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-50 px-8 py-6">
            <CardTitle className="text-lg font-bold">Live Feed</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              <FeedItem 
                icon={ShoppingBag} 
                title="New Order" 
                desc="Cinematic Vlog by @rahul_vlogs" 
                time="2m ago"
                color="indigo"
              />
              <FeedItem 
                icon={Briefcase} 
                title="Editor Verified" 
                desc="Sneha Kapoor joined the platform" 
                time="15m ago"
                color="emerald"
              />
              <FeedItem 
                icon={DollarSign} 
                title="Payout Success" 
                desc="₹4,500 sent to @pro_editor" 
                time="45m ago"
                color="amber"
              />
              <FeedItem 
                icon={AlertCircle} 
                title="New Dispute" 
                desc="Late delivery report by @user99" 
                time="1h ago"
                color="rose"
              />
              <div className="p-4 text-center">
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">View All Activity</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-8 py-6">
          <CardTitle className="text-lg font-bold">Recent Live Orders</CardTitle>
          <button className="text-sm font-bold text-indigo-600">View All</button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Editor</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <OrderRow 
                id="#ORD-942" 
                customer="Rahul Sharma" 
                editor="Karthik R." 
                amount="₹2,500" 
                status="Editing" 
                timeLeft="2h 15m"
              />
              <OrderRow 
                id="#ORD-941" 
                customer="Priya Singh" 
                editor="Unassigned" 
                amount="₹1,800" 
                status="Searching" 
                timeLeft="--:--"
              />
              <OrderRow 
                id="#ORD-940" 
                customer="Vikas J." 
                editor="Amit Singh" 
                amount="₹4,200" 
                status="Delivered" 
                timeLeft="READY"
              />
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ title, value, trend, up, icon: Icon, color }: any) {
  const colorMap: any = {
    indigo: "bg-indigo-600 text-white shadow-indigo-100",
    purple: "bg-purple-600 text-white shadow-purple-100",
    rose: "bg-rose-600 text-white shadow-rose-100",
    amber: "bg-amber-600 text-white shadow-amber-100",
  };

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg", colorMap[color])}>
            <Icon className="h-6 w-6" />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </div>
        </div>
        <p className="text-3xl font-black text-slate-900">{value}</p>
        <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-widest">{title}</p>
      </CardContent>
    </Card>
  );
}

function FeedItem({ icon: Icon, title, desc, time, color }: any) {
  const colorMap: any = {
    indigo: "text-indigo-600 bg-indigo-50",
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    rose: "text-rose-600 bg-rose-50",
  };

  return (
    <div className="flex items-start gap-4 p-6 transition-colors hover:bg-slate-50/50">
      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", colorMap[color])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 mt-1 truncate">{desc}</p>
        <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-slate-400 uppercase">
          <Clock className="h-3 w-3" />
          {time}
        </div>
      </div>
    </div>
  );
}

function OrderRow({ id, customer, editor, amount, status, timeLeft }: any) {
  const statusColors: any = {
    Searching: "bg-amber-50 text-amber-600 border-amber-100",
    Editing: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <tr className="hover:bg-slate-50/30 transition-colors">
      <td className="px-8 py-5 text-sm font-bold text-slate-900">{id}</td>
      <td className="px-8 py-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-slate-100 text-xs font-bold text-slate-600">{customer[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-slate-700">{customer}</span>
        </div>
      </td>
      <td className="px-8 py-5">
        <span className={cn("text-sm font-semibold", editor === 'Unassigned' ? 'text-slate-400 italic' : 'text-slate-700')}>
          {editor}
        </span>
      </td>
      <td className="px-8 py-5 text-sm font-bold text-slate-900">{amount}</td>
      <td className="px-8 py-5">
        <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border inline-block", statusColors[status])}>
          {status}
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          {timeLeft}
        </div>
      </td>
    </tr>
  );
}

import { cn } from '@/lib/utils';
