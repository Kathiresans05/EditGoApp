'use client';

import React from 'react';
import { 
  LayoutGrid, Plus, Search, Filter, 
  Download, Eye, Star, TrendingUp,
  Image as ImageIcon, Video, Music, Layers,
  ChevronRight, MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@ard';
import { cn } from '@/lib/utils';
import { Badge } from '@adge';

const templates = [
  {
    id: '1',
    name: 'Cyberpunk Vlog Pack',
    category: 'Video Assets',
    creator: '@neon_vfx',
    rating: 4.9,
    sales: 1242,
    price: '₹2,499',
    type: 'Premiere Pro'
  },
  {
    id: '2',
    name: 'Minimalist Social Bundle',
    category: 'Graphics',
    creator: '@studio_line',
    rating: 4.8,
    sales: 856,
    price: '₹1,200',
    type: 'Photoshop'
  },
  {
    id: '3',
    name: 'Cinematic Soundscapes',
    category: 'Audio',
    creator: '@audio_master',
    rating: 5.0,
    sales: 2100,
    price: '₹3,500',
    type: 'WAV'
  },
  {
    id: '4',
    name: 'Real Estate Drone LUTs',
    category: 'Color Grading',
    creator: '@sky_high',
    rating: 4.7,
    sales: 540,
    price: '₹1,800',
    type: 'Cube'
  },
  {
    id: '5',
    name: 'Abstract Transition Pack',
    category: 'Motion Graphics',
    creator: '@motion_lab',
    rating: 4.9,
    sales: 1560,
    price: '₹2,900',
    type: 'After Effects'
  },
  {
    id: '6',
    name: 'Podcast Intro Kit',
    category: 'Audio',
    creator: '@voice_pro',
    rating: 4.6,
    sales: 320,
    price: '₹1,500',
    type: 'MP3'
  }
];

export default function TemplatesMarketplacePage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
            <LayoutGrid className="h-3 w-3" />
            Asset Distribution Hub
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Templates <span className="text-gradient">Marketplace</span></h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Manage, curate, and analyze the performance of premium digital assets sold on the EditGo platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:shadow-lg transition-all uppercase tracking-widest">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black hover:shadow-xl hover:shadow-indigo-200 transition-all uppercase tracking-widest group">
            <Plus className="h-4 w-4" />
            Upload New Asset
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard title="Active Listings" value="2,482" trend="+12" icon={Layers} />
        <SummaryCard title="Total Asset Sales" value="₹24.8M" trend="+₹1.2M" icon={TrendingUp} />
        <SummaryCard title="Top Creator" value="@neon_vfx" trend="5.0 Rating" icon={Star} />
        <SummaryCard title="Download Volume" value="14.2k" trend="+5.4%" icon={Download} />
      </div>

      {/* Marketplace Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-slate-900">Featured Collections</h2>
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 rounded-lg text-[10px] font-black uppercase tracking-widest">All Assets</Badge>
              <Badge variant="outline" className="text-slate-400 border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest">Video</Badge>
              <Badge variant="outline" className="text-slate-400 border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest">Graphics</Badge>
              <Badge variant="outline" className="text-slate-400 border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest">Audio</Badge>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold w-64 focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((item) => (
            <TemplateCard key={item.id} {...item} />
          ))}
        </div>
      </div>

      <div className="pt-10 flex justify-center">
        <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-[0.98]">
          Explore Complete Catalog
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, trend, icon: Icon }: any) {
  return (
    <Card className="border-none glass-card rounded-3xl p-6 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{trend}</span>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
    </Card>
  );
}

function TemplateCard({ name, category, creator, rating, sales, price, type }: any) {
  return (
    <Card className="border-none glass-card rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className="aspect-video bg-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-sm cursor-pointer hover:bg-white transition-colors">
          <Eye className="h-4 w-4" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none rounded-lg text-[9px] font-black uppercase tracking-widest">
            {type}
          </Badge>
        </div>
      </div>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{category}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-black text-slate-900">{rating}</span>
            </div>
          </div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">{name}</h3>
          <p className="text-xs font-bold text-slate-400">by <span className="text-slate-600">{creator}</span></p>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Price</p>
            <p className="text-xl font-black text-slate-900 tracking-tight">{price}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sales</p>
            <p className="text-sm font-black text-slate-600">{sales}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">
            Edit Listing
          </button>
          <button className="h-10 w-10 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
