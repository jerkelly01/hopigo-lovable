import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PaymentMethodSelector } from '@/components/PaymentMethodSelector';
import { useWalletStore } from '@/store/wallet-store';
import { ArrowLeft, Calendar, MapPin, Users, Clock, X, Star, Info } from 'lucide-react-native';
import Colors from '@/constants/colors';

const events = [
  {
    id: '1',
    title: 'Aruba Music Festival',
    date: '2025-07-15',
    time: '19:00',
    location: 'Eagle Beach',
    price: '75',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=60',
    category: 'Music',
    availableTickets: 150,
    description: 'Join us for an unforgettable night of music under the stars at Eagle Beach. Featuring local and international artists, this festival celebrates the vibrant music culture of Aruba.',
    fullDescription: 'The Aruba Music Festival is a three-day celebration of music, culture, and community. This year features headliners from across the Caribbean, Latin America, and beyond. Enjoy food trucks, local crafts, and stunning sunset performances on one of the world\'s most beautiful beaches.',
    duration: '3 days',
    ageRestriction: '18+',
    organizer: 'Aruba Events Co.',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Caribbean Food Festival',
    date: '2025-07-22',
    time: '12:00',
    location: 'Oranjestad Plaza',
    price: '25',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&auto=format&fit=crop&q=60',
    category: 'Food',
    availableTickets: 300,
    description: 'Taste the flavors of the Caribbean with over 30 local vendors showcasing traditional and modern Caribbean cuisine.',
    fullDescription: 'Experience the rich culinary heritage of the Caribbean at this annual food festival. Sample dishes from Aruba, Jamaica, Trinidad, Barbados, and more. Cooking demonstrations, live music, and cultural performances throughout the day.',
    duration: '8 hours',
    ageRestriction: 'All ages',
    organizer: 'Caribbean Culinary Association',
    rating: 4.6,
  },
  {
    id: '3',
    title: 'Sunset Yoga Session',
    date: '2025-07-18',
    time: '18:30',
    location: 'Palm Beach',
    price: '15',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop&q=60',
    category: 'Wellness',
    availableTickets: 50,
    description: 'Find your inner peace with a relaxing yoga session as the sun sets over Palm Beach. Suitable for all skill levels.',
    fullDescription: 'Join certified yoga instructor Maria Santos for a peaceful 90-minute yoga session on the pristine sands of Palm Beach. Watch the sunset paint the sky while you stretch, breathe, and connect with nature. Yoga mats and water provided.',
    duration: '90 minutes',
    ageRestriction: '16+',
    organizer: 'Aruba Wellness Center',
    rating: 4.9,
  },
  {
    id: '4',
    title: 'Art Gallery Opening',
    date: '2025-07-25',
    time: '17:00',
    location: 'Downtown Gallery',
    price: '20',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&auto=format&fit=crop&q=60',
    category: 'Art',
    availableTickets: 80,
    description: 'Discover contemporary Caribbean art at this exclusive gallery opening featuring works by emerging local artists.',
    fullDescription: 'Be among the first to view "Waves of Expression," a new exhibition featuring 25 contemporary Caribbean artists. Enjoy wine, hors d\'oeuvres, and the opportunity to meet the artists. Several pieces will be available for purchase.',
    duration: '4 hours',
    ageRestriction: '21+',
    organizer: 'Aruba Arts Foundation',
    rating: 4.7,
  },
];

export default function EventTicketsScreen() {
  const router = useRouter();
  const { paymentMethods, defaultPaymentMethodId, purchaseEventTicket } = useWalletStore();
  
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalView, setModalView] = useState<'details' | 'purchase'>('details');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(defaultPaymentMethodId);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEventPress = useCallback((event: any) => {
    setSelectedEvent(event);
    setModalView('details');
    setShowModal(true);
  }, []);

  const handleBuyTicket = useCallback((event: any, e?: any) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedEvent(event);
    setTicketQuantity(1);
    setSelectedPaymentMethodId(defaultPaymentMethodId);
    setModalView('purchase');
    setShowModal(true);
  }, [defaultPaymentMethodId]);

  const handleShowPurchase = useCallback((e?: any) => {
    if (e) {
      e.stopPropagation();
    }
    setModalView('purchase');
    setTicketQuantity(1);
    setSelectedPaymentMethodId(defaultPaymentMethodId);
  }, [defaultPaymentMethodId]);

  const handleBackToDetails = useCallback((e?: any) => {
    if (e) {
      e.stopPropagation();
    }
    setModalView('details');
  }, []);

  const handleConfirmPurchase = useCallback(async (e?: any) => {
    if (e) {
      e.stopPropagation();
    }
    if (!selectedEvent || !selectedPaymentMethodId || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await purchaseEventTicket(
        selectedEvent.id,
        selectedEvent.title,
        parseFloat(selectedEvent.price),
        ticketQuantity,
        selectedPaymentMethodId
      );
      
      setShowModal(false);
      setIsProcessing(false);
      
      router.push({
        pathname: '/wallet/payment-confirmation',
        params: {
          type: 'event-ticket',
          eventId: selectedEvent.id,
          eventTitle: selectedEvent.title,
          amount: (parseFloat(selectedEvent.price) * ticketQuantity).toString(),
          quantity: ticketQuantity.toString(),
        }
      });
    } catch (error) {
      setIsProcessing(false);
      console.error('Purchase failed:', error);
      // Handle error (show alert, etc.)
    }
  }, [selectedEvent, ticketQuantity, selectedPaymentMethodId, purchaseEventTicket, router, isProcessing]);

  const handleQuantityChange = useCallback((change: number, e?: any) => {
    if (e) {
      e.stopPropagation();
    }
    const newQuantity = ticketQuantity + change;
    const clampedQuantity = Math.max(1, Math.min(10, newQuantity));
    setTicketQuantity(clampedQuantity);
  }, [ticketQuantity]);

  const handleAddPaymentMethod = useCallback((e?: any) => {
    if (e) {
      e.stopPropagation();
    }
    setShowModal(false);
    router.push('/wallet/add-payment-method');
  }, [router]);

  const handleCloseModal = useCallback((e?: any) => {
    if (e) {
      e.stopPropagation();
    }
    setShowModal(false);
    setModalView('details');
  }, []);

  const handleModalHeaderPress = useCallback((e?: any) => {
    if (e) {
      e.stopPropagation();
    }
    if (modalView === 'purchase') {
      handleBackToDetails();
    } else {
      handleCloseModal();
    }
  }, [modalView, handleBackToDetails, handleCloseModal]);

  const EventModal = () => (
    <Modal
      visible={showModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            onPress={handleModalHeaderPress}
            activeOpacity={0.7}
          >
            {modalView === 'purchase' ? (
              <ArrowLeft size={24} color={Colors.text} />
            ) : (
              <X size={24} color={Colors.text} />
            )}
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {modalView === 'details' ? 'Event Details' : 'Purchase Tickets'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {selectedEvent && modalView === 'details' && (
            <>
              <Image source={{ uri: selectedEvent.image }} style={styles.modalImage} />
              
              <View style={styles.modalEventInfo}>
                <View style={styles.modalEventHeader}>
                  <Text style={styles.modalEventTitle}>{selectedEvent.title}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={16} color={Colors.primary} fill={Colors.primary} />
                    <Text style={styles.ratingText}>{selectedEvent.rating}</Text>
                  </View>
                </View>

                <Text style={styles.modalEventPrice}>AWG {selectedEvent.price} per ticket</Text>
                
                <View style={styles.modalEventDetails}>
                  <View style={styles.modalDetailRow}>
                    <Calendar size={16} color={Colors.textSecondary} />
                    <Text style={styles.modalDetailText}>{selectedEvent.date}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Clock size={16} color={Colors.textSecondary} />
                    <Text style={styles.modalDetailText}>{selectedEvent.time} ({selectedEvent.duration})</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <MapPin size={16} color={Colors.textSecondary} />
                    <Text style={styles.modalDetailText}>{selectedEvent.location}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Users size={16} color={Colors.textSecondary} />
                    <Text style={styles.modalDetailText}>{selectedEvent.availableTickets} tickets available</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Info size={16} color={Colors.textSecondary} />
                    <Text style={styles.modalDetailText}>{selectedEvent.ageRestriction}</Text>
                  </View>
                </View>

                <View style={styles.descriptionSection}>
                  <Text style={styles.descriptionTitle}>About This Event</Text>
                  <Text style={styles.descriptionText}>{selectedEvent.fullDescription}</Text>
                </View>

                <View style={styles.organizerSection}>
                  <Text style={styles.organizerTitle}>Organized by</Text>
                  <Text style={styles.organizerText}>{selectedEvent.organizer}</Text>
                </View>

                <Button
                  title="Buy Tickets"
                  onPress={handleShowPurchase}
                  style={styles.buyTicketsButton}
                />
              </View>
            </>
          )}

          {selectedEvent && modalView === 'purchase' && (
            <View style={styles.purchaseContent}>
              <View style={styles.purchaseEventInfo}>
                <Text style={styles.purchaseEventTitle}>{selectedEvent.title}</Text>
                <Text style={styles.purchaseEventDate}>{selectedEvent.date} at {selectedEvent.time}</Text>
                <Text style={styles.purchaseEventLocation}>{selectedEvent.location}</Text>
              </View>

              <View style={styles.quantitySection}>
                <Text style={styles.quantityLabel}>Number of Tickets</Text>
                <View style={styles.quantitySelector}>
                  <TouchableOpacity 
                    style={[styles.quantityButton, ticketQuantity <= 1 && styles.quantityButtonDisabled]}
                    onPress={(e) => handleQuantityChange(-1, e)}
                    disabled={ticketQuantity <= 1}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.quantityButtonText, ticketQuantity <= 1 && styles.quantityButtonTextDisabled]}>-</Text>
                  </TouchableOpacity>
                  <View style={styles.quantityDisplay}>
                    <Text style={styles.quantityText}>{ticketQuantity}</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.quantityButton, ticketQuantity >= 10 && styles.quantityButtonDisabled]}
                    onPress={(e) => handleQuantityChange(1, e)}
                    disabled={ticketQuantity >= 10}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.quantityButtonText, ticketQuantity >= 10 && styles.quantityButtonTextDisabled]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Ticket Price</Text>
                  <Text style={styles.priceValue}>AWG {selectedEvent.price}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Quantity</Text>
                  <Text style={styles.priceValue}>×{ticketQuantity}</Text>
                </View>
                <View style={[styles.priceRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>AWG {(parseFloat(selectedEvent.price) * ticketQuantity).toFixed(2)}</Text>
                </View>
              </View>

              <PaymentMethodSelector
                paymentMethods={paymentMethods}
                selectedPaymentMethodId={selectedPaymentMethodId}
                onSelectPaymentMethod={setSelectedPaymentMethodId}
                onAddPaymentMethod={handleAddPaymentMethod}
              />

              <View style={styles.purchaseButtonContainer}>
                <Button
                  title={isProcessing ? 'Processing...' : `Purchase ${ticketQuantity} Ticket${ticketQuantity > 1 ? 's' : ''} - AWG ${(parseFloat(selectedEvent.price) * ticketQuantity).toFixed(2)}`}
                  onPress={handleConfirmPurchase}
                  style={styles.purchaseButton}
                  disabled={!selectedPaymentMethodId || isProcessing}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Event Tickets',
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
          <Text style={styles.title}>Event Tickets</Text>
          <Text style={styles.subtitle}>
            Discover and book tickets for local events
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {events.map((event) => (
            <TouchableOpacity 
              key={event.id} 
              onPress={() => handleEventPress(event)}
              activeOpacity={0.7}
            >
              <Card style={styles.eventCard}>
                <Image source={{ uri: event.image }} style={styles.eventImage} />
                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventPrice}>AWG {event.price}</Text>
                  </View>
                  
                  <Text style={styles.eventDescription} numberOfLines={2}>
                    {event.description}
                  </Text>
                  
                  <View style={styles.eventDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={14} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>{event.date}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Clock size={14} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>{event.time}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MapPin size={14} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>{event.location}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Users size={14} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>{event.availableTickets} tickets left</Text>
                    </View>
                  </View>

                  <View style={styles.eventActions}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{event.category}</Text>
                    </View>
                    <Button
                      title="Buy Ticket"
                      size="small"
                      onPress={(e) => handleBuyTicket(event, e)}
                      style={styles.buyButton}
                    />
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>My Tickets</Text>
          <Text style={styles.infoDescription}>
            Your purchased tickets will appear here. You can view QR codes and event details.
          </Text>
          <TouchableOpacity 
            style={styles.viewTicketsButton}
            onPress={() => router.push('/my-tickets')}
          >
            <Text style={styles.viewTicketsText}>View My Tickets</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>

      <EventModal />
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  eventCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  eventPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  eventDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  buyButton: {
    paddingHorizontal: 20,
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
    marginBottom: 16,
  },
  viewTicketsButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  viewTicketsText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  modalContent: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  modalEventInfo: {
    padding: 20,
  },
  modalEventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  modalEventTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
  },
  modalEventPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 16,
  },
  modalEventDetails: {
    marginBottom: 24,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalDetailText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 12,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  organizerSection: {
    marginBottom: 32,
  },
  organizerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  organizerText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  buyTicketsButton: {
    marginBottom: 20,
  },
  // Purchase modal styles
  purchaseContent: {
    padding: 20,
  },
  purchaseEventInfo: {
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  purchaseEventTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  purchaseEventDate: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  purchaseEventLocation: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  quantitySection: {
    marginBottom: 32,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: Colors.inactive,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.white,
  },
  quantityButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  quantityDisplay: {
    marginHorizontal: 32,
    minWidth: 40,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  priceBreakdown: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: Colors.card,
    borderRadius: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  purchaseButtonContainer: {
    paddingBottom: 20,
    marginTop: 24,
  },
  purchaseButton: {
    width: '100%',
  },
});