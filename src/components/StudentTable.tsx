// "use client"
// import React, { useState } from "react";

// type Student = {
//     student_id: number;
//     name: string;
//     academic: number;
//     wellbeing: number;
//     activities: string;
//     assigned_class: number;
// };

// export default function StudentTable({ students, setStudents }: { students: Student[], setStudents: (s: any) => void }) {
//     const [editingId, setEditingId] = useState<number | null>(null);
//     const [editedStudent, setEditedStudent] = useState<Partial<Student>>({});
//     const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

//     const handleEdit = (id: number) => {
//         const target = students.find((s) => s.student_id === id);
//         if (target) {
//             setEditingId(id);
//             setEditedStudent({ ...target });
//         }
//     };

//     const handleSave = () => {
//         setStudents((prev: any) =>
//             prev.map((s: any) =>
//                 s.student_id === editingId ? { ...s, ...editedStudent } as Student : s
//             )
//         );
//         setEditingId(null);
//         setEditedStudent({});
//     };

//     const handleDelete = () => {
//         if (confirmDeleteId !== null) {
//             setStudents((prev: any) =>
//                 prev.filter((s: any) => s.student_id !== confirmDeleteId)
//             );
//             setConfirmDeleteId(null);
//         }
//     };

//     return (
//         <div className="max-w-6xl mx-auto mt-8 p-4 bg-white shadow rounded-xl">
//             <h2 className="text-2xl font-semibold mb-4">Student Class Allocation</h2>
//             <table className="w-full table-auto border-collapse border border-gray-300">
//                 <thead>
//                     <tr className="bg-gray-100 text-left">
//                         <th className="border px-4 py-2">ID</th>
//                         <th className="border px-4 py-2">Name</th>
//                         <th className="border px-4 py-2">Academic</th>
//                         <th className="border px-4 py-2">Wellbeing</th>
//                         <th className="border px-4 py-2">Class</th>
//                         <th className="border px-4 py-2">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {students.map((s) => (
//                         <tr key={s.student_id}>
//                             <td className="border px-4 py-2">{s.student_id}</td>
//                             <td className="border px-4 py-2">
//                                 {editingId === s.student_id ? (
//                                     <input
//                                         className="border rounded px-2 py-1"
//                                         value={editedStudent.name}
//                                         onChange={(e) =>
//                                             setEditedStudent({ ...editedStudent, name: e.target.value })
//                                         }
//                                     />
//                                 ) : (
//                                     s.name
//                                 )}
//                             </td>
//                             <td className="border px-4 py-2">
//                                 {editingId === s.student_id ? (
//                                     <input
//                                         type="number"
//                                         className="border rounded px-2 py-1"
//                                         value={editedStudent.academic}
//                                         onChange={(e) =>
//                                             setEditedStudent({ ...editedStudent, academic: parseFloat(e.target.value) })
//                                         }
//                                     />
//                                 ) : (
//                                     s.academic
//                                 )}
//                             </td>
//                             <td className="border px-4 py-2">
//                                 {editingId === s.student_id ? (
//                                     <input
//                                         type="number"
//                                         className="border rounded px-2 py-1"
//                                         value={editedStudent.wellbeing}
//                                         onChange={(e) =>
//                                             setEditedStudent({ ...editedStudent, wellbeing: parseFloat(e.target.value) })
//                                         }
//                                     />
//                                 ) : (
//                                     s.wellbeing
//                                 )}
//                             </td>
//                             <td className="border px-4 py-2">{s.assigned_class}</td>
//                             <td className="border px-4 py-2 space-x-2">
//                                 {editingId === s.student_id ? (
//                                     <>
//                                         <button
//                                             className="text-blue-600 font-medium"
//                                             onClick={handleSave}
//                                         >
//                                             Save
//                                         </button>
//                                         <button
//                                             className="text-gray-500"
//                                             onClick={() => setEditingId(null)}
//                                         >
//                                             Cancel
//                                         </button>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <button
//                                             className="text-blue-600 font-medium"
//                                             onClick={() => handleEdit(s.student_id)}
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             className="text-red-600 font-medium"
//                                             onClick={() => setConfirmDeleteId(s.student_id)}
//                                         >
//                                             Delete
//                                         </button>
//                                     </>
//                                 )}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {/* Confirm Deletion Modal */}
//             {confirmDeleteId !== null && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
//                     <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
//                         <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
//                         <p>Are you sure you want to delete this student?</p>
//                         <div className="mt-4 flex justify-end space-x-2">
//                             <button
//                                 onClick={() => setConfirmDeleteId(null)}
//                                 className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleDelete}
//                                 className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded"
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

"use client"
import React, { useState } from "react";

type Student = {
    student_id: number;
    name: string;
    academic: number;
    wellbeing: number;
    activities: string;
    assigned_class: string;
    friends?: string;
    disrespectfull?: string;
};

export default function StudentTable({ students, setStudents }: { students: Student[], setStudents: (s: any) => void }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedStudent, setEditedStudent] = useState<Partial<Student>>({});
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newStudent, setNewStudent] = useState<Partial<Student>>({
        name: "",
        academic: 0,
        wellbeing: 0,
        activities: "",
        assigned_class: "Class A",
        friends: "",
        disrespectfull: "",
    });

    const handleEdit = (id: number) => {
        const target = students.find((s) => s.student_id === id);
        if (target) {
            setEditingId(id);
            setEditedStudent({ ...target });
        }
    };

    const handleSave = () => {
        setStudents((prev: any) =>
            prev.map((s: any) =>
                s.student_id === editingId ? { ...s, ...editedStudent } as Student : s
            )
        );
        setEditingId(null);
        setEditedStudent({});
    };

    const handleDelete = () => {
        if (confirmDeleteId !== null) {
            setStudents((prev: any) =>
                prev.filter((s: any) => s.student_id !== confirmDeleteId)
            );
            setConfirmDeleteId(null);
        }
    };

    const handleAddStudent = () => {
        // Generate a new student ID (highest ID + 1)
        const newId = students.length > 0
            ? Math.max(...students.map(s => s.student_id)) + 1
            : 1;

        // Create the new student object
        const studentToAdd = {
            ...newStudent,
            student_id: newId
        } as Student;

        // Add the new student to the list
        setStudents([...students, studentToAdd]);

        // Reset form and close dialog
        setNewStudent({
            name: "",
            academic: 0,
            wellbeing: 0,
            activities: "",
            assigned_class: "Class A",
            friends: "",
            disrespectfull: "",
        });
        setIsAddDialogOpen(false);
    };

    return (
        <div className="max-w-6xl mx-auto mt-8 p-8 bg-white shadow-lg rounded-lg border border-gray-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-serif text-gray-800">Student Class Allocation</h2>
                <button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800 shadow-md flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Student
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="border-2 border-gray-400 px-6 py-3 text-gray-700 font-serif">ID</th>
                            <th className="border-2 border-gray-400 px-6 py-3 text-gray-700 font-serif">Name</th>
                            <th className="border-2 border-gray-400 px-6 py-3 text-gray-700 font-serif">Academic</th>
                            <th className="border-2 border-gray-400 px-6 py-3 text-gray-700 font-serif">Wellbeing</th>
                            <th className="border-2 border-gray-400 px-6 py-3 text-gray-700 font-serif">Class</th>
                            <th className="border-2 border-gray-400 px-6 py-3 text-gray-700 font-serif">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s) => (
                            <tr key={s.student_id} className="hover:bg-gray-50">
                                <td className="border-2 border-gray-300 px-6 py-3">{s.student_id}</td>
                                <td className="border-2 border-gray-300 px-6 py-3">
                                    {editingId === s.student_id ? (
                                        <input
                                            className="border-2 rounded px-2 py-1 w-full"
                                            value={editedStudent.name}
                                            onChange={(e) =>
                                                setEditedStudent({ ...editedStudent, name: e.target.value })
                                            }
                                        />
                                    ) : (
                                        s.name
                                    )}
                                </td>
                                <td className="border-2 border-gray-300 px-6 py-3">
                                    {editingId === s.student_id ? (
                                        <input
                                            type="number"
                                            className="border-2 rounded px-2 py-1 w-full"
                                            value={editedStudent.academic}
                                            onChange={(e) =>
                                                setEditedStudent({ ...editedStudent, academic: parseFloat(e.target.value) })
                                            }
                                        />
                                    ) : (
                                        s.academic
                                    )}
                                </td>
                                <td className="border-2 border-gray-300 px-6 py-3">
                                    {editingId === s.student_id ? (
                                        <input
                                            type="number"
                                            className="border-2 rounded px-2 py-1 w-full"
                                            value={editedStudent.wellbeing}
                                            onChange={(e) =>
                                                setEditedStudent({ ...editedStudent, wellbeing: parseFloat(e.target.value) })
                                            }
                                        />
                                    ) : (
                                        s.wellbeing
                                    )}
                                </td>
                                <td className="border-2 border-gray-300 px-6 py-3">
                                    {editingId === s.student_id ? (
                                        <input
                                            type="number"
                                            className="border-2 rounded px-2 py-1 w-full"
                                            value={editedStudent.assigned_class}
                                            onChange={(e) =>
                                                setEditedStudent({ ...editedStudent, assigned_class: e.target.value })
                                            }
                                        />
                                    ) : (
                                        s.assigned_class
                                    )}
                                </td>
                                <td className="border-2 border-gray-300 px-6 py-3 space-x-2">
                                    {editingId === s.student_id ? (
                                        <>
                                            <button
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2"
                                                onClick={handleSave}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                                                onClick={() => setEditingId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2"
                                                onClick={() => handleEdit(s.student_id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                                onClick={() => setConfirmDeleteId(s.student_id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Student Dialog */}
            {isAddDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border-2 border-gray-400">
                        <h3 className="text-2xl font-serif mb-6 text-center text-gray-800 border-b-2 pb-2">Add New Student</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                                    value={newStudent.name}
                                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                    placeholder="Student Name"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Academic Score</label>
                                <input
                                    type="number"
                                    className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                                    value={newStudent.academic}
                                    onChange={(e) => setNewStudent({ ...newStudent, academic: parseFloat(e.target.value) })}
                                    placeholder="Academic Score"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Wellbeing Score</label>
                                <input
                                    type="number"
                                    className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                                    value={newStudent.wellbeing}
                                    onChange={(e) => setNewStudent({ ...newStudent, wellbeing: parseFloat(e.target.value) })}
                                    placeholder="Wellbeing Score"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Activities</label>
                                <input
                                    className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                                    value={newStudent.activities}
                                    onChange={(e) => setNewStudent({ ...newStudent, activities: e.target.value })}
                                    placeholder="Enter activities separated by commas (e.g. Soccer, Art Club, Chess)"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Friends</label>
                                <input
                                    className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                                    value={newStudent.friends}
                                    onChange={(e) => setNewStudent({ ...newStudent, friends: e.target.value })}
                                    placeholder="Enter friends separated by commas (e.g. John, Eva) make sure name is correct"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">DisRespectfull</label>
                                <input
                                    className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                                    value={newStudent.disrespectfull}
                                    onChange={(e) => setNewStudent({ ...newStudent, disrespectfull: e.target.value })}
                                    placeholder="Enter disrespectfull separated by commas (e.g. John, Eva) make sure name is correct"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Assigned Class</label>
                                <input
                                    type="text"
                                    className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                                    value={newStudent.assigned_class}
                                    onChange={(e) => setNewStudent({ ...newStudent, assigned_class: e.target.value })}
                                    placeholder="Assign Class"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsAddDialogOpen(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddStudent}
                                className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800 font-medium"
                                disabled={!newStudent.name}
                            >
                                Add Student
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Deletion Modal */}
            {confirmDeleteId !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full border-2 border-gray-400">
                        <h3 className="text-xl font-serif mb-4 text-center border-b-2 pb-2">Confirm Deletion</h3>
                        <p className="text-center">Are you sure you want to delete this student?</p>
                        <div className="mt-6 flex justify-center space-x-4">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}