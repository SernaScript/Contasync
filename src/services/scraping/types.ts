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
  status: 'starting' | 'navigating' | 'downloading' | 'completed' | 'error';
  message: string;
  currentPage?: number;
  totalFiles?: number;
  downloadedFiles?: number;
}
