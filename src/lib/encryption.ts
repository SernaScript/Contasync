import crypto from 'crypto';

// Clave de cifrado - en producción debería estar en variables de entorno
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here!';
const ALGORITHM = 'aes-256-gcm';

// Función para derivar una clave de 32 bytes desde la clave de entrada
function deriveKey(password: string): Buffer {
  return crypto.scryptSync(password, 'siigo-salt', 32);
}

/**
 * Cifra un texto usando AES-256-GCM
 * @param text - Texto a cifrar
 * @returns Texto cifrado en formato "iv:tag:encrypted"
 */
export function encrypt(text: string): string {
  try {
    // Generar un IV aleatorio de 12 bytes para GCM
    const iv = crypto.randomBytes(12);
    
    // Derivar la clave
    const key = deriveKey(ENCRYPTION_KEY);
    
    // Crear el cipher con GCM
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    cipher.setAAD(Buffer.from('siigo-credentials', 'utf8'));
    
    // Cifrar el texto
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Obtener el tag de autenticación
    const tag = cipher.getAuthTag();
    
    // Combinar IV, tag y texto cifrado
    const result = iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
    
    return result;
  } catch (error) {
    throw new Error('Error al cifrar los datos');
  }
}

/**
 * Descifra un texto usando AES-256-GCM
 * @param encryptedData - Datos cifrados en formato "iv:tag:encrypted"
 * @returns Texto descifrado
 */
export function decrypt(encryptedData: string): string {
  try {
    // Separar IV, tag y texto cifrado
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Formato de datos cifrados inválido');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    // Derivar la clave
    const key = deriveKey(ENCRYPTION_KEY);
    
    // Crear el decipher con GCM
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAAD(Buffer.from('siigo-credentials', 'utf8'));
    decipher.setAuthTag(tag);
    
    // Descifrar el texto
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('Error al descifrar los datos');
  }
}

/**
 * Verifica si una cadena está cifrada
 * @param text - Texto a verificar
 * @returns true si está cifrado, false si no
 */
export function isEncrypted(text: string): boolean {
  // Un texto cifrado tiene el formato "iv:tag:encrypted" (3 partes separadas por :)
  const parts = text.split(':');
  return parts.length === 3 && 
         parts[0].length === 24 && // IV en hex (12 bytes = 24 caracteres hex)
         parts[1].length === 32;   // Tag en hex (16 bytes = 32 caracteres hex)
}

/**
 * Cifra condicionalmente un texto (solo si no está ya cifrado)
 * @param text - Texto a cifrar
 * @returns Texto cifrado
 */
export function encryptIfNeeded(text: string): string {
  if (isEncrypted(text)) {
    return text; // Ya está cifrado
  }
  return encrypt(text);
}

/**
 * Descifra condicionalmente un texto (solo si está cifrado)
 * @param text - Texto a descifrar
 * @returns Texto descifrado o el texto original si no estaba cifrado
 */
export function decryptIfNeeded(text: string): string {
  if (isEncrypted(text)) {
    return decrypt(text);
  }
  return text; // No está cifrado, devolver tal como está
}