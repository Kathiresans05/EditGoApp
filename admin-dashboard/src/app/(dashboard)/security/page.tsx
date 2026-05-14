'use client';

import React from 'react';
import { 
  Shield, ShieldCheck, ShieldAlert, Lock, 
  Key, Eye, Fingerprint, Globe, Server,
  AlertTriangle, CheckCircle2, MoreHorizontal,
  Terminal, UserCheck, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@ard';
import { cn } from '@/lib/utils';
import { Badge } from '@adge';

export default function SecurityCenterPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
            <Shield className="h-3 w-3" />
            Cyber-Security Command
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Security <span className="text-gradient">Center</span></h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Real-time monitoring of platform integrity, access logs, and automated threat mitigation.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">Level 1 Protection Active</span>
          </div>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SecurityStatCard title="Threats Blocked" value="1,242" status="Success" icon={ShieldCheck} color="indigo" />
        <SecurityStatCard title="Failed Logins" value="14" status="Monitoring" icon={AlertTriangle} color="amber" />
        <SecurityStatCard title="Active SSH Nodes" value="8" status="Optimal" icon={Terminal} color="emerald" />
        <SecurityStatCard title="Security Score" value="98/100" status="Strong" icon={Shield} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Access Logs */}
        <Card className="lg:col-span-2 border-none glass-card rounded-[3rem] overflow-hidden">
          <CardHeader className="p-10 border-b border-white/20 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black">Audit Trails</CardTitle>
            <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">Download Full Log</button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              <LogItem 
                user="Admin (Kavin)" 
                action="Modified Revenue Threshold" 
                ip="192.168.1.45" 
                time="2m ago" 
                type="critical" 
              />
              <LogItem 
                user="System (Auth-Node)" 
                action="Rotated JWT Signing Keys" 
                ip="Internal (US-East)" 
                time="15m ago" 
                type="info" 
              />
              <LogItem 
                user="Editor (amit_edits)" 
                action="Changed Payout Wallet" 
                ip="103.45.21.9" 
                time="45m ago" 
                type="warning" 
              />
              <LogItem 
                user="System (Shield)" 
                action="Blocked SQL Injection Attempt" 
                ip="45.12.89.2" 
                time="1h ago" 
                type="blocked" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Controls */}
        <div className="space-y-8">
          <Card className="border-none glass-card rounded-[3rem] overflow-hidden bg-slate-900 text-white">
            <CardHeader className="p-8 border-b border-white/10">
              <CardTitle className="text-lg font-black flex items-center gap-3">
                <Lock className="h-5 w-5 text-indigo-400" />
                Access Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <ControlToggle label="Two-Factor Auth (Admin)" active={true} />
              <ControlToggle label="Geo-IP Blocking" active={true} />
              <ControlToggle label="Auto-Lock Suspicious" active={false} />
              <ControlToggle label="Biometric Verification" active={true} />
              
              <div className="pt-6 border-t border-white/10">
                <button className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                  Revoke All Active Sessions
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none glass-card rounded-[3rem] overflow-hidden">
            <CardContent className="p-10 space-y-6">
              <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center">
                <Fingerprint className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Identity Verification</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">System has flagged 3 editors for additional KYC verification due to high-volume payouts.</p>
              </div>
              <button className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                Review Queue (3)
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SecurityStatCard({ title, value, status, icon: Icon, color }: any) {
  const colorMap: any = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    amber: "bg-amber-600 shadow-amber-100",
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

function LogItem({ user, action, ip, time, type }: any) {
  const typeColors: any = {
    critical: "bg-rose-50 text-rose-600",
    warning: "bg-amber-50 text-amber-600",
    info: "bg-indigo-50 text-indigo-600",
    blocked: "bg-slate-900 text-white",
  };

  return (
    <div className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
      <div className="flex items-center gap-6">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", typeColors[type])}>
          {type === 'blocked' ? <ShieldAlert className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
        </div>
        <div>
          <p className="text-sm font-black text-slate-900">{user}</p>
          <p className="text-xs font-bold text-slate-500 mt-1">{action}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ip}</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{time}</p>
      </div>
    </div>
  );
}

function ControlToggle({ label, active }: any) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-bold text-white/80">{label}</span>
      <div className={cn(
        "h-6 w-12 rounded-full relative cursor-pointer transition-all duration-500",
        active ? 'bg-indigo-500' : 'bg-white/10'
      )}>
        <div className={cn(
          "absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-500 shadow-lg",
          active ? 'left-7' : 'left-1'
        )} />
      </div>
    </div>
  );
}
