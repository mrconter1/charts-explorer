# 📊 Charts Explorer

A **mobile-first podcast analytics dashboard** that tracks and visualizes Spotify podcast episode rankings across different regions and time periods. Built with Next.js 15 and powered by real-time data from Supabase.

[Insert Image of Website]

## 🌟 Features

### 📱 **Mobile-First Design**
Built with a responsive interface optimized for mobile devices, featuring touch-friendly navigation and seamless experience across all screen sizes.

### 🌍 **Multi-Region Analytics**
Compare podcast performance between **🇸🇪 Sweden** and **🇺🇸 United States** markets with region-specific trending episodes and market insights.

### ⏰ **Flexible Time Windows**
Analyze data across multiple time periods - from weekly snapshots and monthly trends to quarterly insights, annual performance metrics, and complete historical overviews.

### 🔍 **Smart Search & Discovery**
Find podcasts instantly with live search functionality, browse individual podcast pages with detailed episode counts and metadata.

### 📈 **Real-Time Rankings**
Self-perpetuating tracking system that maintains absolute episode rankings from Spotify with score-based performance metrics and historical trend analysis.

## 🚀 Tech Stack

Built with **Next.js 15** and **React 19** using **TypeScript**, styled with **Tailwind CSS 4** and **shadcn/ui** components. Data is stored in **Supabase (PostgreSQL)** and sourced from [API Supabase Sync](https://github.com/mrconter1/api-supabase-sync), with **Lucide React** icons and **Vercel-ready** deployment.

## 🛠️ Getting Started

### Prerequisites
You'll need **Node.js 18+**, a package manager (**npm/yarn/pnpm**), and a **Supabase account** with a project set up.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd charts-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Data Pipeline

This project displays data collected and synchronized by the [API Supabase Sync](https://github.com/mrconter1/api-supabase-sync) project, which continuously tracks Spotify podcast charts and maintains historical episode rankings. The system provides real-time updates to the Supabase database while ensuring data accuracy across multiple regions.

## 🎯 Key Pages

The main dashboard (**`/`**) provides filterable episode rankings with real-time data filtering and navigation. Individual podcast detail pages (**`/podcast/[showId]`**) offer deep-dive analytics with Spotify deep-link integration.

## 🚀 Deployment

The project is optimized for deployment on Vercel:

```bash
npm run build
npm run start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for podcast analytics enthusiasts
