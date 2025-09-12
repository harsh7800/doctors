"use client";

import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { ageGroup: "0-18", count: 45, fill: "var(--color-0-18)" },
  { ageGroup: "19-35", count: 78, fill: "var(--color-19-35)" },
  { ageGroup: "36-50", count: 92, fill: "var(--color-36-50)" },
  { ageGroup: "51-65", count: 67, fill: "var(--color-51-65)" },
  { ageGroup: "65+", count: 38, fill: "var(--color-65+)" },
];

const chartConfig = {
  count: {
    label: "Patients",
  },
  "0-18": {
    label: "0-18 years",
    color: "var(--chart-1)",
  },
  "19-35": {
    label: "19-35 years",
    color: "var(--chart-2)",
  },
  "36-50": {
    label: "36-50 years",
    color: "var(--chart-3)",
  },
  "51-65": {
    label: "51-65 years",
    color: "var(--chart-4)",
  },
  "65+": {
    label: "65+ years",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function ChartPatientDemographics() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="ageGroup"
          innerRadius={60}
          strokeWidth={5}
        />
      </PieChart>
    </ChartContainer>
  );
}
