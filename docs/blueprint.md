# **App Name**: GymStreak Pro

## Core Features:

- Google Sign-In Authentication: Implements secure user authentication using Google Sign-In, managing user roles (admin/user) and initial user data setup (streak initialization).
- Admin Dashboard with Recent Activity: Provides a secure, desktop-optimized admin interface to view recent user check-in activity, sorted by timestamp.
- QR Code Scanner for Check-Ins: Enables admins to scan user QR codes, record check-ins, and automatically update user streak data based on check-in history; provide success toast notifications.
- User QR Code Display: Generates and displays a unique QR code for each user, enabling easy check-ins via admin scanning; show user's check-in status on the screen.
- Streak Progress Tracker: Tracks and displays the user's current streak as a prominent number, along with a calendar view highlighting check-in days with a fire icon.
- Real-time Gym Occupancy: Calculates and displays the current gym occupancy based on check-ins within the last hour, providing users with live gym stats.
- Check-in History Summarizer: Leverages AI to summarize check-in history, extract key trends, and present personalized fitness insights. AI will use a tool to retrieve users' data to inform the output.

## Style Guidelines:

- Primary color: Neon green (#39FF14), evocative of energy and tech.
- Background color: Dark gray (#222222), providing a sleek and modern dark mode aesthetic.
- Accent color: Electric blue (#7DF9FF), highlighting key UI elements and calls to action.
- Body and headline font: 'Space Grotesk' for a computerized, techy feel.
- Code font: 'Source Code Pro' for displaying code snippets (e.g., user IDs).
- Use minimalistic icons for navigation and stats, ensuring they are easily recognizable and touch-friendly.
- Mobile-first approach for the user app, with a fixed bottom navigation bar for quick access to the main features.
- Subtle transition animations and loading states to enhance the user experience and provide feedback during data updates.