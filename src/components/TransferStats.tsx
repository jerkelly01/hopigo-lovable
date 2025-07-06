import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightLeft, DollarSign, TrendingUp, Users } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type MoneyTransfer = Tables<'money_transfers'>;

interface TransferStatsProps {
  transfers: MoneyTransfer[];
}

export const TransferStats: React.FC<TransferStatsProps> = ({ transfers }) => {
  const totalTransfers = transfers.length;
  const totalAmount = transfers.reduce((sum, t) => sum + t.amount, 0);
  const completedTransfers = transfers.filter(t => t.status === 'completed').length;
  const pendingTransfers = transfers.filter(t => t.status === 'pending').length;
  const averageTransfer = totalTransfers > 0 ? totalAmount / totalTransfers : 0;

  const statusStats = transfers.reduce((acc, t) => {
    acc[t.status || 'unknown'] = (acc[t.status || 'unknown'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transfers</CardTitle>
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTransfers}</div>
          <p className="text-xs text-muted-foreground">
            All money transfers
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">AWG {totalAmount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Combined transfers
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalTransfers > 0 ? Math.round((completedTransfers / totalTransfers) * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            {completedTransfers} completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingTransfers}</div>
          <p className="text-xs text-muted-foreground">
            Awaiting processing
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Transfer</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">AWG {averageTransfer.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Average amount
          </p>
        </CardContent>
      </Card>

      {Object.keys(statusStats).length > 0 && (
        <Card className="md:col-span-2 lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-lg">Transfer Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(statusStats).map(([status, count]) => (
                <div key={status} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};