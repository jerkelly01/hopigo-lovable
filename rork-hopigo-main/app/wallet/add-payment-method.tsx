import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useWalletStore } from '@/store/wallet-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreditCard, Calendar, User } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function AddPaymentMethodScreen() {
  const router = useRouter();
  const { addPaymentMethod, isLoading } = useWalletStore();
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    let formatted = '';
    for (let i = 0; i < digits.length; i += 4) {
      formatted += digits.slice(i, i + 4) + ' ';
    }
    
    return formatted.trim();
  };
  
  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    }
    
    return digits;
  };
  
  const handleCardNumberChange = (value: string) => {
    setCardNumber(formatCardNumber(value));
  };
  
  const handleExpiryDateChange = (value: string) => {
    setExpiryDate(formatExpiryDate(value));
  };
  
  const handleAddPaymentMethod = async () => {
    // Validate inputs
    if (!cardNumber.trim() || !cardholderName.trim() || !expiryDate.trim() || !cvv.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    
    // Basic validation
    const cardNumberDigits = cardNumber.replace(/\D/g, '');
    if (cardNumberDigits.length < 13 || cardNumberDigits.length > 19) {
      Alert.alert('Invalid Card Number', 'Please enter a valid card number');
      return;
    }
    
    if (cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a valid CVV');
      return;
    }
    
    // Validate expiry date format (MM/YY)
    const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryPattern.test(expiryDate)) {
      Alert.alert('Invalid Expiry Date', 'Please enter a valid expiry date (MM/YY)');
      return;
    }
    
    try {
      // Determine card type based on first digit
      const firstDigit = cardNumberDigits.charAt(0);
      let cardType = 'Visa'; // Default
      
      if (firstDigit === '4') {
        cardType = 'Visa';
      } else if (firstDigit === '5') {
        cardType = 'Mastercard';
      } else if (firstDigit === '3') {
        cardType = 'Amex';
      } else if (firstDigit === '6') {
        cardType = 'Discover';
      }
      
      await addPaymentMethod({
        type: 'card',
        name: cardType,
        last4: cardNumberDigits.slice(-4),
        expiryDate: expiryDate,
        isDefault: false,
      });
      
      Alert.alert(
        'Success',
        'Payment method added successfully',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment method. Please try again.');
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Add Payment Method',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Add Credit or Debit Card</Text>
        
        <Card style={styles.card}>
          <Input
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            keyboardType="numeric"
            maxLength={19}
            leftIcon={<CreditCard size={20} color={Colors.textSecondary} />}
          />
          
          <Input
            label="Cardholder Name"
            placeholder="John Doe"
            value={cardholderName}
            onChangeText={setCardholderName}
            leftIcon={<User size={20} color={Colors.textSecondary} />}
          />
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={handleExpiryDateChange}
                keyboardType="numeric"
                maxLength={5}
                leftIcon={<Calendar size={20} color={Colors.textSecondary} />}
              />
            </View>
            
            <View style={styles.halfInput}>
              <Input
                label="CVV"
                placeholder="123"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={4}
                isPassword
              />
            </View>
          </View>
        </Card>
        
        <Text style={styles.securityNote}>
          Your payment information is securely stored and processed according to industry standards.
        </Text>
        
        <Button
          title="Add Card"
          isLoading={isLoading}
          onPress={handleAddPaymentMethod}
          style={styles.addButton}
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
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  securityNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  addButton: {
    marginBottom: 24,
  },
});