# Anonymous Feedback Portal

A premium, full-stack anonymous feedback collection system built with React, Vite, and Supabase. The application features a stunning glassmorphism aesthetic with fluid micro-animations, designed to provide an engaging user experience while maintaining a secure and real-time administrative backend.

![Feedback Portal](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/message-square.svg)

## 🌟 Features

- **Premium UI/UX:** Built with a custom "neo-glassmorphism" aesthetic using Vanilla CSS, deep glowing effects, and a highly responsive layout.
- **Fluid Animations:** Powered by `framer-motion` for buttery-smooth page transitions, hover effects, and interactive form feedback.
- **Anonymous Submissions:** Users can easily submit categorized feedback (General, Bug, Suggestion) completely anonymously.
- **Real-Time Admin Dashboard:** Secure login system for administrators to view incoming feedback instantly, without refreshing the page.
- **Interactive Filtering:** Quickly sort and filter feedback by status (Pending/Reviewed) and Category.
- **Supabase Integration:** Leveraging Supabase for secure authentication, real-time PostgreSQL database subscriptions, and row-level security.

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Framer Motion, Lucide React
- **Backend/Database:** Supabase (PostgreSQL, Auth, Realtime)
- **Styling:** Custom Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphism)
- **Deployment:** Ready for Vercel / Netlify

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Supabase account and project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NotDumbj/anonymous-feedback-box.git
   cd anonymous-feedback-box/feedback-box
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `feedback-box` directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:5173`.

## 🗄️ Database Schema

This project requires a `feedback` table in your Supabase project with the following structure:

```sql
create table public.feedback (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  message text not null,
  category text not null default 'General'::text,
  is_reviewed boolean default false
);

-- Remember to set up Row Level Security (RLS) allowing anonymous inserts and authenticated reads/updates!
```

## 🎨 Design Philosophy

The UI was crafted with a focus on modern web aesthetics. By utilizing pure CSS combined with `framer-motion`, we avoided heavy utility frameworks to achieve a unique, tailored look. The dark theme (`#0b0c10`) combined with neon cyan and purple accents (`#66fcf1`, `#c084fc`) creates a high-contrast, professional environment that feels alive.

## 📄 License

This project is open-source and available under the MIT License.
