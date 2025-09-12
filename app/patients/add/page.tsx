"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LocalStorage } from "@/lib/storage";
import { Patient } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ArrowLeft, UserPlus, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AddPatientPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [duplicatePatients, setDuplicatePatients] = useState<Patient[]>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    preferredLanguage: "",
    city: "",
    address: "",
    pinCode: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Check for duplicates when name changes
    if (field === "name" && value.length > 2) {
      const existingPatients = LocalStorage.getPatients();
      const duplicates = existingPatients.filter((patient) =>
        patient.name.toLowerCase().includes(value.toLowerCase())
      );
      setDuplicatePatients(duplicates);
      setShowDuplicateWarning(duplicates.length > 0);
    } else if (field === "name" && value.length <= 2) {
      setDuplicatePatients([]);
      setShowDuplicateWarning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.phone ||
        !formData.gender ||
        !formData.dateOfBirth
      ) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      // Check for exact duplicate
      const existingPatients = LocalStorage.getPatients();
      const exactDuplicate = existingPatients.find(
        (patient) =>
          patient.name.toLowerCase() === formData.name.toLowerCase() &&
          patient.phone === formData.phone
      );

      if (exactDuplicate) {
        setError("A patient with this name and phone number already exists");
        setIsLoading(false);
        return;
      }

      // Create new patient
      const newPatient: Patient = {
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender as "male" | "female" | "other",
        dateOfBirth: formData.dateOfBirth,
        preferredLanguage: formData.preferredLanguage || "English",
        city: formData.city,
        address: formData.address,
        pinCode: formData.pinCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      LocalStorage.addPatient(newPatient);

      // Redirect to patient overview
      router.push(`/patients/${newPatient.id}`);
    } catch (err) {
      setError("An error occurred while adding the patient");
      console.error("Error adding patient:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectDuplicate = (patient: Patient) => {
    router.push(`/patients/${patient.id}`);
  };

  if (!user) {
    return null;
  }

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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Patient
            </h1>
            <p className="text-gray-600">
              Register a new patient in the system
            </p>
          </div>
        </div>

        {/* Duplicate Warning */}
        {showDuplicateWarning && duplicatePatients.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Similar patients found. Please review before proceeding:</p>
                <div className="space-y-1">
                  {duplicatePatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-gray-600">
                          {patient.phone} • {patient.city}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => selectDuplicate(patient)}
                      >
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Patient Information
                </CardTitle>
                <CardDescription>
                  Enter the patient&apos;s basic information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter patient's full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          handleInputChange("gender", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="preferredLanguage">
                        Preferred Language
                      </Label>
                      <Select
                        value={formData.preferredLanguage}
                        onValueChange={(value) =>
                          handleInputChange("preferredLanguage", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Tamil">Tamil</SelectItem>
                          <SelectItem value="Telugu">Telugu</SelectItem>
                          <SelectItem value="Bengali">Bengali</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder="Enter city"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Enter full address"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pinCode">Pin Code</Label>
                    <Input
                      id="pinCode"
                      value={formData.pinCode}
                      onChange={(e) =>
                        handleInputChange("pinCode", e.target.value)
                      }
                      placeholder="Enter pin code"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Adding Patient..." : "Add Patient"}
                    </Button>
                    <Link href="/patients">
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Required Fields:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Full Name</li>
                    <li>Phone Number</li>
                    <li>Gender</li>
                    <li>Date of Birth</li>
                  </ul>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Duplicate Check:</p>
                  <p className="mt-1">
                    The system will check for similar names and alert you if
                    duplicates are found.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
