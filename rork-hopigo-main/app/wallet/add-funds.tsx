import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useWalletStore } from '@/store/wallet-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreditCard, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function AddFundsScreen() {
  const router = useRouter();
  const { addFunds, currency } = useWalletStore();
  
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const predefinedAmounts = [50, 100, 200, 500];
  
  const handleAmountChange = (value: string) => {
    setAmount(value);
    setSelectedAmount(null);
  };
  
  const handlePredefinedAmount = (value: number) => {
    setSelectedAmount(value);
    setAmount(value.toString());
  };
  
  const handleAddFunds = async () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await addFunds(numAmount, 'Credit Card ****4582');
      Alert.alert(
        'Success',
        `${numAmount} ${currency} has been added to your wallet`,
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add funds. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Add Funds',
          headerTitleStyle: {
            fontWeight: '600',
            color: '#ffffff',
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
        <Text style={styles.title}>Add Money to Your Wallet</Text>
        
        {/* Amount Input */}
        <Card style={styles.card}>
          <Text style={styles.label}>Enter Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>{currency}</Text>
            <Input
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholder="0.00"
              containerStyle={styles.amountInput}
              inputStyle={styles.amountInputField}
            />
          </View>
          
          <View style={styles.predefinedAmounts}>
            {predefinedAmounts.map((value) => (
              <Button
                key={value}
                title={`${value} ${currency}`}
                variant={selectedAmount === value ? 'primary' : 'outline'}
                size="small"
                style={styles.amountButton}
                onPress={() => handlePredefinedAmount(value)}
              />
            ))}
          </View>
        </Card>
        
        {/* Payment Method */}
        <Card style={styles.card}>
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.paymentMethod}>
            <CreditCard size={24} color={Colors.primary} />
            <View style={styles.paymentMethodDetails}>
              <Text style={styles.paymentMethodName}>Visa ****4582</Text>
              <Text style={styles.paymentMethodExpiry}>Expires 12/26</Text>
            </View>
          </View>
          <Button
            title="Add New Payment Method"
            variant="outline"
            onPress={() => router.push('/wallet/payment-methods')}
            style={styles.addPaymentButton}
          />
        </Card>
        
        <Button
          title="Add Funds"
          isLoading={isLoading}
          disabled={!amount || parseFloat(amount) <= 0}
          onPress={handleAddFunds}
          style={styles.addFundsButton}
        />
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
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  predefinedAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  amountButton: {
    margin: 4,
    minWidth: 80,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentMethodDetails: {
    marginLeft: 12,
  },
  paymentMethodName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  paymentMethodExpiry: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addPaymentButton: {
    marginTop: 8,
  },
  addFundsButton: {
    marginTop: 16,
  },
});