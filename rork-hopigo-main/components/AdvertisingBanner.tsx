import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Advertisement {
  id: string;
  title: string;
  description: string;
  image: string;
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  onPress?: () => void;
}

interface AdvertisingBannerProps {
  advertisements: Advertisement[];
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth; // Full screen width

export const AdvertisingBanner: React.FC<AdvertisingBannerProps> = ({
  advertisements,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (advertisements.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % advertisements.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * CARD_WIDTH,
          animated: true,
        });
        return nextIndex;
      });
    }, 6000); // Slower rotation - every 6 seconds
    
    return () => clearInterval(interval);
  }, [advertisements.length]);
  
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setCurrentIndex(index);
  };
  
  const renderAdvertisement = (ad: Advertisement, index: number) => (
    <TouchableOpacity
      key={ad.id}
      style={[
        styles.adCard,
        { backgroundColor: ad.backgroundColor || Colors.primary }
      ]}
      onPress={ad.onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: ad.image }}
        style={styles.adImage}
        resizeMode="cover"
      />
      <View style={styles.adOverlay} />
      <View style={styles.adContent}>
        <View style={styles.adTextContainer}>
          <Text style={[
            styles.adTitle,
            { color: ad.textColor || Colors.white }
          ]}>
            {ad.title}
          </Text>
          <Text style={[
            styles.adDescription,
            { color: ad.textColor || Colors.white }
          ]}>
            {ad.description}
          </Text>
          {ad.buttonText && (
            <View style={styles.adButton}>
              <Text style={[
                styles.adButtonText,
                { color: ad.textColor || Colors.white }
              ]}>
                {ad.buttonText}
              </Text>
              <ArrowRight 
                size={16} 
                color={ad.textColor || Colors.white} 
                style={styles.adButtonIcon}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (advertisements.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        bounces={false}
        bouncesZoom={false}
      >
        {advertisements.map(renderAdvertisement)}
      </ScrollView>
      
      {advertisements.length > 1 && (
        <View style={styles.pagination}>
          {advertisements.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: '100%',
  },
  adCard: {
    width: CARD_WIDTH,
    height: 220,
    position: 'relative',
  },
  adImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  adOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  adContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  adTextContainer: {
    width: '80%',
  },
  adTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  adDescription: {
    fontSize: 15,
    opacity: 0.95,
    marginBottom: 16,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  adButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  adButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  adButtonIcon: {
    marginLeft: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    position: 'absolute',
    bottom: -24,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.white,
    width: 20,
  },
});