'use client';

import React from 'react';
import { 
  DollarSign, ArrowUpRight, ArrowDownRight, 
  Download, Calendar, Filter, FileText,
  CreditCard, Wallet, TrendingUp, BarChart3,
  Search, ChevronRight, MoreHorizontal,
  Briefcase, ShoppingBag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@ard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar,
  LineChart, Line
} from 'recharts';
import { cn } from '@/lib/utils';
import { Badge } from '@adge';
import { Avatar, AvatarFallback } from '@vatar';

const revenueData = [
  { name: 'May 1', amount: 45000 },
  { name: 'May 5', amount: 52000 },
  { name: 'May 10', amount: 48000 },
  { name: 'May 15', amount: 61000 },
  { name: 'May 20', amount: 55000 },
  { name: 'May 25', amount: 72000 },
  { name: 'May 30', amount: 84000 },
];

export default function RevenueReportsPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
            <DollarSign className="h-3 w-3" />
            Financial Intelligence Unit
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Revenue <span className="text-gradient">Analytics</span></h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Detailed breakdown of marketplace gross volume, net revenue, and editor payouts.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 px-4 py-2 border-r border-slate-100 cursor-pointer hover:bg-slate-50 rounded-l-xl transition-colors">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">May 2026</span>
          </div>
          <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Financial Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinanceCard 
          title="Gross Marketplace Volume" 
          value="₹42,84,500" 
          trend="+18.4%" 
          up={true} 
          icon={ShoppingBag}
        />
        <FinanceCard 
          title="Net Platform Revenue" 
          value="₹8,56,900" 
          trend="+12.2%" 
          up={true} 
          icon={DollarSign}
        />
        <FinanceCard 
          title="Creator Payouts" 
          value="₹34,27,600" 
          trend="+22.5%" 
          up={true} 
          icon={Wallet}
        />
        <FinanceCard 
          title="Processing Fees" 
          value="₹1,24,300" 
          trend="-2.4%" 
          up={false} 
          icon={CreditCard}
        />
      </div>

      {/* Main Revenue Chart */}
      <Card className="border-none glass-card rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-white/20 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-black text-slate-900">Velocity Analysis</CardTitle>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Net revenue growth over time</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-indigo-600" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">This Month</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-slate-200" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Last Month</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-10">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
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
                  dataKey="amount" 
                  stroke="#6366f1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#revenueGradient)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction Table */}
        <Card className="lg:col-span-2 border-none glass-card rounded-[3rem] overflow-hidden">
          <CardHeader className="p-10 border-b border-white/20 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black">Recent Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search txns..." 
                  className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold w-48 focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Creator</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <TransactionRow 
                  id="TXN-9428" 
                  type="Order Payout" 
                  user="Alex Vance" 
                  amount="₹12,500" 
                  status="Success" 
                />
                <TransactionRow 
                  id="TXN-9427" 
                  type="Platform Fee" 
                  user="Digital Dreams" 
                  amount="₹2,400" 
                  status="Success" 
                />
                <TransactionRow 
                  id="TXN-9426" 
                  type="Editor Refund" 
                  user="Saira Khan" 
                  amount="₹4,200" 
                  status="Processing" 
                />
                <TransactionRow 
                  id="TXN-9425" 
                  type="Order Payout" 
                  user="Pixel Perfect" 
                  amount="₹8,900" 
                  status="Success" 
                />
              </tbody>
            </table>
          </CardContent>
          <div className="p-6 text-center border-t border-slate-50">
            <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">View All Ledger Entries</button>
          </div>
        </Card>

        {/* Payout Channels */}
        <Card className="border-none glass-card rounded-[3rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-white/20">
            <CardTitle className="text-xl font-black">Payout Methods</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <PayoutMethod label="UPI / Bank Transfer" percentage={68} amount="₹23.4M" color="bg-indigo-600" />
            <PayoutMethod label="PayPal Global" percentage={22} amount="₹7.5M" color="bg-blue-500" />
            <PayoutMethod label="Crypto (USDT)" percentage={10} amount="₹3.4M" color="bg-pink-500" />
            
            <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] text-white space-y-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-indigo-400" />
                <span className="text-sm font-black uppercase tracking-widest">Reserve Balance</span>
              </div>
              <p className="text-3xl font-black tracking-tight">₹14,24,000</p>
              <button className="w-full py-3 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40">
                Manage Liquidity
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FinanceCard({ title, value, trend, up, icon: Icon }: any) {
  return (
    <Card className="border-none glass-card rounded-[2.5rem] overflow-hidden group hover:-translate-y-2 transition-all duration-500">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-indigo-100 transition-all duration-500">
            <Icon className="h-7 w-7" />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter",
            up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionRow({ id, type, user, amount, status }: any) {
  return (
    <tr className="group hover:bg-white/40 transition-colors cursor-pointer">
      <td className="px-10 py-6">
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-900">{type}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{id}</span>
        </div>
      </td>
      <td className="px-10 py-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-indigo-50 text-indigo-600 text-[10px] font-black">{user[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold text-slate-600">{user}</span>
        </div>
      </td>
      <td className="px-10 py-6 text-sm font-black text-slate-900">{amount}</td>
      <td className="px-10 py-6">
        <Badge className={cn(
          "rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest",
          status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
        )}>
          {status}
        </Badge>
      </td>
    </tr>
  );
}

function PayoutMethod({ label, percentage, amount, color }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{label}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{amount}</p>
        </div>
        <p className="text-xs font-black text-slate-900">{percentage}%</p>
      </div>
      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
