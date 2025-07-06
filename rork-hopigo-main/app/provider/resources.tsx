import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Download, FileText, Video, Image, ExternalLink } from 'lucide-react-native';
import Colors from '@/constants/colors';

const resourceCategories = [
  {
    id: 'guides',
    title: 'Service Guides',
    icon: 'file-text',
    description: 'Step-by-step guides for various services',
    items: [
      { name: 'Home Cleaning Checklist', type: 'PDF', size: '2.1 MB' },
      { name: 'Plumbing Safety Guide', type: 'PDF', size: '1.8 MB' },
      { name: 'Electrical Work Standards', type: 'PDF', size: '3.2 MB' },
    ],
  },
  {
    id: 'templates',
    title: 'Business Templates',
    icon: 'image',
    description: 'Professional templates for your business',
    items: [
      { name: 'Service Agreement Template', type: 'DOC', size: '156 KB' },
      { name: 'Invoice Template', type: 'XLS', size: '89 KB' },
      { name: 'Quote Template', type: 'DOC', size: '134 KB' },
    ],
  },
  {
    id: 'videos',
    title: 'Training Videos',
    icon: 'video',
    description: 'Video tutorials and best practices',
    items: [
      { name: 'Customer Communication', type: 'MP4', size: '45 MB' },
      { name: 'Quality Standards', type: 'MP4', size: '38 MB' },
      { name: 'Safety Protocols', type: 'MP4', size: '52 MB' },
    ],
  },
];

export default function ProviderResourcesScreen() {
  const router = useRouter();

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'file-text':
        return <FileText size={24} color={Colors.primary} />;
      case 'image':
        return <Image size={24} color={Colors.primary} />;
      case 'video':
        return <Video size={24} color={Colors.primary} />;
      default:
        return <FileText size={24} color={Colors.primary} />;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText size={20} color="#FF6B6B" />;
      case 'DOC':
        return <FileText size={20} color="#4ECDC4" />;
      case 'XLS':
        return <FileText size={20} color="#4ECDC4" />;
      case 'MP4':
        return <Video size={20} color="#6C5CE7" />;
      default:
        return <FileText size={20} color={Colors.textSecondary} />;
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Resources',
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
          <Text style={styles.title}>Provider Resources</Text>
          <Text style={styles.subtitle}>
            Access tools, guides, and templates to help grow your business
          </Text>
        </View>

        <Card style={styles.quickLinksCard}>
          <Text style={styles.quickLinksTitle}>Quick Links</Text>
          <View style={styles.quickLinksGrid}>
            <TouchableOpacity style={styles.quickLinkItem}>
              <ExternalLink size={20} color={Colors.primary} />
              <Text style={styles.quickLinkText}>Provider Portal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLinkItem}>
              <ExternalLink size={20} color={Colors.primary} />
              <Text style={styles.quickLinkText}>Help Center</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLinkItem}>
              <ExternalLink size={20} color={Colors.primary} />
              <Text style={styles.quickLinkText}>Community Forum</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLinkItem}>
              <ExternalLink size={20} color={Colors.primary} />
              <Text style={styles.quickLinkText}>Best Practices</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {resourceCategories.map((category) => (
          <Card key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryInfo}>
                {getIconComponent(category.icon)}
                <View style={styles.categoryText}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
              </View>
            </View>

            <View style={styles.itemsList}>
              {category.items.map((item, index) => (
                <View key={index} style={styles.resourceItem}>
                  <View style={styles.itemInfo}>
                    {getFileIcon(item.type)}
                    <View style={styles.itemText}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDetails}>{item.type} • {item.size}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.downloadButton}>
                    <Download size={20} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Card>
        ))}

        <Card style={styles.supportCard}>
          <Text style={styles.supportTitle}>Need More Help?</Text>
          <Text style={styles.supportDescription}>
            Our support team is here to help you succeed. Contact us for personalized assistance.
          </Text>
          <Button
            title="Contact Support"
            variant="primary"
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
  quickLinksCard: {
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 20,
  },
  quickLinksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  quickLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  quickLinkText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  categoryCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  categoryHeader: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryText: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  itemsList: {
    gap: 12,
  },
  resourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  itemText: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  downloadButton: {
    padding: 8,
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