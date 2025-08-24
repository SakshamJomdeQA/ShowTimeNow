import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Checking environment variables');
    
    const envVars = {
      NEXT_PUBLIC_CONTENTSTACK_API_KEY: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
      NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
      NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
      CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY,
      CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN,
      CONTENTSTACK_ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT
    };
    
    console.log('🔑 Environment variables:', envVars);
    
    return NextResponse.json({
      success: true,
      environmentVariables: envVars
    });

  } catch (error) {
    console.error('❌ Environment test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 