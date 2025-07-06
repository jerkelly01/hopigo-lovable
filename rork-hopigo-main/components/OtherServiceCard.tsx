import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Card } from '@/components/ui/Card';
import { OtherService } from '@/constants/other-services';
import { Receipt, Car, Ticket, Heart, Award, Percent } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface OtherServiceCardProps {
  service: OtherService;
  onPress: () => void;
  style?: ViewStyle;
}

const iconMap = {
  receipt: Receipt,
  car: Car,
  ticket: Ticket,
  heart: Heart,
  award: Award,
  percent: Percent,
};

export function OtherServiceCard({ service, onPress, style }: OtherServiceCardProps) {
  const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Receipt;

  return (
    <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.7}>
      <Card style={[styles.card, { backgroundColor: service.color + '15' }]}>
        <IconComponent 
          size={28} 
          color={service.color} 
          style={styles.icon}
        />
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.description}>{service.description}</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
});