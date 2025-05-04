// import React, { useState, useEffect } from 'react';
// import { Plus, X, Edit2, Trash2, Check, Clock, Search, Filter } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import api from '../utils/api';
// import Swal from 'sweetalert2';

// const Plans = () => {
//   const [plans, setPlans] = useState([]);
//   const [showPlanModal, setShowPlanModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [planToDelete, setPlanToDelete] = useState(null);
//   const [newPlan, setNewPlan] = useState({
//     name: '',
//     amount: '',
//     hours: '',
//     minutes: '',
//     isActive: true, // Changed from 'active' to 'isActive'
//   });
//   const [editPlan, setEditPlan] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({ isActive: '' }); // Changed from 'active' to 'isActive'
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchPlans();
//   }, [filters]);

//   const fetchPlans = async () => {
//     setLoading(true);
//     let query = '/api/plans/plans?';
//     if (filters.isActive) query += `isActive=${filters.isActive}`; // Changed from 'active' to 'isActive'
//     if (query.endsWith('&')) query = query.slice(0, -1);

//     try {
//       const response = await api.get(query);
//       setPlans(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error('Error fetching plans:', error);
//       setPlans([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validatePlanData = (plan) => {
//     const errors = [];
//     if (!plan.name) errors.push('plan name');
//     if (!plan.amount || isNaN(parseFloat(plan.amount)) || parseFloat(plan.amount) <= 0) {
//       errors.push('valid amount (greater than 0)');
//     }
//     if (!plan.hours || isNaN(parseInt(plan.hours)) || parseInt(plan.hours) < 0) {
//       errors.push('valid hours (non-negative)');
//     }
//     if (!plan.minutes || isNaN(parseInt(plan.minutes)) || parseInt(plan.minutes) < 0 || parseInt(plan.minutes) >= 60) {
//       errors.push('valid minutes (0 to 59)');
//     }
//     return errors;
//   };

//   const createNewPlan = async () => {
//     const errors = validatePlanData(newPlan);
//     if (errors.length > 0) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Validation Errors',
//         html: `Please correct:<br><ul className="list-disc list-inside">${errors.map(err => `<li>${err}</li>`).join('')}</ul>`,
//       });
//       return;
//     }

//     const planData = {
//       name: newPlan.name,
//       amount: parseFloat(newPlan.amount),
//       hours: parseInt(newPlan.hours),
//       minutes: parseInt(newPlan.minutes),
//       isActive: newPlan.isActive, // Changed from 'active' to 'isActive'
//     };

//     try {
//       await api.post('/api/plans/add-plan', planData);
//       fetchPlans();
//       setShowPlanModal(false);
//       setNewPlan({ name: '', amount: '', hours: '', minutes: '', isActive: true }); // Changed from 'active' to 'isActive'
//       Swal.fire({ icon: 'success', title: 'Plan Created', text: 'Plan successfully created!' });
//     } catch (error) {
//       Swal.fire({ icon: 'error', title: 'Creation Failed', text: error.response?.data?.message || error.message });
//     }
//   };

//   const editPlanSubmit = async () => {
//     if (!editPlan) return;

//     const errors = validatePlanData(editPlan);
//     if (errors.length > 0) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Validation Errors',
//         html: `Please correct:<br><ul className="list-disc list-inside">${errors.map(err => `<li>${err}</li>`).join('')}</ul>`,
//       });
//       return;
//     }

//     const updatedData = {
//       name: editPlan.name,
//       amount: parseFloat(editPlan.amount),
//       hours: parseInt(editPlan.hours),
//       minutes: parseInt(editPlan.minutes),
//       isActive: editPlan.isActive, 
//     };

//     try {
//       await api.put(`/api/plans/plans/${editPlan._id}`, updatedData);
//       fetchPlans();
//       setShowEditModal(false);
//       setEditPlan(null);
//       Swal.fire({ icon: 'success', title: 'Plan Updated', text: 'Plan successfully updated!' });
//     } catch (error) {
//       Swal.fire({ icon: 'error', title: 'Update Failed', text: error.response?.data?.message || error.message });
//     }
//   };

//   const deletePlan = async () => {
//     if (!planToDelete) return;

//     try {
//       await api.delete(`/api/plans/plans/${planToDelete._id}`);
//       fetchPlans();
//       setShowDeleteModal(false);
//       setPlanToDelete(null);
//       Swal.fire({ icon: 'success', title: 'Plan Deleted', text: 'Plan successfully deleted!' });
//     } catch (error) {
//       Swal.fire({ icon: 'error', title: 'Deletion Failed', text: error.response?.data?.message || error.message });
//     }
//   };

//   const handleEditPlan = (plan) => {
//     console.log('Plan data:', plan);
//     setEditPlan({
//       _id: plan._id,
//       name: plan.name,
//       amount: Number(plan.amount),
//       hours: Number(plan.hours),
//       minutes: Number(plan.minutes),
//       isActive: plan.isActive,
//     });
//     setShowEditModal(true);
//   };

//   const filteredPlans = plans.filter(plan => {
//     if (!plan) return false;
//     return (
//       plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       `${plan.amount}`.includes(searchTerm) ||
//       `${plan.hours}h ${plan.minutes}m`.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   if (loading) {
//     return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-7xl mx-auto"><p>Loading plans...</p></motion.div>;
//   }

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-7xl mx-auto">
//       <motion.h1 initial={{ y: -20 }} animate={{ y: 0 }} className="text-3xl font-bold text-gray-800 mb-8">Plan Management</motion.h1>

//       <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="rounded-xl bg-white shadow-lg overflow-hidden">
//         <div className="p-6">
//           <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//             <div className="flex items-center w-full sm:w-auto">
//               <div className="relative w-full sm:w-64">
//                 <input
//                   type="text"
//                   placeholder="Search plans..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 />
//                 <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               </div>
//               <button className="ml-2 p-2 text-gray-400 hover:text-gray-600"><Filter className="h-5 w-5" /></button>
//             </div>
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setShowPlanModal(true)}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
//             >
//               <Plus className="h-5 w-5" /> New Plan
//             </motion.button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <select
//               value={filters.isActive} // Changed from 'active' to 'isActive'
//               onChange={(e) => setFilters({ ...filters, isActive: e.target.value })} // Changed from 'active' to 'isActive'
//               className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
//             >
//               <option value="">All Statuses</option>
//               <option value="true">Active</option>
//               <option value="false">Inactive</option>
//             </select>
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => { setFilters({ isActive: '' }); setSearchTerm(''); }} // Changed from 'active' to 'isActive'
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
//             >
//               Clear Filters
//             </motion.button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="text-left py-3 px-4 text-gray-600">Name</th>
//                   <th className="text-left py-3 px-4 text-gray-600">Amount (₹)</th>
//                   <th className="text-left py-3 px-4 text-gray-600">Duration</th>
//                   <th className="text-left py-3 px-4 text-gray-600">Status</th>
//                   <th className="text-left py-3 px-4 text-gray-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredPlans.length > 0 ? (
//                   filteredPlans.map((plan) => (
//                     <motion.tr
//                       key={plan._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -20 }}
//                       className="border-b border-gray-200 hover:bg-gray-50"
//                     >
//                       <td className="py-3 px-4 text-gray-800">{plan.name}</td>
//                       <td className="py-3 px-4 text-gray-800">{plan.amount}</td>
//                       <td className="py-3 px-4 text-gray-800">{`${plan.hours}h ${plan.minutes}m`}</td>
//                       <td className="py-3 px-4">
//                         <span className={`px-3 py-1 rounded-full text-sm ${plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                           {plan.isActive ? 'Active' : 'Inactive'} 
//                         </span>
//                       </td>
//                       <td className="py-3 px-4">
//                         <div className="flex items-center gap-2">
//                           <motion.button
//                             whileHover={{ scale: 1.1 }}
//                             whileTap={{ scale: 0.9 }}
//                             onClick={() => handleEditPlan(plan)}
//                             className="p-1 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50"
//                           >
//                             <Edit2 className="h-4 w-4" />
//                           </motion.button>
//                           <motion.button
//                             whileHover={{ scale: 1.1 }}
//                             whileTap={{ scale: 0.9 }}
//                             onClick={() => { setPlanToDelete(plan); setShowDeleteModal(true); }}
//                             className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </motion.button>
//                         </div>
//                       </td>
//                     </motion.tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={5} className="py-3 px-4 text-center text-gray-500">
//                       No plans found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </motion.div>

//       {/* New Plan Modal */}
//       <AnimatePresence>
//         {showPlanModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.95, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white rounded-lg p-6 w-full max-w-lg shadow-md border border-gray-300"
//             >
//               <div className="flex justify-between items-center mb-6 border-b pb-4">
//                 <h3 className="text-2xl font-bold text-gray-800">Create New Plan</h3>
//                 <button onClick={() => setShowPlanModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
//                   <X className="h-6 w-6 text-gray-600" />
//                 </button>
//               </div>
//               <form onSubmit={(e) => { e.preventDefault(); createNewPlan(); }} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
//                   <input
//                     type="text"
//                     value={newPlan.name}
//                     onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter plan name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
//                   <input
//                     type="number"
//                     value={newPlan.amount}
//                     onChange={(e) => setNewPlan(prev => ({ ...prev, amount: e.target.value }))}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     min="0"
//                     placeholder="Enter amount"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
//                     <input
//                       type="number"
//                       value={newPlan.hours}
//                       onChange={(e) => setNewPlan(prev => ({ ...prev, hours: e.target.value }))}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       min="0"
//                       placeholder="Enter hours"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Minutes</label>
//                     <input
//                       type="number"
//                       value={newPlan.minutes}
//                       onChange={(e) => setNewPlan(prev => ({ ...prev, minutes: e.target.value }))}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       min="0"
//                       max="59"
//                       placeholder="Enter minutes"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     value={newPlan.isActive} // Changed from 'active' to 'isActive'
//                     onChange={(e) => setNewPlan(prev => ({ ...prev, isActive: e.target.value === 'true' }))} // Changed from 'active' to 'isActive'
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="true">Active</option>
//                     <option value="false">Inactive</option>
//                   </select>
//                 </div>
//                 <div className="flex justify-end gap-3">
//                   <button type="button" onClick={() => setShowPlanModal(false)} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
//                     Cancel
//                   </button>
//                   <button type="submit" className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
//                     <Check className="h-5 w-5 inline mr-2" /> Create Plan
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Edit Plan Modal */}
//       <AnimatePresence>
//         {showEditModal && editPlan && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.95, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white rounded-lg p-6 w-full max-w-lg shadow-md border border-gray-300"
//             >
//               <div className="flex justify-between items-center mb-6 border-b pb-4">
//                 <h3 className="text-2xl font-bold text-gray-800">Edit Plan</h3>
//                 <button onClick={() => { setShowEditModal(false); setEditPlan(null); }} className="p-2 hover:bg-gray-100 rounded-full">
//                   <X className="h-6 w-6 text-gray-600" />
//                 </button>
//               </div>
//               <form onSubmit={(e) => { e.preventDefault(); editPlanSubmit(); }} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
//                   <input
//                     type="text"
//                     value={editPlan.name}
//                     onChange={(e) => setEditPlan(prev => ({ ...prev, name: e.target.value }))}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter plan name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
//                   <input
//                     type="number"
//                     value={editPlan.amount}
//                     onChange={(e) => setEditPlan(prev => ({ ...prev, amount: Number(e.target.value) || 0 }))}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     min="0"
//                     placeholder="Enter amount"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
//                     <input
//                       type="number"
//                       value={editPlan.hours}
//                       onChange={(e) => setEditPlan(prev => ({ ...prev, hours: Number(e.target.value) || 0 }))}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       min="0"
//                       placeholder="Enter hours"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Minutes</label>
//                     <input
//                       type="number"
//                       value={editPlan.minutes}
//                       onChange={(e) => setEditPlan(prev => ({ ...prev, minutes: Number(e.target.value) || 0 }))}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       min="0"
//                       max="59"
//                       placeholder="Enter minutes"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     value={editPlan.isActive}
//                     onChange={(e) => setEditPlan(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="true">Active</option>
//                     <option value="false">Inactive</option>
//                   </select>
//                 </div>
//                 <div className="flex justify-end gap-3">
//                   <button type="button" onClick={() => { setShowEditModal(false); setEditPlan(null); }} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
//                     Cancel
//                   </button>
//                   <button type="submit" className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
//                     <Check className="h-5 w-5 inline mr-2" /> Update Plan
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Delete Confirmation Modal */}
//       <AnimatePresence>
//         {showDeleteModal && planToDelete && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.95, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white rounded-lg p-6 w-full max-w-md shadow-md"
//             >
//               <div className="text-center">
//                 <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
//                   <Trash2 className="h-8 w-8 text-red-600" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Plan</h3>
//                 <p className="text-gray-600 mb-6">Are you sure you want to delete this plan? This action cannot be undone.</p>
//                 <div className="flex justify-end gap-3">
//                   <button type="button" onClick={() => { setShowDeleteModal(false); setPlanToDelete(null); }} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
//                     Cancel
//                   </button>
//                   <button type="button" onClick={deletePlan} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default Plans;


import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, Check, Clock, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import Swal from 'sweetalert2';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [newPlan, setNewPlan] = useState({
    name: '',
    amount: '',
    hours: '',
    minutes: '',
    isActive: true,
  });
  const [editPlan, setEditPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ isActive: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, [filters]);

  const fetchPlans = async () => {
    setLoading(true);
    let query = '/api/plans/plans?';
    if (filters.isActive) query += `isActive=${filters.isActive}`;
    if (query.endsWith('&')) query = query.slice(0, -1);

    try {
      const response = await api.get(query);
      setPlans(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const validatePlanData = (plan) => {
    const errors = [];
    if (!plan.name) errors.push('plan name');
    if (!plan.amount || isNaN(parseFloat(plan.amount)) || parseFloat(plan.amount) <= 0) {
      errors.push('valid amount (greater than 0)');
    }
    if (!plan.hours && plan.hours !== 0 || isNaN(parseInt(plan.hours)) || parseInt(plan.hours) < 0) {
      errors.push('valid hours (non-negative)');
    }
    if (!plan.minutes && plan.minutes !== 0 || isNaN(parseInt(plan.minutes)) || parseInt(plan.minutes) < 0 || parseInt(plan.minutes) >= 60) {
      errors.push('valid minutes (0 to 59)');
    }
    return errors;
  };

  const createNewPlan = async () => {
    const errors = validatePlanData(newPlan);
    if (errors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Errors',
        html: `Please correct:<br><ul className="list-disc list-inside">${errors.map(err => `<li>${err}</li>`).join('')}</ul>`,
      });
      return;
    }

    const planData = {
      name: newPlan.name,
      amount: parseFloat(newPlan.amount),
      hours: parseInt(newPlan.hours),
      minutes: parseInt(newPlan.minutes),
      isActive: newPlan.isActive,
    };

    try {
      await api.post('/api/plans/add-plan', planData);
      fetchPlans();
      setShowPlanModal(false);
      setNewPlan({ name: '', amount: '', hours: '', minutes: '', isActive: true });
      Swal.fire({ icon: 'success', title: 'Plan Created', text: 'Plan successfully created!' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Creation Failed', text: error.response?.data?.message || error.message });
    }
  };

  const editPlanSubmit = async () => {
    if (!editPlan) return;

    const errors = validatePlanData(editPlan);
    if (errors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Errors',
        html: `Please correct:<br><ul className="list-disc list-inside">${errors.map(err => `<li>${err}</li>`).join('')}</ul>`,
      });
      return;
    }

    const updatedData = {
      name: editPlan.name,
      amount: parseFloat(editPlan.amount),
      hours: parseInt(editPlan.hours),
      minutes: parseInt(editPlan.minutes),
      isActive: editPlan.isActive,
    };

    try {
      await api.put(`/api/plans/plans/${editPlan._id}`, updatedData);
      fetchPlans();
      setShowEditModal(false);
      setEditPlan(null);
      Swal.fire({ icon: 'success', title: 'Plan Updated', text: 'Plan successfully updated!' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update Failed', text: error.response?.data?.message || error.message });
    }
  };

  const deletePlan = async () => {
    if (!planToDelete) return;

    try {
      await api.delete(`/api/plans/plans/${planToDelete._id}`);
      fetchPlans();
      setShowDeleteModal(false);
      setPlanToDelete(null);
      Swal.fire({ icon: 'success', title: 'Plan Deleted', text: 'Plan successfully deleted!' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Deletion Failed', text: error.response?.data?.message || error.message });
    }
  };

  const handleEditPlan = (plan) => {
    console.log('Plan data:', plan);
    setEditPlan({
      _id: plan._id,
      name: plan.name,
      amount: Number(plan.amount) || 0,
      hours: Number(plan.hours) || 0,
      minutes: Number(plan.minutes) || 0,
      isActive: plan.isActive,
    });
    setShowEditModal(true);
  };

  const filteredPlans = plans.filter(plan => {
    if (!plan) return false;
    return (
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${plan.amount}`.includes(searchTerm) ||
      `${plan.hours}h ${plan.minutes}m`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-7xl mx-auto"><p>Loading plans...</p></motion.div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-7xl mx-auto">
      <motion.h1 initial={{ y: -20 }} animate={{ y: 0 }} className="text-3xl font-bold text-gray-800 mb-8">Plan Management</motion.h1>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="rounded-xl bg-white shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button className="ml-2 p-2 text-gray-400 hover:text-gray-600"><Filter className="h-5 w-5" /></button>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPlanModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" /> New Plan
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            >
              <option value="">All Statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setFilters({ isActive: '' }); setSearchTerm(''); }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Clear Filters
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 text-gray-600">Amount (₹)</th>
                  <th className="text-left py-3 px-4 text-gray-600">Duration</th>
                  <th className="text-left py-3 px-4 text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => (
                    <motion.tr
                      key={plan._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-800">{plan.name}</td>
                      <td className="py-3 px-4 text-gray-800">{plan.amount}</td>
                      <td className="py-3 px-4 text-gray-800">{`${plan.hours}h ${plan.minutes}m`}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {plan.isActive ? 'Active' : 'Inactive'} 
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditPlan(plan)}
                            className="p-1 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setPlanToDelete(plan); setShowDeleteModal(true); }}
                            className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-3 px-4 text-center text-gray-500">
                      No plans found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* New Plan Modal */}
      <AnimatePresence>
        {showPlanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-lg shadow-md border border-gray-300"
            >
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-2xl font-bold text-gray-800">Create New Plan</h3>
                <button onClick={() => setShowPlanModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); createNewPlan(); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter plan name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={newPlan.amount}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, amount: e.target.value || '' }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                    <input
                      type="number"
                      value={newPlan.hours}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, hours: e.target.value || '' }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      placeholder="Enter hours"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minutes</label>
                    <input
                      type="number"
                      value={newPlan.minutes}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, minutes: e.target.value || '' }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="59"
                      placeholder="Enter minutes"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newPlan.isActive}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowPlanModal(false)} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    <Check className="h-5 w-5 inline mr-2" /> Create Plan
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Plan Modal */}
      <AnimatePresence>
        {showEditModal && editPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-lg shadow-md border border-gray-300"
            >
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-2xl font-bold text-gray-800">Edit Plan</h3>
                <button onClick={() => { setShowEditModal(false); setEditPlan(null); }} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); editPlanSubmit(); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={editPlan.name}
                    onChange={(e) => setEditPlan(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter plan name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={editPlan.amount}
                    onChange={(e) => setEditPlan(prev => ({ ...prev, amount: e.target.value !== '' ? Number(e.target.value) : 0 }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                    <input
                      type="number"
                      value={editPlan.hours}
                      onChange={(e) => setEditPlan(prev => ({ ...prev, hours: e.target.value !== '' ? Number(e.target.value) : 0 }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      placeholder="Enter hours"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minutes</label>
                    <input
                      type="number"
                      value={editPlan.minutes}
                      onChange={(e) => setEditPlan(prev => ({ ...prev, minutes: e.target.value !== '' ? Number(e.target.value) : 0 }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="59"
                      placeholder="Enter minutes"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editPlan.isActive}
                    onChange={(e) => setEditPlan(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => { setShowEditModal(false); setEditPlan(null); }} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    <Check className="h-5 w-5 inline mr-2" /> Update Plan
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && planToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-md"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Plan</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this plan? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => { setShowDeleteModal(false); setPlanToDelete(null); }} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                    Cancel
                  </button>
                  <button type="button" onClick={deletePlan} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Plans;