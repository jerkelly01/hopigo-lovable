import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useMarketplaceStore } from '@/store/marketplace-store';
import { Location } from '@/types/marketplace';
import { MapPin, Navigation, Edit3 } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface LocationSelectorProps {
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
  onLocationClear: () => void;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  showCurrentLocationButton?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onLocationSelect,
  onLocationClear,
  title = "Service Location",
  subtitle = "Share your location or enter your address so the service provider can find you",
  placeholder = "Enter your full address",
  showCurrentLocationButton = true,
}) => {
  const { getCurrentLocation, geocodeAddress, currentLocation } = useMarketplaceStore();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    if (currentLocation && !selectedLocation && showCurrentLocationButton) {
      onLocationSelect(currentLocation);
    }
  }, [currentLocation, selectedLocation, onLocationSelect, showCurrentLocationButton]);

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await getCurrentLocation();
      if (location) {
        onLocationSelect(location);
        setShowManualInput(false);
        setManualAddress('');
      } else {
        Alert.alert(
          'Location Access',
          'Unable to get your current location. Please check your location permissions and try again, or enter your address manually.',
          [
            { text: 'Enter Manually', onPress: () => setShowManualInput(true) },
            { text: 'Try Again', onPress: handleGetCurrentLocation },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Failed to get your location. Please enter your address manually.',
        [
          { text: 'Enter Manually', onPress: () => setShowManualInput(true) },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleManualAddressSubmit = async () => {
    if (!manualAddress.trim()) {
      Alert.alert('Error', 'Please enter a valid address');
      return;
    }

    setIsGeocodingAddress(true);
    try {
      const location = await geocodeAddress(manualAddress.trim());
      if (location) {
        onLocationSelect(location);
        setShowManualInput(false);
        setManualAddress('');
      } else {
        // If geocoding fails, create a location with just the address
        const manualLocation: Location = {
          latitude: 0,
          longitude: 0,
          address: manualAddress.trim(),
        };
        onLocationSelect(manualLocation);
        setShowManualInput(false);
        setManualAddress('');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      // Still allow manual address even if geocoding fails
      const manualLocation: Location = {
        latitude: 0,
        longitude: 0,
        address: manualAddress.trim(),
      };
      onLocationSelect(manualLocation);
      setShowManualInput(false);
      setManualAddress('');
    } finally {
      setIsGeocodingAddress(false);
    }
  };

  const handleEditLocation = () => {
    setManualAddress(selectedLocation?.address || '');
    setShowManualInput(true);
  };

  if (selectedLocation && !showManualInput) {
    return (
      <View style={styles.selectedLocationContainer}>
        <View style={styles.selectedLocationHeader}>
          <MapPin size={20} color={Colors.primary} />
          <Text style={styles.selectedLocationTitle}>{title}</Text>
        </View>
        
        <View style={styles.selectedLocationContent}>
          <Text style={styles.selectedLocationAddress}>{selectedLocation.address}</Text>
          {selectedLocation.latitude !== 0 && selectedLocation.longitude !== 0 && (
            <Text style={styles.selectedLocationCoords}>
              {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
            </Text>
          )}
        </View>
        
        <View style={styles.selectedLocationActions}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditLocation}>
            <Edit3 size={16} color={Colors.primary} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.clearButton} onPress={onLocationClear}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {!showManualInput ? (
        <View style={styles.locationOptions}>
          {showCurrentLocationButton && (
            <Button
              title={isLoadingLocation ? "Getting Location..." : "Use Current Location"}
              onPress={handleGetCurrentLocation}
              disabled={isLoadingLocation}
              style={styles.locationButton}
              icon={
                isLoadingLocation ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Navigation size={20} color={Colors.white} />
                )
              }
            />
          )}
          
          <TouchableOpacity
            style={styles.manualButton}
            onPress={() => setShowManualInput(true)}
          >
            <Edit3 size={20} color={Colors.primary} />
            <Text style={styles.manualButtonText}>Enter Address Manually</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.manualInputContainer}>
          <Input
            placeholder={placeholder}
            value={manualAddress}
            onChangeText={setManualAddress}
            multiline
            numberOfLines={3}
            style={styles.addressInput}
          />
          
          <View style={styles.manualInputActions}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => {
                setShowManualInput(false);
                setManualAddress('');
              }}
              style={styles.cancelButton}
            />
            
            <Button
              title={isGeocodingAddress ? "Confirming..." : "Confirm Address"}
              onPress={handleManualAddressSubmit}
              disabled={isGeocodingAddress || !manualAddress.trim()}
              style={styles.confirmButton}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  locationOptions: {
    gap: 12,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.background,
    gap: 8,
  },
  manualButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  manualInputContainer: {
    gap: 12,
  },
  addressInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  manualInputActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 2,
  },
  selectedLocationContainer: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    marginVertical: 16,
  },
  selectedLocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  selectedLocationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  selectedLocationContent: {
    marginBottom: 12,
  },
  selectedLocationAddress: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  selectedLocationCoords: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  selectedLocationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearButtonText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '500',
  },
});