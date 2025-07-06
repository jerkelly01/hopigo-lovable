import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, CheckCircle, User, Phone, Mail, MapPin, Briefcase, FileText } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function ProviderSignupScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    serviceCategory: '',
    experience: '',
    description: '',
    hourlyRate: '',
  });

  const totalSteps = 3;

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Validate form
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'serviceCategory', 'experience', 'description', 'hourlyRate'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      'Application Submitted!',
      'Thank you for your interest in becoming a service provider. We will review your application and get back to you within 2-3 business days.',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep > index + 1 && styles.stepCompleted,
            currentStep === index + 1 && styles.stepActive
          ]}>
            {currentStep > index + 1 ? (
              <CheckCircle size={16} color={Colors.white} />
            ) : (
              <Text style={[
                styles.stepNumber,
                currentStep === index + 1 && styles.stepNumberActive
              ]}>
                {index + 1}
              </Text>
            )}
          </View>
          {index < totalSteps - 1 && (
            <View style={[
              styles.stepLine,
              currentStep > index + 1 && styles.stepLineCompleted
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepDescription}>
        Let us know about yourself to get started
      </Text>

      <Input
        label="Full Name"
        value={formData.fullName}
        onChangeText={(value) => updateFormData('fullName', value)}
        placeholder="Enter your full name"
        leftIcon={<User size={20} color={Colors.textSecondary} />}
        containerStyle={styles.inputContainer}
      />

      <Input
        label="Email Address"
        value={formData.email}
        onChangeText={(value) => updateFormData('email', value)}
        placeholder="Enter your email"
        keyboardType="email-address"
        leftIcon={<Mail size={20} color={Colors.textSecondary} />}
        containerStyle={styles.inputContainer}
      />

      <Input
        label="Phone Number"
        value={formData.phone}
        onChangeText={(value) => updateFormData('phone', value)}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        leftIcon={<Phone size={20} color={Colors.textSecondary} />}
        containerStyle={styles.inputContainer}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Location & Address</Text>
      <Text style={styles.stepDescription}>
        Where will you be providing your services?
      </Text>

      <Input
        label="Street Address"
        value={formData.address}
        onChangeText={(value) => updateFormData('address', value)}
        placeholder="Enter your address"
        leftIcon={<MapPin size={20} color={Colors.textSecondary} />}
        containerStyle={styles.inputContainer}
      />

      <Input
        label="City"
        value={formData.city}
        onChangeText={(value) => updateFormData('city', value)}
        placeholder="Enter your city"
        leftIcon={<MapPin size={20} color={Colors.textSecondary} />}
        containerStyle={styles.inputContainer}
      />

      <Input
        label="Service Category"
        value={formData.serviceCategory}
        onChangeText={(value) => updateFormData('serviceCategory', value)}
        placeholder="e.g., Cleaning, Plumbing, Tutoring"
        leftIcon={<Briefcase size={20} color={Colors.textSecondary} />}
        containerStyle={styles.inputContainer}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Service Details</Text>
      <Text style={styles.stepDescription}>
        Tell us about your experience and services
      </Text>

      <Input
        label="Years of Experience"
        value={formData.experience}
        onChangeText={(value) => updateFormData('experience', value)}
        placeholder="e.g., 5 years"
        keyboardType="numeric"
        leftIcon={<Briefcase size={20} color={Colors.textSecondary} />}
        containerStyle={styles.inputContainer}
      />

      <Input
        label="Service Description"
        value={formData.description}
        onChangeText={(value) => updateFormData('description', value)}
        placeholder="Describe your services and expertise"
        multiline
        numberOfLines={4}
        leftIcon={<FileText size={20} color={Colors.textSecondary} />}
        containerStyle={styles.inputContainer}
      />

      <Input
        label="Hourly Rate (AWG)"
        value={formData.hourlyRate}
        onChangeText={(value) => updateFormData('hourlyRate', value)}
        placeholder="e.g., 25"
        keyboardType="numeric"
        containerStyle={styles.inputContainer}
      />
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Become a Provider',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={styles.backButtonContent}>
                <ArrowLeft size={20} color={Colors.white} />
                <Text style={styles.backButtonText}>Back</Text>
              </View>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Join Our Provider Network</Text>
          <Text style={styles.subtitle}>
            Start earning money by offering your services to customers in your area
          </Text>
        </View>

        {renderStepIndicator()}

        <Card style={styles.formCard}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </Card>

        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <Button
              title="Previous"
              variant="secondary"
              onPress={prevStep}
              style={styles.button}
            />
          )}
          
          {currentStep < totalSteps ? (
            <Button
              title="Next"
              onPress={nextStep}
              style={[styles.button, currentStep === 1 && styles.fullWidthButton]}
            />
          ) : (
            <Button
              title="Submit Application"
              onPress={handleSubmit}
              style={styles.button}
            />
          )}
        </View>

        <Card style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Why Join Us?</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <CheckCircle size={20} color={Colors.primary} />
              <Text style={styles.benefitText}>Flexible working hours</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle size={20} color={Colors.primary} />
              <Text style={styles.benefitText}>Secure payment system</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle size={20} color={Colors.primary} />
              <Text style={styles.benefitText}>Growing customer base</Text>
            </View>
            <View style={styles.benefitItem}>
              <CheckCircle size={20} color={Colors.primary} />
              <Text style={styles.benefitText}>24/7 support</Text>
            </View>
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
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 32,
    marginTop: 24,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    backgroundColor: Colors.primary,
  },
  stepCompleted: {
    backgroundColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  stepNumberActive: {
    color: Colors.white,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  stepLineCompleted: {
    backgroundColor: Colors.primary,
  },
  formCard: {
    marginHorizontal: 20,
    padding: 24,
    marginBottom: 8,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 28,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  fullWidthButton: {
    marginHorizontal: 0,
  },
  benefitsCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
});