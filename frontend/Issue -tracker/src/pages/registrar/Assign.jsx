import React from "react";
import { useState } from "react";

const Assign = () => {
    const [formData, setFormData] = useState({
        lecturer: '',
        notes: '',
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = async () => {
        try {
            const response = await API.post("http://localhost:/", formData);
            console.log("Success!", response.data);
        }
        catch (err) {
            console.error("Failed to update information", err);
        }
    };
    return (
        <div className="m-2">
            <div className="m-2">
                <header className="bg-blue-950 border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">
                    Assign Issue to Lecturer
                    </h1>
                    <p className="text-sm text-gray-300">
                    Select a Lecturer to handle this and they will be notified.
                    </p>
                </div>
                </header>
            </div>
            <div className="space-y-4">
                <p className="text-2xl font-bold text-gray-600">Issue Details</p>
                <div className="mt-4 mb-4 flex flex-col gap-2 md:flex-row flexgap-4 md:justify-between">
                <div
                    class="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-blue-950 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                    Student: {name}
                    </h5>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                    Subject:literature
                    </h5>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                    Type:missing marks
                    </h5>
                </div>
                </div>
            </div>
            <div className="space-y-4 md-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label
                            htmlFor="lecturer"
                            className="block mb-2 text-sm text-left font-medium text-gray-600"
                        >
                            Assign to lecturer
                        </label>
                        <select
                            id="lecturer"
                            name="lecturer"
                            value={formData.lecturer}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            required>
                            <option value="">Select a lecturer</option>
                            <option value="lecturer">Mr. Poper</option>
                            <option value="lecturer">Prof. Bak</option>
                            <option value="lecturer">Dr. Wakholi</option>
                        </select>
                        </div>
                    <div className="mb-5">
                        <label
                            htmlFor="notes"
                            className="block mb-2 text-sm text-left font-medium text-gray-600"
                        >
                            Assigment Details (optional)
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={formData.description}
                            placeholder="Add any specifications to the lecturer here"
                            onChange={handleChange}
                            rows={5}
                            option
                        />
                    </div>
                </form>
            </div>
            <div className="text-sm mb-5  items-end flex flex-wrap">
                <div className="space-y-2">
                    <button type="button" className="py-2.5  px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-blue-950 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                        Assign to lecturer
                    </button>
                    <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-white focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-blue-950 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                        Mark as resolved
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Assign;
