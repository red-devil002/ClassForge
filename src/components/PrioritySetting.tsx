"use client"
import { useState } from 'react';
import { Loader } from 'lucide-react';

export default function PrioritizationSettings() {
    // Define state for form values and form status
    const [formValues, setFormValues] = useState({
        academic: 0.5,
        wellbeing: 0.5,
        friends: 5,
        disrespect: 5,
        activities: 5
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Handle slider changes
    const handleSliderChange = (e: any) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: parseFloat(value)
        });
    };

    // Handle form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // Simulate API call with setTimeout
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Mock API call
            const response = await mockApiCall(formValues);

            if (response.success) {
                setSuccess(true);
                // Redirect to list page after successful submission
                setTimeout(() => {
                    window.location.href = '/priorities/list';
                }, 1000);
            } else {
                setError("Failed to save priorities. Please try again.");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Mock API call function
    const mockApiCall = async (data: any) => {
        console.log('Sending data to API:', data);
        // Simulate successful response (95% success rate)
        return { success: Math.random() > 0.05 };
    };

    // Render slider with label and current value
    const renderSlider = (name, label, min, max, step) => {
        const value = formValues[name];
        return (
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor={name} className="text-gray-700 font-medium text-sm">
                        {label}
                    </label>
                    <span className="text-blue-600 font-semibold">
                        {value}
                    </span>
                </div>
                <input
                    type="range"
                    id={name}
                    name={name}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
                    disabled={isSubmitting}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={value}
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{min}</span>
                    <span>{max}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-200">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        Set Prioritization Settings
                    </h1>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded text-green-700">
                            <p>Settings saved successfully! Redirecting...</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {renderSlider("academic", "Academic Importance", 0, 1, 0.1)}
                        {renderSlider("wellbeing", "Wellbeing Priority", 0, 1, 0.1)}
                        {renderSlider("friends", "Friends Importance", 0, 10, 1)}
                        {renderSlider("disrespect", "Disrespect Tolerance", 0, 10, 1)}
                        {renderSlider("activities", "Activities Engagement", 0, 10, 1)}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium rounded-lg py-3 px-5 mt-6 transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <Loader size={20} className="animate-spin mr-2" />
                                    Submitting...
                                </span>
                            ) : (
                                "Save Priorities"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}