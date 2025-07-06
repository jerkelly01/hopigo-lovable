import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/AuthProvider';
import { toast } from 'sonner';

export interface UploadOptions {
  bucket: 'avatars' | 'documents';
  folder?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export function useFileUpload() {
  const { user } = useAuthContext();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (
    file: File, 
    options: UploadOptions
  ): Promise<{ url: string; path: string } | null> => {
    if (!user) {
      toast.error('You must be logged in to upload files');
      return null;
    }

    const { bucket, folder, maxSizeMB = 5, allowedTypes } = options;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return null;
    }

    // Validate file type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      toast.error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Create file path with user folder structure
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const folderPath = folder ? `${user.id}/${folder}` : user.id;
      const filePath = `${folderPath}/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload file');
        return null;
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setProgress(100);
      toast.success('File uploaded successfully');

      return {
        url: publicUrl,
        path: filePath
      };

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteFile = async (bucket: 'avatars' | 'documents', filePath: string) => {
    if (!user) {
      toast.error('You must be logged in to delete files');
      return false;
    }

    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete file');
        return false;
      }

      toast.success('File deleted successfully');
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
      return false;
    }
  };

  const getSignedUrl = async (bucket: 'avatars' | 'documents', filePath: string, expiresIn = 3600) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        console.error('Signed URL error:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Signed URL error:', error);
      return null;
    }
  };

  return {
    uploadFile,
    deleteFile,
    getSignedUrl,
    uploading,
    progress
  };
}