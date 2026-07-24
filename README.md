# Personal identity  Platform

A modern, AI-powered portfolio platform built with React, TanStack Start, TypeScript, Tailwind CSS, and Supabase.

Unlike traditional portfolio websites, this platform allows individuals to create and manage professional digital profiles through an intuitive dashboard while sharing them through personalized public URLs.

---

## Overview

The Personal identity  Platform is designed to help professionals, creators, founders, students, freelancers, and businesses showcase their work through beautiful, searchable, and shareable portfolio pages.

Each user manages their content from an admin dashboard while visitors experience a fast, responsive public portfolio.

The platform combines portfolio management, blogging, project showcasing, case studies, contact management, and AI-assisted content creation in a single application.

---

# Features

## Public Portfolio

- Professional homepage
- About page
- Projects showcase
- Case studies
- Blog
- Contact page
- Responsive design
- Search Engine Optimization (SEO)-friendly routing

---

## User Dashboard

Users can manage:

- Personal profile
- Hero section
- Projects
- Blog posts
- Case studies
- Site settings
- Contact messages

---

## AI Features

Built-in AI assistance helps users create and improve content, including:

- Project descriptions
- Portfolio content
- Blog writing
- Content editing

---

## Rich Content Editing

- Rich text editor
- Image support
- Tags
- Categories
- External links
- Featured images

---

## Authentication

- Secure authentication
- Password reset
- Protected admin routes

---

# Upcoming Features

The platform is actively evolving.

### Personalized Portfolio URLs

Every portfolio will have its own unique public URL.

Example:

```
https://yourdomain.com/u/john-doe
```

or

```
https://yourdomain.com/john-doe
```

making portfolios easy to share on resumes, LinkedIn, social media, email signatures, and business cards.

---

### Social Links

Users will be able to connect:

- LinkedIn
- GitHub
- X (formerly Twitter)
- Instagram
- Facebook
- Dribbble
- Behance
- Medium
- YouTube
- Personal websites
- Custom links

---

### Portfolio Discovery

Future releases will introduce public profile discovery, allowing users to browse and search portfolios across the platform.

---

### Portfolio Analytics

Users will be able to view:

- Page views
- Visitor statistics
- Link clicks
- Profile engagement

---

### Themes

Support for multiple portfolio themes and layouts.

---

## Technology Stack

### Frontend

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- TanStack Query

### Styling

- Tailwind CSS v4
- Radix UI
- Lucide Icons

### Backend

- Supabase
- Authentication
- Database
- Storage

### Editor

- TipTap

### AI

- AI SDK
- OpenAI Compatible API

---

# Project Structure

```
src/

 ├── components/
 ├── routes/
 ├── assets/
 ├── lib/
 ├── hooks/
 ├── services/
 └── utils/
```

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

or

```bash
bun install
```

Start the development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# Environment Variables

Create a `.env` file with the required variables.

Example:

```env
VITE_SUPABASE_URL=your_supabase_url

VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

OPENAI_API_KEY=your_api_key
```

> Never commit sensitive environment variables to version control.

---

# Current Routes

### Public

- Home
- About
- Projects
- Project Details
- Blog
- Blog Article
- Case Studies
- Contact

### User

- Login
- Password Reset

### Admin

- Dashboard
- Hero
- Profile
- Projects
- Blog
- Case Studies
- Messages
- Site Settings

---

# Future Roadmap

- Multi-user portfolios
- Personalized URLs
- Custom domains
- Portfolio templates
- Portfolio analytics
- Resume builder
- Media gallery
- Testimonials
- Portfolio search
- Team portfolios
- Portfolio verification
- API access
- Mobile application

---

# Contributing

Contributions, feature requests, and improvements are welcome.

Please create an issue before submitting major changes.

---

# License

This project is licensed under the MIT License.

---

## Vision

Our goal is to build more than a portfolio website.

We're building a professional identity platform where anyone can create a beautiful online presence, publish their work, tell their story, and share a portfolio with a single link.
