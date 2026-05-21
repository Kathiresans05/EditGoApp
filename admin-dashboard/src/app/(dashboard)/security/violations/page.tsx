"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, AlertTriangle, CheckCircle, Ban, MessageSquare, Loader2 } from 'lucide-react-native';
import api from '@/lib/api'; 

export default function ViolationsPage() {
  const [violations, setViolations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/violations');
      if (res.data?.success) setViolations(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: string, suspendEditor: boolean) => {
    setProcessing(id);
    try {
      await api.patch(`/admin/violations/${id}`, { 
        status, 
        adminNotes: `Resolved by admin action at ${new Date().toISOString()}`,
        suspendEditor
      });
      fetchViolations();
    } catch (e) {
      console.error('Failed to update violation');
    } finally {
      setProcessing(null);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'CRITICAL': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">CRITICAL</Badge>;
      case 'HIGH': return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">HIGH</Badge>;
      case 'MEDIUM': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">MEDIUM</Badge>;
      default: return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">LOW</Badge>;
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Violation Management</h1>
          <p className="text-slate-500 mt-2">Investigate privacy breaches and customer complaints.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {violations.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
            <ShieldAlert className="mx-auto h-12 w-12 text-emerald-400" />
            <h3 className="mt-4 text-lg font-medium text-slate-900">Zero Active Violations</h3>
            <p className="text-slate-500">The platform is secure and no issues are currently reported.</p>
          </div>
        ) : (
          violations.map((violation) => (
            <Card key={violation.id} className="overflow-hidden border-red-100 shadow-sm">
              <div className="bg-red-50 border-b border-red-100 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-red-500 w-5 h-5" />
                  <span className="font-bold text-red-900">Violation #{violation.id.slice(-6).toUpperCase()}</span>
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-200">{violation.type}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  {getSeverityBadge(violation.severity)}
                  <Badge variant="outline" className="bg-white">{violation.status}</Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Reporter Description</h4>
                    <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100 min-h-[100px]">
                      {violation.description}
                    </p>
                    
                    {violation.evidenceUrl && (
                      <Button variant="outline" className="mt-4 text-indigo-600 border-indigo-200">
                        View Attached Evidence
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Target Editor</h4>
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                        {violation.editor?.user?.name?.[0] || 'E'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{violation.editor?.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{violation.editor?.user?.email}</p>
                      </div>
                      <Button size="sm" variant="outline" className="ml-auto">Profile</Button>
                    </div>

                    {violation.status !== 'RESOLVED' && violation.status !== 'DISMISSED' && (
                      <div className="mt-6 flex flex-col gap-3">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          onClick={() => handleAction(violation.id, 'DISMISSED', false)}
                          disabled={processing === violation.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-3" /> Dismiss - No Action Needed
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full justify-start text-amber-600 border-amber-200 hover:bg-amber-50"
                          onClick={() => handleAction(violation.id, 'RESOLVED', false)}
                          disabled={processing === violation.id}
                        >
                          <MessageSquare className="w-4 h-4 mr-3" /> Issue Warning & Resolve
                        </Button>
                        <Button 
                          className="w-full justify-start bg-red-600 hover:bg-red-700"
                          onClick={() => handleAction(violation.id, 'RESOLVED', true)}
                          disabled={processing === violation.id}
                        >
                          <Ban className="w-4 h-4 mr-3" /> Suspend Editor & Resolve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
