"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, FileText, Eye, AlertTriangle } from 'lucide-react-native';

export default function SecurityDashboard() {
  const sections = [
    {
      title: 'KYC Approvals',
      description: 'Review and approve editor identity verification.',
      icon: <ShieldCheck className="h-6 w-6 text-indigo-600" />, 
      href: '/dashboard/security/kyc',
    },
    {
      title: 'Violation Management',
      description: 'Investigate privacy breaches and take appropriate actions.',
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />, 
      href: '/dashboard/security/violations',
    },
    {
      title: 'File Access Audit Logs',
      description: 'Track all editor file accesses for accountability.',
      icon: <FileText className="h-6 w-6 text-green-600" />, 
      href: '/dashboard/security/audit-logs',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Security & Trust Center</h1>
        <p className="text-slate-500 mt-2">
          Manage editor verification, handle violations, and audit file activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {sections.map((sec) => (
          <Link key={sec.title} href={sec.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center gap-4">
                {sec.icon}
                <CardTitle>{sec.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{sec.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
