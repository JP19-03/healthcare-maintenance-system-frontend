import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { MoreVertical, Wrench, CheckCircle2, CheckSquare } from "lucide-react";
import type { Ticket } from "../../types";
import DataTable from "../common/DataTable";
import type { ColumnDef } from "../common/DataTable";

interface TicketTableProps {
  data: Ticket[];
  isLoading?: boolean;
  onAssignTech?: (ticket: Ticket) => void;
  onResolve?: (ticket: Ticket) => void;
  onCloseTicket?: (ticketId: number) => void;
}

export default function TicketTable({
  data,
  isLoading = false,
  onAssignTech,
  onResolve,
  onCloseTicket,
}: TicketTableProps) {
  const getPriorityBadge = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            CRITICAL
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
            HIGH
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            MEDIUM
          </span>
        );
      case "LOW":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            LOW
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            OPEN
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            IN PROGRESS
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            RESOLVED
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            CLOSED
          </span>
        );
      default:
        return null;
    }
  };

  const columns: ColumnDef<Ticket>[] = [
    {
      header: "Ticket ID",
      cell: (item) => (
        <span className="font-mono text-xs text-teal-300 font-bold bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-lg">
          #TK-{item.id}
        </span>
      ),
    },
    {
      header: "Equipment",
      cell: (item) => (
        <div className="space-y-0.5">
          <p className="font-bold text-white group-hover:text-teal-400 transition">
            {item.equipmentName || `Equipment #${item.equipmentId}`}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            ID: #{item.equipmentId}
          </p>
        </div>
      ),
    },
    {
      header: "Issue Description",
      cell: (item) => (
        <div className="max-w-xs">
          <p className="text-xs text-slate-300 line-clamp-2">
            {item.issueDescription}
          </p>
          {item.technicalNotes && (
            <p className="text-[11px] text-emerald-400 mt-1 truncate">
              <strong>Notes:</strong> {item.technicalNotes}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Priority",
      cell: (item) => getPriorityBadge(item.priority),
    },
    {
      header: "Status",
      cell: (item) => getStatusBadge(item.status),
    },
    {
      header: "Assigned Tech",
      cell: (item) => (
        <span className="text-xs font-medium text-slate-300">
          {item.assignedTechUserName ||
            (item.assignedTechUserId
              ? `Tech #${item.assignedTechUserId}`
              : "Unassigned")}
        </span>
      ),
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
              <Menu.Items className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-48 origin-right rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 focus:outline-none z-50">
                {onAssignTech &&
                  (item.status === "OPEN" || item.status === "IN_PROGRESS") && (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onAssignTech(item)}
                          className={`${
                            active
                              ? "bg-amber-500/10 text-amber-400"
                              : "text-amber-400"
                          } flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded-lg transition cursor-pointer`}
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>
                            {item.status === "IN_PROGRESS"
                              ? "Reassign Tech"
                              : "Assign Technician"}
                          </span>
                        </button>
                      )}
                    </Menu.Item>
                  )}

                {onResolve &&
                  (item.status === "IN_PROGRESS" || item.status === "OPEN") && (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onResolve(item)}
                          className={`${
                            active
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "text-emerald-400"
                          } flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded-lg transition cursor-pointer`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Resolve Ticket</span>
                        </button>
                      )}
                    </Menu.Item>
                  )}

                {onCloseTicket && item.status === "RESOLVED" && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onCloseTicket(item.id)}
                        className={`${
                          active
                            ? "bg-slate-800 text-slate-300"
                            : "text-slate-400"
                        } flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded-lg transition cursor-pointer`}
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Close Ticket</span>
                      </button>
                    )}
                  </Menu.Item>
                )}
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
      searchKey="issueDescription"
      searchPlaceholder="Search work orders by issue description..."
      emptyMessage="No maintenance work orders found"
    />
  );
}
