# MomPulse - Project Structure

## Overview
MomPulse is a Next.js application designed to support mothers through their pregnancy and postpartum journey.

## Directory Structure

```
mompulse/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Landing page (pre-login)
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── signup/
│   │   └── page.tsx         # Sign up page
│   └── globals.css          # Global styles
│
├── components/              # Reusable React components
│   ├── Header.tsx           # Navigation header with login/signup
│   ├── HeroSection.tsx      # Hero section with CTA
│   ├── FeaturesSection.tsx  # Features grid
│   ├── PlanningSection.tsx  # Planning & pregnancy info
│   ├── PostpartumSection.tsx # Postpartum care info
│   ├── TestimonialsSection.tsx # User testimonials
│   ├── CTASection.tsx       # Call-to-action section
│   └── Footer.tsx           # Footer with links
│
├── public/                  # Static assets
└── package.json            # Dependencies
```

## Pages

### Landing Page (`/`)
The main pre-login page showcasing MomPulse features and benefits. Includes:
- Header with navigation and auth buttons
- Hero section with main value proposition
- Features overview
- Planning & pregnancy information
- Postpartum care information
- User testimonials
- Call-to-action section
- Footer with links

### Login Page (`/login`)
User authentication page with:
- Email/password login form
- Remember me option
- Forgot password link
- Social login options (Google, Facebook)
- Link to sign up page

### Sign Up Page (`/signup`)
User registration page with:
- Full name, email, password fields
- Password confirmation
- Terms of service agreement
- Social sign up options (Google, Facebook)
- Link to login page

## Component Architecture

All components are modular and reusable, following Next.js 14+ best practices:
- Server Components by default
- Client Components only when needed (forms, interactivity)
- TypeScript for type safety
- Tailwind CSS for styling

## Styling

- **Framework**: Tailwind CSS 4
- **Color Scheme**: 
  - Primary: Purple (#7C3AED)
  - Secondary: Teal (#0F766E)
  - Accent: Pink/Rose
- **Typography**: Geist Sans (default Next.js font)

## Next Steps

1. Add authentication logic (NextAuth.js, Supabase, etc.)
2. Create protected routes for logged-in users
3. Add actual images to replace placeholders
4. Implement form validation and submission
5. Add loading states and error handling
6. Create dashboard pages for authenticated users
7. Add API routes for backend functionality

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Notes

- All components use TypeScript for type safety
- Path aliases configured: `@/` points to root directory
- Images are placeholders - replace with actual assets
- Forms are UI-only - add backend integration as needed
