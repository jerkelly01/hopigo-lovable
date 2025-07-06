import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore } from '@/store/notification-store';
import { useMarketplaceStore } from '@/store/marketplace-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft,
  DollarSign,
  Calendar,
  Star,
  TrendingUp,
  Clock,
  Users,
  Settings,
  Plus,
  Eye,
  Edit3,
  BarChart3,
  X,
  AlertTriangle,
  Car,
  MapPin,
  Navigation,
  Phone
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function ProviderDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { notifications } = useNotificationStore();
  const { taxiDrivers, currentTaxiRide, nearbyDrivers, updateDriverLocation, acceptRideRequest, updateRideStatus } = useMarketplaceStore();
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'week', 'month', 'year'
  const [urgentNotifications, setUrgentNotifications] = useState<any[]>([]);
  const [isDriverOnline, setIsDriverOnline] = useState(false);
  const [pendingRideRequests, setPendingRideRequests] = useState<any[]>([]);

  // Check if current user is a taxi driver
  const currentDriver = taxiDrivers.find(driver => driver.id === user?.id);
  const isTaxiDriver = !!currentDriver;

  // Mock data - in a real app, this would come from your backend
  const dashboardData = {
    earnings: {
      week: 1250,
      month: 4800,
      year: 58000
    },
    bookings: {
      pending: 3,
      upcoming: 8,
      completed: 127,
      cancelled: 2
    },
    rating: 4.8,
    totalReviews: 89,
    responseTime: '< 2 hours',
    completionRate: 98,
    // Taxi-specific data
    taxiStats: {
      ridesCompleted: 45,
      totalEarnings: 850,
      averageRating: 4.9,
      onlineHours: 32
    }
  };

  const recentBookings = [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      service: 'House Cleaning',
      date: '2024-01-15',
      time: '10:00 AM',
      amount: 85,
      status: 'upcoming',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop&q=60'
    },
    {
      id: '2',
      customerName: 'Mike Chen',
      service: 'Deep Cleaning',
      date: '2024-01-14',
      time: '2:00 PM',
      amount: 120,
      status: 'completed',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60'
    },
    {
      id: '3',
      customerName: 'Emma Wilson',
      service: 'Office Cleaning',
      date: '2024-01-13',
      time: '9:00 AM',
      amount: 95,
      status: 'completed',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60'
    }
  ];

  const quickActions = [
    {
      icon: <Plus size={24} color={Colors.primary} />,
      title: 'Add Service',
      subtitle: 'Create new service',
      onPress: () => router.push('/provider/add-service')
    },
    {
      icon: <Calendar size={24} color={Colors.primary} />,
      title: 'Manage Schedule',
      subtitle: 'Update availability',
      onPress: () => router.push('/provider/schedule')
    },
    {
      icon: <BarChart3 size={24} color={Colors.primary} />,
      title: 'View Analytics',
      subtitle: 'Performance insights',
      onPress: () => router.push('/provider/analytics')
    },
    {
      icon: <Settings size={24} color={Colors.primary} />,
      title: 'Settings',
      subtitle: 'Account preferences',
      onPress: () => router.push('/provider/settings')
    }
  ];

  // Taxi driver specific quick actions
  const taxiQuickActions = [
    {
      icon: <Car size={24} color={Colors.primary} />,
      title: isDriverOnline ? 'Go Offline' : 'Go Online',
      subtitle: isDriverOnline ? 'Stop receiving rides' : 'Start receiving rides',
      onPress: () => handleToggleOnlineStatus()
    },
    {
      icon: <MapPin size={24} color={Colors.primary} />,
      title: 'Update Location',
      subtitle: 'Share current location',
      onPress: () => handleUpdateLocation()
    },
    {
      icon: <BarChart3 size={24} color={Colors.primary} />,
      title: 'Ride Analytics',
      subtitle: 'View ride statistics',
      onPress: () => router.push('/provider/analytics')
    },
    {
      icon: <Settings size={24} color={Colors.primary} />,
      title: 'Driver Settings',
      subtitle: 'Vehicle & preferences',
      onPress: () => router.push('/provider/settings')
    }
  ];

  useEffect(() => {
    // Filter urgent service notifications
    const urgent = notifications.filter(n => n.type === 'urgent-service' && !n.isRead);
    setUrgentNotifications(urgent);

    // Mock pending ride requests for taxi drivers
    if (isTaxiDriver && isDriverOnline) {
      setPendingRideRequests([
        {
          id: 'req1',
          pickupLocation: { address: 'Oranjestad Main Street', latitude: 12.5092, longitude: -70.0086 },
          dropoffLocation: { address: 'Eagle Beach Resort', latitude: 12.5150, longitude: -70.0200 },
          estimatedFare: 25,
          estimatedDistance: 8.5,
          customerName: 'John Doe',
          rideType: 'standard'
        }
      ]);
    }
  }, [notifications, isTaxiDriver, isDriverOnline]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return Colors.warning;
      case 'completed':
        return Colors.success;
      case 'pending':
        return Colors.primary;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const formatCurrency = (amount: number) => {
    return `AWG ${amount.toLocaleString()}`;
  };

  const handleViewBooking = (bookingId: string) => {
    router.push(`/provider/booking/${bookingId}`);
  };

  const handleEditBooking = (bookingId: string) => {
    router.push(`/provider/booking/${bookingId}/edit`);
  };

  const handleBookingPress = (bookingId: string) => {
    router.push(`/provider/booking/${bookingId}`);
  };

  const handleUrgentNotificationPress = (notificationId: string) => {
    router.push(`/provider/urgent-request/${notificationId}`);
  };

  const handleToggleOnlineStatus = async () => {
    setIsDriverOnline(!isDriverOnline);
    // In a real app, you would update the driver's online status in the backend
    if (currentDriver) {
      // Update driver availability
      console.log(`Driver ${currentDriver.name} is now ${!isDriverOnline ? 'online' : 'offline'}`);
    }
  };

  const handleUpdateLocation = async () => {
    // In a real app, you would get the current location and update it
    if (currentDriver) {
      // Mock location update
      const mockLocation = {
        latitude: 12.5092 + (Math.random() - 0.5) * 0.01,
        longitude: -70.0086 + (Math.random() - 0.5) * 0.01,
        address: 'Updated location in Aruba'
      };
      await updateDriverLocation(currentDriver.id, mockLocation);
      console.log('Location updated');
    }
  };

  const handleAcceptRide = async (requestId: string) => {
    if (currentDriver) {
      await acceptRideRequest(currentDriver.id, requestId);
      setPendingRideRequests(prev => prev.filter(req => req.id !== requestId));
      router.push('/taxi-ride-tracking');
    }
  };

  const handleDeclineRide = (requestId: string) => {
    setPendingRideRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleCurrentRideAction = (action: string) => {
    if (currentTaxiRide) {
      switch (action) {
        case 'arrived':
          updateRideStatus(currentTaxiRide.id, 'pickup');
          break;
        case 'pickup':
          updateRideStatus(currentTaxiRide.id, 'in_transit');
          break;
        case 'complete':
          router.push('/taxi-ride-completion');
          break;
        default:
          break;
      }
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: isTaxiDriver ? 'Driver Dashboard' : 'Provider Dashboard',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <X size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        decelerationRate="normal"
        bounces={true}
        bouncesZoom={false}
        alwaysBounceVertical={false}
        removeClippedSubviews={false}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.providerName}>{user?.name}</Text>
            {isTaxiDriver && (
              <View style={styles.driverStatusContainer}>
                <View style={[
                  styles.statusIndicator, 
                  { backgroundColor: isDriverOnline ? Colors.success : Colors.error }
                ]} />
                <Text style={styles.driverStatus}>
                  {isDriverOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Image 
              source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60' }} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>

        {/* Pending Ride Requests (Taxi Drivers Only) */}
        {isTaxiDriver && pendingRideRequests.length > 0 && (
          <View style={styles.pendingRidesContainer}>
            <Text style={styles.sectionTitle}>Ride Requests</Text>
            {pendingRideRequests.map(request => (
              <Card key={request.id} style={styles.rideRequestCard}>
                <View style={styles.rideRequestHeader}>
                  <View style={styles.rideRequestInfo}>
                    <Text style={styles.rideRequestCustomer}>{request.customerName}</Text>
                    <Text style={styles.rideRequestType}>{request.rideType} ride</Text>
                  </View>
                  <View style={styles.rideRequestFare}>
                    <Text style={styles.fareAmount}>{formatCurrency(request.estimatedFare)}</Text>
                    <Text style={styles.fareDistance}>{request.estimatedDistance} km</Text>
                  </View>
                </View>
                
                <View style={styles.rideRequestRoute}>
                  <View style={styles.routePoint}>
                    <MapPin size={16} color={Colors.success} />
                    <Text style={styles.routeText} numberOfLines={1}>
                      {request.pickupLocation.address}
                    </Text>
                  </View>
                  <View style={styles.routePoint}>
                    <MapPin size={16} color={Colors.error} />
                    <Text style={styles.routeText} numberOfLines={1}>
                      {request.dropoffLocation.address}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.rideRequestActions}>
                  <Button
                    title="Decline"
                    variant="secondary"
                    size="small"
                    style={styles.rideActionButton}
                    onPress={() => handleDeclineRide(request.id)}
                  />
                  <Button
                    title="Accept"
                    size="small"
                    style={styles.rideActionButton}
                    onPress={() => handleAcceptRide(request.id)}
                  />
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Current Ride Status (Taxi Drivers Only) */}
        {isTaxiDriver && currentTaxiRide && currentTaxiRide.driverId === currentDriver?.id && (
          <View style={styles.currentRideContainer}>
            <Text style={styles.sectionTitle}>Current Ride</Text>
            <Card style={styles.currentRideCard}>
              <View style={styles.currentRideHeader}>
                <View style={styles.currentRideInfo}>
                  <Text style={styles.currentRideStatus}>
                    {currentTaxiRide.status === 'driver_assigned' && 'Heading to pickup'}
                    {currentTaxiRide.status === 'driver_arriving' && 'Arriving at pickup'}
                    {currentTaxiRide.status === 'pickup' && 'Passenger pickup'}
                    {currentTaxiRide.status === 'in_transit' && 'En route to destination'}
                  </Text>
                  <Text style={styles.currentRideFare}>
                    {formatCurrency(currentTaxiRide.estimatedFare)}
                  </Text>
                </View>
                <TouchableOpacity style={styles.callButton}>
                  <Phone size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.currentRideRoute}>
                <View style={styles.routePoint}>
                  <MapPin size={16} color={Colors.success} />
                  <Text style={styles.routeText} numberOfLines={1}>
                    {currentTaxiRide.pickupLocation.address}
                  </Text>
                </View>
                <View style={styles.routePoint}>
                  <MapPin size={16} color={Colors.error} />
                  <Text style={styles.routeText} numberOfLines={1}>
                    {currentTaxiRide.dropoffLocation.address}
                  </Text>
                </View>
              </View>
              
              <View style={styles.currentRideActions}>
                {currentTaxiRide.status === 'driver_assigned' && (
                  <Button
                    title="I've Arrived"
                    style={styles.rideStatusButton}
                    onPress={() => handleCurrentRideAction('arrived')}
                  />
                )}
                {currentTaxiRide.status === 'pickup' && (
                  <Button
                    title="Start Trip"
                    style={styles.rideStatusButton}
                    onPress={() => handleCurrentRideAction('pickup')}
                  />
                )}
                {currentTaxiRide.status === 'in_transit' && (
                  <Button
                    title="Complete Trip"
                    style={styles.rideStatusButton}
                    onPress={() => handleCurrentRideAction('complete')}
                  />
                )}
              </View>
            </Card>
          </View>
        )}

        {/* Urgent Notifications */}
        {urgentNotifications.length > 0 && (
          <View style={styles.urgentNotificationsContainer}>
            {urgentNotifications.map(notification => (
              <TouchableOpacity
                key={notification.id}
                style={styles.urgentNotificationCard}
                onPress={() => handleUrgentNotificationPress(notification.id)}
              >
                <View style={styles.urgentIcon}>
                  <AlertTriangle size={20} color={Colors.error} />
                </View>
                <View style={styles.urgentNotificationContent}>
                  <Text style={styles.urgentNotificationTitle}>{notification.title}</Text>
                  <Text style={styles.urgentNotificationMessage} numberOfLines={1}>
                    {notification.message}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {['week', 'month', 'year'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.activePeriodButton
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.activePeriodButtonText
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Earnings Card */}
          <TouchableOpacity onPress={() => router.push('/provider/analytics')}>
            <Card style={styles.earningsCard}>
              <View style={styles.earningsHeader}>
                <View style={styles.earningsInfo}>
                  <Text style={styles.earningsLabel}>Total Earnings</Text>
                  <Text style={styles.earningsAmount}>
                    {formatCurrency(
                      isTaxiDriver 
                        ? dashboardData.taxiStats.totalEarnings 
                        : dashboardData.earnings[selectedPeriod as keyof typeof dashboardData.earnings]
                    )}
                  </Text>
                </View>
                <View style={styles.earningsIcon}>
                  <DollarSign size={24} color={Colors.success} />
                </View>
              </View>
              <View style={styles.earningsTrend}>
                <TrendingUp size={16} color={Colors.success} />
                <Text style={styles.trendText}>+12% from last {selectedPeriod}</Text>
              </View>
            </Card>
          </TouchableOpacity>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <TouchableOpacity onPress={() => router.push('/provider/bookings')}>
              <Card style={styles.statCard}>
                <View style={styles.statIcon}>
                  {isTaxiDriver ? <Car size={20} color={Colors.primary} /> : <Calendar size={20} color={Colors.primary} />}
                </View>
                <Text style={styles.statValue}>
                  {isTaxiDriver ? dashboardData.taxiStats.ridesCompleted : dashboardData.bookings.upcoming}
                </Text>
                <Text style={styles.statLabel}>
                  {isTaxiDriver ? 'Rides' : 'Upcoming'}
                </Text>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/provider/analytics')}>
              <Card style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Star size={20} color={Colors.warning} />
                </View>
                <Text style={styles.statValue}>
                  {isTaxiDriver ? dashboardData.taxiStats.averageRating : dashboardData.rating}
                </Text>
                <Text style={styles.statLabel}>Rating</Text>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/provider/settings')}>
              <Card style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Clock size={20} color={Colors.secondary} />
                </View>
                <Text style={styles.statValue}>
                  {isTaxiDriver ? `${dashboardData.taxiStats.onlineHours}h` : dashboardData.responseTime}
                </Text>
                <Text style={styles.statLabel}>
                  {isTaxiDriver ? 'Online' : 'Response'}
                </Text>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/provider/analytics')}>
              <Card style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Users size={20} color={Colors.success} />
                </View>
                <Text style={styles.statValue}>{dashboardData.completionRate}%</Text>
                <Text style={styles.statLabel}>Completion</Text>
              </Card>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {(isTaxiDriver ? taxiQuickActions : quickActions).map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionCard}
                onPress={action.onPress}
              >
                <View style={styles.quickActionIcon}>
                  {action.icon}
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Bookings (Non-taxi providers) */}
        {!isTaxiDriver && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Bookings</Text>
              <TouchableOpacity onPress={() => router.push('/provider/bookings')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {recentBookings.map((booking) => (
              <TouchableOpacity 
                key={booking.id} 
                onPress={() => handleBookingPress(booking.id)}
                activeOpacity={0.7}
              >
                <Card style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <View style={styles.customerInfo}>
                      <Image source={{ uri: booking.avatar }} style={styles.customerAvatar} />
                      <View style={styles.customerDetails}>
                        <Text style={styles.customerName}>{booking.customerName}</Text>
                        <Text style={styles.serviceType}>{booking.service}</Text>
                      </View>
                    </View>
                    <View style={styles.bookingAmount}>
                      <Text style={styles.amountText}>{formatCurrency(booking.amount)}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                        <Text style={styles.statusText}>{booking.status}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.bookingDetails}>
                    <View style={styles.bookingTime}>
                      <Calendar size={16} color={Colors.textSecondary} />
                      <Text style={styles.bookingTimeText}>{booking.date} at {booking.time}</Text>
                    </View>
                    
                    <View style={styles.bookingActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleViewBooking(booking.id);
                        }}
                      >
                        <Eye size={16} color={Colors.primary} />
                        <Text style={styles.actionButtonText}>View</Text>
                      </TouchableOpacity>
                      
                      {booking.status === 'upcoming' && (
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleEditBooking(booking.id);
                          }}
                        >
                          <Edit3 size={16} color={Colors.primary} />
                          <Text style={styles.actionButtonText}>Edit</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Performance Summary */}
        <TouchableOpacity onPress={() => router.push('/provider/analytics')}>
          <Card style={styles.performanceCard}>
            <Text style={styles.performanceTitle}>Performance Summary</Text>
            <View style={styles.performanceStats}>
              <View style={styles.performanceStat}>
                <Text style={styles.performanceValue}>
                  {isTaxiDriver ? dashboardData.taxiStats.ridesCompleted : dashboardData.bookings.completed}
                </Text>
                <Text style={styles.performanceLabel}>
                  {isTaxiDriver ? 'Rides Completed' : 'Jobs Completed'}
                </Text>
              </View>
              <View style={styles.performanceStat}>
                <Text style={styles.performanceValue}>{dashboardData.totalReviews}</Text>
                <Text style={styles.performanceLabel}>Total Reviews</Text>
              </View>
              <View style={styles.performanceStat}>
                <Text style={styles.performanceValue}>
                  {isTaxiDriver ? (isDriverOnline ? '1' : '0') : dashboardData.bookings.pending}
                </Text>
                <Text style={styles.performanceLabel}>
                  {isTaxiDriver ? 'Active Status' : 'Pending Requests'}
                </Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  providerName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  driverStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  driverStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  pendingRidesContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  rideRequestCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: Colors.warning + '10',
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  rideRequestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  rideRequestInfo: {
    flex: 1,
  },
  rideRequestCustomer: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  rideRequestType: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  rideRequestFare: {
    alignItems: 'flex-end',
  },
  fareAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  fareDistance: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  rideRequestRoute: {
    marginBottom: 16,
    gap: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  rideRequestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  rideActionButton: {
    flex: 1,
  },
  currentRideContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  currentRideCard: {
    padding: 16,
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  currentRideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentRideInfo: {
    flex: 1,
  },
  currentRideStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  currentRideFare: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentRideRoute: {
    marginBottom: 16,
    gap: 8,
  },
  currentRideActions: {
    alignItems: 'center',
  },
  rideStatusButton: {
    width: '100%',
  },
  urgentNotificationsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  urgentNotificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '20',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  urgentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.error + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  urgentNotificationContent: {
    flex: 1,
  },
  urgentNotificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginBottom: 4,
  },
  urgentNotificationMessage: {
    fontSize: 14,
    color: Colors.text,
  },
  statsContainer: {
    paddingHorizontal: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activePeriodButton: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activePeriodButtonText: {
    color: Colors.white,
  },
  earningsCard: {
    marginBottom: 16,
    padding: 20,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  earningsInfo: {
    flex: 1,
  },
  earningsLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  earningsAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  earningsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  earningsTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    alignItems: 'center',
    padding: 16,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  bookingCard: {
    marginBottom: 12,
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  serviceType: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bookingAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
    textTransform: 'capitalize',
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingTimeText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  performanceCard: {
    margin: 20,
    padding: 20,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  performanceStat: {
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});