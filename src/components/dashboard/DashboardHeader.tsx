import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function DashboardHeader() {
  return (
    <header className="h-16 flex items-center gap-4 px-6 border-b border-blue-100 bg-white/80 backdrop-blur-sm py-[38px]">
      <SidebarTrigger className="text-blue-600" />
      <div className="flex-1">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 text-sm">Welcome back! Here's what's happening with your platform.</p>
      </div>
    </header>
  );
}