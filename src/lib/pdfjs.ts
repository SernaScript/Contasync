// Configuración de PDF.js para Next.js
import * as pdfjsLib from 'pdfjs-dist';

// Configurar el worker para Next.js
if (typeof window !== 'undefined') {
  // Solo en el cliente
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export { pdfjsLib };
