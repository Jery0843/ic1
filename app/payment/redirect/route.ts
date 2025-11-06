import { NextRequest, NextResponse } from 'next/server';

// This route handles PhonePe's POST callback and redirects to the page with query params
export async function POST(request: NextRequest) {
  try {
    // Get the transaction ID from POST body or form data
    let merchantTransactionId = '';
    
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const body = await request.json();
      merchantTransactionId = body.merchantTransactionId || body.transactionId || '';
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      merchantTransactionId = formData.get('merchantTransactionId')?.toString() || 
                             formData.get('transactionId')?.toString() || '';
    }
    
    console.log('PhonePe redirect received, transaction ID:', merchantTransactionId);
    
    // Redirect to the callback page with query params
    const callbackUrl = new URL('/payment/callback', request.url);
    if (merchantTransactionId) {
      callbackUrl.searchParams.set('merchantTransactionId', merchantTransactionId);
    }
    
    return NextResponse.redirect(callbackUrl, 303); // 303 See Other - converts POST to GET
  } catch (error) {
    console.error('Payment redirect error:', error);
    // Redirect to callback page even on error
    const callbackUrl = new URL('/payment/callback', request.url);
    return NextResponse.redirect(callbackUrl, 303);
  }
}

// Also handle GET in case PhonePe uses GET mode
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const merchantTransactionId = searchParams.get('merchantTransactionId') || searchParams.get('transactionId');
  
  const callbackUrl = new URL('/payment/callback', request.url);
  if (merchantTransactionId) {
    callbackUrl.searchParams.set('merchantTransactionId', merchantTransactionId);
  }
  
  return NextResponse.redirect(callbackUrl, 303);
}
