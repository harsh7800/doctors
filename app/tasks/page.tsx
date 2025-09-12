"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LocalStorage } from "@/lib/storage";
import { Task } from "@/lib/types";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GanttChart from "@/components/GanttChart";
import {
  Search,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Filter,
  SortAsc,
  SortDesc,
  AlertCircle,
  BarChart3,
  List,
} from "lucide-react";

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "pending"
  >("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "createdAt" | "title">(
    "dueDate"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [viewMode, setViewMode] = useState<"list" | "gantt">("list");

  useEffect(() => {
    // Initialize sample data if needed
    LocalStorage.initializeSampleData();

    const allTasks = LocalStorage.getTasks();
    console.log("Tasks loaded:", allTasks);
    setTasks(allTasks);
    setFilteredTasks(allTasks);
  }, []);

  useEffect(() => {
    let filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== "all") {
      filtered = filtered.filter((task) => {
        if (filterStatus === "completed") return task.completed;
        if (filterStatus === "pending") return !task.completed;
        return true;
      });
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "dueDate":
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filterStatus, sortBy, sortOrder]);

  const handleAddTask = () => {
    if (newTask.title.trim() && newTask.dueDate) {
      const task: Task = {
        id: Date.now().toString(),
        doctorId: user?.id || "1",
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
        completed: false,
        createdAt: new Date(),
        priority: "medium",
        status: "pending",
        assignee: user?.name || "Dr. Admin",
      };

      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      LocalStorage.setTasks(updatedTasks);

      // Reset form
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
      });
      setShowAddTask(false);
    }
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    LocalStorage.setTasks(updatedTasks);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isOverdue = (dueDate: string) => {
    return (
      new Date(dueDate) < new Date() &&
      !tasks.find((t) => t.dueDate === dueDate)?.completed
    );
  };

  const getDueDateColor = (dueDate: string, completed: boolean) => {
    if (completed) return "text-gray-500";
    if (isOverdue(dueDate)) return "text-red-600";
    const daysUntilDue = Math.ceil(
      (new Date(dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (daysUntilDue <= 1) return "text-orange-600";
    if (daysUntilDue <= 3) return "text-yellow-600";
    return "text-gray-600";
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const overdueTasks = tasks.filter(
    (task) => isOverdue(task.dueDate) && !task.completed
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600">
              Manage your daily tasks and reminders
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-r-none"
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "gantt" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("gantt")}
                className="rounded-l-none"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Gantt
              </Button>
            </div>
            <Button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Circle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overdueTasks}</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Task Form */}
        {showAddTask && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>
                Create a new task to track your work
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Textarea
                  placeholder="Task description (optional)"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddTask(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>Add Task</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Select
                value={filterStatus}
                onValueChange={(value: string) =>
                  setFilterStatus(value as "all" | "pending" | "completed")
                }
              >
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex gap-2">
                <Select
                  value={sortBy}
                  onValueChange={(value: string) =>
                    setSortBy(value as "title" | "createdAt" | "dueDate")
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        {viewMode === "gantt" ? (
          <GanttChart
            tasks={filteredTasks}
            onTaskUpdate={(taskId, updates) => {
              const updatedTasks = tasks.map((task) =>
                task.id === taskId ? { ...task, ...updates } : task
              );
              setTasks(updatedTasks);
              LocalStorage.setTasks(updatedTasks);
            }}
          />
        ) : (
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Circle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {searchTerm || filterStatus !== "all"
                      ? "No tasks found matching your criteria."
                      : "No tasks created yet."}
                  </p>
                  {!searchTerm && filterStatus === "all" && (
                    <Button onClick={() => setShowAddTask(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Task
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className={`transition-all ${task.completed ? "opacity-75" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3
                            className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}
                          >
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {isOverdue(task.dueDate) && !task.completed && (
                              <Badge variant="destructive" className="text-xs">
                                Overdue
                              </Badge>
                            )}
                            <Badge
                              variant={task.completed ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {task.completed ? "Completed" : "Pending"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                        {task.description && (
                          <p className="text-gray-600 text-sm mb-3">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span
                              className={getDueDateColor(
                                task.dueDate,
                                task.completed
                              )}
                            >
                              Due: {formatDate(task.dueDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className="text-gray-500">
                              Created:{" "}
                              {formatDateTime(task.createdAt.toString())}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
