"use client"
import { useState } from 'react';
import { Loader } from 'lucide-react';

interface PrioritizationSettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    error: string;
    success: boolean
}

export default function PrioritizationSettingsDialog({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    error,
    success
}: PrioritizationSettingsDialogProps) {
    // Define state for form values
    const [formValues, setFormValues] = useState({
        academic: 0.5,
        wellbeing: 0.5,
        friends: 5,
        disrespect: 5,
        activities: 5
    });

    // Handle slider changes
    const handleSliderChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: parseFloat(value)
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formValues);
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Set Prioritization Settings
                        </h1>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

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

                        <div className="flex gap-4 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg py-3 px-5 transition duration-150 ease-in-out"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium rounded-lg py-3 px-5 transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <Loader size={20} className="animate-spin mr-2" />
                                        Saving...
                                    </span>
                                ) : (
                                    "Save Priorities"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}