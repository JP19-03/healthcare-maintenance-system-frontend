import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Plus,
  Stethoscope,
  AlertTriangle,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { equipmentService } from "../../services/equipmentService";
import type { CreateEquipmentFormData, Equipment } from "../../types";
import { EquipmentTable } from "../../components/inventory/EquipmentTable";
import { EquipmentFormModal } from "../../components/inventory/EquipmentFormModal";

export default function EquipmentView() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null,
  );
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<string>("ALL");

  // Fetch all equipment
  const { data: equipmentList = [], isLoading } = useQuery({
    queryKey: ["equipment"],
    queryFn: equipmentService.getAllEquipment,
  });

  // Create Equipment Mutation
  const createMutation = useMutation({
    mutationFn: equipmentService.createEquipment,
    onSuccess: () => {
      toast.success("Equipment registered successfully");
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Error registering equipment",
      );
    },
  });

  // Update Equipment Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateEquipmentFormData }) =>
      equipmentService.updateEquipment(id, data),
    onSuccess: () => {
      toast.success("Equipment updated successfully");
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      setIsModalOpen(false);
      setSelectedEquipment(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error updating equipment");
    },
  });

  // Soft Delete Equipment Mutation
  const deleteMutation = useMutation({
    mutationFn: equipmentService.deleteEquipment,
    onSuccess: () => {
      toast.success("Equipment removed from inventory");
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error deleting equipment");
    },
  });

  const handleCreateOrUpdate = (formData: CreateEquipmentFormData) => {
    if (selectedEquipment) {
      updateMutation.mutate({ id: selectedEquipment.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleReportBreakdown = (equipment: Equipment) => {
    toast.info(`Starting breakdown report for ${equipment.name}...`);
    // Will link to Ticket creation modal in Maintenance context
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this equipment from inventory?",
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  // Filtered Equipment List by Status Tab
  const filteredEquipment = equipmentList.filter((item) => {
    if (selectedStatusFilter === "ALL") return true;
    return item.status === selectedStatusFilter;
  });

  // Metrics Counters
  const totalCount = equipmentList.length;
  const activeCount = equipmentList.filter((e) => e.status === "ACTIVE").length;
  const brokenCount = equipmentList.filter((e) => e.status === "BROKEN").length;
  const maintenanceCount = equipmentList.filter(
    (e) => e.status === "IN_MAINTENANCE",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-teal-400" />
            Medical Equipment Inventory
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time management and tracking of hospital machinery status.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedEquipment(null);
            setIsModalOpen(true);
          }}
          className="bg-linear-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-teal-500/20 transition cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Register New Equipment</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Equipment
            </span>
            <Stethoscope className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-3xl font-black text-white">{totalCount}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Operational
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{activeCount}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Broken
            </span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-3xl font-black text-rose-400">{brokenCount}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              In Maintenance
            </span>
            <Wrench className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">
            {maintenanceCount}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { key: "ALL", label: "All", count: totalCount },
          { key: "ACTIVE", label: "Operational", count: activeCount },
          { key: "BROKEN", label: "Broken", count: brokenCount },
          {
            key: "IN_MAINTENANCE",
            label: "In Maintenance",
            count: maintenanceCount,
          },
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

      {/* Equipment Table */}
      <EquipmentTable
        data={filteredEquipment}
        isLoading={isLoading}
        onEdit={handleEdit}
        onReportBreakdown={handleReportBreakdown}
        onDelete={handleDelete}
      />

      {/* Register/Edit Equipment Form Modal */}
      <EquipmentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEquipment(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={selectedEquipment}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
