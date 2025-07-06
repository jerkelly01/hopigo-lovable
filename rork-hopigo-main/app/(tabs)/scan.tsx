import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button } from '@/components/ui/Button';
import { QrCode, X, Users, Plus, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Platform } from 'react-native';
import { Card } from '@/components/ui/Card';
import { useWalletStore } from '@/store/wallet-store';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [splitMode, setSplitMode] = useState(false);
  const [participants, setParticipants] = useState<{ id: string; name: string; avatar?: string }[]>([]);
  const [newParticipant, setNewParticipant] = useState('');
  const [permissionRequested, setPermissionRequested] = useState(false);
  const router = useRouter();
  const { splitBill } = useWalletStore();

  useEffect(() => {
    // Request permission on mount for iOS
    if (!permission?.granted && !permissionRequested) {
      setPermissionRequested(true);
      requestPermission();
    }
  }, [permission, permissionRequested]);

  const handlePermissionRequest = async () => {
    try {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Camera Permission Required",
          "To scan QR codes for payments, please enable camera access in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Open Settings", 
              onPress: () => {
                // On iOS, this will prompt user to go to settings
                if (Platform.OS === 'ios') {
                  Alert.alert(
                    "Enable Camera Access",
                    "Go to Settings → HopiGo → Camera and enable camera access.",
                    [{ text: "OK" }]
                  );
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        "Permission Error",
        "Unable to request camera permission. Please check your device settings.",
        [{ text: "OK" }]
      );
    }
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    try {
      // Try to parse the QR code data
      const qrData = JSON.parse(data);
      
      if (qrData.type === 'payment') {
        if (splitMode && participants.length > 0) {
          // Handle split payment
          const participantIds = participants.map(p => p.id);
          const totalAmount = qrData.amount;
          const perPersonAmount = totalAmount / (participants.length + 1); // +1 for the user
          
          Alert.alert(
            "Split Payment",
            `Split ${qrData.amount} ${qrData.currency} with ${participants.length} people?\n\nYour share: ${perPersonAmount.toFixed(2)} ${qrData.currency}`,
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => setScanned(false)
              },
              { 
                text: "Pay", 
                onPress: async () => {
                  try {
                    // Process split payment
                    await splitBill(
                      `Payment to ${qrData.merchant}`, 
                      totalAmount, 
                      participantIds
                    );
                    Alert.alert(
                      "Success", 
                      `Payment split successfully! Each person will pay ${perPersonAmount.toFixed(2)} ${qrData.currency}.`,
                      [{ text: "OK", onPress: () => router.push('/wallet') }]
                    );
                  } catch (error) {
                    Alert.alert(
                      "Payment Failed", 
                      error instanceof Error ? error.message : "Could not process payment",
                      [{ text: "OK", onPress: () => setScanned(false) }]
                    );
                  }
                }
              }
            ]
          );
        } else {
          // Regular payment
          Alert.alert(
            "Payment Request",
            `Pay ${qrData.amount} ${qrData.currency} to ${qrData.merchant}?`,
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => setScanned(false)
              },
              { 
                text: "Pay", 
                onPress: () => {
                  // Process payment
                  Alert.alert("Success", "Payment completed successfully!");
                  router.push('/wallet');
                }
              }
            ]
          );
        }
      } else {
        Alert.alert("Invalid QR Code", "This QR code is not a valid payment request.", [
          { text: "OK", onPress: () => setScanned(false) }
        ]);
      }
    } catch (error) {
      Alert.alert("Invalid QR Code", "Could not process this QR code.", [
        { text: "OK", onPress: () => setScanned(false) }
      ]);
    }
  };

  const toggleSplitMode = () => {
    setSplitMode(!splitMode);
    if (scanned) setScanned(false);
  };

  const addParticipant = () => {
    if (newParticipant.trim() === '') return;
    
    // In a real app, you would search for the user in your database
    // For demo, we'll create a mock user
    const newUser = {
      id: `user-${Date.now()}`,
      name: newParticipant,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    
    setParticipants([...participants, newUser]);
    setNewParticipant('');
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <QrCode size={80} color={Colors.primary} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          To scan QR codes for payments, HopiGo needs access to your camera.
        </Text>
        <Button title="Enable Camera Access" onPress={handlePermissionRequest} />
        {Platform.OS === 'ios' && (
          <Text style={styles.permissionHint}>
            If the permission was denied, please go to Settings → HopiGo → Camera to enable access.
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS !== 'web' ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View style={styles.overlay}>
              <View style={styles.scannerFrame}>
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
              </View>
              
              <Text style={styles.instructions}>
                Position the QR code within the frame to scan
              </Text>
              
              {scanned && (
                <TouchableOpacity
                  style={styles.scanAgainButton}
                  onPress={() => setScanned(false)}
                >
                  <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
                </TouchableOpacity>
              )}
            </View>
          </CameraView>
          
          {/* Split Payment Toggle */}
          <TouchableOpacity 
            style={[styles.splitButton, splitMode && styles.splitButtonActive]} 
            onPress={toggleSplitMode}
          >
            <Users size={20} color={splitMode ? Colors.white : Colors.primary} />
            <Text style={[styles.splitButtonText, splitMode && styles.splitButtonTextActive]}>
              {splitMode ? 'Split Mode On' : 'Split Payment'}
            </Text>
          </TouchableOpacity>
          
          {/* Split Payment UI */}
          {splitMode && (
            <Card style={styles.splitContainer}>
              <Text style={styles.splitTitle}>Split with Friends</Text>
              
              <View style={styles.addPersonContainer}>
                <TextInput
                  style={styles.personInput}
                  placeholder="Enter friend's name"
                  value={newParticipant}
                  onChangeText={setNewParticipant}
                />
                <TouchableOpacity style={styles.addButton} onPress={addParticipant}>
                  <Plus size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
              
              {participants.length > 0 && (
                <ScrollView style={styles.participantsList}>
                  {participants.map((person) => (
                    <View key={person.id} style={styles.participantItem}>
                      <View style={styles.participantInfo}>
                        <Image 
                          source={{ uri: person.avatar || 'https://i.pravatar.cc/150' }} 
                          style={styles.avatar} 
                        />
                        <Text style={styles.participantName}>{person.name}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.removeButton} 
                        onPress={() => removeParticipant(person.id)}
                      >
                        <Trash2 size={16} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
              
              <Text style={styles.splitInfo}>
                {participants.length > 0 
                  ? `Bill will be split ${participants.length + 1} ways` 
                  : 'Add friends to split the bill'}
              </Text>
            </Card>
          )}
        </View>
      ) : (
        <View style={styles.webFallback}>
          <QrCode size={80} color={Colors.primary} />
          <Text style={styles.webFallbackText}>
            QR code scanning is not available on web.
          </Text>
          <Text style={styles.webFallbackSubtext}>
            Please use the mobile app to scan QR codes for payments.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderRadius: 12,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.white,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.white,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.white,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.white,
    borderBottomRightRadius: 12,
  },
  instructions: {
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    marginHorizontal: 40,
  },
  scanAgainButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  scanAgainText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  webFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  webFallbackText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 20,
    textAlign: 'center',
  },
  webFallbackSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 300,
  },
  splitButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  splitButtonActive: {
    backgroundColor: Colors.primary,
  },
  splitButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  splitButtonTextActive: {
    color: Colors.white,
  },
  splitContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  splitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  addPersonContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  personInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: Colors.background,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantsList: {
    maxHeight: 150,
    marginBottom: 12,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  participantName: {
    fontSize: 14,
    color: Colors.text,
  },
  removeButton: {
    padding: 4,
  },
  splitInfo: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});