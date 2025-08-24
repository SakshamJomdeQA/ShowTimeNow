# 🎯 Contentstack Personalization Setup Guide

## **📋 Overview**
This guide explains how to set up age-based personalization in Contentstack for your family account system.

## **🏗️ Contentstack Content Types Setup**

### **1. Create Age-Based Content Types**

#### **Child Movies Content Type**
```
Content Type Name: child_movies
UID: child_movies

Fields:
- movie_name (Text)
- genre (Text) - Options: comedy, adventure, animation, family
- age_group (Text) - Default: "child"
- star_rating (Number) - Min: 1, Max: 5
- description (Rich Text)
- movie_image (Asset)
- content_rating (Text) - Options: G, PG
- themes (Text) - Options: friendship, learning, adventure
```

#### **Teen Movies Content Type**
```
Content Type Name: teen_movies
UID: teen_movies

Fields:
- movie_name (Text)
- genre (Text) - Options: action, sci-fi, fantasy, comedy, drama
- age_group (Text) - Default: "teen"
- star_rating (Number) - Min: 1, Max: 5
- description (Rich Text)
- movie_image (Asset)
- content_rating (Text) - Options: PG, PG-13
- themes (Text) - Options: coming-of-age, adventure, romance
```

#### **Adult Movies Content Type**
```
Content Type Name: adult_movies
UID: adult_movies

Fields:
- movie_name (Text)
- genre (Text) - Options: drama, thriller, romance, action, comedy
- age_group (Text) - Default: "adult"
- star_rating (Number) - Min: 1, Max: 5
- description (Rich Text)
- movie_image (Asset)
- content_rating (Text) - Options: PG-13, R, NC-17
- themes (Text) - Options: romance, suspense, drama
```

#### **Family Movies Content Type**
```
Content Type Name: family_movies
UID: family_movies

Fields:
- movie_name (Text)
- genre (Text) - Options: comedy, adventure, animation, musical
- age_group (Text) - Default: "family"
- star_rating (Number) - Min: 1, Max: 5
- description (Rich Text)
- movie_image (Asset)
- content_rating (Text) - Options: G, PG
- themes (Text) - Options: family, adventure, comedy
```

### **2. Create Personalization Rules Content Type**

```
Content Type Name: personalization_rules
UID: personalization_rules

Fields:
- rule_name (Text)
- age_group (Text) - Options: child, teen, adult, family
- allowed_genres (Text) - Multiple values
- restricted_content (Text) - Multiple values
- priority (Number) - Min: 1, Max: 10
- is_active (Boolean) - Default: true
```

### **3. Create User Profiles Content Type**

```
Content Type Name: user_profiles
UID: user_profiles

Fields:
- member_id (Text) - Unique identifier
- name (Text)
- age (Number)
- gender (Text) - Options: male, female
- role (Text) - Options: parent, child
- preferences (Text) - Multiple values
- viewing_history (Text) - Multiple values
- watchlist (Text) - Multiple values
- created_at (Date)
- updated_at (Date)
```

## **⚙️ Contentstack Personalization Configuration**

### **1. Environment Variables**
Add these to your `.env.local`:

```env
# Contentstack Personalization
CONTENTSTACK_PERSONALIZATION_ENABLED=true
CONTENTSTACK_AGE_FILTERING=true
CONTENTSTACK_STRICT_MODE=true

# Content Type UIDs
CONTENTSTACK_CHILD_CONTENT_UID=child_movies
CONTENTSTACK_TEEN_CONTENT_UID=teen_movies
CONTENTSTACK_ADULT_CONTENT_UID=adult_movies
CONTENTSTACK_FAMILY_CONTENT_UID=family_movies
```

### **2. Personalization Rules**

#### **Age-Based Filtering Rules**
```javascript
// Child (0-12 years)
- Allowed: child, family content
- Restricted: adult, teen content
- Genres: comedy, adventure, animation, family

// Teen (13-17 years)
- Allowed: teen, family content
- Restricted: adult content
- Genres: action, sci-fi, fantasy, comedy, drama

// Adult (18+ years)
- Allowed: all content
- Restricted: none
- Genres: all genres
```

#### **Content Rating Rules**
```javascript
// Child
- G, PG only

// Teen
- G, PG, PG-13

// Adult
- All ratings
```

## **🔧 Implementation Steps**

### **Step 1: Create Content Types in Contentstack**
1. Go to your Contentstack dashboard
2. Navigate to Content Types
3. Create the four content types listed above
4. Add sample content for each age group

### **Step 2: Configure Personalization Rules**
1. Create personalization rules content type
2. Add rules for each age group
3. Set up content filtering logic

### **Step 3: Update Your Code**
1. Update the `PERSONALIZATION_CONFIG` in `contentstack-personalization.ts`
2. Replace `'your_content_uid_here'` with actual UIDs
3. Test with different family member profiles

### **Step 4: Test Personalization**
1. Switch between family members
2. Verify age-appropriate content is shown
3. Check that preferences are respected

## **📊 Sample Content Structure**

### **Child Movies Example**
```json
{
  "movie_name": "The Little Adventure",
  "genre": "adventure",
  "age_group": "child",
  "star_rating": 4.5,
  "description": "A fun adventure for young children",
  "content_rating": "G",
  "themes": ["friendship", "adventure"]
}
```

### **Teen Movies Example**
```json
{
  "movie_name": "Sci-Fi Teen Quest",
  "genre": "sci-fi",
  "age_group": "teen",
  "star_rating": 4.2,
  "description": "An exciting sci-fi adventure for teens",
  "content_rating": "PG-13",
  "themes": ["coming-of-age", "adventure"]
}
```

### **Adult Movies Example**
```json
{
  "movie_name": "Drama Heights",
  "genre": "drama",
  "age_group": "adult",
  "star_rating": 4.6,
  "description": "A compelling drama for adult viewers",
  "content_rating": "R",
  "themes": ["romance", "drama"]
}
```

## **🎯 Personalization Features**

### **Age-Based Filtering**
- **Child (0-12)**: Only child and family content
- **Teen (13-17)**: Teen and family content
- **Adult (18+)**: All content

### **Preference Matching**
- Genre-based recommendations
- Theme-based filtering
- Rating-based restrictions

### **Content Relevance**
- Personalized reasons for recommendations
- Age-appropriate descriptions
- Family-friendly alternatives

## **🔍 Testing Your Setup**

### **Test Cases**
1. **John (45, Male)**: Should see adult content + action/drama
2. **Sarah (38, Female)**: Should see adult content + romance/comedy
3. **Mike (20, Male)**: Should see teen content + action/sci-fi
4. **Emma (16, Female)**: Should see teen content + romance/comedy

### **Verification Steps**
1. Check console logs for personalization requests
2. Verify age-appropriate content is filtered
3. Confirm preferences are respected
4. Test fallback content when Contentstack is unavailable

## **🚀 Advanced Features**

### **Dynamic Content Loading**
- Load content based on user selection
- Cache personalized results
- Real-time content updates

### **Analytics Integration**
- Track content consumption
- Monitor personalization effectiveness
- A/B test different rules

### **Machine Learning Integration**
- Learn from user behavior
- Improve recommendations over time
- Predictive content suggestions

## **📝 Next Steps**

1. **Create Content Types**: Set up the four content types in Contentstack
2. **Add Sample Content**: Populate with age-appropriate movies
3. **Test Personalization**: Verify filtering works correctly
4. **Monitor Performance**: Track personalization effectiveness
5. **Iterate**: Improve based on user feedback

This setup provides a robust foundation for age-based personalization using Contentstack's content management capabilities! 🎬 