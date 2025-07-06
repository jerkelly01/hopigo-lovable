import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Award, Star, Gift, Percent, X, Clock, Info, Users, TrendingUp, Target } from 'lucide-react-native';
import Colors from '@/constants/colors';

const loyaltyPrograms = [
  {
    id: '1',
    name: 'HopiGo Rewards',
    description: 'Earn points on every transaction and redeem for discounts',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&auto=format&fit=crop&q=60',
    points: '1,250',
    level: 'Gold',
    nextReward: '500 points',
    benefits: ['5% cashback', 'Priority support', 'Exclusive deals'],
    detailedDescription: 'HopiGo Rewards is our flagship loyalty program designed to reward our most valued customers. Earn points on every transaction and unlock exclusive benefits as you level up.',
    howToEarn: [
      'Earn 1 point for every AWG 1 spent',
      'Bonus points on weekend bookings',
      'Double points for first-time services',
      'Referral bonuses for new customers'
    ],
    levels: [
      { name: 'Bronze', requirement: '0-499 points', benefits: ['Basic rewards', 'Monthly newsletter'] },
      { name: 'Silver', requirement: '500-999 points', benefits: ['3% cashback', 'Priority booking', 'Special offers'] },
      { name: 'Gold', requirement: '1000+ points', benefits: ['5% cashback', 'Priority support', 'Exclusive deals', 'VIP events'] }
    ],
    totalMembers: '12,500+',
    joinedDate: null
  },
  {
    id: '2',
    name: 'Local Business Circle',
    description: 'Support local businesses and earn exclusive rewards',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&auto=format&fit=crop&q=60',
    points: '850',
    level: 'Silver',
    nextReward: '150 points',
    benefits: ['Local discounts', 'Community events', 'Special offers'],
    detailedDescription: 'Join our Local Business Circle and support the Aruban community while earning amazing rewards. This program focuses on promoting local businesses and creating a stronger local economy.',
    howToEarn: [
      'Earn 2 points for every AWG 1 spent at local businesses',
      'Bonus points for trying new local services',
      'Community event participation rewards',
      'Local business review bonuses'
    ],
    levels: [
      { name: 'Community Member', requirement: '0-299 points', benefits: ['Local business directory', 'Community updates'] },
      { name: 'Local Supporter', requirement: '300-799 points', benefits: ['10% local discounts', 'Event invitations', 'Monthly local deals'] },
      { name: 'Community Champion', requirement: '800+ points', benefits: ['15% local discounts', 'VIP event access', 'Business networking', 'Exclusive local experiences'] }
    ],
    totalMembers: '8,200+',
    joinedDate: null
  },
  {
    id: '3',
    name: 'Eco Warriors',
    description: 'Earn rewards for choosing eco-friendly services',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=60',
    points: '420',
    level: 'Bronze',
    nextReward: '80 points',
    benefits: ['Green discounts', 'Carbon offset', 'Eco tips'],
    detailedDescription: 'Make a positive impact on the environment while earning rewards. The Eco Warriors program encourages sustainable choices and eco-friendly services.',
    howToEarn: [
      'Earn 3 points for every eco-friendly service',
      'Bonus points for electric vehicle services',
      'Recycling and sustainability challenges',
      'Green business referral rewards'
    ],
    levels: [
      { name: 'Eco Beginner', requirement: '0-199 points', benefits: ['Eco tips', 'Green service directory'] },
      { name: 'Eco Enthusiast', requirement: '200-499 points', benefits: ['5% green discounts', 'Carbon footprint tracking', 'Eco challenges'] },
      { name: 'Eco Champion', requirement: '500+ points', benefits: ['10% green discounts', 'Carbon offset credits', 'Exclusive eco events', 'Sustainability consulting'] }
    ],
    totalMembers: '5,800+',
    joinedDate: null
  },
];

const availableRewards = [
  { 
    id: '1', 
    title: '10% Off Next Service', 
    cost: '500 points', 
    type: 'discount',
    description: 'Get 10% discount on your next HopiGo service booking. Valid for all service categories including home services, lifestyle, and emergency services.',
    terms: 'Valid for 30 days after redemption. Cannot be combined with other offers. Minimum booking value of AWG 50 required.',
    expiry: '30 days',
    category: 'Discount'
  },
  { 
    id: '2', 
    title: 'Free Car Wash', 
    cost: '750 points', 
    type: 'service',
    description: 'Enjoy a complimentary premium car wash service at any of our partner locations. Includes exterior wash, interior cleaning, and tire shine.',
    terms: 'Valid at participating car wash locations only. Appointment required. Valid for 60 days after redemption.',
    expiry: '60 days',
    category: 'Service'
  },
  { 
    id: '3', 
    title: 'AWG 25 Credit', 
    cost: '1000 points', 
    type: 'credit',
    description: 'Receive AWG 25 credit directly to your HopiGo wallet. Use this credit for any service or transaction within the app.',
    terms: 'Credit will be added to your wallet within 24 hours. No expiry date. Can be used for any HopiGo service.',
    expiry: 'No expiry',
    category: 'Wallet Credit'
  },
  { 
    id: '4', 
    title: 'Premium Support', 
    cost: '300 points', 
    type: 'upgrade',
    description: 'Upgrade to premium support for 3 months. Get priority customer service, dedicated support line, and faster response times.',
    terms: 'Valid for 3 months from activation. Includes 24/7 priority support and dedicated account manager.',
    expiry: '3 months',
    category: 'Upgrade'
  },
];

export default function LoyaltyProgramsScreen() {
  const router = useRouter();
  const [selectedReward, setSelectedReward] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [rewardModalVisible, setRewardModalVisible] = useState(false);
  const [programModalVisible, setProgramModalVisible] = useState(false);

  const handleJoinProgram = (programId: string) => {
    const program = loyaltyPrograms.find(p => p.id === programId);
    alert(`Successfully joined ${program?.name}!`);
    setProgramModalVisible(false);
  };

  const handleCardPress = (programId: string) => {
    const program = loyaltyPrograms.find(p => p.id === programId);
    setSelectedProgram(program);
    setProgramModalVisible(true);
  };

  const handleRewardPress = (reward) => {
    setSelectedReward(reward);
    setRewardModalVisible(true);
  };

  const handleRedeemReward = (rewardId: string) => {
    const reward = availableRewards.find(r => r.id === rewardId);
    alert(`Redeemed: ${reward?.title}`);
    setRewardModalVisible(false);
    setSelectedReward(null);
  };

  const closeRewardModal = () => {
    setRewardModalVisible(false);
    setSelectedReward(null);
  };

  const closeProgramModal = () => {
    setProgramModalVisible(false);
    setSelectedProgram(null);
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      case 'bronze': return '#CD7F32';
      default: return Colors.primary;
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Percent size={24} color={Colors.primary} />;
      case 'service': return <Star size={24} color={Colors.primary} />;
      case 'credit': return <Gift size={24} color={Colors.primary} />;
      case 'upgrade': return <Award size={24} color={Colors.primary} />;
      default: return <Gift size={24} color={Colors.primary} />;
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Loyalty Programs',
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
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Loyalty Programs</Text>
          <Text style={styles.subtitle}>
            Earn rewards and unlock exclusive benefits
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Programs</Text>
          {loyaltyPrograms.map((program) => (
            <TouchableOpacity 
              key={program.id} 
              onPress={() => handleCardPress(program.id)}
              activeOpacity={0.7}
            >
              <Card style={styles.programCard}>
                <Image source={{ uri: program.image }} style={styles.programImage} />
                <View style={styles.programContent}>
                  <View style={styles.programHeader}>
                    <Text style={styles.programName}>{program.name}</Text>
                    <View style={[styles.levelBadge, { backgroundColor: getLevelColor(program.level) + '20' }]}>
                      <Text style={[styles.levelText, { color: getLevelColor(program.level) }]}>
                        {program.level}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.programDescription}>{program.description}</Text>
                  
                  <View style={styles.pointsSection}>
                    <View style={styles.pointsInfo}>
                      <Award size={16} color={Colors.primary} />
                      <Text style={styles.pointsText}>{program.points} points</Text>
                    </View>
                    <Text style={styles.nextReward}>Next reward: {program.nextReward}</Text>
                  </View>

                  <View style={styles.benefitsSection}>
                    <Text style={styles.benefitsTitle}>Benefits:</Text>
                    <View style={styles.benefitsList}>
                      {program.benefits.map((benefit, index) => (
                        <View key={index} style={styles.benefitItem}>
                          <Star size={12} color={Colors.primary} />
                          <Text style={styles.benefitText}>{benefit}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <Button
                    title="Join Program"
                    variant="primary"
                    size="small"
                    onPress={(e) => {
                      e?.stopPropagation?.();
                      handleJoinProgram(program.id);
                    }}
                    style={styles.programButton}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>
          <View style={styles.rewardsGrid}>
            {availableRewards.map((reward) => (
              <TouchableOpacity 
                key={reward.id} 
                onPress={() => handleRewardPress(reward)}
                activeOpacity={0.7}
                style={styles.rewardCardContainer}
              >
                <Card style={styles.rewardCard}>
                  <View style={styles.rewardIconContainer}>
                    {getRewardIcon(reward.type)}
                  </View>
                  <Text style={styles.rewardTitle} numberOfLines={2}>
                    {reward.title}
                  </Text>
                  <View style={styles.rewardCostContainer}>
                    <Text style={styles.rewardCost}>{reward.cost}</Text>
                  </View>
                  <View style={styles.rewardCategory}>
                    <Text style={styles.rewardCategoryText}>{reward.category}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>How It Works</Text>
          <Text style={styles.infoDescription}>
            1. Use HopiGo services to earn points{'\n'}
            2. Level up to unlock better rewards{'\n'}
            3. Redeem points for discounts and perks{'\n'}
            4. Enjoy exclusive member benefits
          </Text>
        </Card>
      </ScrollView>

      {/* Program Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={programModalVisible}
        onRequestClose={closeProgramModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Program Details</Text>
              <TouchableOpacity onPress={closeProgramModal} style={styles.closeButton}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {selectedProgram && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: selectedProgram.image }} style={styles.programDetailImage} />
                
                <View style={styles.programDetailHeader}>
                  <Text style={styles.programDetailTitle}>{selectedProgram.name}</Text>
                  <View style={[styles.levelBadge, { backgroundColor: getLevelColor(selectedProgram.level) + '20' }]}>
                    <Text style={[styles.levelText, { color: getLevelColor(selectedProgram.level) }]}>
                      {selectedProgram.level}
                    </Text>
                  </View>
                </View>

                <View style={styles.statsSection}>
                  <View style={styles.statItem}>
                    <Award size={20} color={Colors.primary} />
                    <Text style={styles.statValue}>{selectedProgram.points}</Text>
                    <Text style={styles.statLabel}>Points</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Users size={20} color={Colors.primary} />
                    <Text style={styles.statValue}>{selectedProgram.totalMembers}</Text>
                    <Text style={styles.statLabel}>Members</Text>
                  </View>
                  <View style={styles.statItem}>
                    <TrendingUp size={20} color={Colors.primary} />
                    <Text style={styles.statValue}>{selectedProgram.level}</Text>
                    <Text style={styles.statLabel}>Level</Text>
                  </View>
                </View>

                <View style={styles.descriptionSection}>
                  <Text style={styles.sectionLabel}>About This Program</Text>
                  <Text style={styles.descriptionText}>{selectedProgram.detailedDescription}</Text>
                </View>

                <View style={styles.howToEarnSection}>
                  <Text style={styles.sectionLabel}>How to Earn Points</Text>
                  {selectedProgram.howToEarn.map((item, index) => (
                    <View key={index} style={styles.earnItem}>
                      <Target size={16} color={Colors.primary} />
                      <Text style={styles.earnText}>{item}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.levelsSection}>
                  <Text style={styles.sectionLabel}>Program Levels</Text>
                  {selectedProgram.levels.map((level, index) => (
                    <View key={index} style={[
                      styles.levelItem,
                      selectedProgram.level === level.name && styles.currentLevel
                    ]}>
                      <View style={styles.levelHeader}>
                        <Text style={[
                          styles.levelName,
                          selectedProgram.level === level.name && styles.currentLevelText
                        ]}>
                          {level.name}
                        </Text>
                        <Text style={styles.levelRequirement}>{level.requirement}</Text>
                      </View>
                      <View style={styles.levelBenefits}>
                        {level.benefits.map((benefit, benefitIndex) => (
                          <View key={benefitIndex} style={styles.levelBenefitItem}>
                            <Star size={12} color={Colors.primary} />
                            <Text style={styles.levelBenefitText}>{benefit}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>

                <View style={styles.modalActions}>
                  <Button
                    title={`Join ${selectedProgram.name}`}
                    variant="primary"
                    onPress={() => handleJoinProgram(selectedProgram.id)}
                    style={styles.joinModalButton}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

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
                  <Text style={styles.costValue}>{selectedReward.cost}</Text>
                </View>

                <View style={styles.descriptionSection}>
                  <Text style={styles.sectionLabel}>Description</Text>
                  <Text style={styles.descriptionText}>{selectedReward.description}</Text>
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
                    title="Redeem Now"
                    variant="primary"
                    onPress={() => handleRedeemReward(selectedReward.id)}
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
  header: {
    padding: 20,
    paddingTop: 40,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  programCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  programImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  programContent: {
    padding: 16,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  programName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  programDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  pointsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 6,
  },
  nextReward: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  benefitsSection: {
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  benefitsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  programButton: {
    alignSelf: 'flex-start',
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rewardCardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  rewardCard: {
    padding: 16,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'space-between',
  },
  rewardIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: Colors.primary + '15',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
  },
  rewardCostContainer: {
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  rewardCost: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  rewardCategory: {
    backgroundColor: Colors.textSecondary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rewardCategoryText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
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
  // Program Detail Styles
  programDetailImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  programDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  programDetailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.primary + '10',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  howToEarnSection: {
    marginBottom: 24,
  },
  earnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  earnText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  levelsSection: {
    marginBottom: 30,
  },
  levelItem: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  currentLevel: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  currentLevelText: {
    color: Colors.primary,
  },
  levelRequirement: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  levelBenefits: {
    gap: 8,
  },
  levelBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBenefitText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  joinModalButton: {
    marginBottom: 20,
  },
  // Reward Detail Styles
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