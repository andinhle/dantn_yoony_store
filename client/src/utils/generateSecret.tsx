import * as OTPAuth from "otpauth";
import { IUser } from '../intrefaces/IUser';

export const generateSecret = ({name,email}:IUser) => {
    const totp = new OTPAuth.TOTP({
        issuer: name,
        label: email,
        algorithm: 'SHA-1',
        digits: 6,
    });
    
      // Generate a new secret
      const secret = totp.secret.base32;
      return {
        secret,
      };
}

