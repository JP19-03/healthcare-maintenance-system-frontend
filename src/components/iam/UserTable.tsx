import React from "react";
import { User, Shield, Building2 } from "lucide-react";
import type { UserProfile } from "../../types";
import DataTable from "../common/DataTable";
import type { ColumnDef } from "../common/DataTable";

interface UserTableProps {
  data: UserProfile[];
  isLoading?: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  data,
  isLoading = false,
}) => {
  const getRoleBadge = (role: UserProfile["role"]) => {
    switch (role) {
      case "ROLE_ADMIN":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Shield className="w-3.5 h-3.5" />
            ADMINISTRATOR
          </span>
        );
      case "ROLE_MANAGER":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            DEPARTMENT HEAD
          </span>
        );
      case "ROLE_TECH":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
            BIOMEDICAL TECHNICIAN
          </span>
        );
      default:
        return null;
    }
  };

  const columns: ColumnDef<UserProfile>[] = [
    {
      header: "User",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-bold shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-white group-hover:text-teal-400 transition">
              {item.fullName}
            </p>
            <p className="text-xs text-slate-400 font-mono">@{item.username}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      cell: (item) => (
        <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>{item.department}</span>
        </div>
      ),
    },
    {
      header: "System Role",
      cell: (item) => getRoleBadge(item.role),
    },
    {
      header: "Registration Date",
      cell: (item) => (
        <span className="text-xs text-slate-400">
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("en-US")
            : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      searchKey="fullName"
      searchPlaceholder="Search user by name..."
      emptyMessage="No users registered in system"
    />
  );
};