import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calendar, MapPin, Clock, QrCode, Download, Share, X, Ticket } from 'lucide-react-native';
import Colors from '@/constants/colors';

// Mock ticket data - in a real app, this would come from your backend
const myTickets = [
  {
    id: 'ticket-1',
    eventId: '1',
    eventTitle: 'Aruba Music Festival',
    eventDate: '2025-07-15',
    eventTime: '19:00',
    location: 'Eagle Beach',
    quantity: 2,
    totalPaid: 150.00,
    purchaseDate: '2025-01-10',
    status: 'active', // active, used, expired, cancelled
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-AMF-2025-001',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=60',
    ticketNumber: 'AMF-2025-001',
    seatInfo: 'General Admission',
    organizer: 'Aruba Events Co.',
  },
  {
    id: 'ticket-2',
    eventId: '3',
    eventTitle: 'Sunset Yoga Session',
    eventDate: '2025-07-18',
    eventTime: '18:30',
    location: 'Palm Beach',
    quantity: 1,
    totalPaid: 15.00,
    purchaseDate: '2025-01-12',
    status: 'active',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-SYS-2025-002',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop&q=60',
    ticketNumber: 'SYS-2025-002',
    seatInfo: 'Beach Mat Included',
    organizer: 'Aruba Wellness Center',
  },
  {
    id: 'ticket-3',
    eventId: '2',
    eventTitle: 'Caribbean Food Festival',
    eventDate: '2025-06-10',
    eventTime: '12:00',
    location: 'Oranjestad Plaza',
    quantity: 1,
    totalPaid: 25.00,
    purchaseDate: '2025-01-05',
    status: 'used',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-CFF-2025-003',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&auto=format&fit=crop&q=60',
    ticketNumber: 'CFF-2025-003',
    seatInfo: 'Food Sampling Pass',
    organizer: 'Caribbean Culinary Association',
  },
];

export default function MyTicketsScreen() {
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const handleTicketPress = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleShowQR = (ticket: any, event?: any) => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedTicket(ticket);
    setShowQRModal(true);
  };

  const handleCloseTicketModal = () => {
    setShowTicketModal(false);
    setTimeout(() => {
      setSelectedTicket(null);
    }, 300);
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
    setTimeout(() => {
      setSelectedTicket(null);
    }, 300);
  };

  const handleQRFromTicketModal = () => {
    setShowTicketModal(false);
    setTimeout(() => {
      setShowQRModal(true);
    }, 300);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return Colors.success;
      case 'used':
        return Colors.textSecondary;
      case 'expired':
        return Colors.error;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'used':
        return 'Used';
      case 'expired':
        return 'Expired';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const activeTickets = myTickets.filter(ticket => ticket.status === 'active');
  const pastTickets = myTickets.filter(ticket => ticket.status !== 'active');

  const QRCodeModal = () => (
    <Modal
      visible={showQRModal}
      animationType="fade"
      transparent={true}
      onRequestClose={handleCloseQRModal}
    >
      <TouchableOpacity 
        style={styles.qrModalOverlay}
        activeOpacity={1}
        onPress={handleCloseQRModal}
      >
        <TouchableOpacity 
          style={styles.qrModalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.qrModalHeader}>
            <Text style={styles.qrModalTitle}>Entry QR Code</Text>
            <TouchableOpacity onPress={handleCloseQRModal}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          {selectedTicket && (
            <>
              <Text style={styles.qrEventTitle}>{selectedTicket.eventTitle}</Text>
              <Text style={styles.qrEventDate}>{selectedTicket.eventDate} at {selectedTicket.eventTime}</Text>
              
              <View style={styles.qrCodeContainer}>
                <Image source={{ uri: selectedTicket.qrCode }} style={styles.qrCodeImage} />
              </View>
              
              <Text style={styles.qrTicketNumber}>Ticket #{selectedTicket.ticketNumber}</Text>
              <Text style={styles.qrInstructions}>Show this code at the event entrance</Text>
              
              <View style={styles.qrActions}>
                <TouchableOpacity style={styles.qrActionButton}>
                  <Download size={20} color={Colors.primary} />
                  <Text style={styles.qrActionText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.qrActionButton}>
                  <Share size={20} color={Colors.primary} />
                  <Text style={styles.qrActionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  const TicketDetailModal = () => (
    <Modal
      visible={showTicketModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCloseTicketModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={handleCloseTicketModal}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Ticket Details</Text>
          <TouchableOpacity>
            <Share size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {selectedTicket && (
            <>
              <View style={styles.modalTicketCard}>
                <Image source={{ uri: selectedTicket.image }} style={styles.modalTicketImage} />
                
                <View style={styles.modalTicketInfo}>
                  <View style={styles.ticketHeader}>
                    <Text style={styles.modalTicketTitle}>{selectedTicket.eventTitle}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedTicket.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(selectedTicket.status) }]}>
                        {getStatusText(selectedTicket.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalTicketDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>{selectedTicket.eventDate}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Clock size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>{selectedTicket.eventTime}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MapPin size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>{selectedTicket.location}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ticket size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>{selectedTicket.quantity} ticket{selectedTicket.quantity > 1 ? 's' : ''}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {selectedTicket.status === 'active' && (
                <View style={styles.qrSection}>
                  <Text style={styles.qrTitle}>Entry QR Code</Text>
                  <Text style={styles.qrSubtitle}>Show this code at the event entrance</Text>
                  
                  <TouchableOpacity 
                    style={styles.qrContainer}
                    onPress={handleQRFromTicketModal}
                  >
                    <Image source={{ uri: selectedTicket.qrCode }} style={styles.qrCode} />
                    <View style={styles.qrOverlay}>
                      <QrCode size={32} color={Colors.white} />
                      <Text style={styles.qrOverlayText}>Tap to enlarge</Text>
                    </View>
                  </TouchableOpacity>
                  
                  <Text style={styles.ticketNumber}>Ticket #{selectedTicket.ticketNumber}</Text>
                </View>
              )}

              <View style={styles.ticketInfoSection}>
                <Text style={styles.infoSectionTitle}>Ticket Information</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Seat/Section</Text>
                    <Text style={styles.infoValue}>{selectedTicket.seatInfo}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Organizer</Text>
                    <Text style={styles.infoValue}>{selectedTicket.organizer}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Purchase Date</Text>
                    <Text style={styles.infoValue}>{selectedTicket.purchaseDate}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Total Paid</Text>
                    <Text style={styles.infoValue}>AWG {selectedTicket.totalPaid.toFixed(2)}</Text>
                  </View>
                </View>
              </View>

              {selectedTicket.status === 'active' && (
                <View style={styles.actionButtons}>
                  <Button
                    title="Download Ticket"
                    variant="outline"
                    onPress={() => {
                      // Handle download
                      console.log('Download ticket');
                    }}
                    style={styles.actionButton}
                  />
                  <Button
                    title="Add to Calendar"
                    onPress={() => {
                      // Handle add to calendar
                      console.log('Add to calendar');
                    }}
                    style={styles.actionButton}
                  />
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'My Tickets',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Tickets</Text>
          <Text style={styles.subtitle}>
            View and manage your event tickets
          </Text>
        </View>

        {activeTickets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Tickets</Text>
            {activeTickets.map((ticket) => (
              <TouchableOpacity 
                key={ticket.id} 
                onPress={() => handleTicketPress(ticket)}
                activeOpacity={0.7}
                style={styles.ticketTouchable}
              >
                <Card style={styles.ticketCard}>
                  <Image source={{ uri: ticket.image }} style={styles.eventImage} />
                  <View style={styles.ticketContent}>
                    <View style={styles.ticketHeader}>
                      <Text style={styles.eventTitle}>{ticket.eventTitle}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                          {getStatusText(ticket.status)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.eventDetails}>
                      <View style={styles.detailRow}>
                        <Calendar size={14} color={Colors.textSecondary} />
                        <Text style={styles.detailText}>{ticket.eventDate}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Clock size={14} color={Colors.textSecondary} />
                        <Text style={styles.detailText}>{ticket.eventTime}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <MapPin size={14} color={Colors.textSecondary} />
                        <Text style={styles.detailText}>{ticket.location}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ticket size={14} color={Colors.textSecondary} />
                        <Text style={styles.detailText}>{ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}</Text>
                      </View>
                    </View>

                    <View style={styles.ticketActions}>
                      <Text style={styles.ticketPrice}>AWG {ticket.totalPaid.toFixed(2)}</Text>
                      <TouchableOpacity 
                        style={styles.qrButton}
                        onPress={(e) => handleShowQR(ticket, e)}
                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                      >
                        <QrCode size={16} color={Colors.primary} />
                        <Text style={styles.qrButtonText}>Show QR</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {pastTickets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past Tickets</Text>
            {pastTickets.map((ticket) => (
              <TouchableOpacity 
                key={ticket.id} 
                onPress={() => handleTicketPress(ticket)}
                activeOpacity={0.7}
                style={styles.ticketTouchable}
              >
                <Card style={[styles.ticketCard, styles.pastTicketCard]}>
                  <Image source={{ uri: ticket.image }} style={[styles.eventImage, styles.pastEventImage]} />
                  <View style={styles.ticketContent}>
                    <View style={styles.ticketHeader}>
                      <Text style={[styles.eventTitle, styles.pastEventTitle]}>{ticket.eventTitle}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                          {getStatusText(ticket.status)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.eventDetails}>
                      <View style={styles.detailRow}>
                        <Calendar size={14} color={Colors.textSecondary} />
                        <Text style={styles.detailText}>{ticket.eventDate}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ticket size={14} color={Colors.textSecondary} />
                        <Text style={styles.detailText}>{ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}</Text>
                      </View>
                    </View>

                    <View style={styles.ticketActions}>
                      <Text style={styles.ticketPrice}>AWG {ticket.totalPaid.toFixed(2)}</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {myTickets.length === 0 && (
          <Card style={styles.emptyCard}>
            <Ticket size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Tickets Yet</Text>
            <Text style={styles.emptyDescription}>
              Your purchased tickets will appear here. Start exploring events to buy your first ticket!
            </Text>
            <Button
              title="Browse Events"
              onPress={() => router.push('/event-tickets')}
              style={styles.browseButton}
            />
          </Card>
        )}
      </ScrollView>

      <TicketDetailModal />
      <QRCodeModal />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
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
  ticketTouchable: {
    marginBottom: 16,
  },
  ticketCard: {
    padding: 0,
    overflow: 'hidden',
  },
  pastTicketCard: {
    opacity: 0.7,
  },
  eventImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  pastEventImage: {
    opacity: 0.6,
  },
  ticketContent: {
    padding: 16,
  },
  ticketHeader: {
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
  pastEventTitle: {
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  eventDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  ticketActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  qrButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 4,
  },
  emptyCard: {
    marginHorizontal: 20,
    marginTop: 40,
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 32,
  },
  // QR Modal styles
  qrModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrModalContainer: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  qrModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  qrModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  qrEventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  qrEventDate: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  qrCodeContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
  },
  qrTicketNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  qrInstructions: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  qrActions: {
    flexDirection: 'row',
    gap: 20,
  },
  qrActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  qrActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 6,
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
    paddingTop: 60,
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
  modalTicketCard: {
    margin: 0,
  },
  modalTicketImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  modalTicketInfo: {
    padding: 20,
  },
  modalTicketTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  modalTicketDetails: {
    marginTop: 12,
  },
  qrSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  qrSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  qrContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    position: 'relative',
  },
  qrCode: {
    width: 200,
    height: 200,
  },
  qrOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  qrOverlayText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  ticketNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  ticketInfoSection: {
    padding: 20,
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  actionButtons: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
});