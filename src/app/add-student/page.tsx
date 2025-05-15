"use client"
import { useState } from "react";
import { Loader } from "lucide-react";
import toast from 'react-hot-toast';

// Type definition for student data
type Gender = 'male' | 'female' | 'other';

interface StudentInput {
    name: string;
    gender: Gender;
    age: number;
    academicScore: number;
    grades: string;
    wellBeingScore: number;
    socioEconomicsStatus: string;
    activities: string;
    email: string;
    password: string
}

// Mock function to simulate adding a student
const addStudent = async (data: StudentInput): Promise<void> => {
    // Simulate API call delay
    const response = await fetch('/api/add-student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        throw new Error('Failed to add student');
    }
};

export default function AddStudentForm() {
    // Initial form state
    const initialFormState: StudentInput = {
        name: "",
        gender: "male",
        age: 10,
        academicScore: 75,
        grades: "",
        wellBeingScore: 75,
        socioEconomicsStatus: "",
        activities: "",
        email: "",
        password: ""
    };

    // Form state
    const [formData, setFormData] = useState<StudentInput>(initialFormState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Socio-economic status options
    const socioEconomicOptions = [
        "Low Income", "Lower Middle", "Middle", "Upper Middle", "High Income"
    ];

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Clear errors when field is changed
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

        setFormData(prev => {
            if (name === "age" || name === "academicScore" || name === "wellBeingScore") {
                return { ...prev, [name]: value === "" ? "" : parseFloat(value) };
            }
            return { ...prev, [name]: value };
        });
    };

    // Validate form data
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        // Gender validation
        if (!["male", "female", "other"].includes(formData.gender)) {
            newErrors.gender = "Please select a valid gender";
        }

        // Age validation
        if (typeof formData.age !== 'number' || formData.age < 5 || formData.age > 25) {
            newErrors.age = "Age must be between 5 and 25";
        }

        // Academic score validation
        if (typeof formData.academicScore !== 'number' ||
            formData.academicScore < 0 ||
            formData.academicScore > 100) {
            newErrors.academicScore = "Academic score must be between 0 and 100";
        }

        // Grades validation
        if (!formData.grades.trim()) {
            newErrors.grades = "Grade is required";
        }

        // Well-being score validation
        if (typeof formData.wellBeingScore !== 'number' ||
            formData.wellBeingScore < 0 ||
            formData.wellBeingScore > 100) {
            newErrors.wellBeingScore = "Well-being score must be between 0 and 100";
        }

        // Socio-economics status validation
        if (!formData.socioEconomicsStatus.trim()) {
            newErrors.socioEconomicsStatus = "Socio-economic status is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Submit form
        setIsSubmitting(true);

        try {
            await addStudent(formData);
            toast.success("Student added successfully!");

            // Reset form after successful submission
            setFormData(initialFormState);

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (

        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Add New Student
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter student details to register in the system
                    </p>
                </div>

                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name *
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-2 border ${errors.name ? "border-red-300" : "border-gray-300"
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    disabled={isSubmitting}
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-2 border ${errors.email ? "border-red-300" : "border-gray-300"
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    disabled={isSubmitting}
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="text"
                                    autoComplete="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-2 border ${errors.password ? "border-red-300" : "border-gray-300"
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    disabled={isSubmitting}
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Gender Field */}
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                    Gender *
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className={`appearance-none block w-full px-3 py-2 border ${errors.gender ? "border-red-300" : "border-gray-300"
                                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        disabled={isSubmitting}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.gender && (
                                        <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
                                    )}
                                </div>
                            </div>

                            {/* Age Field */}
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                                    Age (5-25) *
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="age"
                                        name="age"
                                        type="number"
                                        min="5"
                                        max="25"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className={`appearance-none block w-full px-3 py-2 border ${errors.age ? "border-red-300" : "border-gray-300"
                                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.age && (
                                        <p className="mt-2 text-sm text-red-600">{errors.age}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Grades Field */}
                        <div>
                            <label htmlFor="grades" className="block text-sm font-medium text-gray-700">
                                Grades/Class *
                            </label>
                            <div className="mt-1">
                                <input
                                    id="grades"
                                    name="grades"
                                    type="text"
                                    value={formData.grades}
                                    onChange={handleChange}
                                    placeholder="e.g. 10th Grade, Class XII"
                                    className={`appearance-none block w-full px-3 py-2 border ${errors.grades ? "border-red-300" : "border-gray-300"
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    disabled={isSubmitting}
                                />
                                {errors.grades && (
                                    <p className="mt-2 text-sm text-red-600">{errors.grades}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Academic Score Field */}
                            <div>
                                <label htmlFor="academicScore" className="block text-sm font-medium text-gray-700">
                                    Academic Score (0-100) *
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="academicScore"
                                        name="academicScore"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={formData.academicScore}
                                        onChange={handleChange}
                                        className={`appearance-none block w-full px-3 py-2 border ${errors.academicScore ? "border-red-300" : "border-gray-300"
                                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.academicScore && (
                                        <p className="mt-2 text-sm text-red-600">{errors.academicScore}</p>
                                    )}
                                </div>
                            </div>

                            {/* Well-being Score Field */}
                            <div>
                                <label htmlFor="wellBeingScore" className="block text-sm font-medium text-gray-700">
                                    Well-being Score (0-100) *
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="wellBeingScore"
                                        name="wellBeingScore"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={formData.wellBeingScore}
                                        onChange={handleChange}
                                        className={`appearance-none block w-full px-3 py-2 border ${errors.wellBeingScore ? "border-red-300" : "border-gray-300"
                                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.wellBeingScore && (
                                        <p className="mt-2 text-sm text-red-600">{errors.wellBeingScore}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Socio-economics Status Field */}
                        <div>
                            <label htmlFor="socioEconomicsStatus" className="block text-sm font-medium text-gray-700">
                                Socio-economic Status *
                            </label>
                            <div className="mt-1">
                                <select
                                    id="socioEconomicsStatus"
                                    name="socioEconomicsStatus"
                                    value={formData.socioEconomicsStatus}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-2 border ${errors.socioEconomicsStatus ? "border-red-300" : "border-gray-300"
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select status</option>
                                    {socioEconomicOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                {errors.socioEconomicsStatus && (
                                    <p className="mt-2 text-sm text-red-600">{errors.socioEconomicsStatus}</p>
                                )}
                            </div>
                        </div>

                        {/* Activities Field - Only comma separated */}
                        <div>
                            <label htmlFor="activities" className="block text-sm font-medium text-gray-700">
                                Extracurricular Activities
                            </label>
                            <div className="mt-1">
                                <input
                                    id="activities"
                                    name="activities"
                                    type="text"
                                    value={formData.activities}
                                    onChange={handleChange}
                                    placeholder="Enter activities separated by commas (e.g. Soccer, Art Club, Chess)"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                        Processing...
                                    </>
                                ) : "Add Student"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}