import {randomInt} from "crypto"

export const generateOTP = (length: number) : string => {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = randomInt(0, digits.length);
        otp += digits[randomIndex];
    }

    return otp;
}