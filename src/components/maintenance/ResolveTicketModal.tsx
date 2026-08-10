import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { X, CheckCircle2 } from "lucide-react";
import { ResolveTicketSchema } from "../../types";
import type { ResolveTicketFormData } from "../../types";
import ErrorMessage from "../ErrorMessage";

interface ResolveTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResolveTicketFormData) => void;
  ticketId?: number;
  isLoading?: boolean;
}

export default function ResolveTicketModal({
  isOpen,
  onClose,
  onSubmit,
  ticketId,
  isLoading = false,
}: ResolveTicketModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResolveTicketFormData>({
    resolver: zodResolver(ResolveTicketSchema),
    defaultValues: {
      technicalNotes: "",
    },
  });

  const handleInvalid = (fieldErrors: any) => {
    if (fieldErrors.technicalNotes?.message) {
      toast.error(fieldErrors.technicalNotes.message);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      reset({ technicalNotes: "" });
    }
  }, [isOpen, reset]);

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
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-bold text-white">
                        Resolve Maintenance Ticket
                      </Dialog.Title>
                      <p className="text-xs text-slate-400">
                        Ticket #{ticketId} - Enter technical notes to restore
                        equipment status to ACTIVE
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
                <form
                  onSubmit={handleSubmit(onSubmit, handleInvalid)}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Technical Resolution Notes
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe the replacement parts, calibration, testing results, and repair actions taken..."
                      {...register("technicalNotes")}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                    {errors.technicalNotes && (
                      <ErrorMessage>
                        {errors.technicalNotes.message}
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
                      className="px-5 py-2.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Resolving...</span>
                        </>
                      ) : (
                        <span>Mark as Resolved</span>
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
