[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YHSq4TPZ)

# To-Do App – Preliminary Assignment Submission

⚠️ Please complete **all sections marked with the ✍️ icon** — these are required for your submission.

👀 Please Check ASSIGNMENT.md file in this repository for assignment requirements.

## 🚀 Project Setup & Usage

**How to install and run your project:**

```bash
# Clone the repository
git clone https://github.com/NAVER-Vietnam-AI-Hackathon/web-track-naver-vietnam-ai-hackathon-khnh19.git

# Navigate to project directory
cd web-track-naver-vietnam-ai-hackathon-khnh19

# Install dependencies
npm install

# Start the development server
npm run dev

# Open browser and go to http://localhost:5174
```

## 🔗 Deployed Web URL or APK file

[Ti di hoc ve thi lam hihi]

## 🎥 Demo Video

**Demo video link (≤ 2 minutes):**  
📌 **Video Upload Guideline:** when uploading your demo video to YouTube, please set the visibility to **Unlisted**.

- “Unlisted” videos can only be viewed by users who have the link.
- The video will not appear in search results or on your channel.
- Share the link in your README so mentors can access it.

[hfkasjhdskahfk]

## 💻 Project Introduction

### a. Overview

**TaskMaster Pro** is a comprehensive time and task management application designed specifically for Vietnamese students. The application combines efficient task management with the Pomodoro Technique, helping users enhance their productivity in studying and working.

Featuring a modern dark interface with luxurious glassmorphism effects, TaskMaster Pro is not just a productivity tool but also delivers an exceptional visual experience. The application is built entirely with React + TypeScript and Material-UI, ensuring high performance and excellent scalability.

### b. Key Features & Function Manual

**🎯 Complete Task Management:**

- ➕ **Create tasks**: Add new tasks with title, description, category, priority level, estimated time
- ✏️ **Edit tasks**: Update all task information
- 🗑️ **Delete tasks**: Remove unnecessary tasks
- ✅ **Complete tasks**: Mark tasks as completed
- 🏷️ **Tag system**: Add and manage tags for tasks
- 🔍 **Search & filter**: Search by name, filter by category, status, priority level

**📅 Calendar View:**

- 🗓️ **Calendar display**: Show tasks by date
- 📊 **Task indicators**: Color bars showing priority levels
- 📈 **Progress tracking**: Track daily completion progress

**⏰ Pomodoro Timer:**

- ⏱️ **Timer 25/5/15**: Focus cycle 25 minutes, Break 5 minutes, Long Break 15 minutes
- ▶️ **Start/Pause/Reset/Skip**: Flexible timer controls
- 🎯 **Task Integration**: Select specific tasks to focus on
- 🔔 **Notifications**: Audio and desktop notifications when time is up
- 📊 **Session Statistics**: Track number of sessions and focus time

**📈 Analytics Dashboard:**

- 📊 **Statistical charts**: Display completion progress, distribution by category
- ⏰ **Time tracking**: Track actual vs estimated work time
- 🎯 **Productivity score**: Productivity score based on completion performance

### c. Unique Features (What’s special about this app?)

**🎨 Dark Theme with Glassmorphism:**

- Complete dark interface (#000000 background) creating a luxurious feel
- Glassmorphism effects with backdrop-filter blur creating visual depth
- Gradient backgrounds and smooth transitions

**🔄 Pomodoro + Task Management Integration:**

- Unique combination of task management and Pomodoro Technique
- Ability to select specific tasks when starting Pomodoro sessions
- Real-time work tracking for individual tasks

**🎯 Smart Task Prioritization:**

- Visual color system for priority levels (Urgent: Red, High: Yellow, Medium: Blue, Low: Green)
- Auto-sorting by deadline and priority
- Visual indicators on calendar view

**💾 Advanced Data Persistence:**

- LocalStorage with backup/restore functionality
- Session history tracking for Pomodoro
- Sample data generation for demo purposes

**🔔 Multi-modal Notifications:**

- Web Audio API for custom notification sounds
- Browser desktop notifications
- Visual feedback with color-coded progress bars

**📱 Responsive Design:**

- Desktop: Tabs navigation
- Mobile: Bottom navigation
- Adaptive layouts for all screen sizes

### d. Technology Stack and Implementation Methods

**Frontend Framework:**

- ⚛️ **React 18** - Core UI framework
- 📘 **TypeScript** - Type safety and developer experience
- ⚡ **Vite** - Fast build tool and development server

**UI/UX Libraries:**

- 🎨 **Material-UI (MUI)** - Component library with theme customization
- 🎭 **CSS-in-JS** - Styled components with sx prop
- 📱 **Responsive Design** - Breakpoints and adaptive layouts

**State Management:**

- 🪝 **React Hooks** - useState, useEffect, useRef for local state
- 🔄 **Custom Hooks** - useTasks, useAnalytics for business logic
- 💾 **LocalStorage** - Client-side persistence

**Date/Time Handling:**

- 📅 **dayjs** - Lightweight date manipulation library
- ⏰ **setInterval** - Timer implementation for Pomodoro
- 🌐 **Internationalization** - English locale setup

**Web APIs:**

- 🔔 **Notification API** - Desktop notifications
- 🔊 **Web Audio API** - Custom notification sounds
- 💾 **localStorage API** - Data persistence

**Development Tools:**

- 🔍 **ESLint** - Code quality and standards
- 🏗️ **TypeScript Config** - Strict type checking
- 📦 **NPM** - Package management

### e. Service Architecture & Database structure (when used)

**Client-Side Architecture:**

```
TaskMaster Pro
📁 src/
├── 📱 **UI Layer**
│   ├── App.tsx
│   ├── main.tsx
│   └── components/
│       ├── Layout.tsx
│       ├── ListView.tsx
│       ├── CalendarView.tsx
│       ├── PomodoroTimer.tsx
│       ├── AnalyticsView.tsx
│       └── TaskForm.tsx
│
├── 🔄 **Business Logic**
│   └── hooks/
│       ├── useTasks.ts
│       └── useAnalytics.ts
│
├── 💾 **Data Layer**
│   └── services/
│       └── TaskStorage.ts
│
├── 📊 **Types**
│   └── types/
│       └── Task.ts
│
└── 🛠️ **Utilities**
    └── utils/
        └── index.ts
```

**Data Storage Structure:**

```javascript
// LocalStorage Keys
taskmaster_tasks: Task[]           // Main task data
taskmaster_analytics: Analytics    // Cached analytics
taskmaster_pomodoro_sessions: PomodoroSession[] // Focus sessions

// Task Data Model
{
  id: string,
  title: string,
  description: string,
  category: "study" | "project" | "personal" | "work" | "other",
  priority: "low" | "medium" | "high" | "urgent",
  status: "todo" | "in_progress" | "completed" | "cancelled",
  estimatedTime: number,
  actualTime?: number,
  createdAt: Date,
  updatedAt: Date,
  dueDate?: Date,
  completedAt?: Date,
  tags: string[]
}
```

## 🧠 Reflection

### a. If you had more time, what would you expand?

**🔄 Advanced Features:**

- **Cloud Sync**: Firebase/Supabase integration to sync data across devices
- **Team Collaboration**: Share projects and tasks with teammates
- **Advanced Analytics**: ML-based productivity insights and recommendations
- **Calendar Integration**: Sync with Google Calendar, Outlook
- **Mobile App**: React Native app for iOS/Android

**🎨 UI/UX Enhancements:**

- **Custom Themes**: Allow users to create custom color schemes
- **Animations**: Micro-interactions and page transitions
- **Accessibility**: Screen reader support, keyboard navigation
- **Drag & Drop**: Reorder tasks, drag to calendar
- **Offline Support**: Service Worker for offline functionality

**⚡ Performance Optimizations:**

- **Virtual Scrolling**: For large task lists
- **Code Splitting**: Lazy loading components
- **Caching**: React Query for data caching
- **PWA**: Progressive Web App capabilities

### b. If you integrate AI APIs more for your app, what would you do?

**🤖 AI-Powered Task Management:**

- **Smart Task Creation**: NLP to extract tasks from text/email/documents
- **Priority Prediction**: ML model to predict priority levels based on historical data
- **Time Estimation**: AI predict accurate completion time based on user patterns
- **Auto-categorization**: Automatically categorize tasks into appropriate categories

**📊 Intelligent Analytics:**

- **Productivity Insights**: AI analyze work patterns and suggest improvements
- **Focus Recommendations**: AI suggest optimal focus times based on performance
- **Burnout Detection**: Monitor stress levels and suggest breaks
- **Goal Achievement Prediction**: Forecast likelihood of meeting deadlines

**💬 Conversational Interface:**

- **Voice Commands**: "Hey TaskMaster, add a dating with Uyen tomorrow at 7AM"
- **Chatbot Assistant**: Natural language task management
- **Smart Reminders**: Context-aware notifications
- **Meeting Summarization**: AI generate tasks from meeting transcripts

**🔮 Predictive Features:**

- **Schedule Optimization**: AI optimize daily schedule for maximum productivity
- **Habit Formation**: Suggest and track productive habits
- **Workload Balancing**: Prevent overcommitment with intelligent scheduling
- **Learning Path Recommendations**: Suggest learning resources based on tasks

## ✅ Checklist

- [x] Code runs without errors
- [x] All required features implemented (add/edit/delete/complete tasks)
- [x] All ✍️ sections are filled
- [x] **BONUS:** Pomodoro Timer integration
- [x] **BONUS:** Calendar view
- [x] **BONUS:** Analytics dashboard
- [x] **BONUS:** Dark theme with glassmorphism
- [x] **BONUS:** Responsive design
- [x] **BONUS:** Advanced task filtering and search
