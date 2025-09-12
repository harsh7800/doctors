"use client";

import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X, Plus, Search, Pill } from "lucide-react";
import { searchMedicines, Medicine, MEDICINE_DATABASE } from "@/lib/medicines";

interface PrescriptionChip {
  id: string;
  medicine: Medicine;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionChipsProps {
  value: PrescriptionChip[];
  onChange: (prescriptions: PrescriptionChip[]) => void;
}

export default function PrescriptionChips({
  value,
  onChange,
}: PrescriptionChipsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    genericName: "",
    dosage: "",
    form: "tablet" as const,
    category: "",
  });
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchMedicines(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMedicineSelect = (medicine: Medicine) => {
    const newPrescription: PrescriptionChip = {
      id: Date.now().toString(),
      medicine,
      dosage: medicine.dosage,
      frequency: "Twice daily",
      duration: "7 days",
      instructions: "Take with food",
    };
    onChange([...value, newPrescription]);
    setSearchQuery("");
    setShowResults(false);
  };

  const handleRemovePrescription = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const handleUpdatePrescription = (
    id: string,
    field: keyof PrescriptionChip,
    newValue: string
  ) => {
    onChange(
      value.map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      )
    );
  };

  const handleAddNewMedicine = () => {
    if (
      newMedicine.name &&
      newMedicine.genericName &&
      newMedicine.dosage &&
      newMedicine.category
    ) {
      const medicine: Medicine = {
        id: (MEDICINE_DATABASE.length + 1).toString(),
        ...newMedicine,
      };

      // Add to database (in a real app, this would be an API call)
      MEDICINE_DATABASE.push(medicine);

      // Add as prescription
      handleMedicineSelect(medicine);

      // Reset form
      setNewMedicine({
        name: "",
        genericName: "",
        dosage: "",
        form: "tablet",
        category: "",
      });
      setIsAddMedicineOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Prescription</Label>

      {/* Search Input */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search medicines or add new..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {showResults && searchResults.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
            <CardContent className="p-2">
              {searchResults.map((medicine) => (
                <div
                  key={medicine.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer rounded"
                  onClick={() => handleMedicineSelect(medicine)}
                >
                  <div>
                    <div className="font-medium">{medicine.name}</div>
                    <div className="text-sm text-gray-500">
                      {medicine.genericName} • {medicine.dosage} •{" "}
                      {medicine.form}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {medicine.category}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add New Medicine Dialog */}
      <Dialog open={isAddMedicineOpen} onOpenChange={setIsAddMedicineOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Medicine
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Medicine to Database</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="medicineName">Medicine Name</Label>
                <Input
                  id="medicineName"
                  value={newMedicine.name}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, name: e.target.value })
                  }
                  placeholder="e.g., Paracetamol"
                />
              </div>
              <div>
                <Label htmlFor="genericName">Generic Name</Label>
                <Input
                  id="genericName"
                  value={newMedicine.genericName}
                  onChange={(e) =>
                    setNewMedicine({
                      ...newMedicine,
                      genericName: e.target.value,
                    })
                  }
                  placeholder="e.g., Acetaminophen"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={newMedicine.dosage}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, dosage: e.target.value })
                  }
                  placeholder="e.g., 500mg"
                />
              </div>
              <div>
                <Label htmlFor="form">Form</Label>
                <select
                  id="form"
                  value={newMedicine.form}
                  onChange={(e) =>
                    setNewMedicine({
                      ...newMedicine,
                      form: e.target.value as any,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="tablet">Tablet</option>
                  <option value="capsule">Capsule</option>
                  <option value="syrup">Syrup</option>
                  <option value="injection">Injection</option>
                  <option value="cream">Cream</option>
                  <option value="drops">Drops</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newMedicine.category}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, category: e.target.value })
                }
                placeholder="e.g., Pain Relief, Antibiotic"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddMedicineOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddNewMedicine}>Add Medicine</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Prescription Chips */}
      {value.length > 0 && (
        <div className="space-y-2">
          <Label>Current Prescriptions</Label>
          <div className="flex flex-wrap gap-2">
            {value.map((item) => (
              <Card key={item.id} className="p-3 min-w-0 flex-1 max-w-sm">
                <CardContent className="p-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">
                          {item.medicine.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.medicine.category}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePrescription(item.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <Label className="text-xs text-gray-500">Dosage</Label>
                        <Input
                          value={item.dosage}
                          onChange={(e) =>
                            handleUpdatePrescription(
                              item.id,
                              "dosage",
                              e.target.value
                            )
                          }
                          className="h-6 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">
                          Frequency
                        </Label>
                        <Input
                          value={item.frequency}
                          onChange={(e) =>
                            handleUpdatePrescription(
                              item.id,
                              "frequency",
                              e.target.value
                            )
                          }
                          className="h-6 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">
                          Duration
                        </Label>
                        <Input
                          value={item.duration}
                          onChange={(e) =>
                            handleUpdatePrescription(
                              item.id,
                              "duration",
                              e.target.value
                            )
                          }
                          className="h-6 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">
                          Instructions
                        </Label>
                        <Input
                          value={item.instructions}
                          onChange={(e) =>
                            handleUpdatePrescription(
                              item.id,
                              "instructions",
                              e.target.value
                            )
                          }
                          className="h-6 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
