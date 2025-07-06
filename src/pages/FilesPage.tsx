import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileManager } from '@/components/upload/FileManager';
import { DocumentUpload } from '@/components/upload/DocumentUpload';
import { AvatarUpload } from '@/components/upload/AvatarUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image, FileText, FolderOpen } from 'lucide-react';

export default function FilesPage() {
  return (
    <AdminLayout 
      title="File Management" 
      description="Upload, manage and organize files across the platform"
    >
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Storage Buckets
              </CardTitle>
              <FolderOpen className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">2</div>
              <p className="text-xs text-blue-100">Avatars & Documents</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Upload Types
              </CardTitle>
              <Upload className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Multiple</div>
              <p className="text-xs text-green-100">Images, PDFs, Documents</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Security
              </CardTitle>
              <FileText className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">RLS</div>
              <p className="text-xs text-purple-100">Row Level Security</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="manage" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              File Manager
            </TabsTrigger>
            <TabsTrigger value="avatars" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Avatars
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manage">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FileManager bucket="documents" />
              <FileManager bucket="avatars" />
            </div>
          </TabsContent>

          <TabsContent value="avatars">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Avatar Upload Demo</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <AvatarUpload size="lg" />
                </CardContent>
              </Card>
              
              <FileManager bucket="avatars" />
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <FileManager bucket="documents" />
          </TabsContent>

          <TabsContent value="upload">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Profile Avatar</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <AvatarUpload size="lg" />
                </CardContent>
              </Card>
              
              <DocumentUpload 
                folder="admin-uploads"
                maxFiles={5}
                maxSizeMB={5}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}