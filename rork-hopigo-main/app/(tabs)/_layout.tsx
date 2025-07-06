import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Home, Search, Wallet, User, QrCode, Bell, Car } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNotificationStore } from '@/store/notification-store';
import { useMarketplaceStore } from '@/store/marketplace-store';

export default function TabLayout() {
  const router = useRouter();
  const { currentTaxiRide } = useMarketplaceStore();
  
  // Safely access notification store with error handling
  let unreadCount = 0;
  try {
    unreadCount = useNotificationStore(state => state.unreadCount);
  } catch (error) {
    console.error("Error accessing notification store:", error);
  }
  
  const handleNotificationPress = () => {
    try {
      router.push('/notifications');
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleQRCodePress = () => {
    try {
      router.push('/my-qr-code');
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleTaxiPress = () => {
    try {
      if (currentTaxiRide) {
        router.push('/taxi-ride-tracking');
      } else {
        router.push('/taxi-service');
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          elevation: 0,
          height: 85, // Increased height
          paddingBottom: 20, // Increased padding
        },
        tabBarLabelStyle: {
          fontSize: 13, // Increased from 12 to 13
          fontWeight: '500',
        },
        headerShown: true,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          height: 100, // Reduced from 120 to 100
        },
        headerBackground: () => (
          <LinearGradient
            colors={['#40E0D0', '#2196F3']} // Light blue to dark blue gradient like the logo
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        headerTitleStyle: {
          color: Colors.white,
          fontWeight: '700',
          fontSize: 27, // Increased from 26 to 27
          letterSpacing: 0.5,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
          paddingBottom: 50, // Increased from 45 to 50 to move text 5 more points upward
          marginTop: 5, // Reduced from 10 to 5
          marginLeft: 15, // Added to move text to the right by 15 points
        },
        headerTitleAlign: 'center', // Center align all headers
        headerLeft: () => (
          <TouchableOpacity 
            style={styles.qrCodeButton}
            onPress={handleQRCodePress}
          >
            <QrCode size={24} color={Colors.white} />
          </TouchableOpacity>
        ),
        headerLeftContainerStyle: {
          paddingLeft: 16,
          paddingBottom: 15,
        },
        headerRight: () => (
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
          >
            <Bell size={24} color={Colors.white} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ),
        headerRightContainerStyle: {
          paddingRight: 16,
          paddingBottom: 15, // Reduced from 20 to 15
        },
      }}
      tabBar={(props) => {
        return (
          <View style={styles.tabBarContainer}>
            <View style={styles.tabBar}>
              {/* Home Tab */}
              <TouchableOpacity
                style={styles.tab}
                onPress={() => {
                  try {
                    props.navigation.navigate('index');
                  } catch (error) {
                    console.error("Navigation error:", error);
                  }
                }}
              >
                <Home 
                  size={24} 
                  color={props.state.index === 0 ? Colors.primary : Colors.inactive} 
                />
                <Text 
                  style={[
                    styles.tabLabel, 
                    { color: props.state.index === 0 ? Colors.primary : Colors.inactive }
                  ]}
                >
                  Home
                </Text>
              </TouchableOpacity>
              
              {/* Services Tab */}
              <TouchableOpacity
                style={styles.tab}
                onPress={() => {
                  try {
                    props.navigation.navigate('marketplace');
                  } catch (error) {
                    console.error("Navigation error:", error);
                  }
                }}
              >
                <Search 
                  size={24} 
                  color={props.state.index === 1 ? Colors.primary : Colors.inactive} 
                />
                <Text 
                  style={[
                    styles.tabLabel, 
                    { color: props.state.index === 1 ? Colors.primary : Colors.inactive }
                  ]}
                >
                  Services
                </Text>
              </TouchableOpacity>
              
              {/* Middle Taxi/Pay Button */}
              <TouchableOpacity
                style={[
                  styles.payButton,
                  currentTaxiRide && styles.activeTaxiButton
                ]}
                onPress={handleTaxiPress}
              >
                <View style={styles.payButtonInner}>
                  {currentTaxiRide ? (
                    <>
                      <Car size={24} color={Colors.white} />
                      <Text style={styles.payButtonText}>Ride</Text>
                      {currentTaxiRide && (
                        <View style={styles.rideStatusIndicator} />
                      )}
                    </>
                  ) : (
                    <>
                      <QrCode size={24} color={Colors.white} />
                      <Text style={styles.payButtonText}>Pay</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
              
              {/* Wallet Tab */}
              <TouchableOpacity
                style={styles.tab}
                onPress={() => {
                  try {
                    props.navigation.navigate('wallet');
                  } catch (error) {
                    console.error("Navigation error:", error);
                  }
                }}
              >
                <Wallet 
                  size={24} 
                  color={props.state.index === 3 ? Colors.primary : Colors.inactive} 
                />
                <Text 
                  style={[
                    styles.tabLabel, 
                    { color: props.state.index === 3 ? Colors.primary : Colors.inactive }
                  ]}
                >
                  Wallet
                </Text>
              </TouchableOpacity>
              
              {/* Profile Tab */}
              <TouchableOpacity
                style={styles.tab}
                onPress={() => {
                  try {
                    props.navigation.navigate('profile');
                  } catch (error) {
                    console.error("Navigation error:", error);
                  }
                }}
              >
                <User 
                  size={24} 
                  color={props.state.index === 4 ? Colors.primary : Colors.inactive} 
                />
                <Text 
                  style={[
                    styles.tabLabel, 
                    { color: props.state.index === 4 ? Colors.primary : Colors.inactive }
                  ]}
                >
                  Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HopiGo",
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: "Services",
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan QR Code",
          tabBarButton: () => null, // Hide tab button
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 13, // Increased from 12 to 13
    fontWeight: '500',
    marginTop: 4,
  },
  payButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  activeTaxiButton: {
    backgroundColor: Colors.success,
  },
  payButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  payButtonText: {
    color: Colors.white,
    fontSize: 13, // Increased from 12 to 13
    fontWeight: '600',
    marginTop: 4,
  },
  rideStatusIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.warning,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  qrCodeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  notificationCount: {
    color: Colors.white,
    fontSize: 11, // Increased from 10 to 11
    fontWeight: 'bold',
  },
});