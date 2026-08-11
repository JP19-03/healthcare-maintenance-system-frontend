import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Users, Shield, UserCheck, Wrench, UserPlus } from "lucide-react";
import { userService } from "../../services/userService";
import { authService } from "../../services/authService";
import type { SignUpFormData } from "../../types";
import { UserTable } from "../../components/iam/UserTable";
import CreateUserModal from "../../components/iam/CreateUserModal";

export default function UsersView() {
  const queryClient = useQueryClient();
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch all users
  const { data: userList = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAllUsers,
  });

  // Create User Mutation (Sign Up)
  const createUserMutation = useMutation({
    mutationFn: authService.signUp,
    onSuccess: () => {
      toast.success("User account created successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Error creating user account",
      );
    },
  });

  const handleCreateUserSubmit = (formData: SignUpFormData) => {
    createUserMutation.mutate(formData);
  };

  // Filtered Users List
  const filteredUsers = userList.filter((user) => {
    if (selectedRoleFilter === "ALL") return true;
    return user.role === selectedRoleFilter;
  });

  // Role Stats Counters
  const totalUsers = userList.length;
  const adminCount = userList.filter((u) => u.role === "ROLE_ADMIN").length;
  const managerCount = userList.filter((u) => u.role === "ROLE_MANAGER").length;
  const techCount = userList.filter((u) => u.role === "ROLE_TECH").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-teal-400" />
            User & Staff Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Directory of hospital staff, administrators, and biomedical
            technicians.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-linear-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-teal-500/20 transition cursor-pointer flex items-center justify-center gap-2 text-sm shrink-0"
        >
          <UserPlus className="w-5 h-5" />
          <span>Create New User</span>
        </button>
      </div>

      {/* Stats KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Staff
            </span>
            <Users className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-3xl font-black text-white">{totalUsers}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Administrators
            </span>
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-purple-400">{adminCount}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Department Heads
            </span>
            <UserCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-cyan-400">{managerCount}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Biomedical Technicians
            </span>
            <Wrench className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-3xl font-black text-teal-400">{techCount}</p>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { key: "ALL", label: "All", count: totalUsers },
          { key: "ROLE_ADMIN", label: "Administrators", count: adminCount },
          {
            key: "ROLE_MANAGER",
            label: "Department Heads",
            count: managerCount,
          },
          { key: "ROLE_TECH", label: "Technicians", count: techCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedRoleFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              selectedRoleFilter === tab.key
                ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* User Table */}
      <UserTable data={filteredUsers} isLoading={isLoading} />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUserSubmit}
        isLoading={createUserMutation.isPending}
      />
    </div>
  );
}
