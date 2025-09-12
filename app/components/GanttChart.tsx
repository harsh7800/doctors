"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  Circle,
  AlertCircle,
} from "lucide-react";
import { Task } from "@/lib/types";

interface GanttChartProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

interface GanttTask {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  startDate: string;
  dueDate: string;
  assignee?: string;
  progress: number;
}

export default function GanttChart({ tasks, onTaskUpdate }: GanttChartProps) {
  const [ganttTasks, setGanttTasks] = useState<GanttTask[]>([]);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const convertedTasks: GanttTask[] = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as any,
      priority: task.priority as any,
      startDate: task.dueDate, // Using dueDate as start for simplicity
      dueDate: task.dueDate,
      assignee: task.assignee,
      progress: task.status === "completed" ? 100 : 0,
    }));
    setGanttTasks(convertedTasks);
  }, [tasks]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDaysInView = () => {
    const start = new Date(currentDate);
    if (viewMode === "week") {
      start.setDate(start.getDate() - start.getDay());
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        return date;
      });
    } else {
      start.setDate(1);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      return Array.from({ length: end.getDate() }, (_, i) => {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        return date;
      });
    }
  };

  const daysInView = getDaysInView();

  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { status: newStatus as any });
    }
    setGanttTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus as any,
              progress: newStatus === "completed" ? 100 : 0,
            }
          : task
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">Task Timeline</h3>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("week")}
            >
              Week
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
            >
              Month
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(
                newDate.getDate() - (viewMode === "week" ? 7 : 30)
              );
              setCurrentDate(newDate);
            }}
          >
            ← Previous
          </Button>
          <span className="text-sm font-medium">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(
                newDate.getDate() + (viewMode === "week" ? 7 : 30)
              );
              setCurrentDate(newDate);
            }}
          >
            Next →
          </Button>
        </div>
      </div>

      {/* Gantt Chart */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header */}
              <div className="flex border-b">
                <div className="w-80 p-4 border-r bg-gray-50">
                  <span className="font-medium">Task</span>
                </div>
                <div className="flex-1 flex">
                  {daysInView.map((day, index) => (
                    <div
                      key={index}
                      className="flex-1 p-2 text-center border-r last:border-r-0 bg-gray-50"
                    >
                      <div className="text-xs font-medium">
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className="text-sm">{day.getDate()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              {ganttTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex border-b last:border-b-0 hover:bg-gray-50"
                >
                  {/* Task Info */}
                  <div className="w-80 p-4 border-r">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <span className="font-medium text-sm">
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      {task.assignee && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <User className="h-3 w-3" />
                          <span>{task.assignee}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex-1 flex relative">
                    {daysInView.map((day, index) => {
                      const taskStartDate = new Date(task.startDate);
                      const taskDueDate = new Date(task.dueDate);
                      const isTaskDay =
                        day >= taskStartDate && day <= taskDueDate;
                      const isToday =
                        day.toDateString() === new Date().toDateString();
                      const isPast = day < new Date() && !isToday;

                      return (
                        <div
                          key={index}
                          className="flex-1 p-2 border-r last:border-r-0 relative"
                        >
                          {isTaskDay && (
                            <div
                              className={`absolute inset-1 rounded ${
                                task.status === "completed"
                                  ? "bg-green-500"
                                  : task.status === "in-progress"
                                    ? "bg-blue-500"
                                    : task.status === "overdue"
                                      ? "bg-red-500"
                                      : "bg-gray-400"
                              } ${isToday ? "ring-2 ring-blue-300" : ""}`}
                            >
                              <div className="flex items-center justify-center h-full">
                                <span className="text-white text-xs font-medium">
                                  {task.status === "completed" ? "✓" : "●"}
                                </span>
                              </div>
                            </div>
                          )}
                          {isToday && !isTaskDay && (
                            <div className="absolute inset-1 border-2 border-dashed border-blue-300 rounded"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ganttTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{task.title}</CardTitle>
                {getStatusIcon(task.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-gray-600">{task.description}</p>

              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
                <Badge className={getStatusColor(task.status)}>
                  {task.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Due: {formatDate(task.dueDate)}</span>
                </div>
                {task.assignee && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span>{task.assignee}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      task.status === "completed"
                        ? "bg-green-500"
                        : task.status === "in-progress"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                    }`}
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTaskStatusChange(task.id, "in-progress")}
                  disabled={task.status === "in-progress"}
                >
                  Start
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTaskStatusChange(task.id, "completed")}
                  disabled={task.status === "completed"}
                >
                  Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
