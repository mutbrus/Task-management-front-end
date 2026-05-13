# TaskFlow — Vue 3 Task Management System

A modern, production-ready task management frontend inspired by ClickUp, Trello, and Asana.

## Tech Stack
- Vue 3 (Composition API + `<script setup>`)
- Vite
- Vue Router 4
- Pinia
- Tailwind CSS (light + dark mode)
- Axios

## Features
- **Auth**: Login, Register, Forgot Password, JWT storage, route guards, logout
- **Dashboard**: Overview cards, recent projects/tasks, activity feed
- **Projects**: List, create/edit/delete (modals), detail page, members, progress
- **Tasks**: List + Kanban board, create/edit/delete, priority, status, due date, assignee, search/filter/sort
- **Task Detail**: Description, subtasks, comments, attachments, activity log
- **Members**: Team list, invite UI, assign to project/task
- **Notifications**: Dropdown with read/unread states
- **Settings**: Profile, change password, light/dark theme toggle
- **UI**: Sidebar + topbar layout, fully responsive, reusable components, loading/empty/error states

## Folder Structure
```
src/
├── assets/         # styles, images
├── components/     # reusable UI (ui/, layout/, task/, project/, modals/)
├── layouts/        # AuthLayout, AppLayout
├── pages/          # route pages (auth/, dashboard/, projects/, tasks/, members/, settings/)
├── router/         # vue-router config + guards
├── stores/         # Pinia stores (auth, projects, tasks, ui, notifications)
├── services/       # Axios api services (auth, projects, tasks, users, comments, notifications)
├── composables/    # reusable composition fns
└── utils/          # helpers
```

## Installation
```bash
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173

**Demo login:** any email + password (mock mode is enabled by default).

## Connecting a Real Backend
1. Set `VITE_USE_MOCK=false` in `.env`
2. Set `VITE_API_BASE_URL=https://your-api.com/api`
3. The Axios instance in `src/services/http.js` automatically attaches the JWT from `localStorage` and handles 401 redirects.

Each service file (`src/services/*.js`) exposes the API surface used by the stores — wire your backend endpoints there.

## Build
```bash
npm run build
npm run preview
```
