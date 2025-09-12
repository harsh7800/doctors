"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { type: "General", count: 45, fill: "var(--color-general)" },
  { type: "Cardiology", count: 32, fill: "var(--color-cardiology)" },
  { type: "Orthopedics", count: 28, fill: "var(--color-orthopedics)" },
  { type: "Pediatrics", count: 24, fill: "var(--color-pediatrics)" },
  { type: "Neurology", count: 18, fill: "var(--color-neurology)" },
  { type: "Dermatology", count: 15, fill: "var(--color-dermatology)" },
];

const chartConfig = {
  count: {
    label: "Appointments",
  },
  general: {
    label: "General",
    color: "var(--chart-1)",
  },
  cardiology: {
    label: "Cardiology",
    color: "var(--chart-2)",
  },
  orthopedics: {
    label: "Orthopedics",
    color: "var(--chart-3)",
  },
  pediatrics: {
    label: "Pediatrics",
    color: "var(--chart-4)",
  },
  neurology: {
    label: "Neurology",
    color: "var(--chart-5)",
  },
  dermatology: {
    label: "Dermatology",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig;

export function ChartAppointmentTypes() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="type"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={10} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-general)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
