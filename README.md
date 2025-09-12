# 🏥 Doctor Dashboard - Medical Practice Management System

A comprehensive Next.js 15 application designed for medical professionals to manage patients, consultations, tasks, and medical records efficiently. Built with modern web technologies and featuring an intuitive user interface.

## ✨ Features

### 🏠 **Dashboard Analytics**

- **Real-time Statistics**: Patient count, consultation metrics, revenue tracking
- **Interactive Charts**: Patient growth trends, appointment type distribution, demographic analysis
- **Quick Actions**: Fast access to common tasks like adding patients and scheduling consultations
- **Visual Insights**: Comprehensive overview of practice performance

### 👥 **Patient Management**

- **Patient Directory**: Complete patient database with search and filtering
- **Patient Profiles**: Detailed medical history and consultation records
- **Add Patient Dialog**: Streamlined patient registration using Shadcn UI dialogs
- **Medical Timeline**: Unified view of all patient interactions and medical records

### 🩺 **Consultation System**

- **Prescription Management**: Advanced chips-based prescription input with autocomplete
- **Medicine Database**: Comprehensive database with 50+ medicines and ability to add new ones
- **Symptom Tracking**: Detailed symptom and diagnosis recording
- **Consultation Notes**: Rich text notes and medical observations
- **Search & Filter**: Find consultations by patient, symptoms, or diagnosis

### 📋 **Task Management**

- **Dual View Modes**: List view and Gantt chart view (YouTrack-style)
- **Task Tracking**: Create, update, and manage daily tasks and reminders
- **Priority System**: High, medium, and low priority task classification
- **Progress Monitoring**: Visual progress bars and status indicators
- **Timeline Visualization**: Gantt chart with week/month views and navigation

### 👨‍⚕️ **Doctor Management**

- **Doctor Profiles**: Manage doctor information and specializations
- **Search & Filter**: Find doctors by name, specialty, or availability
- **Professional Directory**: Complete doctor database management

### 🎨 **Modern UI/UX**

- **Shadcn UI Components**: Professional, accessible, and customizable components
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Adaptive theming system
- **Smooth Animations**: Enhanced user experience with fluid transitions
- **Intuitive Navigation**: Clear sidebar navigation with breadcrumbs

## 🛠️ **Technology Stack**

### **Frontend**

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Shadcn UI**: Modern component library
- **Lucide React**: Beautiful icon library
- **Recharts**: Data visualization and charts

### **State Management**

- **React Context API**: Global state management
- **Local Storage**: Client-side data persistence
- **React Hooks**: Modern state and lifecycle management

### **Development Tools**

- **ESLint**: Code linting and quality assurance
- **Yarn**: Package manager
- **Playwright**: Automated testing
- **Turbopack**: Fast bundling and development

## 📁 **Project Structure**

```
doctors/
├── app/                          # Next.js App Router
│   ├── components/               # Reusable UI components
│   │   ├── ui/                  # Shadcn UI components
│   │   │   ├── alert.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── ...
│   │   ├── layout/              # Layout components
│   │   │   └── DashboardLayout.tsx
│   │   ├── AddPatientDialog.tsx # Patient creation dialog
│   │   ├── GanttChart.tsx       # Task timeline visualization
│   │   ├── PrescriptionChips.tsx # Medicine prescription input
│   │   ├── doctor-sidebar.tsx   # Main navigation sidebar
│   │   └── ...
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx      # Authentication state
│   ├── lib/                     # Utility functions and data
│   │   ├── medicines.ts         # Medicine database
│   │   ├── storage.ts           # Local storage management
│   │   ├── types.ts             # TypeScript type definitions
│   │   └── utils.ts             # Utility functions
│   ├── dashboard/               # Dashboard page
│   │   └── page.tsx
│   ├── appointments/            # Consultations page
│   │   └── page.tsx
│   ├── patients/                # Patient management
│   │   ├── page.tsx
│   │   ├── [id]/               # Individual patient pages
│   │   │   └── page.tsx
│   │   └── add/                # Add patient page (deprecated)
│   │       └── page.tsx
│   ├── tasks/                   # Task management
│   │   └── page.tsx
│   ├── doctors/                 # Doctor management
│   │   └── page.tsx
│   ├── login/                   # Authentication
│   │   └── page.tsx
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── public/                      # Static assets
│   ├── avatars/                 # User profile images
│   └── ...
├── components.json              # Shadcn UI configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── next.config.ts               # Next.js configuration
└── README.md                    # Project documentation
```

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js 18+
- Yarn package manager

### **Installation**

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd doctors
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start the development server**

   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### **Available Scripts**

```bash
# Development
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint

# Testing
yarn test         # Run tests with Playwright
```

## 🔐 **Authentication**

The application includes a simple authentication system with demo credentials:

- **Admin**: `admin@clinic.com` / `admin123`
- **Doctor**: `smith@clinic.com` / `doctor123`

## 📊 **Key Features in Detail**

### **Prescription Management**

- **Smart Autocomplete**: Search from 50+ medicines with instant suggestions
- **Chips Interface**: Add multiple prescriptions with individual dosage settings
- **Medicine Database**: Expandable database with categories and dosages
- **Inline Editing**: Modify dosage, frequency, duration, and instructions

### **Gantt Chart Tasks**

- **Timeline View**: Visual task scheduling with week/month navigation
- **Task Cards**: Detailed task information with progress tracking
- **Status Management**: Start, complete, and track task progress
- **Priority Colors**: Visual priority indicators (high/medium/low)

### **Dashboard Analytics**

- **Patient Metrics**: Total patients, growth trends, demographics
- **Consultation Stats**: Today's appointments, completed sessions
- **Revenue Tracking**: Financial performance and earnings
- **Interactive Charts**: Recharts-powered data visualization

## 🎯 **Use Cases**

- **Medical Practices**: Complete practice management solution
- **Clinics**: Patient and consultation management
- **Hospitals**: Department-level task and patient tracking
- **Telemedicine**: Remote consultation management
- **Medical Research**: Patient data collection and analysis

## 🔧 **Customization**

### **Adding New Medicines**

The medicine database can be easily extended by modifying `app/lib/medicines.ts`:

```typescript
export const MEDICINE_DATABASE: Medicine[] = [
  {
    id: "new-medicine-id",
    name: "New Medicine",
    genericName: "Generic Name",
    dosage: "100mg",
    form: "tablet",
    category: "Category",
    description: "Medicine description",
  },
  // ... more medicines
];
```

### **Theming**

Customize the appearance by modifying `app/globals.css` and Tailwind configuration.

## 📱 **Responsive Design**

The application is fully responsive and optimized for:

- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Adapted layout with collapsible sidebar
- **Mobile**: Touch-optimized interface with mobile navigation

## 🧪 **Testing**

The project includes comprehensive testing with Playwright:

- **E2E Tests**: Full user journey testing
- **Component Tests**: Individual component validation
- **Integration Tests**: Feature integration verification

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Shadcn UI** for the beautiful component library
- **Next.js Team** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the comprehensive icon set
- **Recharts** for the data visualization capabilities

---

**Built with ❤️ for the medical community**
