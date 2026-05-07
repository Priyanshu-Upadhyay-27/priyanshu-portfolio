# Priyanshu Upadhyay - AI Portfolio

A highly interactive, premium 3D web portfolio showcasing AI and software engineering projects. Built with a focus on modern cinematic aesthetics, high-performance animations, and sophisticated 3D web graphics.

## Features & Highlights

- **Cinematic 3D Preloader**: Features an advanced "Swarm & Tumble" / Isometric Data Block 3D preloader sequence using CSS 3D and GSAP for a high-fidelity visual handoff.
- **Interactive 3D Elements**: Integrates Three.js and React Three Fiber for immersive, interactive canvas backgrounds, including a neural mesh background and vector space contact section.
- **Premium UI/UX**: Utilizes glassmorphism, hardware-accelerated animations, and a curated dark-mode color palette for an Awwwards-tier visual experience.
- **Smooth Animations**: Orchestrated using Framer Motion and GSAP for scroll-synced reveals, seamless transitions, and micro-interactions without layout thrashing.
- **Secure Contact Form**: Implements a "Double-Stealth" anti-spam security mechanism integrated with Netlify Forms.

## Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS for 3D transforms
- **Animations**: [GSAP](https://gsap.com/) & [Framer Motion](https://www.framer.com/motion/)
- **3D Graphics**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), and [@react-three/drei](https://github.com/pmndrs/drei)
- **Deployment & Hosting**: [Netlify](https://www.netlify.com/)

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

Make sure you have Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd my_portfolio
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

The output will be generated in the `dist` directory.

## Deployment

This project is configured for seamless deployment on Netlify. It includes a `netlify.toml` file for build settings and an invisible form in `index.html` to automatically detect and handle contact form submissions via Netlify Forms.

