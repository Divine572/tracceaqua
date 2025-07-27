export interface ValidationRule {
  field: string;
  message: string;
  validator: (value: any) => boolean;
}

export class FormValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateWalletAddress(address: string): boolean {
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    return addressRegex.test(address);
  }

  static validateRequired(value: any): boolean {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  }

  static validateMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength;
  }

  static validateMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
  }

  static validateNumeric(value: string): boolean {
    return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
  }

  static validatePositiveNumber(value: string): boolean {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num) && num > 0;
  }

  static validateCoordinates(lat: string, lng: string): boolean {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    return (
      !isNaN(latitude) && !isNaN(longitude) &&
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180
    );
  }

  static validateBatchNumber(batchNumber: string): boolean {
    // Format: BATCH-YYYY-NNN
    const batchRegex = /^BATCH-\d{4}-\d{3}$/;
    return batchRegex.test(batchNumber);
  }

  static validateProductId(productId: string): boolean {
    // Format: PRD-NNN
    const productRegex = /^PRD-\d{3}$/;
    return productRegex.test(productId);
  }

  static validateQRCode(qrCode: string): boolean {
    // Format: QR-PRD-NNN-YYYY
    const qrRegex = /^QR-PRD-\d{3}-\d{4}$/;
    return qrRegex.test(qrCode);
  }

  static validateForm(data: Record<string, any>, rules: ValidationRule[]): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};
    
    for (const rule of rules) {
      const value = data[rule.field];
      if (!rule.validator(value)) {
        errors[rule.field] = rule.message;
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
