"use client"

import React, { useState, useEffect } from 'react';
import { SimplePDFViewer } from './SimplePDFViewer';
import { FileText } from 'lucide-react';

interface PDFViewerWrapperProps {
  pdfUrl: string;
  fileName: string;
  onDownload?: () => void;
}

export const PDFViewerWrapper: React.FC<PDFViewerWrapperProps> = (props) => {
  const [useSimpleViewer, setUseSimpleViewer] = useState<boolean>(true);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Por ahora usamos siempre el SimplePDFViewer que es más estable
  if (!isClient) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Cargando visor de PDF...</h3>
          <p className="text-sm text-gray-500">Inicializando visor</p>
        </div>
      </div>
    );
  }

  return <SimplePDFViewer {...props} />;
};
