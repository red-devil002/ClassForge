"use client"
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { User, UserPlus, Users, AlertTriangle, Book, Heart, Trash2, Edit, Save, X, Search, Award } from "lucide-react";
import toast from "react-hot-toast";

const socioEconomicOptions = [
    "Low Income", "Lower Middle", "Middle", "Upper Middle", "High Income"
];

type Student = {
    student_id: number;
    name: string;
    gender: string;
    age: number;
    academicScore: number;
    grades: string;
    wellBeingScore: number;
    socioEconomicsStatus: string;
    activities: string;
    assigned_class: string;
    friends?: string;
    disrespectfull?: string;
    email: string;
    password: string;
};

export default function StudentTable({ students, setStudents }: { students: Student[], setStudents: (s: any) => void }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedStudent, setEditedStudent] = useState<Partial<Student>>({});
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [newStudent, setNewStudent] = useState<Partial<Student>>({
        name: "",
        gender: "Male",
        age: 0,
        academicScore: 0,
        grades: "",
        wellBeingScore: 0,
        socioEconomicsStatus: "Middle",
        activities: "",
        assigned_class: "Class A",
        friends: "",
        disrespectfull: "",
        email: "",
        password: "",
    });
    // Filter students based on search term
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(student.assigned_class).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate stats
    const classDistribution = students.reduce((acc, student) => {
        acc[student.assigned_class] = (acc[student.assigned_class] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const totalStudents = students.length;
    const avgAcademic = students.length > 0 ?
        students.reduce((sum, student) => sum + student.academicScore, 0) / students.length : 0;
    const avgWellbeing = students.length > 0 ?
        students.reduce((sum, student) => sum + student.wellBeingScore, 0) / students.length : 0;

    const handleEdit = (id: number) => {
        const target = students.find((s) => s.student_id === id);
        if (target) {
            setEditingId(id);
            setEditedStudent({ ...target });
        }
    };

    const handleSave = () => {
        try {
            setStudents((prev: any) =>
                prev.map((s: any) =>
                    s.student_id === editingId ? { ...s, ...editedStudent } as Student : s
                )
            );
            setEditingId(null);
            setEditedStudent({});
            toast.success("Student updated successfully!");
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update student details");
        }
    };

    const handleDelete = () => {
        if (confirmDeleteId !== null) {
            try {
                setStudents((prev: any) =>
                    prev.filter((s: any) => s.student_id !== confirmDeleteId)
                );
                toast.success("Student deleted successfully!");
                setConfirmDeleteId(null);
            } catch (error) {
                console.error("Delete error:", error);
                toast.error("Failed to delete student");
                setConfirmDeleteId(null);
            }
        }
    };

    const handleAddStudent = async () => {
        // Validate required fields
        if (!newStudent.name?.trim()) {
            toast.error("Student name is required");
            return;
        }

        if (!newStudent.email?.trim()) {
            toast.error("Email is required");
            return;
        }

        if (!newStudent.password?.trim()) {
            toast.error("Password is required");
            return;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newStudent.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Generate a new student ID (highest ID + 1)
        const newId = students.length > 0
            ? Math.max(...students.map(s => s.student_id)) + 1
            : 1;

        // Create the new student object
        const studentToAdd = {
            ...newStudent,
            student_id: newId
        } as Student;

        setIsLoading(true);

        try {
            // API call to add student to database
            const response = await fetch('/api/add-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentToAdd),
            });

            const data = await response.json();

            if (response.ok) {
                // Add the new student to the list directly on success
                setStudents([...students, studentToAdd]);
                toast.success("Student added successfully!");

                // Reset form and close dialog
                setNewStudent({
                    name: "",
                    gender: "Male",
                    age: 0,
                    academicScore: 0,
                    grades: "",
                    wellBeingScore: 0,
                    socioEconomicsStatus: "Middle",
                    activities: "",
                    assigned_class: "Class 1",
                    friends: "",
                    disrespectfull: "",
                    email: "",
                    password: "",
                });
                setIsAddDialogOpen(false);
            } else {
                toast.error(`Error: ${data.message || 'Failed to add student'}`);
            }
        } catch (error) {
            toast.error("Error: Could not connect to server");
            console.error("Add student error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveAllStudents = async () => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/student-batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ students }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("All students saved to database successfully!");
                setStudents([])
            } else {
                toast.error(`Error: ${data.message || 'Failed to save students'}`);
            }
        } catch (error) {
            toast.error("Error: Could not connect to server");
            console.error("Save all students error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to count friends
    const countFriends = (friendsString?: string) => {
        if (!friendsString) return 0;
        return friendsString.split(',').filter(f => f.trim().length > 0).length;
    };

    // Helper function to count conflicts
    const countConflicts = (disrespectful?: string) => {
        if (!disrespectful) return 0;
        return disrespectful.split(',').filter(d => d.trim().length > 0).length;
    };

    // Function to get academic score color
    const getAcademicScoreColor = (score: number) => {
        if (score >= 90) return "text-green-600";
        if (score >= 75) return "text-blue-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    // Function to get wellbeing score color
    const getWellbeingScoreColor = (score: number) => {
        if (score >= 90) return "text-green-600";
        if (score >= 75) return "text-blue-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className="max-w-6xl w-full mx-auto mt-4 md:mt-8 p-4 md:p-8 bg-white shadow-lg rounded-lg border border-gray-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-serif text-gray-800 mb-4 md:mb-0 flex items-center">
                    <UserPlus className="mr-2 h-8 w-8 text-indigo-700" />
                    Student Class Allocation
                </h2>
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="bg-indigo-700 text-white hover:bg-indigo-800"
                    >
                        <UserPlus className="h-5 w-5 mr-2" />
                        Add Student
                    </Button>
                    <Button
                        onClick={saveAllStudents}
                        disabled={isLoading}
                        className="bg-green-600 text-white hover:bg-green-700"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <Save className="h-5 w-5 mr-2" />
                        )}
                        Save to Database
                    </Button>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center">
                        <Users className="h-8 w-8 text-indigo-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Total Students</p>
                            <p className="text-2xl font-bold">{totalStudents}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center">
                        <Book className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Avg Academic Score</p>
                            <p className="text-2xl font-bold">{avgAcademic.toFixed(1)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center">
                        <Heart className="h-8 w-8 text-pink-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Avg Wellbeing</p>
                            <p className="text-2xl font-bold">{avgWellbeing.toFixed(1)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <div className="flex items-center">
                        <Award className="h-8 w-8 text-amber-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Number of Classes</p>
                            <p className="text-2xl font-bold">{Object.keys(classDistribution).length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search bar */}
            <div className="mb-6 relative">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Search students by name or class..."
                        className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse table-auto">
                    <thead>
                        <tr className="bg-indigo-100 text-left">
                            <th className="border border-indigo-300 px-2 sm:px-4 py-2 sm:py-3 text-indigo-800 font-serif">Name</th>
                            <th className="border border-indigo-300 px-2 sm:px-4 py-2 sm:py-3 text-indigo-800 font-serif">Academic Score</th>
                            <th className="border border-indigo-300 px-2 sm:px-4 py-2 sm:py-3 text-indigo-800 font-serif">Wellbeing</th>
                            <th className="border border-indigo-300 px-2 sm:px-4 py-2 sm:py-3 text-indigo-800 font-serif">Class</th>
                            <th className="border border-indigo-300 px-2 sm:px-4 py-2 sm:py-3 text-indigo-800 font-serif">Social</th>
                            <th className="border border-indigo-300 px-2 sm:px-4 py-2 sm:py-3 text-indigo-800 font-serif">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((s) => (
                            <tr key={s.student_id} className="hover:bg-gray-50 border-b border-gray-200">
                                <td className="border-l border-r border-gray-300 px-2 sm:px-4 py-2 sm:py-3">
                                    {editingId === s.student_id ? (
                                        <Input
                                            className="border rounded w-full"
                                            value={editedStudent.name}
                                            onChange={(e) =>
                                                setEditedStudent({ ...editedStudent, name: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium mr-2">
                                                {s.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium">{s.name}</div>
                                                <div className="text-sm text-gray-500">{s.gender}, {s.age} yrs</div>
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td className="border-l border-r border-gray-300 px-2 sm:px-4 py-2 sm:py-3">
                                    {editingId === s.student_id ? (
                                        <Input
                                            type="number"
                                            className="border rounded w-full"
                                            value={editedStudent.academicScore}
                                            onChange={(e) =>
                                                setEditedStudent({ ...editedStudent, academicScore: parseFloat(e.target.value) })
                                            }
                                        />
                                    ) : (
                                        <div className="flex flex-col">
                                            <span className={`text-lg font-bold ${getAcademicScoreColor(s.academicScore)}`}>
                                                {s.academicScore}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Grades: {s.grades || 'N/A'}
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="border-l border-r border-gray-300 px-2 sm:px-4 py-2 sm:py-3">
                                    {editingId === s.student_id ? (
                                        <Input
                                            type="number"
                                            className="border rounded w-full"
                                            value={editedStudent.wellBeingScore}
                                            onChange={(e) =>
                                                setEditedStudent({ ...editedStudent, wellBeingScore: parseFloat(e.target.value) })
                                            }
                                        />
                                    ) : (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center">
                                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                                            <div
                                                                className={`h-2.5 rounded-full ${s.wellBeingScore >= 75 ? 'bg-green-600' :
                                                                    s.wellBeingScore >= 50 ? 'bg-yellow-400' : 'bg-red-600'
                                                                    }`}
                                                                style={{ width: `${s.wellBeingScore}%` }}>
                                                            </div>
                                                        </div>
                                                        <span className={`font-medium ${getWellbeingScoreColor(s.wellBeingScore)}`}>
                                                            {s.wellBeingScore}
                                                        </span>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Socioeconomic Status: {s.socioEconomicsStatus}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </td>
                                <td className="border-l border-r border-gray-300 px-2 sm:px-4 py-2 sm:py-3">
                                    {editingId === s.student_id ? (
                                        <Input
                                            type="text"
                                            className="border rounded w-full"
                                            value={editedStudent.assigned_class}
                                            onChange={(e) =>
                                                setEditedStudent({ ...editedStudent, assigned_class: String(e.target.value) })
                                            }
                                        />
                                    ) : (
                                        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 py-1">
                                            {s.assigned_class}
                                        </Badge>
                                    )}
                                </td>
                                <td className="border-l border-r border-gray-300 px-2 sm:px-4 py-2 sm:py-3">
                                    <div className="flex gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                        <Users className="h-3 w-3 mr-1" />
                                                        {countFriends(s.friends)}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="font-medium">Friends:</p>
                                                    <p>{s.friends || 'None listed'}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        {countConflicts(s.disrespectfull) > 0 && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex items-center bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                            {countConflicts(s.disrespectfull)}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="font-medium">Conflicts with:</p>
                                                        <p>{s.disrespectfull}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                </td>
                                <td className="border-l border-r border-gray-300 px-2 sm:px-4 py-2 sm:py-3">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        {editingId === s.student_id ? (
                                            <>
                                                <Button
                                                    className="bg-green-600 hover:bg-green-700 text-white text-sm"
                                                    onClick={handleSave}
                                                >
                                                    <Save className="h-4 w-4 mr-1" />
                                                    Save
                                                </Button>
                                                <Button
                                                    className="bg-gray-400 hover:bg-gray-500 text-white text-sm"
                                                    onClick={() => setEditingId(null)}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                                    onClick={() => handleEdit(s.student_id)}
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    className="bg-red-600 hover:bg-red-700 text-white text-sm"
                                                    onClick={() => setConfirmDeleteId(s.student_id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                    {searchTerm ? "No students match your search criteria" : "No students added yet"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Student Dialog using shadcn/ui Dialog component */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl font-serif text-center text-gray-800 border-b-2 pb-2">Add New Student</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            Fill in the student information below. Fields marked with * are required.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                className="border-2 border-gray-300"
                                value={newStudent.name}
                                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                placeholder="Student Name"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    value={newStudent.gender}
                                    onValueChange={(value) => setNewStudent({ ...newStudent, gender: value })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    className="border-2 border-gray-300"
                                    value={newStudent.age}
                                    onChange={(e) => setNewStudent({ ...newStudent, age: parseInt(e.target.value) })}
                                    placeholder="Age"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="academic">Academic Score</Label>
                                <Input
                                    id="academic"
                                    type="number"
                                    className="border-2 border-gray-300"
                                    value={newStudent.academicScore}
                                    onChange={(e) => setNewStudent({ ...newStudent, academicScore: parseFloat(e.target.value) })}
                                    placeholder="Academic Score"
                                />
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="wellBeingScore">WellBeing Score</Label>
                                <Input
                                    id="wellBeingScore"
                                    type="number"
                                    className="border-2 border-gray-300"
                                    value={newStudent.wellBeingScore}
                                    onChange={(e) => setNewStudent({ ...newStudent, wellBeingScore: parseFloat(e.target.value) })}
                                    placeholder="Wellbeing Score"
                                />
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="grades">Grades</Label>
                            <Input
                                id="grades"
                                className="border-2 border-gray-300"
                                value={newStudent.grades}
                                onChange={(e) => setNewStudent({ ...newStudent, grades: e.target.value })}
                                placeholder="Enter grades (e.g., A,B,C)"
                            />
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="socioEconomicsStatus">Socio-Economic Status</Label>
                            <Select
                                value={newStudent.socioEconomicsStatus}
                                onValueChange={(value) => setNewStudent({ ...newStudent, socioEconomicsStatus: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {socioEconomicOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="activities">Activities</Label>
                            <Input
                                id="activities"
                                className="border-2 border-gray-300"
                                value={newStudent.activities}
                                onChange={(e) => setNewStudent({ ...newStudent, activities: e.target.value })}
                                placeholder="Enter activities separated by commas"
                            />
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="friends">Friends</Label>
                            <Input
                                id="friends"
                                className="border-2 border-gray-300"
                                value={newStudent.friends}
                                onChange={(e) => setNewStudent({ ...newStudent, friends: e.target.value })}
                                placeholder="Enter friends separated by commas"
                            />
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="disrespectful">Disrespectful To</Label>
                            <Input
                                id="disrespectful"
                                className="border-2 border-gray-300"
                                value={newStudent.disrespectfull}
                                onChange={(e) => setNewStudent({ ...newStudent, disrespectfull: e.target.value })}
                                placeholder="Enter names separated by commas"
                            />
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="class">Class</Label>
                            <Input
                                id="class"
                                className="border-2 border-gray-300"
                                value={newStudent.assigned_class}
                                onChange={(e) => setNewStudent({ ...newStudent, assigned_class: e.target.value })}
                                placeholder="Enter Assigned Class"
                            />
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                className="border-2 border-gray-300"
                                value={newStudent.email}
                                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                                placeholder="student@example.com"
                                required
                            />
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="password">Password *</Label>
                            <Input
                                id="password"
                                type="password"
                                className="border-2 border-gray-300"
                                value={newStudent.password}
                                onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                                placeholder="Enter password"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                            className="bg-gray-300 text-gray-800 hover:bg-gray-400"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddStudent}
                            className="bg-indigo-700 text-white hover:bg-indigo-800"
                            disabled={!newStudent.name?.trim() || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : "Add Student"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Deletion Dialog using shadcn/ui Dialog component */}
            <Dialog open={confirmDeleteId !== null} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-lg md:text-xl font-serif text-center border-b-2 pb-2">Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-center pt-4">
                            Are you sure you want to delete this student?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDeleteId(null)}
                            className="bg-gray-300 text-gray-800 hover:bg-gray-400"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}