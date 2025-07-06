import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users, Star, Calendar, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function AnalyticsScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const analyticsData = {
    revenue: {
      current: 4800,
      previous: 4200,
      change: 14.3
    },
    bookings: {
      current: 32,
      previous: 28,
      change: 14.3
    },
    rating: {
      current: 4.8,
      previous: 4.6,
      change: 4.3
    },
    customers: {
      current: 24,
      previous: 21,
      change: 14.3
    }
  };

  const monthlyData = [
    { month: 'Jan', revenue: 3200, bookings: 18 },
    { month: 'Feb', revenue: 3800, bookings: 22 },
    { month: 'Mar', revenue: 4200, bookings: 28 },
    { month: 'Apr', revenue: 4800, bookings: 32 },
  ];

  const topServices = [
    { name: 'House Cleaning', bookings: 18, revenue: 1530 },
    { name: 'Deep Cleaning', bookings: 8, revenue: 960 },
    { name: 'Office Cleaning', bookings: 6, revenue: 570 },
  ];

  const renderMetricCard = (title: string, icon: any, current: number, previous: number, change: number, prefix = '', suffix = '') => {
    const isPositive = change > 0;
    
    return (
      <Card style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <View style={styles.metricIcon}>
            {icon}
          </View>
          <Text style={styles.metricTitle}>{title}</Text>
        </View>
        
        <Text style={styles.metricValue}>
          {prefix}{current.toLocaleString()}{suffix}
        </Text>
        
        <View style={styles.metricChange}>
          {isPositive ? (
            <TrendingUp size={16} color={Colors.success} />
          ) : (
            <TrendingDown size={16} color={Colors.error} />
          )}
          <Text style={[
            styles.changeText,
            { color: isPositive ? Colors.success : Colors.error }
          ]}>
            {isPositive ? '+' : ''}{change.toFixed(1)}%
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Analytics',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <X size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['week', 'month', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.activePeriodButtonText
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Revenue',
            <DollarSign size={20} color={Colors.success} />,
            analyticsData.revenue.current,
            analyticsData.revenue.previous,
            analyticsData.revenue.change,
            'AWG ',
            ''
          )}
          
          {renderMetricCard(
            'Bookings',
            <Calendar size={20} color={Colors.primary} />,
            analyticsData.bookings.current,
            analyticsData.bookings.previous,
            analyticsData.bookings.change
          )}
          
          {renderMetricCard(
            'Rating',
            <Star size={20} color={Colors.warning} />,
            analyticsData.rating.current,
            analyticsData.rating.previous,
            analyticsData.rating.change,
            '',
            '/5'
          )}
          
          {renderMetricCard(
            'Customers',
            <Users size={20} color={Colors.secondary} />,
            analyticsData.customers.current,
            analyticsData.customers.previous,
            analyticsData.customers.change
          )}
        </View>

        {/* Revenue Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Performance</Text>
          <View style={styles.chart}>
            {monthlyData.map((data, index) => (
              <View key={data.month} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.revenueBar,
                      { height: (data.revenue / 5000) * 100 }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.bookingsBar,
                      { height: (data.bookings / 40) * 100 }
                    ]} 
                  />
                </View>
                <Text style={styles.chartLabel}>{data.month}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: Colors.primary }]} />
              <Text style={styles.legendText}>Revenue</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: Colors.secondary }]} />
              <Text style={styles.legendText}>Bookings</Text>
            </View>
          </View>
        </Card>

        {/* Top Services */}
        <Card style={styles.servicesCard}>
          <Text style={styles.sectionTitle}>Top Services</Text>
          
          {topServices.map((service, index) => (
            <View key={service.name} style={styles.serviceRow}>
              <View style={styles.serviceRank}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceStats}>
                  {service.bookings} bookings • AWG {service.revenue}
                </Text>
              </View>
              
              <View style={styles.serviceProgress}>
                <View 
                  style={[
                    styles.progressBar,
                    { width: `${(service.bookings / 20) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          ))}
        </Card>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <Text style={styles.sectionTitle}>Insights</Text>
          
          <View style={styles.insight}>
            <View style={styles.insightIcon}>
              <TrendingUp size={20} color={Colors.success} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Peak Hours</Text>
              <Text style={styles.insightText}>
                Most bookings happen between 10 AM - 2 PM
              </Text>
            </View>
          </View>
          
          <View style={styles.insight}>
            <View style={styles.insightIcon}>
              <Star size={20} color={Colors.warning} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Customer Satisfaction</Text>
              <Text style={styles.insightText}>
                Your rating improved by 0.2 points this month
              </Text>
            </View>
          </View>
          
          <View style={styles.insight}>
            <View style={styles.insightIcon}>
              <Users size={20} color={Colors.primary} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Repeat Customers</Text>
              <Text style={styles.insightText}>
                68% of your customers book again within 30 days
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60, // Increased to lower the content more
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 4,
    margin: 20,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activePeriodButton: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activePeriodButtonText: {
    color: Colors.white,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 2,
  },
  revenueBar: {
    width: 12,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    minHeight: 4,
  },
  bookingsBar: {
    width: 12,
    backgroundColor: Colors.secondary,
    borderRadius: 6,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  servicesCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  serviceStats: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  serviceProgress: {
    width: 60,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  insightsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  bottomSpacing: {
    height: 100,
  },
});