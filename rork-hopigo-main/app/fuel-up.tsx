import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, MapPin, Car, Clock, QrCode, Hash, Camera, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

const gasStations = [
  { id: '1', name: 'Shell Station', location: 'Oranjestad Center', price: '2.45', distance: '0.5 km' },
  { id: '2', name: 'Texaco Express', location: 'Eagle Beach', price: '2.45', distance: '1.2 km' },
  { id: '3', name: 'Esso Station', location: 'Palm Beach', price: '2.45', distance: '2.1 km' },
  { id: '4', name: 'Valero Gas', location: 'San Nicolas', price: '2.45', distance: '5.3 km' },
];

export default function FuelUpScreen() {
  const router = useRouter();
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [fuelAmount, setFuelAmount] = useState('');
  const [pumpNumber, setPumpNumber] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const fuelAmountInputRef = useRef<TextInput>(null);
  const pumpInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const pumpSectionRef = useRef<View>(null);

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

  const handleStationSelect = (stationId: string) => {
    setSelectedStation(stationId);
    // Automatically focus the pump input when station is selected
    setTimeout(() => {
      pumpInputRef.current?.focus();
    }, 100);
  };

  const handlePumpInputFocus = () => {
    // Measure pump section position and scroll to ensure it's above keyboard
    setTimeout(() => {
      pumpSectionRef.current?.measureInWindow((x, y, width, height) => {
        const screenHeight = Platform.OS === 'ios' ? 812 : 800; // Approximate screen height
        const availableHeight = screenHeight - keyboardHeight - 100; // 100px buffer
        
        if (y + height > availableHeight) {
          const scrollOffset = y + height - availableHeight + 50; // Extra 50px padding
          scrollViewRef.current?.scrollTo({ y: scrollOffset, animated: true });
        }
      });
    }, 300);
  };

  const handleFuelAmountFocus = () => {
    // Scroll to ensure fuel amount input is visible above keyboard
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 350, animated: true });
    }, 300);
  };

  const handleQRCodeScanned = ({ data }: { data: string }) => {
    // Extract pump number from QR code data
    // Assuming QR code contains pump number in format "PUMP_X" or just the number
    const pumpMatch = data.match(/(\d+)/);
    if (pumpMatch) {
      setPumpNumber(pumpMatch[1]);
      setShowQRScanner(false);
    } else {
      Alert.alert('Invalid QR Code', 'Please scan a valid pump QR code');
    }
  };

  const handleFuelUp = () => {
    if (!selectedStation || !fuelAmount || !pumpNumber) {
      Alert.alert('Missing Information', 'Please select a station, enter fuel amount, and specify pump number');
      return;
    }
    
    const selectedStationData = gasStations.find(s => s.id === selectedStation);
    
    Alert.alert(
      'Fuel Up Confirmation',
      `Station: ${selectedStationData?.name}
Pump: ${pumpNumber}
Amount: AWG ${fuelAmount}

You will only be charged for the fuel dispensed. Any unused amount will be refunded automatically.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Fueling', 
          onPress: () => {
            // Here you would typically start the fueling process
            Alert.alert('Fueling Started', 'You can now start fueling at pump ' + pumpNumber);
          }
        }
      ]
    );
  };

  const openQRScanner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Camera Permission', 'Camera permission is required to scan QR codes');
        return;
      }
    }
    setShowQRScanner(true);
  };

  if (showQRScanner) {
    return (
      <>
        <Stack.Screen 
          options={{ 
            title: 'Scan Pump QR Code',
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.text,
            headerTitleStyle: { fontWeight: '600' },
            headerLeft: () => (
              <TouchableOpacity onPress={() => setShowQRScanner(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            ),
          }} 
        />
        <View style={styles.scannerContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={handleQRCodeScanned}
          />
          <View style={styles.scannerOverlay}>
            <Text style={styles.scannerText}>Point camera at pump QR code</Text>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Fuel Up',
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
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Fuel Up</Text>
            <Text style={styles.subtitle}>
              Select station, scan pump QR code or enter pump number, and fuel up
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Gas Station</Text>
            {gasStations.map((station) => (
              <TouchableOpacity
                key={station.id}
                style={[
                  styles.stationCard,
                  selectedStation === station.id && styles.selectedStation
                ]}
                onPress={() => handleStationSelect(station.id)}
              >
                <View style={styles.stationInfo}>
                  <View style={styles.stationHeader}>
                    <Text style={styles.stationName}>{station.name}</Text>
                    <Text style={styles.stationPrice}>AWG {station.price}/L</Text>
                  </View>
                  <View style={styles.stationDetails}>
                    <View style={styles.locationRow}>
                      <MapPin size={14} color={Colors.textSecondary} />
                      <Text style={styles.stationLocation}>{station.location}</Text>
                    </View>
                    <View style={styles.distanceRow}>
                      <Clock size={14} color={Colors.textSecondary} />
                      <Text style={styles.stationDistance}>{station.distance}</Text>
                    </View>
                  </View>
                </View>
                <Car size={24} color={selectedStation === station.id ? Colors.primary : Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          {selectedStation && (
            <View ref={pumpSectionRef} style={styles.section}>
              <Text style={styles.sectionTitle}>Pump Selection</Text>
              <Card style={styles.formCard}>
                <View style={styles.pumpSelectionRow}>
                  <TouchableOpacity
                    style={styles.qrButton}
                    onPress={openQRScanner}
                  >
                    <QrCode size={20} color={Colors.primary} />
                    <Text style={styles.qrButtonText}>Scan QR Code</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.orText}>or</Text>
                  
                  <View style={styles.manualInputContainer}>
                    <Hash size={16} color={Colors.textSecondary} />
                    <TextInput
                      ref={pumpInputRef}
                      style={styles.pumpInput}
                      placeholder="Pump #"
                      value={pumpNumber}
                      onChangeText={setPumpNumber}
                      onFocus={handlePumpInputFocus}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Fuel Amount (AWG)</Text>
                  <TextInput
                    ref={fuelAmountInputRef}
                    style={styles.input}
                    placeholder="Enter maximum amount to spend"
                    value={fuelAmount}
                    onChangeText={setFuelAmount}
                    onFocus={handleFuelAmountFocus}
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputHint}>
                    You will only be charged for fuel dispensed. Unused amount refunds automatically.
                  </Text>
                </View>

                <Button
                  title="Fuel Up"
                  onPress={handleFuelUp}
                  style={styles.fuelButton}
                  disabled={!pumpNumber || !fuelAmount}
                />
              </Card>
            </View>
          )}

          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>How it Works</Text>
            <Text style={styles.infoDescription}>
              1. Select your gas station{'\n'}2. Scan the pump QR code or enter pump number{'\n'}3. Enter maximum amount you want to spend{'\n'}4. Tap "Fuel Up" to authorize the pump{'\n'}5. Start fueling - unused amount refunds automatically
            </Text>
          </Card>
          
          {/* Dynamic padding based on keyboard height */}
          <View style={[styles.keyboardPadding, { height: keyboardHeight > 0 ? keyboardHeight + 50 : 100 }]} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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
  stationCard: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedStation: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  stationInfo: {
    flex: 1,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  stationPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  stationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationLocation: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  stationDistance: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  formCard: {
    padding: 20,
  },
  pumpSelectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  qrButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  orText: {
    color: Colors.textSecondary,
    marginHorizontal: 16,
    fontWeight: '500',
  },
  manualInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  pumpInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
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
  inputHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 6,
    lineHeight: 16,
  },
  fuelButton: {
    marginTop: 10,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
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
    lineHeight: 20,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scannerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  keyboardPadding: {
    height: 100,
  },
});