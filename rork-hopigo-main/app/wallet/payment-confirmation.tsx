import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ArrowLeft, CreditCard, Tag, Zap, Droplet, Wifi, Phone, Heart } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function PaymentConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const {
    type,
    eventId,
    eventTitle,
    amount,
    quantity,
    provider,
    location,
    category,
    account,
    causeId,
    causeTitle,
  } = params;

  const isDealPurchase = type === 'deal-purchase';
  const isBillPayment = type === 'bill-payment';
  const isDonation = type === 'donation';

  const handleDone = () => {
    router.push('/(tabs)/wallet');
  };

  const handleViewItems = () => {
    if (isDonation) {
      router.push('/donations');
    } else if (isDealPurchase) {
      router.push('/deals');
    } else {
      router.push('/my-tickets');
    }
  };

  const getBillIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'electricity': return Zap;
      case 'water': return Droplet;
      case 'internet': return Wifi;
      case 'phone': return Phone;
      default: return Tag;
    }
  };

  const getBillCategoryName = (categoryId: string) => {
    switch (categoryId) {
      case 'electricity': return 'Electricity';
      case 'water': return 'Water';
      case 'internet': return 'Internet';
      case 'phone': return 'Phone';
      default: return 'Bill';
    }
  };

  const getTitle = () => {
    if (isDonation) return 'Donation Details';
    if (isDealPurchase) return 'Deal Details';
    if (isBillPayment) return 'Payment Details';
    return 'Ticket Details';
  };

  const getIcon = () => {
    if (isDonation) return Heart;
    if (isBillPayment) return getBillIcon(category as string);
    return Tag;
  };

  const getEventTitle = () => {
    if (isDonation) return causeTitle;
    if (isBillPayment) return `${getBillCategoryName(category as string)} Bill Payment`;
    return eventTitle;
  };

  const getSuccessMessage = () => {
    if (isDonation) return 'Your donation has been processed successfully';
    if (isDealPurchase) return 'Your deal purchase has been confirmed';
    if (isBillPayment) return 'Your bill payment has been processed';
    return 'Your ticket purchase has been confirmed';
  };

  const getViewButtonTitle = () => {
    if (isDonation) return 'View My Donations';
    if (isDealPurchase) return 'View My Deals';
    return 'View My Tickets';
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Payment Confirmation',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.successIcon}>
            <CheckCircle size={64} color={Colors.success} />
          </View>
          <Text style={styles.title}>
            {isDonation ? 'Donation Successful!' : 'Payment Successful!'}
          </Text>
          <Text style={styles.subtitle}>
            {getSuccessMessage()}
          </Text>
        </View>

        <Card style={styles.confirmationCard}>
          <View style={styles.cardHeader}>
            {React.createElement(getIcon(), { size: 24, color: Colors.primary })}
            <Text style={styles.cardTitle}>
              {getTitle()}
            </Text>
          </View>
          
          <View style={styles.ticketInfo}>
            <Text style={styles.eventTitle}>
              {getEventTitle()}
            </Text>
            <View style={styles.ticketDetails}>
              {!isDealPurchase && !isBillPayment && !isDonation && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quantity:</Text>
                  <Text style={styles.detailValue}>{quantity} ticket{parseInt(quantity as string) > 1 ? 's' : ''}</Text>
                </View>
              )}
              {isDealPurchase && provider && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Provider:</Text>
                  <Text style={styles.detailValue}>{provider}</Text>
                </View>
              )}
              {isDealPurchase && location && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>{location}</Text>
                </View>
              )}
              {isBillPayment && account && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Account Number:</Text>
                  <Text style={styles.detailValue}>{account}</Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {isDonation ? 'Donation Amount:' : 'Total Amount:'}
                </Text>
                <Text style={styles.detailValue}>AWG {amount}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Method:</Text>
                <View style={styles.paymentMethod}>
                  <CreditCard size={16} color={Colors.textSecondary} />
                  <Text style={styles.detailValue}>•••• 4242</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transaction ID:</Text>
                <Text style={styles.detailValue}>TXN{Date.now().toString().slice(-8)}</Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.actions}>
          {!isBillPayment && (
            <Button
              title={getViewButtonTitle()}
              onPress={handleViewItems}
              style={styles.viewItemsButton}
            />
          )}
          <TouchableOpacity 
            style={styles.doneButton}
            onPress={handleDone}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 40,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 24,
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
  confirmationCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 12,
  },
  ticketInfo: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 20,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  ticketDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  viewItemsButton: {
    marginBottom: 8,
  },
  doneButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});