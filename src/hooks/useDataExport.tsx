import { useState } from 'react';
import { toast } from 'sonner';

interface ExportOptions {
  filename?: string;
  format?: 'csv' | 'json';
}

export function useDataExport() {
  const [exporting, setExporting] = useState(false);

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: any[], headers?: string[]): string => {
    if (data.length === 0) return '';

    const keys = headers || Object.keys(data[0]);
    const csvHeaders = keys.join(',');
    
    const csvRows = data.map(row => 
      keys.map(key => {
        const value = row[key];
        // Handle values that contain commas, quotes, or newlines
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
  };

  const exportData = async (
    data: any[], 
    options: ExportOptions = {}
  ) => {
    const { filename = 'export', format = 'csv' } = options;
    
    setExporting(true);
    
    try {
      let content: string;
      let mimeType: string;
      let fileExtension: string;

      if (format === 'csv') {
        content = convertToCSV(data);
        mimeType = 'text/csv;charset=utf-8;';
        fileExtension = 'csv';
      } else {
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json;charset=utf-8;';
        fileExtension = 'json';
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const fullFilename = `${filename}_${timestamp}.${fileExtension}`;
      
      downloadFile(content, fullFilename, mimeType);
      toast.success(`Data exported successfully as ${fullFilename}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const exportCSV = (data: any[], filename?: string) => {
    return exportData(data, { filename, format: 'csv' });
  };

  const exportJSON = (data: any[], filename?: string) => {
    return exportData(data, { filename, format: 'json' });
  };

  return {
    exportData,
    exportCSV,
    exportJSON,
    exporting
  };
}