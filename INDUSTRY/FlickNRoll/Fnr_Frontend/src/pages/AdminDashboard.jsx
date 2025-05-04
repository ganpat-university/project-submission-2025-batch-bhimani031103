// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Activity, Users, Calendar, Package, TrendingUp, DollarSign, Settings, UserCog, 
//   FileText, Key, Bell, X, ChevronRight, AlertTriangle, CheckCircle, Info, 
//   BarChart2, Clock, Shield, Database, ArrowUpRight, ArrowDownRight, Edit2, Trash2
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { format, addHours, addMinutes } from 'date-fns';
// import api from '../utils/api';

// const AdminDashboard = () => {
//   const [activeModal, setActiveModal] = useState(null);
//   const [stats, setStats] = useState({
//     activeCourts: '0/5',
//     members: 0,
//     revenue: 0,
//     currentBalance: 0,
//     totalIn: 0,
//     totalOut: 0
//   });
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [courtStatuses, setCourtStatuses] = useState([]);
//   const [futureBookings, setFutureBookings] = useState([]);
//   const [members, setMembers] = useState([]); // Store member data
//   const [loading, setLoading] = useState(true);
//   const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
//   const navigate = useNavigate();

//   const fetchDashboardData = async () => {
//     try {
//       const [dashboardStats, balanceRes, totalInRes, totalOutRes, recentActivitiesRes, courtStatusRes, futureBookingsRes, membersRes] = await Promise.all([
//         api.get('/api/dashboard/stats'),
//         api.get('/api/reports/current-balance'),
//         api.get('/api/reports/total-in'),
//         api.get('/api/reports/total-out'),
//         api.get('/api/logs'),
//         api.get('/api/bookings/courts/status'),
//         api.get('/api/bookings/future'),
//         api.get('/api/members') // Fetch member data for name mapping
//       ]);

//       setStats({
//         activeCourts: dashboardStats.data.activeCourts,
//         members: dashboardStats.data.members,
//         revenue: dashboardStats.data.revenue,
//         currentBalance: balanceRes.data.currentBalance,
//         totalIn: totalInRes.data.totalIn,
//         totalOut: totalOutRes.data.totalOut
//       });
//       setRecentActivities(recentActivitiesRes.data.slice(0, 5));
//       setCourtStatuses(courtStatusRes.data);

//       // Transform future bookings and ensure proper data structure
//       const transformedBookings = futureBookingsRes.data.slice(0, 5).map(booking => {
//         // Ensure players is an array
//         const players = Array.isArray(booking.players) ? booking.players : [];
//         return {
//           ...booking,
//           players,
//         };
//       });

//       setFutureBookings(transformedBookings);
//       setMembers(membersRes.data); // Store member data
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

//   useEffect(() => {
//     fetchDashboardData();
//   }, [selectedTimeframe]);

//   const quickActions = [
//     { 
//       id: 'members',
//       title: 'Members Controller', 
//       icon: <Users className="h-5 w-5" />, 
//       color: 'indigo',
//       description: 'Manage member profiles and memberships.',
//       options: [
//         { label: 'View All Members', action: () => navigate('/members') },
//         { label: 'Add New Member', action: () => navigate('/members?action=new') },
//         { label: 'Active Memberships', action: () => navigate('/memberships') },
//         { label: 'Add New Memberships Plan', action: () => navigate('/memberships') }
//       ]
//     },
//     { 
//       id: 'users',
//       title: 'User Management', 
//       icon: <UserCog className="h-5 w-5" />, 
//       color: 'purple',
//       description: 'Manage user accounts and roles.',
//       options: [
//         { label: 'View All Users', action: () => navigate('/users') },
//         { label: 'Add New User', action: () => navigate('/users?action=new') },
//         { label: 'Role Management', action: () => navigate('/users?tab=roles') },
//         { label: 'Access Control', action: () => navigate('/users?tab=access') }
//       ]
//     },
//     { 
//       id: 'reports',
//       title: 'Financial Reports', 
//       icon: <FileText className="h-5 w-5" />, 
//       color: 'green',
//       description: 'View financial reports and analytics.',
//       options: [
//         { label: 'Revenue Reports', action: () => navigate('/reports?type=revenue') },
//         { label: 'Expense Reports', action: () => navigate('/reports?type=expenses') },
//         { label: 'Member Payments', action: () => navigate('/reports?type=payments') },
//         { label: 'Financial Analytics', action: () => navigate('/reports?type=analytics') }
//       ]
//     },
//     { 
//       id: 'bookings',
//       title: 'Booking Controller', 
//       icon: <Calendar className="h-5 w-5" />, 
//       color: 'blue',
//       description: 'Manage court bookings and schedules.',
//       options: [
//         { label: 'Add New Booking', action: () => navigate('/bookings?action=new') },
//         { label: 'View All Bookings', action: () => navigate('/bookings') },
//         { label: 'Advanced Booking', action: () => navigate('/bookings?type=advanced') },
//         { label: 'Booking Reports', action: () => navigate('/reports?type=bookings') }
//       ]
//     }
//   ];

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'alert': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
//       case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
//       case 'info': return <Info className="h-5 w-5 text-blue-500" />;
//       default: return <Info className="h-5 w-5 text-gray-500" />;
//     }
//   };

//   const getActivityIcon = (type) => {
//     switch (type) {
//       case 'user': return <Users className="h-5 w-5" />;
//       case 'member': return <Users className="h-5 w-5" />;
//       case 'security': return <Shield className="h-5 w-5" />;
//       case 'error': return <AlertTriangle className="h-5 w-5" />;
//       default: return <Database className="h-5 w-5" />;
//     }
//   };

//   const getActivityTypeColor = (type) => {
//     switch (type) {
//       case 'user': return 'bg-blue-800 text-blue-200';
//       case 'member': return 'bg-blue-800 text-blue-200';
//       case 'security': return 'bg-red-800 text-red-200';
//       case 'error': return 'bg-yellow-800 text-yellow-200';
//       default: return 'bg-green-800 text-green-200';
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   // Updated getMemberName to handle nested user data and fallback gracefully
//   const getMemberName = (memberId) => {
//     if (!memberId) return 'N/A';
//     const member = members.find(m => m._id === memberId);
//     if (member) {
//       // Check if the member has a user object with a name, or fallback to member.email
//       if (member.user && member.user.name) return member.user.name;
//       if (member.name) return member.name;
//       return member.email ? member.email.split('@')[0] : 'Unknown Member';
//     }
//     return 'N/A';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-xl font-semibold text-gray-800">Loading dashboard...</div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-purple-50 text-gray-900"
//     >
//       <div className="flex justify-between items-center mb-8">
//         <motion.h1 
//           initial={{ y: -20 }}
//           animate={{ y: 0 }}
//           className="text-3xl font-bold text-gray-800">
//           Admin Dashboard
//         </motion.h1>
        
//         <motion.div
//           initial={{ y: -20 }}
//           animate={{ y: 0 }}
//           className="flex items-center gap-4"
//         >
//           <div className="flex items-center space-x-4">
//             <Clock className="text-gray-500" />
//             <span className="text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
//           </div>
//         </motion.div>
//       </div>
      
//       <motion.div 
//         variants={container}
//         initial="hidden"
//         animate="show"
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
//       >
//         {[
//           { icon: <Activity className="text-emerald-500" />, title: 'Active Courts', value: stats.activeCourts, subtitle: 'Courts in use' },
//           { icon: <Users className="text-blue-500" />, title: 'Members', value: stats.members, subtitle: 'Active members' },
//           { icon: <ArrowUpRight className="text-green-500" />, title: 'Total In', value: formatCurrency(stats.totalIn), subtitle: 'All time income' },
//           { icon: <ArrowDownRight className="text-red-500" />, title: 'Total Out', value: formatCurrency(stats.totalOut), subtitle: 'All time expenses' }
//         ].map((stat) => (
//           <motion.div
//             key={stat.title}
//             variants={item}
//             whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
//             className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="flex items-center">
//               <motion.div 
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: 0.1 }}
//                 className="p-3 rounded-full bg-gray-100"
//               >
//                 {stat.icon}
//               </motion.div>
//               <div className="ml-4">
//                 <h3 className="text-sm text-gray-600">{stat.title}</h3>
//                 <motion.p 
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.2 }}
//                   className="text-xl font-semibold text-gray-800"
//                 >
//                   {stat.value}
//                 </motion.p>
//                 <p className="text-sm text-gray-500">{stat.subtitle}</p>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         <motion.div
//           initial={{ x: -20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="rounded-xl bg-white p-6 shadow-lg"
//         >
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Court Maintenance</h2>
//           <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//             {courtStatuses.map((court) => (
//               <motion.div
//                 key={court.number}
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
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
//           initial={{ x: 20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="rounded-xl bg-white p-6 shadow-lg"
//         >
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-2 gap-4">
//             {quickActions.map((action) => (
//               <motion.button
//                 key={action.id}
//                 initial={{ scale: 0.95, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//                 whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => setActiveModal(action.id)}
//                 className={`p-4 rounded-lg bg-gray-900 text-white hover:bg-${action.color}-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg`}
//               >
//                 {action.icon}
//                 <span className="text-sm">{action.title}</span>
//               </motion.button>
//             ))}
//           </div>
//         </motion.div>
//       </div>

//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.5 }}
//         className="rounded-xl bg-white p-6 shadow-lg mb-6"
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold text-gray-800">Upcoming Bookings</h2>
//           <div className="flex items-center gap-4">
//             <select
//               value={selectedTimeframe}
//               onChange={(e) => setSelectedTimeframe(e.target.value)}
//               className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//             >
//               <option value="12h">Next 12 hours</option>
//               <option value="24h">Next 24 hours</option>
//               <option value="7d">Next 7 days</option>
//             </select>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 text-gray-600">Date</th>
//                 <th className="text-left py-3 px-4 text-gray-600">Time</th>
//                 <th className="text-left py-3 px-4 text-gray-600">Court</th>
//                 <th className="text-left py-3 px-4 text-gray-600">Name</th>
//                 <th className="text-left py-3 px-4 text-gray-600">Status</th>
//                 <th className="text-left py-3 px-4 text-gray-600">Payment</th>
//               </tr>
//             </thead>
//             <tbody>
//               {futureBookings.length > 0 ? (
//                 futureBookings.map((booking) => {
//                   // Calculate time range based on startTime and duration
//                   const startTimeParts = booking.startTime.split(':').map(Number);
//                   const startDate = new Date(booking.date);
//                   startDate.setHours(startTimeParts[0], startTimeParts[1], 0, 0);
//                   const durationHours = Math.floor(booking.duration || 1); // Default to 1 hour if duration missing
//                   const durationMinutes = Math.round((booking.duration - durationHours) * 60);
//                   const endDate = addMinutes(addHours(startDate, durationHours), durationMinutes);
//                   const formattedStartTime = format(startDate, 'hh:mm a');
//                   const endTime = format(endDate, 'hh:mm a');
//                   const timeRange = `${formattedStartTime} - ${endTime}`;

//                   // Determine name based on bookingType with improved logic
//                   let name = 'N/A';
//                   if (booking.bookingType === 'member' && booking.players?.length > 0) {
//                     const memberId = typeof booking.players[0] === 'string' ? booking.players[0] : booking.players[0]?._id;
//                     name = getMemberName(memberId);
//                   } else if (booking.bookingType === 'general') {
//                     name = booking.name || 'N/A';
//                   }

//                   // Format date
//                   const formattedDate = format(new Date(booking.date), 'dd/MM/yyyy');

//                   return (
//                     <motion.tr
//                       key={booking._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.1 }}
//                       className="border-b border-gray-200 hover:bg-gray-50"
//                     >
//                       <td className="py-3 px-4 text-gray-800">{formattedDate}</td>
//                       <td className="py-3 px-4 text-gray-800">{timeRange}</td>
//                       <td className="py-3 px-4 text-gray-800">Court {booking.courtId || booking.court}</td>
//                       <td className="py-3 px-4 text-gray-800">{name}</td>
//                       <td className="py-3 px-4">
//                         <span
//                           className={`px-3 py-1 rounded-full text-sm ${
//                             booking.status === 'confirmed'
//                               ? 'bg-green-100 text-green-800'
//                               : 'bg-yellow-100 text-yellow-800'
//                           }`}
//                         >
//                           {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4">
//                         <span
//                           className={`px-3 py-1 rounded-full text-sm ${
//                             booking.paymentStatus === 'paid'
//                               ? 'bg-blue-100 text-blue-800'
//                               : booking.paymentStatus === 'partially_paid'
//                               ? 'bg-yellow-100 text-yellow-800'
//                               : 'bg-gray-100 text-gray-800'
//                           }`}
//                         >
//                           {booking.paymentStatus || 'Pending'}
//                         </span>
//                       </td>
//                     </motion.tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="py-3 px-4 text-center text-gray-500">
//                     No upcoming bookings found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>

//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.5 }}
//         className="rounded-xl bg-white p-6 shadow-lg"
//       >
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
//         <div className="space-y-4">
//           {recentActivities.length > 0 ? (
//             recentActivities.map((activity) => (
//               <motion.div
//                 key={activity.id}
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.6 }}
//                 className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className={`p-2 rounded-full ${getActivityTypeColor(activity.type)}`}>
//                     {getActivityIcon(activity.type)}
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-800">{activity.message}</p>
//                     <p className="text-xs text-gray-500">{activity.time}</p>
//                   </div>
//                 </div>
//                 <ChevronRight className="h-5 w-5 text-gray-400" />
//               </motion.div>
//             ))
//           ) : (
//             <p className="text-sm text-gray-500">No recent activities available.</p>
//           )}
//         </div>
//       </motion.div>

//       <AnimatePresence>
//         {activeModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//             onClick={() => setActiveModal(null)}
//           >
//             <motion.div
//               variants={modalVariants}
//               initial="hidden"
//               animate="visible"
//               exit="hidden"
//               onClick={e => e.stopPropagation()}
//               className="bg-gray-800 rounded-xl p-6 w-full max-w-md text-white"
//             >
//               {activeModal === 'notifications' ? (
//                 <div>
//                   <div className="flex justify-between items-center mb-4">
//                     <div className="flex items-center gap-2">
//                       <Bell className="h-5 w-5" />
//                       <h3 className="text-xl font-semibold">Notifications</h3>
//                     </div>
//                     <button
//                       onClick={() => setActiveModal(null)}
//                       className="p-1 hover:bg-gray-700 rounded-full"
//                     >
//                       <X className="h-5 w-5" />
//                     </button>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-400">No new notifications at this time.</p>
//                   </div>
//                 </div>
//               ) : (
//                 quickActions.map(action => {
//                   if (action.id === activeModal) {
//                     return (
//                       <div key={action.id}>
//                         <div className="flex justify-between items-center mb-4">
//                           <div className="flex items-center gap-2">
//                             {action.icon}
//                             <h3 className="text-xl font-semibold">{action.title}</h3>
//                           </div>
//                           <button
//                             onClick={() => setActiveModal(null)}
//                             className="p-1 hover:bg-gray-700 rounded-full"
//                           >
//                             <X className="h-5 w-5" />
//                           </button>
//                         </div>
//                         <p className="text-gray-400 mb-4">{action.description}</p>
//                         <div className="space-y-2">
//                           {action.options.map((option) => (
//                             <motion.button
//                               key={option.label}
//                               initial={{ x: -20, opacity: 0 }}
//                               animate={{ x: 0, opacity: 1 }}
//                               transition={{ delay: 0.1 }}
//                               onClick={option.action}
//                               className="w-full p-3 text-left rounded-lg hover:bg-gray-700 flex items-center justify-between group"
//                             >
//                               <span className="text-gray-200">{option.label}</span>
//                               <ChevronRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
//                             </motion.button>
//                           ))}
//                         </div>
//                       </div>
//                     );
//                   }
//                   return null;
//                 })
//               )}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// const container = {
//   hidden: { opacity: 0 },
//   show: { 
//     opacity: 1,
//     transition: { 
//       when: "beforeChildren",
//       staggerChildren: 0.1
//     }
//   }
// };

// const item = {
//   hidden: { y: 20, opacity: 0 },
//   show: { 
//     y: 0, 
//     opacity: 1,
//     transition: {
//       type: "spring",
//       stiffness: 100
//     }
//   }
// };

// const modalVariants = {
//   hidden: { opacity: 0, scale: 0.95 },
//   visible: { opacity: 1, scale: 1 }
// };

// export default AdminDashboard;


// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Activity, Users, Calendar, Package, DollarSign, Clock, AlertTriangle, 
//   CreditCard, Plus, Edit3, UserPlus, X, CheckCircle, XCircle, Search, 
//   Trash2, Save, BarChart2, LineChart, PieChart
// } from 'lucide-react';
// import RevenueChart from './RevenueChart';
// import api from '../utils/api';

// const AdminDashboard = () => {
//   const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
//   const [showInventoryModal, setShowInventoryModal] = useState(false);
//   const [showCourtModal, setShowCourtModal] = useState(false);
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [showMembershipModal, setShowMembershipModal] = useState(false);
//   const [showManageBookingsModal, setShowManageBookingsModal] = useState(false);
//   const [selectedCourt, setSelectedCourt] = useState(null);
//   const [editingBooking, setEditingBooking] = useState(null);
//   const [editingMember, setEditingMember] = useState(null);
//   const [revenueData, setRevenueData] = useState([]);
//   const [chartType, setChartType] = useState('bar');
//   const [loading, setLoading] = useState(true);
//   const [dashboardStats, setDashboardStats] = useState({
//     activeCourts: '0/5',
//     members: 0,
//     revenue: 0,
//     currentBalance: 0,
//     totalIn: 0,
//     totalOut: 0
//   });
//   const [courtStatuses, setCourtStatuses] = useState([]);
//   const [futureBookings, setFutureBookings] = useState([]);
//   const [members, setMembers] = useState([]);

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     try {
//       const [
//         dashboardStatsRes,
//         balanceRes,
//         totalInRes,
//         totalOutRes,
//         revenueOverviewRes,
//         courtStatusRes,
//         futureBookingsRes,
//         membersRes
//       ] = await Promise.all([
//         api.get('/api/dashboard/stats'),
//         api.get('/api/reports/current-balance'),
//         api.get('/api/reports/total-in'),
//         api.get('/api/reports/total-out'),
//         api.get('/api/reports/revenue-overview'),
//         api.get('/api/bookings/courts/status'),
//         api.get('/api/bookings/future'),
//         api.get('/api/members')
//       ]);

//       setDashboardStats({
//         activeCourts: dashboardStatsRes.data.activeCourts,
//         members: dashboardStatsRes.data.members,
//         revenue: dashboardStatsRes.data.revenue,
//         currentBalance: balanceRes.data.currentBalance,
//         totalIn: totalInRes.data.totalIn,
//         totalOut: totalOutRes.data.totalOut
//       });

//       setRevenueData(revenueOverviewRes.data.monthlyData);
//       setCourtStatuses(courtStatusRes.data);
//       setFutureBookings(futureBookingsRes.data.slice(0, 5));
//       setMembers(membersRes.data);
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
      
//       // Refresh dashboard stats after court status update
//       const dashboardStats = await api.get('/api/dashboard/stats');
//       setDashboardStats(prevStats => ({
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

//   const stats = [
//     { 
//       icon: <Activity className="text-emerald-500" />, 
//       title: 'Court Status', 
//       value: dashboardStats.activeCourts, 
//       subtitle: 'Active Courts',
//       details: [
//         { label: 'Maintenance', value: courtStatuses.filter(c => !c.isActive).length },
//         { label: 'Available', value: courtStatuses.filter(c => c.isActive).length },
//         { label: 'In Use', value: courtStatuses.filter(c => c.status === 'maintenance').length }
//       ]
//     },
//     { 
//       icon: <Users className="text-blue-500" />, 
//       title: 'Membership', 
//       value: dashboardStats.members, 
//       subtitle: 'Total Members',
//       details: [
//         { label: 'Active', value: members.filter(m => m.status === 'active').length },
//         { label: 'Expiring Soon', value: members.filter(m => m.status === 'expiring').length },
//         { label: 'Expired', value: members.filter(m => m.status === 'expired').length }
//       ]
//     },
//     { 
//       icon: <Calendar className="text-purple-500" />, 
//       title: 'Bookings', 
//       value: futureBookings.length, 
//       subtitle: "Today's Total",
//       details: [
//         { label: 'Current', value: futureBookings.filter(b => b.status === 'ongoing').length },
//         { label: 'Upcoming', value: futureBookings.filter(b => b.status === 'confirmed').length },
//         { label: 'Completed', value: futureBookings.filter(b => b.status === 'completed').length }
//       ]
//     },
//     { 
//       icon: <DollarSign className="text-orange-500" />, 
//       title: 'Financial', 
//       value: formatCurrency(dashboardStats.currentBalance), 
//       subtitle: 'Current Balance',
//       details: [
//         { label: 'Total In', value: formatCurrency(dashboardStats.totalIn) },
//         { label: 'Total Out', value: formatCurrency(dashboardStats.totalOut) },
//         { label: 'Today', value: formatCurrency(dashboardStats.revenue) }
//       ]
//     }
//   ];

//   const container = {
//     hidden: { opacity: 0 },
//     show: { opacity: 1, transition: { staggerChildren: 0.1 } },
//   };

//   const item = {
//     hidden: { y: 20, opacity: 0 },
//     show: { y: 0, opacity: 1 },
//   };

//   if (loading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-purple-50"
//       >
//         <div className="flex items-center justify-center min-h-screen">
//           <p className="text-xl font-semibold text-gray-800">Loading dashboard data...</p>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-purple-50 text-gray-900"
//     >
//       <div className="flex justify-between items-center mb-8">
//         <motion.h1 
//           initial={{ y: -20 }}
//           animate={{ y: 0 }}
//           className="text-3xl font-bold text-gray-800">
//           Admin Dashboard
//         </motion.h1>
        
//         <motion.div
//           initial={{ y: -20 }}
//           animate={{ y: 0 }}
//           className="flex items-center gap-4"
//         >
//           <div className="flex items-center space-x-4">
//             <Clock className="text-gray-500" />
//             <span className="text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
//           </div>
//         </motion.div>
//       </div>
      
//       <motion.div 
//         variants={container}
//         initial="hidden"
//         animate="show"
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
//       >
//         {stats.map((stat) => (
//           <motion.div
//             key={stat.title}
//             variants={item}
//             whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
//             className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="flex items-center">
//               <motion.div 
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: 0.1 }}
//                 className="p-3 rounded-full bg-gray-100"
//               >
//                 {stat.icon}
//               </motion.div>
//               <div className="ml-4">
//                 <h3 className="text-sm text-gray-600">{stat.title}</h3>
//                 <motion.p 
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.2 }}
//                   className="text-xl font-semibold text-gray-800"
//                 >
//                   {stat.value}
//                 </motion.p>
//                 <p className="text-sm text-gray-500">{stat.subtitle}</p>
//               </div>
//             </div>
//             <div className="mt-4 grid grid-cols-3 gap-2">
//               {stat.details.map((detail, idx) => (
//                 <div key={idx} className="text-center">
//                   <p className="text-xs text-gray-500">{detail.label}</p>
//                   <p className="text-sm font-semibold text-gray-700">{detail.value}</p>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.3 }}
//         className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
//       >
//         <motion.div
//           initial={{ x: -20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="rounded-xl bg-white p-6 shadow-lg"
//         >
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Court Maintenance</h2>
//           <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//             {courtStatuses.map((court) => (
//               <motion.div
//                 key={court.number}
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
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
//           initial={{ x: 20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="rounded-xl bg-white p-6 shadow-lg"
//         >
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setShowBookingModal(true)}
//               className="p-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
//             >
//               <Calendar className="h-5 w-5" />
//               <span>New Booking</span>
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setShowMembershipModal(true)}
//               className="p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
//             >
//               <UserPlus className="h-5 w-5" />
//               <span>Add Member</span>
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setShowManageBookingsModal(true)}
//               className="p-4 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all flex items-center justify-center gap-2"
//             >
//               <Edit3 className="h-5 w-5" />
//               <span>Manage Bookings</span>
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setShowInventoryModal(true)}
//               className="p-4 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
//             >
//               <Package className="h-5 w-5" />
//               <span>Inventory</span>
//             </motion.button>
//           </div>
//         </motion.div>
//       </motion.div>

//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.5 }}
//         className="rounded-xl bg-white p-6 shadow-lg mb-6"
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold text-gray-800">Revenue Overview</h2>
//           <div className="flex items-center gap-4">
//             <select
//               value={chartType}
//               onChange={(e) => setChartType(e.target.value)}
//               className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//             >
//               <option value="bar">Bar Chart</option>
//               <option value="line">Line Chart</option>
//               <option value="pie">Pie Chart</option>
//             </select>
//           </div>
//         </div>

//         <RevenueChart data={revenueData} chartType={chartType} />
//       </motion.div>

//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.6 }}
//         className="rounded-xl bg-white p-6 shadow-lg mb-6"
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold text-gray-800">Upcoming Bookings</h2>
//           <button
//             onClick={() => setShowManageBookingsModal(true)}
//             className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//           >
//             View All
//           </button>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 text-gray-600">Time</th>
//                 <th className="text-left py-3 px-4 text-gray-600">Court</th>
//                 <th className="text-left py-3 px-4 text-gray-600">Member</th>
//                 <th className="text-left py-3 px-4 text-gray-600">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {futureBookings.map((booking) => (
//                 <tr key={booking._id} className="border-b border-gray-200 hover:bg-gray-50">
//                   <td className="py-3 px-4 text-gray-800">{booking.startTime}</td>
//                   <td className="py-3 px-4 text-gray-800">Court {booking.court}</td>
//                   <td className="py-3 px-4 text-gray-800">{booking.name || 'N/A'}</td>
//                   <td className="py-3 px-4">
//                     <span className={`px-2 py-1 rounded-full text-xs ${
//                       booking.status === 'confirmed' 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {booking.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default AdminDashboard;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Activity, Users, Calendar, Package, TrendingUp, DollarSign, Settings, UserCog, 
//   FileText, Key, Bell, X, ChevronRight, AlertTriangle, CheckCircle, Info, 
//   BarChart2, Clock, Shield, Database, ArrowUpRight, ArrowDownRight, Edit2, Trash2,
//   LogOut
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { format, addHours, addMinutes } from 'date-fns';
// import RevenueChart from './RevenueChart';
// import api from '../utils/api';

// const AdminDashboard = () => {
//   const [activeModal, setActiveModal] = useState(null);
//   const [stats, setStats] = useState({
//     activeCourts: '0/5',
//     members: 0,
//     revenue: 0,
//     currentBalance: 0,
//     totalIn: 0,
//     totalOut: 0
//   });
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [courtStatuses, setCourtStatuses] = useState([]);
//   const [futureBookings, setFutureBookings] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
//   const [revenueData, setRevenueData] = useState([]);
//   const [chartType, setChartType] = useState('bar');
//   const navigate = useNavigate();

//   const fetchDashboardData = async () => {
//     try {
//       const [dashboardStats, balanceRes, totalInRes, totalOutRes, recentActivitiesRes, courtStatusRes, futureBookingsRes, membersRes, revenueOverviewRes] = await Promise.all([
//         api.get('/api/dashboard/stats'),
//         api.get('/api/reports/current-balance'),
//         api.get('/api/reports/total-in'),
//         api.get('/api/reports/total-out'),
//         api.get('/api/logs'),
//         api.get('/api/bookings/courts/status'),
//         api.get('/api/bookings/future'),
//         api.get('/api/members'),
//         api.get('/api/reports/revenue-overview')
//       ]);

//       setStats({
//         activeCourts: dashboardStats.data.activeCourts,
//         members: dashboardStats.data.members,
//         revenue: dashboardStats.data.revenue,
//         currentBalance: balanceRes.data.currentBalance,
//         totalIn: totalInRes.data.totalIn,
//         totalOut: totalOutRes.data.totalOut
//       });
//       setRecentActivities(recentActivitiesRes.data.slice(0, 5));
//       setCourtStatuses(courtStatusRes.data);
//       setFutureBookings(futureBookingsRes.data.slice(0, 5));
//       setMembers(membersRes.data);
//       setRevenueData(revenueOverviewRes.data.monthlyData);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, [selectedTimeframe]);

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

//   const quickActions = [
//     { 
//       id: 'members',
//       title: 'Members Controller', 
//       icon: <Users className="h-5 w-5" />, 
//       color: 'indigo',
//       description: 'Manage member profiles and memberships.',
//       options: [
//         { label: 'View All Members', action: () => navigate('/members') },
//         { label: 'Add New Member', action: () => navigate('/members?action=new') },
//         { label: 'Active Memberships', action: () => navigate('/memberships') },
//         { label: 'Add New Memberships Plan', action: () => navigate('/memberships') }
//       ]
//     },
//     { 
//       id: 'users',
//       title: 'User Management', 
//       icon: <UserCog className="h-5 w-5" />, 
//       color: 'purple',
//       description: 'Manage user accounts and roles.',
//       options: [
//         { label: 'View All Users', action: () => navigate('/users') },
//         { label: 'Add New User', action: () => navigate('/users?action=new') },
//         { label: 'Role Management', action: () => navigate('/users?tab=roles') },
//         { label: 'Access Control', action: () => navigate('/users?tab=access') }
//       ]
//     },
//     { 
//       id: 'reports',
//       title: 'Financial Reports', 
//       icon: <FileText className="h-5 w-5" />, 
//       color: 'green',
//       description: 'View financial reports and analytics.',
//       options: [
//         { label: 'Revenue Reports', action: () => navigate('/reports?type=revenue') },
//         { label: 'Expense Reports', action: () => navigate('/reports?type=expenses') },
//         { label: 'Member Payments', action: () => navigate('/reports?type=payments') },
//         { label: 'Financial Analytics', action: () => navigate('/reports?type=analytics') }
//       ]
//     },
//     { 
//       id: 'bookings',
//       title: 'Booking Controller', 
//       icon: <Calendar className="h-5 w-5" />, 
//       color: 'blue',
//       description: 'Manage court bookings and schedules.',
//       options: [
//         { label: 'Add New Booking', action: () => navigate('/bookings?action=new') },
//         { label: 'View All Bookings', action: () => navigate('/bookings') },
//         { label: 'Advanced Booking', action: () => navigate('/bookings?type=advanced') },
//         { label: 'Booking Reports', action: () => navigate('/reports?type=bookings') }
//       ]
//     }
//   ];

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'alert': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
//       case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
//       case 'info': return <Info className="h-5 w-5 text-blue-500" />;
//       default: return <Info className="h-5 w-5 text-gray-500" />;
//     }
//   };

//   const getActivityIcon = (type) => {
//     switch (type) {
//       case 'user': return <Users className="h-5 w-5" />;
//       case 'member': return <Users className="h-5 w-5" />;
//       case 'security': return <Shield className="h-5 w-5" />;
//       case 'error': return <AlertTriangle className="h-5 w-5" />;
//       default: return <Database className="h-5 w-5" />;
//     }
//   };

//   const getActivityTypeColor = (type) => {
//     switch (type) {
//       case 'user': return 'bg-blue-800 text-blue-200';
//       case 'member': return 'bg-blue-800 text-blue-200';
//       case 'security': return 'bg-red-800 text-red-200';
//       case 'error': return 'bg-yellow-800 text-yellow-200';
//       default: return 'bg-green-800 text-green-200';
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const container = {
//     hidden: { opacity: 0 },
//     show: { opacity: 1, transition: { staggerChildren: 0.1 } },
//   };

//   const item = {
//     hidden: { y: 20, opacity: 0 },
//     show: { y: 0, opacity: 1 },
//   };

//   const modalVariants = {
//     hidden: { opacity: 0, scale: 0.95 },
//     visible: { opacity: 1, scale: 1 }
//   };

//   if (loading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-purple-50"
//       >
//         <div className="flex items-center justify-center min-h-screen">
//           <p className="text-xl font-semibold text-gray-800">Loading dashboard data...</p>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-purple-50 text-gray-900"
//     >
//       <div className="flex justify-between items-center mb-8">
//         <motion.h1 
//           initial={{ y: -20 }}
//           animate={{ y: 0 }}
//           className="text-3xl font-bold text-gray-800">
//           Admin Dashboard
//         </motion.h1>
        
//         <motion.div
//           initial={{ y: -20 }}
//           animate={{ y: 0 }}
//           className="flex items-center gap-4"
//         >
//           <div className="flex items-center space-x-4">
//             <Clock className="text-gray-500" />
//             <span className="text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
//           </div>
//         </motion.div>
//       </div>
      
//       <motion.div 
//         variants={container}
//         initial="hidden"
//         animate="show"
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
//       >
//         {[
//           { icon: <Activity className="text-emerald-500" />, title: 'Active Courts', value: stats.activeCourts, subtitle: 'Courts in use' },
//           { icon: <Users className="text-blue-500" />, title: 'Members', value: stats.members, subtitle: 'Active members' },
//           { icon: <ArrowUpRight className="text-green-500" />, title: 'Total In', value: formatCurrency(stats.totalIn), subtitle: 'All time income' },
//           { icon: <ArrowDownRight className="text-red-500" />, title: 'Total Out', value: formatCurrency(stats.totalOut), subtitle: 'All time expenses' }
//         ].map((stat) => (
//           <motion.div
//             key={stat.title}
//             variants={item}
//             whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
//             className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="flex items-center">
//               <motion.div 
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: 0.1 }}
//                 className="p-3 rounded-full bg-gray-100"
//               >
//                 {stat.icon}
//               </motion.div>
//               <div className="ml-4">
//                 <h3 className="text-sm text-gray-600">{stat.title}</h3>
//                 <motion.p 
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.2 }}
//                   className="text-xl font-semibold text-gray-800"
//                 >
//                   {stat.value}
//                 </motion.p>
//                 <p className="text-sm text-gray-500">{stat.subtitle}</p>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <motion.div
//           initial={{ x: -20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="rounded-xl bg-white p-6 shadow-lg"
//         >
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Court Maintenance</h2>
//           <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//             {courtStatuses.map((court) => (
//               <motion.div
//                 key={court.number}
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
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
//           initial={{ x: 20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="rounded-xl bg-white p-6 shadow-lg"
//         >
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-2 gap-4">
//             {quickActions.map((action) => (
//               <motion.button
//                 key={action.id}
//                 initial={{ scale: 0.95, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => setActiveModal(action.id)}
//                 className={`p-4 rounded-lg bg-gray-900 text-white hover:bg-${action.color}-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg`}
//               >
//                 {action.icon}
//                 <span className="text-sm">{action.title}</span>
//               </motion.button>
//             ))}
//           </div>
//         </motion.div>
//       </div>

//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.5 }}
//         className="rounded-xl bg-white p-6 shadow-lg mt-6 mb-6"
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold text-gray-800">Revenue Overview</h2>
//           <div className="flex items-center gap-4">
//             <select
//               value={chartType}
//               onChange={(e) => setChartType(e.target.value)}
//               className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//             >
//               <option value="bar">Bar Chart</option>
//               <option value="line">Line Chart</option>
//               <option value="pie">Pie Chart</option>
//             </select>
//           </div>
//         </div>

//         <RevenueChart data={revenueData} chartType={chartType} />
//       </motion.div>

//       <AnimatePresence>
//         {activeModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//             onClick={() => setActiveModal(null)}
//           >
//             <motion.div
//               variants={modalVariants}
//               initial="hidden"
//               animate="visible"
//               exit="hidden"
//               onClick={e => e.stopPropagation()}
//               className="bg-gray-800 rounded-xl p-6 w-full max-w-md text-white"
//             >
//               {quickActions.map(action => {
//                 if (action.id === activeModal) {
//                   return (
//                     <div key={action.id}>
//                       <div className="flex justify-between items-center mb-4">
//                         <div className="flex items-center gap-2">
//                           {action.icon}
//                           <h3 className="text-xl font-semibold">{action.title}</h3>
//                         </div>
//                         <button
//                           onClick={() => setActiveModal(null)}
//                           className="p-1 hover:bg-gray-700 rounded-full"
//                         >
//                           <X className="h-5 w-5" />
//                         </button>
//                       </div>
//                       <p className="text-gray-400 mb-4">{action.description}</p>
//                       <div className="space-y-2">
//                         {action.options.map((option) => (
//                           <motion.button
//                             key={option.label}
//                             initial={{ x: -20, opacity: 0 }}
//                             animate={{ x: 0, opacity: 1 }}
//                             transition={{ delay: 0.1 }}
//                             onClick={option.action}
//                             className="w-full p-3 text-left rounded-lg hover:bg-gray-700 flex items-center justify-between group"
//                           >
//                             <span className="text-gray-200">{option.label}</span>
//                             <ChevronRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
//                           </motion.button>
//                         ))}
//                       </div>
//                     </div>
//                   );
//                 }
//                 return null;
//               })}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default AdminDashboard;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Activity, Users, Calendar, Package, TrendingUp, DollarSign, Settings, UserCog, 
//   FileText, Bell, X, ChevronRight, AlertTriangle, CheckCircle, Info, Search,
//   BarChart2, Clock, Shield, Database, ArrowUpRight, ArrowDownRight,
//   Sun, Moon, Filter, RefreshCw, MoreVertical, PieChart, Layers, Zap
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import RevenueChart from './RevenueChart';
// import api from '../utils/api';

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [stats, setStats] = useState({
//     activeCourts: '0/5',
//     members: 0,
//     revenue: 0,
//     currentBalance: 0,
//     totalIn: 0,
//     totalOut: 0
//   });
//   const [revenueData, setRevenueData] = useState([]);
//   const [chartType, setChartType] = useState('bar');
//   const [courtStatuses, setCourtStatuses] = useState([]);
//   const [recentActivities, setRecentActivities] = useState([]);

//   useEffect(() => {
//     fetchDashboardData();
//     const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
//     return () => clearInterval(interval);
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const [
//         dashboardStats,
//         balanceRes,
//         totalInRes,
//         totalOutRes,
//         courtStatusRes,
//         activitiesRes,
//         revenueRes
//       ] = await Promise.all([
//         api.get('/api/dashboard/stats'),
//         api.get('/api/reports/current-balance'),
//         api.get('/api/reports/total-in'),
//         api.get('/api/reports/total-out'),
//         api.get('/api/bookings/courts/status'),
//         api.get('/api/logs'),
//         api.get('/api/reports/revenue-overview')
//       ]);

//       setStats({
//         activeCourts: dashboardStats.data.activeCourts,
//         members: dashboardStats.data.members,
//         revenue: dashboardStats.data.revenue,
//         currentBalance: balanceRes.data.currentBalance,
//         totalIn: totalInRes.data.totalIn,
//         totalOut: totalOutRes.data.totalOut
//       });
//       setCourtStatuses(courtStatusRes.data);
//       setRecentActivities(activitiesRes.data.slice(0, 5));
//       setRevenueData(revenueRes.data.monthlyData);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const quickStats = [
//     { 
//       title: 'Total Revenue',
//       value: formatCurrency(stats.totalIn),
//       change: '+12.5%',
//       icon: <TrendingUp className="h-6 w-6" />,
//       color: 'emerald'
//     },
//     {
//       title: 'Active Members',
//       value: stats.members,
//       change: '+5.2%',
//       icon: <Users className="h-6 w-6" />,
//       color: 'blue'
//     },
//     {
//       title: 'Court Usage',
//       value: stats.activeCourts,
//       change: '+8.1%',
//       icon: <PieChart className="h-6 w-6" />,
//       color: 'purple'
//     },
//     {
//       title: 'System Health',
//       value: '98.2%',
//       change: '+0.8%',
//       icon: <Zap className="h-6 w-6" />,
//       color: 'amber'
//     }
//   ];

//   if (isLoading) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="flex flex-col items-center gap-4">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
//             <h1 className="text-3xl font-bold">Dashboard Overview</h1>
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
//             <div className={`relative p-2 rounded-full ${
//               isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
//             }`}>
//               <Bell className="h-5 w-5" />
//               <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
//                 3
//               </span>
//             </div>
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

//         {/* Navigation Buttons */}
//         {/* */}

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
//           {/* Revenue Chart */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`lg:col-span-2 p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-semibold">Revenue Overview</h2>
//               <select
//                 value={chartType}
//                 onChange={(e) => setChartType(e.target.value)}
//                 className={`p-2 rounded-lg ${
//                   isDarkMode 
//                     ? 'bg-gray-700 text-white' 
//                     : 'bg-gray-100 text-gray-800'
//                 }`}
//               >
//                 <option value="bar">Bar Chart</option>
//                 <option value="line">Line Chart</option>
//                 <option value="pie">Pie Chart</option>
//               </select>
//             </div>
//             <RevenueChart data={revenueData} chartType={chartType} isDarkMode={isDarkMode} />
//           </motion.div>

//           {/* Recent Activity */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
//             <div className="space-y-4">
//               {recentActivities.map((activity, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className={`p-4 rounded-lg ${
//                     isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className={`p-2 rounded-lg ${
//                       isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
//                     }`}>
//                       <Activity className="h-4 w-4" />
//                     </div>
//                     <div>
//                       <p className="text-sm">{activity.message}</p>
//                       <p className="text-xs opacity-60">{activity.timestamp}</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Court Status */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`lg:col-span-2 p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <h2 className="text-xl font-semibold mb-6">Court Status</h2>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               {courtStatuses.map((court, index) => (
//                 <motion.div
//                   key={court.number}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: index * 0.1 }}
//                   className={`p-4 rounded-xl ${
//                     isDarkMode 
//                       ? court.isActive ? 'bg-green-900/20' : 'bg-red-900/20'
//                       : court.isActive ? 'bg-green-100' : 'bg-red-100'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <h3 className="font-medium">Court {court.number}</h3>
//                     {court.isActive ? (
//                       <CheckCircle className="h-5 w-5 text-green-500" />
//                     ) : (
//                       <AlertTriangle className="h-5 w-5 text-red-500" />
//                     )}
//                   </div>
//                   <p className={`text-sm mt-1 ${
//                     isDarkMode ? 'text-gray-400' : 'text-gray-600'
//                   }`}>
//                     {court.isActive ? 'Active' : 'Maintenance'}
//                   </p>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* System Health */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <h2 className="text-xl font-semibold mb-6">System Health</h2>
//             <div className="space-y-4">
//               {[
//                 { label: 'Server Status', value: 'Operational', icon: <Shield className="h-5 w-5 text-green-500" /> },
//                 { label: 'Database', value: '98.2% Healthy', icon: <Database className="h-5 w-5 text-blue-500" /> },
//                 { label: 'API Response', value: '245ms', icon: <Zap className="h-5 w-5 text-yellow-500" /> }
//               ].map((item, index) => (
//                 <motion.div
//                   key={item.label}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className={`p-4 rounded-lg ${
//                     isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       {item.icon}
//                       <span>{item.label}</span>
//                     </div>
//                     <span className="font-medium">{item.value}</span>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Activity, Users, Calendar, Package, TrendingUp, DollarSign, Settings, UserCog, 
//   FileText, Bell, X, ChevronRight, AlertTriangle, CheckCircle, Info, Search,
//   BarChart2, Clock, Shield, Database, ArrowUpRight, ArrowDownRight,
//   Sun, Moon, Filter, RefreshCw, MoreVertical, PieChart, Layers, Zap, Wrench
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import RevenueChart from './RevenueChart';
// import api from '../utils/api';

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [stats, setStats] = useState({
//     activeCourts: '0/5',
//     members: 0,
//     revenue: 0,
//     currentBalance: 0,
//     totalIn: 0,
//     totalOut: 0
//   });
//   const [revenueData, setRevenueData] = useState([]);
//   const [chartType, setChartType] = useState('bar');
//   const [courtStatuses, setCourtStatuses] = useState([]);
//   const [recentActivities, setRecentActivities] = useState([]);

//   useEffect(() => {
//     fetchDashboardData();
//     const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
//     return () => clearInterval(interval);
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const [
//         dashboardStats,
//         balanceRes,
//         totalInRes,
//         totalOutRes,
//         courtStatusRes,
//         activitiesRes,
//         revenueRes
//       ] = await Promise.all([
//         api.get('/api/dashboard/stats'),
//         api.get('/api/reports/current-balance'),
//         api.get('/api/reports/total-in'),
//         api.get('/api/reports/total-out'),
//         api.get('/api/bookings/courts/status'),
//         api.get('/api/logs'),
//         api.get('/api/reports/revenue-overview')
//       ]);

//       setStats({
//         activeCourts: dashboardStats.data.activeCourts,
//         members: dashboardStats.data.members,
//         revenue: dashboardStats.data.revenue,
//         currentBalance: balanceRes.data.currentBalance,
//         totalIn: totalInRes.data.totalIn,
//         totalOut: totalOutRes.data.totalOut
//       });
//       setCourtStatuses(courtStatusRes.data.map(court => ({
//         ...court,
//         isActive: court.isActive || false,
//         isUnderMaintenance: court.isUnderMaintenance || false
//       })));
//       setRecentActivities(activitiesRes.data.slice(0, 5));
//       setRevenueData(revenueRes.data.monthlyData);
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
//         isUnderMaintenance: maintenanceStatus
//       });
      
//       setCourtStatuses(prevStatuses =>
//         prevStatuses.map(court =>
//           court.number === courtNumber 
//             ? { ...court, isActive: newStatus, isUnderMaintenance: maintenanceStatus } 
//             : court
//         )
//       );
      
//       // Refresh dashboard stats after court status update
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

//   const quickStats = [
//     { 
//       title: 'Total Revenue',
//       value: formatCurrency(stats.currentBalance),
//       change: '+12.5%',
//       icon: <TrendingUp className="h-6 w-6" />,
//       color: 'emerald'
//     },
//     {
//       title: 'Active Members',
//       value: stats.members,
//       change: '+5.2%',
//       icon: <Users className="h-6 w-6" />,
//       color: 'blue'
//     },
//     {
//       title: 'Court Usage',
//       value: stats.activeCourts,
//       change: '+8.1%',
//       icon: <PieChart className="h-6 w-6" />,
//       color: 'purple'
//     },
//     {
//       title: 'System Health',
//       value: '98.2%',
//       change: '+0.8%',
//       icon: <Zap className="h-6 w-6" />,
//       color: 'amber'
//     }
//   ];

//   if (isLoading) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="flex flex-col items-center gap-4">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
//             <h1 className="text-3xl font-bold">Dashboard Overview</h1>
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
//             <div className={`relative p-2 rounded-full ${
//               isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
//             }`}>
//               <Bell className="h-5 w-5" />
//               <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
//                 3
//               </span>
//             </div>
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
//           {/* Revenue Chart */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`lg:col-span-2 p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-semibold">Revenue Overview</h2>
//               <select
//                 value={chartType}
//                 onChange={(e) => setChartType(e.target.value)}
//                 className={`p-2 rounded-lg ${
//                   isDarkMode 
//                     ? 'bg-gray-700 text-white' 
//                     : 'bg-gray-100 text-gray-800'
//                 }`}
//               >
//                 <option value="bar">Bar Chart</option>
//                 <option value="line">Line Chart</option>
//                 <option value="pie">Pie Chart</option>
//               </select>
//             </div>
//             <RevenueChart data={revenueData} chartType={chartType} isDarkMode={isDarkMode} />
//           </motion.div>

//           {/* Recent Activity */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
//             <div className="space-y-4">
//               {recentActivities.map((activity, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className={`p-4 rounded-lg ${
//                     isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className={`p-2 rounded-lg ${
//                       isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
//                     }`}>
//                       <Activity className="h-4 w-4" />
//                     </div>
//                     <div>
//                       <p className="text-sm">{activity.message}</p>
//                       <p className="text-xs opacity-60">{activity.timestamp}</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Updated Court Status */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`lg:col-span-2 p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <h2 className="text-xl font-semibold mb-6">Court Status</h2>
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
//                     {/* Status Indicator */}
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium">Status:</span>
//                       <span className={`text-sm px-2 py-1 rounded-full ${
//                         court.isUnderMaintenance
//                           ? 'bg-yellow-200 text-yellow-800'
//                           : court.isActive
//                             ? 'bg-green-200 text-green-800'
//                             : 'bg-red-200 text-red-800'
//                       }`}>
//                         {court.isUnderMaintenance ? 'Maintenance' : court.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </div>

//                     {/* Active Toggle */}
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium">Active:</span>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={court.isActive}
//                           disabled={court.isUnderMaintenance}
//                           onChange={(e) => handleCourtStatusUpdate(
//                             court.number,
//                             e.target.checked,
//                             court.isUnderMaintenance
//                           )}
//                           className="sr-only peer"
//                         />
//                         <div className={`w-11 h-6 rounded-full peer 
//                           ${court.isUnderMaintenance 
//                             ? 'bg-gray-300 cursor-not-allowed' 
//                             : court.isActive 
//                               ? 'bg-green-500' 
//                               : 'bg-gray-200'
//                           } peer-checked:bg-green-500 transition-colors duration-300`}>
//                           <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow 
//                             transition-transform duration-300 
//                             ${court.isActive && !court.isUnderMaintenance ? 'translate-x-5' : 'translate-x-0'}`} />
//                         </div>
//                       </label>
//                     </div>

//                     {/* Maintenance Toggle */}
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium">Maintenance:</span>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={court.isUnderMaintenance}
//                           onChange={(e) => handleCourtStatusUpdate(
//                             court.number,
//                             court.isActive && !e.target.checked,
//                             e.target.checked
//                           )}
//                           className="sr-only peer"
//                         />
//                         <div className={`w-11 h-6 rounded-full peer 
//                           ${court.isUnderMaintenance ? 'bg-yellow-500' : 'bg-gray-200'} 
//                           peer-checked:bg-yellow-500 transition-colors duration-300`}>
//                           <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow 
//                             transition-transform duration-300 
//                             ${court.isUnderMaintenance ? 'translate-x-5' : 'translate-x-0'}`} />
//                         </div>
//                       </label>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* System Health */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <h2 className="text-xl font-semibold mb-6">System Health</h2>
//             <div className="space-y-4">
//               {[
//                 { label: 'Server Status', value: 'Operational', icon: <Shield className="h-5 w-5 text-green-500" /> },
//                 { label: 'Database', value: '98.2% Healthy', icon: <Database className="h-5 w-5 text-blue-500" /> },
//                 { label: 'API Response', value: '245ms', icon: <Zap className="h-5 w-5 text-yellow-500" /> }
//               ].map((item, index) => (
//                 <motion.div
//                   key={item.label}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className={`p-4 rounded-lg ${
//                     isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       {item.icon}
//                       <span>{item.label}</span>
//                     </div>
//                     <span className="font-medium">{item.value}</span>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Activity, Users, Calendar, Package, TrendingUp, DollarSign, Settings, UserCog,
//   FileText, Bell, X, ChevronRight, AlertTriangle, CheckCircle, Info, Search,
//   BarChart2, Clock, Shield, Database, ArrowUpRight, ArrowDownRight,
//   Sun, Moon, Filter, RefreshCw, MoreVertical, PieChart, Layers, Zap, Wrench,
//   Edit, Trash2
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import RevenueChart from './RevenueChart';
// import api from '../utils/api';

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [stats, setStats] = useState({
//     activeCourts: '0/5',
//     members: 0,
//     revenue: 0,
//     currentBalance: 0,
//     totalIn: 0,
//     totalOut: 0
//   });
//   const [revenueData, setRevenueData] = useState([]);
//   const [chartType, setChartType] = useState('bar');
//   const [courtStatuses, setCourtStatuses] = useState([]);
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [futureBookings, setFutureBookings] = useState([]); // New state for future bookings

//   useEffect(() => {
//     fetchDashboardData();
//     const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
//     return () => clearInterval(interval);
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const [
//         dashboardStats,
//         balanceRes,
//         totalInRes,
//         totalOutRes,
//         courtStatusRes,
//         activitiesRes,
//         revenueRes,
//         futureBookingsRes // New API call for future bookings
//       ] = await Promise.all([
//         api.get('/api/dashboard/stats'),
//         api.get('/api/reports/current-balance'),
//         api.get('/api/reports/total-in'),
//         api.get('/api/reports/total-out'),
//         api.get('/api/bookings/courts/status'),
//         api.get('/api/logs'),
//         api.get('/api/reports/revenue-overview'),
//         api.get('/api/bookings/future') // Fetch future bookings
//       ]);

//       setStats({
//         activeCourts: dashboardStats.data.activeCourts,
//         members: dashboardStats.data.members,
//         revenue: dashboardStats.data.revenue,
//         currentBalance: balanceRes.data.currentBalance,
//         totalIn: totalInRes.data.totalIn,
//         totalOut: totalOutRes.data.totalOut
//       });
//       setCourtStatuses(courtStatusRes.data.map(court => ({
//         ...court,
//         isActive: court.isActive || false,
//         isUnderMaintenance: court.isUnderMaintenance || false
//       })));
//       setRecentActivities(activitiesRes.data.slice(0, 5));
//       setRevenueData(revenueRes.data.monthlyData);
//       setFutureBookings(futureBookingsRes.data.bookings); // Set future bookings data
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
//         isUnderMaintenance: maintenanceStatus
//       });

//       setCourtStatuses(prevStatuses =>
//         prevStatuses.map(court =>
//           court.number === courtNumber
//             ? { ...court, isActive: newStatus, isUnderMaintenance: maintenanceStatus }
//             : court
//         )
//       );

//       // Refresh dashboard stats after court status update
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

//   const handleEditBooking = (booking_id) => {
//     // Navigate to an edit booking page (assuming a route exists)
//     navigate(`/admin/bookings/edit/${booking_id}`);
//   };

//   const handleCancelBooking = async (booking_id) => {
//     if (window.confirm('Are you sure you want to cancel this booking?')) {
//       try {
//         await api.delete(`/api/bookings/${booking_id}`);
//         setFutureBookings(prevBookings =>
//           prevBookings.filter(booking => booking._id !== booking_id)
//         );
//         // Optionally refresh stats if cancellation affects them
//         const dashboardStats = await api.get('/api/dashboard/stats');
//         setStats(prevStats => ({
//           ...prevStats,
//           activeCourts: dashboardStats.data.activeCourts
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
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   // Helper function to format hours (e.g., 2.5 -> "2 hours and 30 minutes")
//   const formatHours = (hours) => {
//     const wholeHours = Math.floor(hours);
//     const minutes = Math.round((hours - wholeHours) * 60);
//     if (minutes === 0) return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
//     return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
//   };

//   const quickStats = [
//     {
//       title: 'Total Revenue',
//       value: formatCurrency(stats.currentBalance),
//       change: '+12.5%',
//       icon: <TrendingUp className="h-6 w-6" />,
//       color: 'emerald'
//     },
//     {
//       title: 'Active Members',
//       value: stats.members,
//       change: '+5.2%',
//       icon: <Users className="h-6 w-6" />,
//       color: 'blue'
//     },
//     {
//       title: 'Court Usage',
//       value: stats.activeCourts,
//       change: '+8.1%',
//       icon: <PieChart className="h-6 w-6" />,
//       color: 'purple'
//     },
//     {
//       title: 'System Health',
//       value: '98.2%',
//       change: '+0.8%',
//       icon: <Zap className="h-6 w-6" />,
//       color: 'amber'
//     }
//   ];

//   if (isLoading) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="flex flex-col items-center gap-4">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
//             <h1 className="text-3xl font-bold">Admin Dashboard Overview</h1>
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
//             <div className={`relative p-2 rounded-full ${
//               isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
//             }`}>
//               <Bell className="h-5 w-5" />
//               <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
//                 3
//               </span>
//             </div>
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
//           {/* Revenue Chart */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`lg:col-span-2 p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-semibold">Revenue Overview</h2>
//               <select
//                 value={chartType}
//                 onChange={(e) => setChartType(e.target.value)}
//                 className={`p-2 rounded-lg ${
//                   isDarkMode
//                     ? 'bg-gray-700 text-white'
//                     : 'bg-gray-100 text-gray-800'
//                 }`}
//               >
//                 <option value="bar">Bar Chart</option>
//                 <option value="line">Line Chart</option>
//                 <option value="pie">Pie Chart</option>
//               </select>
//             </div>
//             <RevenueChart data={revenueData} chartType={chartType} isDarkMode={isDarkMode} />
//           </motion.div>

//           {/* Recent Activity */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
//             <div className="space-y-4">
//               {recentActivities.map((activity, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className={`p-4 rounded-lg ${
//                     isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className={`p-2 rounded-lg ${
//                       isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
//                     }`}>
//                       <Activity className="h-4 w-4" />
//                     </div>
//                     <div>
//                       <p className="text-sm">{activity.message}</p>
//                       <p className="text-xs opacity-60">{activity.timestamp}</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Future Bookings */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`lg:col-span-2 p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <h2 className="text-xl font-semibold mb-6">Future Bookings</h2>
//             {futureBookings.length === 0 ? (
//               <p className="text-sm opacity-70">No future bookings available.</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className={`border-b ${
//                       isDarkMode ? 'border-gray-700' : 'border-gray-200'
//                     }`}>
//                       {/* <th className="py-3 px-4 text-left">Booking ID</th> */}
//                       <th className="py-3 px-4 text-left">Court</th>
//                       <th className="py-3 px-4 text-left">Date</th>
//                       <th className="py-3 px-4 text-left">Time</th>
//                       <th className="py-3 px-4 text-left">Duration</th>
//                       <th className="py-3 px-4 text-left">Type</th>
//                       <th className="py-3 px-4 text-left">Players</th>
//                       <th className="py-3 px-4 text-left">Status</th>
//                       <th className="py-3 px-4 text-left">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {futureBookings.map((booking, index) => (
//                       <motion.tr
//                         key={booking._id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.05 }}
//                         className={`border-b ${
//                           isDarkMode ? 'border-gray-700' : 'border-gray-200'
//                         } hover:${
//                           isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
//                         }`}
//                       >
//                         {/* <td className="py-3 px-4">{booking._id.slice(-6)}</td> */}
//                         <td className="py-3 px-4">{booking.court}</td>
//                         <td className="py-3 px-4">{booking.date}</td>
//                         <td className="py-3 px-4">{booking.startTime}</td>
//                         <td className="py-3 px-4">{booking.durationFormatted}</td>
//                         <td className="py-3 px-4">
//                           <span className={`px-2 py-1 rounded-full text-xs ${
//                             booking.bookingType === 'member'
//                               ? 'bg-blue-200 text-blue-800'
//                               : 'bg-green-200 text-green-800'
//                           }`}>
//                             {booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)}
//                           </span>
//                         </td>
//                         <td className="py-3 px-4">
//                           {booking.players.map(player => player.name).join(', ')}
//                         </td>
//                         <td className="py-3 px-4">
//                           <span className={`px-2 py-1 rounded-full text-xs ${
//                             booking.status === 'confirmed'
//                               ? 'bg-green-200 text-green-800'
//                               : 'bg-gray-200 text-gray-800'
//                           }`}>
//                             {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                           </span>
//                         </td>
//                         <td className="py-3 px-4">
//                           {booking.status === 'confirmed' && (
//                             <div className="flex gap-2">
//                               {/* <button
//                                 onClick={() => handleEditBooking(booking._id)}
//                                 className={`p-2 rounded-full ${
//                                   isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
//                                 }`}
//                                 title="Edit Booking"
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </button> */}
//                               <button
//                                 onClick={() => handleCancelBooking(booking._id)}
//                                 className={`p-2 rounded-full ${
//                                   isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
//                                 }`}
//                                 title="Cancel Booking"
//                               >
//                                 <Trash2 className="h-4 w-4 text-red-500" />
//                               </button>
//                             </div>
//                           )}
//                         </td>
//                       </motion.tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </motion.div>

//           {/* Updated Court Status */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`lg:col-span-2 p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <h2 className="text-xl font-semibold mb-6">Court Status</h2>
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
//                     {/* Status Indicator */}
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium">Status:</span>
//                       <span className={`text-sm px-2 py-1 rounded-full ${
//                         court.isUnderMaintenance
//                           ? 'bg-yellow-200 text-yellow-800'
//                           : court.isActive
//                             ? 'bg-green-200 text-green-800'
//                             : 'bg-red-200 text-red-800'
//                       }`}>
//                         {court.isUnderMaintenance ? 'Maintenance' : court.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </div>

//                     {/* Active Toggle */}
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium">Active:</span>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={court.isActive}
//                           disabled={court.isUnderMaintenance}
//                           onChange={(e) => handleCourtStatusUpdate(
//                             court.number,
//                             e.target.checked,
//                             court.isUnderMaintenance
//                           )}
//                           className="sr-only peer"
//                         />
//                         <div className={`w-11 h-6 rounded-full peer
//                           ${court.isUnderMaintenance
//                             ? 'bg-gray-300 cursor-not-allowed'
//                             : court.isActive
//                               ? 'bg-green-500'
//                               : 'bg-gray-200'
//                           } peer-checked:bg-green-500 transition-colors duration-300`}>
//                           <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
//                             transition-transform duration-300
//                             ${court.isActive && !court.isUnderMaintenance ? 'translate-x-5' : 'translate-x-0'}`} />
//                         </div>
//                       </label>
//                     </div>

//                     {/* Maintenance Toggle */}
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium">Maintenance:</span>
//                       <label className="relative inline-flex items-center cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={court.isUnderMaintenance}
//                           onChange={(e) => handleCourtStatusUpdate(
//                             court.number,
//                             court.isActive && !e.target.checked,
//                             e.target.checked
//                           )}
//                           className="sr-only peer"
//                         />
//                         <div className={`w-11 h-6 rounded-full peer
//                           ${court.isUnderMaintenance ? 'bg-yellow-500' : 'bg-gray-200'}
//                           peer-checked:bg-yellow-500 transition-colors duration-300`}>
//                           <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
//                             transition-transform duration-300
//                             ${court.isUnderMaintenance ? 'translate-x-5' : 'translate-x-0'}`} />
//                         </div>
//                       </label>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* System Health */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`p-6 rounded-2xl ${
//               isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-lg`}
//           >
//             <h2 className="text-xl font-semibold mb-6">System Health</h2>
//             <div className="space-y-4">
//               {[
//                 { label: 'Server Status', value: 'Operational', icon: <Shield className="h-5 w-5 text-green-500" /> },
//                 { label: 'Database', value: '98.2% Healthy', icon: <Database className="h-5 w-5 text-blue-500" /> },
//                 { label: 'API Response', value: '245ms', icon: <Zap className="h-5 w-5 text-yellow-500" /> }
//               ].map((item, index) => (
//                 <motion.div
//                   key={item.label}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className={`p-4 rounded-lg ${
//                     isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       {item.icon}
//                       <span>{item.label}</span>
//                     </div>
//                     <span className="font-medium">{item.value}</span>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Users, Calendar, Package, TrendingUp, DollarSign, Settings, UserCog,
  FileText, Bell, X, ChevronRight, AlertTriangle, CheckCircle, Info, Search,
  BarChart2, Clock, Shield, Database, ArrowUpRight, ArrowDownRight,
  Sun, Moon, Filter, RefreshCw, MoreVertical, PieChart, Layers, Zap, Wrench,
  Edit, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RevenueChart from './RevenueChart';
import api from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeCourts: '0/5',
    members: 0,
    revenue: 0,
    currentBalance: 0,
    totalIn: 0,
    totalOut: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [courtStatuses, setCourtStatuses] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [futureBookings, setFutureBookings] = useState([]);
  const [pricing, setPricing] = useState({
    weekday: 300,
    weekend: 300
  });
  const [editModal, setEditModal] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [pricingError, setPricingError] = useState('');
  const [pricingSuccess, setPricingSuccess] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchPricing();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        dashboardStats,
        balanceRes,
        totalInRes,
        totalOutRes,
        courtStatusRes,
        activitiesRes,
        revenueRes,
        futureBookingsRes
      ] = await Promise.all([
        api.get('/api/dashboard/stats'),
        api.get('/api/reports/current-balance'),
        api.get('/api/reports/total-in'),
        api.get('/api/reports/total-out'),
        api.get('/api/bookings/courts/status'),
        api.get('/api/logs'),
        api.get('/api/reports/revenue-overview'),
        api.get('/api/bookings/future')
      ]);

      setStats({
        activeCourts: dashboardStats.data.activeCourts,
        members: dashboardStats.data.members,
        revenue: dashboardStats.data.revenue,
        currentBalance: balanceRes.data.currentBalance,
        totalIn: totalInRes.data.totalIn,
        totalOut: totalOutRes.data.totalOut
      });
      setCourtStatuses(courtStatusRes.data.map(court => ({
        ...court,
        isActive: court.isActive || false,
        isUnderMaintenance: court.isUnderMaintenance || false
      })));
      setRecentActivities(activitiesRes.data.slice(0, 5));
      setRevenueData(revenueRes.data.monthlyData);
      setFutureBookings(futureBookingsRes.data.bookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPricing = async () => {
    try {
      const [weekdayRes, weekendRes] = await Promise.all([
        api.get('/api/dashboard/weekday'),
        api.get('/api/dashboard/weekend')
      ]);
      setPricing({
        weekday: weekdayRes.data.weekday.halfHourPrice,
        weekend: weekendRes.data.weekend.halfHourPrice
      });
    } catch (error) {
      console.error('Error fetching pricing:', error);
    }
  };

  const handleCourtStatusUpdate = async (courtNumber, newStatus, maintenanceStatus) => {
    try {
      const response = await api.put(`/api/bookings/courts/${courtNumber}/status`, {
        isActive: newStatus,
        isUnderMaintenance: maintenanceStatus
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
        activeCourts: dashboardStats.data.activeCourts
      }));

      return response.data;
    } catch (error) {
      console.error('Error updating court status:', error);
      throw error;
    }
  };

  const handleEditBooking = (booking_id) => {
    navigate(`/admin/bookings/edit/${booking_id}`);
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
          activeCourts: dashboardStats.data.activeCourts
        }));
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    setPricingError('');
    setPricingSuccess('');

    if (!newPrice || newPrice <= 0) {
      setPricingError('Please enter a valid price');
      return;
    }

    try {
      const response = await api.put(`/api/dashboard/${editModal}`, {
        halfHourPrice: parseFloat(newPrice)
      });
      
      setPricing(prev => ({
        ...prev,
        [editModal]: parseFloat(newPrice)
      }));
      
      setPricingSuccess(`${editModal.charAt(0).toUpperCase() + editModal.slice(1)} pricing updated successfully`);
      setEditModal(null);
      setNewPrice('');
    } catch (error) {
      setPricingError(error.response?.data?.message || 'Failed to update pricing');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatHours = (hours) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
    return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const quickStats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.currentBalance),
      change: '+12.5%',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'emerald'
    },
    {
      title: 'Active Members',
      value: stats.members,
      change: '+5.2%',
      icon: <Users className="h-6 w-6" />,
      color: 'blue'
    },
    {
      title: 'Court Usage',
      value: stats.activeCourts,
      change: '+8.1%',
      icon: <PieChart className="h-6 w-6" />,
      color: 'purple'
    }
  ];

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Admin Dashboard Overview</h1>
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
            <div className={`relative p-2 rounded-full ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
            }`}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`lg:col-span-2 p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Revenue Overview</h2>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>
            <RevenueChart data={revenueData} chartType={chartType} isDarkMode={isDarkMode} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                    }`}>
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs opacity-60">{activity.timestamp}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`lg:col-span-2 p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <h2 className="text-xl font-semibold mb-6">Future Bookings</h2>
            {futureBookings.length === 0 ? (
              <p className="text-sm opacity-70">No future bookings available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <th className="py-3 px-4 text-left">Court</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Time</th>
                      <th className="py-3 px-4 text-left">Duration</th>
                      <th className="py-3 px-4 text-left">Type</th>
                      <th className="py-3 px-4 text-left">Players</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {futureBookings.map((booking, index) => (
                      <motion.tr
                        key={booking._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b ${
                          isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        } hover:${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        <td className="py-3 px-4">{booking.court}</td>
                        <td className="py-3 px-4">{booking.date}</td>
                        <td className="py-3 px-4">{booking.startTime}</td>
                        <td className="py-3 px-4">{booking.durationFormatted}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.bookingType === 'member'
                              ? 'bg-blue-200 text-blue-800'
                              : 'bg-green-200 text-green-800'
                          }`}>
                            {booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {booking.players.map(player => player.name).join(', ')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'confirmed'
                              ? 'bg-green-200 text-green-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {booking.status === 'confirmed' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className={`p-2 rounded-full ${
                                  isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                                }`}
                                title="Cancel Booking"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`lg:col-span-2 p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <h2 className="text-xl font-semibold mb-6">Court Status</h2>
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
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        court.isUnderMaintenance
                          ? 'bg-yellow-200 text-yellow-800'
                          : court.isActive
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                      }`}>
                        {court.isUnderMaintenance ? 'Maintenance' : court.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active:</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={court.isActive}
                          disabled={court.isUnderMaintenance}
                          onChange={(e) => handleCourtStatusUpdate(
                            court.number,
                            e.target.checked,
                            court.isUnderMaintenance
                          )}
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 rounded-full peer
                          ${court.isUnderMaintenance
                            ? 'bg-gray-300 cursor-not-allowed'
                            : court.isActive
                              ? 'bg-green-500'
                              : 'bg-gray-200'
                          } peer-checked:bg-green-500 transition-colors duration-300`}>
                          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
                            transition-transform duration-300
                            ${court.isActive && !court.isUnderMaintenance ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Maintenance:</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={court.isUnderMaintenance}
                          onChange={(e) => handleCourtStatusUpdate(
                            court.number,
                            court.isActive && !e.target.checked,
                            e.target.checked
                          )}
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 rounded-full peer
                          ${court.isUnderMaintenance ? 'bg-yellow-500' : 'bg-gray-200'}
                          peer-checked:bg-yellow-500 transition-colors duration-300`}>
                          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
                            transition-transform duration-300
                            ${court.isUnderMaintenance ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <h2 className="text-xl font-semibold mb-6">Pricing Management</h2>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <th className="py-3 px-4 text-left">Type</th>
                      <th className="py-3 px-4 text-left">Half-Hour Price</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: 'Weekday', price: pricing.weekday },
                      { type: 'Weekend', price: pricing.weekend }
                    ].map((item, index) => (
                      <motion.tr
                        key={item.type}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b ${
                          isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        } hover:${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        <td className="py-3 px-4">{item.type}</td>
                        <td className="py-3 px-4">{formatCurrency(item.price)}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setEditModal(item.type.toLowerCase());
                              setNewPrice(item.price);
                              setPricingError('');
                              setPricingSuccess('');
                            }}
                            className={`p-2 rounded-full ${
                              isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                            }`}
                            title={`Edit ${item.type} Price`}
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pricingSuccess && (
                <div className={`p-3 rounded-lg ${
                  isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
                }`}>
                  {pricingSuccess}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Price Modal */}
      <AnimatePresence>
        {editModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`p-6 rounded-2xl ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              } w-full max-w-md`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Edit {editModal.charAt(0).toUpperCase() + editModal.slice(1)} Pricing
                </h3>
                <button
                  onClick={() => setEditModal(null)}
                  className={`p-2 rounded-full ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleUpdatePrice} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Half-Hour Price (INR)
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className={`w-full p-2 rounded-lg ${
                      isDarkMode
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    } border`}
                    placeholder="Enter new price"
                    min="0"
                    step="0.01"
                    autoFocus
                  />
                </div>
                {pricingError && (
                  <div className={`p-2 rounded-lg ${
                    isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
                  } text-sm`}>
                    {pricingError}
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setEditModal(null)}
                    className={`flex-1 py-2 rounded-lg ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-200 hover:bg-gray-300'
                    } font-medium`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-2 rounded-lg ${
                      isDarkMode
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white font-medium`}
                  >
                    Update Price
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;