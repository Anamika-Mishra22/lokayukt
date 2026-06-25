// pages/UserManagement.js
import React, { useState } from 'react';
import {
  FaUserPlus,
  FaUser as FaUserIcon,
  FaEdit,
  FaTrash,
  FaShieldAlt,
  FaEnvelope,
  FaPhone,
  // FaSpinner,
  FaExclamationTriangle,
  FaDownload,
  FaKey, 
  FaSave
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Pagination from '../../../../Pagination';
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { toast, Toaster } from "react-hot-toast";

import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});




// API Functions
const fetchUsers = async () => {
  const response = await api.get('/supervisor/users');
  if (response.data.status === true) {
    return response.data.data;
  }
  throw new Error('Failed to fetch users');
};

const toggleUserStatus = async (userId) => {
  const response = await api.post(`/supervisor/change-status/${userId}`);
  if (response.data.status === true) {
    return response.data;
  }
  throw new Error(response.data.message || 'Failed to update status');
};

const deleteUser = async (userId) => {
  const response = await api.post(`/supervisor/delete-users/${userId}`);
  if (response.data.status === true) {
    return response.data;
  }
  throw new Error(response.data.message || 'Failed to delete user');
};

const fetchUserPermissions = async (userId) => {
  // Apna correct GET endpoint yahan daalein (e.g., /supervisor/get-permissions/1)
  const response = await api.get(`/supervisor/get-permission/${userId}`);
  if (response.data.status === true) {
    return response.data.data; // Ye API aapko purana data degi
  }
  return null;
};

const updatePermissions = async (data) => {
  const response = await api.post('/supervisor/assign-permission', data);

  if (response.data.status === true) {
    return response.data;
  }
  throw new Error(response.data.message || 'Failed to update permissions');
};

// Delete Confirmation Modal Component
const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName, 
  isDeleting 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl transform transition-all">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-700">
            Are you sure you want to delete user <span className="font-semibold text-gray-900">"{userName}"</span>? 
            This will permanently remove all their data and access.
          </p>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#123463] focus:border-[#123463] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 flex items-center gap-2 ${
              isDeleting 
                ? 'bg-red-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isDeleting ? (
              <>
                {/* <FaSpinner className="w-4 h-4 animate-spin" /> */}
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="w-4 h-4" />
                Delete User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


const PermissionModal = ({ isOpen, onClose, user, onUpdate, isUpdating }) => {
  const [permissions, setPermissions] = useState({});

  // API se purana data la rahe hain
  const { data: savedPermissions, isLoading } = useQuery({
    queryKey: ['userPermissions', user?.id],
    queryFn: () => fetchUserPermissions(user?.id),
    enabled: !!isOpen && !!user?.id, 
  });

  // Jab data aaye, tab permissions state ko dynamically set karo
  React.useEffect(() => {
    if (isOpen) {
      if (savedPermissions) {
        const isTrue = (val) => val === 1 || val === '1' || val === true;
        const dynamicPermissions = {};
        
        // API me jitne keys (1, 2, 3...) aayenge, utne set ho jayenge
        Object.keys(savedPermissions).forEach(key => {
          dynamicPermissions[key] = {
            can_view: isTrue(savedPermissions[key]?.can_view),
            can_edit: isTrue(savedPermissions[key]?.can_edit),
            all: isTrue(savedPermissions[key]?.can_view) && isTrue(savedPermissions[key]?.can_edit)
          };
        });
        
        setPermissions(dynamicPermissions);
      } else {
        setPermissions({});
      }
    }
  }, [isOpen, savedPermissions]);

  if (!isOpen || !user) return null;

  const handleCheckboxChange = (moduleId, type, checked) => {
    setPermissions(prev => {
      const updatedModule = { ...(prev[moduleId] || { can_view: false, can_edit: false, all: false }) };
      updatedModule[type] = checked;

      if (type === 'all' && checked) {
        updatedModule.can_view = true;
        updatedModule.can_edit = true;
      }
      if (type === 'all' && !checked) {
        updatedModule.can_view = false;
        updatedModule.can_edit = false;
      }
      if ((type === 'can_view' || type === 'can_edit') && !checked) {
        updatedModule.all = false;
      }
      if ((type === 'can_view' || type === 'can_edit') && checked) {
        if ((type === 'can_view' && updatedModule.can_edit) || (type === 'can_edit' && updatedModule.can_view)) {
           updatedModule.all = true;
        }
      }

      return { ...prev, [moduleId]: updatedModule };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Payload bhi dynamically banega jitne modules hain
    const payloadPermissions = {};
    Object.keys(permissions).forEach(key => {
      payloadPermissions[key] = {
        can_view: permissions[key].can_view ? 1 : 0,
        can_edit: permissions[key].can_edit ? 1 : 0
      };
    });

    const payload = {
      user_id: user.id,
      permissions: payloadPermissions
    };

    onUpdate(payload);
  };

  // Helper function: "employee_management" ko "Employee Management" banane ke liye
  const formatModuleName = (name) => {
    if (!name) return 'Unknown Module';
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // API data se dynamically modules array banana
  const modules = savedPermissions 
    ? Object.keys(savedPermissions).map(key => ({
        id: key,
        label: formatModuleName(savedPermissions[key].module_name)
      }))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl transform transition-all">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Manage Permissions</h3>
            <p className="text-sm text-gray-500">User: <span className="font-semibold">{user?.name}</span></p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {/* Loading indicator */}
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">
            Loading...
          </div>
        ) : (
          <div className="px-6 py-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3 text-sm font-medium text-gray-700">Module Name</th>
                  <th className="p-3 text-sm font-medium text-gray-700 text-center">View</th>
                  <th className="p-3 text-sm font-medium text-gray-700 text-center">Edit</th>
                  <th className="p-3 text-sm font-medium text-gray-700 text-center">All</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((mod) => (
                  <tr key={mod.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium text-gray-800">{mod.label}</td>
                    <td className="p-3 text-center">
                      <input type="checkbox" className="w-4 h-4 text-[#13316C] rounded cursor-pointer" 
                        checked={permissions[mod.id]?.can_view || false}
                        onChange={(e) => handleCheckboxChange(mod.id, 'can_view', e.target.checked)} />
                    </td>
                    <td className="p-3 text-center">
                      <input type="checkbox" className="w-4 h-4 text-[#13316C] rounded cursor-pointer"
                        checked={permissions[mod.id]?.can_edit || false}
                        onChange={(e) => handleCheckboxChange(mod.id, 'can_edit', e.target.checked)} />
                    </td>
                    <td className="p-3 text-center">
                      <input type="checkbox" className="w-4 h-4 text-[#13316C] rounded cursor-pointer"
                        checked={permissions[mod.id]?.all || false}
                        onChange={(e) => handleCheckboxChange(mod.id, 'all', e.target.checked)} />
                    </td>
                  </tr>
                ))}
                
                {/* Agar modules array khali ho (Backend ne data nahi bheja) */}
                {modules.length === 0 && !isLoading && (
                   <tr>
                     <td colSpan="4" className="p-4 text-center text-gray-500 text-sm">No modules found for this user.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50 rounded-b-lg">
          <button type="button" onClick={onClose} disabled={isUpdating} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={isUpdating || isLoading || modules.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-[#13316C] rounded-md hover:bg-[#0f2451] flex items-center gap-2 disabled:opacity-50">
            {isUpdating ? 'Updating...' : <><FaSave /> Update Permissions</>}
          </button>
        </div>
      </div>
    </div>
  );
};
// NAYA CODE YAHAN KHATAM HOTA HAI

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [activeTab, setActiveTab] = useState('users');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissionUser, setPermissionUser] = useState(null);
  
  const ITEMS_PER_PAGE = 10;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch users with React Query
  const { 
    data: users = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    }
  });

  // Toggle status mutation
  const statusMutation = useMutation({
    mutationFn: toggleUserStatus,
    onMutate: async (userId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] });
      
      // Snapshot previous value
      const previousUsers = queryClient.getQueryData(['users']);
      
      // Optimistically update
      queryClient.setQueryData(['users'], (old) =>
        old?.map(user =>
          user.id === userId
            ? { ...user, status: user.status === '1' || user.status === 1 ? '0' : '1' }
            : user
        )
      );
      
      return { previousUsers };
    },
    onError: (error, userId, context) => {
      // Rollback on error
      queryClient.setQueryData(['users'], context.previousUsers);
      toast.error(error.message || 'Failed to update status');
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Status updated successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data, userId) => {
      toast.success(data.message || 'User deleted successfully');
      
      // Update cache by removing deleted user
      queryClient.setQueryData(['users'], (old) =>
        old?.filter(user => user.id !== userId)
      );
      
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
      
      // Adjust pagination if needed
      const remainingUsers = users.length - 1;
      const maxPage = Math.ceil(remainingUsers / ITEMS_PER_PAGE);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Error deleting user. Please try again.');
    }
  });

 const permissionMutation = useMutation({
    mutationFn: updatePermissions,
    // Yahan variables me wo payload aata hai jo humne bheja tha
    onSuccess: (data, variables) => {
      toast.success(data.message || 'Permissions updated successfully');
      setIsPermissionModalOpen(false);
      setPermissionUser(null);
      
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      queryClient.invalidateQueries({ queryKey: ['userPermissions'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Error updating permissions.');
    }
  });

  const handleOpenPermission = (user) => {
    setPermissionUser(user);
    setIsPermissionModalOpen(true);
  };

  const handleUpdatePermissions = (data) => {
    permissionMutation.mutate(data);
  };

  // Handlers
  const handleToggleStatus = (userId, currentStatus) => {
    statusMutation.mutate(userId);
  };

  const handleDelete = (user) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingUser) {
      deleteMutation.mutate(deletingUser.id);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  };

  // Utility functions
  const displayValue = (value) => {
    if (value === null || value === undefined || value === '' || value === 0) {
      return 'NA';
    }
    return value;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'NA';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN') + ' ' + date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'NA';
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      Administrator: 'bg-red-100 text-red-800',
      supervisor: 'bg-red-100 text-red-800',
      Operator: 'bg-blue-100 text-blue-800',
      Supervisor: 'bg-green-100 text-green-800',
      Secretary: 'bg-gray-100 text-gray-800',
      CIO: 'bg-cyan-100 text-cyan-800',
      RO: 'bg-yellow-100 text-yellow-800',
      ARO: 'bg-yellow-100 text-yellow-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const handleExport = () => {
    try {
      if (filteredUsers.length === 0) {
        toast.warning('No data to export');
        return;
      }

      const wsData = [
        ["Sr.No", "Name", "Username", "Email", "Role", "Status", "Last Login"],
        ...filteredUsers.map((user, idx) => [
          idx + 1,
          user.name || "उपलब्ध नहीं",
          user.user_name || "उपलब्ध नहीं",
          user.email || "उपलब्ध नहीं",
          user.role?.label || user.role?.name || "उपलब्ध नहीं",
          (user.status === '1' || user.status === 1) ? "Active" : "Inactive",
          user.updated_at ? new Date(user.updated_at).toLocaleString('en-IN') : "उपलब्ध नहीं"
        ])
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      const headerStyle = {
        font: { bold: true, color: { rgb: "000000" } },
        alignment: { horizontal: "center" },
        fill: { fgColor: { rgb: "D3D3D3" } }
      };

      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddress]) ws[cellAddress] = {};
        ws[cellAddress].s = headerStyle;
      }

      ws['!cols'] = [
        { wch: 8 },
        { wch: 20 },
        { wch: 20 },
        { wch: 30 },
        { wch: 20 },
        { wch: 12 },
        { wch: 22 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Users Report");

      const excelBuffer = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array',
        cellStyles: true
      });

      const data = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      saveAs(data, `users_report_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success('Export successful');
    } catch (error) {
      console.error("Export failed:", error);
      toast.error('Export failed');
    }
  };

  // Filtered and paginated data
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === '' ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const userRole = user.role?.label || user.role?.name || 'Unknown';
    const matchesRole = selectedRole === 'all' || userRole === selectedRole;

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const uniqueRoles = [...new Set(users.map(user => user.role?.label || user.role?.name).filter(Boolean))];

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          {/* <FaSpinner className="w-12 h-12 animate-spin text-[#13316C] mx-auto mb-4" /> */}
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <FaExclamationTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Users</h2>
          <p className="text-gray-600 mb-4">{error?.message || 'Something went wrong'}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#13316C] text-white rounded-md hover:bg-[#0f2451] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster
        position="top-right"
      
      />
      
      <div className=" space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-600">उपयोगकर्ता प्रबंधन</p>
          </div>
          <button
            onClick={() => navigate("add")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#13316C] text-white rounded-md text-sm hover:bg-[#0f2451] transition"
          >
            <FaUserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="space-y-4">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full m-3">
              <button
                onClick={() => setActiveTab('users')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all flex-1 ${
                  activeTab === 'users' ? "bg-white text-black shadow-sm" : "hover:text-gray-700"
                }`}
              >
                Users 
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all flex-1 ${
                  activeTab === 'roles' ? "bg-white text-black shadow-sm" : "hover:text-gray-700"
                }`}
              >
                Roles & Permissions
              </button>
              {/* <button
                onClick={() => setActiveTab('audit')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all flex-1 ${
                  activeTab === 'audit' ? "bg-white text-black shadow-sm" : "hover:text-gray-700"
                }`}
              >
                Audit Log
              </button> */}
            </div>

            {/* Tab Content */}
            <div className="px-4 pb-4">
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  {/* Search and Filter with Export */}
                 <div className="bg-gray-50 p-3 rounded-md border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    
                    <h3 className="text-base font-semibold text-gray-900">
                      User List
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      
                      {/* Search */}
                      <input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-48 px-3 py-1.5 text-sm border border-gray-300 rounded-md 
                                  focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                      />

                      {/* Role Filter */}
                      <select
                        className="w-full sm:w-32 px-3 py-1.5 text-sm border border-gray-300 rounded-md 
                                  focus:ring-1 focus:ring-[#123463] focus:border-[#123463]"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        <option value="all">All Roles</option>
                        {uniqueRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>

                      {/* Button */}
                      <button
                        onClick={handleExport}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 
                                  bg-[#13316C] text-white px-4 py-2 rounded-md 
                                  hover:bg-[#0f2451] transition"
                      >
                        <FaDownload className="text-base" />
                        <span className="text-sm">Export</span>
                      </button>

                    </div>
                  </div>
                </div>

                  {/* Table */}
                  <div className="bg-white rounded-md border border-gray-200 overflow-hidden">

  {/* Top Scrollbar */}
  <div
    id="top-scroll"
    className="overflow-x-auto overflow-y-hidden h-4"
    onScroll={(e) => {
      const bottomScroll = document.getElementById("bottom-scroll");
      if (bottomScroll) {
        bottomScroll.scrollLeft = e.target.scrollLeft;
      }
    }}
  >
    <div className="min-w-[1400px] h-1"></div>
  </div>

  {/* Main Table Scroll */}
  <div
    id="bottom-scroll"
    className="overflow-x-auto overflow-y-hidden pb-2"
    onScroll={(e) => {
      const topScroll = document.getElementById("top-scroll");
      if (topScroll) {
        topScroll.scrollLeft = e.target.scrollLeft;
      }
    }}
  >
    <table className="min-w-[1400px] w-full text-sm">
      <thead className="bg-gray-50">
        <tr className="border-b border-gray-200">
          <th className="text-left py-2 px-4 font-medium text-gray-900">Actions</th>
          <th className="text-left py-2 px-4 font-medium text-gray-900">User</th>
          <th className="text-left py-2 px-4 font-medium text-gray-900">Role</th>
          <th className="text-left py-2 px-4 font-medium text-gray-900">Sub Role</th>
          <th className="text-left py-2 px-4 font-medium text-gray-900">Department</th>
          <th className="text-left py-2 px-4 font-medium text-gray-900">Pin</th>
          <th className="text-center py-2 px-4 font-medium text-gray-900">Permissions</th>
          <th className="text-left py-2 px-4 font-medium text-gray-900">Status</th>
          <th className="text-left py-2 px-4 font-medium text-gray-900">Last Login</th>
          <th className="text-left py-2 px-4 font-medium text-gray-900">Contact</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {paginatedUsers.length === 0 ? (
          <tr>
            <td colSpan="10" className="py-8 px-4 text-center text-gray-500">
              No users found
            </td>
          </tr>
        ) : (
          paginatedUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">

              {/* Actions */}
              <td className="py-2 px-4">
                <div className="flex gap-1">
                  <button 
                    onClick={() => navigate(`edit/${user.id}`)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title="Edit User"
                  >
                    <FaEdit className="w-3 h-3" />
                  </button>

                  <button 
                    onClick={() => handleDelete(user)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                    title="Delete User"
                    disabled={deleteMutation.isPending}
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              </td>

              {/* User */}
              <td className="py-2 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUserIcon className="w-3 h-3 text-blue-600" />
                  </div>

                  <div>
                    <div className="font-medium text-sm">
                      {displayValue(user.name)}
                    </div>

                    <div className="text-xs text-gray-500">
                      {user?.user_name}
                    </div>
                  </div>
                </div>
              </td>

              {/* Role */}
              <td className="py-2 px-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                    user.role?.label || user.role?.name
                  )}`}
                >
                  {displayValue(user.role?.label)}
                </span>
              </td>

              {/* SubRole */}
              <td className="py-2 px-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                    user.role?.label || user.role?.name
                  )}`}
                >
                  {user.subrole?.label || "No SubRole"}
                </span>
              </td>

              {/* Department */}
              <td className="py-2 px-4">
                <div className="text-xs kruti-input text-gray-700">
                  {user.department?.name || user.department || "miyC/k ugha"}
                </div>
              </td>

              {/* OTP */}
              <td className="py-2 px-4">
                <div className="text-xs text-gray-700">
                  {user?.otp || "उपलब्ध नहीं"}
                </div>
              </td>

              {/* Permissions */}
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleOpenPermission(user)}
                  className="inline-flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium text-white bg-[#13316C] rounded hover:bg-[#0f2451] transition"
                  title="Manage Permissions"
                >
                  <FaKey className="w-3 h-3" /> Set
                </button>
              </td>

              {/* Status */}
              <td className="py-2 px-4">
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={user.status === "1" || user.status === 1}
                      onChange={() =>
                        handleToggleStatus(user.id, user.status)
                      }
                      disabled={statusMutation.isPending}
                      className="sr-only peer"
                    />

                    <div
                      className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer transition-all ease-in-out duration-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13316C]`}
                    ></div>
                  </label>
                </div>
              </td>

              {/* Last Login */}
              <td className="py-2 px-4 text-xs text-gray-700">
                {formatDate(user.updated_at)}
              </td>

              {/* Contact */}
              <td className="py-2 px-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <FaEnvelope className="w-3 text-red-500 h-3" />

                    <span className="truncate max-w-[120px]">
                      {displayValue(user.email)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <FaPhone className="w-3 text-green-600 h-3" />
                    {displayValue(user.number)}
                  </div>
                </div>
              </td>

            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="mt-4">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredUsers.length}
        itemsPerPage={ITEMS_PER_PAGE}
        showInfo={true}
      />
    </div>
  )}
</div>
                </div>
              )}

              {/* Roles & Permissions Tab */}
              {activeTab === 'roles' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uniqueRoles.map((role) => (
                    <div key={role} className="bg-white border border-gray-200 rounded-md p-3">
                      <div className="flex items-center gap-2 text-base font-semibold mb-2">
                        <FaShieldAlt className="w-4 h-4 text-blue-600" />
                        {role}
                      </div>
                      <div className="text-sm">
                        <div><strong>Users:</strong> {users.filter((u) => (u.role?.label || u.role?.name) === role).length}</div>
                        <div className="mt-2"><strong>Permissions:</strong></div>
                        <ul className="list-disc list-inside text-xs text-gray-500 mt-1">
                          <li>Role-based access control</li>
                          <li>System permissions</li>
                          <li>Data management</li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Audit Log Tab */}
              {activeTab === 'audit' && (
                <div className="bg-white border border-gray-200 rounded-md">
                  <div className="px-4 py-2 border-b bg-gray-50">
                    <h3 className="text-base font-semibold">User Activity Audit Log</h3>
                  </div>
                  <div className="p-3 space-y-2">
                    {users.slice(0, 5).map((user, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <div className="text-sm font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">Last updated profile</div>
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(user.updated_at)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        userName={deletingUser?.name}
        isDeleting={deleteMutation.isPending}
      />

      <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => {
          setIsPermissionModalOpen(false);
          setPermissionUser(null);
        }}
        user={permissionUser}
        onUpdate={handleUpdatePermissions}
        isUpdating={permissionMutation.isPending}
      />  
    </div>
  );
};

export default UserManagement;
