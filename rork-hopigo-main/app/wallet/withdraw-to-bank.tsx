import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useWalletStore } from '@/store/wallet-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Building, ChevronDown, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function WithdrawToBankScreen() {
  const router = useRouter();
  const { 
    balance, 
    currency, 
    paymentMethods, 
    fetchPaymentMethods,
    withdrawToBank 
  } = useWalletStore();
  
  const [amount, setAmount] = useState('');
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBankSelector, setShowBankSelector] = useState(false);
  
  // Filter to only show bank accounts
  const bankAccounts = paymentMethods.filter(method => method.type === 'bank');
  
  useEffect(() => {
    fetchPaymentMethods();
  }, []);
  
  useEffect(() => {
    if (bankAccounts.length > 0 && !selectedBankId) {
      setSelectedBankId(bankAccounts[0].id);
    }
  }, [bankAccounts, selectedBankId]);
  
  const selectedBank = bankAccounts.find(bank => bank.id === selectedBankId);
  
  const handleWithdraw = async () => {
    const numAmount = parseFloat(amount);
    
    if (!selectedBank) {
      Alert.alert('Select Bank Account', 'Please select a bank account to withdraw to');
      return;
    }
    
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    
    if (numAmount > balance) {
      Alert.alert(
        'Insufficient Funds',
        `You can only withdraw up to ${balance} ${currency} from your HopiGo wallet.`
      );
      return;
    }
    
    // Minimum withdrawal check
    if (numAmount < 5) {
      Alert.alert(
        'Minimum Withdrawal',
        `Minimum withdrawal amount is 5 ${currency}.`
      );
      return;
    }
    
    Alert.alert(
      'Confirm Withdrawal',
      `Withdraw ${numAmount} ${currency} to ${selectedBank.name} ****${selectedBank.last4}?

This may take 1-3 business days to process.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: async () => {
            setIsLoading(true);
            
            try {
              await withdrawToBank(selectedBank.id, numAmount);
              
              Alert.alert(
                'Withdrawal Initiated',
                `Your withdrawal of ${numAmount} ${currency} has been initiated. The funds will be transferred to your bank account within 1-3 business days.`,
                [
                  { text: 'OK', onPress: () => router.back() }
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to process withdrawal. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };
  
  const handleAddBankAccount = () => {
    router.push('/wallet/add-payment-method');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Withdraw to Bank',
          headerTitleStyle: {
            fontWeight: '600',
            color: '#FFFFFF',
          },
          headerBackground: () => (
            <LinearGradient
              colors={['#5de0e6', '#004aad']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          ),
        }}
      />
      
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Withdraw to Bank Account</Text>
        <Text style={styles.subtitle}>
          Transfer money from your HopiGo wallet to your bank account
        </Text>
        
        {/* Available Balance */}
        <Card style={styles.card}>
          <Text style={styles.label}>Available Balance</Text>
          <Text style={styles.balanceAmount}>{balance} {currency}</Text>
        </Card>
        
        {/* Bank Account Selection */}
        <Card style={styles.card}>
          <Text style={styles.label}>Select Bank Account</Text>
          
          {bankAccounts.length === 0 ? (
            <View style={styles.noBankContainer}>
              <Text style={styles.noBankText}>
                You don't have any bank accounts added yet
              </Text>
              <Button
                title="Add Bank Account"
                variant="outline"
                onPress={handleAddBankAccount}
                style={styles.addBankButton}
              />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.bankSelector}
              onPress={() => setShowBankSelector(!showBankSelector)}
            >
              <View style={styles.bankInfo}>
                <View style={styles.bankIcon}>
                  <Building size={20} color={Colors.primary} />
                </View>
                <View style={styles.bankDetails}>
                  <Text style={styles.bankName}>{selectedBank?.name}</Text>
                  <Text style={styles.bankAccount}>****{selectedBank?.last4}</Text>
                </View>
              </View>
              <ChevronDown size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
          
          {showBankSelector && bankAccounts.length > 1 && (
            <View style={styles.bankOptions}>
              {bankAccounts.map((bank) => (
                <TouchableOpacity
                  key={bank.id}
                  style={styles.bankOption}
                  onPress={() => {
                    setSelectedBankId(bank.id);
                    setShowBankSelector(false);
                  }}
                >
                  <View style={styles.bankInfo}>
                    <View style={styles.bankIcon}>
                      <Building size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.bankDetails}>
                      <Text style={styles.bankName}>{bank.name}</Text>
                      <Text style={styles.bankAccount}>****{bank.last4}</Text>
                    </View>
                  </View>
                  {selectedBankId === bank.id && (
                    <Check size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Card>
        
        {/* Amount Input */}
        {bankAccounts.length > 0 && (
          <Card style={styles.card}>
            <Text style={styles.label}>Withdrawal Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>{currency}</Text>
              <Input
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                containerStyle={styles.amountInput}
                inputStyle={styles.amountInputField}
              />
            </View>
            <Text style={styles.helperText}>
              Minimum: 5 {currency} • Maximum: {balance} {currency}
            </Text>
            <Text style={styles.processingText}>
              Processing time: 1-3 business days
            </Text>
          </Card>
        )}
        
        {bankAccounts.length > 0 && (
          <Button
            title="Withdraw to Bank"
            loading={isLoading}
            disabled={!selectedBank || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
            onPress={handleWithdraw}
            style={styles.withdrawButton}
          />
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 12,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  noBankContainer: {
    alignItems: 'center',
    padding: 16,
  },
  noBankText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  addBankButton: {
    minWidth: 160,
  },
  bankSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bankDetails: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  bankAccount: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bankOptions: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    marginBottom: 0,
  },
  amountInputField: {
    fontSize: 24,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  processingText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  withdrawButton: {
    marginTop: 16,
  },
});