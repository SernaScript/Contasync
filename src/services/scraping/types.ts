export interface ScrapingRequest {
  token: string;
  startDate: string;
  endDate: string;
}

export interface ScrapingResult {
  success: boolean;
  message: string;
  downloadedFiles?: DownloadedFile[];
  error?: string;
}

export interface DownloadedFile {
  filename: string;
  size: number;
  downloadPath: string;
  downloadDate: string;
  processedFiles?: ProcessedFile[];
  isProcessed?: boolean;
}

export interface ProcessedFile {
  originalName: string;
  extractedName: string;
  fileType: 'xml' | 'pdf' | 'other';
  size: number;
  path: string;
  extractedDate: string;
}

export interface ScrapingProgress {
  status: 'starting' | 'navigating' | 'downloading' | 'completed' | 'error';
  message: string;
  currentPage?: number;
  totalFiles?: number;
  downloadedFiles?: number;
}
