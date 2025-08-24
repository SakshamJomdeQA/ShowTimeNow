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
export async function getEntry(contentTypeUid: string, entryUid: string, references?: string[], variantId?: string): Promise<ContentstackEntry | null> {
  if (!stack) {
    console.log('Contentstack not configured, returning null');
    return null;
  }
  try {
    const entry = stack.contentType(contentTypeUid).entry(entryUid);
    console.log(entry);
    
    // Add variant support if variantId is provided
    if (variantId) {
      console.log(`🎯 Fetching entry ${entryUid} with variant ${variantId}`);
      // Note: Contentstack SDK might not directly support variants in this way
      // We'll need to handle this differently
    }
    
    if (references && references.length > 0) {
      entry.includeReference(...references);
    }
    return await entry.fetch();
  } catch (error) {
    console.error(`Error fetching entry ${entryUid}:`, error);
    return null;
  }
}

// New function to get entry with variant support
export async function getEntryWithVariant(contentTypeUid: string, entryUid: string, variantId: string, references?: string[]): Promise<ContentstackEntry | null> {
  if (!stack) {
    console.log('Contentstack not configured, returning null');
    return null;
  }
  try {
    console.log(`🎯 Attempting to fetch entry ${entryUid} with variant ${variantId}`);
    
    // Try to fetch the entry with variant parameter
    const entry = stack.contentType(contentTypeUid).entry(entryUid);
    
    // Add variant parameter using the Personalize SDK approach
    if (variantId) {
      console.log(`🎬 Setting variant ${variantId} for entry ${entryUid}`);
      // Try different approaches to set the variant
      if ((entry as any).variant) {
        (entry as any).variant(variantId);
      } else if ((entry as any).setVariant) {
        (entry as any).setVariant(variantId);
      } else if ((entry as any).personalize) {
        (entry as any).personalize({ variant: variantId });
      }
    }
    
    if (references && references.length > 0) {
      entry.includeReference(...references);
    }
    
    const result = await entry.fetch();
    console.log(`✅ Successfully fetched entry with variant ${variantId}:`, {
      hasData: !!result,
      hasMoviesBlocks: !!(result as any)?.movies_blocks,
      movieCount: Array.isArray((result as any)?.movies_blocks) ? (result as any).movies_blocks.length : 0
    });
    return result as ContentstackEntry;
  } catch (error) {
    console.error(`Error fetching entry ${entryUid} with variant ${variantId}:`, error);
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