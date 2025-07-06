import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, Trash2 } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/AuthProvider';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onAvatarChange?: (url: string | null) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarUpload({ 
  currentAvatar, 
  onAvatarChange, 
  size = 'md',
  className = ''
}: AvatarUploadProps) {
  const { user } = useAuthContext();
  const { uploadFile, deleteFile, uploading, progress } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatar || null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const result = await uploadFile(file, {
      bucket: 'avatars',
      folder: 'profile',
      maxSizeMB: 2,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    });

    if (result) {
      // Update user's avatar URL in the database
      const { error } = await supabase
        .from('users')
        .update({ avatar_url: result.url })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating avatar:', error);
        toast.error('Failed to update avatar');
        return;
      }

      setAvatarUrl(result.url);
      onAvatarChange?.(result.url);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    if (!avatarUrl || !user) return;

    // Extract file path from URL
    const url = new URL(avatarUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(-3).join('/'); // user_id/profile/filename

    const success = await deleteFile('avatars', filePath);
    
    if (success) {
      // Update user's avatar URL in the database
      const { error } = await supabase
        .from('users')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (error) {
        console.error('Error removing avatar:', error);
        toast.error('Failed to remove avatar');
        return;
      }

      setAvatarUrl(null);
      onAvatarChange?.(null);
    }
  };

  const getInitials = () => {
    if (!user) return '?';
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div className="relative group">
        <Avatar className={`${sizeClasses[size]} border-2 border-gray-200`}>
          <AvatarImage src={avatarUrl || ''} alt="Profile avatar" />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        {/* Upload overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
          <Camera className="h-6 w-6 text-white" />
        </div>

        {/* Upload progress */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-75 rounded-full flex items-center justify-center">
            <div className="text-center">
              <Progress value={progress} className="w-16 h-2 mb-1" />
              <span className="text-xs text-white">{progress}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleFileSelect}
          disabled={uploading}
          className="text-blue-600 hover:text-blue-700"
        >
          <Upload className="h-4 w-4 mr-1" />
          Upload
        </Button>
        
        {avatarUrl && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleDeleteAvatar}
            disabled={uploading}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}