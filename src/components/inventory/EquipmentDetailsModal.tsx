import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { X, Stethoscope, Building2, MapPin, ClipboardList } from "lucide-react";
import { equipmentService } from "../../services/equipmentService";
import { ticketService } from "../../services/ticketService";
import type { Ticket } from "../../types";

interface EquipmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId?: number | null;
}

export default function EquipmentDetailsModal({
  isOpen,
  onClose,
  equipmentId,
}: EquipmentDetailsModalProps) {
  // Fetch Equipment Specs by ID
  const { data: equipment, isLoading: isEquipmentLoading } = useQuery({
    queryKey: ["equipment-detail", equipmentId],
    queryFn: () => equipmentService.getEquipmentById(equipmentId!),
    enabled: isOpen && !!equipmentId,
  });

  // Fetch Maintenance Ticket History by Equipment ID
  const { data: ticketHistory = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ["equipment-history", equipmentId],
    queryFn: () => ticketService.getTicketsByEquipmentId(equipmentId!),
    enabled: isOpen && !!equipmentId,
  });

  const getStatusBadge = (status?: string) => {
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
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
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

  const getPriorityBadge = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/40">
            CRITICAL
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
            HIGH
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            MEDIUM
          </span>
        );
      case "LOW":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            LOW
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-bold text-white">
                        {equipment?.name || "Equipment Maintenance History"}
                      </Dialog.Title>
                      <p className="text-xs text-slate-400 font-mono">
                        Serial: {equipment?.serialNumber || "Loading..."}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {isEquipmentLoading ? (
                  <div className="py-8 text-center text-slate-400 text-sm animate-pulse">
                    Loading machine specs...
                  </div>
                ) : equipment ? (
                  <div className="space-y-6">
                    {/* Machine Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Model
                        </span>
                        <p className="text-sm font-semibold text-white">
                          {equipment.model}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Department & Location
                        </span>
                        <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{equipment.department}</span>
                          <span className="text-slate-500">•</span>
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{equipment.location}</span>
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                          Current Status
                        </span>
                        {getStatusBadge(equipment.status)}
                      </div>
                    </div>

                    {/* Ticket Maintenance History Header */}
                    <div>
                      <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-teal-400" />
                        <span>
                          Maintenance Work Orders History (
                          {ticketHistory.length})
                        </span>
                      </h4>

                      {isHistoryLoading ? (
                        <div className="py-6 text-center text-slate-400 text-xs animate-pulse">
                          Fetching maintenance ticket history...
                        </div>
                      ) : ticketHistory.length === 0 ? (
                        <div className="p-6 rounded-xl bg-slate-950/40 border border-slate-800/60 text-center text-slate-400 text-xs">
                          No maintenance breakdowns or work orders reported for
                          this equipment.
                        </div>
                      ) : (
                        <div className="border border-slate-800 rounded-xl overflow-x-auto max-h-60 overflow-y-auto">
                          <table className="w-full text-left text-xs min-w-137.5">
                            <thead className="bg-slate-950/80 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-800 sticky top-0 backdrop-blur-md">
                              <tr>
                                <th className="px-3 py-2">Ticket ID</th>
                                <th className="px-3 py-2">Issue Description</th>
                                <th className="px-3 py-2">Tech Notes</th>
                                <th className="px-3 py-2">Priority</th>
                                <th className="px-3 py-2">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-slate-300">
                              {ticketHistory.map((t) => (
                                <tr
                                  key={t.id}
                                  className="hover:bg-slate-800/40"
                                >
                                  <td className="px-3 py-2.5 font-mono text-teal-400 font-bold whitespace-nowrap">
                                    #TK-{t.id}
                                  </td>
                                  <td className="px-3 py-2.5 max-w-xs truncate">
                                    {t.issueDescription}
                                  </td>
                                  <td className="px-3 py-2.5 max-w-xs truncate text-emerald-400">
                                    {t.technicalNotes || "-"}
                                  </td>
                                  <td className="px-3 py-2.5 whitespace-nowrap">
                                    {getPriorityBadge(t.priority)}
                                  </td>
                                  <td className="px-3 py-2.5 whitespace-nowrap">
                                    <span className="font-semibold text-slate-200">
                                      {t.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Footer */}
                <div className="flex items-center justify-end border-t border-slate-800 pt-5 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
