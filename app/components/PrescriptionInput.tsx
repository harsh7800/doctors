"use client";

import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus, Search } from "lucide-react";
import { searchMedicines, Medicine } from "@/lib/medicines";

interface PrescriptionItem {
  id: string;
  medicine: Medicine;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionInputProps {
  value: PrescriptionItem[];
  onChange: (prescriptions: PrescriptionItem[]) => void;
}

export default function PrescriptionInput({
  value,
  onChange,
}: PrescriptionInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
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
    setSelectedMedicine(medicine);
    setDosage(medicine.dosage);
    setSearchQuery("");
    setShowResults(false);
  };

  const handleAddPrescription = () => {
    if (selectedMedicine && dosage && frequency && duration) {
      const newPrescription: PrescriptionItem = {
        id: Date.now().toString(),
        medicine: selectedMedicine,
        dosage,
        frequency,
        duration,
        instructions,
      };
      onChange([...value, newPrescription]);
      setSelectedMedicine(null);
      setDosage("");
      setFrequency("");
      setDuration("");
      setInstructions("");
    }
  };

  const handleRemovePrescription = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <Label>Prescription</Label>

      {/* Search and Add Medicine */}
      <div className="space-y-4">
        <div className="relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search medicines..."
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

        {selectedMedicine && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{selectedMedicine.name}</h4>
                    <p className="text-sm text-gray-500">
                      {selectedMedicine.genericName}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMedicine(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      placeholder="e.g., 500mg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Input
                      id="frequency"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      placeholder="e.g., Twice daily"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 7 days"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructions">Instructions</Label>
                    <Input
                      id="instructions"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g., Take with food"
                    />
                  </div>
                </div>

                <Button onClick={handleAddPrescription} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Prescription
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Current Prescriptions */}
      {value.length > 0 && (
        <div className="space-y-2">
          <Label>Current Prescriptions</Label>
          {value.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.medicine.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.medicine.category}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {item.dosage} • {item.frequency} • {item.duration}
                    </div>
                    {item.instructions && (
                      <div className="text-sm text-gray-600 mt-1">
                        Instructions: {item.instructions}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePrescription(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
