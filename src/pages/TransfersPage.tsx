
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TransferStats } from '@/components/TransferStats';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowRightLeft, Search, RefreshCw, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type MoneyTransfer = Tables<'money_transfers'>;

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<MoneyTransfer[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<MoneyTransfer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransfers();
  }, []);

  useEffect(() => {
    const filtered = transfers.filter(transfer =>
      transfer.sender_id.includes(searchTerm) ||
      transfer.receiver_id.includes(searchTerm) ||
      transfer.amount.toString().includes(searchTerm) ||
      transfer.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransfers(filtered);
  }, [transfers, searchTerm]);

  const fetchTransfers = async () => {
    try {
      const { data, error } = await supabase
        .from('money_transfers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransfers(data || []);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch money transfers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTransferStatus = async (transferId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('money_transfers')
        .update({ status: newStatus })
        .eq('id', transferId);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Transfer ${newStatus} successfully`,
      });
      
      await fetchTransfers();
    } catch (error) {
      console.error('Error updating transfer status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update transfer status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Money Transfers" description="Monitor user money transfers and transaction history">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading money transfers...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Money Transfers" description="Monitor user money transfers and transaction history">
      <div className="space-y-6">
        <TransferStats transfers={transfers} />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Money Transfers ({filteredTransfers.length})
              </span>
              <Button onClick={fetchTransfers} size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transfers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {filteredTransfers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No money transfers found.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell className="font-medium">
                          AWG {transfer.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-mono">
                            {transfer.sender_id.slice(0, 8)}...
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-mono">
                            {transfer.receiver_id.slice(0, 8)}...
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(transfer.status)}>
                            {transfer.status || 'pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transfer.message ? (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3 text-gray-400" />
                              <span className="text-sm truncate max-w-[100px]">
                                {transfer.message}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">No message</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {transfer.created_at ? new Date(transfer.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {transfer.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateTransferStatus(transfer.id, 'completed')}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateTransferStatus(transfer.id, 'failed')}
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
