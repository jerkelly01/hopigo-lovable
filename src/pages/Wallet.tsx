
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet as WalletIcon, Plus, Send, ArrowUpRight, ArrowDownLeft, CreditCard } from 'lucide-react';
import { useAuthContext } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  created_at: string;
  reference_type: string;
  status: string;
}

interface UserData {
  wallet_balance: number;
  loyalty_points: number;
}

export default function Wallet() {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<UserData>({ wallet_balance: 0, loyalty_points: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [addFundsAmount, setAddFundsAmount] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchTransactions();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('wallet_balance, loyalty_points')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async () => {
    if (!addFundsAmount || !user) return;

    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount: parseFloat(addFundsAmount),
          type: 'add_funds',
          payment_method: 'credit_card',
          status: 'completed'
        });

      if (error) throw error;
      
      setAddFundsAmount('');
      fetchUserData();
      fetchTransactions();
    } catch (error) {
      console.error('Error adding funds:', error);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'add_funds':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'service_payment':
      case 'ride_payment':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      default:
        return <WalletIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'add_funds':
        return 'text-green-600';
      case 'service_payment':
      case 'ride_payment':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-gray-600">Manage your balance and transactions</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <WalletIcon className="h-5 w-5 mr-2" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                AWG {userData.wallet_balance.toFixed(2)}
              </div>
              <p className="text-blue-100">Available for spending</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <WalletIcon className="h-5 w-5 mr-2" />
                Loyalty Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {userData.loyalty_points}
              </div>
              <p className="text-orange-100">Redeem for rewards</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="add-funds">Add Funds</TabsTrigger>
            <TabsTrigger value="send-money">Send Money</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest wallet activity</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <WalletIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <p className="font-medium">
                              {transaction.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
                            {transaction.type === 'add_funds' ? '+' : '-'}AWG {transaction.amount.toFixed(2)}
                          </p>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-funds">
            <Card>
              <CardHeader>
                <CardTitle>Add Funds</CardTitle>
                <CardDescription>Top up your wallet balance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (AWG)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={addFundsAmount}
                    onChange={(e) => setAddFundsAmount(e.target.value)}
                    min="1"
                    step="0.01"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[25, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setAddFundsAmount(amount.toString())}
                    >
                      AWG {amount}
                    </Button>
                  ))}
                </div>
                <Button 
                  onClick={handleAddFunds} 
                  className="w-full"
                  disabled={!addFundsAmount || parseFloat(addFundsAmount) <= 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Funds
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="send-money">
            <Card>
              <CardHeader>
                <CardTitle>Send Money</CardTitle>
                <CardDescription>Transfer money to other HopiGo users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient Email</label>
                  <Input placeholder="Enter recipient's email" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (AWG)</label>
                  <Input type="number" placeholder="Enter amount" min="1" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                  <Input placeholder="Add a note..." />
                </div>
                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Money
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
