import {
  User,
  Doctor,
  Patient,
  Appointment,
  Consultation,
  Task,
  Analytics,
} from "./types";

const STORAGE_KEYS = {
  USERS: "doctors_users",
  DOCTORS: "doctors_doctors",
  PATIENTS: "doctors_patients",
  APPOINTMENTS: "doctors_appointments",
  CONSULTATIONS: "doctors_consultations",
  TASKS: "doctors_tasks",
  CURRENT_USER: "doctors_current_user",
} as const;

export class LocalStorage {
  // Generic methods for any data type
  static get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error);
      return null;
    }
  }

  static set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error);
    }
  }

  static remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage key ${key}:`, error);
    }
  }

  // User management
  static getUsers(): User[] {
    return this.get<User[]>(STORAGE_KEYS.USERS) || [];
  }

  static setUsers(users: User[]): void {
    this.set(STORAGE_KEYS.USERS, users);
  }

  static getCurrentUser(): User | null {
    return this.get<User>(STORAGE_KEYS.CURRENT_USER);
  }

  static setCurrentUser(user: User | null): void {
    if (user) {
      this.set(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      this.remove(STORAGE_KEYS.CURRENT_USER);
    }
  }

  // Doctor management
  static getDoctors(): Doctor[] {
    return this.get<Doctor[]>(STORAGE_KEYS.DOCTORS) || [];
  }

  static setDoctors(doctors: Doctor[]): void {
    this.set(STORAGE_KEYS.DOCTORS, doctors);
  }

  static addDoctor(doctor: Doctor): void {
    const doctors = this.getDoctors();
    doctors.push(doctor);
    this.setDoctors(doctors);
  }

  static updateDoctor(id: string, updates: Partial<Doctor>): void {
    const doctors = this.getDoctors();
    const index = doctors.findIndex((d) => d.id === id);
    if (index !== -1) {
      doctors[index] = { ...doctors[index], ...updates, updatedAt: new Date() };
      this.setDoctors(doctors);
    }
  }

  static deleteDoctor(id: string): void {
    const doctors = this.getDoctors();
    const filteredDoctors = doctors.filter((d) => d.id !== id);
    this.setDoctors(filteredDoctors);
  }

  // Patient management
  static getPatients(): Patient[] {
    return this.get<Patient[]>(STORAGE_KEYS.PATIENTS) || [];
  }

  static setPatients(patients: Patient[]): void {
    this.set(STORAGE_KEYS.PATIENTS, patients);
  }

  static addPatient(patient: Patient): void {
    const patients = this.getPatients();
    patients.push(patient);
    this.setPatients(patients);
  }

  static updatePatient(id: string, updates: Partial<Patient>): void {
    const patients = this.getPatients();
    const index = patients.findIndex((p) => p.id === id);
    if (index !== -1) {
      patients[index] = {
        ...patients[index],
        ...updates,
        updatedAt: new Date(),
      };
      this.setPatients(patients);
    }
  }

  // Appointment management
  static getAppointments(): Appointment[] {
    return this.get<Appointment[]>(STORAGE_KEYS.APPOINTMENTS) || [];
  }

  static setAppointments(appointments: Appointment[]): void {
    this.set(STORAGE_KEYS.APPOINTMENTS, appointments);
  }

  static addAppointment(appointment: Appointment): void {
    const appointments = this.getAppointments();
    appointments.push(appointment);
    this.setAppointments(appointments);
  }

  static updateAppointment(id: string, updates: Partial<Appointment>): void {
    const appointments = this.getAppointments();
    const index = appointments.findIndex((a) => a.id === id);
    if (index !== -1) {
      appointments[index] = {
        ...appointments[index],
        ...updates,
        updatedAt: new Date(),
      };
      this.setAppointments(appointments);
    }
  }

  // Consultation management
  static getConsultations(): Consultation[] {
    return this.get<Consultation[]>(STORAGE_KEYS.CONSULTATIONS) || [];
  }

  static setConsultations(consultations: Consultation[]): void {
    this.set(STORAGE_KEYS.CONSULTATIONS, consultations);
  }

  static addConsultation(consultation: Consultation): void {
    const consultations = this.getConsultations();
    consultations.push(consultation);
    this.setConsultations(consultations);
  }

  // Task management
  static getTasks(): Task[] {
    return this.get<Task[]>(STORAGE_KEYS.TASKS) || [];
  }

  static setTasks(tasks: Task[]): void {
    this.set(STORAGE_KEYS.TASKS, tasks);
  }

  static addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.setTasks(tasks);
  }

  static updateTask(id: string, updates: Partial<Task>): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.setTasks(tasks);
    }
  }

  // Analytics helper
  static getAnalytics(): Analytics {
    const patients = this.getPatients();
    const appointments = this.getAppointments();
    const consultations = this.getConsultations();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return (
        aptDate.getMonth() === currentMonth &&
        aptDate.getFullYear() === currentYear
      );
    });

    const completedAppointments = appointments.filter(
      (apt) => apt.status === "completed"
    );
    const pendingAppointments = appointments.filter(
      (apt) => apt.status === "scheduled"
    );

    // Calculate revenue (assuming $50 per consultation)
    const totalRevenue = consultations.length * 50;
    const monthlyRevenue =
      monthlyAppointments.filter((apt) => apt.status === "completed").length *
      50;

    // Calculate patient growth (this month vs last month)
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const lastMonthPatients = patients.filter((p) => {
      const createdDate = new Date(p.createdAt);
      return (
        createdDate.getMonth() === lastMonth &&
        createdDate.getFullYear() === lastMonthYear
      );
    }).length;

    const currentMonthPatients = patients.filter((p) => {
      const createdDate = new Date(p.createdAt);
      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    }).length;

    const patientGrowth =
      lastMonthPatients > 0
        ? ((currentMonthPatients - lastMonthPatients) / lastMonthPatients) * 100
        : 0;

    // Generate appointment trends for the last 30 days
    const appointmentTrends = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const count = appointments.filter((apt) => apt.date === dateStr).length;
      appointmentTrends.push({ date: dateStr, count });
    }

    return {
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      completedAppointments: completedAppointments.length,
      pendingAppointments: pendingAppointments.length,
      totalRevenue,
      monthlyRevenue,
      patientGrowth,
      appointmentTrends,
    };
  }

  // Initialize with sample data
  static initializeSampleData(): void {
    // Initialize users if they don't exist
    if (this.getUsers().length === 0) {
      const sampleUsers: User[] = [
        {
          id: "1",
          name: "Dr. Admin",
          email: "admin@clinic.com",
          role: "admin",
          password: "admin123",
          createdAt: new Date(),
        },
        {
          id: "2",
          name: "Dr. Smith",
          email: "smith@clinic.com",
          role: "doctor",
          password: "doctor123",
          createdAt: new Date(),
        },
      ];
      this.setUsers(sampleUsers);
    }

    // Initialize doctors if they don't exist
    if (this.getDoctors().length === 0) {
      const sampleDoctors: Doctor[] = [
        {
          id: "1",
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@clinic.com",
          phone: "+1-555-0101",
          specialization: "Cardiology",
          department: "Internal Medicine",
          experience: 8,
          qualifications: ["MD", "Fellowship in Cardiology", "Board Certified"],
          availability: {
            monday: { start: "09:00", end: "17:00", available: true },
            tuesday: { start: "09:00", end: "17:00", available: true },
            wednesday: { start: "09:00", end: "17:00", available: true },
            thursday: { start: "09:00", end: "17:00", available: true },
            friday: { start: "09:00", end: "15:00", available: true },
            saturday: { start: "10:00", end: "14:00", available: true },
            sunday: { start: "10:00", end: "14:00", available: false },
          },
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "Dr. Michael Chen",
          email: "michael.chen@clinic.com",
          phone: "+1-555-0102",
          specialization: "Orthopedics",
          department: "Surgery",
          experience: 12,
          qualifications: [
            "MD",
            "Fellowship in Orthopedic Surgery",
            "Board Certified",
          ],
          availability: {
            monday: { start: "08:00", end: "16:00", available: true },
            tuesday: { start: "08:00", end: "16:00", available: true },
            wednesday: { start: "08:00", end: "16:00", available: true },
            thursday: { start: "08:00", end: "16:00", available: true },
            friday: { start: "08:00", end: "14:00", available: true },
            saturday: { start: "09:00", end: "13:00", available: true },
            sunday: { start: "09:00", end: "13:00", available: false },
          },
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "3",
          name: "Dr. Emily Rodriguez",
          email: "emily.rodriguez@clinic.com",
          phone: "+1-555-0103",
          specialization: "Pediatrics",
          department: "Pediatrics",
          experience: 6,
          qualifications: ["MD", "Residency in Pediatrics", "Board Certified"],
          availability: {
            monday: { start: "09:00", end: "17:00", available: true },
            tuesday: { start: "09:00", end: "17:00", available: true },
            wednesday: { start: "09:00", end: "17:00", available: true },
            thursday: { start: "09:00", end: "17:00", available: true },
            friday: { start: "09:00", end: "17:00", available: true },
            saturday: { start: "10:00", end: "15:00", available: true },
            sunday: { start: "10:00", end: "15:00", available: false },
          },
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "4",
          name: "Dr. James Wilson",
          email: "james.wilson@clinic.com",
          phone: "+1-555-0104",
          specialization: "Neurology",
          department: "Neurology",
          experience: 15,
          qualifications: [
            "MD",
            "PhD",
            "Fellowship in Neurology",
            "Board Certified",
          ],
          availability: {
            monday: { start: "08:30", end: "16:30", available: true },
            tuesday: { start: "08:30", end: "16:30", available: true },
            wednesday: { start: "08:30", end: "16:30", available: true },
            thursday: { start: "08:30", end: "16:30", available: true },
            friday: { start: "08:30", end: "14:30", available: true },
            saturday: { start: "09:00", end: "13:00", available: false },
            sunday: { start: "09:00", end: "13:00", available: false },
          },
          status: "on-leave",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      this.setDoctors(sampleDoctors);
    }

    // Initialize sample tasks if they don't exist
    if (this.getTasks().length === 0) {
      const sampleTasks: Task[] = [
        {
          id: "1",
          doctorId: "1",
          title: "Review patient charts for tomorrow",
          description:
            "Check all scheduled appointments and review patient histories",
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          completed: false,
          createdAt: new Date(),
        },
        {
          id: "2",
          doctorId: "1",
          title: "Update medication dosages",
          description:
            "Review and update medication dosages for chronic patients",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
          completed: false,
          createdAt: new Date(),
        },
        {
          id: "3",
          doctorId: "1",
          title: "Prepare presentation for conference",
          description:
            "Create slides for the upcoming medical conference presentation",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
          completed: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
        {
          id: "4",
          doctorId: "1",
          title: "Follow up with discharged patients",
          description:
            "Call patients who were discharged this week to check on their recovery",
          dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday (overdue)
          completed: false,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
        {
          id: "5",
          doctorId: "1",
          title: "Update clinic protocols",
          description:
            "Review and update standard operating procedures for the clinic",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          completed: false,
          createdAt: new Date(),
        },
      ];
      this.setTasks(sampleTasks);
    }
  }
}
