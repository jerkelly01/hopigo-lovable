import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BarChart3, PieChart, TrendingUp, Users, DollarSign, Calendar, Settings, Trash2, Eye, Edit } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

const widgetTypes = [
  { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
  { id: 'line', name: 'Line Chart', icon: TrendingUp, description: 'Show trends over time' },
  { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Show proportions of a whole' },
  { id: 'metric', name: 'Metric Card', icon: Users, description: 'Display key metrics' }
];

const sampleData = {
  users: [
    { month: 'Jan', value: 400 },
    { month: 'Feb', value: 300 },
    { month: 'Mar', value: 600 },
    { month: 'Apr', value: 800 },
    { month: 'May', value: 700 }
  ],
  revenue: [
    { name: 'Services', value: 35000, color: '#8884d8' },
    { name: 'Rides', value: 25000, color: '#82ca9d' },
    { name: 'Events', value: 15000, color: '#ffc658' },
    { name: 'Other', value: 8000, color: '#ff7300' }
  ]
};

interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  dataSource: string;
  config: any;
  position: { x: number; y: number; w: number; h: number };
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  createdAt: string;
}

export default function DashboardBuilderPage() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    {
      id: '1',
      name: 'Main Dashboard',
      description: 'Overview of key platform metrics',
      widgets: [
        {
          id: 'w1',
          type: 'metric',
          title: 'Total Users',
          dataSource: 'users',
          config: { value: 1250, trend: '+12%' },
          position: { x: 0, y: 0, w: 3, h: 2 }
        },
        {
          id: 'w2',
          type: 'bar',
          title: 'User Growth',
          dataSource: 'user_growth',
          config: { dataKey: 'value' },
          position: { x: 3, y: 0, w: 6, h: 4 }
        }
      ],
      createdAt: '2024-01-15'
    }
  ]);

  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [newDashboard, setNewDashboard] = useState({ name: '', description: '' });
  const [newWidget, setNewWidget] = useState({
    type: '',
    title: '',
    dataSource: '',
    config: {}
  });

  const createDashboard = () => {
    if (!newDashboard.name) {
      toast.error('Dashboard name is required');
      return;
    }

    const dashboard: Dashboard = {
      id: Date.now().toString(),
      name: newDashboard.name,
      description: newDashboard.description,
      widgets: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setDashboards([...dashboards, dashboard]);
    setNewDashboard({ name: '', description: '' });
    setIsCreateOpen(false);
    toast.success('Dashboard created successfully');
  };

  const addWidget = () => {
    if (!selectedDashboard || !newWidget.type || !newWidget.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    const widget: DashboardWidget = {
      id: Date.now().toString(),
      type: newWidget.type,
      title: newWidget.title,
      dataSource: newWidget.dataSource,
      config: newWidget.config,
      position: { x: 0, y: 0, w: 4, h: 3 }
    };

    const updatedDashboard = {
      ...selectedDashboard,
      widgets: [...selectedDashboard.widgets, widget]
    };

    setDashboards(dashboards.map(d => d.id === selectedDashboard.id ? updatedDashboard : d));
    setSelectedDashboard(updatedDashboard);
    setNewWidget({ type: '', title: '', dataSource: '', config: {} });
    setIsWidgetOpen(false);
    toast.success('Widget added successfully');
  };

  const removeWidget = (widgetId: string) => {
    if (!selectedDashboard) return;

    const updatedDashboard = {
      ...selectedDashboard,
      widgets: selectedDashboard.widgets.filter(w => w.id !== widgetId)
    };

    setDashboards(dashboards.map(d => d.id === selectedDashboard.id ? updatedDashboard : d));
    setSelectedDashboard(updatedDashboard);
    toast.success('Widget removed');
  };

  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'metric':
        return (
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-2xl font-bold">{widget.config.value}</p>
              <p className="text-sm text-muted-foreground">{widget.title}</p>
            </div>
            <Badge variant="secondary" className="text-green-600">
              {widget.config.trend}
            </Badge>
          </div>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sampleData.users}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sampleData.users}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={sampleData.revenue}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {sampleData.revenue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      default:
        return <div className="p-4 text-center text-muted-foreground">Unknown widget type</div>;
    }
  };

  return (
    <AdminLayout title="Advanced Analytics" description="Build custom dashboards and analytics views">
      <div className="space-y-6">
        {!selectedDashboard ? (
          <>
            {/* Dashboard List */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Custom Dashboards</h2>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Dashboard
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Dashboard</DialogTitle>
                    <DialogDescription>
                      Create a custom dashboard to visualize your data
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Dashboard Name</Label>
                      <Input
                        id="name"
                        value={newDashboard.name}
                        onChange={(e) => setNewDashboard({ ...newDashboard, name: e.target.value })}
                        placeholder="Enter dashboard name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newDashboard.description}
                        onChange={(e) => setNewDashboard({ ...newDashboard, description: e.target.value })}
                        placeholder="Enter dashboard description"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                    <Button onClick={createDashboard}>Create Dashboard</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboards.map((dashboard) => (
                <Card key={dashboard.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedDashboard(dashboard)}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {dashboard.name}
                      <Badge variant="secondary">{dashboard.widgets.length} widgets</Badge>
                    </CardTitle>
                    <CardDescription>{dashboard.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Created: {dashboard.createdAt}</span>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Dashboard Builder */}
            <div className="flex justify-between items-center">
              <div>
                <Button variant="ghost" onClick={() => setSelectedDashboard(null)}>
                  ← Back to Dashboards
                </Button>
                <h2 className="text-2xl font-bold mt-2">{selectedDashboard.name}</h2>
                <p className="text-muted-foreground">{selectedDashboard.description}</p>
              </div>
              <Dialog open={isWidgetOpen} onOpenChange={setIsWidgetOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Widget
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Widget</DialogTitle>
                    <DialogDescription>
                      Choose a widget type and configure its settings
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="type" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="type">Widget Type</TabsTrigger>
                      <TabsTrigger value="data">Data Source</TabsTrigger>
                      <TabsTrigger value="config">Configuration</TabsTrigger>
                    </TabsList>
                    <TabsContent value="type" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {widgetTypes.map((type) => (
                          <Card
                            key={type.id}
                            className={`cursor-pointer transition-colors ${
                              newWidget.type === type.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                            }`}
                            onClick={() => setNewWidget({ ...newWidget, type: type.id })}
                          >
                            <CardContent className="p-4 text-center">
                              <type.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                              <h3 className="font-medium">{type.name}</h3>
                              <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="data" className="space-y-4">
                      <div>
                        <Label htmlFor="widget-title">Widget Title</Label>
                        <Input
                          id="widget-title"
                          value={newWidget.title}
                          onChange={(e) => setNewWidget({ ...newWidget, title: e.target.value })}
                          placeholder="Enter widget title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="data-source">Data Source</Label>
                        <Select value={newWidget.dataSource} onValueChange={(value) => setNewWidget({ ...newWidget, dataSource: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select data source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="users">Users</SelectItem>
                            <SelectItem value="bookings">Bookings</SelectItem>
                            <SelectItem value="revenue">Revenue</SelectItem>
                            <SelectItem value="payments">Payments</SelectItem>
                            <SelectItem value="providers">Service Providers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                    <TabsContent value="config" className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Additional configuration options will appear here based on the selected widget type.
                      </p>
                    </TabsContent>
                  </Tabs>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsWidgetOpen(false)}>Cancel</Button>
                    <Button onClick={addWidget}>Add Widget</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedDashboard.widgets.map((widget) => (
                <Card key={widget.id} className="relative group">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      {widget.title}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWidget(widget.id)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {renderWidget(widget)}
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedDashboard.widgets.length === 0 && (
              <Card className="p-8 text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No widgets yet</h3>
                <p className="text-muted-foreground mb-4">Add your first widget to start building your dashboard</p>
                <Button onClick={() => setIsWidgetOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Widget
                </Button>
              </Card>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}