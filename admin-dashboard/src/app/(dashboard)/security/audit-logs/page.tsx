"use client";

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Download, Eye, Search } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data?.success) setLogs(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const editorName = log.editor?.user?.name?.toLowerCase() || '';
    const orderId = log.orderId?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return editorName.includes(term) || orderId.includes(term);
  });

  if (loading) return (
    <div className="flex justify-center items-center p-24">
      <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">File Access Audit Logs</h1>
          <p className="text-slate-500 mt-2">Track every file access event by editors for accountability.</p>
        </div>
        <Badge variant="outline" className="text-sm px-4 py-2 bg-indigo-50 text-indigo-700 border-indigo-200">
          {logs.length} Events Logged
        </Badge>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by editor name or order ID..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Editor</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">File Type</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">IP Address</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-slate-400">
                  <FileText className="mx-auto w-10 h-10 mb-3 text-slate-300" />
                  <p className="font-medium">No access logs found</p>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, i) => (
                <tr key={log.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {(log.editor?.user?.name || 'E')[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800 text-sm">{log.editor?.user?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                      #{log.orderId?.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={
                      log.fileType === 'ORIGINAL' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      log.fileType === 'DRAFT' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }>
                      {log.fileType}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      {log.action === 'DOWNLOAD' ? (
                        <><Download className="w-4 h-4 text-orange-500" /> Download</>
                      ) : (
                        <><Eye className="w-4 h-4 text-blue-500" /> View</>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-slate-500">{log.ipAddress || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
