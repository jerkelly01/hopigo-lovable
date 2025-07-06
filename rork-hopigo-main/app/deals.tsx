import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Percent, Clock, MapPin, Tag, X, CreditCard, Wallet } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { PaymentMethod } from '@/types/wallet';

interface Deal {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  image: string;
  originalPrice: string;
  discountPrice: string;
  discount: string;
  location: string;
  expiresIn: string;
  category: string;
  provider: string;
  terms: string;
  howToRedeem: string;
}

const deals: Deal[] = [
  {
    id: '1',
    title: '50% Off Car Wash',
    description: 'Professional car wash and detailing service',
    detailedDescription: 'Get your car professionally washed and detailed with our premium service. Includes exterior wash, interior cleaning, tire shine, and dashboard polish. Our experienced team uses eco-friendly products to ensure your car looks its best.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=60',
    originalPrice: '60',
    discountPrice: '30',
    discount: '50%',
    location: 'Oranjestad',
    expiresIn: '2 days',
    category: 'Car Services',
    provider: 'AutoCare Pro',
    terms: 'Valid for one car wash service. Appointment required. Cannot be combined with other offers. Valid at Oranjestad location only.',
    howToRedeem: 'Show this coupon confirmation at the service location. Present your phone with the QR code to the service provider.',
  },
  {
    id: '2',
    title: 'Buy 2 Get 1 Free Massage',
    description: 'Relaxing full body massage sessions',
    detailedDescription: 'Indulge in our premium massage therapy sessions. Book two full-body massages and receive the third one absolutely free. Our certified therapists provide Swedish, deep tissue, and relaxation massages.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&auto=format&fit=crop&q=60',
    originalPrice: '150',
    discountPrice: '100',
    discount: '33%',
    location: 'Palm Beach',
    expiresIn: '5 days',
    category: 'Personal Services',
    provider: 'Serenity Spa',
    terms: 'Valid for three massage sessions. Must be used within 60 days. Appointments required. Cannot be transferred or refunded.',
    howToRedeem: 'Book your appointments through the app or call the spa directly. Show your confirmation code when you arrive.',
  },
  {
    id: '3',
    title: 'Home Cleaning Special',
    description: 'Deep cleaning service for your entire home',
    detailedDescription: 'Professional deep cleaning service for your entire home. Our team will clean all rooms, bathrooms, kitchen, and common areas. Includes dusting, vacuuming, mopping, and sanitizing.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=60',
    originalPrice: '120',
    discountPrice: '80',
    discount: '33%',
    location: 'Eagle Beach',
    expiresIn: '1 week',
    category: 'Home Services',
    provider: 'CleanPro Aruba',
    terms: 'Valid for homes up to 2000 sq ft. Additional charges may apply for larger homes. 48-hour notice required for scheduling.',
    howToRedeem: 'Schedule your cleaning service through the app. Our team will contact you to confirm the appointment details.',
  },
  {
    id: '4',
    title: 'Tech Support Bundle',
    description: 'Computer repair + WiFi setup package deal',
    detailedDescription: 'Complete tech support package including computer diagnostics, repair, and WiFi network setup. Our certified technicians will ensure your devices are running optimally.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&auto=format&fit=crop&q=60',
    originalPrice: '200',
    discountPrice: '140',
    discount: '30%',
    location: 'San Nicolas',
    expiresIn: '3 days',
    category: 'Tech Services',
    provider: 'TechFix Solutions',
    terms: 'Includes up to 2 hours of service time. Additional time charged at regular rates. Parts and software not included.',
    howToRedeem: 'Contact TechFix Solutions to schedule your service. Mention your HopiGo deal when booking.',
  },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'wallet',
    name: 'HopiGo Wallet',
    details: 'AWG 245.50 available',
    last4: '',
    icon: Wallet,
  },
  {
    id: '2',
    type: 'card',
    name: 'Credit Card',
    details: '**** **** **** 1234',
    last4: '1234',
    icon: CreditCard,
  },
  {
    id: '3',
    type: 'card',
    name: 'Debit Card',
    details: '**** **** **** 5678',
    last4: '5678',
    icon: CreditCard,
  },
];

const categories = ['All', 'Car Services', 'Personal Services', 'Home Services', 'Tech Services'];

export default function DealsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dealModalVisible, setDealModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  const filteredDeals = selectedCategory === 'All' 
    ? deals 
    : deals.filter(deal => deal.category === selectedCategory);

  const handleDealPress = (deal: Deal) => {
    setSelectedDeal(deal);
    setDealModalVisible(true);
  };

  const handleBuyDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setDealModalVisible(false);
    setPaymentModalVisible(true);
  };

  const handlePaymentMethodSelect = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
  };

  const handleConfirmPayment = () => {
    if (selectedDeal && selectedPaymentMethod) {
      router.push({
        pathname: '/wallet/payment-confirmation',
        params: {
          type: 'deal-purchase',
          eventId: selectedDeal.id,
          eventTitle: selectedDeal.title,
          amount: selectedDeal.discountPrice,
          quantity: '1',
          provider: selectedDeal.provider,
          location: selectedDeal.location,
          paymentMethod: selectedPaymentMethod.name,
        }
      });
      setPaymentModalVisible(false);
      setSelectedDeal(null);
      setSelectedPaymentMethod(null);
    }
  };

  const closeDealModal = () => {
    setDealModalVisible(false);
    setSelectedDeal(null);
  };

  const closePaymentModal = () => {
    setPaymentModalVisible(false);
    setSelectedPaymentMethod(null);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Deals & Offers',
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
          <Text style={styles.title}>Exclusive Deals</Text>
          <Text style={styles.subtitle}>
            Limited time offers from trusted providers
          </Text>
        </View>

        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.selectedCategoryButtonText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          {filteredDeals.map((deal) => (
            <TouchableOpacity
              key={deal.id}
              onPress={() => handleDealPress(deal)}
              activeOpacity={0.7}
            >
              <Card style={styles.dealCard}>
                <Image source={{ uri: deal.image }} style={styles.dealImage} />
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{deal.discount} OFF</Text>
                </View>
                
                <View style={styles.dealContent}>
                  <View style={styles.dealHeader}>
                    <Text style={styles.dealTitle}>{deal.title}</Text>
                    <View style={styles.priceSection}>
                      <Text style={styles.originalPrice}>AWG {deal.originalPrice}</Text>
                      <Text style={styles.discountPrice}>AWG {deal.discountPrice}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.dealDescription}>{deal.description}</Text>
                  <Text style={styles.providerName}>by {deal.provider}</Text>
                  
                  <View style={styles.dealDetails}>
                    <View style={styles.detailRow}>
                      <MapPin size={14} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>{deal.location}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Clock size={14} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>Expires in {deal.expiresIn}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Tag size={14} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>{deal.category}</Text>
                    </View>
                  </View>

                  <Button
                    title="View Details"
                    variant="primary"
                    onPress={(e) => {
                      e?.stopPropagation?.();
                      handleDealPress(deal);
                    }}
                    style={styles.viewDetailsButton}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Deal Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={dealModalVisible}
        onRequestClose={closeDealModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Deal Details</Text>
              <TouchableOpacity onPress={closeDealModal} style={styles.closeButton}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {selectedDeal && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: selectedDeal.image }} style={styles.dealDetailImage} />
                
                <View style={styles.dealDetailHeader}>
                  <Text style={styles.dealDetailTitle}>{selectedDeal.title}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{selectedDeal.discount} OFF</Text>
                  </View>
                </View>

                <View style={styles.priceDetailSection}>
                  <View style={styles.priceDetailRow}>
                    <Text style={styles.priceLabel}>Original Price:</Text>
                    <Text style={styles.originalPriceDetail}>AWG {selectedDeal.originalPrice}</Text>
                  </View>
                  <View style={styles.priceDetailRow}>
                    <Text style={styles.priceLabel}>Deal Price:</Text>
                    <Text style={styles.discountPriceDetail}>AWG {selectedDeal.discountPrice}</Text>
                  </View>
                  <View style={styles.savingsRow}>
                    <Text style={styles.savingsLabel}>You Save:</Text>
                    <Text style={styles.savingsAmount}>AWG {parseInt(selectedDeal.originalPrice) - parseInt(selectedDeal.discountPrice)}</Text>
                  </View>
                </View>

                <View style={styles.descriptionSection}>
                  <Text style={styles.sectionLabel}>Description</Text>
                  <Text style={styles.descriptionText}>{selectedDeal.detailedDescription}</Text>
                </View>

                <View style={styles.providerSection}>
                  <Text style={styles.sectionLabel}>Provider</Text>
                  <Text style={styles.providerText}>{selectedDeal.provider}</Text>
                  <View style={styles.locationRow}>
                    <MapPin size={16} color={Colors.textSecondary} />
                    <Text style={styles.locationText}>{selectedDeal.location}</Text>
                  </View>
                </View>

                <View style={styles.termsSection}>
                  <Text style={styles.sectionLabel}>Terms & Conditions</Text>
                  <Text style={styles.termsText}>{selectedDeal.terms}</Text>
                </View>

                <View style={styles.redeemSection}>
                  <Text style={styles.sectionLabel}>How to Redeem</Text>
                  <Text style={styles.redeemText}>{selectedDeal.howToRedeem}</Text>
                </View>

                <View style={styles.expirySection}>
                  <Clock size={16} color={Colors.error} />
                  <Text style={styles.expiryText}>Expires in {selectedDeal.expiresIn}</Text>
                </View>

                <View style={styles.modalActions}>
                  <Button
                    title={`Buy Deal - AWG ${selectedDeal.discountPrice}`}
                    variant="primary"
                    onPress={() => handleBuyDeal(selectedDeal)}
                    style={styles.buyModalButton}
                  />
                  <Button
                    title="Cancel"
                    variant="secondary"
                    onPress={closeDealModal}
                    style={styles.cancelButton}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Payment Method Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={paymentModalVisible}
        onRequestClose={closePaymentModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Payment Method</Text>
              <TouchableOpacity onPress={closePaymentModal} style={styles.closeButton}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {selectedDeal && (
                <View style={styles.paymentSummary}>
                  <Text style={styles.paymentSummaryTitle}>Purchase Summary</Text>
                  <View style={styles.paymentSummaryRow}>
                    <Text style={styles.paymentSummaryLabel}>{selectedDeal.title}</Text>
                    <Text style={styles.paymentSummaryAmount}>AWG {selectedDeal.discountPrice}</Text>
                  </View>
                  <View style={styles.paymentSummaryDivider} />
                  <View style={styles.paymentSummaryRow}>
                    <Text style={styles.paymentSummaryTotalLabel}>Total</Text>
                    <Text style={styles.paymentSummaryTotalAmount}>AWG {selectedDeal.discountPrice}</Text>
                  </View>
                </View>
              )}

              <Text style={styles.paymentMethodsTitle}>Payment Methods</Text>
              
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodCard,
                    selectedPaymentMethod?.id === method.id && styles.selectedPaymentMethod
                  ]}
                  onPress={() => handlePaymentMethodSelect(method)}
                >
                  <View style={styles.paymentMethodIcon}>
                    {method.icon && <method.icon size={24} color={Colors.primary} />}
                  </View>
                  <View style={styles.paymentMethodInfo}>
                    <Text style={styles.paymentMethodName}>{method.name}</Text>
                    <Text style={styles.paymentMethodDetails}>{method.details}</Text>
                  </View>
                  <View style={[
                    styles.paymentMethodRadio,
                    selectedPaymentMethod?.id === method.id && styles.selectedPaymentMethodRadio
                  ]} />
                </TouchableOpacity>
              ))}

              <View style={styles.paymentActions}>
                <Button
                  title="Confirm Payment"
                  variant="primary"
                  onPress={handleConfirmPayment}
                  disabled={!selectedPaymentMethod}
                  style={[
                    styles.confirmPaymentButton,
                    !selectedPaymentMethod && styles.disabledButton
                  ]}
                />
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={closePaymentModal}
                  style={styles.cancelButton}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  categoriesSection: {
    paddingVertical: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedCategoryButtonText: {
    color: Colors.white,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  dealCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  dealImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  dealContent: {
    padding: 16,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  dealDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 12,
  },
  dealDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  viewDetailsButton: {
    marginTop: 8,
    backgroundColor: '#007AFF',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  dealDetailImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  dealDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dealDetailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  priceDetailSection: {
    backgroundColor: Colors.primary + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  priceDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  originalPriceDetail: {
    fontSize: 16,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  discountPriceDetail: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  savingsLabel: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  savingsAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.success || '#4CAF50',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  providerSection: {
    marginBottom: 20,
  },
  providerText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  termsSection: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  redeemSection: {
    marginBottom: 20,
  },
  redeemText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  expirySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: Colors.error + '10',
    padding: 12,
    borderRadius: 8,
  },
  expiryText: {
    fontSize: 14,
    color: Colors.error,
    marginLeft: 8,
    fontWeight: '600',
  },
  modalActions: {
    gap: 12,
  },
  buyModalButton: {
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  // Payment Modal Styles
  paymentSummary: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  paymentSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  paymentSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentSummaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  paymentSummaryAmount: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  paymentSummaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  paymentSummaryTotalLabel: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  paymentSummaryTotalAmount: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '700',
  },
  paymentMethodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPaymentMethod: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  paymentMethodDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  paymentMethodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectedPaymentMethodRadio: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  paymentActions: {
    marginTop: 24,
    gap: 12,
  },
  confirmPaymentButton: {
    marginBottom: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});