# Optimized Loading Implementation Examples

## Example 1: Family Recipes Page

### What We Changed:

#### 1. Added Route-Specific Loading (`optimized-init.ts`)
```typescript
'/family/recipes': async () => {
    // Family recipes - load family data (needed for family recipes)
    const familyData = await fetch(`${urlToUse}/api/family/get`);
    const familyDataJson = await familyData.json();
    if (familyDataJson?.family) {
        useFamilyStore.getState().setFamily(familyDataJson.family);
    }
},
```

**Why?** Now when user navigates to `/family/recipes`, only the family data loads during Phase 2 (page-specific). Fast and targeted!

#### 2. Added Safety Skeleton (`family-recipes.tsx`)
```typescript
// Show skeleton while userInfo is loading
if (!userInfo) {
    return (
        <div className="flex flex-col space-y-4 p-4">
            <Skeleton height={50} radius="md" />
            <Skeleton height={200} radius="md" />
            <Skeleton height={150} radius="md" />
        </div>
    );
}
```

**Why?** If data hasn't loaded yet (rare, but possible), show skeleton instead of crashing or blank screen.

#### 3. Enhanced Loading Check
```typescript
useEffect(() => {
    // Check both userInfo AND famRecipeTitles before turning off loading
    if (userInfo && famRecipeTitles !== undefined) {
        setGlobalLoading(false);
    }
}, [userInfo, famRecipeTitles, setGlobalLoading]);
```

**Why?** Wait for component to actually have the data it needs, not just userInfo.

---

## Example 2: Header Menu (Complex)

### What We Changed:

#### 1. Added useEnsureData Hook
```typescript
import { useEnsureData } from "@/components/hooks/data/useEnsureData";

// Inside component:
const { ensureReady: ensureIngredients, isLoading: loadingIngredients } = useEnsureData('ingredients');
const [isPreparingModal, setIsPreparingModal] = useState(false);
```

**Why?** Recipe creation modal needs ingredients list. This hook ensures they're loaded before opening.

#### 2. Created Smart Handler
```typescript
const handleOpenRecipeModal = async () => {
    setIsPreparingModal(true);
    try {
        // Ensure ingredients are loaded (fast if already in cache)
        await ensureIngredients();
        setOpenCreateRecipeModal(true);
    } catch (error) {
        console.error('Error loading ingredients:', error);
        toast.error('Failed to load recipe data. Please try again.');
    } finally {
        setIsPreparingModal(false);
    }
};
```

**Why?** 
- Loads ingredients on-demand (not on page load)
- Shows loading state while fetching
- Handles errors gracefully
- Fast if already loaded (returns immediately from cache)

#### 3. Enhanced Menu Item
```typescript
<Menu.Item
    onClick={handleOpenRecipeModal}
    disabled={isPreparingModal || loadingIngredients}
    pb={'sm'}
>
    {isPreparingModal || loadingIngredients ? 'Loading...' : 'Create Recipe'}
</Menu.Item>
```

**Why?**
- User sees "Loading..." text while ingredients fetch
- Button disabled during loading (prevents double-click)
- Clear feedback that something is happening

---

## Performance Comparison

### Before Optimization:
```
Page Load Timeline:
├─ 0ms: User clicks "Family Recipes" link
├─ 0ms: Loading overlay shows
├─ 0-500ms: Fetch ALL data (user, family, recipes, ingredients, suggestions)
├─ 500-2000ms: Wait for everything to complete
└─ 2000ms: Page shows, loading overlay hides
```
**Total wait time: ~2 seconds** 😴

### After Optimization:
```
Page Load Timeline:
├─ 0ms: User clicks "Family Recipes" link
├─ 0ms: Loading overlay shows
├─ 0-200ms: Fetch user info (Phase 1 - already cached after first load)
├─ 200-500ms: Fetch family data (Phase 2 - page-specific)
├─ 500ms: Page shows with skeleton
├─ 600ms: Data renders, loading overlay hides
└─ 1000ms+: Background prefetch (suggestions, ingredients) - silent
```
**Total wait time: ~0.6 seconds** ⚡

---

## Recipe Modal Optimization

### Before:
```
Timeline:
├─ User clicks "Create Recipe"
├─ Modal opens immediately
├─ User fills out form
├─ User clicks "Add Ingredient" dropdown
├─ Error! Ingredients not loaded yet
└─ User confused, modal broken
```

### After:
```
Timeline:
├─ User clicks "Create Recipe"
├─ Button shows "Loading..." (if ingredients not cached)
├─ 0-300ms: Ingredients fetch (only if needed)
├─ Modal opens with ingredients ready
├─ User fills out form successfully
└─ Happy user! ✅
```

---

## Key Patterns Used

### Pattern 1: Route-Specific Loading
**When:** Data is critical for a specific page  
**Where:** Add to `initPageData` in `optimized-init.ts`  
**Benefit:** Fast, targeted loading

### Pattern 2: Skeleton Fallback
**When:** Component might render before data loads  
**Where:** Add early return with skeleton in component  
**Benefit:** Never show broken UI

### Pattern 3: On-Demand Loading
**When:** Data needed for user action (modal, form, etc.)  
**Where:** Use `useEnsureData` hook with `ensureReady()`  
**Benefit:** Load only what's needed, when needed

### Pattern 4: Background Prefetch
**When:** Data will likely be needed soon  
**Where:** Automatic in Phase 3 via `prefetchRemainingData`  
**Benefit:** Feels instant when user navigates

---

## How to Apply to Other Pages

### Step 1: Identify Critical Data
Ask: "What data does this page NEED to render?"
- Family Recipes: userInfo + family data
- Recipe Creation: userInfo + ingredients
- Profile Settings: userInfo only

### Step 2: Add Route to initPageData
```typescript
'/your-route': async () => {
    // Load only critical data
    const data = await fetch(`${urlToUse}/api/your-endpoint`);
    // Store in Zustand
},
```

### Step 3: Add Safety Checks
```typescript
if (!criticalData) {
    return <Skeleton />;
}
```

### Step 4: For Modals/Actions
```typescript
const { ensureReady } = useEnsureData('dataType');

const handleAction = async () => {
    await ensureReady();
    // Now safe to proceed
};
```

---

## Testing Checklist

✅ **Initial Load**
- [ ] Page loads in under 1 second
- [ ] No blank screens or errors
- [ ] Loading overlay shows/hides smoothly

✅ **Navigation Between Pages**
- [ ] Loading overlay appears on click
- [ ] Transitions feel fast
- [ ] No data errors after navigation

✅ **Modals/Actions**
- [ ] Recipe modal opens with ingredients ready
- [ ] Family modal doesn't error
- [ ] Loading states show for slow connections

✅ **Error Cases**
- [ ] Network failure shows error toast
- [ ] Retry works correctly
- [ ] User can navigate away after error

---

## Common Issues & Solutions

### Issue: "Data not available when expected"
```typescript
// Solution: Use ensureReady before accessing
const { ensureReady } = useEnsureData('yourData');
await ensureReady();
// Now safe to use data
```

### Issue: "Loading overlay stuck"
```typescript
// Solution: Add timeout fallback in component
useEffect(() => {
    const timer = setTimeout(() => {
        setGlobalLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
}, []);
```

### Issue: "Skeleton flashes too fast"
```typescript
// Solution: Add minimum display time
const [showSkeleton, setShowSkeleton] = useState(true);
useEffect(() => {
    if (dataReady) {
        setTimeout(() => setShowSkeleton(false), 300);
    }
}, [dataReady]);
```

---

## Next Steps

1. ✅ **Test family-recipes page** - Navigate from different pages, refresh, etc.
2. ✅ **Test recipe creation** - Click "Create Recipe" and verify ingredients load
3. 🔄 **Apply to other pages** - Use same patterns for members, settings, profile
4. 🔄 **Monitor performance** - Check Network tab in DevTools
5. 🔄 **Gather user feedback** - Does it feel faster?

---

## Performance Metrics to Track

Monitor these in production:
- **Time to Interactive (TTI)**: Should be < 1 second
- **First Contentful Paint (FCP)**: Should be < 500ms
- **Data fetch count**: Should decrease (fewer parallel requests)
- **Cache hit rate**: Should increase (reusing loaded data)

Use Vercel Analytics or similar to track real user metrics!
