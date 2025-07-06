import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Keyboard, Pressable, Modal } from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useMarketplaceStore } from '@/store/marketplace-store';
import { useLanguage } from '@/contexts/LanguageContext';
import { CategoryCard } from '@/components/CategoryCard';
import { SubCategoryCard } from '@/components/SubCategoryCard';
import { ProviderCard } from '@/components/ProviderCard';
import { Input } from '@/components/ui/Input';
import { Category, SubCategory, ServiceProvider } from '@/types/marketplace';
import { Search, Filter, X, Clock, User, Tag, Car } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { TextInput } from 'react-native';

export default function MarketplaceScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const { categoryId } = params;
  
  const { 
    categories, 
    providers,
    filteredProviders,
    selectedCategory,
    selectedSubCategory,
    recentSearches,
    isLoading,
    fetchCategories,
    fetchProviders,
    selectCategory,
    selectSubCategory,
    addRecentSearch,
    applyFilter
  } = useMarketplaceStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{type: string, text: string, id?: string}>>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const searchInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    fetchCategories();
    
    // If categoryId is provided in the URL, select it
    if (categoryId && typeof categoryId === 'string') {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        handleCategorySelect(category);
      }
    }
  }, [categoryId]);
  
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      generateSuggestions(searchQuery);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

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
    
    // Add matching provider names
    providers.forEach(provider => {
      if (provider.name.toLowerCase().includes(lowercaseQuery) && 
          !newSuggestions.some(s => s.text.toLowerCase() === provider.name.toLowerCase())) {
        newSuggestions.push({
          type: 'provider',
          text: provider.name,
          id: provider.id
        });
      }
    });

    // Add taxi-specific suggestions
    if (lowercaseQuery.includes('taxi') || lowercaseQuery.includes('ride') || lowercaseQuery.includes('car')) {
      newSuggestions.push({
        type: 'taxi',
        text: t('bookATaxi'),
        id: 'taxi-service'
      });
    }
    
    // Limit to 5 suggestions
    setSuggestions(newSuggestions.slice(0, 5));
  };
  
  const handleCategorySelect = (category: Category) => {
    selectCategory(category.id);
    
    // If Hopi Taxi category is selected, navigate to taxi service
    if (category.id === '4') { // Hopi Taxi category ID
      setShowSuggestions(false);
      Keyboard.dismiss();
      router.push('/taxi-service');
      return;
    }
  };
  
  const handleSubCategorySelect = (subCategory: SubCategory) => {
    selectSubCategory(subCategory.id);
    
    // If taxi subcategory is selected, navigate to taxi service
    if (subCategory.id.startsWith('40')) { // Hopi Taxi subcategory IDs start with 40
      setShowSuggestions(false);
      Keyboard.dismiss();
      router.push('/taxi-service');
      return;
    }
  };
  
  const handleProviderSelect = (provider: ServiceProvider) => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    router.push({
      pathname: '/provider/[id]',
      params: { 
        id: provider.id,
        serviceId: selectedSubCategory
      }
    });
  };
  
  const handleSuggestionSelect = (suggestion: {type: string, text: string, id?: string}) => {
    setSearchQuery(suggestion.text);
    addRecentSearch(suggestion.text);
    
    if (suggestion.type === 'taxi') {
      setShowSuggestions(false);
      Keyboard.dismiss();
      router.push('/taxi-service');
      return;
    }
    
    if (suggestion.type === 'service') {
      // Find the category that contains this service
      categories.forEach(category => {
        if (category.subCategories && category.subCategories.length > 0) {
          const subCategory = category.subCategories.find(s => s.id === suggestion.id);
          if (subCategory) {
            selectCategory(category.id);
            selectSubCategory(subCategory.id);
            
            // If it's a Hopi Taxi service, navigate to taxi service
            if (category.id === '4') {
              router.push('/taxi-service');
              return;
            }
          }
        }
      });
    } else if (suggestion.type === 'provider' && suggestion.id) {
      // Navigate to provider page
      router.push({
        pathname: '/provider/[id]',
        params: { 
          id: suggestion.id
        }
      });
    }
    
    setShowSuggestions(false);
    Keyboard.dismiss();
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };
  
  const handleFilterSelect = (filter: string | null) => {
    setSelectedFilter(filter);
    applyFilter(filter);
    setShowFilterModal(false);
  };

  const handleScrollBeginDrag = () => {
    // Dismiss suggestions and keyboard when user starts scrolling
    setShowSuggestions(false);
    Keyboard.dismiss();
  };
  
  // Get subcategories for the selected category
  const subCategories = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)?.subCategories || []
    : [];
  
  // Filter providers based on search query
  const displayProviders = searchQuery.trim() !== ''
    ? providers.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredProviders.length > 0 
      ? filteredProviders 
      : providers;
  
  return (
    <View style={styles.container}>
      {/* Search Bar - Fixed at top */}
      <Pressable onPress={() => setShowSuggestions(false)}>
        <View style={styles.searchContainer}>
          <Input
            ref={searchInputRef}
            placeholder={t('searchServices')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow for selection
              setTimeout(() => setShowSuggestions(false), 150);
            }}
            containerStyle={styles.searchInputContainer}
            inputStyle={styles.searchInput}
            leftIcon={<Search size={20} color={Colors.textSecondary} />}
            rightIcon={
              searchQuery.length > 0 ? (
                <TouchableOpacity onPress={clearSearch}>
                  <X size={18} color={Colors.textSecondary} />
                </TouchableOpacity>
              ) : null
            }
          />
          <TouchableOpacity 
            style={[
              styles.filterButton,
              showSuggestions && styles.filterButtonWithSuggestions
            ]}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </Pressable>
      
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
                  {suggestion.type === 'provider' && <User size={16} color={Colors.textSecondary} />}
                  {suggestion.type === 'taxi' && <Car size={16} color={Colors.primary} />}
                </View>
                <Text style={[
                  styles.suggestionText,
                  suggestion.type === 'taxi' && styles.taxiSuggestionText
                ]}>
                  {suggestion.text}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noSuggestionsContainer}>
              <Text style={styles.noSuggestionsText}>{t('noSuggestionsFound')}</Text>
            </View>
          )}
        </View>
      )}
      
      {/* Filter Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowFilterModal(false)}
        >
          <View style={styles.filterModalContainer}>
            <Text style={styles.filterModalTitle}>{t('sortBy')}</Text>
            <TouchableOpacity 
              style={[
                styles.filterOption,
                selectedFilter === null && styles.selectedFilterOption
              ]}
              onPress={() => handleFilterSelect(null)}
            >
              <Text style={[
                styles.filterOptionText,
                selectedFilter === null && styles.selectedFilterOptionText
              ]}>{t('default')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.filterOption,
                selectedFilter === 'rating' && styles.selectedFilterOption
              ]}
              onPress={() => handleFilterSelect('rating')}
            >
              <Text style={[
                styles.filterOptionText,
                selectedFilter === 'rating' && styles.selectedFilterOptionText
              ]}>{t('highestRated')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.filterOption,
                selectedFilter === 'name' && styles.selectedFilterOption
              ]}
              onPress={() => handleFilterSelect('name')}
            >
              <Text style={[
                styles.filterOptionText,
                selectedFilter === 'name' && styles.selectedFilterOptionText
              ]}>{t('nameAZ')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      
      {/* Scrollable Content */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBeginDrag}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        decelerationRate="normal"
        bounces={true}
        bouncesZoom={false}
        alwaysBounceVertical={false}
        removeClippedSubviews={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
      >
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>{t('categories')}</Text>
          <ScrollView 
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => handleCategorySelect(category)}
                isSelected={selectedCategory === category.id}
                style={[
                  styles.categoryCard,
                  category.id === '4' && styles.hopiTaxiCategoryCard // Special styling for Hopi Taxi category
                ]}
              />
            ))}
          </ScrollView>
        </View>
        
        {/* Sub Categories (only show if a category is selected and it's not Hopi Taxi) */}
        {selectedCategory && selectedCategory !== '4' && subCategories.length > 0 && (
          <View style={styles.subCategoriesSection}>
            <View style={styles.subCategoryHeader}>
              <Text style={styles.sectionTitle}>{t('services')}</Text>
              {selectedSubCategory && (
                <TouchableOpacity onPress={() => selectSubCategory(null)}>
                  <Text style={styles.clearFilter}>{t('clearFilter')}</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView 
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subCategoriesContainer}
            >
              {subCategories.map(subCategory => (
                <SubCategoryCard
                  key={subCategory.id}
                  subCategory={subCategory}
                  onPress={handleSubCategorySelect}
                  isSelected={selectedSubCategory === subCategory.id}
                  isCompact={false}
                  style={styles.subCategoryCard}
                />
              ))}
            </ScrollView>
          </View>
        )}
        
        {/* Service Providers (hide if Hopi Taxi category is selected) */}
        {selectedCategory !== '4' && (
          <View style={styles.providersSection}>
            <Text style={styles.sectionTitle}>
              {selectedSubCategory 
                ? `${subCategories.find(s => s.id === selectedSubCategory)?.name || ''} ${t('providersFor')}`
                : selectedCategory
                  ? `${categories.find(c => c.id === selectedCategory)?.name || ''} ${t('providersFor')}`
                  : t('allServiceProviders')}
            </Text>
            
            {isLoading ? (
              <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
            ) : displayProviders.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {t('noProvidersFound')}
                </Text>
              </View>
            ) : (
              <View style={styles.providersContainer}>
                {displayProviders.map((provider) => (
                  <ProviderCard 
                    key={provider.id}
                    provider={provider} 
                    onPress={handleProviderSelect}
                    serviceId={selectedSubCategory || undefined}
                    style={styles.providerCardVertical}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Hopi Taxi Services Message (show when Hopi Taxi category is selected) */}
        {selectedCategory === '4' && (
          <View style={styles.hopiTaxiServicesMessage}>
            <View style={styles.hopiTaxiMessageContainer}>
              <Car size={48} color={Colors.primary} />
              <Text style={styles.hopiTaxiMessageTitle}>{t('taxiServices')}</Text>
              <Text style={styles.hopiTaxiMessageText}>
                {t('taxiServicesDescription')}
              </Text>
              <TouchableOpacity 
                style={styles.hopiTaxiServiceButton}
                onPress={() => {
                  setShowSuggestions(false);
                  Keyboard.dismiss();
                  router.push('/taxi-service');
                }}
              >
                <Text style={styles.hopiTaxiServiceButtonText}>{t('bookTaxi')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 200,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  searchInput: {
    height: 40,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  filterButtonWithSuggestions: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 64, // Position below search bar
    left: 16,
    right: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
  taxiSuggestionText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  noSuggestionsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noSuggestionsText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterModalContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 40,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  filterModalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedFilterOption: {
    backgroundColor: Colors.primary,
  },
  filterOptionText: {
    fontSize: 15,
    color: Colors.text,
  },
  selectedFilterOptionText: {
    color: Colors.background,
    fontWeight: '500',
  },
  categoriesSection: {
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: 120,
  },
  hopiTaxiCategoryCard: {
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  subCategoriesSection: {
    paddingTop: 8,
  },
  subCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    marginBottom: 12,
  },
  clearFilter: {
    fontSize: 15,
    color: Colors.primary,
  },
  subCategoriesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  subCategoryCard: {
    width: 100,
  },
  providersSection: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  providersContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  providerCardVertical: {
    marginBottom: 12,
  },
  loader: {
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  hopiTaxiServicesMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  hopiTaxiMessageContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  hopiTaxiMessageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  hopiTaxiMessageText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  hopiTaxiServiceButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  hopiTaxiServiceButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});