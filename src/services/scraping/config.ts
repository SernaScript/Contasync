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
    emisorColumn: string;
    responseColumn: string;
    // Table column selectors
    receptionColumn: string;
    documentDateColumn: string;
    prefixColumn: string;
    documentNumberColumn: string;
    documentTypeColumn: string;
    senderNitColumn: string;
    senderNameColumn: string;
    receiverNitColumn: string;
    receiverNameColumn: string;
    resultColumn: string;
    radianStatusColumn: string;
    totalValueColumn: string;
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
    emisorColumn: "td:nth-child(8)", 
    responseColumn: "td:nth-child(6)",
    // Table column selectors (based on HTML structure)
    receptionColumn: "td:nth-child(2)",      // Recepción
    documentDateColumn: "td:nth-child(3)",   // Fecha
    prefixColumn: "td:nth-child(4)",         // Prefijo
    documentNumberColumn: "td:nth-child(5)", // Nº documento
    documentTypeColumn: "td:nth-child(6)",   // Tipo
    senderNitColumn: "td:nth-child(7)",      // NIT Emisor
    senderNameColumn: "td:nth-child(8)",     // Emisor
    receiverNitColumn: "td:nth-child(9)",    // NIT Receptor
    receiverNameColumn: "td:nth-child(10)",  // Receptor
    resultColumn: "td:nth-child(11)",        // Resultado
    radianStatusColumn: "td:nth-child(12)",  // Estado RADIAN
    totalValueColumn: "td:nth-child(13)",    // Valor Total
    nextButton: "#tableDocuments_next",
    dateRangePicker: "#dashboard-report-range",
    startDateInput: "input[name='daterangepicker_start']",
    endDateInput: "input[name='daterangepicker_end']",
    senderCode: "#SenderCode",
    submitButton: "//button[@type='submit']"
  }
};
