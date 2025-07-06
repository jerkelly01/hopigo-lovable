import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useWalletStore } from '@/store/wallet-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, User, Users, Plus, Minus, Receipt } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function SplitBillScreen() {
  const router = useRouter();
  const { splitBill, currency } = useWalletStore();
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock contacts
  const contacts = [
    {
      id: 'user123',
      name: 'Elena Sanchez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    },
    {
      id: 'user456',
      name: 'Miguel Torres',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    },
    {
      id: 'user789',
      name: 'Sofia Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    },
    {
      id: 'user101',
      name: 'Carlos Perez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    },
  ];
  
  const toggleContact = (contact: any) => {
    if (selectedContacts.some(c => c.id === contact.id)) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };
  
  const calculateSplitAmount = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return '0.00';
    
    const totalPeople = selectedContacts.length + 1; // +1 for the user
    const perPerson = numAmount / totalPeople;
    
    return perPerson.toFixed(2);
  };
  
  const handleSplitBill = async () => {
    const numAmount = parseFloat(amount);
    
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please enter a title for the split');
      return;
    }
    
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    
    if (selectedContacts.length === 0) {
      Alert.alert('No Contacts Selected', 'Please select at least one contact to split with');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await splitBill(
        title,
        numAmount,
        selectedContacts.map(c => c.id)
      );
      
      Alert.alert(
        'Success',
        `Split request for ${title} has been sent to ${selectedContacts.length} people`,
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create split bill. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Split Bill',
          headerTitleStyle: {
            fontWeight: '600',
            color: '#FFFFFF',
          },
          headerBackground: () => (
            <LinearGradient
              colors={['#5de0e6', '#004aad']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          ),
        }}
      />
      
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Split a Bill with Friends</Text>
        
        {/* Bill Details */}
        <Card style={styles.card}>
          <Text style={styles.label}>Bill Details</Text>
          
          <Input
            placeholder="What's this for? (e.g. Dinner, Movie)"
            value={title}
            onChangeText={setTitle}
            containerStyle={styles.inputContainer}
          />
          
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>{currency}</Text>
            <Input
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              containerStyle={styles.amountInput}
              inputStyle={styles.amountInputField}
            />
          </View>
        </Card>
        
        {/* Split With */}
        <Card style={styles.card}>
          <Text style={styles.label}>Split With</Text>
          
          <Input
            placeholder="Search contacts"
            containerStyle={styles.searchInput}
            leftIcon={<Search size={20} color={Colors.textSecondary} />}
          />
          
          <View style={styles.contactsList}>
            {contacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactItem}
                onPress={() => toggleContact(contact)}
              >
                <View style={styles.contactInfo}>
                  <Image 
                    source={{ uri: contact.avatar }} 
                    style={styles.contactAvatar} 
                  />
                  <Text style={styles.contactName}>{contact.name}</Text>
                </View>
                <View style={[
                  styles.selectIcon,
                  selectedContacts.some(c => c.id === contact.id) && styles.selectedIcon
                ]}>
                  {selectedContacts.some(c => c.id === contact.id) ? (
                    <Minus size={16} color={Colors.white} />
                  ) : (
                    <Plus size={16} color={Colors.primary} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
        
        {/* Summary */}
        <Card style={styles.card}>
          <Text style={styles.label}>Summary</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryValue}>
              {parseFloat(amount || '0').toFixed(2)} {currency}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Number of People</Text>
            <Text style={styles.summaryValue}>{selectedContacts.length + 1}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.perPersonLabel}>Each Person Pays</Text>
            <Text style={styles.perPersonValue}>
              {calculateSplitAmount()} {currency}
            </Text>
          </View>
        </Card>
        
        <Button
          title="Send Split Request"
          isLoading={isLoading}
          disabled={!title || !amount || selectedContacts.length === 0}
          onPress={handleSplitBill}
          style={styles.splitButton}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    marginBottom: 0,
  },
  amountInputField: {
    fontSize: 24,
    fontWeight: '600',
  },
  searchInput: {
    marginBottom: 16,
  },
  contactsList: {
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  contactName: {
    fontSize: 14,
    color: Colors.text,
  },
  selectIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: {
    backgroundColor: Colors.primary,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  perPersonLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  perPersonValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  splitButton: {
    marginTop: 16,
  },
});