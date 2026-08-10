import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  ClipboardList,
  Plus,
  AlertTriangle,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { ticketService } from "../../services/ticketService";
import { equipmentService } from "../../services/equipmentService";
import { userService } from "../../services/userService";
import type {
  AssignTechnicianFormData,
  CreateTicketFormData,
  ResolveTicketFormData,
  Ticket,
} from "../../types";
import TicketTable from "../../components/maintenance/TicketTable";
import CreateTicketModal from "../../components/maintenance/CreateTicketModal";
import AssignTechModal from "../../components/maintenance/AssignTechModal";
import ResolveTicketModal from "../../components/maintenance/ResolveTicketModal";
import { useAuth } from "../../context/AuthContext";

export default function TicketsView() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<string>("ALL");

  // Fetch all tickets
  const { data: ticketList = [], isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: ticketService.getAllTickets,
  });

  // Fetch equipment list for dropdown
  const { data: equipmentList = [] } = useQuery({
    queryKey: ["equipment"],
    queryFn: equipmentService.getAllEquipment,
  });

  // Fetch technicians list
  const { data: userList = [] } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAllUsers,
  });
  const techList = userList.filter(
    (u) => u.role === "ROLE_TECH" || u.role === "ROLE_ADMIN",
  );

  // Create Ticket Mutation
  const createMutation = useMutation({
    mutationFn: ticketService.createTicket,
    onSuccess: () => {
      toast.success(
        "Work order created successfully! Equipment marked as BROKEN.",
      );
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create work order",
      );
    },
  });

  // Assign Technician Mutation
  const assignMutation = useMutation({
    mutationFn: ({
      ticketId,
      data,
    }: {
      ticketId: number;
      data: AssignTechnicianFormData;
    }) => ticketService.assignTechnician(ticketId, data),
    onSuccess: () => {
      toast.success("Technician assigned! Equipment marked as IN_MAINTENANCE.");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      setIsAssignModalOpen(false);
      setSelectedTicket(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to assign technician",
      );
    },
  });

  // Resolve Ticket Mutation
  const resolveMutation = useMutation({
    mutationFn: ({
      ticketId,
      data,
    }: {
      ticketId: number;
      data: ResolveTicketFormData;
    }) => ticketService.resolveTicket(ticketId, data),
    onSuccess: () => {
      toast.success("Ticket marked as RESOLVED! Equipment restored to ACTIVE.");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      setIsResolveModalOpen(false);
      setSelectedTicket(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resolve ticket");
    },
  });

  // Close Ticket Mutation
  const closeMutation = useMutation({
    mutationFn: ticketService.closeTicket,
    onSuccess: () => {
      toast.success("Ticket closed successfully");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to close ticket");
    },
  });

  const handleCreateTicket = (formData: CreateTicketFormData) => {
    createMutation.mutate({
      ...formData,
      reportedByUserId: user?.id || 1,
    });
  };

  const handleAssignTech = (formData: AssignTechnicianFormData) => {
    if (selectedTicket) {
      assignMutation.mutate({ ticketId: selectedTicket.id, data: formData });
    }
  };

  const handleResolveTicket = (formData: ResolveTicketFormData) => {
    if (selectedTicket) {
      resolveMutation.mutate({ ticketId: selectedTicket.id, data: formData });
    }
  };

  const handleOpenAssignModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsAssignModalOpen(true);
  };

  const handleOpenResolveModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsResolveModalOpen(true);
  };

  const handleCloseTicket = (ticketId: number) => {
    if (window.confirm("Are you sure you want to close this ticket?")) {
      closeMutation.mutate(ticketId);
    }
  };

  // Filtered tickets
  const filteredTickets = ticketList.filter((ticket) => {
    if (selectedStatusFilter === "ALL") return true;
    return ticket.status === selectedStatusFilter;
  });

  // KPI counters
  const totalCount = ticketList.length;
  const openCount = ticketList.filter((t) => t.status === "OPEN").length;
  const progressCount = ticketList.filter(
    (t) => t.status === "IN_PROGRESS",
  ).length;
  const resolvedCount = ticketList.filter(
    (t) => t.status === "RESOLVED",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-teal-400" />
            Maintenance Work Orders
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track equipment breakdown reports, assignments, and resolution
            statuses.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-linear-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-rose-500/20 transition cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Report Breakdown</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Work Orders
            </span>
            <ClipboardList className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-3xl font-black text-white">{totalCount}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Open / Pending
            </span>
            <AlertTriangle className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-blue-400">{openCount}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              In Repair
            </span>
            <Wrench className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">{progressCount}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Resolved
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">
            {resolvedCount}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { key: "ALL", label: "All Work Orders", count: totalCount },
          { key: "OPEN", label: "Open", count: openCount },
          { key: "IN_PROGRESS", label: "In Progress", count: progressCount },
          { key: "RESOLVED", label: "Resolved", count: resolvedCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              selectedStatusFilter === tab.key
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

      {/* Ticket Table */}
      <TicketTable
        data={filteredTickets}
        isLoading={isLoading}
        onAssignTech={handleOpenAssignModal}
        onResolve={handleOpenResolveModal}
        onCloseTicket={handleCloseTicket}
      />

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTicket}
        equipmentList={equipmentList}
        currentUserId={user?.id}
        isLoading={createMutation.isPending}
      />

      {/* Assign Tech Modal */}
      <AssignTechModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedTicket(null);
        }}
        onSubmit={handleAssignTech}
        technicians={techList}
        ticketId={selectedTicket?.id}
        isLoading={assignMutation.isPending}
      />

      {/* Resolve Ticket Modal */}
      <ResolveTicketModal
        isOpen={isResolveModalOpen}
        onClose={() => {
          setIsResolveModalOpen(false);
          setSelectedTicket(null);
        }}
        onSubmit={handleResolveTicket}
        ticketId={selectedTicket?.id}
        isLoading={resolveMutation.isPending}
      />
    </div>
  );
}
