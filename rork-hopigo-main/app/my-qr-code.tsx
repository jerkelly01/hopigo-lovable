import React, { useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Share, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Share2, Download } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import { captureRef } from 'react-native-view-shot';

// Conditional import for expo-media-library (not available on web)
let MediaLibrary: any = null;
if (Platform.OS !== 'web') {
  try {
    MediaLibrary = require('expo-media-library');
  } catch (error) {
    console.log('MediaLibrary not available');
  }
}

export default function MyQRCodePage() {
  const router = useRouter();
  const qrContainerRef = useRef<View>(null);

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Scan my QR code to send me money on HopiGo!',
        title: 'My HopiGo QR Code',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownload = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Download is not available on web platform');
      return;
    }

    if (!MediaLibrary) {
      Alert.alert('Not Available', 'Media library is not available on this platform');
      return;
    }

    if (!qrContainerRef.current) {
      Alert.alert('Error', 'QR code not ready for capture. Please try again.');
      return;
    }

    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to save images to your photo library');
        return;
      }

      // Capture the QR code container as an image
      const uri = await captureRef(qrContainerRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(uri);
      
      // Try to create album, but don't fail if it already exists
      try {
        await MediaLibrary.createAlbumAsync('HopiGo', asset, false);
      } catch (albumError) {
        // Album might already exist, that's okay
        console.log('Album creation note:', albumError);
      }

      Alert.alert('Success', 'QR code saved to your photo library!');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      Alert.alert('Error', 'Failed to download QR code. Please try again.');
    }
  };

  // QR code data - in a real app, this would be the user's unique payment ID
  const qrValue = 'hopigo://pay/johndoe';

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "My QR Code",
          headerBackground: () => (
            <LinearGradient
              colors={['#5de0e6', '#004aad']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          ),
          headerTitleStyle: {
            color: 'white',
            fontWeight: '600',
          },
          headerTintColor: 'white',
        }} 
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>My QR Code</Text>
          <Text style={styles.subtitle}>
            Share this code with others to receive payments
          </Text>
        </View>

        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper} ref={qrContainerRef} collapsable={false}>
            <LinearGradient
              colors={[Colors.primary, '#40E0D0']}
              style={styles.qrGradient}
            >
              <View style={styles.qrCodeWrapper}>
                <View style={styles.qrCode}>
                  <QRCode
                    value={qrValue}
                    size={180}
                    color={Colors.text}
                    backgroundColor="white"
                  />
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userHandle}>@johndoe</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
            <Download size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>How to use:</Text>
          <Text style={styles.instructionText}>
            • Show this QR code to someone who wants to send you money
          </Text>
          <Text style={styles.instructionText}>
            • They can scan it with their HopiGo app to send payment
          </Text>
          <Text style={styles.instructionText}>
            • You will receive a notification when payment is received
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrWrapper: {
    backgroundColor: 'transparent',
  },
  qrGradient: {
    borderRadius: 20,
    padding: 3,
  },
  qrCodeWrapper: {
    backgroundColor: Colors.white,
    borderRadius: 17,
    padding: 30,
  },
  qrCode: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 40,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  instructions: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
});