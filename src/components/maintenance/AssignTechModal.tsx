import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Wrench } from "lucide-react";
import { AssignTechnicianSchema } from "../../types";
import type { AssignTechnicianFormData, UserProfile } from "../../types";
import ErrorMessage from "../ErrorMessage";

interface AssignTechModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssignTechnicianFormData) => void;
  technicians: UserProfile[];
  ticketId?: number;
  isLoading?: boolean;
}

export default function AssignTechModal({
  isOpen,
  onClose,
  onSubmit,
  technicians,
  ticketId,
  isLoading = false,
}: AssignTechModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignTechnicianFormData>({
    resolver: zodResolver(AssignTechnicianSchema),
    defaultValues: {
      assignedTechUserId: 0,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        assignedTechUserId: technicians[0]?.id || 0,
      });
    }
  }, [isOpen, technicians, reset]);

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
              <Dialog.Panel className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-bold text-white">
                        Assign Biomedical Technician
                      </Dialog.Title>
                      <p className="text-xs text-slate-400">
                        Ticket #{ticketId} - Assign a specialist to inspect and
                        repair
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
                      Select Technician
                    </label>
                    <select
                      {...register("assignedTechUserId", {
                        valueAsNumber: true,
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    >
                      {technicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.fullName} (@{tech.username}) - {tech.department}
                        </option>
                      ))}
                    </select>
                    {errors.assignedTechUserId && (
                      <ErrorMessage>
                        {errors.assignedTechUserId.message}
                      </ErrorMessage>
                    )}
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
                      className="px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white text-sm font-bold shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Assigning...</span>
                        </>
                      ) : (
                        <span>Assign Work Order</span>
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
