"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, FileText, UserCheck, Loader2 } from 'lucide-react-native';
import api from '@/lib/api'; // Assuming there is an API configured

export default function KYCApprovalsPage() {
  const [kycRequests, setKycRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchKYC();
  }, []);

  const fetchKYC = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch from your actual endpoint. 
      // Assuming api wrapper is set up:
      const res = await api.get('/admin/kyc');
      if (res.data?.success) {
        setKycRequests(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessing(id);
    try {
      await api.patch(`/admin/kyc/${id}`, { status });
      fetchKYC();
    } catch (e) {
      console.error('Failed to update KYC');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">KYC Approvals</h1>
          <p className="text-slate-500 mt-2">Verify editor identities before they can accept projects.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {kycRequests.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
            <UserCheck className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-medium text-slate-900">All Caught Up!</h3>
            <p className="text-slate-500">There are no pending KYC requests at the moment.</p>
          </div>
        ) : (
          kycRequests.map((req) => (
            <Card key={req.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center border-b border-slate-100 p-6 gap-6">
                  {/* Editor Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-slate-900">{req.user?.name || 'Anonymous Editor'}</h3>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending Review</Badge>
                    </div>
                    <p className="text-slate-500 text-sm mt-1">{req.user?.email} • {req.user?.phone}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Aadhaar Number</p>
                        <p className="font-mono text-slate-700 mt-1">{req.aadhaarNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">PAN Number</p>
                        <p className="font-mono text-slate-700 mt-1">{req.panNumber}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs font-bold text-slate-400 uppercase">Bank Account</p>
                        <p className="font-mono text-slate-700 mt-1">{req.bankAccount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
                      {req.idDocumentUrl ? (
                        <img src={req.idDocumentUrl} alt="ID" className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="text-slate-300" />
                      )}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-bold">View ID</span>
                      </div>
                    </div>
                    <div className="w-32 h-32 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
                      {req.selfieUrl ? (
                        <img src={req.selfieUrl} alt="Selfie" className="w-full h-full object-cover" />
                      ) : (
                        <UserCheck className="text-slate-300" />
                      )}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-bold">View Selfie</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="bg-slate-50 p-4 flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleAction(req.id, 'REJECTED')}
                    disabled={processing === req.id}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject KYC
                  </Button>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleAction(req.id, 'APPROVED')}
                    disabled={processing === req.id}
                  >
                    {processing === req.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    Approve & Verify
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
