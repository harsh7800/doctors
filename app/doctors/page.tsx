"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LocalStorage } from "@/lib/storage";
import { Doctor } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  GraduationCap,
  Stethoscope,
  UserCheck,
  UserX,
} from "lucide-react";

export default function DoctorsPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");

  useEffect(() => {
    // Initialize sample data if needed
    LocalStorage.initializeSampleData();

    const allDoctors = LocalStorage.getDoctors();
    console.log("Doctors loaded:", allDoctors);
    setDoctors(allDoctors);
    setFilteredDoctors(allDoctors);
  }, []);

  useEffect(() => {
    let filtered = doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        doctor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedSpecialization !== "all") {
      filtered = filtered.filter(
        (doctor) => doctor.specialization === selectedSpecialization
      );
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialization, doctors]);

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <UserCheck className="h-4 w-4" />;
      case "inactive":
        return <UserX className="h-4 w-4" />;
      case "on-leave":
        return <Clock className="h-4 w-4" />;
      default:
        return <UserCheck className="h-4 w-4" />;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const specializations = Array.from(
    new Set(doctors.map((d) => d.specialization))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
            <p className="text-gray-600">
              Manage doctor profiles and schedules
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Doctor
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search doctors by name, specialization, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {doctors.length}
                </p>
                <p className="text-sm text-gray-600">Total Doctors</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {doctors.filter((d) => d.status === "active").length}
                </p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Specialization Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedSpecialization === "all" ? "default" : "outline"}
            onClick={() => setSelectedSpecialization("all")}
            size="sm"
          >
            All Specializations
          </Button>
          {specializations.map((spec) => (
            <Button
              key={spec}
              variant={selectedSpecialization === spec ? "default" : "outline"}
              onClick={() => setSelectedSpecialization(spec)}
              size="sm"
            >
              {spec}
            </Button>
          ))}
        </div>

        {/* Doctors Grid/Table */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getInitials(doctor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {doctor.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Stethoscope className="h-3 w-3" />
                      {doctor.specialization}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(doctor.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(doctor.status)}
                      {doctor.status}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{doctor.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4" />
                    <span>{doctor.experience} years experience</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Qualifications
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.qualifications.slice(0, 2).map((qual, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {qual}
                      </Badge>
                    ))}
                    {doctor.qualifications.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{doctor.qualifications.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Joined {formatDate(doctor.createdAt.toString())}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedSpecialization !== "all"
                  ? "No doctors found matching your criteria."
                  : "No doctors registered yet."}
              </p>
              {!searchTerm && selectedSpecialization === "all" && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Doctor
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
