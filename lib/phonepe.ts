import crypto from 'crypto';
import axios from 'axios';

// PhonePe Configuration
const PHONEPE_CONFIG = {
  merchantId: process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT86',
  saltKey: process.env.PHONEPE_SALT_KEY || '96434309-7796-489d-8924-ab56988a6076',
  saltIndex: '1',
  apiUrl: process.env.PHONEPE_API_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox',
  // Use NEXT_PUBLIC_APP_URL from env, or default to production URL on Vercel, or localhost for dev
  redirectUrl: process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/payment/redirect`
    : (process.env.VERCEL ? 'https://ic-phi.vercel.app/payment/redirect' : 'http://localhost:3000/payment/redirect'),
  callbackUrl: process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`
    : (process.env.VERCEL ? 'https://ic-phi.vercel.app/api/payment/callback' : 'http://localhost:3000/api/payment/callback'),
};

// Generate X-VERIFY header for PhonePe API
export function generateXVerify(payload: string): string {
  const dataToHash = payload + '/pg/v1/pay' + PHONEPE_CONFIG.saltKey;
  const sha256Hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  return `${sha256Hash}###${PHONEPE_CONFIG.saltIndex}`;
}

// Generate X-VERIFY for status check
export function generateXVerifyForStatus(merchantTransactionId: string): string {
  const dataToHash = `/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${merchantTransactionId}` + PHONEPE_CONFIG.saltKey;
  const sha256Hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  return `${sha256Hash}###${PHONEPE_CONFIG.saltIndex}`;
}

// Create payment request
export interface PaymentRequest {
  amount: number; // in paise (multiply by 100)
  merchantTransactionId: string;
  merchantUserId: string;
  mobileNumber?: string;
  email?: string;
  name?: string;
}

export async function initiatePayment(paymentData: PaymentRequest) {
  try {
    const payload = {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId: paymentData.merchantTransactionId,
      merchantUserId: paymentData.merchantUserId,
      amount: paymentData.amount,
      redirectUrl: PHONEPE_CONFIG.redirectUrl,
      redirectMode: 'POST',
      callbackUrl: PHONEPE_CONFIG.callbackUrl,
      mobileNumber: paymentData.mobileNumber || '',
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    // Base64 encode the payload
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    
    // Generate X-VERIFY header
    const xVerify = generateXVerify(base64Payload);

    // Make API request
    const response = await axios.post(
      `${PHONEPE_CONFIG.apiUrl}/pg/v1/pay`,
      {
        request: base64Payload,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('PhonePe payment initiation error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Payment initiation failed');
  }
}

// Check payment status
export async function checkPaymentStatus(merchantTransactionId: string) {
  try {
    const xVerify = generateXVerifyForStatus(merchantTransactionId);

    const response = await axios.get(
      `${PHONEPE_CONFIG.apiUrl}/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${merchantTransactionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('PhonePe status check error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Status check failed');
  }
}

export { PHONEPE_CONFIG };
