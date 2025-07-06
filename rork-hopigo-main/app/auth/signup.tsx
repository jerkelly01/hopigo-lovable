import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, EyeOff, User, Mail, Lock, Globe } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Language } from '@/constants/translations';

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading, error } = useAuthStore();
  const { t, setLanguage } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    selectedLanguage: 'en' as Language,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
    { code: 'nl' as Language, name: 'Nederlands', flag: '🇳🇱' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageSelect = async (language: Language) => {
    setFormData(prev => ({
      ...prev,
      selectedLanguage: language
    }));
    
    // Update the app language immediately
    await setLanguage(language);
    setShowLanguageSelector(false);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert(t('error'), 'Please enter your name');
      return false;
    }
    
    if (!formData.email.trim()) {
      Alert.alert(t('error'), 'Please enter your email');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      Alert.alert(t('error'), 'Please enter a valid email address');
      return false;
    }
    
    if (formData.password.length < 6) {
      Alert.alert(t('error'), 'Password must be at least 6 characters');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Alert.alert(t('error'), 'Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    try {
      await signup(formData.name, formData.email, formData.password, formData.selectedLanguage);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const selectedLanguageData = languages.find(lang => lang.code === formData.selectedLanguage);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join HopiGo and start booking services</Text>
        </View>

        <View style={styles.form}>
          {/* Language Selector */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Preferred Language</Text>
            <TouchableOpacity 
              style={styles.languageSelector}
              onPress={() => setShowLanguageSelector(!showLanguageSelector)}
            >
              <Globe size={20} color={Colors.textSecondary} />
              <Text style={styles.languageSelectorText}>
                {selectedLanguageData?.flag} {selectedLanguageData?.name}
              </Text>
            </TouchableOpacity>
            
            {showLanguageSelector && (
              <View style={styles.languageOptions}>
                {languages.map((language) => (
                  <TouchableOpacity
                    key={language.code}
                    style={[
                      styles.languageOption,
                      formData.selectedLanguage === language.code && styles.selectedLanguageOption
                    ]}
                    onPress={() => handleLanguageSelect(language.code)}
                  >
                    <Text style={styles.languageOptionText}>
                      {language.flag} {language.name}
                    </Text>
                    {formData.selectedLanguage === language.code && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            leftIcon={<User size={20} color={Colors.textSecondary} />}
            autoCapitalize="words"
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            leftIcon={<Mail size={20} color={Colors.textSecondary} />}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            leftIcon={<Lock size={20} color={Colors.textSecondary} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color={Colors.textSecondary} />
                ) : (
                  <Eye size={20} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>
            }
            secureTextEntry={!showPassword}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            leftIcon={<Lock size={20} color={Colors.textSecondary} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <EyeOff size={20} color={Colors.textSecondary} />
                ) : (
                  <Eye size={20} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>
            }
            secureTextEntry={!showConfirmPassword}
          />

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <Button
            title="Create Account"
            onPress={handleSignup}
            isLoading={isLoading}
            style={styles.signupButton}
          />

          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  languageSelectorText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },
  languageOptions: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedLanguageOption: {
    backgroundColor: Colors.primary + '10',
  },
  languageOptionText: {
    fontSize: 16,
    color: Colors.text,
  },
  checkmark: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  signupButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPromptText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});