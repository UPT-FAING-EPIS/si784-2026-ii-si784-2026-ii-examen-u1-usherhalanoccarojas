/**
 * Validates a 15-digit IMEI using the Luhn Algorithm.
 */
export function validateImei(imei: string): { isValid: boolean; message: string; checkDigit?: number } {
  const clean = imei.trim();

  if (!clean) {
    return { isValid: false, message: 'El IMEI es obligatorio.' };
  }

  if (!/^\d+$/.test(clean)) {
    return { isValid: false, message: 'El IMEI debe contener solo números.' };
  }

  if (clean.length !== 15) {
    return { isValid: false, message: `El IMEI debe tener exactamente 15 dígitos (actual: ${clean.length}).` };
  }

  // Calculate Luhn
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let digit = parseInt(clean[i], 10);
    // Double every second digit (odd index in 0-indexed string)
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit = Math.floor(digit / 10) + (digit % 10);
      }
    }
    sum += digit;
  }

  if (sum % 10 !== 0) {
    // Calculate what the correct check digit would be
    let subSum = 0;
    for (let i = 0; i < 14; i++) {
      let digit = parseInt(clean[i], 10);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit = Math.floor(digit / 10) + (digit % 10);
      }
      subSum += digit;
    }
    const expectedCheckDigit = (10 - (subSum % 10)) % 10;
    return {
      isValid: false,
      message: `El dígito verificador Luhn no coincide (debería ser ${expectedCheckDigit}).`,
      checkDigit: expectedCheckDigit
    };
  }

  return { isValid: true, message: 'IMEI válido con verificación Luhn correcta.' };
}
