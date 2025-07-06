import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Transaction } from '@/types/wallet';
import { ArrowUpRight, ArrowDownLeft, CreditCard, Send } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'payment':
        return <ArrowUpRight size={20} color={Colors.error} />;
      case 'deposit':
        return <ArrowDownLeft size={20} color={Colors.success} />;
      case 'transfer':
        return <Send size={20} color={Colors.primary} />;
      case 'withdrawal':
        return <CreditCard size={20} color={Colors.warning} />;
      default:
        return null;
    }
  };
  
  const getAmountColor = () => {
    switch (transaction.type) {
      case 'payment':
      case 'transfer':
      case 'withdrawal':
        return Colors.error;
      case 'deposit':
        return Colors.success;
      default:
        return Colors.text;
    }
  };
  
  const getAmountPrefix = () => {
    switch (transaction.type) {
      case 'payment':
      case 'transfer':
      case 'withdrawal':
        return '-';
      case 'deposit':
        return '+';
      default:
        return '';
    }
  };
  
  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {transaction.recipient?.avatar ? (
            <Image 
              source={{ uri: transaction.recipient.avatar }} 
              style={styles.avatar} 
            />
          ) : (
            <View style={styles.iconBackground}>
              {getTransactionIcon()}
            </View>
          )}
        </View>
        
        <View style={styles.details}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text style={styles.date}>
            {formatDate(transaction.date)}
          </Text>
        </View>
        
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: getAmountColor() }]}>
            {getAmountPrefix()}{transaction.amount} {transaction.currency}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
});