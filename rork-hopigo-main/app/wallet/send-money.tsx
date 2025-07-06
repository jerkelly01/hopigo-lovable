import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useWalletStore } from '@/store/wallet-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, User, Users } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function SendMoneyScreen() {
  const router = useRouter();
  const { balance, currency, sendMoney } = useWalletStore();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock contacts
  const recentContacts = [
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
  ];
  
  const handleContactSelect = (contact: any) => {
    setSelectedContact(contact);
  };
  
  const handleSendMoney = async () => {
    const numAmount = parseFloat(amount);
    
    if (!selectedContact) {
      Alert.alert('Select Recipient', 'Please select a recipient');
      return;
    }
    
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    
    if (numAmount > balance) {
      Alert.alert(
        'Insufficient Funds',
        'You don\'t have enough balance. Would you like to add funds?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Funds', onPress: () => router.push('/wallet/add-funds') }
        ]
      );
      return;
    }
    
    setIsLoading(true);
    
    try {
      await sendMoney(
        selectedContact.id,
        numAmount,
        description || `Payment to ${selectedContact.name}`
      );
      
      Alert.alert(
        'Success',
        `${numAmount} ${currency} has been sent to ${selectedContact.name}`,
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send money. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Send Money',
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
        <Text style={styles.title}>Send Money to Friends</Text>
        
        {/* Recipient Selection */}
        <Card style={styles.card}>
          <Text style={styles.label}>Select Recipient</Text>
          
          <Input
            placeholder="Search by name or phone"
            containerStyle={styles.searchInput}
            leftIcon={<Search size={20} color={Colors.textSecondary} />}
          />
          
          {selectedContact ? (
            <View style={styles.selectedContact}>
              <Image 
                source={{ uri: selectedContact.avatar }} 
                style={styles.contactAvatar} 
              />
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{selectedContact.name}</Text>
                <TouchableOpacity onPress={() => setSelectedContact(null)}>
                  <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.recentText}>Recent Contacts</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contactsContainer}
              >
                {recentContacts.map((contact) => (
                  <TouchableOpacity
                    key={contact.id}
                    style={styles.contactItem}
                    onPress={() => handleContactSelect(contact)}
                  >
                    <Image 
                      source={{ uri: contact.avatar }} 
                      style={styles.contactAvatar} 
                    />
                    <Text style={styles.contactName} numberOfLines={1}>
                      {contact.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => router.push('/contacts')}
                >
                  <View style={styles.moreContactsIcon}>
                    <Users size={24} color={Colors.primary} />
                  </View>
                  <Text style={styles.contactName}>More</Text>
                </TouchableOpacity>
              </ScrollView>
            </>
          )}
        </Card>
        
        {/* Amount Input */}
        <Card style={styles.card}>
          <Text style={styles.label}>Enter Amount</Text>
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
          <Text style={styles.balanceText}>
            Available Balance: {balance} {currency}
          </Text>
        </Card>
        
        {/* Description */}
        <Card style={styles.card}>
          <Text style={styles.label}>Description (Optional)</Text>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="What's this for?"
            containerStyle={styles.descriptionInput}
          />
        </Card>
        
        <Button
          title="Send Money"
          isLoading={isLoading}
          disabled={!selectedContact || !amount || parseFloat(amount) <= 0}
          onPress={handleSendMoney}
          style={styles.sendButton}
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
  searchInput: {
    marginBottom: 16,
  },
  recentText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  contactsContainer: {
    paddingBottom: 8,
  },
  contactItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  moreContactsIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactName: {
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
  },
  selectedContact: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.card,
    borderRadius: 8,
  },
  contactInfo: {
    marginLeft: 12,
    flex: 1,
  },
  changeText: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  balanceText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  descriptionInput: {
    marginBottom: 0,
  },
  sendButton: {
    marginTop: 16,
  },
});