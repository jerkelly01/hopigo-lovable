import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useWalletStore } from '@/store/wallet-store';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TransactionCard } from '@/components/TransactionCard';
import { Plus, Send, Receipt, CreditCard, ArrowDownToLine } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function WalletScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { 
    balance, 
    currency, 
    transactions, 
    isLoading, 
    fetchWallet 
  } = useWalletStore();
  
  useEffect(() => {
    fetchWallet();
  }, []);

  // Handle screen focus to ensure smooth scrolling after navigation
  useFocusEffect(
    React.useCallback(() => {
      // Reset any stuck states when screen comes into focus
      const timer = setTimeout(() => {
        // Any cleanup or reset logic can go here
      }, 50);

      return () => {
        clearTimeout(timer);
      };
    }, [])
  );
  
  const navigateToAddFunds = () => {
    router.push('/wallet/add-funds');
  };
  
  const navigateToSendMoney = () => {
    router.push('/wallet/send-money');
  };
  
  const navigateToSplitBill = () => {
    router.push('/wallet/split-bill');
  };
  
  const navigateToPaymentMethods = () => {
    router.push('/wallet/payment-methods');
  };

  const navigateToWithdrawToBank = () => {
    router.push('/wallet/withdraw-to-bank');
  };

  const handleWalletPress = () => {
    // Add haptic feedback or navigation logic here
    console.log('Wallet balance pressed');
  };
  
  return (
    <View style={styles.container}>
      {/* Balance Card */}
      <TouchableOpacity onPress={handleWalletPress} activeOpacity={0.8}>
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>{balance} {currency}</Text>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={navigateToAddFunds}
            >
              <View style={styles.actionIconContainer}>
                <Plus size={20} color={Colors.white} />
              </View>
              <Text style={styles.actionText}>{t('add')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={navigateToSendMoney}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: Colors.secondary }]}>
                <Send size={20} color={Colors.white} />
              </View>
              <Text style={styles.actionText}>{t('send')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={navigateToWithdrawToBank}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#10B981' }]}>
                <ArrowDownToLine size={20} color={Colors.white} />
              </View>
              <Text style={styles.actionText}>To Bank</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={navigateToSplitBill}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#9C27B0' }]}>
                <Receipt size={20} color={Colors.white} />
              </View>
              <Text style={styles.actionText}>{t('split')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={navigateToPaymentMethods}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#FF9800' }]}>
                <CreditCard size={20} color={Colors.white} />
              </View>
              <Text style={styles.actionText}>{t('cards')}</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </TouchableOpacity>
      
      {/* Transactions List */}
      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>{t('recentTransactions')}</Text>
        
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{t('noTransactionsYet')}</Text>
            <Button 
              title={t('addFundsToGetStarted')} 
              onPress={navigateToAddFunds}
              style={styles.emptyStateButton}
            />
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionCard transaction={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.transactionsList}
            scrollEventThrottle={16}
            decelerationRate="normal"
            bounces={true}
            bouncesZoom={false}
            alwaysBounceVertical={false}
            removeClippedSubviews={false}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 10,
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  balanceCard: {
    margin: 16,
    padding: 20,
  },
  balanceLabel: {
    fontSize: 17,
    color: Colors.text,
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
    marginBottom: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  transactionsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: Colors.text,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  transactionsList: {
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 17,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  emptyStateButton: {
    width: 200,
  },
});