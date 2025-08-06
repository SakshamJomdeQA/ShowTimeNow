// lib/contentstack.ts
import contentstack ,{ Region } from '@contentstack/delivery-sdk';

const stack = contentstack.stack({
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
  region: Region.US,
});

export default stack;