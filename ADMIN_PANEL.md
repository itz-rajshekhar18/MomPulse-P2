# MomPulse Admin Panel Documentation

## Overview

The MomPulse Admin Panel is a comprehensive dashboard for managing the maternal health platform. It provides administrators with tools to monitor users, manage doctors, track consultations, and analyze platform metrics.

## 🎯 Features

### Dashboard Overview
- **Real-time Statistics**: Active users, monthly bookings, completed sessions, and revenue
- **Trend Indicators**: Percentage changes with visual progress bars
- **Quick Actions**: Schedule sessions and add new doctors

### Doctor Management
- **Doctor List**: View all registered healthcare providers
- **Status Tracking**: Monitor doctor availability (Active/Away)
- **Quick Edit**: Edit doctor profiles and specialties
- **Specialty Filtering**: OB-GYN, Pediatrician, Lactation Consultant, etc.

### Upcoming Consultations
- **Consultation Calendar**: View scheduled appointments
- **Session Types**: Video calls and chat sessions
- **Doctor Assignment**: See which doctor is assigned to each consultation
- **Time Management**: Track consultation times and dates

### Analytics (Coming Soon)
- User engagement metrics
- Revenue analytics
- Booking trends
- Doctor performance metrics

## 📁 File Structure

```
app/
  admin/
    page.tsx                          # Main admin dashboard page

components/
  admin/
    AdminSidebar.tsx                  # Left sidebar navigation
    AdminHeader.tsx                   # Top header with search and profile
    StatsCards.tsx                    # Statistics cards component
    DoctorManagement.tsx              # Doctor list and management
    UpcomingConsultations.tsx         # Consultation calendar widget
```

## 🚀 Getting Started

### Accessing the Admin Panel

1. **Navigate to Admin URL**
   ```
   http://localhost:3000/admin
   ```

2. **Authentication Required**
   - Must be logged in with admin credentials
   - Regular users will be redirected to dashboard (when role check is implemented)

### Admin Role Setup

To enable admin role checking, update the user profile in Firestore:

```typescript
// In lib/firestore.ts - UserProfile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role?: 'user' | 'admin' | 'doctor';  // Add this field
  // ... other fields
}
```

Then uncomment the role check in `app/admin/page.tsx`:

```typescript
// Uncomment these lines:
if (profile?.role !== 'admin') {
  router.push('/dashboard');
  return;
}
```

## 🎨 Components

### 1. AdminSidebar

**Purpose**: Navigation menu for admin panel

**Features**:
- Active tab highlighting
- Icon-based navigation
- Support and logout buttons
- Responsive design

**Props**:
```typescript
interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
```

**Menu Items**:
- 📊 Overview
- 👨‍⚕️ Doctors
- 📅 Sessions
- 📝 Bookings
- 📈 Analytics

### 2. AdminHeader

**Purpose**: Top navigation bar with search and profile

**Features**:
- Global search functionality
- Notification bell with badge
- Settings access
- Admin profile display

**Props**:
```typescript
interface AdminHeaderProps {
  adminName: string;
}
```

### 3. StatsCards

**Purpose**: Display key platform metrics

**Features**:
- Animated card entrance
- Trend indicators (+/- percentages)
- Progress bars
- Color-coded by metric type

**Metrics Displayed**:
- Active Users: 12,842 (+12%)
- Monthly Bookings: 2,450 (+8%)
- Completed Sessions: 1,892 (+24%)
- Revenue: $42,300 (+5%)

### 4. DoctorManagement

**Purpose**: Manage healthcare providers

**Features**:
- Doctor list with avatars
- Status indicators (Active/Away)
- Specialty display
- Quick edit actions
- Email display

**Doctor Data Structure**:
```typescript
interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  status: 'active' | 'away';
  avatar: string;
}
```

### 5. UpcomingConsultations

**Purpose**: Display scheduled consultations

**Features**:
- Date badges
- Session type indicators (Video/Chat)
- Doctor assignment
- Time display
- Weekly health report button

**Consultation Data Structure**:
```typescript
interface Consultation {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'video' | 'chat';
}
```

## 🔧 Customization

### Adding New Menu Items

Edit `components/admin/AdminSidebar.tsx`:

```typescript
const menuItems = [
  // ... existing items
  { id: 'reports', label: 'Reports', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];
```

### Modifying Statistics

Edit `components/admin/StatsCards.tsx`:

```typescript
const stats = [
  {
    icon: '👥',
    iconBg: 'bg-purple-100',
    label: 'Your Metric',
    value: '1,234',
    change: '+10%',
    changeType: 'positive' as const,
  },
  // ... more stats
];
```

### Connecting to Real Data

Replace mock data with Firestore queries:

```typescript
// In DoctorManagement.tsx
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const [doctors, setDoctors] = useState<Doctor[]>([]);

useEffect(() => {
  const fetchDoctors = async () => {
    const doctorsRef = collection(db, 'doctors');
    const snapshot = await getDocs(doctorsRef);
    const doctorsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Doctor[];
    setDoctors(doctorsList);
  };
  
  fetchDoctors();
}, []);
```

## 🎨 Styling

### Color Scheme
- **Primary**: Purple (#9333EA)
- **Secondary**: Pink (#EC4899)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)

### Tailwind Classes Used
- `bg-purple-600` - Primary buttons
- `bg-gray-50` - Light backgrounds
- `rounded-xl` - Rounded corners
- `shadow-sm` - Subtle shadows
- `hover:bg-gray-100` - Hover states

## 📊 Future Enhancements

### Phase 1 (Current)
- ✅ Dashboard overview
- ✅ Doctor management
- ✅ Consultation calendar
- ✅ Statistics cards

### Phase 2 (Planned)
- [ ] Real-time data integration
- [ ] Advanced analytics charts
- [ ] User management
- [ ] Booking management
- [ ] Revenue reports

### Phase 3 (Future)
- [ ] Role-based access control
- [ ] Email notifications
- [ ] Export functionality
- [ ] Advanced filtering
- [ ] Mobile app version

## 🔒 Security Considerations

1. **Authentication**: Ensure only admins can access `/admin` route
2. **Authorization**: Implement role-based access control
3. **Data Validation**: Validate all inputs before database operations
4. **Audit Logging**: Track admin actions for security
5. **Rate Limiting**: Prevent abuse of admin endpoints

## 📱 Responsive Design

The admin panel is fully responsive:
- **Desktop**: Full sidebar + main content
- **Tablet**: Collapsible sidebar
- **Mobile**: Bottom navigation (to be implemented)

## 🐛 Troubleshooting

### Issue: Admin page redirects to login
**Solution**: Ensure user is authenticated and has admin role

### Issue: Stats not updating
**Solution**: Connect to real-time Firestore listeners

### Issue: Sidebar not showing
**Solution**: Check z-index and positioning in CSS

## 📞 Support

For admin panel issues:
- Email: admin-support@mompulse.com
- Documentation: See this file
- GitHub Issues: Report bugs and feature requests

---

Built with ❤️ for MomPulse administrators
