# ⭐ Aether - AI Powered Productivity Website

A modern, full-stack productivity app (built using Next.js, React, Prisma, Tailwind, Redis and contanerized using Docker) designed to **help you organize your notes, tasks, and events with AI assistance**. This project demonstrates best practices in app architecture, database integration, CI/CD, and Docker-based deployment.

## 🚀 Features

- **Notes:** Rich markdown editor for quick note-taking.
- **To-dos:** Track and prioritize tasks, filter by severity/urgency.
- **Events:** Manage calendar events and deadlines; only future events surface.
- **AI Enhancements:** (Area for future extension!) Potential to integrate AI: auto-categorize notes, suggest events/tasks, or summarize content.
- **Authentication:** NextAuth-enabled user login.
- **Offline/Cache-first:** Responsive, fast, cached dashboard using Redis.

## 🧑💼 Use Cases

- **Students & Professionals:** Keep track of coursework, meetings, and personal tasks—all in one place.
- **Remote Teams:** Organize collaborative to-dos and shared notes.
- **Productivity Enthusiasts:** Analyze task completion patterns or leverage AI-powered suggestions.

## 🛠️ Problems Solved

- **Fragmented productivity:** Combines tasks, notes, events, and AI in a unified workspace.
- **Forgetfulness:** Tasks and events are always visible, prioritized, and sorted.
- **Overwhelm:** Clean UI and efficient filtering (severe tasks, future events) reduce mental load.
- **Portability:** Run anywhere—locally, via Docker, or deploy to Vercel/cloud.

## 🌐 Website Overview

- **Dashboard:** See your top priorities at a glance.
- **Notes:** Write, edit, and preview markdown notes.
- **Tasks:** Add, track, and prioritize to-dos.
- **Events:** Upcoming deadlines and calendar events shown front and center.

---

## 🏁 Getting Started (Local Environment)

### 1. Clone the Repository

```
git clone https://github.com/yourusername/ai_powered_productivity_app.git
cd ai_powered_productivity_app
```

### 2. Install Dependencies

```
npm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env` and fill out the required variables:

```
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

### 4. Prepare Database (with Prisma)

```
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start Local Development Server

```
npm run dev
```

- The app runs at [http://localhost:3000](http://localhost:3000).
- Use `npm run build` as needed.

---

## 🐳 Running with Docker

Ensure Docker is installed on your system.

### 1. Build Docker Image

```
docker build -t ai-productivity-app .
```

### 2. Run Docker Container

```
docker run --env-file .env -p 3000:3000 ai-productivity-app
```

- Now, access the app at [http://localhost:3000](http://localhost:3000).

## ♻️ Clean-Up Commands

To remove unused Docker containers and images after testing:

```
docker container prune
docker image prune
docker system prune
```

## 📦 Deployment & CI/CD

- **Vercel:** Deploy instantly using Git integration; Dockerfile is ignored by default.
- **Docker Hub:** Tag and push images for container registry use.
- **GitHub Actions:** CI workflow automates build, test, and Docker image push on every git push.

## 🛡️ Tech Stack

| Technology    | Purpose                            |
|---------------|----------------------------------|
| Next.js       | Framework (SSR/CSR support)      |
| React 19      | UI Components                    |
| Prisma ORM    | Type-safe Database Access         |
| Upstash Redis | Caching & Fast Data Retrieval     |
| NextAuth      | Authentication & Session Handling |
| Tailwind CSS  | Styling and Layout                |
| Docker        | Containerization & Deployment     |

## 🙌 Thank You for Checking Out This Project!

This AI Powered Productivity Website is designed to not only help users stay organized and efficient but also to showcase modern full-stack development best practices — from React and Next.js to Prisma, Redis caching, Docker containerization, and CI/CD automation.

Whether you’re a developer looking to build your own productivity tools, a recruiter evaluating real-world skills, or someone passionate about AI-enhanced workflows, this project has something valuable for you.

**Happy coding and stay productive! 🚀**
