# 🛡️ Fraud Detector Frontend

An advanced AI-powered credit card fraud detection system with real-time analysis capabilities. Built with modern web technologies for performance and scalability.

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)](https://tailwindcss.com/)

## 🚀 Features

### Core Functionality
- **Real-time Transaction Analysis** - Instant fraud detection on transactions
- **Interactive Dashboard** - Comprehensive overview with key metrics and visualizations
- **Transaction History** - Complete transaction log with filtering and search
- **Fraud Analysis Requests** - Submit transactions for detailed fraud assessment
- **Result Visualization** - Clear, actionable fraud detection results

### Technical Highlights
- ⚡ Lightning-fast performance with Vite
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔄 Real-time updates with TanStack Query
- 📱 Mobile-first responsive design
- ♿ Accessible components with shadcn/ui
- 🎯 Type-safe routing with React Router

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Next-generation frontend tooling for blazing fast HMR

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Lucide Icons** - Beautiful, consistent icon set

### State Management & Data Fetching
- **TanStack Query (React Query)** - Powerful data synchronization
- **React Router v6** - Declarative routing

### Development Tools
- **ESLint** - Code linting and quality checks
- **PostCSS** - CSS transformations

## 📦 Installation

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Clone Repository
```bash
git clone https://github.com/YOUR-USERNAME/fraud-detector-frontend.git
cd fraud-detector-frontend
```

### Install Dependencies
```bash
npm install
# or
yarn install
```

## 🚀 Quick Start

### Development Server
```bash
npm run dev
```
Visit `http://localhost:5173` to view the application.

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure
```
fraud-detector-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # shadcn/ui components
│   │   └── Navigation.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Request.jsx
│   │   ├── Transactions.jsx
│   │   ├── Result.jsx
│   │   ├── About.jsx
│   │   └── NotFound.jsx
│   ├── hooks/            # Custom React hooks
│   │   └── use-toast.js
│   ├── lib/              # Utility functions
│   │   └── utils.js
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎯 Key Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with overview |
| Dashboard | `/dashboard` | Analytics and metrics dashboard |
| Request | `/request` | Submit fraud analysis requests |
| Transactions | `/transactions` | View transaction history |
| Result | `/result` | Fraud detection results |
| About | `/about` | About the application |

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

### Vite Configuration
See `vite.config.js` for build and development settings.

### Tailwind Configuration
Customize theme in `tailwind.config.js`.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🐛 Known Issues

- None currently reported

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [GitHub Profile](https://github.com/YOUR-USERNAME)

## 🙏 Acknowledgments

- shadcn for the amazing UI component library
- Vercel for Vite and tooling
- The React team for the awesome framework

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

⭐ Star this repo if you find it helpful!