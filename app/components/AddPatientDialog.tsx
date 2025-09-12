"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LocalStorage } from "@/lib/storage";
import { Patient } from "@/lib/types";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, AlertCircle, Loader2 } from "lucide-react";

interface AddPatientDialogProps {
  onPatientAdded?: (patient: Patient) => void;
}

export default function AddPatientDialog({
  onPatientAdded,
}: AddPatientDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
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

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      gender: "",
      dateOfBirth: "",
      preferredLanguage: "",
      city: "",
      address: "",
      pinCode: "",
    });
    setError("");
    setDuplicatePatients([]);
    setShowDuplicateWarning(false);
  };

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

      // Call the callback if provided
      if (onPatientAdded) {
        onPatientAdded(newPatient);
      }

      // Reset form and close dialog
      resetForm();
      setOpen(false);

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
    setOpen(false);
    resetForm();
    router.push(`/patients/${patient.id}`);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Patient
          </DialogTitle>
          <DialogDescription>
            Register a new patient in the system. All fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>

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
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
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
                onChange={(e) => handleInputChange("name", e.target.value)}
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
                onChange={(e) => handleInputChange("phone", e.target.value)}
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
                onValueChange={(value) => handleInputChange("gender", value)}
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
              <Label htmlFor="preferredLanguage">Preferred Language</Label>
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
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter city"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter full address"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pinCode">Pin Code</Label>
            <Input
              id="pinCode"
              value={formData.pinCode}
              onChange={(e) => handleInputChange("pinCode", e.target.value)}
              placeholder="Enter pin code"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Patient...
                </>
              ) : (
                "Add Patient"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
