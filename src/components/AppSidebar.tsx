
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Car,
  Calendar,
  DollarSign,
  Bell,
  Settings,
  BarChart3,
  Shield,
  Gift,
  CreditCard,
  MapPin,
  FileText,
  UserCheck,
  AlertTriangle,
  Globe,
  Database,
  LogOut
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuthContext } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';

const mainMenuItems = [
  { 
    title: 'Dashboard', 
    url: '/', 
    icon: LayoutDashboard,
    description: 'Overview & Analytics'
  },
  { 
    title: 'Users', 
    url: '/users', 
    icon: Users,
    description: 'Manage all users'
  },
  { 
    title: 'Service Providers', 
    url: '/providers', 
    icon: ShoppingBag,
    description: 'Manage service providers'
  },
  { 
    title: 'Taxi Drivers', 
    url: '/drivers', 
    icon: Car,
    description: 'Manage taxi drivers'
  },
];

const transactionItems = [
  { 
    title: 'Bookings', 
    url: '/bookings', 
    icon: Calendar,
    description: 'Service bookings'
  },
  { 
    title: 'Ride Bookings', 
    url: '/ride-bookings', 
    icon: Car,
    description: 'Taxi ride bookings'
  },
  { 
    title: 'Payments', 
    url: '/payments', 
    icon: DollarSign,
    description: 'Payment transactions'
  },
  { 
    title: 'Money Transfers', 
    url: '/transfers', 
    icon: CreditCard,
    description: 'User money transfers'
  },
];

const contentItems = [
  { 
    title: 'Services', 
    url: '/services', 
    icon: FileText,
    description: 'Manage services'
  },
  { 
    title: 'Events', 
    url: '/events', 
    icon: Calendar,
    description: 'Manage events'
  },
  { 
    title: 'Advertisements', 
    url: '/ads', 
    icon: Globe,
    description: 'Manage advertisements'
  },
  { 
    title: 'Loyalty Programs', 
    url: '/loyalty', 
    icon: Gift,
    description: 'Loyalty & rewards'
  },
];

const systemItems = [
  { 
    title: 'Analytics', 
    url: '/analytics', 
    icon: BarChart3,
    description: 'Platform analytics'
  },
  { 
    title: 'Notifications', 
    url: '/notifications', 
    icon: Bell,
    description: 'System notifications'
  },
  { 
    title: 'Verification', 
    url: '/verification', 
    icon: UserCheck,
    description: 'User verification'
  },
  { 
    title: 'Reports', 
    url: '/reports', 
    icon: FileText,
    description: 'System reports'
  },
  { 
    title: 'Emergency', 
    url: '/emergency', 
    icon: AlertTriangle,
    description: 'Emergency services'
  },
];

const settingsItems = [
  { 
    title: 'App Settings', 
    url: '/settings', 
    icon: Settings,
    description: 'Application settings'
  },
  { 
    title: 'Roles & Permissions', 
    url: '/roles', 
    icon: Shield,
    description: 'User roles'
  },
  { 
    title: 'Database', 
    url: '/database', 
    icon: Database,
    description: 'Database management'
  },
  { 
    title: 'Locations', 
    url: '/locations', 
    icon: MapPin,
    description: 'Manage locations'
  },
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const { signOut } = useAuthContext();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const MenuGroup = ({ 
    label, 
    items 
  }: { 
    label: string; 
    items: typeof mainMenuItems;
  }) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={isActive(item.url)}
                className="group relative hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-100 data-[active=true]:to-purple-100 data-[active=true]:text-purple-700 data-[active=true]:font-semibold"
              >
                <NavLink to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200">
                  <item.icon className="h-5 w-5 shrink-0 text-blue-600" />
                  {!collapsed && (
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">{item.title}</span>
                      <span className="text-xs text-gray-500 truncate">{item.description}</span>
                    </div>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className="border-r border-blue-100 bg-gradient-to-b from-blue-50/50 to-purple-50/50">
      <SidebarHeader className="p-4 border-b border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HopiGo Admin
              </h2>
              <p className="text-xs text-gray-500">Management Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <MenuGroup label="Main" items={mainMenuItems} />
        <MenuGroup label="Transactions" items={transactionItems} />
        <MenuGroup label="Content" items={contentItems} />
        <MenuGroup label="System" items={systemItems} />
        <MenuGroup label="Settings" items={settingsItems} />
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-blue-100">
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
