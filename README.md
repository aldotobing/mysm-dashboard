# MYSM Admin Dashboard

A modern admin dashboard built with Next.js, React, and Tailwind CSS, designed for managing and visualizing data with a clean, responsive interface.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: React Context
- **Charts**: ApexCharts
- **Calendar**: FullCalendar
- **Maps**: React JVectorMap
- **Form Handling**: React Hook Form
- **Backend**: Next.js API Routes
- **Package Manager**: pnpm

## 📦 Prerequisites

- Node.js 18.x or later
- pnpm 8.x or later

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mysm-admin-dashboard.git
   cd mysm-admin-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your environment variables:


4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

## 📂 Project Structure

```
src/
├── app/               # App router pages and layouts
├── components/        # Reusable UI components
├── context/           # React context providers
├── helpers/           # Utility functions
├── hooks/             # Custom React hooks
├── icons/             # SVG icons
├── layout/            # Layout components
├── lib/               # Library code
└── services/          # API services and clients
```

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🎨 Features

- Responsive design
- Dark mode support
- Interactive charts and data visualization
- Calendar with drag & drop
- Form validation
- File uploads
- Real-time data updates
- Role-based access control

## 📄 License

This project is licensed under the MIT License.
