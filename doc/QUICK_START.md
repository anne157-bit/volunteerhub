# VolunteerHub - Quick Start Guide for Cursor AI

## 🚀 How to Use These Files with Cursor

### Step 1: Create Your Project Files

1. **Create a new Next.js project:**
```bash
npx create-next-app@latest volunteerhub --typescript --tailwind --app
cd volunteerhub
```

2. **Copy the project prompt to a file:**
```bash
# Create a docs directory
mkdir docs

# Save the "Cursor Project Prompt" artifact to:
docs/PROJECT_PROMPT.md

# Save the "rules.md" artifact to:
.cursorrules
```

### Step 2: Setup Cursor AI Rules

The `.cursorrules` file in your project root will automatically be used by Cursor to guide code generation. This file contains:

- TypeScript best practices
- Firebase integration guidelines  
- Next.js 14 App Router patterns
- Security rules
- Performance optimization tips
- Common pitfalls to avoid

### Step 3: Install Dependencies

```bash
# Core dependencies
npm install firebase firebase-admin
npm install @tanstack/react-query axios date-fns
npm install lucide-react class-variance-authority clsx tailwind-merge

# shadcn/ui setup
npx shadcn-ui@latest init

# Add shadcn components
npx shadcn-ui@latest add button card input label select textarea tabs dialog dropdown-menu badge avatar toast form skeleton

# Development dependencies
npm install -D @types/node @types/react @types/react-dom
```

### Step 4: Setup Firebase

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Functions
# - Hosting  
# - Storage
```

Create `.env.local` file:
```bash
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google Maps (optional for Phase 2)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Using Cursor AI Effectively

#### Method 1: Chat-Based Development
Open Cursor's chat (Cmd/Ctrl + L) and ask:

```
"Read the PROJECT_PROMPT.md file and create the Firebase configuration file 
at lib/firebase/config.ts following all the rules in .cursorrules"
```

```
"Create the Volunteer interface in types/user.ts with all fields from 
the database schema in PROJECT_PROMPT.md"
```

```
"Implement the calculateMatchScore function from the matching engine 
section of the prompt, following TypeScript best practices"
```

#### Method 2: Inline Suggestions
When editing a file:

1. Write a comment describing what you want:
```typescript
// Create a component that displays opportunity cards with match scores
```

2. Press Tab to accept Cursor's suggestions, which will follow the `.cursorrules` automatically

#### Method 3: Generate Entire Files
Right-click in file explorer → "Generate with AI" → Specify what you want:

```
"Generate the OpportunityCard component that shows:
- Title, description, NGO name
- Skills required with badges  
- Location and time commitment
- Match score with breakdown
- Apply button
Follow all component structure rules and use shadcn/ui components"
```

### Step 6: Development Workflow

```bash
# Start development server
npm run dev

# In another terminal, start Firebase emulators (after firebase init)
firebase emulators:start

# Run type checking (do this frequently!)
npm run type-check

# Run linting
npm run lint

# Build for production (test before deploying)
npm run build
```

### Step 7: Building Feature by Feature

**Week 1 - Core Platform:**

Day 1-2: Authentication & Profiles
```
Cursor prompt: "Create the authentication flow with Firebase Auth, Google OAuth,
and the volunteer profile creation multi-step form. Include all fields from the 
database schema."
```

Day 3: Opportunity Management
```
Cursor prompt: "Implement the NGO opportunity creation form and opportunity 
listing page with filtering. Use the Opportunity interface from the schema."
```

Day 4: Matching Engine
```
Cursor prompt: "Implement the complete matching algorithm with all 6 layers 
from the PROJECT_PROMPT, including skill scoring, availability, location, 
cause alignment, and ML personalization."
```

Day 5: Applications & Dashboard
```
Cursor prompt: "Create the application flow - volunteer applies, NGO sees 
candidates with match scores, can shortlist/confirm. Include both dashboards."
```

**Week 2 - Enhanced Features:**

Day 6-7: Trust & Safety
```
Cursor prompt: "Add NGO verification system with status badges, and post-
opportunity rating system for both volunteers and NGOs."
```

Day 8-9: Notifications & Engagement  
```
Cursor prompt: "Implement Firebase Cloud Messaging for push notifications,
in-app notification bell, and impact tracking with badges/achievements."
```

Day 10: Mobile Optimization
```
Cursor prompt: "Convert to PWA - add manifest.json, service worker, offline
support, and ensure all screens are mobile-responsive."
```

**Week 3 - Polish & Demo:**

Day 11-12: UI/UX Polish
```
Cursor prompt: "Add loading skeletons, smooth transitions, micro-interactions,
and improve the overall design aesthetic."
```

Day 13: Demo Data
```
Cursor prompt: "Create seed data script with 20 realistic volunteers, 10 NGOs,
30 opportunities, and 50 applications for demo purposes."
```

Day 14: Final Testing
```
Cursor prompt: "Review all error handling, add missing loading states, 
fix any TypeScript errors, and ensure Lighthouse score is above 90."
```

## 💡 Pro Tips for Working with Cursor

### 1. Be Specific
❌ "Create a button"
✅ "Create a primary button using shadcn/ui Button component that triggers the applyToOpportunity function with proper loading state and error handling"

### 2. Reference the Rules
✅ "Following the Firebase best practices in .cursorrules, create a function to fetch opportunities with pagination"

### 3. Ask for Explanations
✅ "Explain why this matching algorithm uses weighted scoring instead of simple boolean matching"

### 4. Iterate in Small Steps
Don't ask Cursor to build entire pages at once. Build component by component:
1. "Create the OpportunityCard component layout"
2. "Add the match score display to OpportunityCard"  
3. "Add the apply button with loading state"
4. "Add error handling to the apply button"

### 5. Use Cursor's Features
- **Cmd/Ctrl + K**: Edit code in place
- **Cmd/Ctrl + L**: Open chat  
- **Cmd/Ctrl + I**: Generate code
- **Tab**: Accept suggestions

### 6. Review Generated Code
Always review what Cursor generates:
- Check TypeScript types
- Verify error handling
- Ensure accessibility (aria labels, keyboard nav)
- Test on mobile

### 7. Fix Issues Immediately
If something doesn't work:
```
"This code is throwing a TypeScript error: [paste error]. 
Fix it following the rules in .cursorrules"
```

## 🎯 Common Cursor Prompts You'll Use

```
"Create the [ComponentName] component following the component structure 
rules in .cursorrules"

"Implement [functionName] with proper TypeScript types and error handling"

"Add Firebase security rules for the [collection] collection that ensures
[specific permission logic]"

"Create a React Query hook for fetching [data type] with caching and 
error handling"

"Add loading skeleton and error states to [ComponentName]"

"Make [ComponentName] mobile responsive following Tailwind best practices"

"Write unit tests for [functionName] following the testing guidelines"

"Optimize [ComponentName] for performance using React.memo and useCallback"

"Add proper accessibility attributes to [ComponentName]"

"Create a Firebase Cloud Function that triggers when [event happens]"
```

## 📋 Daily Checklist

At the end of each coding session:

- [ ] Run `npm run type-check` - no TypeScript errors
- [ ] Run `npm run lint` - code passes linting  
- [ ] Test in browser - no console errors
- [ ] Test on mobile viewport
- [ ] Commit code with proper message format
- [ ] Update progress in PROJECT_PROMPT.md

## 🆘 Troubleshooting

**"Cursor isn't following the rules"**
- Make sure `.cursorrules` is in the project root
- Explicitly mention "following .cursorrules" in your prompts
- Restart Cursor after adding/updating `.cursorrules`

**"Generated code has TypeScript errors"**
- Ask: "Fix these TypeScript errors following the strictness rules in .cursorrules"
- Run type-check frequently: `npm run type-check`

**"Code doesn't match the prompt specifications"**  
- Be more specific in your prompts
- Reference specific sections: "Following the Database Schema section..."
- Ask Cursor to explain its approach before generating

**"Firebase operations failing"**
- Check `.env.local` has all required variables
- Verify Firebase project is initialized
- Check Firestore security rules
- Use Firebase emulator for testing

## 🎬 Ready to Start!

You now have:
1. ✅ Complete project specification (PROJECT_PROMPT.md)
2. ✅ Development rules and best practices (.cursorrules)
3. ✅ Setup instructions (this file)
4. ✅ Week-by-week implementation plan
5. ✅ Cursor AI usage strategies

**Next Step**: Open Cursor, create your Next.js project, and start with Day 1 - Authentication & Profiles!

**Remember**: Take it step by step. Build one feature at a time. Test frequently. The rules file will keep you on track!

---

**Need help?** Ask Cursor:
```
"Read both PROJECT_PROMPT.md and .cursorrules, then help me get started 
with [specific feature]. Explain your approach before generating code."
```

Good luck building VolunteerHub! 🚀

