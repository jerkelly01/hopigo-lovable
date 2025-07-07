import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  requiredFields: string[];
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to HopiGo!',
    description: 'Sent to new users when they sign up',
    requiredFields: ['name', 'loginUrl']
  },
  {
    id: 'booking_confirmation',
    name: 'Booking Confirmation',
    subject: 'Booking Confirmed - HopiGo',
    description: 'Sent when a booking is confirmed',
    requiredFields: ['customerName', 'serviceName', 'bookingDate', 'bookingTime', 'providerName', 'totalAmount', 'bookingId']
  },
  {
    id: 'password_reset',
    name: 'Password Reset',
    subject: 'Reset Your Password - HopiGo',
    description: 'Sent when user requests password reset',
    requiredFields: ['name', 'resetUrl']
  },
  {
    id: 'payment_receipt',
    name: 'Payment Receipt',
    subject: 'Payment Receipt - HopiGo',
    description: 'Sent after successful payment',
    requiredFields: ['customerName', 'amount', 'paymentMethod', 'transactionId', 'paymentDate', 'serviceName']
  }
];

export const useEmailTemplates = () => {
  const [sending, setSending] = useState(false);

  const sendEmail = async (to: string, templateId: string, data: Record<string, any>) => {
    setSending(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: {
          to,
          template: templateId,
          data
        }
      });

      if (error) throw error;

      toast.success('Email sent successfully');
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
      throw error;
    } finally {
      setSending(false);
    }
  };

  const sendWelcomeEmail = async (to: string, name: string) => {
    return sendEmail(to, 'welcome', {
      name,
      loginUrl: `${window.location.origin}/auth`
    });
  };

  const sendBookingConfirmation = async (to: string, bookingData: any) => {
    return sendEmail(to, 'booking_confirmation', bookingData);
  };

  const sendPasswordReset = async (to: string, name: string, resetUrl: string) => {
    return sendEmail(to, 'password_reset', {
      name,
      resetUrl
    });
  };

  const sendPaymentReceipt = async (to: string, paymentData: any) => {
    return sendEmail(to, 'payment_receipt', paymentData);
  };

  return {
    emailTemplates,
    sending,
    sendEmail,
    sendWelcomeEmail,
    sendBookingConfirmation,
    sendPasswordReset,
    sendPaymentReceipt
  };
};