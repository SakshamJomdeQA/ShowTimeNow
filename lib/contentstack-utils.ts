import stack from './contentstack';

// Define proper types for Contentstack responses
interface ContentstackEntry {
  uid: string;
  title?: string;
  [key: string]: unknown;
}

interface ContentstackContentType {
  uid: string;
  title?: string;
  [key: string]: unknown;
}

interface ContentstackAsset {
  uid: string;
  title?: string;
  url?: string;
  [key: string]: unknown;
}

// Export the stack instance for direct use
export async function getEntry(contentTypeUid: string, entryUid: string, references?: string[]): Promise<ContentstackEntry | null> {
  if (!stack) {
    console.log('Contentstack not configured, returning null');
    return null;
  }
  try {
    const entry = stack.contentType(contentTypeUid).entry(entryUid);
    console.log(entry);
    if (references && references.length > 0) {
      entry.includeReference(...references);
    }
    return await entry.fetch();
  } catch (error) {
    console.error(`Error fetching entry ${entryUid}:`, error);
    return null;
  }
}

export async function getContentType(contentTypeUid: string): Promise<ContentstackContentType | null> {
  if (!stack) {
    console.log('Contentstack not configured, returning null');
    return null;
  }
  try {
    const contentType = stack.contentType(contentTypeUid);
    return await contentType.fetch();
  } catch (error) {
    console.error(`Error fetching content type ${contentTypeUid}:`, error);
    return null;
  }
}

export async function getAsset(assetUid: string): Promise<ContentstackAsset | null> {
  if (!stack) {
    console.log('Contentstack not configured, returning null');
    return null;
  }
  try {
    const asset = stack.asset(assetUid);
    return await asset.fetch();
  } catch (error) {
    console.error(`Error fetching asset ${assetUid}:`, error);
    return null;
  }
}

// Helper function to get the raw stack for custom operations
export function getStackInstance() {
  return stack;
}

// Helper function to check if Contentstack is configured
// export function isContentstackConfigured(): boolean {
//   return stack !== null;
// }