"use client"

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText,
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
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              if (iframeRef.current) {
                iframeRef.current.src = pdfUrl;
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2 inline" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white">
      {/* Contenedor del PDF - Sin barra de herramientas */}
      <div className="h-full relative">
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
