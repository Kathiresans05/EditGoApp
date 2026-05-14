'use client';

import React from 'react';
import { 
  Sparkles, Brain, Cpu, TrendingUp, 
  MessageSquare, Lightbulb, Zap, ArrowRight,
  BarChart3, PieChart, Layers, Target,
  RefreshCcw, Bot
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@ard';
import { cn } from '@/lib/utils';

export default function AIInsightsPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
            <Bot className="h-3 w-3 animate-bounce" />
            EditGo AI Engine v4.0
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Marketplace <span className="text-gradient">Intelligence</span></h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Autonomous neural networks analyzing marketplace dynamics to provide actionable insights and predictive growth models.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:shadow-lg transition-all uppercase tracking-widest">
            <RefreshCcw className="h-4 w-4" />
            Retrain Models
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-xs font-black hover:shadow-xl hover:shadow-indigo-200 transition-all uppercase tracking-widest group">
            <Sparkles className="h-4 w-4" />
            Generate New Report
          </button>
        </div>
      </div>

      {/* Neural Core Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <NeuralCard 
          title="Predictive Gross Volume" 
          value="₹12.4M" 
          desc="Next 30 days forecast based on current velocity and seasonal trends."
          icon={TrendingUp}
          confidence={94}
          color="indigo"
        />
        <NeuralCard 
          title="Churn Risk Analysis" 
          value="Low (1.2%)" 
          desc="AI detected high engagement patterns across 89% of top-tier editors."
          icon={Brain}
          confidence={88}
          color="emerald"
        />
        <NeuralCard 
          title="Market Gap Detected" 
          value="Wedding Shorts" 
          desc="High demand surge detected for vertical wedding content in Tier-2 cities."
          icon={Lightbulb}
          confidence={91}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommendation Engine */}
        <Card className="lg:col-span-2 border-none glass-card rounded-[3rem] overflow-hidden">
          <CardHeader className="p-10 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Strategic Recommendations</CardTitle>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Autonomous Strategy Engine</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <RecommendationItem 
              impact="High" 
              title="Increase Commission for Cinematic Tier" 
              desc="Current data suggests customers are willing to pay 15% more for premium cinematic edits. Adjusting base prices by ₹500 could increase MRR by ₹1.2M." 
              tags={['Revenue', 'Pricing Strategy']}
            />
            <RecommendationItem 
              impact="Medium" 
              title="Onboard 50+ Specialized Reel Editors" 
              desc="Social media vertical content backlog is growing by 12% week-over-week. Current supply will be exhausted by June 15th." 
              tags={['Operations', 'Supply Chain']}
            />
            <RecommendationItem 
              impact="High" 
              title="Deploy Automated QC for 'Basic' Tier" 
              desc="AI-powered quality control can handle 90% of basic edits, reducing manual review time for moderators by 45 hours/week." 
              tags={['Efficiency', 'AI Automation']}
            />
          </CardContent>
        </Card>

        {/* AI Health & Specs */}
        <div className="space-y-8">
          <Card className="border-none glass-card rounded-[3rem] overflow-hidden bg-slate-900 text-white">
            <CardHeader className="p-8 border-b border-white/10">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Cpu className="h-5 w-5 text-indigo-400" />
                Compute Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <TechStat label="Neural Latency" value="142ms" progress={85} />
                <TechStat label="Data Throughput" value="1.2 TB/d" progress={65} />
                <TechStat label="Model Accuracy" value="98.2%" progress={98} />
                <TechStat label="Cluster Health" value="Optimal" progress={100} />
              </div>
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Sync</p>
                    <p className="text-sm font-bold">Today, 09:42 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none glass-card rounded-[3rem] overflow-hidden group cursor-pointer">
            <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
              <div className="h-20 w-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center transform transition-transform group-hover:scale-110 duration-500">
                <MessageSquare className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Ask Intelligence</h3>
                <p className="text-sm font-medium text-slate-500">Query the neural network for custom reports or marketplace simulations.</p>
              </div>
              <div className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center text-slate-400 text-xs font-bold transition-all group-hover:border-indigo-200">
                Type your command...
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function NeuralCard({ title, value, desc, icon: Icon, confidence, color }: any) {
  const colorMap: any = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    emerald: "bg-emerald-600 shadow-emerald-100",
    amber: "bg-amber-600 shadow-amber-100",
  };

  return (
    <Card className="border-none glass-card rounded-[2.5rem] overflow-hidden group hover:-translate-y-2 transition-all duration-500">
      <CardContent className="p-10">
        <div className="flex items-center justify-between mb-8">
          <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-xl transform transition-transform group-hover:rotate-12 duration-500", colorMap[color])}>
            <Icon className="h-7 w-7" />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence</p>
            <p className="text-lg font-black text-slate-900">{confidence}%</p>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
          <p className="text-sm font-medium text-slate-500 leading-relaxed pt-2 border-t border-slate-50">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendationItem({ impact, title, desc, tags }: any) {
  return (
    <div className="p-8 bg-white/50 rounded-[2rem] border border-white/20 shadow-sm hover:shadow-xl transition-all duration-500 group">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <Badge className={cn(
              "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest",
              impact === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
            )}>
              {impact} Impact
            </Badge>
            <div className="flex items-center gap-2">
              {tags.map((tag: any) => (
                <span key={tag} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 bg-slate-50 rounded-lg">{tag}</span>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{title}</h4>
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-2xl">{desc}</p>
          </div>
        </div>
        <button className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg group-hover:scale-110">
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function TechStat({ label, value, progress }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-black">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}
