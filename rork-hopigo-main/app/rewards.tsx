import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Gift, Star, Trophy, Zap, Clock, X, Tag, DollarSign } from 'lucide-react-native';
import Colors from '@/constants/colors';

// Mock rewards data
const userPoints = 1250;
const userLevel = 'Gold';

const availableRewards = [
  {
    id: 'discount10',
    title: '10% Service Discount',
    description: 'Get 10% off your next service booking',
    detailedDescription: 'Apply this discount to any service booking on HopiGo. Valid for all categories including home services, lifestyle services, and emergency services. Cannot be combined with other offers.',
    points: 500,
    type: 'discount',
    icon: 'tag',
    terms: 'Valid for 30 days after redemption. Minimum booking value of AWG 50 required. Cannot be combined with other promotional offers.',
    expiry: '30 days',
    category: 'Discount',
  },
  {
    id: 'discount20',
    title: '20% Service Discount',
    description: 'Get 20% off your next service booking',
    detailedDescription: 'Enjoy a substantial 20% discount on your next service booking. This premium reward offers significant savings on any HopiGo service.',
    points: 1000,
    type: 'discount',
    icon: 'tag',
    terms: 'Valid for 45 days after redemption. Minimum booking value of AWG 100 required. Cannot be combined with other promotional offers.',
    expiry: '45 days',
    category: 'Premium Discount',
  },
  {
    id: 'free-delivery',
    title: 'Free Priority Support',
    description: 'Get priority customer support for 30 days',
    detailedDescription: 'Upgrade to priority customer support with faster response times, dedicated support line, and premium assistance for all your HopiGo needs.',
    points: 750,
    type: 'service',
    icon: 'zap',
    terms: 'Valid for 30 days from activation. Includes 24/7 priority support access and dedicated account manager.',
    expiry: '30 days',
    category: 'Premium Service',
  },
  {
    id: 'wallet-credit',
    title: '25 AWG Wallet Credit',
    description: 'Add 25 AWG to your wallet balance',
    detailedDescription: 'Receive 25 AWG credit directly to your HopiGo wallet. Use this credit for any service, payment, or transaction within the app.',
    points: 1500,
    type: 'credit',
    icon: 'dollar-sign',
    terms: 'Credit will be added to your wallet within 24 hours. No expiry date. Can be used for any HopiGo service or transaction.',
    expiry: 'No expiry',
    category: 'Wallet Credit',
  },
];

const rewardHistory = [
  {
    id: 'history1',
    title: '10% Service Discount',
    points: 500,
    date: '2024-01-15',
    status: 'redeemed',
  },
  {
    id: 'history2',
    title: 'Free Priority Support',
    points: 750,
    date: '2024-01-10',
    status: 'redeemed',
  },
];

export default function RewardsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'rewards' | 'history'>('rewards');
  const [selectedReward, setSelectedReward] = useState(null);
  const [rewardModalVisible, setRewardModalVisible] = useState(false);

  const handleRewardPress = (reward: any) => {
    setSelectedReward(reward);
    setRewardModalVisible(true);
  };

  const handleRedeemReward = (reward: any) => {
    if (userPoints >= reward.points) {
      console.log('Redeem reward:', reward.id);
      setRewardModalVisible(false);
      setSelectedReward(null);
      // In a real app, this would redeem the reward
    }
  };

  const closeRewardModal = () => {
    setRewardModalVisible(false);
    setSelectedReward(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze': return '#CD7F32';
      case 'Silver': return '#C0C0C0';
      case 'Gold': return '#FFD700';
      case 'Platinum': return '#E5E4E2';
      default: return Colors.primary;
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Tag size={24} color={Colors.primary} />;
      case 'service': return <Zap size={24} color={Colors.primary} />;
      case 'credit': return <DollarSign size={24} color={Colors.primary} />;
      default: return <Gift size={24} color={Colors.primary} />;
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Rewards',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        {/* Points Summary */}
        <Card style={styles.pointsCard}>
          <View style={styles.pointsHeader}>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>Your Points</Text>
              <Text style={styles.pointsValue}>{userPoints.toLocaleString()}</Text>
            </View>
            <View style={[styles.levelBadge, { backgroundColor: getLevelColor(userLevel) + '20' }]}>
              <Trophy size={20} color={getLevelColor(userLevel)} />
              <Text style={[styles.levelText, { color: getLevelColor(userLevel) }]}>{userLevel}</Text>
            </View>
          </View>
          <View style={styles.pointsProgress}>
            <Text style={styles.progressText}>Next level: Platinum (2000 points)</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(userPoints / 2000) * 100}%` }]} />
            </View>
          </View>
        </Card>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'rewards' && styles.activeTab]}
            onPress={() => setSelectedTab('rewards')}
          >
            <Text style={[styles.tabText, selectedTab === 'rewards' && styles.activeTabText]}>
              Available Rewards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'history' && styles.activeTab]}
            onPress={() => setSelectedTab('history')}
          >
            <Text style={[styles.tabText, selectedTab === 'history' && styles.activeTabText]}>
              History
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {selectedTab === 'rewards' ? (
            <View style={styles.rewardsList}>
              {availableRewards.map((reward) => (
                <TouchableOpacity
                  key={reward.id}
                  onPress={() => handleRewardPress(reward)}
                  activeOpacity={0.7}
                >
                  <Card style={styles.rewardCard}>
                    <View style={styles.rewardHeader}>
                      <View style={styles.rewardInfo}>
                        <Text style={styles.rewardTitle}>{reward.title}</Text>
                        <Text style={styles.rewardDescription}>{reward.description}</Text>
                      </View>
                      {getRewardIcon(reward.type)}
                    </View>

                    <View style={styles.rewardFooter}>
                      <View style={styles.pointsRequired}>
                        <Star size={16} color="#FFD93D" fill="#FFD93D" />
                        <Text style={styles.pointsText}>{reward.points} points</Text>
                      </View>
                      <Button
                        title={userPoints >= reward.points ? "Redeem" : "Not enough points"}
                        size="small"
                        variant={userPoints >= reward.points ? "primary" : "secondary"}
                        disabled={userPoints < reward.points}
                        onPress={(e) => {
                          e?.stopPropagation?.();
                          handleRedeemReward(reward);
                        }}
                        style={styles.redeemButton}
                      />
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            rewardHistory.length === 0 ? (
              <View style={styles.emptyState}>
                <Clock size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Reward History</Text>
                <Text style={styles.emptyDescription}>
                  Your redeemed rewards will appear here.
                </Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {rewardHistory.map((item) => (
                  <Card key={item.id} style={styles.historyCard}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyTitle}>{item.title}</Text>
                      <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
                    </View>
                    <View style={styles.historyFooter}>
                      <View style={styles.historyPoints}>
                        <Star size={14} color="#FFD93D" fill="#FFD93D" />
                        <Text style={styles.historyPointsText}>{item.points} points</Text>
                      </View>
                      <View style={[styles.statusBadge, styles.redeemedBadge]}>
                        <Text style={styles.statusText}>Redeemed</Text>
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            )
          )}
        </ScrollView>

        {/* How to Earn Points */}
        <Card style={styles.earnPointsCard}>
          <Text style={styles.earnPointsTitle}>How to Earn Points</Text>
          <View style={styles.earnPointsList}>
            <View style={styles.earnPointsItem}>
              <Zap size={16} color={Colors.primary} />
              <Text style={styles.earnPointsText}>Complete services: 50 points</Text>
            </View>
            <View style={styles.earnPointsItem}>
              <Star size={16} color={Colors.primary} />
              <Text style={styles.earnPointsText}>Leave reviews: 25 points</Text>
            </View>
            <View style={styles.earnPointsItem}>
              <Gift size={16} color={Colors.primary} />
              <Text style={styles.earnPointsText}>Refer friends: 100 points</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Reward Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={rewardModalVisible}
        onRequestClose={closeRewardModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reward Details</Text>
              <TouchableOpacity onPress={closeRewardModal} style={styles.closeButton}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {selectedReward && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.rewardDetailHeader}>
                  <View style={styles.rewardDetailIcon}>
                    {getRewardIcon(selectedReward.type)}
                  </View>
                  <Text style={styles.rewardDetailTitle}>{selectedReward.title}</Text>
                  <Text style={styles.rewardDetailCategory}>{selectedReward.category}</Text>
                </View>

                <View style={styles.costSection}>
                  <Text style={styles.costLabel}>Cost:</Text>
                  <Text style={styles.costValue}>{selectedReward.points} points</Text>
                </View>

                <View style={styles.descriptionSection}>
                  <Text style={styles.sectionLabel}>Description</Text>
                  <Text style={styles.descriptionText}>{selectedReward.detailedDescription}</Text>
                </View>

                <View style={styles.termsSection}>
                  <Text style={styles.sectionLabel}>Terms & Conditions</Text>
                  <Text style={styles.termsText}>{selectedReward.terms}</Text>
                </View>

                <View style={styles.expirySection}>
                  <Clock size={16} color={Colors.textSecondary} />
                  <Text style={styles.expiryText}>Valid for: {selectedReward.expiry}</Text>
                </View>

                <View style={styles.modalActions}>
                  <Button
                    title={userPoints >= selectedReward.points ? "Redeem Now" : "Not enough points"}
                    variant={userPoints >= selectedReward.points ? "primary" : "secondary"}
                    disabled={userPoints < selectedReward.points}
                    onPress={() => handleRedeemReward(selectedReward)}
                    style={styles.redeemModalButton}
                  />
                  <Button
                    title="Cancel"
                    variant="secondary"
                    onPress={closeRewardModal}
                    style={styles.cancelButton}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  pointsCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  pointsProgress: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 20,
  },
  rewardsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  rewardCard: {
    padding: 16,
    marginBottom: 16,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  rewardInfo: {
    flex: 1,
    marginRight: 12,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsRequired: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 4,
  },
  redeemButton: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  historyList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  historyCard: {
    padding: 16,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  historyDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyPoints: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyPointsText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  redeemedBadge: {
    backgroundColor: '#A8E6CF20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A8E6CF',
  },
  earnPointsCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
  },
  earnPointsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  earnPointsList: {
    gap: 12,
  },
  earnPointsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  earnPointsText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  rewardDetailHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  rewardDetailIcon: {
    width: 80,
    height: 80,
    backgroundColor: Colors.primary + '15',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  rewardDetailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  rewardDetailCategory: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  costSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  costLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  costValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  termsSection: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  expirySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: Colors.textSecondary + '10',
    padding: 12,
    borderRadius: 8,
  },
  expiryText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  modalActions: {
    gap: 12,
  },
  redeemModalButton: {
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
});