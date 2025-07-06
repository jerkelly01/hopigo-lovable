
import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign, BarChart } from 'lucide-react';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState('last30days');

  const reportTypes = [
    { id: 'user-activity', name: 'User Activity Report', icon: Users },
    { id: 'revenue', name: 'Revenue Report', icon: DollarSign },
    { id: 'service-performance', name: 'Service Performance', icon: BarChart },
    { id: 'booking-analytics', name: 'Booking Analytics', icon: Calendar },
    { id: 'growth-metrics', name: 'Growth Metrics', icon: TrendingUp },
    { id: 'financial-summary', name: 'Financial Summary', icon: FileText }
  ];

  const generateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId} for ${dateRange}`);
    // Report generation logic would go here
  };

  return (
    <AdminLayout title="Reports & Analytics" description="Generate and view detailed business reports">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-100">Available Reports</CardTitle>
              <FileText className="h-4 w-4 text-indigo-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{reportTypes.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Reports Generated</CardTitle>
              <Download className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">143</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">23</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Data Points</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12.4K</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Report Type</label>
                    <Select value={selectedReport} onValueChange={setSelectedReport}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map(report => (
                          <SelectItem key={report.id} value={report.id}>
                            {report.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date Range</label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last7days">Last 7 days</SelectItem>
                        <SelectItem value="last30days">Last 30 days</SelectItem>
                        <SelectItem value="last90days">Last 90 days</SelectItem>
                        <SelectItem value="lastyear">Last year</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={() => generateReport(selectedReport)} 
                  disabled={!selectedReport}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Revenue Report', date: '2024-01-15', type: 'PDF' },
                  { name: 'User Activity', date: '2024-01-14', type: 'CSV' },
                  { name: 'Service Performance', date: '2024-01-13', type: 'PDF' },
                  { name: 'Booking Analytics', date: '2024-01-12', type: 'Excel' }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-sm">{report.name}</p>
                      <p className="text-xs text-gray-500">{report.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{report.type}</span>
                      <Button size="sm" variant="ghost">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <report.icon className="h-5 w-5" />
                  {report.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Generate detailed {report.name.toLowerCase()} with comprehensive insights and data visualization.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateReport(report.id)}
                >
                  Generate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
