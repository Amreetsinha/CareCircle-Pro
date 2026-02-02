import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllParents, getChildrenForParent } from "../api/adminApi"; /* Assuming getChildrenForParent exists or we create it */

export default function ManageParents() {
    const navigate = useNavigate();
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Child View Modal State
    const [selectedParent, setSelectedParent] = useState(null);
    const [childrenData, setChildrenData] = useState([]);
    const [loadingChildren, setLoadingChildren] = useState(false);

    useEffect(() => {
        fetchParents();
    }, []);

    const fetchParents = async () => {
        try {
            // Need to ensure adminApi has getAllParents
            const data = await getAllParents();
            setParents(data.content || []);
        } catch (err) {
            console.error("Failed to fetch parents", err);
            setError("Failed to load parents.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewChildren = async (parent) => {
        setSelectedParent(parent);
        setLoadingChildren(true);
        setChildrenData([]);

        try {
            // We need to implement getChildrenForParent in adminApi.js if not present
            // The backend endpoint is: GET /admin/parents/{parentId}/children
            const children = await getChildrenForParent(parent.parentId);
            setChildrenData(children || []);
        } catch (err) {
            alert("Failed to fetch children: " + err.message);
        } finally {
            setLoadingChildren(false);
        }
    };

    const closeChildModal = () => {
        setSelectedParent(null);
        setChildrenData([]);
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-[80px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0071e3]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-[100px] pb-12 px-6 bg-[#f5f5f7] font-sans">
            <div className="max-w-[1200px] mx-auto">

                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-[40px] font-bold text-[#1d1d1f] tracking-tight">Manage Parents</h1>
                        <p className="text-[#86868b] text-lg mt-1">View and manage registered families.</p>
                    </div>
                    <button
                        onClick={() => navigate("/admin-dashboard")}
                        className="text-[#0071e3] font-bold hover:underline"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Unified Card Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="p-5 font-bold text-sm text-[#86868b] uppercase tracking-wider">Name</th>
                                    <th className="p-5 font-bold text-sm text-[#86868b] uppercase tracking-wider">Contact</th>
                                    <th className="p-5 font-bold text-sm text-[#86868b] uppercase tracking-wider">Location</th>
                                    <th className="p-5 font-bold text-sm text-[#86868b] uppercase tracking-wider">Family</th>
                                    <th className="p-5 font-bold text-sm text-[#86868b] uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parents.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">
                                            No parents found.
                                        </td>
                                    </tr>
                                ) : (
                                    parents.map((p) => (
                                        <tr key={p.parentId} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                                            <td className="p-5 font-semibold text-[#1d1d1f]">
                                                {p.fullName}
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col text-sm">
                                                    <span className="font-medium text-gray-900">{p.email}</span>
                                                    <span className="text-gray-500">{p.phoneNumber || "No Phone"}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-gray-600 font-medium">
                                                {p.city}
                                            </td>
                                            <td className="p-5">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {p.childrenCount} Children
                                                </span>
                                            </td>
                                            <td className="p-5 text-right space-x-2">
                                                <button
                                                    onClick={() => navigate(`/chat/${p.parentId}`, { state: { isAdminAction: true, partnerId: p.parentId } })}
                                                    className="px-4 py-2 rounded-lg bg-blue-100 text-[#0071e3] font-bold hover:bg-blue-200 transition-all text-xs"
                                                >
                                                    Message
                                                </button>
                                                <button
                                                    onClick={() => handleViewChildren(p)}
                                                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all text-xs"
                                                >
                                                    View Family
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Children Details Modal */}
                {selectedParent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-xl font-bold text-[#1d1d1f]">{selectedParent.fullName}'s Family</h3>
                                    <p className="text-sm text-gray-500 mt-1">Registered Children</p>
                                </div>
                                <button onClick={closeChildModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                                    &times;
                                </button>
                            </div>

                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                {loadingChildren ? (
                                    <div className="flex justify-center p-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0071e3]"></div>
                                    </div>
                                ) : childrenData.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No children registered.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {childrenData.map(child => (
                                            <div key={child.id} className="flex flex-col p-4 rounded-xl border border-gray-100 bg-gray-50/30 hover:border-blue-200 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-bold text-lg text-[#1d1d1f]">{child.name}</span>
                                                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                        {child.age} Years Old
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                                                    <div><span className="text-gray-400 font-bold text-xs uppercase">Gender:</span> {child.gender}</div>
                                                    <div><span className="text-gray-400 font-bold text-xs uppercase">Needs:</span> {child.specialNeeds || "None"}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
                                <button
                                    onClick={closeChildModal}
                                    className="px-6 py-2 rounded-lg bg-white border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
