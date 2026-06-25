import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdArrowBack, IoMdArrowDropdown } from "react-icons/io";
import Pagination from '../../../../Pagination';

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api";
const token = Cookies.get("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

const AllPermission = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const queryClient = useQueryClient();

  const [permissions, setPermissions] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [searchRole, setSearchRole] = useState("");
  
  const [selectedAuthority, setSelectedAuthority] = useState("");
  const [isUpdatingAuthority, setIsUpdatingAuthority] = useState(false);
  const [authorityErrors, setAuthorityErrors] = useState({});
  
  const [authoritySearch, setAuthoritySearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [authorityPerms, setAuthorityPerms] = useState({
    view: false,
    edit: false,
    all: false
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getSubroleRole = async () => {
    const res = await api.get("/supervisor/get-roles-supervisor");
    return res.data.data; 
  };

  const { data: users, isLoading: usersLoading, isError: usersError } = useQuery({
    queryKey: ["roles-supervisor"], 
    queryFn: getSubroleRole
  });

  // Ye API private-file-permission ki list layegi jisme can_view, can_edit (0, 1) hoga
  const getSavedPermissions = async () => {
    const res = await api.get(`/supervisor/private-file-permission/${id}`);
    return res.data.data; 
  };

  const { data: savedPerms, isLoading: permsLoading } = useQuery({
    queryKey: ["private-file-permission", id], 
    queryFn: getSavedPermissions,
    enabled: !!id
  });

useEffect(() => {
  if (selectedAuthority && savedPerms) {

    const safeSavedPerms = Array.isArray(savedPerms)
      ? savedPerms
      : Object.values(savedPerms || {});

    const matchedPerm = safeSavedPerms.find(
      p => String(p.id) === String(selectedAuthority)
    );

    if (matchedPerm) {

      const hasView =
        matchedPerm.can_view == 1 ||
        matchedPerm.can_view === true ||
        matchedPerm.can_view === "1";

      const hasEdit =
        matchedPerm.can_edit == 1 ||
        matchedPerm.can_edit === true ||
        matchedPerm.can_edit === "1";

      setAuthorityPerms({
        view: hasView,
        edit: hasEdit,
        all: hasView && hasEdit
      });

    } else {
      setAuthorityPerms({
        view: false,
        edit: false,
        all: false
      });
    }

  } else {
    setAuthorityPerms({
      view: false,
      edit: false,
      all: false
    });
  }
}, [selectedAuthority, savedPerms]);



// ===== ISKE NICHE NAYA CODE ADD KARNA HAI =====

useEffect(() => {
  if (savedPerms && Array.isArray(savedPerms)) {

    const selectedPerm = savedPerms.find(
      (item) =>
        item.can_view == 1 ||
        item.can_edit == 1
    );

    if (selectedPerm) {

      setSelectedAuthority(String(selectedPerm.id));

      setAuthorityPerms({
        view: selectedPerm.can_view == 1,
        edit: selectedPerm.can_edit == 1,
        all:
          selectedPerm.can_view == 1 &&
          selectedPerm.can_edit == 1,
      });
    }
  }
}, [savedPerms]);

  // Table logic (Commented part ke liye)
  useEffect(() => {
    if (users && Array.isArray(users)) {
      const initialPerms = {};
      const safeSavedPerms = Array.isArray(savedPerms) ? savedPerms : Object.values(savedPerms || {});
      
      users.forEach(user => {
        const savedUserPerm = safeSavedPerms?.find(p => String(p.id) === String(user.id));
        
        const hasView = savedUserPerm ? (savedUserPerm.can_view == 1 || savedUserPerm.can_view === true || savedUserPerm.can_view === "1") : false;
        const hasEdit = savedUserPerm ? (savedUserPerm.can_edit == 1 || savedUserPerm.can_edit === true || savedUserPerm.can_edit === "1") : false;
        const hasAll = hasView && hasEdit;
        
        initialPerms[user.id] = { 
          view: hasView, 
          edit: hasEdit, 
          all: hasAll 
        };
      });
      
      setPermissions(initialPerms);
    }
  }, [users, savedPerms]);

  const handleCheckboxChange = (userId, type, checked) => {
    setPermissions(prev => {
      const current = { ...prev[userId] };

      if (type === 'all') {
        current.all = checked;
        current.view = checked;
        current.edit = checked;
      } else if (type === 'edit') {
        current.edit = checked;
        if (checked) {
          current.view = true;
          current.all = true;
        } else {
          current.all = false;
        }
      } else if (type === 'view') {
        current.view = checked;
        if (!checked) {
          current.edit = false;
          current.all = false;
        }
      }

      if (current.view && current.edit) {
        current.all = true;
      }

      return { ...prev, [userId]: current };
    });
  };

  const handleAuthorityPermCheckbox = (type, checked) => {
    if (!selectedAuthority) {
      toast.error("Please select an authority first");
      return; 
    }

    setAuthorityPerms(prev => {
      const current = { ...prev };

      if (type === 'all') {
        current.all = checked;
        current.view = checked;
        current.edit = checked;
      } else if (type === 'edit') {
        current.edit = checked;
        if (checked) {
          current.view = true;
          current.all = true;
        } else {
          current.all = false;
        }
      } else if (type === 'view') {
        current.view = checked;
        if (!checked) {
          current.edit = false;
          current.all = false;
        }
      }

      if (current.view && current.edit) {
        current.all = true;
      }

      return current;
    });
  };

  // --- Update Authority Logic ---
  const handleUpdateAuthority = async () => {
    setAuthorityErrors({});
    
    if (!selectedAuthority) {
      setAuthorityErrors({ person_user_id: ["Please select an authority"] });
      return;
    }

    try {
      setIsUpdatingAuthority(true);
      // Payload me true/false ki jagah 1/0 bhej rahe hain
      const payload = {
        id: parseInt(id),
        person_user_id: parseInt(selectedAuthority),
        view: authorityPerms.view ? 1 : 0, 
        edit: authorityPerms.edit ? 1 : 0  
      };

      const response = await api.post("/supervisor/update-personal-user-id", payload);
      
      if (response.data.status) {
        toast.success(response.data.message || "Authority updated successfully!");
    
        
        await queryClient.invalidateQueries({
          queryKey: ["private-file-permission", id],
        });
      }
    } catch (error) {
      const res = error.response?.data;
      if (res?.message && typeof res.message === 'object') {
        setAuthorityErrors(res.message);
      } else if (res?.message) {
        toast.error(res.message);
      } else {
        toast.error("Failed to update authority.");
      }
    } finally {
      setIsUpdatingAuthority(false);
    }
  };

  const handleSave = async () => {
    const hasAtLeastOneSelection = Object.values(permissions).some(
      (perms) => perms.view || perms.edit
    );

    if (!hasAtLeastOneSelection) {
      toast.error("Please select at least one permission to allow.");
      return;
    }

    const payloadPermissions = Object.entries(permissions).map(([userId, perms]) => ({
      user_id: parseInt(userId),
      view: perms.view ? 1 : 0,
      edit: perms.edit ? 1 : 0
    }));

    const payload = {
      file_id: parseInt(id),
      permissions: payloadPermissions
    };

    try {
      setIsSaving(true);
      await api.post("/supervisor/file/give-permission", payload);
      
      await queryClient.invalidateQueries({
        queryKey: ["private-file-permission", id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["roles-supervisor"],
      });
      
      toast.success("Permissions saved successfully!");
      
      setTimeout(()=>{
        navigate(-1)
      }, 2000)
      
    } catch (error) {
      toast.error("Failed to save permissions.");
    } finally {
      setIsSaving(false);
    }
  };

  const safeUsers = users || [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const filteredUsers = safeUsers.filter((user) => {
    const role = user.name?.toLowerCase() || "";
    const subrole = user.subrole?.label?.toLowerCase() || "";
    const search = searchRole.toLowerCase();
    return role.includes(search) || subrole.includes(search);
  });

  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const filteredAuthorities = safeUsers.filter((user) => {
    const roleName = user?.name?.toLowerCase() || "";
    const subroleName = user?.subrole?.label?.toLowerCase() || user?.subrole?.name?.toLowerCase() || "";
    const search = authoritySearch.toLowerCase();
    return roleName.includes(search) || subroleName.includes(search);
  });
  
  const selectedAuthorityName = safeUsers.find(u => String(u.id) === String(selectedAuthority))?.name || "";

  if (usersLoading || permsLoading) return <div className="flex h-screen justify-center items-center text-gray-600 ">Loading...</div>;
  if (usersError) return <div className="flex h-screen justify-center items-center text-red-600 ">Error loading users data.</div>;

  return (
    <div className="bg-gray-50 min-h-screen w-full pb-10">
      <Toaster position="top-right" />
      
      <div className="w-full mx-auto">
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage File Access</h2>
            <p className="text-sm text-gray-500 mt-1">Update authority or assign view/edit permissions.</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1 text-sm font-medium"
          >
            <IoMdArrowBack className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Update Authority</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Authority <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search and select an authority..."
                      value={isDropdownOpen ? authoritySearch : selectedAuthorityName}
                      onChange={(e) => {
                        setAuthoritySearch(e.target.value);
                        if (!isDropdownOpen) setIsDropdownOpen(true);
                      }}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-sm cursor-pointer ${
                        authorityErrors.person_user_id ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isUpdatingAuthority}
                    />
                    
                    <div 
                      className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <IoMdArrowDropdown 
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`} 
                      />
                    </div>

                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredAuthorities.length > 0 ? (
                          filteredAuthorities.map((item) => {
                            const roleLabel = item?.name;
                            const subroleLabel = item.subrole?.label || item.subrole?.name;
                            return (
                              <div
                                key={item.id}
                                onClick={() => {
                                  setSelectedAuthority(item.id);
                                  setAuthoritySearch("");
                                  setIsDropdownOpen(false);
                                  setAuthorityErrors((prev) => ({ ...prev, person_user_id: undefined }));
                                  // Niche wala useEffect apne aap tick karega id change hone par!
                                }}
                                className={`px-3 py-2 cursor-pointer text-sm hover:bg-blue-50 transition-colors ${
                                  String(selectedAuthority) === String(item.id) ? "bg-blue-100 font-semibold" : "text-gray-700"
                                }`}
                              >
                                {roleLabel} {subroleLabel ? ` (${subroleLabel})` : ""}
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500 text-center">
                            No authority found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {authorityErrors.person_user_id && (
                    <p className="mt-1 text-xs text-red-600">{authorityErrors.person_user_id[0]}</p>
                  )}
                  {authorityErrors.id && (
                    <p className="mt-1 text-xs text-red-600">File ID Error: {authorityErrors.id[0]}</p>
                  )}

                  <div className="mt-4 border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Give Permissions
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={authorityPerms.view}
                          onChange={(e) => handleAuthorityPermCheckbox('view', e.target.checked)}
                        />
                        <span className="text-sm text-gray-700">View</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={authorityPerms.edit}
                          onChange={(e) => handleAuthorityPermCheckbox('edit', e.target.checked)}
                        />
                        <span className="text-sm text-gray-700">Edit</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={authorityPerms.all}
                          onChange={(e) => handleAuthorityPermCheckbox('all', e.target.checked)}
                        />
                        <span className="text-sm text-gray-700 font-medium">All</span>
                      </label>
                    </div>
                  </div>

                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleUpdateAuthority}
                    disabled={isUpdatingAuthority}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-400 transition shadow-sm"
                  >
                    {isUpdatingAuthority ? 'Updating...' : 'Update Authority'}
                  </button>
                </div>
              </div>
            </div>
          </div>

{/* <div className="lg:col-span-6">
            <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 overflow-x-auto">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Give Permissions</h3>

                <input
                  type="text"
                  placeholder="Search role"
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 w-1/2">Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center">View</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center">Edit</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center">All</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentUsers.map(user => {
                    const userName = user.name || "Unknown";
                    const subroleName = user.subrole?.label || user.subrole?.name || "No subrole";
                    const initial = userName.charAt(0).toUpperCase();

                    return (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                              {initial}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{userName}</p>
                              <p className="text-xs text-gray-500">{subroleName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center align-middle">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            checked={permissions[user.id]?.view || false}
                            onChange={(e) => handleCheckboxChange(user.id, 'view', e.target.checked)}
                          />
                        </td>
                        <td className="px-6 py-4 text-center align-middle">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            checked={permissions[user.id]?.edit || false}
                            onChange={(e) => handleCheckboxChange(user.id, 'edit', e.target.checked)}
                          />
                        </td>
                        <td className="px-6 py-4 text-center align-middle">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            checked={permissions[user.id]?.all || false}
                            onChange={(e) => handleCheckboxChange(user.id, 'all', e.target.checked)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end items-center gap-3 px-6 py-4 bg-gray-50 border-x border-b border-gray-200 rounded-b-xl shadow-sm">
              <button 
                onClick={() => navigate(-1)} 
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition shadow-sm"
              >
                {isSaving ? 'Allowing...' : 'Allow Permissions'}
              </button>
            </div>

            {safeUsers.length > 0 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={safeUsers.length}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </div> */}

        </div>
      </div>
    </div>
  );
}

export default AllPermission;