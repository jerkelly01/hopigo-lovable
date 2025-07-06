import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (!token || type !== 'signup') {
        setStatus('error');
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (error) {
          if (error.message.includes('expired')) {
            setStatus('expired');
          } else {
            setStatus('error');
          }
          console.error('Verification error:', error);
        } else {
          setStatus('success');
          toast.success('Email verified successfully!');
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleResendVerification = async () => {
    const email = searchParams.get('email');
    
    if (!email) {
      toast.error('Email address not found. Please sign up again.');
      navigate('/auth');
      return;
    }

    setResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        toast.error('Failed to resend verification email');
      } else {
        toast.success('Verification email sent!');
      }
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-center text-gray-900">Verifying Your Email</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Please wait while we verify your email address...
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </CardContent>
          </Card>
        );

      case 'success':
        return (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-center text-gray-900">Email Verified!</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Your email has been successfully verified. You can now access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Redirecting you to the dashboard...
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        );

      case 'expired':
        return (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-center text-gray-900">Link Expired</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Your verification link has expired. Please request a new one.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button 
                onClick={handleResendVerification}
                disabled={resending}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {resending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
              <Button variant="outline" onClick={() => navigate('/auth')} className="w-full">
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        );

      case 'error':
      default:
        return (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-center text-gray-900">Verification Failed</CardTitle>
              <CardDescription className="text-center text-gray-600">
                We couldn't verify your email. The link may be invalid or expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button 
                onClick={handleResendVerification}
                disabled={resending}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {resending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
              <Button variant="outline" onClick={() => navigate('/auth')} className="w-full">
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderContent()}
      </div>
    </div>
  );
}