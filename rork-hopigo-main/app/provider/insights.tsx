import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, TrendingUp, DollarSign, Users, Star, Calendar, BarChart3 } from 'lucide-react-native';
import Colors from '@/constants/colors';

const performanceMetrics = [
  {
    id: 'earnings',
    title: 'Total Earnings',
    value: '2,450',
    unit: 'AWG',
    change: '+12%',
    trend: 'up',
    icon: 'dollar-sign',
  },
  {
    id: 'bookings',
    title: 'Completed Bookings',
    value: '47',
    unit: 'jobs',
    change: '+8%',
    trend: 'up',
    icon: 'calendar',
  },
  {
    id: 'rating',
    title: 'Average Rating',
    value: '4.8',
    unit: 'stars',
    change: '+0.2',
    trend: 'up',
    icon: 'star',
  },
  {
    id: 'customers',
    title: 'New Customers',
    value: '23',
    unit: 'clients',
    change: '+15%',
    trend: 'up',
    icon: 'users',
  },
];

const recentInsights = [
  {
    id: '1',
    title: 'Peak Booking Hours',
    description: 'Most of your bookings happen between 2-6 PM on weekdays',
    actionText: 'Optimize Schedule',
  },
  {
    id: '2',
    title: 'Service Performance',
    description: 'Home cleaning services have the highest customer satisfaction',
    actionText: 'View Details',
  },
  {
    id: '3',
    title: 'Pricing Opportunity',
    description: 'You could increase rates by 10% based on market analysis',
    actionText: 'Review Pricing',
  },
];

export default function ProviderInsightsScreen() {
  const router = useRouter();

  const getIconComponent = (iconName: string) => {
    const iconProps = { size: 24, color: Colors.primary };
    
    switch (iconName) {
      case 'dollar-sign':
        return <DollarSign {...iconProps} />;
      case 'calendar':
        return <Calendar {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      case 'users':
        return <Users {...iconProps} />;
      default:
        return <TrendingUp {...iconProps} />;
    }
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? '#4ECDC4' : '#FF6B6B';
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Performance Insights',
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
          <Text style={styles.title}>Your Performance</Text>
          <Text style={styles.subtitle}>
            Track your progress and discover opportunities to grow your business
          </Text>
        </View>

        <View style={styles.periodSelector}>
          <TouchableOpacity style={[styles.periodButton, styles.activePeriod]}>
            <Text style={[styles.periodText, styles.activePeriodText]}>This Month</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.periodButton}>
            <Text style={styles.periodText}>Last Month</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.periodButton}>
            <Text style={styles.periodText}>3 Months</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metricsGrid}>
          {performanceMetrics.map((metric) => (
            <Card key={metric.id} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <View style={styles.metricIcon}>
                  {getIconComponent(metric.icon)}
                </View>
                <View style={[styles.changeIndicator, { backgroundColor: getTrendColor(metric.trend) + '20' }]}>
                  <Text style={[styles.changeText, { color: getTrendColor(metric.trend) }]}>
                    {metric.change}
                  </Text>
                </View>
              </View>
              <Text style={styles.metricValue}>
                {metric.value} <Text style={styles.metricUnit}>{metric.unit}</Text>
              </Text>
              <Text style={styles.metricTitle}>{metric.title}</Text>
            </Card>
          ))}
        </View>

        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Earnings Trend</Text>
            <TouchableOpacity>
              <BarChart3 size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>
              📊 Interactive chart would be displayed here
            </Text>
            <Text style={styles.chartDescription}>
              Track your daily, weekly, and monthly earnings
            </Text>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Insights & Recommendations</Text>
        </View>

        {recentInsights.map((insight) => (
          <Card key={insight.id} style={styles.insightCard}>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
            </View>
            <Button
              title={insight.actionText}
              variant="secondary"
              size="small"
              style={styles.insightButton}
            />
          </Card>
        ))}

        <Card style={styles.goalsCard}>
          <Text style={styles.goalsTitle}>Monthly Goals</Text>
          <View style={styles.goalsList}>
            <View style={styles.goalItem}>
              <View style={styles.goalInfo}>
                <Text style={styles.goalName}>Earnings Target</Text>
                <Text style={styles.goalProgress}>2,450 / 3,000 AWG</Text>
              </View>
              <View style={styles.goalBar}>
                <View style={[styles.goalFill, { width: '82%' }]} />
              </View>
            </View>
            
            <View style={styles.goalItem}>
              <View style={styles.goalInfo}>
                <Text style={styles.goalName}>Bookings Target</Text>
                <Text style={styles.goalProgress}>47 / 60 jobs</Text>
              </View>
              <View style={styles.goalBar}>
                <View style={[styles.goalFill, { width: '78%' }]} />
              </View>
            </View>
            
            <View style={styles.goalItem}>
              <View style={styles.goalInfo}>
                <Text style={styles.goalName}>Rating Goal</Text>
                <Text style={styles.goalProgress}>4.8 / 5.0 stars</Text>
              </View>
              <View style={styles.goalBar}>
                <View style={[styles.goalFill, { width: '96%' }]} />
              </View>
            </View>
          </View>
        </Card>

        <Card style={styles.exportCard}>
          <Text style={styles.exportTitle}>Export Your Data</Text>
          <Text style={styles.exportDescription}>
            Download detailed reports for your records or tax purposes
          </Text>
          <Button
            title="Generate Report"
            variant="primary"
            style={styles.exportButton}
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
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activePeriod: {
    backgroundColor: Colors.primary,
  },
  periodText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activePeriodText: {
    color: Colors.white,
  },
  metricsGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
    margin: 0,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  metricTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chartCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: Colors.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  chartDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  insightCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightContent: {
    flex: 1,
    marginRight: 16,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  insightButton: {
    paddingHorizontal: 16,
  },
  goalsCard: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    padding: 20,
  },
  goalsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  goalsList: {
    gap: 16,
  },
  goalItem: {
    gap: 8,
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalName: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  goalProgress: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  goalBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  exportCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    alignItems: 'center',
  },
  exportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  exportDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  exportButton: {
    width: '100%',
  },
});