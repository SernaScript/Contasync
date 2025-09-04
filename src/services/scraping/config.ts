export interface ScrapingConfig {
  tokenUrl: string;
  startDate: string;
  endDate: string;
  downloadDirectory: string;
  browserConfig: {
    headless: boolean;
    acceptDownloads: boolean;
    extraHTTPHeaders: Record<string, string>;
  };
  timeouts: {
    pageLoad: number;
    elementWait: number;
    tableWait: number;
    shortDelay: number;
    mediumDelay: number;
    longDelay: number;
    veryLongDelay: number;
  };
  selectors: {
    closeMenuButton: string;
    tbody: string;
    tableRows: string;
    downloadButton: string;
    nextButton: string;
    dateRangePicker: string;
    startDateInput: string;
    endDateInput: string;
    senderCode: string;
    submitButton: string;
  };
}

export const defaultScrapingConfig: ScrapingConfig = {
  tokenUrl: "",
  startDate: "",
  endDate: "",
  downloadDirectory: "./downloads",
  browserConfig: {
    headless: false,
    acceptDownloads: true,
    extraHTTPHeaders: {
      'Accept-Language': 'es-ES,es;q=0.9'
    }
  },
  timeouts: {
    pageLoad: 5000,
    elementWait: 10000,
    tableWait: 50000,
    shortDelay: 500,
    mediumDelay: 1000,
    longDelay: 3000,
    veryLongDelay: 5000
  },
  selectors: {
    closeMenuButton: "[class*='close-menu-button'], [id*='close-menu-button'], text*='close-menu-button'",
    tbody: "tbody",
    tableRows: "tbody tr",
    downloadButton: "td:first-child .fa-download",
    nextButton: "#tableDocuments_next",
    dateRangePicker: "#dashboard-report-range",
    startDateInput: "input[name='daterangepicker_start']",
    endDateInput: "input[name='daterangepicker_end']",
    senderCode: "#SenderCode",
    submitButton: "//button[@type='submit']"
  }
};
