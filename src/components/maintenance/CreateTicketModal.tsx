import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, AlertTriangle } from "lucide-react";
import { CreateTicketSchema } from "../../types";
import type { CreateTicketFormData, Equipment } from "../../types";
import ErrorMessage from "../ErrorMessage";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTicketFormData) => void;
  equipmentList: Equipment[];
  preSelectedEquipmentId?: number;
  currentUserId?: number;
  isLoading?: boolean;
}

export default function CreateTicketModal({
  isOpen,
  onClose,
  onSubmit,
  equipmentList,
  preSelectedEquipmentId,
  currentUserId = 1,
  isLoading = false,
}: CreateTicketModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(CreateTicketSchema),
    defaultValues: {
      equipmentId: preSelectedEquipmentId || 0,
      reportedByUserId: currentUserId,
      issueDescription: "",
      photoUrl: "",
      priority: "MEDIUM",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        equipmentId: preSelectedEquipmentId || equipmentList[0]?.id || 0,
        reportedByUserId: currentUserId,
        issueDescription: "",
        photoUrl: "",
        priority: "MEDIUM",
      });
    }
  }, [isOpen, equipmentList, preSelectedEquipmentId, currentUserId, reset]);

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
              <Dialog.Panel className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-bold text-white">
                        Report Equipment Breakdown
                      </Dialog.Title>
                      <p className="text-xs text-slate-400">
                        Create a maintenance work order ticket to alert
                        biomedical staff
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Select Medical Equipment
                    </label>
                    <select
                      {...register("equipmentId", { valueAsNumber: true })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    >
                      {equipmentList.map((eq) => (
                        <option key={eq.id} value={eq.id}>
                          {eq.name} ({eq.serialNumber}) - {eq.department}
                        </option>
                      ))}
                    </select>
                    {errors.equipmentId && (
                      <ErrorMessage>{errors.equipmentId.message}</ErrorMessage>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Priority Level
                    </label>
                    <select
                      {...register("priority")}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                    {errors.priority && (
                      <ErrorMessage>{errors.priority.message}</ErrorMessage>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Issue Description & Symptoms
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the malfunction, error codes, or abnormal noise..."
                      {...register("issueDescription")}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                    {errors.issueDescription && (
                      <ErrorMessage>
                        {errors.issueDescription.message}
                      </ErrorMessage>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Photo / Image Attachment URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://storage.hospital.com/photos/error-photo.jpg"
                      {...register("photoUrl")}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-5 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-5 py-2.5 rounded-xl bg-linear-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white text-sm font-bold shadow-lg shadow-rose-500/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Work Order</span>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
