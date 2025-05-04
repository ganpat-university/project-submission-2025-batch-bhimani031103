import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserCheck, UserX, Edit, Trash2, X, Search, Filter, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);

  const [newMember, setNewMember] = useState({
    name: '',
    membership: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    paymentMethod: 'Cash',
  });

  const [renewData, setRenewData] = useState({
    newMembershipId: '',
    paymentMethod: 'Cash',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const membersResponse = await api.get('/api/members');
        setMembers(membersResponse.data.map(member => ({
          id: member._id,
          name: member.name || '',
          membership: member.membership?.name || 'Basic',
          status: member.membershipStatus || 'active',
          joinDate: member.membershipStartDate?.split('T')[0] || new Date().toISOString().split('T')[0],
          phoneNumber: member.phoneNumber || '',
          dateOfBirth: member.dateOfBirth || '',
          gender: member.gender || '',
          address: member.address || '',
          emergencyContact: {
            contactName: member.emergencyContact?.contactName || '',
            contactNumber: member.emergencyContact?.contactNumber || '',
          },
          totalHours: member.membership?.totalHours || 0,
          hoursUsed: member.hoursUsed || 0,
          hoursRemaining: member.hoursRemaining || 0,
          remainingDays: member.membershipEndDate ? Math.ceil((new Date(member.membershipEndDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
        })));

        const membershipsResponse = await api.get('/api/memberships');
        setMemberships(membershipsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.membership || !newMember.phoneNumber || 
        !newMember.paymentMethod || !newMember.dateOfBirth || !newMember.gender) {
      alert('Please fill in all required fields: name, membership, phone number, payment method, date of birth, and gender.');
      return;
    }

    try {
      const payload = {
        name: newMember.name,
        membership: newMember.membership,
        phoneNumber: newMember.phoneNumber,
        dateOfBirth: newMember.dateOfBirth,
        gender: newMember.gender,
        address: newMember.address,
        emergencyContact: {
          contactName: newMember.emergencyContactName,
          contactNumber: newMember.emergencyContactNumber,
        },
        paymentMethod: newMember.paymentMethod,
      };

      const response = await api.post('/api/members', payload);
      const addedMember = response.data.member;
      const membershipDetails = memberships.find(m => m._id === newMember.membership);

      setMembers([...members, {
        id: addedMember._id,
        name: addedMember.name,
        membership: membershipDetails?.name || 'Basic',
        status: addedMember.membershipStatus || 'active',
        joinDate: addedMember.membershipStartDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        phoneNumber: addedMember.phoneNumber,
        dateOfBirth: addedMember.dateOfBirth,
        gender: addedMember.gender,
        address: addedMember.address,
        emergencyContact: {
          contactName: addedMember.emergencyContact?.contactName || '',
          contactNumber: addedMember.emergencyContact?.contactNumber || '',
        },
        totalHours: membershipDetails?.totalHours || 0,
        hoursUsed: addedMember.hoursUsed || 0,
        hoursRemaining: addedMember.hoursRemaining || 0,
        remainingDays: addedMember.membershipEndDate ? Math.ceil((new Date(addedMember.membershipEndDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
      }]);

      alert(response.data.message);
      setShowAddModal(false);
      setNewMember({
        name: '',
        membership: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        paymentMethod: 'Cash',
      });
    } catch (error) {
      console.error('Error adding member:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error adding member');
    }
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;

    try {
      await api.delete(`/api/members/${selectedMember.id}`);
      setMembers(members.filter(m => m.id !== selectedMember.id));
      setShowDeleteModal(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Error deleting member:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error deleting member');
    }
  };

  const handleUpdateMember = async () => {
    if (!selectedMember) return;

    try {
      const updatePayload = {
        name: selectedMember.name,
        phoneNumber: selectedMember.phoneNumber,
        gender: selectedMember.gender,
        dateOfBirth: selectedMember.dateOfBirth,
        address: selectedMember.address,
        membershipStatus: selectedMember.status.toLowerCase(),
        emergencyContact: {
          contactName: selectedMember.emergencyContact?.contactName || '',
          contactNumber: selectedMember.emergencyContact?.contactNumber || '',
        },
      };

      const response = await api.put(`/api/members/${selectedMember.id}`, updatePayload);

      setMembers(members.map(m =>
        m.id === selectedMember.id ? {
          ...m,
          name: response.data.name,
          phoneNumber: response.data.phoneNumber,
          gender: response.data.gender,
          dateOfBirth: response.data.dateOfBirth,
          address: response.data.address,
          status: response.data.membershipStatus,
          emergencyContact: {
            contactName: response.data.emergencyContact?.contactName || '',
            contactNumber: response.data.emergencyContact?.contactNumber || '',
          },
        } : m
      ));

      setEditMode(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Error updating member:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to update member');
    }
  };

  const handleRenewMember = async () => {
    if (!selectedMember || !renewData.newMembershipId || !renewData.paymentMethod) {
      alert('Please select a membership plan and payment method');
      return;
    }

    try {
      const response = await api.post(`/api/members/${selectedMember.id}/renew`, {
        newMembershipId: renewData.newMembershipId,
        paymentMethod: renewData.paymentMethod,
      });
      const renewedMember = response.data.member;
      const membershipDetails = memberships.find(m => m._id === renewData.newMembershipId);

      setMembers(members.map(m => 
        m.id === selectedMember.id ? {
          ...m,
          membership: membershipDetails?.name || 'Basic',
          status: renewedMember.membershipStatus,
          joinDate: renewedMember.membershipStartDate?.split('T')[0],
          totalHours: membershipDetails?.totalHours || 0,
          hoursUsed: renewedMember.hoursUsed || 0,
          hoursRemaining: renewedMember.hoursRemaining || 0,
          remainingDays: renewedMember.membershipEndDate ? Math.ceil((new Date(renewedMember.membershipEndDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
        } : m
      ));

      setShowRenewModal(false);
      setSelectedMember(null);
      setRenewData({ newMembershipId: '', paymentMethod: 'Cash' });
      alert('Membership renewed successfully');
    } catch (error) {
      console.error('Error renewing member:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error renewing membership');
    }
  };

  const handleShowDetails = (member) => {
    setSelectedMember(member);
    setShowDetailsModal(true);
  };

  const filteredMembers = members.filter(member => 
    member?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = members.length > 0 ? {
    total: members.length,
    active: members.filter(m => m.status.toLowerCase() === 'active').length,
    inactive: members.filter(m => m.status.toLowerCase() === 'inactive').length,
    newThisMonth: members.filter(m => {
      const joinDate = new Date(m.joinDate);
      const now = new Date();
      return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
    }).length,
  } : { total: 0, active: 0, inactive: 0, newThisMonth: 0 };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-7xl mx-auto">
        <p>Loading members...</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-7xl mx-auto">
      <motion.h1 initial={{ y: -20 }} animate={{ y: 0 }} className="text-3xl font-bold text-gray-800 mb-8">
        Member Management
      </motion.h1>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: Users, label: 'Total Members', value: stats.total, color: 'blue', key: 'total' },
          { icon: UserCheck, label: 'Active', value: stats.active, color: 'green', key: 'active' },
          { icon: UserX, label: 'Inactive', value: stats.inactive, color: 'red', key: 'inactive' },
          { icon: UserPlus, label: 'New This Month', value: stats.newThisMonth, color: 'purple', key: 'newThisMonth' },
        ].map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center">
              <stat.icon className={`h-10 w-10 text-${stat.color}-500`} />
              <div className="ml-4">
                <p className="text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="rounded-xl bg-white shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button className="ml-2 p-2 text-gray-400 hover:text-gray-600">
                <Filter className="h-5 w-5" />
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Add New Member
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 text-gray-600">Membership</th>
                  <th className="text-left py-3 px-4 text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600">Join Date</th>
                  <th className="text-left py-3 px-4 text-gray-600">Phone</th>
                  <th className="text-left py-3 px-4 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-gray-800">{member.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${member.membership === 'Premium' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {member.membership}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${member.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{member.joinDate}</td>
                    <td className="py-3 px-4 text-gray-600">{member.phoneNumber}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { setSelectedMember(member); setEditMode(true); }}
                          className="p-1 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50"
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { setSelectedMember(member); setShowDeleteModal(true); }}
                          className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { setSelectedMember(member); setShowRenewModal(true); }}
                          className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50"
                        >
                          <UserPlus className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleShowDetails(member)}
                          className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Add New Member</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Membership *</label>
                  <select
                    value={newMember.membership}
                    onChange={(e) => setNewMember({ ...newMember, membership: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  >
                    <option value="">Select Membership</option>
                    {memberships.map(membership => (
                      <option key={membership._id} value={membership._id}>{membership.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={newMember.phoneNumber}
                    onChange={(e) => setNewMember({ ...newMember, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={newMember.dateOfBirth}
                    onChange={(e) => setNewMember({ ...newMember, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    value={newMember.gender}
                    onChange={(e) => setNewMember({ ...newMember, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={newMember.address}
                    onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={newMember.emergencyContactName}
                    onChange={(e) => setNewMember({ ...newMember, emergencyContactName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Number</label>
                  <input
                    type="tel"
                    value={newMember.emergencyContactNumber}
                    onChange={(e) => setNewMember({ ...newMember, emergencyContactNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                  <select
                    value={newMember.paymentMethod}
                    onChange={(e) => setNewMember({ ...newMember, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                    required
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleAddMember} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Add Member
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Member Modal */}
      <AnimatePresence>
        {editMode && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Edit Member</h3>
                <button onClick={() => { setEditMode(false); setSelectedMember(null); }} className="p-1 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={selectedMember.name}
                    onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={selectedMember.phoneNumber}
                    onChange={(e) => setSelectedMember({ ...selectedMember, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={selectedMember.dateOfBirth.split('T')[0]}
                    onChange={(e) => setSelectedMember({ ...selectedMember, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={selectedMember.gender}
                    onChange={(e) => setSelectedMember({ ...selectedMember, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={selectedMember.address}
                    onChange={(e) => setSelectedMember({ ...selectedMember, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={selectedMember.emergencyContact?.contactName || ''}
                    onChange={(e) => setSelectedMember({ ...selectedMember, emergencyContact: { ...selectedMember.emergencyContact, contactName: e.target.value } })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Number</label>
                  <input
                    type="tel"
                    value={selectedMember.emergencyContact?.contactNumber || ''}
                    onChange={(e) => setSelectedMember({ ...selectedMember, emergencyContact: { ...selectedMember.emergencyContact, contactNumber: e.target.value } })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedMember.status}
                    onChange={(e) => setSelectedMember({ ...selectedMember, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => { setEditMode(false); setSelectedMember(null); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleUpdateMember} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Update Member
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Member</h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete {selectedMember.name}? This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => { setShowDeleteModal(false); setSelectedMember(null); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleDeleteMember} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Renew Membership Modal */}
      <AnimatePresence>
        {showRenewModal && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Renew Membership</h3>
                <button onClick={() => { setShowRenewModal(false); setSelectedMember(null); setRenewData({ newMembershipId: '', paymentMethod: 'Cash' }); }} className="p-1 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Membership</label>
                  <select
                    value={renewData.newMembershipId}
                    onChange={(e) => setRenewData({ ...renewData, newMembershipId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  >
                    <option value="">Select Membership</option>
                    {memberships.map(membership => (
                      <option key={membership._id} value={membership._id}>{membership.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={renewData.paymentMethod}
                    onChange={(e) => setRenewData({ ...renewData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => { setShowRenewModal(false); setSelectedMember(null); setRenewData({ newMembershipId: '', paymentMethod: 'Cash' }); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleRenewMember} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Renew Membership
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Member Details</h3>
                <button onClick={() => { setShowDetailsModal(false); setSelectedMember(null); }} className="p-1 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p><strong>Name:</strong> {selectedMember.name}</p>
                <p><strong>Phone:</strong> {selectedMember.phoneNumber}</p>
                <p><strong>Date of Birth:</strong> {new Date(selectedMember.dateOfBirth).toLocaleDateString()}</p>
                <p><strong>Gender:</strong> {selectedMember.gender}</p>
                <p><strong>Address:</strong> {selectedMember.address || 'N/A'}</p>
                <p><strong>Emergency Contact:</strong> {selectedMember.emergencyContact?.contactName || 'N/A'} ({selectedMember.emergencyContact?.contactNumber || 'N/A'})</p>
                <p><strong>Total Hours:</strong> {selectedMember.totalHours}</p>
                <p><strong>Hours Used:</strong> {(selectedMember.totalHours)-(selectedMember.hoursRemaining)}</p>
                <p><strong>Hours Remaining:</strong> {selectedMember.hoursRemaining}</p>
                <p><strong>Remaining Days:</strong> {selectedMember.remainingDays > 0 ? selectedMember.remainingDays : 'Expired'}</p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => { setShowDetailsModal(false); setSelectedMember(null); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Members;