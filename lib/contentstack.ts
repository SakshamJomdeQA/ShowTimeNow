// lib/contentstack.ts
import contentstack ,{ Region } from '@contentstack/delivery-sdk';
import Personalize from '@contentstack/personalize-edge-sdk';
const projectUid = '68946bbedbc98afa6b4150c4';
// Using async-await:
const personalizeSdk = await Personalize.init(projectUid);

const stack = contentstack.stack({
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
  region: Region.US,
});

export default stack;
export { personalizeSdk };