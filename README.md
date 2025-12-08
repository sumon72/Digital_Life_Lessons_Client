# Digital Life Lessons - Client

React + Vite frontend for the Digital Life Lessons platform, styled with Tailwind CSS and DaisyUI.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

The client will start on `http://localhost:3000`

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
Client/
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components
│   ├── App.jsx         # Main App component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
└── package.json        # Dependencies
```

## Tech Stack

- **React 18**: Modern UI library
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Tailwind CSS component library
- **React Router**: Client-side routing

## Development

- Hot Module Replacement (HMR) enabled
- Tailwind CSS with DaisyUI theming
- Responsive design ready
