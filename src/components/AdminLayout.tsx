
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <header className="h-16 flex items-center gap-4 px-6 border-b border-blue-100 bg-white/80 backdrop-blur-sm">
              <SidebarTrigger className="text-blue-600" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                {description && (
                  <p className="text-gray-600 text-sm">{description}</p>
                )}
              </div>
            </header>
            <div className="p-6">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
