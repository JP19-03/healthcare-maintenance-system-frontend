import React from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  MoreVertical,
  Edit2,
  AlertTriangle,
  Trash2,
  MapPin,
  Building2,
} from "lucide-react";
import type { Equipment } from "../../types";
import DataTable from "../common/DataTable";
import type { ColumnDef } from "../common/DataTable";

interface EquipmentTableProps {
  data: Equipment[];
  isLoading?: boolean;
  onEdit: (equipment: Equipment) => void;
  onReportBreakdown: (equipment: Equipment) => void;
  onDelete: (equipmentId: number) => void;
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  data,
  isLoading = false,
  onEdit,
  onReportBreakdown,
  onDelete,
}) => {
  const getStatusBadge = (status: Equipment["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Operational
          </span>
        );
      case "BROKEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            Broken
          </span>
        );
      case "IN_MAINTENANCE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            In Maintenance
          </span>
        );
      default:
        return null;
    }
  };

  const columns: ColumnDef<Equipment>[] = [
    {
      header: "Equipment & Model",
      cell: (item) => (
        <div>
          <p className="font-bold text-white group-hover:text-teal-400 transition">
            {item.name}
          </p>
          <p className="text-xs text-slate-400 font-medium">
            Mod: {item.model}
          </p>
        </div>
      ),
    },
    {
      header: "Serial No.",
      cell: (item) => (
        <span className="font-mono text-xs text-teal-300 font-semibold bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-lg">
          {item.serialNumber}
        </span>
      ),
    },
    {
      header: "Department / Location",
      cell: (item) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{item.department}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{item.location}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Operational Status",
      cell: (item) => getStatusBadge(item.status),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => (
        <div className="flex justify-end">
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="p-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </Menu.Button>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 top-full mt-1 w-48 origin-top-right rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 focus:outline-none z-50">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onEdit(item)}
                      className={`${
                        active ? "bg-slate-800 text-teal-400" : "text-slate-300"
                      } flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded-lg transition cursor-pointer`}
                    >
                      <Edit2 className="w-3.5 h-3.5 text-teal-400" />
                      <span>Edit Equipment</span>
                    </button>
                  )}
                </Menu.Item>

                {item.status !== "BROKEN" && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onReportBreakdown(item)}
                        className={`${
                          active
                            ? "bg-rose-500/10 text-rose-400"
                            : "text-rose-400"
                        } flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded-lg transition cursor-pointer`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Report Breakdown</span>
                      </button>
                    )}
                  </Menu.Item>
                )}

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onDelete(item.id)}
                      className={`${
                        active
                          ? "bg-red-500/10 text-red-400"
                          : "text-slate-400 hover:text-red-400"
                      } flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded-lg transition cursor-pointer border-t border-slate-800/80 mt-1 pt-2`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Equipment</span>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      searchKey="name"
      searchPlaceholder="Search by equipment name or model..."
      emptyMessage="No equipment registered in inventory"
    />
  );
};
