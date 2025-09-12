export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: "tablet" | "capsule" | "syrup" | "injection" | "cream" | "drops";
  category: string;
}

export const MEDICINE_DATABASE: Medicine[] = [
  // Pain Relief
  {
    id: "1",
    name: "Paracetamol",
    genericName: "Acetaminophen",
    dosage: "500mg",
    form: "tablet",
    category: "Pain Relief",
  },
  {
    id: "2",
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    dosage: "400mg",
    form: "tablet",
    category: "Pain Relief",
  },
  {
    id: "3",
    name: "Aspirin",
    genericName: "Acetylsalicylic Acid",
    dosage: "100mg",
    form: "tablet",
    category: "Pain Relief",
  },
  {
    id: "4",
    name: "Diclofenac",
    genericName: "Diclofenac Sodium",
    dosage: "50mg",
    form: "tablet",
    category: "Pain Relief",
  },

  // Antibiotics
  {
    id: "5",
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    dosage: "500mg",
    form: "capsule",
    category: "Antibiotic",
  },
  {
    id: "6",
    name: "Azithromycin",
    genericName: "Azithromycin",
    dosage: "250mg",
    form: "tablet",
    category: "Antibiotic",
  },
  {
    id: "7",
    name: "Ciprofloxacin",
    genericName: "Ciprofloxacin",
    dosage: "500mg",
    form: "tablet",
    category: "Antibiotic",
  },
  {
    id: "8",
    name: "Cephalexin",
    genericName: "Cephalexin",
    dosage: "500mg",
    form: "capsule",
    category: "Antibiotic",
  },

  // Cardiovascular
  {
    id: "9",
    name: "Amlodipine",
    genericName: "Amlodipine Besylate",
    dosage: "5mg",
    form: "tablet",
    category: "Cardiovascular",
  },
  {
    id: "10",
    name: "Metoprolol",
    genericName: "Metoprolol Tartrate",
    dosage: "50mg",
    form: "tablet",
    category: "Cardiovascular",
  },
  {
    id: "11",
    name: "Lisinopril",
    genericName: "Lisinopril",
    dosage: "10mg",
    form: "tablet",
    category: "Cardiovascular",
  },
  {
    id: "12",
    name: "Atorvastatin",
    genericName: "Atorvastatin Calcium",
    dosage: "20mg",
    form: "tablet",
    category: "Cardiovascular",
  },

  // Diabetes
  {
    id: "13",
    name: "Metformin",
    genericName: "Metformin HCl",
    dosage: "500mg",
    form: "tablet",
    category: "Diabetes",
  },
  {
    id: "14",
    name: "Glibenclamide",
    genericName: "Glibenclamide",
    dosage: "5mg",
    form: "tablet",
    category: "Diabetes",
  },
  {
    id: "15",
    name: "Insulin Glargine",
    genericName: "Insulin Glargine",
    dosage: "100 units/ml",
    form: "injection",
    category: "Diabetes",
  },

  // Respiratory
  {
    id: "16",
    name: "Salbutamol",
    genericName: "Salbutamol Sulfate",
    dosage: "2mg",
    form: "tablet",
    category: "Respiratory",
  },
  {
    id: "17",
    name: "Montelukast",
    genericName: "Montelukast Sodium",
    dosage: "10mg",
    form: "tablet",
    category: "Respiratory",
  },
  {
    id: "18",
    name: "Budesonide",
    genericName: "Budesonide",
    dosage: "200mcg",
    form: "inhaler",
    category: "Respiratory",
  },

  // Gastrointestinal
  {
    id: "19",
    name: "Omeprazole",
    genericName: "Omeprazole",
    dosage: "20mg",
    form: "capsule",
    category: "Gastrointestinal",
  },
  {
    id: "20",
    name: "Ranitidine",
    genericName: "Ranitidine HCl",
    dosage: "150mg",
    form: "tablet",
    category: "Gastrointestinal",
  },
  {
    id: "21",
    name: "Loperamide",
    genericName: "Loperamide HCl",
    dosage: "2mg",
    form: "tablet",
    category: "Gastrointestinal",
  },

  // Dermatology
  {
    id: "22",
    name: "Hydrocortisone",
    genericName: "Hydrocortisone",
    dosage: "1%",
    form: "cream",
    category: "Dermatology",
  },
  {
    id: "23",
    name: "Clotrimazole",
    genericName: "Clotrimazole",
    dosage: "1%",
    form: "cream",
    category: "Dermatology",
  },
  {
    id: "24",
    name: "Betamethasone",
    genericName: "Betamethasone Dipropionate",
    dosage: "0.05%",
    form: "cream",
    category: "Dermatology",
  },

  // Vitamins & Supplements
  {
    id: "25",
    name: "Vitamin D3",
    genericName: "Cholecalciferol",
    dosage: "1000 IU",
    form: "tablet",
    category: "Vitamins",
  },
  {
    id: "26",
    name: "Vitamin B12",
    genericName: "Cyanocobalamin",
    dosage: "1000mcg",
    form: "tablet",
    category: "Vitamins",
  },
  {
    id: "27",
    name: "Folic Acid",
    genericName: "Folic Acid",
    dosage: "5mg",
    form: "tablet",
    category: "Vitamins",
  },
  {
    id: "28",
    name: "Iron Supplement",
    genericName: "Ferrous Sulfate",
    dosage: "325mg",
    form: "tablet",
    category: "Vitamins",
  },
];

export function searchMedicines(query: string): Medicine[] {
  if (!query.trim()) return [];

  const lowercaseQuery = query.toLowerCase();
  return MEDICINE_DATABASE.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(lowercaseQuery) ||
      medicine.genericName.toLowerCase().includes(lowercaseQuery) ||
      medicine.category.toLowerCase().includes(lowercaseQuery)
  ).slice(0, 10); // Limit to 10 results
}
