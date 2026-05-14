'use client';

import React from 'react';
import { 
  ShieldAlert, MessageSquare, AlertCircle, 
  CheckCircle2, Clock, Search, Filter,
  ChevronRight, MoreVertical, Flag,
  User, Briefcase, ShoppingBag, Scale
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@ard';
import { cn } from '@/lib/utils';
import { Badge } from '@adge';
import { Avatar, AvatarFallback } from '@vatar';

const complaints = [
  {
    id: 'DIS-9428',
    customer: 'Rahul Sharma',
    editor: 'Amit Singh',
    orderId: '#ORD-122',
    issue: 'Late Delivery',
    priority: 'High',
    status: 'Open',
    time: '2h ago'
  },
  {
    id: 'DIS-9427',
    customer: 'Priya Singh',
    editor: 'Karthik R.',
    orderId: '#ORD-125',
    issue: 'Quality Not as Expected',
    priority: 'Medium',
    status: 'In Review',
    time: '5h ago'
  },
  {
    id: 'DIS-9426',
    customer: 'Vikas J.',
    editor: 'Sneha K.',
    orderId: '#ORD-119',
    issue: 'Communication Gap',
    priority: 'Low',
    status: 'Resolved',
    time: '1d ago'
  }
];

export default function ComplaintsPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
            <Scale className="h-3 w-3" />
            Dispute Resolution Engine
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Resolution <span className="text-gradient">Center</span></h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Handle marketplace disputes, editor moderation, and customer complaints with enterprise-grade workflow tools.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:shadow-lg transition-all uppercase tracking-widest">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:shadow-xl transition-all uppercase tracking-widest group">
            <Flag className="h-4 w-4" />
            New Moderation Rule
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusCard title="Pending Disputes" value="12" status="Action Required" icon={AlertCircle} color="rose" />
        <StatusCard title="Avg. Resolution Time" value="4.2h" status="Fast" icon={Clock} color="indigo" />
        <StatusCard title="Resolved Today" value="28" status="Nominal" icon={CheckCircle2} color="emerald" />
        <StatusCard title="SLA Compliance" value="96.4%" status="Strong" icon={ShieldAlert} color="indigo" />
      </div>

      {/* Main Disputes Table */}
      <Card className="border-none glass-card rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-white/20 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-black">Active Dispute Queue</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search cases..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold w-64 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dispute ID</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Parties involved</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Issue</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Priority</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {complaints.map((item) => (
                <tr key={item.id} className="group hover:bg-white/40 transition-colors cursor-pointer">
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">{item.id}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.orderId}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        <Avatar className="h-8 w-8 border-2 border-white">
                          <AvatarFallback className="bg-indigo-50 text-indigo-600 text-[10px] font-black">{item.customer[0]}</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8 border-2 border-white">
                          <AvatarFallback className="bg-purple-50 text-purple-600 text-[10px] font-black">{item.editor[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{item.customer} vs {item.editor}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{item.time}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-sm font-semibold text-slate-600">{item.issue}</span>
                  </td>
                  <td className="px-10 py-8">
                    <Badge className={cn(
                      "rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest",
                      item.priority === 'High' ? 'bg-rose-50 text-rose-600' : 
                      item.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                    )}>
                      {item.priority}
                    </Badge>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        item.status === 'Open' ? 'bg-rose-500 animate-pulse' : 
                        item.status === 'In Review' ? 'bg-indigo-500 animate-bounce' : 'bg-emerald-500'
                      )} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
        <div className="p-8 bg-slate-50/50 border-t border-white/20 text-center">
          <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">View Archived Cases</button>
        </div>
      </Card>
    </div>
  );
}

function StatusCard({ title, value, status, icon: Icon, color }: any) {
  const colorMap: any = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    rose: "bg-rose-600 shadow-rose-100",
    emerald: "bg-emerald-600 shadow-emerald-100",
  };

  return (
    <Card className="border-none glass-card rounded-[2.5rem] p-8 hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-6">
        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white transition-all duration-500 group-hover:rotate-12", colorMap[color])}>
          <Icon className="h-6 w-6" />
        </div>
        <Badge variant="outline" className="rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 border-slate-100">{status}</Badge>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{title}</p>
      <p className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{value}</p>
    </Card>
  );
}
