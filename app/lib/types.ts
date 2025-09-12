import { PrescriptionChip } from "@/components/PrescriptionChips";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "doctor";
  password: string;
  createdAt: Date;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  department: string;
  experience: number; // years of experience
  qualifications: string[];
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  status: "active" | "inactive" | "on-leave";
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  preferredLanguage: string;
  city: string;
  address: string;
  pinCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  reason: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  createdAt: Date;
  updatedAt: Date;
}

export interface Consultation {
  id: string;
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  status: "scheduled" | "completed" | "cancelled";
  symptoms: string;
  diagnosis: string;
  prescriptions: PrescriptionChip[];
  notes: string;
  type: "consultation";
  createdAt: Date;
}

export interface Task {
  id: string;
  doctorId: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  assignee?: string;
  startDate?: string;
  endDate?: string;
  progress?: number;
  createdAt: Date;
}

export interface Analytics {
  totalPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  patientGrowth: number;
  appointmentTrends: { date: string; count: number }[];
}
