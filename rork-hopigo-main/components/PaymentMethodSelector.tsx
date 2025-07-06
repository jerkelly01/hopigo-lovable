import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PaymentMethod } from '@/types/wallet';
import { Card } from '@/components/ui/Card';
import { CreditCard, Building, Plus, Check, Wallet } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface PaymentMethodSelectorProps {
  paymentMethods: Array<PaymentMethod | { id: string; type: 'wallet'; name: string; last4: string; isDefault: boolean }>;
  selectedPaymentMethodId: string | null;
  onSelectPaymentMethod: (paymentMethodId: string) => void;
  onAddPaymentMethod: () => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethods,
  selectedPaymentMethodId,
  onSelectPaymentMethod,
  onAddPaymentMethod,
}) => {
  const getMethodIcon = (method: any) => {
    if (method.type === 'wallet') {
      return <Wallet size={24} color={Colors.primary} />;
    } else if (method.type === 'card') {
      return <CreditCard size={24} color={Colors.primary} />;
    } else {
      return <Building size={24} color={Colors.primary} />;
    }
  };

  const getMethodDetails = (method: any) => {
    if (method.type === 'wallet') {
      return 'Digital wallet';
    }
    return `****${method.last4}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.methodsList}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedPaymentMethodId === method.id && styles.selectedMethodCard
            ]}
            onPress={() => onSelectPaymentMethod(method.id)}
            activeOpacity={0.7}
          >
            <View style={styles.methodContent}>
              <View style={styles.methodIcon}>
                {getMethodIcon(method)}
              </View>
              
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>{method.name}</Text>
                <Text style={styles.methodDetails}>{getMethodDetails(method)}</Text>
                {method.type === 'card' && 'expiryMonth' in method && method.expiryMonth && 'expiryYear' in method && method.expiryYear ? (
                  <Text style={styles.methodExpiry}>Exp: {method.expiryMonth}/{method.expiryYear}</Text>
                ) : null}
              </View>
              
              {selectedPaymentMethodId === method.id && (
                <View style={styles.checkIcon}>
                  <Check size={20} color={Colors.white} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={styles.addMethodCard}
          onPress={onAddPaymentMethod}
          activeOpacity={0.7}
        >
          <View style={styles.addMethodContent}>
            <View style={styles.addIcon}>
              <Plus size={24} color={Colors.primary} />
            </View>
            <View style={styles.addMethodInfo}>
              <Text style={styles.addMethodText}>Add New Payment Method</Text>
              <Text style={styles.addMethodSubtext}>Credit card or bank account</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      
      {selectedPaymentMethodId ? (
        <View style={styles.selectedPaymentContainer}>
          <Text style={styles.selectedPaymentLabel}>Selected Payment Method:</Text>
          <Text style={styles.selectedPaymentValue}>
            {paymentMethods.find(m => m.id === selectedPaymentMethodId)?.name} {
              paymentMethods.find(m => m.id === selectedPaymentMethodId)?.last4 && 
              `****${paymentMethods.find(m => m.id === selectedPaymentMethodId)?.last4}`
            }
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  methodsList: {
    gap: 12,
  },
  methodCard: {
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectedMethodCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  methodIcon: {
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  methodDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  methodExpiry: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMethodCard: {
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  addMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  addIcon: {
    marginRight: 16,
  },
  addMethodInfo: {
    flex: 1,
  },
  addMethodText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  addMethodSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  selectedPaymentContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.success + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  selectedPaymentLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  selectedPaymentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success,
  },
});