// "use client";

// import { useState, ChangeEvent, FormEvent } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Loader, Info } from "lucide-react";

// type FormKeys = "academic" | "wellbeing" | "friends" | "disrespect" | "activities";

// interface PrioritizationSettingsDialogProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSubmit: (data: Record<FormKeys, number>) => void;
//     isSubmitting: boolean;
//     error: string;
//     success: boolean;
// }

// const SLIDER_CONFIGS: {
//     name: FormKeys;
//     label: string;
//     min: number;
//     max: number;
//     step: number;
//     helper?: string;
// }[] = [
//         {
//             name: "academic",
//             label: "Academic Importance",
//             min: 0,
//             max: 1,
//             step: 0.1,
//             helper: "How important are academic results?",
//         },
//         {
//             name: "wellbeing",
//             label: "Wellbeing Priority",
//             min: 0,
//             max: 1,
//             step: 0.1,
//             helper: "Consider how much you value personal wellbeing.",
//         },
//         {
//             name: "friends",
//             label: "Friends Importance",
//             min: 0,
//             max: 10,
//             step: 1,
//             helper: "Rate how important friendships are to you.",
//         },
//         {
//             name: "disrespect",
//             label: "Disrespect Tolerance",
//             min: 0,
//             max: 10,
//             step: 1,
//             helper: "Lower values mean you’re less tolerant of disrespect.",
//         },
//         {
//             name: "activities",
//             label: "Activities Engagement",
//             min: 0,
//             max: 10,
//             step: 1,
//             helper: "How involved do you want to be in extracurricular activities?",
//         },
//     ];

// export default function PrioritizationSettingsDialog({
//     isOpen,
//     onClose,
//     onSubmit,
//     isSubmitting,
//     error,
//     success,
// }: PrioritizationSettingsDialogProps) {
//     const [formValues, setFormValues] = useState<Record<FormKeys, number>>({
//         academic: 0.5,
//         wellbeing: 0.5,
//         friends: 5,
//         disrespect: 5,
//         activities: 5,
//     });

//     const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormValues((prev) => ({
//             ...prev,
//             [name]: parseFloat(value),
//         }));
//     };

//     const handleSubmit = (e: FormEvent) => {
//         e.preventDefault();
//         onSubmit(formValues);
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onClose}>
//             <DialogContent className="sm:max-w-lg w-full">
//                 <DialogHeader>
//                     <DialogTitle className="text-center text-2xl font-semibold text-gray-800">
//                         Set Prioritization Settings
//                     </DialogTitle>
//                 </DialogHeader>

//                 {error && (
//                     <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md">
//                         {error}
//                     </div>
//                 )}

//                 {success && (
//                     <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded-md">
//                         Settings saved! Redirecting...
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6 mt-4">
//                     {SLIDER_CONFIGS.map(({ name, label, min, max, step, helper }) => (
//                         <div key={name}>
//                             <div className="flex justify-between items-center mb-1">
//                                 <label htmlFor={name} className="text-sm font-medium text-gray-700">
//                                     {label}
//                                 </label>
//                                 <span className="text-sm font-semibold text-blue-600">{formValues[name]}</span>
//                             </div>

//                             <input
//                                 type="range"
//                                 id={name}
//                                 name={name}
//                                 min={min}
//                                 max={max}
//                                 step={step}
//                                 value={formValues[name]}
//                                 onChange={handleSliderChange}
//                                 disabled={isSubmitting}
//                                 className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
//                             />

//                             <div className="flex justify-between text-xs text-gray-400 mt-1">
//                                 <span>{min}</span>
//                                 <span>{max}</span>
//                             </div>

//                             {helper && (
//                                 <p className="text-xs text-gray-500 mt-1 flex gap-1 items-start">
//                                     <Info className="w-3 h-3 mt-0.5 text-blue-400" /> {helper}
//                                 </p>
//                             )}
//                         </div>
//                     ))}

//                     <div className="flex flex-col sm:flex-row gap-3 pt-2">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={onClose}
//                             className="w-full sm:w-auto"
//                         >
//                             Cancel
//                         </Button>

//                         <Button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="w-full sm:w-auto"
//                         >
//                             {isSubmitting ? (
//                                 <span className="flex items-center">
//                                     <Loader size={18} className="animate-spin mr-2" />
//                                     Saving...
//                                 </span>
//                             ) : (
//                                 "Save Priorities"
//                             )}
//                         </Button>
//                     </div>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }


"use client";

import { useState, ChangeEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, Info } from "lucide-react";

type FormKeys = "academic" | "wellbeing" | "friends" | "disrespect" | "activities";

interface PrioritizationSettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Record<FormKeys, number>) => void;
    isSubmitting: boolean;
    error: string;
    success: boolean;
}

const SLIDER_CONFIGS: {
    name: FormKeys;
    label: string;
    min: number;
    max: number;
    step: number;
    helper?: string;
}[] = [
        {
            name: "academic",
            label: "Academic Importance",
            min: 0,
            max: 1,
            step: 0.1,
            helper: "How important are academic results?",
        },
        {
            name: "wellbeing",
            label: "Wellbeing Priority",
            min: 0,
            max: 1,
            step: 0.1,
            helper: "Consider how much you value personal wellbeing.",
        },
        {
            name: "friends",
            label: "Friends Importance",
            min: 0,
            max: 10,
            step: 1,
            helper: "Rate how important friendships are to you.",
        },
        {
            name: "disrespect",
            label: "Disrespect Tolerance",
            min: 0,
            max: 10,
            step: 1,
            helper: "Lower values mean you're less tolerant of disrespect.",
        },
        {
            name: "activities",
            label: "Activities Engagement",
            min: 0,
            max: 10,
            step: 1,
            helper: "How involved do you want to be in extracurricular activities?",
        },
    ];

export default function PrioritizationSettingsDialog({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    error,
    success,
}: PrioritizationSettingsDialogProps) {
    const [formValues, setFormValues] = useState<Record<FormKeys, number>>({
        academic: 0.5,
        wellbeing: 0.5,
        friends: 5,
        disrespect: 5,
        activities: 5,
    });

    const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: parseFloat(value),
        }));
    };

    const handleSubmit = () => {
        onSubmit(formValues);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-w-[95vw] w-full p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl sm:text-2xl font-semibold text-gray-800">
                        Set Prioritization Settings
                    </DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-2 sm:p-3 rounded-md text-sm sm:text-base">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-2 sm:p-3 rounded-md text-sm sm:text-base">
                        Settings saved! Redirecting...
                    </div>
                )}

                <div className="space-y-4 sm:space-y-6 mt-2 sm:mt-4">
                    {SLIDER_CONFIGS.map(({ name, label, min, max, step, helper }) => (
                        <div key={name} className="pb-1">
                            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-1">
                                <label htmlFor={name} className="text-xs sm:text-sm font-medium text-gray-700 mr-2">
                                    {label}
                                </label>
                                <span className="text-xs sm:text-sm font-semibold text-blue-600 ml-auto">
                                    {formValues[name]}
                                </span>
                            </div>

                            <input
                                type="range"
                                id={name}
                                name={name}
                                min={min}
                                max={max}
                                step={step}
                                value={formValues[name]}
                                onChange={handleSliderChange}
                                disabled={isSubmitting}
                                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />

                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>{min}</span>
                                <span>{max}</span>
                            </div>

                            {helper && (
                                <p className="text-xs text-gray-500 mt-1 flex gap-1 items-start">
                                    <Info className="w-3 h-3 mt-0.5 text-blue-400 flex-shrink-0" />
                                    <span>{helper}</span>
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="w-full text-sm sm:text-base"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className="w-full text-sm sm:text-base"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <Loader size={16} className="animate-spin mr-2" />
                                    Saving...
                                </span>
                            ) : (
                                "Save Priorities"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}