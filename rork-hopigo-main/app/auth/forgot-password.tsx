import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const { forgotPassword, isLoading, error, resetEmailSent, clearResetEmailSent } = useAuthStore();

  useEffect(() => {
    // Clear reset email sent state when component mounts
    clearResetEmailSent();
  }, []);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    await forgotPassword(email);
  };

  const handleBackToLogin = () => {
    clearResetEmailSent();
    router.back();
  };

  if (resetEmailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.successContainer}>
            <CheckCircle size={64} color="#10B981" />
            <Text style={styles.successTitle}>Check your email</Text>
            <Text style={styles.successMessage}>
              We have sent a password reset link to {email}
            </Text>
            <Text style={styles.successSubMessage}>
              Please check your email and follow the instructions to reset your password.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Back to Login"
              onPress={handleBackToLogin}
              style={styles.backToLoginButton}
            />
            
            <TouchableOpacity onPress={() => handleSubmit()} style={styles.resendButton}>
              <Text style={styles.resendText}>Resend email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Mail size={48} color="#6366F1" />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we will send you a link to reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <Button
            title={isLoading ? "Sending..." : "Send Reset Link"}
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backToLoginText}>
              Remember your password? <Text style={styles.loginLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginTop: 20,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  form: {
    gap: 20,
  },
  submitButton: {
    marginTop: 10,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  backToLoginText: {
    fontSize: 16,
    color: '#6B7280',
  },
  loginLink: {
    color: '#6366F1',
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginTop: 24,
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  successSubMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    gap: 16,
    paddingBottom: 40,
  },
  backToLoginButton: {
    marginTop: 20,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
});