import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, PlayCircle, BookOpen, Award, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';

const trainingCourses = [
  {
    id: '1',
    title: 'Customer Service Excellence',
    description: 'Learn how to provide exceptional customer service and build lasting relationships',
    duration: '2 hours',
    level: 'Beginner',
    progress: 0,
    category: 'Communication',
  },
  {
    id: '2',
    title: 'Professional Photography',
    description: 'Master the art of professional photography for service documentation',
    duration: '3 hours',
    level: 'Intermediate',
    progress: 45,
    category: 'Technical',
  },
  {
    id: '3',
    title: 'Business Management Basics',
    description: 'Essential business skills for service providers',
    duration: '4 hours',
    level: 'Beginner',
    progress: 100,
    category: 'Business',
  },
  {
    id: '4',
    title: 'Safety Protocols',
    description: 'Important safety guidelines for various service categories',
    duration: '1.5 hours',
    level: 'Beginner',
    progress: 0,
    category: 'Safety',
  },
];

export default function ProviderTrainingScreen() {
  const router = useRouter();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return Colors.primary;
      case 'Intermediate':
        return '#FF8A80';
      case 'Advanced':
        return '#FF6B6B';
      default:
        return Colors.textSecondary;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return '#4ECDC4';
    if (progress > 0) return '#FFD93D';
    return Colors.border;
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Training Center',
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
          <Text style={styles.title}>Enhance Your Skills</Text>
          <Text style={styles.subtitle}>
            Take courses to improve your service quality and earn certifications
          </Text>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Courses</Text>
        </View>

        {trainingCourses.map((course) => (
          <Card key={course.id} style={styles.courseCard}>
            <View style={styles.courseHeader}>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseDescription}>{course.description}</Text>
                
                <View style={styles.courseMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={16} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>{course.duration}</Text>
                  </View>
                  <View style={[styles.levelBadge, { backgroundColor: getLevelColor(course.level) + '20' }]}>
                    <Text style={[styles.levelText, { color: getLevelColor(course.level) }]}>
                      {course.level}
                    </Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity style={styles.playButton}>
                <PlayCircle size={40} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {course.progress > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressPercent}>{course.progress}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${course.progress}%`,
                        backgroundColor: getProgressColor(course.progress)
                      }
                    ]} 
                  />
                </View>
              </View>
            )}

            <View style={styles.courseActions}>
              <Button
                title={course.progress === 100 ? 'Review' : course.progress > 0 ? 'Continue' : 'Start Course'}
                variant={course.progress === 100 ? 'secondary' : 'primary'}
                size="small"
                style={styles.courseButton}
              />
              {course.progress === 100 && (
                <View style={styles.certificateContainer}>
                  <Award size={20} color="#4ECDC4" />
                  <Text style={styles.certificateText}>Certified</Text>
                </View>
              )}
            </View>
          </Card>
        ))}

        <Card style={styles.benefitsCard}>
          <View style={styles.benefitsHeader}>
            <BookOpen size={24} color={Colors.primary} />
            <Text style={styles.benefitsTitle}>Training Benefits</Text>
          </View>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>• Improve your service quality</Text>
            <Text style={styles.benefitItem}>• Earn professional certifications</Text>
            <Text style={styles.benefitItem}>• Increase your booking rates</Text>
            <Text style={styles.benefitItem}>• Access to exclusive opportunities</Text>
          </View>
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
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  courseCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseInfo: {
    flex: 1,
    marginRight: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  playButton: {
    padding: 4,
  },
  progressContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  courseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  courseButton: {
    flex: 1,
    marginRight: 12,
  },
  certificateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  certificateText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  benefitsCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});