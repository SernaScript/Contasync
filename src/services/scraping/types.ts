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
}

export interface ScrapingProgress {
  status: 'starting' | 'navigating' | 'mapping' | 'downloading' | 'completed' | 'error';
  message: string;
  currentPage?: number;
  totalFiles?: number;
  downloadedFiles?: number;
  mappedDocuments?: number;
}

export interface ScrapedDocumentData {
  documentUUID?: string; 
  reception?: string;
  documentDate?: string;
  prefix?: string;
  documentNumber?: string;
  documentType?: string;
  senderNit?: string;
  senderName?: string;
  receiverNit?: string;
  receiverName?: string;
  result?: string;
  radianStatus?: string;
  totalValue?: string;
}
