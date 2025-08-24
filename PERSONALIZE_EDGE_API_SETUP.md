# 🎯 Contentstack Personalize Edge API Setup Guide

## **📋 Overview**
This guide explains how to set up Contentstack's Personalize Edge API for age-based personalization using custom attributes, audiences, and rules.

## **🔧 Step-by-Step Setup**

### **Step 1: Access Contentstack Personalize Dashboard**

1. **Login** to your Contentstack account
2. **Navigate** to Personalize section
3. **Enable** Personalize Edge API for your stack

### **Step 2: Create Custom Attributes**

#### **2.1 Create Age Attribute**
```
1. Go to Personalize → Custom Attributes
2. Click "Create Custom Attribute"
3. Name: "age"
4. Type: Number
5. Description: "User age for content filtering"
6. Save Attribute
```

#### **2.2 Create Genre Attribute**
```
1. Go to Personalize → Custom Attributes
2. Click "Create Custom Attribute"
3. Name: "genre"
4. Type: Text
5. Description: "User genre preferences"
6. Save Attribute
```

### **Step 3: Create Audiences**

#### **3.1 Create Adult Movies Audience**
```
1. Go to Personalize → Audiences
2. Click "Create Audience"
3. Name: "adult_movies"
4. Description: "Adult audience for mature content"
5. Rules:
   - Custom Attribute: age
   - Operator: Greater than or equal to
   - Value: 18
6. Save Audience
```

#### **3.2 Create Teen Movies Audience**
```
1. Go to Personalize → Audiences
2. Click "Create Audience"
3. Name: "teen_movies"
4. Description: "Teen audience for age-appropriate content"
5. Rules:
   - Custom Attribute: age
   - Operator: Between
   - Value: 13 to 17
6. Save Audience
```

#### **3.3 Create Child Movies Audience**
```
1. Go to Personalize → Audiences
2. Click "Create Audience"
3. Name: "child_movies"
4. Description: "Child audience for family content"
5. Rules:
   - Custom Attribute: age
   - Operator: Less than
   - Value: 13
6. Save Audience
```

### **Step 4: Create Content Entries with Variants**

#### **4.1 Create Movies Content Type**
```
1. Go to Content Types
2. Create "Movies" content type
3. Add fields:
   - movie_name (Text)
   - genre (Text)
   - age_group (Text)
   - star_rating (Number)
   - description (Rich Text)
   - movie_image (Asset)
4. Save Content Type
```

#### **4.2 Create Movie Entries**
```
1. Go to Content → Movies
2. Create entries for each age group:

   **Adult Movies Entry:**
   - Entry ID: (copy this ID)
   - Movie Name: "Drama Heights"
   - Genre: "drama"
   - Age Group: "adult"
   - Star Rating: 4.6
   - Description: "A compelling drama for adult viewers"

   **Teen Movies Entry:**
   - Entry ID: (copy this ID)
   - Movie Name: "Sci-Fi Teen Quest"
   - Genre: "sci-fi"
   - Age Group: "teen"
   - Star Rating: 4.2
   - Description: "An exciting sci-fi adventure for teens"

   **Child Movies Entry:**
   - Entry ID: (copy this ID)
   - Movie Name: "The Little Adventure"
   - Genre: "adventure"
   - Age Group: "child"
   - Star Rating: 4.5
   - Description: "A fun adventure for young children"
```

### **Step 5: Create Personalization Variants**

#### **5.1 Create Variants for Each Entry**
```
1. Go to Personalize → Variants
2. For each movie entry, create variants:

   **Adult Movies Variant:**
   - Entry: (select adult movies entry)
   - Variant Name: "adult_movies_variant"
   - Audience: adult_movies
   - Content: (same as entry)
   - Variant ID: (copy this ID)

   **Teen Movies Variant:**
   - Entry: (select teen movies entry)
   - Variant Name: "teen_movies_variant"
   - Audience: teen_movies
   - Content: (same as entry)
   - Variant ID: (copy this ID)

   **Child Movies Variant:**
   - Entry: (select child movies entry)
   - Variant Name: "child_movies_variant"
   - Audience: child_movies
   - Content: (same as entry)
   - Variant ID: (copy this ID)
```

### **Step 6: Get API Credentials**

#### **6.1 Get Personalize API Key**
```
1. Go to Personalize → Settings
2. Copy your Personalize API Key
3. Note your Environment name
4. Note your Region (us, eu, etc.)
```

### **Step 7: Configure Environment Variables**

#### **7.1 Create .env.local File**
```env
# Contentstack Personalize Edge API Configuration
CONTENTSTACK_PERSONALIZE_API_KEY=your_personalize_api_key_here
CONTENTSTACK_PERSONALIZE_ENVIRONMENT=your_environment_name
CONTENTSTACK_PERSONALIZE_REGION=us

# Content Type ID for Movies
CONTENTSTACK_MOVIES_CONTENT_TYPE_ID=your_movies_content_type_id

# Personalization Variant IDs
CONTENTSTACK_ADULT_MOVIES_VARIANT_ID=your_adult_movies_variant_id
CONTENTSTACK_TEEN_MOVIES_VARIANT_ID=your_teen_movies_variant_id
CONTENTSTACK_CHILD_MOVIES_VARIANT_ID=your_child_movies_variant_id

# Entry IDs for Different Age Groups
CONTENTSTACK_ADULT_MOVIES_ENTRY_ID=your_adult_movies_entry_id
CONTENTSTACK_TEEN_MOVIES_ENTRY_ID=your_teen_movies_entry_id
CONTENTSTACK_CHILD_MOVIES_ENTRY_ID=your_child_movies_entry_id
```

### **Step 8: Test Personalization**

#### **8.1 Test API Endpoints**
```bash
# Test personalized content for adult
curl -X POST "https://personalize.contentstack.com/v1/entries/{entryId}/variants/{variantId}" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customAttributes": {
      "age": 25,
      "genre": "drama,action",
      "gender": "male"
    },
    "userId": "user123"
  }'
```

#### **8.2 Test Family Member Switching**
```
1. Start your app: npm run dev
2. Go to homepage
3. Switch between family members:
   - John (45) → Should get adult content
   - Sarah (38) → Should get adult content
   - Mike (20) → Should get teen content
   - Emma (16) → Should get teen content
```

## **🎯 API Usage Examples**

### **Example 1: Get Personalized Content**
```javascript
// Using the Personalize Edge API
const personalizedContent = await personalizeAPI.getPersonalizedContent(
  entryId,           // Your entry ID
  variantId,         // Your variant ID
  {
    age: 25,         // Custom attribute
    genre: "drama,action", // Custom attribute
    gender: "male"
  },
  "user123",         // User ID
  "session_123"      // Session ID
);
```

### **Example 2: Get All Variants**
```javascript
// Get all variants for an entry
const variants = await personalizeAPI.getEntryVariants(entryId);
console.log('Available variants:', variants);
```

### **Example 3: Get Audiences**
```javascript
// Get all audiences
const audiences = await personalizeAPI.getAudiences();
console.log('Available audiences:', audiences);
```

## **🔍 Troubleshooting**

### **Common Issues:**

#### **1. "API Key Invalid"**
```
Solution:
- Check your Personalize API key
- Verify environment name
- Ensure Personalize is enabled for your stack
```

#### **2. "Entry Not Found"**
```
Solution:
- Verify entry IDs are correct
- Check if entries are published
- Ensure content type exists
```

#### **3. "Variant Not Found"**
```
Solution:
- Verify variant IDs are correct
- Check if variants are published
- Ensure audience rules are set up
```

#### **4. "No Personalized Content"**
```
Solution:
- Check custom attributes match audience rules
- Verify audience targeting is working
- Test with different user profiles
```

### **Debug Steps:**
1. **Check Console Logs**: Look for API request/response logs
2. **Verify Environment Variables**: Ensure all IDs are correct
3. **Test API Directly**: Use curl or Postman to test endpoints
4. **Check Personalize Dashboard**: Verify audiences and variants

## **📊 Monitoring & Analytics**

### **Track Personalization Performance:**
1. **Monitor API Calls**: Track request/response times
2. **Audience Matching**: See which audiences are being matched
3. **Content Performance**: Track which variants perform better
4. **User Engagement**: Monitor user interaction with personalized content

## **🚀 Next Steps**

### **Advanced Features:**
1. **Real-time Personalization**: Update content based on user behavior
2. **A/B Testing**: Test different content variants
3. **Machine Learning**: Use ML for better recommendations
4. **Analytics Integration**: Track personalization effectiveness

### **Optimization:**
1. **Caching**: Cache personalized content for better performance
2. **CDN**: Use CDN for global content delivery
3. **Rate Limiting**: Implement proper rate limiting
4. **Error Handling**: Add comprehensive error handling

This setup provides a complete personalization solution using Contentstack's Personalize Edge API! 🎯 