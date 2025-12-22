import * as OTPAuth from 'otpauth';

export const generateToken = (secret, issuer = 'App') => {
  try {
    // Limpiamos el secreto de espacios en blanco por si acaso
    const cleanSecret = secret.replace(/\s/g, '');
    
    // Configuración estándar (igual a Google Authenticator)
    let totp = new OTPAuth.TOTP({
      issuer: issuer,
      label: 'AuthVaultUser',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(cleanSecret)
    });
    
    return {
      code: totp.generate(),
      isValid: true
    };
  } catch (error) {
    console.log(error);
    return { code: 'ERROR', isValid: false };
  }
};