import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Zap, Droplet, Wifi, Phone } from 'lucide-react-native';
import Colors from '@/constants/colors';

const billCategories = [
  { id: 'electricity', name: 'Electricity', icon: Zap, color: '#FFD93D' },
  { id: 'water', name: 'Water', icon: Droplet, color: '#4ECDC4' },
  { id: 'internet', name: 'Internet', icon: Wifi, color: '#6C5CE7' },
  { id: 'phone', name: 'Phone', icon: Phone, color: '#FF6B6B' },
];

export default function BillPaymentsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(0); // 0: category selection, 1: account number, 2: amount, 3: ready to submit
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const accountInputRef = useRef<TextInput>(null);
  const amountInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep(1);
  };

  // Focus the account input when step becomes 1
  useEffect(() => {
    if (step === 1 && accountInputRef.current) {
      // Small delay to ensure the input is rendered
      setTimeout(() => {
        accountInputRef.current?.focus();
      }, 100);
    } else if (step === 2 && amountInputRef.current) {
      setTimeout(() => {
        amountInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  const handleNextStep = () => {
    if (step === 1 && accountNumber.trim()) {
      setStep(2);
    } else if (step === 2 && amount.trim()) {
      setStep(3);
    }
  };

  const handlePayBill = () => {
    if (!selectedCategory || !accountNumber || !amount) {
      alert('Please fill in all fields');
      return;
    }
    
    // Navigate to payment confirmation
    router.push({
      pathname: '/wallet/payment-confirmation',
      params: {
        type: 'bill-payment',
        category: selectedCategory,
        account: accountNumber,
        amount: amount,
      }
    });
  };

  const canProceedToNext = () => {
    if (step === 1) return accountNumber.trim().length > 0;
    if (step === 2) return amount.trim().length > 0;
    return false;
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Bill Payments',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={20} color={Colors.text} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <KeyboardAvoidingView 
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(keyboardHeight, 20) }
            ]}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Pay Your Bills</Text>
              <Text style={styles.subtitle}>
                Quick and secure bill payments
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Bill Type</Text>
              <View style={styles.categoriesGrid}>
                {billCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryCard,
                        selectedCategory === category.id && styles.selectedCategory
                      ]}
                      onPress={() => handleCategorySelect(category.id)}
                    >
                      <IconComponent 
                        size={24} 
                        color={selectedCategory === category.id ? Colors.white : category.color} 
                      />
                      <Text style={[
                        styles.categoryName,
                        selectedCategory === category.id && styles.selectedCategoryText
                      ]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {selectedCategory && step >= 1 && (
              <View style={[styles.section, styles.formSection]}>
                <Text style={styles.sectionTitle}>Bill Details</Text>
                <Card style={styles.formCard}>
                  {step >= 1 && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Account Number</Text>
                      <TextInput
                        ref={accountInputRef}
                        style={styles.input}
                        placeholder="Enter your account number"
                        value={accountNumber}
                        onChangeText={setAccountNumber}
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          if (canProceedToNext()) {
                            handleNextStep();
                          }
                        }}
                      />
                      
                      {/* Next button positioned right under account number input */}
                      {step === 1 && (
                        <Button
                          title="Next"
                          onPress={handleNextStep}
                          style={[styles.inlineButton, !canProceedToNext() && styles.disabledButton]}
                          disabled={!canProceedToNext()}
                        />
                      )}
                    </View>
                  )}
                  
                  {step >= 2 && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Amount (AWG)</Text>
                      <TextInput
                        ref={amountInputRef}
                        style={styles.input}
                        placeholder="Enter amount to pay"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          if (canProceedToNext()) {
                            handleNextStep();
                          }
                        }}
                      />
                      
                      {/* Next button positioned right under amount input */}
                      {step === 2 && (
                        <Button
                          title="Next"
                          onPress={handleNextStep}
                          style={[styles.inlineButton, !canProceedToNext() && styles.disabledButton]}
                          disabled={!canProceedToNext()}
                        />
                      )}
                    </View>
                  )}
                </Card>
              </View>
            )}

            {keyboardHeight === 0 && (
              <Card style={styles.infoCard}>
                <Text style={styles.infoTitle}>Recent Bills</Text>
                <Text style={styles.infoDescription}>
                  Your recent bill payments will appear here for easy re-payment.
                </Text>
              </Card>
            )}
          </ScrollView>

          {/* Pay Bill button only shows when step === 3 */}
          {step === 3 && (
            <View style={styles.buttonContainer}>
              <Button
                title="Pay Bill"
                onPress={handlePayBill}
                style={styles.button}
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  formSection: {
    // Ensure form section has enough space above keyboard
    minHeight: 200,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: Colors.white,
  },
  formCard: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  inlineButton: {
    width: '100%',
    marginTop: 16,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  button: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});