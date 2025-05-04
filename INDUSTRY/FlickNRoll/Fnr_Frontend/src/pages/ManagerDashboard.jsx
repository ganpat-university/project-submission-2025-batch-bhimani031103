// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Activity, Users, Calendar, Package, DollarSign, Clock, AlertTriangle, CreditCard, 
//   Plus, Edit3, UserPlus, X, CheckCircle, XCircle, Search, Trash2, Save, ArrowUpRight, ArrowDownRight
// } from 'lucide-react';
// import { format, parse, addHours, addMinutes } from 'date-fns';
// import api from '../utils/api';

// const ManagerDashboard = () => {
//   const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
//   const [showCourtModal, setShowCourtModal] = useState(false);
//   const [selectedCourt, setSelectedCourt] = useState(null);
//   const [courts, setCourts] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [courtStatuses, setCourtStatuses] = useState([]);
//   const [futureBookings, setFutureBookings] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     activeCourts: '0/5',
//     members: 0,
//     totalIn: 0,
//     totalOut: 0
//   });

//   useEffect(() => {
//     fetchDashboardData();
//   }, [selectedTimeframe]);

//   const fetchDashboardData = async () => {
//     try {
//       const [dashboardStats, balanceRes, totalInRes, totalOutRes, courtStatusRes, futureBookingsRes, membersRes] = await Promise.all([
//         api.get('/api/dashboard/stats'),
//         api.get('/api/reports/current-balance'),
//         api.get('/api/reports/total-in'),
//         api.get('/api/reports/total-out'),
//         api.get('/api/bookings/courts/status'),
//         api.get('/api/bookings/future'),
//         api.get('/api/members')
//       ]);

//       setStats({
//         activeCourts: dashboardStats.data.activeCourts,
//         members: dashboardStats.data.members,
//         totalIn: totalInRes.data.totalIn,
//         totalOut: totalOutRes.data.totalOut
//       });
//       setCourtStatuses(courtStatusRes.data);
//       setMembers(membersRes.data);

//       const transformedBookings = futureBookingsRes.data.slice(0, 5).map(booking => {
//         const startTimeParts = booking.startTime.split(':').map(Number);
//         const startDate = new Date(booking.date);
//         startDate.setHours(startTimeParts[0], startTimeParts[1], 0, 0);
//         const durationHours = Math.floor(booking.duration || 1);
//         const durationMinutes = Math.round((booking.duration - durationHours) * 60);
//         const endDate = addMinutes(addHours(startDate, durationHours), durationMinutes);
//         const formattedStartTime = format(startDate, 'hh:mm a');
//         const endTime = format(endDate, 'hh:mm a');
//         const timeRange = `${formattedStartTime} - ${endTime}`;

//         const players = Array.isArray(booking.players) ? booking.players : [];

//         return {
//           ...booking,
//           time: timeRange,
//           courtId: booking.court || booking.courtId,
//           players,
//           status: booking.status || 'confirmed',
//           paymentStatus: booking.paymentStatus || 'pending'
//         };
//       });

//       setFutureBookings(transformedBookings);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCourtStatusUpdate = async (courtNumber, newStatus) => {
//     try {
//       const response = await api.put(`/api/bookings/courts/${courtNumber}/status`, {
//         isActive: newStatus
//       });
      
//       setCourtStatuses(prevStatuses =>
//         prevStatuses.map(court =>
//           court.number === courtNumber ? { ...court, isActive: newStatus } : court
//         )
//       );
      
//       const dashboardStats = await api.get('/api/dashboard/stats');
//       setStats(prevStats => ({
//         ...prevStats,
//         activeCourts: dashboardStats.data.activeCourts
//       }));
      
//       return response.data;
//     } catch (error) {
//       console.error('Error updating court status:', error);
//       throw error;
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const getMemberName = (memberId) => {
//     if (!memberId) return 'N/A';
//     const member = members.find(m => m._id === memberId);
//     if (member) {
//       if (member.user && member.user.name) return member.user.name;
//       if (member.name) return member.name;
//       return member.email ? member.email.split('@')[0] : 'Unknown Member';
//     }
//     return 'N/A';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <p className="text-lg text-gray-600">Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="min-h-screen bg-transparent p-6"
//     >
//       <div className="max-w-7xl mx-auto">
//         <motion.div 
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ type: "spring", stiffness: 260, damping: 20 }}
//           className="flex justify-between items-center mb-6"
//         >
//           <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
//           <div className="flex items-center space-x-4">
//             <Clock className="text-gray-500" />
//             <span className="text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
//           </div>
//         </motion.div>

//         <motion.div 
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.1 }}
//           className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
//         >
//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.1 }}
//             whileHover={{ scale: 1.02 }}
//             className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="flex items-center">
//               <Activity className="text-emerald-500 h-10 w-10" />
//               <div className="ml-4">
//                 <p className="text-gray-600">Active Courts</p>
//                 <p className="text-2xl font-semibold text-gray-800">{stats.activeCourts}</p>
//                 <p className="text-sm text-gray-500">Courts in use</p>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             whileHover={{ scale: 1.02 }}
//             className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="flex items-center">
//               <Users className="text-blue-500 h-10 w-10" />
//               <div className="ml-4">
//                 <p className="text-gray-600">Members</p>
//                 <p className="text-2xl font-semibold text-gray-800">{stats.members}</p>
//                 <p className="text-sm text-gray-500">Active members</p>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             whileHover={{ scale: 1.02 }}
//             className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="flex items-center">
//               <ArrowUpRight className="text-green-500 h-10 w-10" />
//               <div className="ml-4">
//                 <p className="text-gray-600">Total In</p>
//                 <p className="text-2xl font-semibold text-green-600">{formatCurrency(stats.totalIn)}</p>
//                 <p className="text-sm text-gray-500">All time income</p>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             whileHover={{ scale: 1.02 }}
//             className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="flex items-center">
//               <ArrowDownRight className="text-red-500 h-10 w-10" />
//               <div className="ml-4">
//                 <p className="text-gray-600">Total Out</p>
//                 <p className="text-2xl font-semibold text-red-600">{formatCurrency(stats.totalOut)}</p>
//                 <p className="text-sm text-gray-500">All time expenses</p>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>

//         <motion.div
//           initial={{ x: -20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="rounded-xl bg-white p-6 shadow-lg mb-6"
//         >
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Court Maintenance</h2>
//           <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//             {courtStatuses.map((court, index) => (
//               <motion.div
//                 key={court.number}
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 + index * 0.1 }}
//                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-sm mb-2 last:mb-0"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className={`flex items-center justify-center w-8 h-8 rounded-full ${court.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
//                     {court.isActive ? (
//                       <CheckCircle className="h-5 w-5 text-green-600" />
//                     ) : (
//                       <AlertTriangle className="h-5 w-5 text-red-600" />
//                     )}
//                   </div>
//                   <div>
//                     <span className="text-sm font-medium text-gray-800">Court {court.number}</span>
//                     <p className="text-xs text-gray-500">{court.isActive ? 'Active' : 'Under Maintenance'}</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => handleCourtStatusUpdate(court.number, !court.isActive)}
//                   className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-200 ${
//                     court.isActive
//                       ? 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
//                       : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
//                   }`}
//                 >
//                   {court.isActive ? 'Deactivate' : 'Activate'}
//                 </button>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="rounded-xl bg-white p-6 shadow-lg mb-6"
//         >
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-800">Upcoming Bookings</h2>
//             <div className="flex items-center gap-4">
//               <select
//                 value={selectedTimeframe}
//                 onChange={(e) => setSelectedTimeframe(e.target.value)}
//                 className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//               >
//                 <option value="12h">Next 12 hours</option>
//                 <option value="24h">Next 24 hours</option>
//                 <option value="7d">Next 7 days</option>
//               </select>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {futureBookings.length > 0 ? (
//                   futureBookings.map((booking, index) => {
//                     let name = 'N/A';
//                     if (booking.bookingType === 'member' && booking.players?.length > 0) {
//                       const memberId = typeof booking.players[0] === 'string' ? booking.players[0] : booking.players[0]?._id;
//                       name = getMemberName(memberId);
//                     } else if (booking.bookingType === 'general') {
//                       name = booking.name || 'N/A';
//                     }

//                     return (
//                       <motion.tr 
//                         key={booking._id} // Fixed key prop
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.1 }}
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {format(new Date(booking.date), 'dd/MM/yyyy')}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {booking.time}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           Court {booking.courtId}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             booking.status === 'confirmed' 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             booking.paymentStatus === 'paid' 
//                               ? 'bg-blue-100 text-blue-800'
//                               : 'bg-gray-100 text-gray-800'
//                           }`}>
//                             {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
//                           </span>
//                         </td>
//                       </motion.tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
//                       No upcoming bookings found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>

//         <motion.div 
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="rounded-xl bg-white p-6 shadow-lg mb-6"
//         >
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Live Court Status</h2>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             {courtStatuses.map((court) => (
//               <motion.div
//                 key={court.number}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className={`p-4 rounded-lg ${
//                   !court.isActive ? 'bg-red-100' :
//                   court.currentBooking ? 'bg-yellow-100' : 'bg-green-100'
//                 }`}
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="font-medium">Court {court.number}</span>
//                   {court.isActive ? (
//                     <CheckCircle className="w-5 h-5 text-green-500" />
//                   ) : (
//                     <XCircle className="w-5 h-5 text-red-500" />
//                   )}
//                 </div>
//                 <p className="text-sm">
//                   {!court.isActive ? 'Under Maintenance' :
//                    court.currentBooking ? `Booked: ${court.currentBooking.time}` : 'Available'}
//                 </p>
//                 {court.currentBooking && (
//                   <p className="text-xs mt-1">{court.currentBooking.member}</p>
//                 )}
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default ManagerDashboard;

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Activity, Users, Calendar, Package, DollarSign, Clock, AlertTriangle, CreditCard, 
//   Plus, Edit3, UserPlus, X, CheckCircle, XCircle, Search, Trash2, Save, ArrowUpRight, ArrowDownRight
// } from 'lucide-react';
// import { format, parse, addHours, addMinutes } from 'date-fns';
// import api from '../utils/api';

// const ManagerDashboard = () => {
//   const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
//   const [showCourtModal, setShowCourtModal] = useState(false);
//   const [selectedCourt, setSelectedCourt] = useState(null);
//   const [courts, setCourts] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [courtStatuses, setCourtStatuses] = useState([]);
//   const [futureBookings, setFutureBookings] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     activeCourts: '0/5',
//     members: 0,
//     totalIn: 0,
//     totalOut: 0
//   });

//   useEffect(() => {
//     fetchDashboardData();
//     // Refresh live status every minute
//     const interval = setInterval(() => {
//       updateLiveCourtStatus();
//     }, 60000); // 1 minute
//     return () => clearInterval(interval);
//   }, [selectedTimeframe, futureBookings]);

//   const fetchDashboardData = async () => {
//     try {
//       const [dashboardStats, balanceRes, totalInRes, totalOutRes, courtStatusRes, futureBookingsRes, membersRes] = await Promise.all([
//         api.get('/api/dashboard/stats'),
//         api.get('/api/reports/current-balance'),
//         api.get('/api/reports/total-in'),
//         api.get('/api/reports/total-out'),
//         api.get('/api/bookings/courts/status'),
//         api.get('/api/bookings/future'),
//         api.get('/api/members')
//       ]);

//       setStats({
//         activeCourts: dashboardStats.data.activeCourts,
//         members: dashboardStats.data.members,
//         totalIn: totalInRes.data.totalIn,
//         totalOut: totalOutRes.data.totalOut
//       });
//       setCourtStatuses(courtStatusRes.data);
//       setMembers(membersRes.data);

//       const transformedBookings = futureBookingsRes.data.slice(0, 5).map(booking => {
//         const startTimeParts = booking.startTime.split(':').map(Number);
//         const startDate = new Date(booking.date);
//         startDate.setHours(startTimeParts[0], startTimeParts[1], 0, 0);
//         const durationHours = Math.floor(booking.duration || 1);
//         const durationMinutes = Math.round((booking.duration - durationHours) * 60);
//         const endDate = addMinutes(addHours(startDate, durationHours), durationMinutes);
//         const formattedStartTime = format(startDate, 'hh:mm a');
//         const endTime = format(endDate, 'hh:mm a');
//         const timeRange = `${formattedStartTime} - ${endTime}`;

//         const players = Array.isArray(booking.players) ? booking.players : [];

//         return {
//           ...booking,
//           time: timeRange,
//           courtId: booking.court || booking.courtId,
//           players,
//           status: booking.status || 'confirmed',
//           paymentStatus: booking.paymentStatus || 'pending',
//           startDateTime: startDate,
//           endDateTime: endDate
//         };
//       });

//       setFutureBookings(transformedBookings);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateLiveCourtStatus = () => {
//     const now = new Date();
//     const updatedCourtStatuses = courtStatuses.map(court => {
//       const currentBooking = futureBookings.find(booking => 
//         booking.courtId === court.number &&
//         now >= booking.startDateTime &&
//         now <= booking.endDateTime &&
//         booking.status !== 'cancelled'
//       );
//       return {
//         ...court,
//         isCurrentlyBooked: !!currentBooking,
//         bookingTimeRange: currentBooking ? currentBooking.time : null
//       };
//     });
//     setCourtStatuses(updatedCourtStatuses);
//   };

//   const handleCourtStatusUpdate = async (courtNumber, newStatus) => {
//     try {
//       const response = await api.put(`/api/bookings/courts/${courtNumber}/status`, {
//         isActive: newStatus
//       });
      
//       setCourtStatuses(prevStatuses =>
//         prevStatuses.map(court =>
//           court.number === courtNumber ? { ...court, isActive: newStatus } : court
//         )
//       );
      
//       const dashboardStats = await api.get('/api/dashboard/stats');
//       setStats(prevStats => ({
//         ...prevStats,
//         activeCourts: dashboardStats.data.activeCourts
//       }));
      
//       return response.data;
//     } catch (error) {
//       console.error('Error updating court status:', error);
//       throw error;
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const getMemberName = (memberId) => {
//     if (!memberId) return 'N/A';
//     const member = members.find(m => m._id === memberId);
//     if (member) {
//       if (member.user && member.user.name) return member.user.name;
//       if (member.name) return member.name;
//       return member.email ? member.email.split('@')[0] : 'Unknown Member';
//     }
//     return 'N/A';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <p className="text-lg text-gray-600">Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="min-h-screen bg-transparent p-6"
//     >
//       <div className="max-w-7xl mx-auto">
//         <motion.div 
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ type: "spring", stiffness: 260, damping: 20 }}
//           className="flex justify-between items-center mb-6"
//         >
//           <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
//           <div className="flex items-center space-x-4">
//             <Clock className="text-gray-500" />
//             <span className="text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
//           </div>
//         </motion.div>

//         <motion.div 
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.1 }}
//           className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
//         >
//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.1 }}
//             whileHover={{ scale: 1.02 }}
//             className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="flex items-center">
//               <Activity className="text-emerald-500 h-10 w-10" />
//               <div className="ml-4">
//                 <p className="text-gray-600">Active Courts</p>
//                 <p className="text-2xl font-semibold text-gray-800">{stats.activeCourts}</p>
//                 <p className="text-sm text-gray-500">Courts in use</p>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             whileHover={{ scale: 1.02 }}
//             className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="flex items-center">
//               <Users className="text-blue-500 h-10 w-10" />
//               <div className="ml-4">
//                 <p className="text-gray-600">Members</p>
//                 <p className="text-2xl font-semibold text-gray-800">{stats.members}</p>
//                 <p className="text-sm text-gray-500">Active members</p>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             whileHover={{ scale: 1.02 }}
//             className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="flex items-center">
//               <ArrowUpRight className="text-green-500 h-10 w-10" />
//               <div className="ml-4">
//                 <p className="text-gray-600">Total In</p>
//                 <p className="text-2xl font-semibold text-green-600">{formatCurrency(stats.totalIn)}</p>
//                 <p className="text-sm text-gray-500">All time income</p>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             whileHover={{ scale: 1.02 }}
//             className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="flex items-center">
//               <ArrowDownRight className="text-red-500 h-10 w-10" />
//               <div className="ml-4">
//                 <p className="text-gray-600">Total Out</p>
//                 <p className="text-2xl font-semibold text-red-600">{formatCurrency(stats.totalOut)}</p>
//                 <p className="text-sm text-gray-500">All time expenses</p>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>

//         <motion.div
//           initial={{ x: -20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="rounded-xl bg-white p-6 shadow-lg mb-6"
//         >
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Court Maintenance</h2>
//           <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//             {courtStatuses.map((court, index) => (
//               <motion.div
//                 key={court.number}
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 + index * 0.1 }}
//                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-sm mb-2 last:mb-0"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className={`flex items-center justify-center w-8 h-8 rounded-full ${court.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
//                     {court.isActive ? (
//                       <CheckCircle className="h-5 w-5 text-green-600" />
//                     ) : (
//                       <AlertTriangle className="h-5 w-5 text-red-600" />
//                     )}
//                   </div>
//                   <div>
//                     <span className="text-sm font-medium text-gray-800">Court {court.number}</span>
//                     <p className="text-xs text-gray-500">{court.isActive ? 'Active' : 'Under Maintenance'}</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => handleCourtStatusUpdate(court.number, !court.isActive)}
//                   className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-200 ${
//                     court.isActive
//                       ? 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
//                       : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
//                   }`}
//                 >
//                   {court.isActive ? 'Deactivate' : 'Activate'}
//                 </button>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="rounded-xl bg-white p-6 shadow-lg mb-6"
//         >
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-800">Upcoming Bookings</h2>
//             <div className="flex items-center gap-4">
//               <select
//                 value={selectedTimeframe}
//                 onChange={(e) => setSelectedTimeframe(e.target.value)}
//                 className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//               >
//                 <option value="12h">Next 12 hours</option>
//                 <option value="24h">Next 24 hours</option>
//                 <option value="7d">Next 7 days</option>
//               </select>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {futureBookings.length > 0 ? (
//                   futureBookings.map((booking, index) => {
//                     let name = 'N/A';
//                     if (booking.bookingType === 'member' && booking.players?.length > 0) {
//                       const memberId = typeof booking.players[0] === 'string' ? booking.players[0] : booking.players[0]?._id;
//                       name = getMemberName(memberId);
//                     } else if (booking.bookingType === 'general') {
//                       name = booking.name || 'N/A';
//                     }

//                     return (
//                       <motion.tr 
//                         key={booking._id}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.1 }}
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {format(new Date(booking.date), 'dd/MM/yyyy')}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {booking.time}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           Court {booking.courtId}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             booking.status === 'confirmed' 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             booking.paymentStatus === 'paid' 
//                               ? 'bg-blue-100 text-blue-800'
//                               : 'bg-gray-100 text-gray-800'
//                           }`}>
//                             {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
//                           </span>
//                         </td>
//                       </motion.tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
//                       No upcoming bookings found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>

//         <motion.div 
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="rounded-xl bg-white p-6 shadow-lg mb-6"
//         >
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Live Court Status</h2>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             {courtStatuses.map((court) => (
//               <motion.div
//                 key={court.number}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className={`p-4 rounded-lg transition-all duration-200 ${
//                   !court.isActive ? 'bg-gray-200' : // Inactive courts
//                   court.isCurrentlyBooked ? 'bg-red-100' : 'bg-green-100' // Booked (red) or Available (green)
//                 }`}
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="font-medium">Court {court.number}</span>
//                   {court.isActive ? (
//                     court.isCurrentlyBooked ? (
//                       <XCircle className="w-5 h-5 text-red-500" />
//                     ) : (
//                       <CheckCircle className="w-5 h-5 text-green-500" />
//                     )
//                   ) : (
//                     <XCircle className="w-5 h-5 text-gray-500" />
//                   )}
//                 </div>
//                 <p className="text-sm">
//                   {!court.isActive ? 'Inactive' :
//                    court.isCurrentlyBooked ? `Booked: ${court.bookingTimeRange}` : 'Available'}
//                 </p>
//                 {court.isCurrentlyBooked && court.currentBooking && (
//                   <p className="text-xs mt-1">{court.currentBooking.member || 'N/A'}</p>
//                 )}
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default ManagerDashboard;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Activity, Users, DollarSign, Clock, AlertTriangle, CheckCircle, XCircle,
//   Search, Trash2, ArrowUpRight, ArrowDownRight, Sun, Moon, RefreshCw, Wrench,
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { format, parse, addHours, addMinutes } from 'date-fns';
// import api from '../utils/api';

// const ManagerDashboard = () => {
//   const navigate = useNavigate();
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
//   const [isLoading, setIsLoading] = useState(true);
//   const [courtStatuses, setCourtStatuses] = useState([]);
//   const [futureBookings, setFutureBookings] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [stats, setStats] = useState({
//     activeCourts: '0/5',
//     members: 0,
//     currentBalance: 0, // Changed from totalIn to currentBalance
//     totalOut: 0,
//   });

//   useEffect(() => {
//     fetchDashboardData();
//     const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
//     return () => clearInterval(interval);
//   }, [selectedTimeframe]);

//   const fetchDashboardData = async () => {
//     try {
//       const [dashboardStats, balanceRes, totalOutRes, courtStatusRes, futureBookingsRes, membersRes] = await Promise.all([
//         api.get('/api/dashboard/stats'),
//         api.get('/api/reports/current-balance'), // Fetch current balance instead of total-in
//         api.get('/api/reports/total-out'),
//         api.get('/api/bookings/courts/status'),
//         api.get('/api/bookings/future'),
//         api.get('/api/members'),
//       ]);

//       setStats({
//         activeCourts: dashboardStats.data.activeCourts,
//         members: dashboardStats.data.members,
//         currentBalance: balanceRes.data.currentBalance, // Set currentBalance
//         totalOut: totalOutRes.data.totalOut,
//       });

//       setCourtStatuses(courtStatusRes.data.map(court => ({
//         ...court,
//         isActive: court.isActive || false,
//         isUnderMaintenance: court.isUnderMaintenance || false,
//       })));
//       setMembers(membersRes.data);

//       const transformedBookings = futureBookingsRes.data.bookings.slice(0, 5).map(booking => {
//         const startTimeParts = booking.startTime.split(':').map(Number);
//         const startDate = new Date(booking.date);
//         startDate.setHours(startTimeParts[0], startTimeParts[1], 0, 0);
//         const durationHours = Math.floor(booking.duration || 1);
//         const durationMinutes = Math.round((booking.duration - durationHours) * 60);
//         const endDate = addMinutes(addHours(startDate, durationHours), durationMinutes);
//         const formattedStartTime = format(startDate, 'hh:mm a');
//         const endTime = format(endDate, 'hh:mm a');
//         const timeRange = `${formattedStartTime} - ${endTime}`;

//         const players = Array.isArray(booking.players) ? booking.players : [];

//         return {
//           ...booking,
//           time: timeRange,
//           courtId: booking.court || booking.courtId,
//           players,
//           status: booking.status || 'confirmed',
//           paymentStatus: booking.paymentStatus || 'pending',
//         };
//       });

//       setFutureBookings(transformedBookings);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCourtStatusUpdate = async (courtNumber, newStatus, maintenanceStatus) => {
//     try {
//       const response = await api.put(`/api/bookings/courts/${courtNumber}/status`, {
//         isActive: newStatus,
//         isUnderMaintenance: maintenanceStatus,
//       });

//       setCourtStatuses(prevStatuses =>
//         prevStatuses.map(court =>
//           court.number === courtNumber
//             ? { ...court, isActive: newStatus, isUnderMaintenance: maintenanceStatus }
//             : court
//         )
//       );

//       const dashboardStats = await api.get('/api/dashboard/stats');
//       setStats(prevStats => ({
//         ...prevStats,
//         activeCourts: dashboardStats.data.activeCourts,
//       }));

//       return response.data;
//     } catch (error) {
//       console.error('Error updating court status:', error);
//       throw error;
//     }
//   };

//   const handleCancelBooking = async (booking_id) => {
//     if (window.confirm('Are you sure you want to cancel this booking?')) {
//       try {
//         await api.delete(`/api/bookings/${booking_id}`);
//         setFutureBookings(prevBookings =>
//           prevBookings.filter(booking => booking._id !== booking_id)
//         );
//         const dashboardStats = await api.get('/api/dashboard/stats');
//         setStats(prevStats => ({
//           ...prevStats,
//           activeCourts: dashboardStats.data.activeCourts,
//         }));
//       } catch (error) {
//         console.error('Error cancelling booking:', error);
//         alert('Failed to cancel booking. Please try again.');
//       }
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const getMemberName = (memberId) => {
//     if (!memberId) return 'N/A';
//     const member = members.find(m => m._id === memberId);
//     if (member) {
//       if (member.user && member.user.name) return member.user.name;
//       if (member.name) return member.name;
//       return member.email ? member.email.split('@')[0] : 'Unknown Member';
//     }
//     return 'N/A';
//   };

//   const quickStats = [
//     {
//       title: 'Active Courts',
//       value: stats.activeCourts,
//       change: '+8.1%',
//       icon: <Activity className="h-6 w-6" />,
//       color: 'emerald',
//     },
//     {
//       title: 'Active Members',
//       value: stats.members,
//       change: '+5.2%',
//       icon: <Users className="h-6 w-6" />,
//       color: 'blue',
//     },
//     {
//       title: 'Current Balance', // Changed from Total In to Current Balance
//       value: formatCurrency(stats.currentBalance), // Use currentBalance
//       change: '+12.5%',
//       icon: <DollarSign className="h-6 w-6" />, // Changed icon to DollarSign for balance
//       color: 'green',
//     },
//     {
//       title: 'Total Out',
//       value: formatCurrency(stats.totalOut),
//       change: '-2.3%',
//       icon: <ArrowDownRight className="h-6 w-6" />,
//       color: 'red',
//     },
//   ];

//   if (isLoading) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="flex flex-col items-center gap-4">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//           >
//             <RefreshCw className={`h-8 w-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
//           </motion.div>
//           <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
//             Loading dashboard...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
//       <div className="p-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div className="flex items-center gap-4">
//             <h1 className="text-3xl font-bold">Manager Dashboard</h1>
//             <button
//               onClick={() => fetchDashboardData()}
//               className={`p-2 rounded-full ${
//                 isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
//               }`}
//             >
//               <RefreshCw className="h-5 w-5" />
//             </button>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setIsDarkMode(!isDarkMode)}
//               className={`p-2 rounded-full ${
//                 isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
//               }`}
//             >
//               {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//             </button>
//           </div>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {quickStats.map((stat, index) => (
//             <motion.div
//               key={stat.title}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className={`p-6 rounded-2xl ${
//                 isDarkMode ? 'bg-gray-800' : 'bg-white'
//               } shadow-lg`}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
//                   {stat.icon}
//                 </div>
//                 <span className={`text-${stat.change.startsWith('+') ? 'green' : 'red'}-500`}>
//                   {stat.change}
//                 </span>
//               </div>
//               <h3 className="text-sm opacity-70">{stat.title}</h3>
//               <p className="text-2xl font-bold mt-1">{stat.value}</p>
//             </motion.div>
//           ))}
//         </div>

//         {/* Main Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Court Maintenance */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`lg:col-span-2 p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <h2 className="text-xl font-semibold mb-6">Court Maintenance</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {courtStatuses.map((court, index) => (
//                 <motion.div
//                   key={court.number}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: index * 0.1 }}
//                   className={`p-4 rounded-xl border ${
//                     isDarkMode
//                       ? court.isUnderMaintenance
//                         ? 'border-yellow-500/30 bg-yellow-900/10'
//                         : court.isActive
//                           ? 'border-green-500/30 bg-green-900/10'
//                           : 'border-red-500/30 bg-red-900/10'
//                       : court.isUnderMaintenance
//                         ? 'border-yellow-200 bg-yellow-50'
//                         : court.isActive
//                           ? 'border-green-200 bg-green-50'
//                           : 'border-red-200 bg-red-50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="text-lg font-semibold">Court {court.number}</h3>
//                     <motion.div
//                       animate={{ rotate: court.isUnderMaintenance ? 360 : 0 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       {court.isUnderMaintenance ? (
//                         <Wrench className="h-5 w-5 text-yellow-500" />
//                       ) : court.isActive ? (
//                         <CheckCircle className="h-5 w-5 text-green-500" />
//                       ) : (
//                         <AlertTriangle className="h-5 w-5 text-red-500" />
//                       )}
//                     </motion.div>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium">Status:</span>
//                       <span
//                         className={`text-sm px-2 py-1 rounded-full ${
//                           court.isUnderMaintenance
//                             ? 'bg-yellow-200 text-yellow-800'
//                             : court.isActive
//                               ? 'bg-green-200 text-green-800'
//                               : 'bg-red-200 text-red-800'
//                         }`}
//                       >
//                         {court.isUnderMaintenance
//                           ? 'Maintenance'
//                           : court.isActive
//                             ? 'Active'
//                             : 'Inactive'}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium">Active:</span>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={court.isActive}
//                           disabled={court.isUnderMaintenance}
//                           onChange={(e) =>
//                             handleCourtStatusUpdate(
//                               court.number,
//                               e.target.checked,
//                               court.isUnderMaintenance
//                             )
//                           }
//                           className="sr-only peer"
//                         />
//                         <div
//                           className={`w-11 h-6 rounded-full peer ${
//                             court.isUnderMaintenance
//                               ? 'bg-gray-300 cursor-not-allowed'
//                               : court.isActive
//                                 ? 'bg-green-500'
//                                 : 'bg-gray-200'
//                           } peer-checked:bg-green-500 transition-colors duration-300`}
//                         >
//                           <div
//                             className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
//                               court.isActive && !court.isUnderMaintenance
//                                 ? 'translate-x-5'
//                                 : 'translate-x-0'
//                             }`}
//                           />
//                         </div>
//                       </label>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium">Maintenance:</span>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={court.isUnderMaintenance}
//                           onChange={(e) =>
//                             handleCourtStatusUpdate(
//                               court.number,
//                               court.isActive && !e.target.checked,
//                               e.target.checked
//                             )
//                           }
//                           className="sr-only peer"
//                         />
//                         <div
//                           className={`w-11 h-6 rounded-full peer ${
//                             court.isUnderMaintenance ? 'bg-yellow-500' : 'bg-gray-200'
//                           } peer-checked:bg-yellow-500 transition-colors duration-300`}
//                         >
//                           <div
//                             className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
//                               court.isUnderMaintenance ? 'translate-x-5' : 'translate-x-0'
//                             }`}
//                           />
//                         </div>
//                       </label>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Live Court Status */}
//           {/* <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
//           >
//             <h2 className="text-xl font-semibold mb-6">Live Court Status</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {courtStatuses.map((court) => (
//                 <motion.div
//                   key={court.number}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className={`p-4 rounded-lg ${
//                     !court.isActive
//                       ? isDarkMode
//                         ? 'bg-red-900/10'
//                         : 'bg-red-50'
//                       : court.currentBooking
//                         ? isDarkMode
//                           ? 'bg-yellow-900/10'
//                           : 'bg-yellow-50'
//                         : isDarkMode
//                           ? 'bg-green-900/10'
//                           : 'bg-green-50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="font-medium">Court {court.number}</span>
//                     {court.isActive ? (
//                       court.currentBooking ? (
//                         <XCircle className="w-5 h-5 text-yellow-500" />
//                       ) : (
//                         <CheckCircle className="w-5 h-5 text-green-500" />
//                       )
//                     ) : (
//                       <AlertTriangle className="w-5 h-5 text-red-500" />
//                     )}
//                   </div>
//                   <p className="text-sm">
//                     {!court.isActive
//                       ? 'Under Maintenance'
//                       : court.currentBooking
//                         ? `Booked: ${court.currentBooking.time}`
//                         : 'Available'}
//                   </p>
//                   {court.currentBooking && (
//                     <p className="text-xs mt-1">{court.currentBooking.member || 'N/A'}</p>
//                   )}
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div> */}

//           {/* Upcoming Bookings */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`lg:col-span-3 p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
//               <select
//                 value={selectedTimeframe}
//                 onChange={(e) => setSelectedTimeframe(e.target.value)}
//                 className={`p-2 rounded-lg ${
//                   isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
//                 }`}
//               >
//                 <option value="12h">Next 12 hours</option>
//                 <option value="24h">Next 24 hours</option>
//                 <option value="7d">Next 7 days</option>
//               </select>
//             </div>
//             {futureBookings.length === 0 ? (
//               <p className="text-sm opacity-70">No upcoming bookings found.</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//                       <th className="py-3 px-4 text-left">Date</th>
//                       <th className="py-3 px-4 text-left">Time</th>
//                       <th className="py-3 px-4 text-left">Court</th>
//                       <th className="py-3 px-4 text-left">Name</th>
//                       <th className="py-3 px-4 text-left">Status</th>
//                       <th className="py-3 px-4 text-left">Payment</th>
//                       <th className="py-3 px-4 text-left">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {futureBookings.map((booking, index) => {
//                       let name = 'N/A';
//                       if (booking.bookingType === 'member' && booking.players?.length > 0) {
//                         const memberId =
//                           typeof booking.players[0] === 'string'
//                             ? booking.players[0]
//                             : booking.players[0]?._id;
//                         name = getMemberName(memberId);
//                       } else if (booking.bookingType === 'general') {
//                         name = booking.name || 'N/A';
//                       }

//                       return (
//                         <motion.tr
//                           key={booking._id}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: index * 0.05 }}
//                           className={`border-b ${
//                             isDarkMode ? 'border-gray-700' : 'border-gray-200'
//                           } hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
//                         >
//                           <td className="py-3 px-4">{format(new Date(booking.date), 'dd/MM/yyyy')}</td>
//                           <td className="py-3 px-4">{booking.time}</td>
//                           <td className="py-3 px-4">Court {booking.courtId}</td>
//                           <td className="py-3 px-4">{name}</td>
//                           <td className="py-3 px-4">
//                             <span
//                               className={`px-2 py-1 rounded-full text-xs ${
//                                 booking.status === 'confirmed'
//                                   ? 'bg-green-200 text-green-800'
//                                   : 'bg-yellow-200 text-yellow-800'
//                               }`}
//                             >
//                               {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4">
//                             <span
//                               className={`px-2 py-1 rounded-full text-xs ${
//                                 booking.paymentStatus === 'paid'
//                                   ? 'bg-blue-200 text-blue-800'
//                                   : 'bg-gray-200 text-gray-800'
//                               }`}
//                             >
//                               {booking.paymentStatus.charAt(0).toUpperCase() +
//                                 booking.paymentStatus.slice(1)}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4">
//                             {booking.status === 'confirmed' && (
//                               <button
//                                 onClick={() => handleCancelBooking(booking._id)}
//                                 className={`p-2 rounded-full ${
//                                   isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
//                                 }`}
//                                 title="Cancel Booking"
//                               >
//                                 <Trash2 className="h-4 w-4 text-red-500" />
//                               </button>
//                             )}
//                           </td>
//                         </motion.tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Users, DollarSign, Clock, AlertTriangle, CheckCircle, XCircle,
  Search, Trash2, ArrowUpRight, ArrowDownRight, Sun, Moon, RefreshCw, Wrench,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parse, addHours, addMinutes } from 'date-fns';
import api from '../utils/api';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [courtStatuses, setCourtStatuses] = useState([]);
  const [futureBookings, setFutureBookings] = useState([]);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({
    activeCourts: '0/5',
    members: 0,
    currentBalance: 0,
    totalOut: 0,
  });

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const fetchDashboardData = async () => {
    try {
      const [dashboardStats, balanceRes, totalOutRes, courtStatusRes, futureBookingsRes, membersRes] = await Promise.all([
        api.get('/api/dashboard/stats'),
        api.get('/api/reports/current-balance'),
        api.get('/api/reports/total-out'),
        api.get('/api/bookings/courts/status'),
        api.get('/api/bookings/future'),
        api.get('/api/members'),
      ]);

      setStats({
        activeCourts: dashboardStats.data.activeCourts,
        members: dashboardStats.data.members,
        currentBalance: balanceRes.data.currentBalance,
        totalOut: totalOutRes.data.totalOut,
      });

      setCourtStatuses(courtStatusRes.data.map(court => ({
        ...court,
        isActive: court.isActive || false,
        isUnderMaintenance: court.isUnderMaintenance || false,
      })));
      setMembers(membersRes.data);

      const transformedBookings = futureBookingsRes.data.bookings.slice(0, 5).map(booking => {
        const startTimeParts = booking.startTime.split(':').map(Number);
        const startDate = new Date(booking.date);
        startDate.setHours(startTimeParts[0], startTimeParts[1], 0, 0);
        const durationHours = Math.floor(booking.duration || 1);
        const durationMinutes = Math.round((booking.duration - durationHours) * 60);
        const endDate = addMinutes(addHours(startDate, durationHours), durationMinutes);
        const formattedStartTime = format(startDate, 'hh:mm a');
        const endTime = format(endDate, 'hh:mm a');
        const timeRange = `${formattedStartTime} - ${endTime}`;

        const players = Array.isArray(booking.players) ? booking.players : [];

        return {
          ...booking,
          time: timeRange,
          courtId: booking.court || booking.courtId,
          players,
          status: booking.status || 'confirmed',
          paymentStatus: booking.paymentStatus || 'pending',
        };
      });

      setFutureBookings(transformedBookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourtStatusUpdate = async (courtNumber, newStatus, maintenanceStatus) => {
    try {
      const response = await api.put(`/api/bookings/courts/${courtNumber}/status`, {
        isActive: newStatus,
        isUnderMaintenance: maintenanceStatus,
      });

      setCourtStatuses(prevStatuses =>
        prevStatuses.map(court =>
          court.number === courtNumber
            ? { ...court, isActive: newStatus, isUnderMaintenance: maintenanceStatus }
            : court
        )
      );

      const dashboardStats = await api.get('/api/dashboard/stats');
      setStats(prevStats => ({
        ...prevStats,
        activeCourts: dashboardStats.data.activeCourts,
      }));

      return response.data;
    } catch (error) {
      console.error('Error updating court status:', error);
      throw error;
    }
  };

  const handleCancelBooking = async (booking_id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.delete(`/api/bookings/${booking_id}`);
        setFutureBookings(prevBookings =>
          prevBookings.filter(booking => booking._id !== booking_id)
        );
        const dashboardStats = await api.get('/api/dashboard/stats');
        setStats(prevStats => ({
          ...prevStats,
          activeCourts: dashboardStats.data.activeCourts,
        }));
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMemberName = (booking) => {
    if (!booking || !booking.players || booking.players.length === 0) return 'N/A';
    const player = booking.players[0];
    return player.name || 'N/A';
  };

  const quickStats = [
    {
      title: 'Active Courts',
      value: stats.activeCourts,
      change: '+8.1%',
      icon: <Activity className="h-6 w-6" />,
      color: 'emerald',
    },
    {
      title: 'Active Members',
      value: stats.members,
      change: '+5.2%',
      icon: <Users className="h-6 w-6" />,
      color: 'blue',
    },
    {
      title: 'Current Balance',
      value: formatCurrency(stats.currentBalance),
      change: '+12.5%',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'green',
    },
    {
      title: 'Total Out',
      value: formatCurrency(stats.totalOut),
      change: '-2.3%',
      icon: <ArrowDownRight className="h-6 w-6" />,
      color: 'red',
    },
  ];

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw className={`h-8 w-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
          </motion.div>
          <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <button
              onClick={() => fetchDashboardData()}
              className={`p-2 rounded-full ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
              }`}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                  {stat.icon}
                </div>
                <span className={`text-${stat.change.startsWith('+') ? 'green' : 'red'}-500`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm opacity-70">{stat.title}</h3>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Court Maintenance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`lg:col-span-2 p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <h2 className="text-xl font-semibold mb-6">Court Maintenance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courtStatuses.map((court, index) => (
                <motion.div
                  key={court.number}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    isDarkMode
                      ? court.isUnderMaintenance
                        ? 'border-yellow-500/30 bg-yellow-900/10'
                        : court.isActive
                          ? 'border-green-500/30 bg-green-900/10'
                          : 'border-red-500/30 bg-red-900/10'
                      : court.isUnderMaintenance
                        ? 'border-yellow-200 bg-yellow-50'
                        : court.isActive
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Court {court.number}</h3>
                    <motion.div
                      animate={{ rotate: court.isUnderMaintenance ? 360 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {court.isUnderMaintenance ? (
                        <Wrench className="h-5 w-5 text-yellow-500" />
                      ) : court.isActive ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                    </motion.div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          court.isUnderMaintenance
                            ? 'bg-yellow-200 text-yellow-800'
                            : court.isActive
                              ? 'bg-green-200 text-green-800'
                              : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {court.isUnderMaintenance
                          ? 'Maintenance'
                          : court.isActive
                            ? 'Active'
                            : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active:</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={court.isActive}
                          disabled={court.isUnderMaintenance}
                          onChange={(e) =>
                            handleCourtStatusUpdate(
                              court.number,
                              e.target.checked,
                              court.isUnderMaintenance
                            )
                          }
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer ${
                            court.isUnderMaintenance
                              ? 'bg-gray-300 cursor-not-allowed'
                              : court.isActive
                                ? 'bg-green-500'
                                : 'bg-gray-200'
                          } peer-checked:bg-green-500 transition-colors duration-300`}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                              court.isActive && !court.isUnderMaintenance
                                ? 'translate-x-5'
                                : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Maintenance:</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={court.isUnderMaintenance}
                          onChange={(e) =>
                            handleCourtStatusUpdate(
                              court.number,
                              court.isActive && !e.target.checked,
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer ${
                            court.isUnderMaintenance ? 'bg-yellow-500' : 'bg-gray-200'
                          } peer-checked:bg-yellow-500 transition-colors duration-300`}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                              court.isUnderMaintenance ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`lg:col-span-3 p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                <option value="12h">Next 12 hours</option>
                <option value="24h">Next 24 hours</option>
                <option value="7d">Next 7 days</option>
              </select>
            </div>
            {futureBookings.length === 0 ? (
              <p className="text-sm opacity-70">No upcoming bookings found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Time</th>
                      <th className="py-3 px-4 text-left">Court</th>
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Payment</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {futureBookings.map((booking, index) => {
                      let name = getMemberName(booking);

                      return (
                        <motion.tr
                          key={booking._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border-b ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                          } hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                        >
                          <td className="py-3 px-4">{format(new Date(booking.date), 'dd/MM/yyyy')}</td>
                          <td className="py-3 px-4">{booking.time}</td>
                          <td className="py-3 px-4">Court {booking.courtId}</td>
                          <td className="py-3 px-4">{name}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                booking.status === 'confirmed'
                                  ? 'bg-green-200 text-green-800'
                                  : 'bg-yellow-200 text-yellow-800'
                              }`}
                            >
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                booking.paymentStatus === 'paid'
                                  ? 'bg-blue-200 text-blue-800'
                                  : 'bg-gray-200 text-gray-800'
                              }`}
                            >
                              {booking.paymentStatus.charAt(0).toUpperCase() +
                                booking.paymentStatus.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className={`p-2 rounded-full ${
                                  isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                                }`}
                                title="Cancel Booking"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;