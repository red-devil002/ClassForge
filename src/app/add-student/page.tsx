"use client"
import { useState } from "react";
import { Loader, UserPlus, Book, Users, Award, Activity, AlertTriangle } from "lucide-react";
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
    password: string;
    friends: string;
    disrespectfull: string;
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
        password: "",
        friends: "",
        disrespectfull: ""
    };

    // Form state
    const [formData, setFormData] = useState<StudentInput>(initialFormState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [passwordVisible, setPasswordVisible] = useState(false);

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
    const validateForm = (step?: number): boolean => {
        const newErrors: Record<string, string> = {};
        const stepToValidate = step || currentStep;

        if (stepToValidate === 1) {
            // Name validation
            if (!formData.name.trim()) {
                newErrors.name = "Name is required";
            }

            // Email validation
            if (!formData.email.trim()) {
                newErrors.email = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = "Please enter a valid email address";
            }

            // Password validation
            if (!formData.password.trim()) {
                newErrors.password = "Password is required";
            } else if (formData.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters";
            }
        }

        if (stepToValidate === 2) {
            // Gender validation
            if (!["male", "female", "other"].includes(formData.gender)) {
                newErrors.gender = "Please select a valid gender";
            }

            // Age validation
            if (typeof formData.age !== 'number' || formData.age < 5 || formData.age > 25) {
                newErrors.age = "Age must be between 5 and 25";
            }

            // Grades validation
            if (!formData.grades.trim()) {
                newErrors.grades = "Grade is required";
            }

            // Socio-economics status validation
            if (!formData.socioEconomicsStatus.trim()) {
                newErrors.socioEconomicsStatus = "Socio-economic status is required";
            }
        }

        if (stepToValidate === 3) {
            // Academic score validation
            if (typeof formData.academicScore !== 'number' ||
                formData.academicScore < 0 ||
                formData.academicScore > 100) {
                newErrors.academicScore = "Academic score must be between 0 and 100";
            }

            // Well-being score validation
            if (typeof formData.wellBeingScore !== 'number' ||
                formData.wellBeingScore < 0 ||
                formData.wellBeingScore > 100) {
                newErrors.wellBeingScore = "Well-being score must be between 0 and 100";
            }
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
            setCurrentStep(1);

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Navigate between steps
    const handleNext = () => {
        if (validateForm(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
    };

    // Progress bar calculation
    const progress = ((currentStep - 1) / 3) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {currentStep === 1 && <span className="flex items-center justify-center"><UserPlus className="mr-2 text-primary" size={28} /> Account Information</span>}
                        {currentStep === 2 && <span className="flex items-center justify-center"><Users className="mr-2 text-primary" size={28} /> Basic Details</span>}
                        {currentStep === 3 && <span className="flex items-center justify-center"><Award className="mr-2 text-primary" size={28} /> Academic Performance</span>}
                        {currentStep === 4 && <span className="flex items-center justify-center"><Activity className="mr-2 text-primary" size={28} /> Social Attributes</span>}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Step {currentStep} of 4 - {currentStep === 1 ? "Basic Information" : 
                        currentStep === 2 ? "Personal Details" : 
                        currentStep === 3 ? "Academic Information" : "Social Network"}
                    </p>

                    {/* Progress Bar */}
                    <div className="relative pt-8">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                            <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"></div>
                        </div>
                        <div className="flex justify-between">
                            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>1</div>
                                <span className="text-xs mt-1">Account</span>
                            </div>
                            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>2</div>
                                <span className="text-xs mt-1">Details</span>
                            </div>
                            <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>3</div>
                                <span className="text-xs mt-1">Academic</span>
                            </div>
                            <div className={`flex flex-col items-center ${currentStep >= 4 ? 'text-primary' : 'text-gray-400'}`}>
                                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 4 ? 'bg-primary text-white' : 'bg-gray-200'}`}>4</div>
                                <span className="text-xs mt-1">Social</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white py-8 px-6 shadow sm:rounded-lg border border-gray-200">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Step 1: Account Information */}
                        {currentStep === 1 && (
                            <>
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`appearance-none block w-full px-3 py-2 border ${errors.name ? "border-red-300 ring-red-500" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                                            disabled={isSubmitting}
                                            placeholder="John Smith"
                                        />
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <AlertTriangle className="h-4 w-4 mr-1" /> {errors.name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`appearance-none block w-full px-3 py-2 border ${errors.email ? "border-red-300 ring-red-500" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                                            disabled={isSubmitting}
                                            placeholder="john.smith@example.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <AlertTriangle className="h-4 w-4 mr-1" /> {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            id="password"
                                            name="password"
                                            type={passwordVisible ? "text" : "password"}
                                            autoComplete="new-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`appearance-none block w-full px-3 py-2 border ${errors.password ? "border-red-300 ring-red-500" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                                            disabled={isSubmitting}
                                            placeholder="●●●●●●●●"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                        >
                                            <span className="text-gray-500 text-sm">{passwordVisible ? "Hide" : "Show"}</span>
                                        </button>
                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <AlertTriangle className="h-4 w-4 mr-1" /> {errors.password}
                                            </p>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
                                </div>
                            </>
                        )}

                        {/* Step 2: Basic Details */}
                        {currentStep === 2 && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Gender Field */}
                                    <div>
                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                            Gender <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="gender"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className={`appearance-none block w-full px-3 py-2 border ${errors.gender ? "border-red-300 ring-red-500" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                                                disabled={isSubmitting}
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.gender && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                                    <AlertTriangle className="h-4 w-4 mr-1" /> {errors.gender}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Age Field */}
                                    <div>
                                        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                                            Age <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input
                                                id="age"
                                                name="age"
                                                type="number"
                                                min="5"
                                                max="25"
                                                value={formData.age}
                                                onChange={handleChange}
                                                className={`appearance-none block w-full px-3 py-2 border ${errors.age ? "border-red-300 ring-red-500" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                                                disabled={isSubmitting}
                                            />
                                            {errors.age && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                                    <AlertTriangle className="h-4 w-4 mr-1" /> {errors.age}
                                                </p>
                                            )}
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Student age must be between 5-25 years</p>
                                    </div>
                                </div>

                                {/* Grades Field */}
                                <div>
                                    <label htmlFor="grades" className="block text-sm font-medium text-gray-700">
                                        Grades/Class <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            id="grades"
                                            name="grades"
                                            type="text"
                                            value={formData.grades}
                                            onChange={handleChange}
                                            placeholder="e.g. 10th Grade, Class XII"
                                            className={`appearance-none block w-full px-3 py-2 border ${errors.grades ? "border-red-300 ring-red-500" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.grades && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <AlertTriangle className="h-4 w-4 mr-1" /> {errors.grades}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Socio-economics Status Field */}
                                <div>
                                    <label htmlFor="socioEconomicsStatus" className="block text-sm font-medium text-gray-700">
                                        Socio-economic Status <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="socioEconomicsStatus"
                                            name="socioEconomicsStatus"
                                            value={formData.socioEconomicsStatus}
                                            onChange={handleChange}
                                            className={`appearance-none block w-full px-3 py-2 border ${errors.socioEconomicsStatus ? "border-red-300 ring-red-500" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select status</option>
                                            {socioEconomicOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        {errors.socioEconomicsStatus && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <AlertTriangle className="h-4 w-4 mr-1" /> {errors.socioEconomicsStatus}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 3: Academic Information */}
                        {currentStep === 3 && (
                            <>
                                <div className="space-y-6">
                                    {/* Academic Score Field with visual slider */}
                                    <div>
                                        <label htmlFor="academicScore" className="block text-sm font-medium text-gray-700">
                                            Academic Score <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <div className="flex items-center justify-between">
                                                <input
                                                    id="academicScore"
                                                    name="academicScore"
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    step="1"
                                                    value={formData.academicScore}
                                                    onChange={handleChange}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring focus:ring-primary/50"
                                                    disabled={isSubmitting}
                                                />
                                                <span className="ml-4 w-12 text-sm font-medium text-gray-700 text-center py-1 bg-gray-100 rounded">
                                                    {formData.academicScore}
                                                </span>
                                            </div>
                                            {errors.academicScore && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                                    <AlertTriangle className="h-4 w-4 mr-1" /> {errors.academicScore}
                                                </p>
                                            )}
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>Poor (0)</span>
                                                <span>Average (50)</span>
                                                <span>Excellent (100)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Well-being Score Field with visual slider */}
                                    <div>
                                        <label htmlFor="wellBeingScore" className="block text-sm font-medium text-gray-700">
                                            Well-being Score <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <div className="flex items-center justify-between">
                                                <input
                                                    id="wellBeingScore"
                                                    name="wellBeingScore"
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    step="1"
                                                    value={formData.wellBeingScore}
                                                    onChange={handleChange}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring focus:ring-primary/50"
                                                    disabled={isSubmitting}
                                                />
                                                <span className="ml-4 w-12 text-sm font-medium text-gray-700 text-center py-1 bg-gray-100 rounded">
                                                    {formData.wellBeingScore}
                                                </span>
                                            </div>
                                            {errors.wellBeingScore && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                                    <AlertTriangle className="h-4 w-4 mr-1" /> {errors.wellBeingScore}
                                                </p>
                                            )}
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>Concerning (0)</span>
                                                <span>Average (50)</span>
                                                <span>Excellent (100)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Activities Field */}
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
                                                placeholder="Soccer, Art Club, Chess"
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                disabled={isSubmitting}
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Enter activities separated by commas</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 4: Social Network */}
                        {currentStep === 4 && (
                            <>
                                <div>
                                    <label htmlFor="friends" className="block text-sm font-medium text-gray-700">
                                        Friends
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="friends"
                                            name="friends"
                                            type="text"
                                            value={formData.friends}
                                            onChange={handleChange}
                                            placeholder="John Smith, Eva Johnson"
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            disabled={isSubmitting}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Enter friends separated by commas (ensure names are correct)</p>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="disrespectfull" className="block text-sm font-medium text-gray-700">
                                        Disrespectful Toward
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="disrespectfull"
                                            name="disrespectfull"
                                            type="text"
                                            value={formData.disrespectfull}
                                            onChange={handleChange}
                                            placeholder="Alex Thompson, Maya Wilson"
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            disabled={isSubmitting}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Enter names separated by commas (ensure names are correct)</p>
                                    </div>
                                </div>

                                {/* Required fields note */}
                                <div className="text-xs text-gray-500 pt-4">
                                    <p>Fields marked with <span className="text-red-500">*</span> are required</p>
                                </div>
                            </>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    disabled={isSubmitting}
                                >
                                    Previous
                                </button>
                            )}
                            
                            {currentStep <= 4 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4f46e5] hover:bg-[#4f46e5]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5]"
                                    disabled={isSubmitting}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4f46e5] hover:bg-[#4f46e5]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                            Processing...
                                        </>
                                    ) : "Register Student"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}