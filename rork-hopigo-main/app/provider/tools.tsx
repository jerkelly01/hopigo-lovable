import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calculator, Calendar, FileText, Camera, MapPin, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';

const businessTools = [
  {
    id: 'calculator',
    title: 'Price Calculator',
    description: 'Calculate service prices based on time, materials, and complexity',
    icon: 'calculator',
    color: '#4ECDC4',
    route: '/provider/tools/calculator',
  },
  {
    id: 'scheduler',
    title: 'Schedule Manager',
    description: 'Manage your appointments and availability',
    icon: 'calendar',
    color: '#6C5CE7',
    route: '/provider/schedule',
  },
  {
    id: 'invoices',
    title: 'Invoice Generator',
    description: 'Create professional invoices for your services',
    icon: 'file-text',
    color: '#FFD93D',
    route: '/provider/tools/invoices',
  },
  {
    id: 'photos',
    title: 'Photo Documentation',
    description: 'Take before/after photos for service documentation',
    icon: 'camera',
    color: '#FF8A80',
    route: '/provider/tools/photos',
  },
  {
    id: 'routes',
    title: 'Route Optimizer',
    description: 'Optimize your travel routes between appointments',
    icon: 'map-pin',
    color: '#A8E6CF',
    route: '/provider/tools/routes',
  },
  {
    id: 'timetracker',
    title: 'Time Tracker',
    description: 'Track time spent on each service for accurate billing',
    icon: 'clock',
    color: '#FF6B6B',
    route: '/provider/tools/timetracker',
  },
];

export default function ProviderToolsScreen() {
  const router = useRouter();

  const getIconComponent = (iconName: string, color: string) => {
    const iconProps = { size: 32, color };
    
    switch (iconName) {
      case 'calculator':
        return <Calculator {...iconProps} />;
      case 'calendar':
        return <Calendar {...iconProps} />;
      case 'file-text':
        return <FileText {...iconProps} />;
      case 'camera':
        return <Camera {...iconProps} />;
      case 'map-pin':
        return <MapPin {...iconProps} />;
      case 'clock':
        return <Clock {...iconProps} />;
      default:
        return <Calculator {...iconProps} />;
    }
  };

  const handleToolPress = (tool: any) => {
    // For now, we'll just show an alert since the detailed tool pages aren't implemented
    // In a real app, you would navigate to the specific tool page
    router.push(tool.route);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Business Tools',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Business Tools</Text>
          <Text style={styles.subtitle}>
            Professional tools to help you manage and grow your service business
          </Text>
        </View>

        <Card style={styles.featuredCard}>
          <Text style={styles.featuredTitle}>🚀 New Feature</Text>
          <Text style={styles.featuredDescription}>
            AI-powered pricing suggestions based on market rates and your service history
          </Text>
          <Button
            title="Try Now"
            variant="primary"
            size="small"
            style={styles.featuredButton}
          />
        </Card>

        <View style={styles.toolsGrid}>
          {businessTools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
              onPress={() => handleToolPress(tool)}
              activeOpacity={0.8}
            >
              <Card style={styles.toolCardContent}>
                <View style={[styles.toolIcon, { backgroundColor: tool.color + '20' }]}>
                  {getIconComponent(tool.icon, tool.color)}
                </View>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Use the price calculator to ensure competitive pricing</Text>
            <Text style={styles.tipItem}>• Document your work with photos for quality assurance</Text>
            <Text style={styles.tipItem}>• Track your time to improve efficiency and pricing</Text>
            <Text style={styles.tipItem}>• Optimize routes to save time and fuel costs</Text>
          </View>
        </Card>

        <Card style={styles.supportCard}>
          <Text style={styles.supportTitle}>Need Help?</Text>
          <Text style={styles.supportDescription}>
            Our support team can help you make the most of these business tools.
          </Text>
          <Button
            title="Contact Support"
            variant="secondary"
            style={styles.supportButton}
            onPress={() => router.push('/provider/support')}
          />
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
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
  featuredCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    backgroundColor: Colors.primary + '10',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  featuredButton: {
    alignSelf: 'flex-start',
  },
  toolsGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: '48%',
    marginBottom: 16,
  },
  toolCardContent: {
    padding: 16,
    alignItems: 'center',
    minHeight: 160,
    margin: 0,
  },
  toolIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  toolDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  tipsCard: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  supportCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  supportDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  supportButton: {
    width: '100%',
  },
});