import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Wrench, CheckCircle2, AlertTriangle } from "lucide-react";
import { ticketService } from "../../services/ticketService";
import type { ResolveTicketFormData, Ticket } from "../../types";
import TicketTable from "../../components/maintenance/TicketTable";
import ResolveTicketModal from "../../components/maintenance/ResolveTicketModal";
import { useAuth } from "../../context/AuthContext";

export default function MyQueueView() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const techUserId = user?.id || 1;

  // Fetch tickets assigned to this technician
  const { data: ticketList = [], isLoading } = useQuery({
    queryKey: ["my-queue", techUserId],
    queryFn: () => ticketService.getTicketsByTechId(techUserId),
    enabled: !!techUserId,
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
      queryClient.invalidateQueries({ queryKey: ["my-queue"] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      setIsResolveModalOpen(false);
      setSelectedTicket(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to resolve ticket");
    },
  });

  const handleResolveSubmit = (formData: ResolveTicketFormData) => {
    if (selectedTicket) {
      resolveMutation.mutate({ ticketId: selectedTicket.id, data: formData });
    }
  };

  const handleOpenResolveModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsResolveModalOpen(true);
  };

  // Stats Counters
  const totalCount = ticketList.length;
  const inProgressCount = ticketList.filter(
    (t) => t.status === "IN_PROGRESS" || t.status === "OPEN",
  ).length;
  const resolvedCount = ticketList.filter(
    (t) => t.status === "RESOLVED" || t.status === "CLOSED",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Wrench className="w-8 h-8 text-teal-400" />
            My Work Queue
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Work orders assigned to{" "}
            <span className="font-semibold text-teal-400">
              {user?.fullName}
            </span>
            . Perform repairs and enter resolution notes.
          </p>
        </div>
      </div>

      {/* Stats KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Assigned Tickets
            </span>
            <Wrench className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-3xl font-black text-white">{totalCount}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Active Repairs
            </span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">
            {inProgressCount}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Completed Repairs
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">
            {resolvedCount}
          </p>
        </div>
      </div>

      {/* Work Orders Table */}
      <TicketTable
        data={ticketList}
        isLoading={isLoading}
        onResolve={handleOpenResolveModal}
      />

      {/* Resolve Ticket Modal */}
      <ResolveTicketModal
        isOpen={isResolveModalOpen}
        onClose={() => {
          setIsResolveModalOpen(false);
          setSelectedTicket(null);
        }}
        onSubmit={handleResolveSubmit}
        ticketId={selectedTicket?.id}
        isLoading={resolveMutation.isPending}
      />
    </div>
  );
}
