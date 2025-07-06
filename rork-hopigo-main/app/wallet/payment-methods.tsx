import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useWalletStore } from '@/store/wallet-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreditCard, Building, Trash2, Check, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { 
    paymentMethods, 
    defaultPaymentMethodId,
    fetchPaymentMethods,
    setDefaultPaymentMethod,
    removePaymentMethod,
    isLoading,
  } = useWalletStore();
  
  useEffect(() => {
    fetchPaymentMethods();
  }, []);
  
  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id);
    } catch (error) {
      Alert.alert('Error', 'Failed to set default payment method');
    }
  };
  
  const handleRemove = async (id: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              await removePaymentMethod(id);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove payment method');
            }
          }
        }
      ]
    );
  };
  
  const handleAddNew = () => {
    router.push('/wallet/add-payment-method');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Payment Methods',
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
        <Text style={styles.title}>Your Payment Methods</Text>
        
        {paymentMethods.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              You don't have any payment methods yet
            </Text>
            <Button
              title="Add Payment Method"
              onPress={handleAddNew}
              style={styles.emptyButton}
            />
          </Card>
        ) : (
          <>
            {paymentMethods.map((method) => (
              <Card key={method.id} style={styles.methodCard}>
                <View style={styles.methodHeader}>
                  <View style={styles.methodIcon}>
                    {method.type === 'card' ? (
                      <CreditCard size={24} color={Colors.primary} />
                    ) : (
                      <Building size={24} color={Colors.primary} />
                    )}
                  </View>
                  
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    <Text style={styles.methodDetails}>****{method.last4}</Text>
                    {method.expiryDate && (
                      <Text style={styles.methodExpiry}>Expires {method.expiryDate}</Text>
                    )}
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleRemove(method.id)}
                  >
                    <Trash2 size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.methodFooter}>
                  {defaultPaymentMethodId === method.id ? (
                    <View style={styles.defaultBadge}>
                      <Check size={16} color={Colors.white} />
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.setDefaultButton}
                      onPress={() => handleSetDefault(method.id)}
                    >
                      <Text style={styles.setDefaultText}>Set as Default</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Card>
            ))}
            
            <View style={styles.addButtonContainer}>
              <Button
                title="Add New Payment Method"
                variant="outline"
                onPress={handleAddNew}
                style={styles.addButton}
              />
            </View>
          </>
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
    marginBottom: 16,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 200,
  },
  methodCard: {
    marginBottom: 16,
    padding: 16,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  methodDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  methodExpiry: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  methodFooter: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
    marginLeft: 4,
  },
  setDefaultButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  setDefaultText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  addButtonContainer: {
    marginTop: 8,
  },
  addButton: {
    flex: 1,
  },
});