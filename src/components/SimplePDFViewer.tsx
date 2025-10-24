"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  FileText,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface SimplePDFViewerProps {
  pdfUrl: string;
  fileName: string;
  onDownload?: () => void;
}

export const SimplePDFViewer: React.FC<SimplePDFViewerProps> = ({ pdfUrl, fileName, onDownload }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && iframeRef.current) {
      const iframe = iframeRef.current;
      
      const handleLoad = () => {
        setIsLoading(false);
        setError(null);
      };

      const handleError = () => {
        setIsLoading(false);
        setError('Error al cargar el PDF');
      };

      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
      };
    }
  }, [isClient, pdfUrl]);

  if (!isClient) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Inicializando visor...</h3>
          <p className="text-sm text-gray-500">Preparando el visor de PDF</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Error al cargar PDF</h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                if (iframeRef.current) {
                  iframeRef.current.src = pdfUrl;
                }
              }}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
            <Button
              onClick={() => window.open(pdfUrl, '_blank')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Abrir en Nueva Pestaña
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Barra de herramientas */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {fileName}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(pdfUrl, '_blank')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Nueva Pestaña
          </Button>
          
          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          )}
        </div>
      </div>
      
      {/* Contenedor del PDF */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Cargando PDF...</h3>
              <p className="text-sm text-gray-500">Renderizando documento</p>
            </div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={pdfUrl}
          className="w-full h-full border-0"
          title="PDF de la factura"
          style={{ 
            border: 'none',
            background: 'white'
          }}
          onLoad={() => {
            setIsLoading(false);
            setError(null);
          }}
          onError={() => {
            setIsLoading(false);
            setError('Error al cargar el PDF');
          }}
        />
      </div>
    </div>
  );
};
