"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LocalStorage } from "@/lib/storage";
import { Patient, Appointment, Consultation, Doctor } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ArrowLeft,
  Calendar,
  Phone,
  MapPin,
  User,
  Clock,
  FileText,
  Plus,
  Edit,
} from "lucide-react";
import Link from "next/link";

export default function PatientOverviewPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    type: "appointment" as "appointment" | "consultation",
    doctorId: "",
    date: "",
    time: "",
    duration: "30",
    reason: "",
    symptoms: "",
    diagnosis: "",
    prescription: "",
    notes: "",
    status: "scheduled" as "scheduled" | "completed" | "cancelled",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const patientId = params.id as string;
    const allPatients = LocalStorage.getPatients();
    const foundPatient = allPatients.find((p) => p.id === patientId);

    if (!foundPatient) {
      router.push("/patients");
      return;
    }

    setPatient(foundPatient);

    // Get patient's appointments
    const allAppointments = LocalStorage.getAppointments();
    const patientAppointments = allAppointments.filter(
      (apt) => apt.patientId === patientId
    );
    setAppointments(patientAppointments);

    // Get patient's consultations
    const allConsultations = LocalStorage.getConsultations();
    const patientConsultations = allConsultations.filter(
      (cons) => cons.patientId === patientId
    );
    setConsultations(patientConsultations);

    // Get doctors
    const allDoctors = LocalStorage.getDoctors();
    setDoctors(allDoctors);

    setIsLoading(false);
  }, [user, params.id, router]);

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patient) return;

    if (appointmentForm.type === "appointment") {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patientId: patient.id,
        doctorId: appointmentForm.doctorId,
        date: appointmentForm.date,
        time: appointmentForm.time,
        duration: parseInt(appointmentForm.duration),
        reason: appointmentForm.reason,
        status: appointmentForm.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      LocalStorage.addAppointment(newAppointment);
    } else {
      const newConsultation: Consultation = {
        id: Date.now().toString(),
        patientId: patient.id,
        doctorId: appointmentForm.doctorId,
        date: appointmentForm.date,
        time: appointmentForm.time,
        duration: parseInt(appointmentForm.duration),
        symptoms: appointmentForm.symptoms,
        diagnosis: appointmentForm.diagnosis,
        prescriptions: [],
        notes: appointmentForm.notes,
        status: appointmentForm.status,
        type: "consultation",
        createdAt: new Date(),
      };
      LocalStorage.addConsultation(newConsultation);
    }

    // Reload data
    const allAppointments = LocalStorage.getAppointments();
    const allConsultations = LocalStorage.getConsultations();
    const patientAppointments = allAppointments.filter(
      (apt) => apt.patientId === patient.id
    );
    const patientConsultations = allConsultations.filter(
      (consult) => consult.patientId === patient.id
    );

    setAppointments(patientAppointments);
    setConsultations(patientConsultations);
    setIsAppointmentDialogOpen(false);

    // Reset form
    setAppointmentForm({
      type: "appointment",
      doctorId: "",
      date: "",
      time: "",
      duration: "30",
      reason: "",
      symptoms: "",
      diagnosis: "",
      prescription: "",
      notes: "",
      status: "scheduled",
    });
  };

  if (!user || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading patient...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Patient not found</p>
          <Link href="/patients">
            <Button className="mt-4">Back to Patients</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}`);
    return date.toLocaleString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/patients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patients
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600">Patient Overview & Medical History</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Dialog
              open={isAppointmentDialogOpen}
              onOpenChange={setIsAppointmentDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Schedule New Appointment/Consultation
                  </DialogTitle>
                  <DialogDescription>
                    Create a new appointment or consultation for {patient.name}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={appointmentForm.type}
                        onValueChange={(
                          value: "appointment" | "consultation"
                        ) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            type: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appointment">
                            Appointment
                          </SelectItem>
                          <SelectItem value="consultation">
                            Consultation
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor">Doctor</Label>
                      <Select
                        value={appointmentForm.doctorId}
                        onValueChange={(value) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            doctorId: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={appointmentForm.date}
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            date: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={appointmentForm.time}
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            time: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (min)</Label>
                      <Select
                        value={appointmentForm.duration}
                        onValueChange={(value) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            duration: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {appointmentForm.type === "appointment" ? (
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Appointment</Label>
                      <Textarea
                        id="reason"
                        placeholder="Enter the reason for the appointment"
                        value={appointmentForm.reason}
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            reason: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="symptoms">Symptoms</Label>
                        <Textarea
                          id="symptoms"
                          placeholder="Describe the patient's symptoms"
                          value={appointmentForm.symptoms}
                          onChange={(e) =>
                            setAppointmentForm({
                              ...appointmentForm,
                              symptoms: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="diagnosis">Diagnosis</Label>
                        <Textarea
                          id="diagnosis"
                          placeholder="Enter the diagnosis"
                          value={appointmentForm.diagnosis}
                          onChange={(e) =>
                            setAppointmentForm({
                              ...appointmentForm,
                              diagnosis: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prescription">Prescription</Label>
                        <Textarea
                          id="prescription"
                          placeholder="Enter prescribed medications and instructions"
                          value={appointmentForm.prescription}
                          onChange={(e) =>
                            setAppointmentForm({
                              ...appointmentForm,
                              prescription: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional notes"
                      value={appointmentForm.notes}
                      onChange={(e) =>
                        setAppointmentForm({
                          ...appointmentForm,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAppointmentDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Schedule</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Patient Info Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Age</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {calculateAge(patient.dateOfBirth)} years
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Phone className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {patient.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {patient.city}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Appointments
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {appointments.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Details and History */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Patient Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Full Name</p>
                  <p className="text-gray-900">{patient.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Gender</p>
                  <Badge variant="outline" className="capitalize">
                    {patient.gender}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Date of Birth
                  </p>
                  <p className="text-gray-900">
                    {formatDate(patient.dateOfBirth)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Preferred Language
                  </p>
                  <p className="text-gray-900">{patient.preferredLanguage}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Address</p>
                  <p className="text-gray-900">
                    {patient.address || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pin Code</p>
                  <p className="text-gray-900">
                    {patient.pinCode || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Registered
                  </p>
                  <p className="text-gray-900">
                    {formatDate(patient.createdAt.toString())}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Medical Timeline
                </CardTitle>
                <CardDescription>
                  Combined view of appointments and consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 && consultations.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No medical records yet</p>
                    <div className="flex gap-2 justify-center">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Appointment
                      </Button>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Add Consultation
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Combined Timeline */}
                    {[...consultations]
                      .sort((a, b) => {
                        const dateA = new Date(`${a.date}T${a.time}`);
                        const dateB = new Date(`${b.date}T${b.time}`);
                        return dateB.getTime() - dateA.getTime();
                      })
                      .map((item, index) => {
                        const isAppointment = "date" in item;

                        return (
                          <div key={item.id} className="relative">
                            {/* Timeline line */}
                            {index <
                              [...appointments, ...consultations].length -
                                1 && (
                              <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200"></div>
                            )}

                            <div className="flex items-start gap-4">
                              {/* Timeline dot */}
                              <div
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                  isAppointment
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {isAppointment ? (
                                  <Calendar className="h-4 w-4" />
                                ) : (
                                  <FileText className="h-4 w-4" />
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="bg-white border rounded-lg p-4 shadow-sm">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-medium text-gray-900">
                                        {isAppointment
                                          ? "Appointment"
                                          : "Consultation"}
                                      </h3>
                                      <Badge
                                        variant={
                                          isAppointment
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {isAppointment
                                          ? "Appointment"
                                          : "Consultation"}
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {formatDateTime(item.date, item.time)}
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">
                                        Symptoms
                                      </p>
                                      <p className="text-sm text-gray-900">
                                        {item.symptoms}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">
                                        Diagnosis
                                      </p>
                                      <p className="text-sm text-gray-900">
                                        {item.diagnosis}
                                      </p>
                                    </div>
                                    {item.prescriptions.length > 0 && (
                                      <div>
                                        <p className="text-sm font-medium text-gray-600">
                                          Prescription
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {item.prescriptions.map(
                                            (medicine, medIndex) => (
                                              <Badge
                                                key={medIndex}
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {medicine.medicine?.name ||
                                                  "Unknown Medicine"}
                                              </Badge>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    {item.notes && (
                                      <div>
                                        <p className="text-sm font-medium text-gray-600">
                                          Notes
                                        </p>
                                        <p className="text-sm text-gray-900">
                                          {item.notes}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
