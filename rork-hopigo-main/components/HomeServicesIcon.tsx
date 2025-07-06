import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Home, Wrench, AlertTriangle, Car, Users, Map, Laptop, Heart, Utensils, Briefcase, Baby, MoreHorizontal } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface HomeServicesIconProps {
  name: string;
  size?: number;
  color?: string;
}

export const HomeServicesIcon: React.FC<HomeServicesIconProps> = ({ 
  name,
  size = 32, 
  color = Colors.primary 
}) => {
  const renderIcon = () => {
    switch (name) {
      case 'alert-triangle':
        return <AlertTriangle size={size} color={color} style={styles.homeIcon} />;
      case 'car':
        return <Car size={size} color={color} style={styles.homeIcon} />;
      case 'home':
        return <Home size={size} color={color} style={styles.homeIcon} />;
      case 'user':
        return <Users size={size} color={color} style={styles.homeIcon} />;
      case 'map':
        return <Map size={size} color={color} style={styles.homeIcon} />;
      case 'laptop':
        return <Laptop size={size} color={color} style={styles.homeIcon} />;
      case 'heart-pulse':
        return <Heart size={size} color={color} style={styles.homeIcon} />;
      case 'utensils':
        return <Utensils size={size} color={color} style={styles.homeIcon} />;
      case 'briefcase':
        return <Briefcase size={size} color={color} style={styles.homeIcon} />;
      case 'baby':
        return <Baby size={size} color={color} style={styles.homeIcon} />;
      case 'more-horizontal':
        return <MoreHorizontal size={size} color={color} style={styles.homeIcon} />;
      default:
        return (
          <>
            <View style={[styles.homeBackground, { 
              width: size * 0.9, 
              height: size * 0.9,
            }]}>
              <Home size={size * 0.6} color="#FFFFFF" style={styles.homeIcon} />
            </View>
            <View style={[styles.wrenchContainer, { 
              width: size * 0.45, 
              height: size * 0.45,
              bottom: -size * 0.1,
              right: -size * 0.1,
            }]}>
              <Wrench 
                size={size * 0.3} 
                color="#6B7280"
                style={styles.wrenchIcon}
              />
            </View>
          </>
        );
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {renderIcon()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIcon: {
    position: 'absolute',
  },
  homeBackground: {
    position: 'absolute',
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  wrenchContainer: {
    position: 'absolute',
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  wrenchIcon: {
    transform: [{ rotate: '45deg' }],
  },
});