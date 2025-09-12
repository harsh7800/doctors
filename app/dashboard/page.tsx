"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LocalStorage } from "@/lib/storage";
import { Analytics } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { ChartAppointmentTypes } from "@/components/chart-appointment-types";
import { ChartPatientDemographics } from "@/components/chart-patient-demographics";
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Activity,
  Plus,
  Stethoscope,
  ClipboardList,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    const data = LocalStorage.getAnalytics();
    setAnalytics(data);
  }, []);

  if (!user) {
    return null;
  }

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      name: "Total Patients",
      value: analytics.totalPatients,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "+12.5%",
      trendUp: true,
      description: "Active patients in your care",
    },
    {
      name: "Total Appointments",
      value: analytics.totalAppointments,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "+8.2%",
      trendUp: true,
      description: "Scheduled appointments",
    },
    {
      name: "Completed",
      value: analytics.completedAppointments,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      trend: "+15.3%",
      trendUp: true,
      description: "Successfully completed",
    },
    {
      name: "Pending",
      value: analytics.pendingAppointments,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      trend: "-5.1%",
      trendUp: false,
      description: "Awaiting completion",
    },
    {
      name: "Total Revenue",
      value: `$${analytics.totalRevenue}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "+18.7%",
      trendUp: true,
      description: "Total earnings",
    },
    {
      name: "Monthly Revenue",
      value: `$${analytics.monthlyRevenue}`,
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      trend: "+22.1%",
      trendUp: true,
      description: "This month's earnings",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 page-transition scrollbar-modern">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight gradient-text">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.name}
              className="relative overflow-hidden card-hover group"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription className="text-sm font-medium group-hover:text-primary transition-colors">
                  {stat.name}
                </CardDescription>
                <div
                  className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}
                >
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Badge
                    variant={stat.trendUp ? "default" : "destructive"}
                    className="text-xs btn-smooth"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </Badge>
                  <span>{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Patient Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Patient Growth Trend
              </CardTitle>
              <CardDescription>
                Growth rate compared to last month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold">
                  {analytics.patientGrowth > 0 ? "+" : ""}
                  {analytics.patientGrowth.toFixed(1)}%
                </span>
                <Badge
                  variant={
                    analytics.patientGrowth >= 0 ? "default" : "destructive"
                  }
                >
                  {analytics.patientGrowth >= 0 ? "Growth" : "Decline"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {analytics.patientGrowth >= 0
                  ? "Patient registrations are increasing"
                  : "Patient registrations have decreased"}
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer group hover:shadow-md hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <Plus className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    Add New Patient
                  </span>
                </div>
                <Badge variant="outline" className="btn-smooth">
                  Quick
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer group hover:shadow-md hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    Schedule Appointment
                  </span>
                </div>
                <Badge variant="outline" className="btn-smooth">
                  Quick
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer group hover:shadow-md hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <Stethoscope className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    Start Consultation
                  </span>
                </div>
                <Badge variant="outline" className="btn-smooth">
                  Quick
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Appointments
            </CardTitle>
            <CardDescription>
              Latest appointment activity with enhanced visualization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.appointmentTrends.slice(-7).map((trend, index) => (
                <div
                  key={trend.date}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200 group hover:shadow-md hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {new Date(trend.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {trend.count} appointment{trend.count !== 1 ? "s" : ""}{" "}
                        scheduled
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.min((trend.count / 10) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <Badge variant="outline" className="text-xs btn-smooth">
                      {trend.count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Interactive Chart */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Appointment Trends
              </CardTitle>
              <CardDescription>
                Visual representation of appointment patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartAreaInteractive />
            </CardContent>
          </Card>

          {/* Patient Demographics */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Patient Demographics
              </CardTitle>
              <CardDescription>
                Age distribution of your patient base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartPatientDemographics />
            </CardContent>
          </Card>
        </div>

        {/* Appointment Types Chart */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Appointment Types Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of appointments by medical specialty
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartAppointmentTypes />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
