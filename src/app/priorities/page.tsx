"use client"
import React, { useState } from 'react'
import StudentTable from '@/components/StudentTable';
import PrioritizationSettingsDialog from '@/components/PrioritizationSettingsDialog';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/auth-context';

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

export default function page() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const { role } = useAuth()
    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Open dialog handler
    const openDialog = () => {
        setIsDialogOpen(true);
        // Reset form state when opening dialog
        setError("");
        setSuccess(false);
    };

    // Close dialog handler
    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    // Handle form submission
    const handleSubmit = async (formValues: any) => {
        setIsSubmitting(true);
        setError("");

        try {
            console.log(formValues)
            const res = await fetch(`${process.env.NEXT_PUBLIC_STUDENT_ALLOCATOR_API ?? "http://localhost:5000"}/run-allocation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formValues),
            });
            const data = await res.json();
            console.log("data: ", data)
            setStudents(data.assigned)
            if (res.ok) {
                toast.success("Allocation completed!")
                toast.success("You can check allocation in below table and submit when ready")
                // console.log("✅ Allocation complete", data);
                closeDialog()
            } else {
                console.error("❌ Allocation failed:", data.error);
            }
        } catch (error) {
            console.error("❌ Network error:", error);
        } finally {
            setIsSubmitting(false)
        }
    };
    if (role == "STUDENT") return <>You Do not have access to this page.</>
    return (
        <div className="w-full h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Priority Management</h1>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Prioritization Settings</h2>
                            <p className="text-gray-600 mt-1">Configure how the system prioritizes different aspects of your life</p>
                        </div>
                        <button
                            onClick={openDialog}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2 px-4 transition duration-150 ease-in-out"
                        >
                            Configure Settings
                        </button>
                    </div>
                </div>


            </div>

            {/* Render the dialog */}
            <PrioritizationSettingsDialog
                isOpen={isDialogOpen}
                onClose={closeDialog}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                error={error}
                success={success}
            />
            <StudentTable students={students} setStudents={setStudents} />
        </div>
    )
}
