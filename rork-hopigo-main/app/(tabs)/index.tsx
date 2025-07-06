import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Keyboard, Pressable, Animated, Dimensions } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CategoryCard } from '@/components/CategoryCard';
import { AdvertisingBanner } from '@/components/AdvertisingBanner';
import { OtherServiceCard } from '@/components/OtherServiceCard';
import { ProviderCard } from '@/components/ProviderCard';
import { useMarketplaceStore } from '@/store/marketplace-store';
import { useAuthStore } from '@/store/auth-store';
import { useWalletStore } from '@/store/wallet-store';
import { useLanguage } from '@/contexts/LanguageContext';
import { advertisements } from '@/mocks/advertisements';
import { otherServices } from '@/constants/other-services';
import { providers } from '@/mocks/providers';
import { ArrowRight, Search, X, Clock, Tag, AlertTriangle, Crown, Check, Star, CheckCircle2, Car, MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const { balance, currency } = useWalletStore();
  const { categories, recentSearches, fetchCategories, addRecentSearch, currentTaxiRide } = useMarketplaceStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{type: string, text: string, id?: string}>>([]);
  const searchInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation for shine effect
  const shineAnim = useRef(new Animated.Value(-200)).current;
  
  // Featured providers (top rated providers)
  const featuredProviders = providers
    .filter(provider => provider.rating >= 4.8)
    .slice(0, 6);
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      generateSuggestions(searchQuery);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);
  
  useEffect(() => {
    // Start the shine animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 400,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(shineAnim, {
          toValue: -200,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [shineAnim]);

  // Handle screen focus - removed scroll position reset
  useFocusEffect(
    React.useCallback(() => {
      // Only dismiss keyboard and clear suggestions to prevent conflicts
      const timer = setTimeout(() => {
        Keyboard.dismiss();
        setShowSuggestions(false);
      }, 50);

      return () => {
        clearTimeout(timer);
        Keyboard.dismiss();
        setShowSuggestions(false);
      };
    }, [])
  );
  
  const navigateToCategory = (categoryId: string) => {
    // Dismiss suggestions before navigation
    setShowSuggestions(false);
    Keyboard.dismiss();
    
    // If it's the Hopi Taxi category, navigate to taxi service instead
    if (categoryId === '4') {
      router.push('/taxi-service');
    } else {
      router.push({
        pathname: '/marketplace',
        params: { categoryId }
      });
    }
  };
  
  const navigateToWallet = () => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    router.push('/wallet');
  };

  const navigateToUrgentServices = () => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    router.push('/urgent-services');
  };

  const navigateToTaxiService = () => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    router.push('/taxi-service');
  };
  
  const handleAdvertisementPress = (adId: string) => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    switch (adId) {
      case '1':
        router.push('/marketplace');
        break;
      case '2':
        router.push('/marketplace');
        break;
      case '3':
        router.push({
          pathname: '/marketplace',
          params: { categoryId: '1' }
        });
        break;
      case '4':
        router.push({
          pathname: '/marketplace',
          params: { categoryId: '3' }
        });
        break;
      case '5':
        router.push({
          pathname: '/marketplace',
          params: { categoryId: '4' }
        });
        break;
      default:
        router.push('/marketplace');
    }
  };
  
  const advertisementsWithHandlers = advertisements.map(ad => ({
    ...ad,
    onPress: () => handleAdvertisementPress(ad.id),
  }));
  
  // Create a "More" option for the popular services section
  const moreOption = {
    id: 'more',
    name: t('more'),
    icon: 'more-horizontal',
    color: '#6B7280',
    subCategories: []
  };
  
  // Create an "On Demand Services" option for the popular services section
  const onDemandOption = {
    id: 'urgent',
    name: t('onDemand'),
    icon: 'alert-triangle',
    color: '#EF4444',
    subCategories: []
  };
  
  const generateSuggestions = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    const newSuggestions: Array<{type: string, text: string, id?: string}> = [];
    
    // Add recent searches that match the query
    recentSearches.forEach(search => {
      if (search.toLowerCase().includes(lowercaseQuery) && !newSuggestions.some(s => s.text.toLowerCase() === search.toLowerCase())) {
        newSuggestions.push({
          type: 'recent',
          text: search
        });
      }
    });
    
    // Add matching service names (from subcategories)
    categories.forEach(category => {
      if (category.subCategories && category.subCategories.length > 0) {
        category.subCategories.forEach(subCategory => {
          if (subCategory.name.toLowerCase().includes(lowercaseQuery) && 
              !newSuggestions.some(s => s.text.toLowerCase() === subCategory.name.toLowerCase())) {
            newSuggestions.push({
              type: 'service',
              text: subCategory.name,
              id: subCategory.id
            });
          }
        });
      }
    });
    
    // Limit to 5 suggestions
    setSuggestions(newSuggestions.slice(0, 5));
  };
  
  const handleSuggestionSelect = (suggestion: {type: string, text: string, id?: string}) => {
    setSearchQuery(suggestion.text);
    addRecentSearch(suggestion.text);
    
    if (suggestion.type === 'service') {
      // Navigate to marketplace with the selected service
      router.push({
        pathname: '/marketplace',
        params: { serviceId: suggestion.id }
      });
    } else {
      // Navigate to marketplace with the search query
      router.push({
        pathname: '/marketplace',
        params: { search: suggestion.text }
      });
    }
    
    setShowSuggestions(false);
    Keyboard.dismiss();
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };
  
  const focusSearchInput = () => {
    searchInputRef.current?.focus();
  };

  const handleOtherServicePress = (serviceId: string) => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    switch (serviceId) {
      case 'bill-payments':
        router.push('/bill-payments');
        break;
      case 'fuel-up':
        router.push('/fuel-up');
        break;
      case 'event-tickets':
        router.push('/event-tickets');
        break;
      case 'donations':
        router.push('/donations');
        break;
      case 'loyalty-programs':
        router.push('/loyalty-programs');
        break;
      case 'deals':
        router.push('/deals');
        break;
      default:
        router.push('/other-services');
    }
  };

  const handleHopiGoPlusPress = () => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    router.push('/hopigo-plus');
  };

  const handleProviderPress = (provider: any) => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    router.push({
      pathname: '/provider/[id]',
      params: { id: provider.id }
    });
  };

  const handleProviderSignupPress = () => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    router.push('/provider-signup');
  };

  const handleScrollBeginDrag = () => {
    // Dismiss suggestions and keyboard when user starts scrolling
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const handleCurrentRidePress = () => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    router.push('/taxi-ride-tracking');
  };

  // Create pages for horizontal scrolling with reordered services
  const createServicePages = () => {
    // Reorder services: move On Demand next to Hopi Taxi, switch with Tech Services
    const categoriesUpToHopiTaxi = categories.filter(cat => ['1', '2', '3', '4'].includes(cat.id));
    const techServices = categories.find(cat => cat.id === '5');
    const remainingCategories = categories.filter(cat => !['1', '2', '3', '4', '5'].includes(cat.id));
    
    const reorderedServices = [
      ...categoriesUpToHopiTaxi,
      onDemandOption, // Move On Demand next to Hopi Taxi
      ...remainingCategories,
      ...(techServices ? [techServices] : []), // Move Tech Services to the end
      moreOption
    ];
    
    const pages = [];
    const servicesPerPage = 6; // 3 top row + 3 bottom row
    
    for (let i = 0; i < reorderedServices.length; i += servicesPerPage) {
      const pageServices = reorderedServices.slice(i, i + servicesPerPage);
      pages.push(pageServices);
    }
    
    return pages;
  };

  const servicePages = createServicePages();
  
  return (
    <Pressable 
      style={styles.container} 
      onPress={() => setShowSuggestions(false)}
    >
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        decelerationRate="normal"
        bounces={true}
        bouncesZoom={false}
        alwaysBounceVertical={false}
        overScrollMode="auto"
        onScrollBeginDrag={handleScrollBeginDrag}
        removeClippedSubviews={false}
      >
        {/* Header with search bar */}
        <View style={styles.headerSection}>
          <TouchableOpacity 
            style={styles.searchContainer}
            onPress={focusSearchInput}
            activeOpacity={0.8}
          >
            <View style={styles.searchContent}>
              <Text style={styles.greetingText}>
                {t('hello')}, {user?.name || "User"}
              </Text>
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                placeholder={t('whatServiceToday')}
                placeholderTextColor={Colors.textSecondary}
                textAlign="center"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
                onBlur={() => {
                  // Delay hiding suggestions to allow for selection
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
              />
            </View>
            <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
                <X size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Search Suggestions */}
        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={`${suggestion.type}-${index}`}
                  style={[
                    styles.suggestionItem,
                    index === suggestions.length - 1 && styles.lastSuggestionItem
                  ]}
                  onPress={() => handleSuggestionSelect(suggestion)}
                >
                  <View style={styles.suggestionIconContainer}>
                    {suggestion.type === 'recent' && <Clock size={16} color={Colors.textSecondary} />}
                    {suggestion.type === 'service' && <Tag size={16} color={Colors.textSecondary} />}
                  </View>
                  <Text style={styles.suggestionText}>{suggestion.text}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noSuggestionsContainer}>
                <Text style={styles.noSuggestionsText}>{t('noSuggestionsFound')}</Text>
              </View>
            )}
          </View>
        )}

        {/* Current Taxi Ride Status */}
        {currentTaxiRide && (
          <TouchableOpacity 
            style={styles.currentRideContainer}
            onPress={handleCurrentRidePress}
            activeOpacity={0.8}
          >
            <Card style={styles.currentRideCard}>
              <View style={styles.currentRideHeader}>
                <View style={styles.currentRideIcon}>
                  <Car size={24} color={Colors.primary} />
                </View>
                <View style={styles.currentRideInfo}>
                  <Text style={styles.currentRideTitle}>{t('currentRide')}</Text>
                  <Text style={styles.currentRideStatus}>
                    {currentTaxiRide.status === 'requesting' && t('findingDriver')}
                    {currentTaxiRide.status === 'driver_assigned' && t('driverAssigned')}
                    {currentTaxiRide.status === 'driver_arriving' && t('driverArriving')}
                    {currentTaxiRide.status === 'pickup' && t('driverArrived')}
                    {currentTaxiRide.status === 'in_transit' && t('onTheWay')}
                  </Text>
                </View>
                <View style={styles.currentRidePrice}>
                  <Text style={styles.currentRidePriceText}>
                    {currentTaxiRide.estimatedFare} {currentTaxiRide.currency}
                  </Text>
                </View>
              </View>
              <View style={styles.currentRideRoute}>
                <View style={styles.routePoint}>
                  <MapPin size={16} color={Colors.success} />
                  <Text style={styles.routeText} numberOfLines={1}>
                    {currentTaxiRide.pickupLocation.address}
                  </Text>
                </View>
                <View style={styles.routePoint}>
                  <MapPin size={16} color={Colors.error} />
                  <Text style={styles.routeText} numberOfLines={1}>
                    {currentTaxiRide.dropoffLocation.address}
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        
        {/* Popular Services */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('popularServices')}</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => {
              setShowSuggestions(false);
              Keyboard.dismiss();
              router.push('/marketplace');
            }}
          >
            <Text style={styles.viewAll}>{t('viewAll')}</Text>
            <ArrowRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Horizontal Scrollable Popular Services */}
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          contentContainerStyle={styles.servicesHorizontalContainer}
          style={styles.servicesHorizontalScrollView}
        >
          {servicePages.map((pageServices, pageIndex) => (
            <View key={pageIndex} style={styles.servicesPage}>
              <View style={styles.servicesGrid}>
                <View style={styles.servicesRow}>
                  {pageServices.slice(0, 3).map((service) => (
                    <CategoryCard
                      key={service.id}
                      category={service}
                      onPress={() => {
                        if (service.id === 'urgent') {
                          navigateToUrgentServices();
                        } else if (service.id === 'more') {
                          setShowSuggestions(false);
                          Keyboard.dismiss();
                          router.push('/marketplace');
                        } else {
                          navigateToCategory(service.id);
                        }
                      }}
                      style={[
                        styles.serviceCard,
                        service.id === '4' && styles.hopiTaxiCard,
                        service.id === 'urgent' && styles.onDemandCard
                      ]}
                      isMoreButton={service.id === 'more'}
                    />
                  ))}
                </View>
                <View style={styles.servicesRow}>
                  {pageServices.slice(3, 6).map((service) => (
                    <CategoryCard
                      key={service.id}
                      category={service}
                      onPress={() => {
                        if (service.id === 'urgent') {
                          navigateToUrgentServices();
                        } else if (service.id === 'more') {
                          setShowSuggestions(false);
                          Keyboard.dismiss();
                          router.push('/marketplace');
                        } else {
                          navigateToCategory(service.id);
                        }
                      }}
                      style={[
                        styles.serviceCard,
                        service.id === '4' && styles.hopiTaxiCard,
                        service.id === 'urgent' && styles.onDemandCard
                      ]}
                      isMoreButton={service.id === 'more'}
                    />
                  ))}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        
        {/* Wallet Card - Made fully clickable */}
        <TouchableOpacity 
          style={styles.walletCardTouchable}
          onPress={navigateToWallet}
          activeOpacity={0.8}
        >
          <Card style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <Text style={styles.walletTitle}>{t('yourWallet')}</Text>
              <TouchableOpacity onPress={navigateToWallet}>
                <Text style={styles.viewAll}>{t('viewAll')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>{t('availableBalance')}</Text>
              <Text style={styles.balance}>{balance} {currency}</Text>
            </View>
            <View style={styles.walletActions}>
              <Button 
                title={t('addMoney')} 
                variant="primary"
                size="small"
                style={styles.walletButton}
                onPress={() => {
                  setShowSuggestions(false);
                  Keyboard.dismiss();
                  router.push('/wallet/add-funds');
                }}
              />
              <Button 
                title={t('sendMoney')} 
                variant="primary"
                size="small"
                style={styles.walletButton}
                onPress={() => {
                  setShowSuggestions(false);
                  Keyboard.dismiss();
                  router.push('/wallet/send-money');
                }}
              />
              <Button 
                title={t('splitBill')} 
                variant="primary"
                size="small"
                style={styles.walletButton}
                onPress={() => {
                  setShowSuggestions(false);
                  Keyboard.dismiss();
                  router.push('/wallet/split-bill');
                }}
              />
            </View>
          </Card>
        </TouchableOpacity>
        
        {/* Advertising Banner - Full width */}
        <View style={styles.advertisingContainer}>
          <AdvertisingBanner advertisements={advertisementsWithHandlers} />
        </View>
        
        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('recentActivity')}</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={navigateToWallet}
          >
            <Text style={styles.viewAll}>{t('viewAll')}</Text>
            <ArrowRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Become a Service Provider Card - Made fully clickable */}
        <TouchableOpacity 
          style={styles.providerCardTouchable}
          onPress={handleProviderSignupPress}
          activeOpacity={0.7}
        >
          <Card style={styles.providerCard}>
            <View style={styles.providerCardContent}>
              <View style={styles.providerCardTextContainer}>
                <Text style={styles.providerCardTitle}>{t('becomeServiceProvider')}</Text>
                <Text style={styles.providerCardDescription}>
                  {t('offerServicesEarn')}
                </Text>
              </View>
              <View style={styles.providerImageContainer}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }}
                  style={styles.providerImage}
                />
              </View>
            </View>
            <Button
              title={t('getStarted')}
              size="small"
              style={styles.providerCardButton}
              onPress={handleProviderSignupPress}
            />
          </Card>
        </TouchableOpacity>
        
        {/* Featured Services Section - Horizontal Scrollable */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('featuredServices')}</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => {
              setShowSuggestions(false);
              Keyboard.dismiss();
              router.push('/marketplace');
            }}
          >
            <Text style={styles.viewAll}>{t('viewAll')}</Text>
            <ArrowRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredServicesScrollContainer}
          style={styles.featuredServicesScrollView}
        >
          {featuredProviders.map((provider, index) => (
            <TouchableOpacity
              key={provider.id}
              onPress={() => handleProviderPress(provider)}
              activeOpacity={0.7}
              style={[
                styles.featuredProviderCard,
                index === 0 && styles.firstFeaturedCard,
                index === featuredProviders.length - 1 && styles.lastFeaturedCard
              ]}
            >
              <Card style={styles.featuredCard}>
                <Image 
                  source={{ uri: provider.image }} 
                  style={styles.featuredServiceImage} 
                />
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredServiceDescription} numberOfLines={2}>
                    {provider.description}
                  </Text>
                  <View style={styles.featuredProviderInfo}>
                    <Image 
                      source={{ uri: provider.image }} 
                      style={styles.featuredProviderAvatar} 
                    />
                    <View style={styles.featuredProviderDetails}>
                      <View style={styles.featuredNameContainer}>
                        <Text style={styles.featuredName} numberOfLines={1}>
                          {provider.name}
                        </Text>
                        {provider.verified && (
                          <CheckCircle2 size={12} color={Colors.primary} />
                        )}
                      </View>
                      <View style={styles.featuredRatingContainer}>
                        <Star size={10} color="#FFC107" fill="#FFC107" />
                        <Text style={styles.featuredRating}>
                          {provider.rating.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Other Services Section - Renamed from "Lifestyle Services" */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('otherServices')}</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => {
              setShowSuggestions(false);
              Keyboard.dismiss();
              router.push('/other-services');
            }}
          >
            <Text style={styles.viewAll}>{t('viewAll')}</Text>
            <ArrowRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Other Services Grid Layout */}
        <View style={styles.otherServicesGrid}>
          <View style={styles.servicesRow}>
            {otherServices.slice(0, 3).map((service) => (
              <OtherServiceCard
                key={service.id}
                service={service}
                onPress={() => handleOtherServicePress(service.id)}
                style={styles.serviceCard}
              />
            ))}
          </View>
          <View style={styles.servicesRow}>
            {otherServices.slice(3, 6).map((service) => (
              <OtherServiceCard
                key={service.id}
                service={service}
                onPress={() => handleOtherServicePress(service.id)}
                style={styles.serviceCard}
              />
            ))}
          </View>
        </View>

        {/* HopiGo+ Premium Membership Section */}
        <TouchableOpacity 
          style={styles.hopiGoPlusContainer}
          onPress={handleHopiGoPlusPress}
          activeOpacity={0.9}
        >
          <Card style={styles.hopiGoPlusCard}>
            <View style={styles.hopiGoPlusHeader}>
              <View style={styles.hopiGoPlusIconContainer}>
                <Crown size={24} color="#FFD700" />
              </View>
              <View style={styles.hopiGoPlusTitleContainer}>
                <Text style={styles.hopiGoPlusTitle}>{t('hopiGoPlus')}</Text>
                <Text style={styles.hopiGoPlusSubtitle}>{t('premiumMembership')}</Text>
              </View>
              <View style={styles.hopiGoPlusPriceContainer}>
                <Text style={styles.hopiGoPlusPrice}>10 AWG</Text>
                <Text style={styles.hopiGoPlusPeriod}>{t('monthlyPrice')}</Text>
              </View>
            </View>
            
            <View style={styles.hopiGoPlusBenefits}>
              <View style={styles.benefitRow}>
                <Check size={16} color="#4CAF50" />
                <Text style={styles.benefitText}>{t('priorityBooking')}</Text>
              </View>
              <View style={styles.benefitRow}>
                <Check size={16} color="#4CAF50" />
                <Text style={styles.benefitText}>{t('exclusiveDiscounts')}</Text>
              </View>
              <View style={styles.benefitRow}>
                <Check size={16} color="#4CAF50" />
                <Text style={styles.benefitText}>{t('premiumSupport')}</Text>
              </View>
              <View style={styles.benefitRow}>
                <Check size={16} color="#4CAF50" />
                <Text style={styles.benefitText}>{t('freeCancellation')}</Text>
              </View>
            </View>
            
            <Button
              title={t('upgradeToHopiGoPlus')}
              style={styles.hopiGoPlusButton}
              onPress={handleHopiGoPlusPress}
            />
          </Card>
        </TouchableOpacity>
        
        {/* Promotional Banner - Made clickable and changed to primary blue */}
        <TouchableOpacity 
          style={styles.promotionCardTouchable}
          onPress={() => {
            setShowSuggestions(false);
            Keyboard.dismiss();
            router.push('/invite');
          }}
          activeOpacity={0.8}
        >
          <Card style={styles.promotionCard}>
            <View style={styles.promotionContent}>
              <Text style={styles.promotionTitle}>{t('inviteFriendsEarn')}</Text>
              <Text style={styles.promotionDescription}>
                {t('inviteDescription')}
              </Text>
              <Button
                title={t('inviteFriends')}
                variant="ghost"
                style={styles.promotionButton}
                onPress={() => {
                  setShowSuggestions(false);
                  Keyboard.dismiss();
                  router.push('/invite');
                }}
              />
            </View>
            <Animated.View 
              style={[
                styles.shineEffect,
                { transform: [{ translateX: shineAnim }] }
              ]} 
            />
          </Card>
        </TouchableOpacity>
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 0,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  searchContent: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 20,
  },
  greetingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 2,
  },
  searchInput: {
    width: '100%',
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 0,
  },
  searchIcon: {
    marginLeft: 8,
  },
  clearIcon: {
    marginLeft: 8,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastSuggestionItem: {
    borderBottomWidth: 0,
  },
  suggestionIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 15,
    color: Colors.text,
  },
  noSuggestionsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noSuggestionsText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  currentRideContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  currentRideCard: {
    padding: 16,
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    margin: 0,
  },
  currentRideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentRideIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  currentRideInfo: {
    flex: 1,
  },
  currentRideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  currentRideStatus: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 2,
  },
  currentRidePrice: {
    alignItems: 'flex-end',
  },
  currentRidePriceText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  currentRideRoute: {
    gap: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  urgentServicesButton: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.error + '20',
    borderRadius: 12,
    padding: 14,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  urgentServicesContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentServicesTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  urgentServicesTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.error,
  },
  urgentServicesSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  walletCardTouchable: {
    marginHorizontal: 16,
    marginTop: 0,
  },
  walletCard: {
    padding: 14,
    margin: 0,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  viewAll: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '500',
  },
  balanceContainer: {
    marginTop: 10,
    marginBottom: 14,
  },
  balanceLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  balance: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  walletActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  walletButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  hopiGoPlusContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  hopiGoPlusCard: {
    padding: 20,
    backgroundColor: '#FAFBFF',
    borderWidth: 2,
    borderColor: '#E8EAFF',
    margin: 0,
  },
  hopiGoPlusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hopiGoPlusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hopiGoPlusTitleContainer: {
    flex: 1,
  },
  hopiGoPlusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  hopiGoPlusSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  hopiGoPlusPriceContainer: {
    alignItems: 'flex-end',
  },
  hopiGoPlusPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  hopiGoPlusPeriod: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  hopiGoPlusBenefits: {
    marginBottom: 20,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 15,
    color: Colors.text,
    marginLeft: 10,
    flex: 1,
  },
  hopiGoPlusButton: {
    backgroundColor: Colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: Colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicesHorizontalScrollView: {
    marginBottom: 0,
  },
  servicesHorizontalContainer: {
    paddingHorizontal: 0,
  },
  servicesPage: {
    width: screenWidth,
    paddingHorizontal: 16,
  },
  servicesGrid: {
    width: '100%',
  },
  otherServicesGrid: {
    paddingHorizontal: 16,
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  serviceCard: {
    width: '30%',
    marginHorizontal: 4,
  },
  onDemandCard: {
    backgroundColor: '#FFF8E7',
  },
  hopiTaxiCard: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#14B8A6' + '30',
  },
  advertisingContainer: {
    marginTop: -8,
    marginBottom: 12,
  },
  providerCardTouchable: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  providerCard: {
    padding: 14,
    margin: 0,
  },
  providerCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  providerCardTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  providerCardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  providerCardDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    maxWidth: 200,
  },
  providerCardButton: {
    width: '100%',
  },
  providerImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  providerImage: {
    width: '100%',
    height: '100%',
  },
  featuredServicesScrollView: {
    marginBottom: 8,
  },
  featuredServicesScrollContainer: {
    paddingHorizontal: 16,
  },
  featuredProviderCard: {
    width: 160,
    marginRight: 12,
  },
  firstFeaturedCard: {
    marginLeft: 0,
  },
  lastFeaturedCard: {
    marginRight: 16,
  },
  featuredCard: {
    padding: 12,
    margin: 0,
  },
  featuredServiceImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
  },
  featuredInfo: {
    width: '100%',
  },
  featuredServiceDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  featuredProviderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredProviderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  featuredProviderDetails: {
    flex: 1,
  },
  featuredNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  featuredName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 4,
  },
  featuredRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredRating: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 3,
  },
  promotionCardTouchable: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  promotionCard: {
    padding: 14,
    backgroundColor: Colors.primary,
    margin: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  promotionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  promotionTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: Colors.white,
  },
  promotionDescription: {
    fontSize: 15,
    color: Colors.white,
    opacity: 0.9,
    marginTop: 6,
    marginBottom: 14,
  },
  promotionButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    color: Colors.primary,
  },
  shineEffect: {
    position: 'absolute',
    top: 0,
    width: 60,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ rotate: '20deg' }],
    zIndex: 0,
    opacity: 0.5,
  },
});