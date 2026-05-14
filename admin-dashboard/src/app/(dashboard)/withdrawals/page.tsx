'use client';

import React from 'react';
import { 
  Wallet, ArrowDownRight, Clock, CheckCircle2, 
  Search, Filter, Download, MoreHorizontal,
  Banknote, CreditCard, Landmark, ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@ard';
import { cn } from '@/lib/utils';
import { Badge } from '@adge';
import { Avatar, AvatarFallback } from '@vatar';

const withdrawals = [
  {
    id: 'WTH-9428',
    editor: 'Alex Vance',
    amount: '₹45,000',
    method: 'HDFC Bank',
    status: 'Processing',
    time: '10m ago'
  },
  {
    id: 'WTH-9427',
    editor: 'Sneha Kapoor',
    amount: '₹12,800',
    method: 'UPI (GPay)',
    status: 'Success',
    time: '1h ago'
  },
  {
    id: 'WTH-9426',
    editor: 'Amit Singh',
    amount: '₹8,900',
    method: 'PayPal',
    status: 'Success',
    time: '4h ago'
  }
];

export default function WithdrawalsPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
            <Wallet className="h-3 w-3" />
            Payout Disbursement Center
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Withdrawal <span className="text-gradient">Management</span></h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Monitor and approve creator payouts. Manage liquidity reserves and disbursement channels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:shadow-lg transition-all uppercase tracking-widest">
            <Download className="h-4 w-4" />
            Payout Report
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black hover:shadow-xl hover:shadow-indigo-200 transition-all uppercase tracking-widest group">
            <CheckCircle2 className="h-4 w-4" />
            Bulk Approve
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PayoutCard title="Pending Approvals" value="₹2,42,800" count={14} icon={Clock} color="amber" />
        <PayoutCard title="Disbursed Today" value="₹8,12,400" count={42} icon={CheckCircle2} color="emerald" />
        <PayoutCard title="Reserve Liquidity" value="₹45,00,000" count={null} icon={Landmark} color="indigo" />
      </div>

      {/* Main Table */}
      <Card className="border-none glass-card rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-white/20 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-black">Withdrawal Requests</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search withdrawals..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold w-64 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Request ID</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Editor</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Method</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {withdrawals.map((item) => (
                <tr key={item.id} className="group hover:bg-white/40 transition-colors cursor-pointer">
                  <td className="px-10 py-8">
                    <span className="text-sm font-black text-slate-900">{item.id}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-black">{item.editor[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-bold text-slate-700">{item.editor}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-sm font-black text-slate-900">{item.amount}</td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.method}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        item.status === 'Processing' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                      )} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700">Approve</button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg"><MoreHorizontal className="h-4 w-4 text-slate-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function PayoutCard({ title, value, count, icon: Icon, color }: any) {
  const colorMap: any = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    amber: "bg-amber-600 shadow-amber-100",
    emerald: "bg-emerald-600 shadow-emerald-100",
  };

  return (
    <Card className="border-none glass-card rounded-[2.5rem] p-10 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="h-32 w-32 rotate-12" />
      </div>
      <div className="relative z-10 space-y-6">
        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-xl", colorMap[color])}>
          <Icon className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
            {count && <span className="text-sm font-bold text-slate-400">({count} requests)</span>}
          </div>
        </div>
      </div>
    </Card>
  );
}
