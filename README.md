# Curate

A modern web application that automatically extracts, categorizes, and summarizes content from any URL. Built with Next.js and powered by AI, Curate helps you quickly understand and organize web content with intelligent metadata extraction.

![Curate](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **Intelligent Content Extraction**: Automatically extracts title, description, images, and keywords from any webpage
- **Smart Categorization**: Classifies content into relevant categories like Entertainment, Travel, Food, Education, and more
- **AI-Powered Summaries**: Generates concise, bullet-point summaries using Mistral AI
- **Beautiful UI**: Modern dark-themed interface with particle effects and smooth animations
- **Real-time Processing**: Fast and responsive URL analysis with loading states
- **Comprehensive Metadata**: Displays all extracted information in an organized, easy-to-read format

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- A Mistral AI API key ([Get one here](https://mistral.ai/))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd curate
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:
```env
MISTRAL_API_KEY=your_mistral_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1. Enter any URL in the input field
2. Click "Summarize" to process the webpage
3. View the extracted metadata, category classification, and AI-generated summary
4. Explore the detailed information including keywords, images, and content preview

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Web Scraping**: [Cheerio](https://cheerio.js.org/)
- **AI**: [Mistral AI](https://mistral.ai/) for content summarization
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
curate/
├── app/
│   ├── api/
│   │   └── extract/
│   │       └── route.ts          # API endpoint for URL processing
│   ├── page.tsx                   # Main application page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── ui/                        # shadcn/ui components
│   └── theme-provider.tsx         # Theme configuration
├── lib/
│   └── utils.ts                   # Utility functions
├── hooks/                         # Custom React hooks
├── public/                        # Static assets
└── styles/                        # Additional stylesheets
```

## 🔧 Configuration

The application uses environment variables for configuration. Make sure to set up your `.env.local` file with:

- `MISTRAL_API_KEY`: Your Mistral AI API key for generating summaries

## 🎨 Features in Detail

### Content Categorization

The app automatically categorizes content into predefined categories:
- Entertainment (Movies, TV Shows, Music, Books, Video Games)
- Travel and Places (Destinations, Hotels, Restaurants, Attractions)
- Food and Dining (Recipes, Reviews, Cooking Tips)
- Shopping and Products (Electronics, Fashion, Home & Garden)
- Education and Learning (Courses, Tutorials, Articles)
- Social Media, News and Media, Health and Fitness, Real Estate, and more

### AI Summarization

Powered by Mistral AI, the summarization feature generates concise, bullet-point summaries that capture the essence of the content in under 60 words.

## 🚢 Building for Production

```bash
npm run build
npm start
```

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📝 License

This project is private and not licensed for public use.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI summarization powered by [Mistral AI](https://mistral.ai/)

---

Made with ❤️ using Next.js and TypeScript

