# Admin Analytics - Real Data Integration

## What Was Changed

The admin dashboard stats cards now fetch **real data from Firestore** instead of showing hardcoded values.

---

## Stats Displayed

### 1. 👥 Active Users
**What it shows:**
- Total number of registered users in the system
- Growth percentage compared to previous 30 days

**How it's calculated:**
- Counts all documents in the `users` collection
- Compares users created in last 30 days vs previous 30 days
- Formula: `((recent - previous) / previous) * 100`

**Future enhancement:**
- Track `lastLoginAt` field to show truly "active" users (logged in within 30 days)

---

### 2. 📱 Monthly Bookings
**What it shows:**
- Number of bookings/consultations in the last 30 days
- Growth percentage compared to previous 30 days

**How it's calculated:**
- Counts documents in `bookings` collection created in last 30 days
- Compares with bookings from 30-60 days ago
- Formula: `((thisMonth - lastMonth) / lastMonth) * 100`

---

### 3. ✅ Completed Sessions
**What it shows:**
- Number of sessions marked as "completed"
- Growth percentage compared to previous 30 days

**How it's calculated:**
- Counts documents in `sessions` collection with `status === 'completed'`
- Compares completed sessions in last 30 days vs previous 30 days
- Formula: `((recent - previous) / previous) * 100`

---

### 4. 💰 Revenue
**What it shows:**
- Estimated revenue based on monthly bookings
- Growth percentage compared to previous 30 days

**How it's calculated:**
- `revenue = monthlyBookings * averageBookingPrice`
- Currently uses $50 as average booking price (mock value)
- Compares with previous month's revenue
- Formula: `((thisMonth - lastMonth) / lastMonth) * 100`

**Future enhancement:**
- Add actual pricing data to bookings
- Track real payment amounts
- Integrate with payment gateway (Stripe, PayPal, etc.)

---

## Files Modified

### 1. `lib/firestore.ts`
**Added:**
- `AdminStats` interface
- `getAdminStats()` function

**Function details:**
```typescript
export async function getAdminStats(): Promise<AdminStats> {
  // Fetches:
  // - Total users and user growth
  // - Monthly bookings and booking growth
  // - Completed sessions and session growth
  // - Revenue and revenue growth
  
  // Returns default values (all zeros) if error occurs
}
```

---

### 2. `components/admin/StatsCards.tsx`
**Changes:**
- Removed hardcoded stats array
- Added `useState` and `useEffect` for data fetching
- Added loading state with skeleton UI
- Added number formatting functions
- Fetches real data from Firestore on component mount

**New features:**
- Loading skeleton while fetching data
- Automatic number formatting (1000 → 1K, 1000000 → 1M)
- Automatic currency formatting ($1000 → $1K)
- Dynamic growth percentage display
- Red/green colors based on positive/negative growth

---

## Data Flow

```
Component Mount
    ↓
useEffect triggers
    ↓
Call getAdminStats()
    ↓
Query Firestore collections:
  - users (total count, recent count)
  - bookings (monthly count, previous count)
  - sessions (completed count, recent completed)
    ↓
Calculate growth percentages
    ↓
Return AdminStats object
    ↓
Update component state
    ↓
Display real data in cards
```

---

## Firestore Collections Used

### 1. `users` Collection
**Fields used:**
- `createdAt` - To calculate user growth

**Queries:**
- Total users: All documents
- Recent users: `createdAt >= 30 days ago`
- Previous users: `createdAt between 60-30 days ago`

---

### 2. `bookings` Collection
**Fields used:**
- `createdAt` - To calculate monthly bookings

**Queries:**
- Monthly bookings: `createdAt >= 30 days ago`
- Previous bookings: `createdAt between 60-30 days ago`

**Note:** This collection may not exist yet. Create it when implementing booking functionality.

---

### 3. `sessions` Collection
**Fields used:**
- `status` - To filter completed sessions
- `updatedAt` - To calculate recent completions

**Queries:**
- Total completed: `status === 'completed'`
- Recent completed: `status === 'completed' AND updatedAt >= 30 days ago`
- Previous completed: `status === 'completed' AND updatedAt between 60-30 days ago`

---

## Number Formatting

### formatNumber()
```typescript
1,234 → "1.2K"
12,345 → "12.3K"
1,234,567 → "1.2M"
```

### formatCurrency()
```typescript
1,234 → "$1.2K"
12,345 → "$12.3K"
1,234,567 → "$1.2M"
```

### formatChange()
```typescript
12 → "+12%"
-5 → "-5%"
0 → "+0%"
```

---

## Loading State

While data is being fetched:
- Stat values show gray skeleton boxes with pulse animation
- Growth percentages show gray skeleton boxes
- Progress bars animate to 50% width
- Prevents layout shift

---

## Error Handling

If Firestore query fails:
- Returns default values (all zeros)
- Logs error to console
- Shows "0" values in UI instead of crashing
- User can refresh page to retry

---

## Growth Calculation

**Formula:**
```typescript
growth = ((current - previous) / previous) * 100
```

**Examples:**
- Current: 100, Previous: 80 → Growth: +25%
- Current: 80, Previous: 100 → Growth: -20%
- Current: 100, Previous: 0 → Growth: +100%

**Edge cases:**
- If previous is 0, growth is set to 100%
- If current is 0, growth is negative
- Rounded to nearest integer

---

## Color Coding

**Positive growth (green):**
- Growth >= 0%
- Green text: `text-green-600`
- Green progress bar: `bg-green-500`

**Negative growth (red):**
- Growth < 0%
- Red text: `text-red-600`
- Red progress bar: `bg-red-500`

---

## Testing

### Test with Empty Database
1. Go to admin panel
2. Stats should show:
   - Active Users: 0
   - Monthly Bookings: 0
   - Completed Sessions: 0
   - Revenue: $0
   - All growth: +0%

### Test with Real Data
1. Create some users via signup
2. Create some sessions via admin panel
3. Mark some sessions as "completed"
4. Refresh admin panel
5. Stats should update with real numbers

### Test Growth Calculation
1. Note current stats
2. Create more users/bookings/sessions
3. Wait 30 days (or manually adjust `createdAt` in Firestore)
4. Check if growth percentage updates

---

## Future Enhancements

### 1. Real-time Updates
- Use Firestore `onSnapshot` for live updates
- Stats update automatically when data changes
- No need to refresh page

### 2. Date Range Selector
- Allow admin to select custom date ranges
- "Last 7 days", "Last 30 days", "Last 90 days", "Custom"
- Update stats based on selected range

### 3. Charts and Graphs
- Line chart showing user growth over time
- Bar chart showing bookings per month
- Pie chart showing session categories
- Revenue trend graph

### 4. Export Data
- Export stats to CSV
- Export stats to PDF report
- Email weekly/monthly reports

### 5. More Metrics
- Average session rating
- User retention rate
- Conversion rate (signups → bookings)
- Most popular session categories
- Peak booking times
- User demographics

### 6. Real Revenue Tracking
- Integrate with payment gateway
- Track actual payment amounts
- Show revenue by payment method
- Show refunds and cancellations

### 7. Comparison Views
- Compare this month vs last month
- Compare this year vs last year
- Show year-over-year growth

---

## Firestore Indexes Required

For optimal performance, create these indexes:

### 1. Users by createdAt
```json
{
  "collectionGroup": "users",
  "fields": [
    { "fieldPath": "createdAt", "order": "ASCENDING" }
  ]
}
```

### 2. Bookings by createdAt
```json
{
  "collectionGroup": "bookings",
  "fields": [
    { "fieldPath": "createdAt", "order": "ASCENDING" }
  ]
}
```

### 3. Sessions by status and updatedAt
```json
{
  "collectionGroup": "sessions",
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "updatedAt", "order": "ASCENDING" }
  ]
}
```

**Note:** These indexes will be created automatically when you first run the queries. Firebase will provide URLs to create them.

---

## Performance Considerations

**Current approach:**
- Fetches all data on component mount
- Calculates stats on client side
- May be slow with large datasets (10,000+ users)

**Optimization options:**
1. **Server-side calculation:**
   - Create API route `/api/admin/stats`
   - Calculate stats on server
   - Cache results for 5-10 minutes

2. **Firestore aggregation:**
   - Use Firestore count() queries (when available)
   - Pre-calculate stats in a separate collection
   - Update stats via Cloud Functions on data changes

3. **Pagination:**
   - Don't count all documents
   - Use sampling for large collections
   - Show approximate counts

---

## Summary

**What works now:**
- ✅ Real data from Firestore
- ✅ User count and growth
- ✅ Monthly bookings and growth
- ✅ Completed sessions and growth
- ✅ Revenue calculation and growth
- ✅ Loading states
- ✅ Error handling
- ✅ Number formatting
- ✅ Color-coded growth indicators

**What's coming:**
- ⏳ Real-time updates
- ⏳ Date range selector
- ⏳ Charts and graphs
- ⏳ Export functionality
- ⏳ More detailed metrics
- ⏳ Real revenue tracking

**Files modified:**
- `lib/firestore.ts` - Added `getAdminStats()` function
- `components/admin/StatsCards.tsx` - Fetch and display real data

**Status:** ✅ Fully functional with real Firestore data

