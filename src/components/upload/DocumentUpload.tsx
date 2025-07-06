import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, File, Trash2, Download, Eye } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';

interface UploadedFile {
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

interface DocumentUploadProps {
  folder?: string;
  maxFiles?: number;
  allowedTypes?: string[];
  maxSizeMB?: number;
  onFilesChange?: (files: UploadedFile[]) => void;
  initialFiles?: UploadedFile[];
}

export function DocumentUpload({
  folder = 'general',
  maxFiles = 10,
  allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp'
  ],
  maxSizeMB = 10,
  onFilesChange,
  initialFiles = []
}: DocumentUploadProps) {
  const { uploadFile, deleteFile, uploading, progress } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);

  const handleFileSelect = () => {
    if (files.length >= maxFiles) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    for (const file of selectedFiles) {
      if (files.length >= maxFiles) break;

      const result = await uploadFile(file, {
        bucket: 'documents',
        folder,
        maxSizeMB,
        allowedTypes
      });

      if (result) {
        const newFile: UploadedFile = {
          name: file.name,
          url: result.url,
          path: result.path,
          size: file.size,
          type: file.type,
          uploadedAt: new Date()
        };

        const updatedFiles = [...files, newFile];
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = async (file: UploadedFile) => {
    const success = await deleteFile('documents', file.path);
    
    if (success) {
      const updatedFiles = files.filter(f => f.path !== file.path);
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type.includes('word')) return '📝';
    return '📎';
  };

  const getFileTypeLabel = (type: string) => {
    if (type.startsWith('image/')) return 'Image';
    if (type === 'application/pdf') return 'PDF';
    if (type.includes('word')) return 'Word';
    return 'Document';
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <File className="h-5 w-5" />
            Documents ({files.length}/{maxFiles})
          </span>
          <Button
            onClick={handleFileSelect}
            disabled={uploading || files.length >= maxFiles}
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {uploading && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Uploading...</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {files.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <File className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">No documents uploaded yet</p>
            <p className="text-sm text-gray-500">
              Drag and drop files here or click upload button
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="text-2xl">{getFileIcon(file.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Badge variant="secondary" className="text-xs">
                        {getFileTypeLabel(file.type)}
                      </Badge>
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{file.uploadedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = file.url;
                      a.download = file.name;
                      a.click();
                    }}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteFile(file)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}