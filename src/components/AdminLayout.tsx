import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}
export function AdminLayout({
  children,
  title,
  description
}: AdminLayoutProps) {
  const navigate = useNavigate();

  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <header className="relative h-16 flex items-center gap-4 px-6 border-b border-blue-100 bg-white/80 backdrop-blur-sm py-[38px]">
              <SidebarTrigger className="text-blue-600" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                {description && <p className="text-gray-600 text-sm">{description}</p>}
              </div>
              <button
                onClick={() => navigate('/analytics')}
                className="absolute top-3 right-4 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-full flex items-center gap-2 transition-colors"
              >
                <BarChart3 size={16} className="text-white" />
                <span className="text-white text-xs font-medium">Analytics</span>
              </button>
            </header>
            <div className="p-6">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>;
}