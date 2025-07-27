export class IDGenerator {
  static generateBatchNumber(): string {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 999) + 1;
    return `BATCH-${year}-${sequence.toString().padStart(3, '0')}`;
  }

  static generateProductId(): string {
    const sequence = Math.floor(Math.random() * 999) + 1;
    return `PRD-${sequence.toString().padStart(3, '0')}`;
  }

  static generateQRCode(productId: string): string {
    const year = new Date().getFullYear();
    return `QR-${productId}-${year}`;
  }

  static generateSampleId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `SAMPLE-${timestamp}-${random}`.toUpperCase();
  }

  static generateTraceId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 8);
    return `TRACE-${timestamp}-${random}`.toUpperCase();
  }

  static generateSessionId(): string {
    return 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
