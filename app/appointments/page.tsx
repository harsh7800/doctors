"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope, Plus, Search, Filter } from "lucide-react";
import { LocalStorage } from "@/lib/storage";
import { Consultation, Patient, Doctor } from "@/lib/types";
import PrescriptionChips from "@/components/PrescriptionChips";
import { PrescriptionChip } from "@/components/PrescriptionChips";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "scheduled" | "completed" | "cancelled"
  >("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    duration: "30",
    status: "scheduled" as "scheduled" | "completed" | "cancelled",
    symptoms: "",
    diagnosis: "",
    prescriptions: [] as PrescriptionChip[],
    notes: "",
  });

  useEffect(() => {
    const loadData = () => {
      const consultationsData = LocalStorage.getConsultations();
      const patientsData = LocalStorage.getPatients();
      const doctorsData = LocalStorage.getDoctors();

      setConsultations(consultationsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    };

    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.patientId ||
      !formData.doctorId ||
      !formData.date ||
      !formData.time
    ) {
      return;
    }

    const newConsultation: Consultation = {
      id: Date.now().toString(),
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      date: formData.date,
      time: formData.time,
      duration: parseInt(formData.duration),
      status: formData.status,
      symptoms: formData.symptoms,
      diagnosis: formData.diagnosis,
      prescriptions: formData.prescriptions,
      notes: formData.notes,
      type: "consultation",
      createdAt: new Date(),
    };

    LocalStorage.addConsultation(newConsultation);

    // Reload data
    setConsultations(LocalStorage.getConsultations());

    // Reset form
    setFormData({
      patientId: "",
      doctorId: "",
      date: "",
      time: "",
      duration: "30",
      status: "scheduled",
      symptoms: "",
      diagnosis: "",
      prescriptions: [],
      notes: "",
    });

    setIsDialogOpen(false);
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : "Unknown Patient";
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    return doctor ? doctor.name : "Unknown Doctor";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter consultations
  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      getPatientName(consultation.patientId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      consultation.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || consultation.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Sort by date and time
  const sortedConsultations = filteredConsultations.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  const today = new Date().toISOString().split("T")[0];
  const todayConsultations = sortedConsultations.filter(
    (consultation) => consultation.date === today
  );
  const upcomingConsultations = sortedConsultations.filter(
    (consultation) => consultation.date > today
  );
  const pastConsultations = sortedConsultations.filter(
    (consultation) => consultation.date < today
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Medical Consultations
            </h1>
            <p className="text-muted-foreground">
              Manage patient consultations and medical records
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Consultation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Consultation</DialogTitle>
                <DialogDescription>
                  Create a new consultation for a patient
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient</Label>
                    <Select
                      value={formData.patientId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, patientId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Doctor</Label>
                    <Select
                      value={formData.doctorId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, doctorId: value })
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
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) =>
                        setFormData({ ...formData, duration: value })
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

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="Describe the patient's symptoms"
                      value={formData.symptoms}
                      onChange={(e) =>
                        setFormData({ ...formData, symptoms: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Textarea
                      id="diagnosis"
                      placeholder="Enter the diagnosis"
                      value={formData.diagnosis}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          diagnosis: e.target.value,
                        })
                      }
                    />
                  </div>
                  <PrescriptionChips
                    value={formData.prescriptions}
                    onChange={(prescriptions) =>
                      setFormData({ ...formData, prescriptions })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Schedule Consultation</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consultations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayConsultations.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {upcomingConsultations.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  consultations.filter(
                    (consultation) => consultation.status === "completed"
                  ).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by patient name, symptoms, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={filterStatus}
              onValueChange={(value: string) =>
                setFilterStatus(
                  value as "all" | "scheduled" | "completed" | "cancelled"
                )
              }
            >
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Today's Consultations */}
        {todayConsultations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Today&apos;s Consultations
            </h2>
            <div className="grid gap-4">
              {todayConsultations.map((consultation) => (
                <Card
                  key={consultation.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Stethoscope className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">
                              {getPatientName(consultation.patientId)}
                            </h3>
                            <Badge
                              className={getStatusColor(consultation.status)}
                            >
                              {consultation.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getDoctorName(consultation.doctorId)} •{" "}
                            {consultation.time} ({consultation.duration} min)
                          </p>
                          <p className="text-sm mt-1">
                            <strong>Symptoms:</strong> {consultation.symptoms}
                          </p>
                          {consultation.diagnosis && (
                            <p className="text-sm mt-1 text-green-600">
                              <strong>Diagnosis:</strong>{" "}
                              {consultation.diagnosis}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Consultations */}
        {upcomingConsultations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Upcoming</h2>
            <div className="grid gap-4">
              {upcomingConsultations.map((consultation) => (
                <Card
                  key={consultation.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Stethoscope className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">
                              {getPatientName(consultation.patientId)}
                            </h3>
                            <Badge
                              className={getStatusColor(consultation.status)}
                            >
                              {consultation.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getDoctorName(consultation.doctorId)} •{" "}
                            {consultation.date} at {consultation.time} (
                            {consultation.duration} min)
                          </p>
                          <p className="text-sm mt-1">
                            <strong>Symptoms:</strong> {consultation.symptoms}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Past Consultations */}
        {pastConsultations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Past Consultations</h2>
            <div className="grid gap-4">
              {pastConsultations.map((consultation) => (
                <Card
                  key={consultation.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Stethoscope className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">
                              {getPatientName(consultation.patientId)}
                            </h3>
                            <Badge
                              className={getStatusColor(consultation.status)}
                            >
                              {consultation.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getDoctorName(consultation.doctorId)} •{" "}
                            {consultation.date} at {consultation.time} (
                            {consultation.duration} min)
                          </p>
                          <p className="text-sm mt-1">
                            <strong>Symptoms:</strong> {consultation.symptoms}
                          </p>
                          {consultation.diagnosis && (
                            <p className="text-sm mt-1 text-green-600">
                              <strong>Diagnosis:</strong>{" "}
                              {consultation.diagnosis}
                            </p>
                          )}
                          {consultation.prescriptions &&
                            consultation.prescriptions.length > 0 && (
                              <div className="text-sm mt-1">
                                <strong>Prescriptions:</strong>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {consultation.prescriptions.map(
                                    (
                                      prescription: PrescriptionChip,
                                      index: number
                                    ) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {prescription.medicine?.name ||
                                          "Unknown Medicine"}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {consultations.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Stethoscope className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No consultations found
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by scheduling your first consultation."}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Consultation
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
