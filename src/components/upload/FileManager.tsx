import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useRoles } from '@/hooks/useRoles';
import { Search, Download, Trash2, Eye, FolderOpen, Image, FileText } from 'lucide-react';
import { toast } from 'sonner';
import type { FileObject } from '@supabase/storage-js';

interface FileManagerProps {
  bucket?: 'avatars' | 'documents';
  adminOnly?: boolean;
}

export function FileManager({ bucket, adminOnly = true }: FileManagerProps) {
  const { isAdmin } = useRoles();
  const [files, setFiles] = useState<FileObject[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileObject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBucket, setSelectedBucket] = useState<'avatars' | 'documents'>(bucket || 'documents');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!adminOnly || isAdmin) {
      fetchFiles();
    }
  }, [selectedBucket, isAdmin, adminOnly]);

  useEffect(() => {
    const filtered = files.filter(file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [searchTerm, files]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(selectedBucket)
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error fetching files:', error);
        toast.error('Failed to fetch files');
        return;
      }

      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from(selectedBucket)
        .remove([fileName]);

      if (error) {
        console.error('Error deleting file:', error);
        toast.error('Failed to delete file');
        return;
      }

      toast.success('File deleted successfully');
      fetchFiles(); // Refresh the list
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleDownloadFile = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(selectedBucket)
        .download(fileName);

      if (error) {
        console.error('Error downloading file:', error);
        toast.error('Failed to download file');
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handleViewFile = (fileName: string) => {
    const { data } = supabase.storage
      .from(selectedBucket)
      .getPublicUrl(fileName);
    
    window.open(data.publicUrl, '_blank');
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimetype?: string) => {
    if (mimetype?.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    }
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const getFileTypeLabel = (mimetype?: string) => {
    if (mimetype?.startsWith('image/')) return 'Image';
    if (mimetype === 'application/pdf') return 'PDF';
    if (mimetype?.includes('word')) return 'Word';
    return 'Document';
  };

  if (adminOnly && !isAdmin) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">Admin access required to view file manager.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            File Manager
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Select value={selectedBucket} onValueChange={(value: 'avatars' | 'documents') => setSelectedBucket(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avatars">Avatars</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={fetchFiles} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading files...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              {searchTerm ? 'No files match your search.' : `No files in ${selectedBucket} bucket.`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
          {filteredFiles.map((file) => (
            <div
              key={file.id || file.name}
              className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(file.metadata?.mimetype)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Badge variant="secondary" className="text-xs">
                        {getFileTypeLabel(file.metadata?.mimetype)}
                      </Badge>
                      <span>{formatFileSize(file.metadata?.size)}</span>
                      <span>•</span>
                      <span>{new Date(file.created_at || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewFile(file.name)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadFile(file.name)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteFile(file.name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}