import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MapPin, Search, Clock, Building, Home, Briefcase, Star } from 'lucide-react-native';
import { Location } from '@/types/marketplace';
import Colors from '@/constants/colors';

interface AddressInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onLocationSelect: (location: Location) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  showCurrentLocationButton?: boolean;
  showSuggestions?: boolean;
  style?: any;
}

interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  type: 'current' | 'recent' | 'popular' | 'search';
  location: Location;
  icon?: React.ReactElement;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChangeText,
  onLocationSelect,
  onFocus,
  onBlur,
  placeholder = "Enter address",
  showCurrentLocationButton = true,
  showSuggestions = false,
  style
}) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Popular destinations in Aruba - Expanded list
  const popularDestinations: LocationSuggestion[] = [
    {
      id: 'airport',
      name: 'Queen Beatrix International Airport',
      address: 'Reina Beatrix International Airport, Oranjestad, Aruba',
      type: 'popular',
      location: { latitude: 12.5014, longitude: -70.0152, address: 'Queen Beatrix International Airport, Oranjestad, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'eagle-beach',
      name: 'Eagle Beach',
      address: 'Eagle Beach, Noord, Aruba',
      type: 'popular',
      location: { latitude: 12.5464, longitude: -70.0364, address: 'Eagle Beach, Noord, Aruba' },
      icon: <Star size={16} color={Colors.warning} />
    },
    {
      id: 'palm-beach',
      name: 'Palm Beach',
      address: 'Palm Beach, Noord, Aruba',
      type: 'popular',
      location: { latitude: 12.5611, longitude: -70.0406, address: 'Palm Beach, Noord, Aruba' },
      icon: <Star size={16} color={Colors.warning} />
    },
    {
      id: 'oranjestad',
      name: 'Downtown Oranjestad',
      address: 'Oranjestad, Aruba',
      type: 'popular',
      location: { latitude: 12.5186, longitude: -70.0358, address: 'Oranjestad, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'aruba-marriott',
      name: 'Aruba Marriott Resort',
      address: 'L.G. Smith Blvd 101, Palm Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5625, longitude: -70.0403, address: 'L.G. Smith Blvd 101, Palm Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'hyatt-regency',
      name: 'Hyatt Regency Aruba Resort',
      address: 'J.E. Irausquin Blvd 85, Palm Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5619, longitude: -70.0401, address: 'J.E. Irausquin Blvd 85, Palm Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'renaissance-marketplace',
      name: 'Renaissance Marketplace',
      address: 'L.G. Smith Blvd 82, Oranjestad, Aruba',
      type: 'popular',
      location: { latitude: 12.5197, longitude: -70.0347, address: 'L.G. Smith Blvd 82, Oranjestad, Aruba' },
      icon: <Briefcase size={16} color={Colors.primary} />
    },
    {
      id: 'aruba-aloe-factory',
      name: 'Aruba Aloe Factory & Museum',
      address: 'Pitastraat 115, Hato, Aruba',
      type: 'popular',
      location: { latitude: 12.5089, longitude: -69.9897, address: 'Pitastraat 115, Hato, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'california-lighthouse',
      name: 'California Lighthouse',
      address: 'California Lighthouse, Hudishibana, Aruba',
      type: 'popular',
      location: { latitude: 12.5916, longitude: -70.0631, address: 'California Lighthouse, Hudishibana, Aruba' },
      icon: <Star size={16} color={Colors.warning} />
    },
    {
      id: 'butterfly-farm',
      name: 'Butterfly Farm Aruba',
      address: 'J.E. Irausquin Blvd, Palm Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5567, longitude: -70.0389, address: 'J.E. Irausquin Blvd, Palm Beach, Aruba' },
      icon: <Star size={16} color={Colors.warning} />
    },
    {
      id: 'alto-vista-chapel',
      name: 'Alto Vista Chapel',
      address: 'Alto Vista Chapel, Noord, Aruba',
      type: 'popular',
      location: { latitude: 12.5789, longitude: -70.0456, address: 'Alto Vista Chapel, Noord, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'natural-bridge',
      name: 'Natural Bridge Ruins',
      address: 'Natural Bridge, Andicuri, Aruba',
      type: 'popular',
      location: { latitude: 12.5833, longitude: -70.0167, address: 'Natural Bridge, Andicuri, Aruba' },
      icon: <Star size={16} color={Colors.warning} />
    },
    {
      id: 'arikok-national-park',
      name: 'Arikok National Park',
      address: 'Arikok National Park, San Fuego, Aruba',
      type: 'popular',
      location: { latitude: 12.5167, longitude: -69.9333, address: 'Arikok National Park, San Fuego, Aruba' },
      icon: <Star size={16} color={Colors.warning} />
    },
    {
      id: 'baby-beach',
      name: 'Baby Beach',
      address: 'Baby Beach, Seroe Colorado, Aruba',
      type: 'popular',
      location: { latitude: 12.4167, longitude: -69.8833, address: 'Baby Beach, Seroe Colorado, Aruba' },
      icon: <Star size={16} color={Colors.warning} />
    },
    {
      id: 'flamingo-beach',
      name: 'Flamingo Beach',
      address: 'Renaissance Island, Oranjestad, Aruba',
      type: 'popular',
      location: { latitude: 12.5167, longitude: -70.0500, address: 'Renaissance Island, Oranjestad, Aruba' },
      icon: <Star size={16} color={Colors.warning} />
    },
    // Additional popular destinations
    {
      id: 'ritz-carlton',
      name: 'The Ritz-Carlton, Aruba',
      address: 'L.G. Smith Blvd 107, Palm Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5633, longitude: -70.0408, address: 'L.G. Smith Blvd 107, Palm Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'hilton-aruba',
      name: 'Hilton Aruba Caribbean Resort',
      address: 'J.E. Irausquin Blvd 81, Palm Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5614, longitude: -70.0398, address: 'J.E. Irausquin Blvd 81, Palm Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'holiday-inn',
      name: 'Holiday Inn Resort Aruba',
      address: 'J.E. Irausquin Blvd 230, Palm Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5589, longitude: -70.0385, address: 'J.E. Irausquin Blvd 230, Palm Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'barcelo-aruba',
      name: 'Barceló Aruba',
      address: 'J.E. Irausquin Blvd 83, Palm Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5617, longitude: -70.0399, address: 'J.E. Irausquin Blvd 83, Palm Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'divi-aruba',
      name: 'Divi Aruba All Inclusive',
      address: 'J.E. Irausquin Blvd 45, Druif Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5456, longitude: -70.0361, address: 'J.E. Irausquin Blvd 45, Druif Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'manchebo-beach',
      name: 'Manchebo Beach Resort',
      address: 'J.E. Irausquin Blvd 55, Eagle Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5467, longitude: -70.0365, address: 'J.E. Irausquin Blvd 55, Eagle Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'casa-del-mar',
      name: 'Casa del Mar Beach Resort',
      address: 'J.E. Irausquin Blvd 51, Eagle Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5464, longitude: -70.0364, address: 'J.E. Irausquin Blvd 51, Eagle Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'bucuti-tara',
      name: 'Bucuti & Tara Beach Resort',
      address: 'L.G. Smith Blvd 55B, Eagle Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5461, longitude: -70.0362, address: 'L.G. Smith Blvd 55B, Eagle Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'aruba-phoenix',
      name: 'Aruba Phoenix Beach Resort',
      address: 'J.E. Irausquin Blvd 75, Palm Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5611, longitude: -70.0396, address: 'J.E. Irausquin Blvd 75, Palm Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'occidental-grand',
      name: 'Occidental Grand Aruba',
      address: 'J.E. Irausquin Blvd 83, Palm Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5617, longitude: -70.0399, address: 'J.E. Irausquin Blvd 83, Palm Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'playa-linda',
      name: 'Playa Linda Beach Resort',
      address: 'J.E. Irausquin Blvd 87, Palm Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5619, longitude: -70.0401, address: 'J.E. Irausquin Blvd 87, Palm Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'costa-linda',
      name: 'Costa Linda Beach Resort',
      address: 'J.E. Irausquin Blvd 59, Eagle Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5469, longitude: -70.0366, address: 'J.E. Irausquin Blvd 59, Eagle Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'la-cabana',
      name: 'La Cabana Beach Resort',
      address: 'J.E. Irausquin Blvd 250, Eagle Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5456, longitude: -70.0361, address: 'J.E. Irausquin Blvd 250, Eagle Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'mill-resort',
      name: 'The Mill Resort & Suites',
      address: 'J.E. Irausquin Blvd 330, Palm Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5578, longitude: -70.0381, address: 'J.E. Irausquin Blvd 330, Palm Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'boardwalk-hotel',
      name: 'Boardwalk Hotel Aruba',
      address: 'Bakval 20, Oranjestad, Aruba',
      type: 'popular',
      location: { latitude: 12.5186, longitude: -70.0358, address: 'Bakval 20, Oranjestad, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'talk-of-the-town',
      name: 'Talk of the Town Hotel & Beach Club',
      address: 'L.G. Smith Blvd 2, Oranjestad, Aruba',
      type: 'popular',
      location: { latitude: 12.5197, longitude: -70.0347, address: 'L.G. Smith Blvd 2, Oranjestad, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'aruba-beach-club',
      name: 'Aruba Beach Club',
      address: 'J.E. Irausquin Blvd 51-53, Noord, Aruba',
      type: 'popular',
      location: { latitude: 12.5464, longitude: -70.0364, address: 'J.E. Irausquin Blvd 51-53, Noord, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'delfins-beach',
      name: 'Delfins Beach Resort',
      address: 'J.E. Irausquin Blvd 41, Eagle Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5461, longitude: -70.0362, address: 'J.E. Irausquin Blvd 41, Eagle Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'tropicana-resort',
      name: 'Tropicana Aruba Resort',
      address: 'J.E. Irausquin Blvd 248, Eagle Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5456, longitude: -70.0361, address: 'J.E. Irausquin Blvd 248, Eagle Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    },
    {
      id: 'amsterdam-manor',
      name: 'Amsterdam Manor Beach Resort',
      address: 'J.E. Irausquin Blvd 252, Eagle Beach, Aruba',
      type: 'popular',
      location: { latitude: 12.5456, longitude: -70.0361, address: 'J.E. Irausquin Blvd 252, Eagle Beach, Aruba' },
      icon: <Building size={16} color={Colors.primary} />
    }
  ];

  // Recent locations (mock data)
  const recentLocations: LocationSuggestion[] = [
    {
      id: 'recent-1',
      name: 'Home',
      address: 'Bakval 23, Oranjestad, Aruba',
      type: 'recent',
      location: { latitude: 12.5186, longitude: -70.0358, address: 'Bakval 23, Oranjestad, Aruba' },
      icon: <Home size={16} color={Colors.textSecondary} />
    },
    {
      id: 'recent-2',
      name: 'Work',
      address: 'Havenstraat 6, Oranjestad, Aruba',
      type: 'recent',
      location: { latitude: 12.5197, longitude: -70.0347, address: 'Havenstraat 6, Oranjestad, Aruba' },
      icon: <Briefcase size={16} color={Colors.textSecondary} />
    }
  ];

  useEffect(() => {
    if (value.trim().length > 0) {
      generateSuggestions(value);
    } else {
      // Show popular destinations when no input but suggestions are requested
      if (showSuggestions) {
        setSuggestions([...recentLocations, ...popularDestinations.slice(0, 12)]);
      } else {
        setSuggestions([]);
      }
    }
  }, [value, showSuggestions]);

  const generateSuggestions = async (query: string) => {
    setIsLoading(true);
    
    try {
      const lowercaseQuery = query.toLowerCase();
      const filteredSuggestions: LocationSuggestion[] = [];

      // Add recent locations that match
      recentLocations.forEach(location => {
        if (location.name.toLowerCase().includes(lowercaseQuery) || 
            location.address.toLowerCase().includes(lowercaseQuery)) {
          filteredSuggestions.push(location);
        }
      });

      // Add popular destinations that match
      popularDestinations.forEach(location => {
        if (location.name.toLowerCase().includes(lowercaseQuery) || 
            location.address.toLowerCase().includes(lowercaseQuery)) {
          filteredSuggestions.push(location);
        }
      });

      // Add some mock search results for addresses that don't match popular destinations
      if (filteredSuggestions.length < 5) {
        const mockResults: LocationSuggestion[] = [
          {
            id: 'search-1',
            name: `${query} - Oranjestad`,
            address: `${query}, Oranjestad, Aruba`,
            type: 'search',
            location: { 
              latitude: 12.5186 + (Math.random() - 0.5) * 0.01, 
              longitude: -70.0358 + (Math.random() - 0.5) * 0.01, 
              address: `${query}, Oranjestad, Aruba` 
            },
            icon: <Search size={16} color={Colors.textSecondary} />
          },
          {
            id: 'search-2',
            name: `${query} - Noord`,
            address: `${query}, Noord, Aruba`,
            type: 'search',
            location: { 
              latitude: 12.5464 + (Math.random() - 0.5) * 0.01, 
              longitude: -70.0364 + (Math.random() - 0.5) * 0.01, 
              address: `${query}, Noord, Aruba` 
            },
            icon: <Search size={16} color={Colors.textSecondary} />
          },
          {
            id: 'search-3',
            name: `${query} - Palm Beach`,
            address: `${query}, Palm Beach, Aruba`,
            type: 'search',
            location: { 
              latitude: 12.5611 + (Math.random() - 0.5) * 0.01,
              longitude: -70.0406 + (Math.random() - 0.5) * 0.01,
              address: `${query}, Palm Beach, Aruba` 
            },
            icon: <Search size={16} color={Colors.textSecondary} />
          }
        ];
        filteredSuggestions.push(...mockResults);
      }

      setSuggestions(filteredSuggestions.slice(0, 15));
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    onChangeText(suggestion.address);
    onLocationSelect(suggestion.location);
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      // Mock current location for Aruba
      const currentLocation: Location = {
        latitude: 12.5186,
        longitude: -70.0358,
        address: 'Current Location, Oranjestad, Aruba'
      };
      
      onLocationSelect(currentLocation);
      onChangeText(currentLocation.address);
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputFocus = () => {
    onFocus?.();
  };

  const handleInputBlur = () => {
    onBlur?.();
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        {showCurrentLocationButton && (
          <TouchableOpacity 
            style={styles.currentLocationButton}
            onPress={getCurrentLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <MapPin size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView 
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {suggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.id}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionSelect(suggestion)}
              >
                <View style={styles.suggestionIcon}>
                  {suggestion.icon || <MapPin size={16} color={Colors.textSecondary} />}
                </View>
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionName} numberOfLines={1}>
                    {suggestion.name}
                  </Text>
                  <Text style={styles.suggestionAddress} numberOfLines={1}>
                    {suggestion.address}
                  </Text>
                </View>
                {suggestion.type === 'recent' && (
                  <View style={styles.recentBadge}>
                    <Clock size={12} color={Colors.textSecondary} />
                  </View>
                )}
                {suggestion.type === 'popular' && (
                  <View style={styles.popularBadge}>
                    <Star size={12} color={Colors.warning} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 4,
  },
  currentLocationButton: {
    padding: 4,
    marginLeft: 8,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999999,
    maxHeight: 250,
  },
  suggestionsList: {
    maxHeight: 250,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  suggestionIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  suggestionAddress: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  recentBadge: {
    marginLeft: 8,
  },
  popularBadge: {
    marginLeft: 8,
  },
});