"use client";

import React, { useState, useEffect } from 'react';
import { Save, Gift, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const [referralReward, setReferralReward] = useState('20');
  const [platformCommission, setPlatformCommission] = useState('20');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data?.success) {
        if (res.data.data.REFERRAL_REWARD) setReferralReward(res.data.data.REFERRAL_REWARD);
        if (res.data.data.PLATFORM_COMMISSION) setPlatformCommission(res.data.data.PLATFORM_COMMISSION);
      }
    } catch (e) {
      console.error('Error fetching settings', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/settings/update', { 
        settings: { 
          REFERRAL_REWARD: referralReward,
          PLATFORM_COMMISSION: platformCommission
        } 
      });
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to update settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Platform Settings</h1>
        <p className="text-slate-500 font-medium">Manage global configuration for the EditGo ecosystem.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-2xl">
            <Gift className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Referral Program</h2>
            <p className="text-sm text-slate-500">Configure rewards for user invitations.</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Referral Reward */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Reward Amount per Referral (₹)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={referralReward}
                onChange={(e) => setReferralReward(e.target.value)}
                className="w-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Platform Commission */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Platform Commission (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={platformCommission}
                onChange={(e) => setPlatformCommission(e.target.value)}
                className="w-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
            {message.text && (
              <p className={`mt-3 text-sm font-bold ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                {message.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
