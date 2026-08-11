import React, { useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Stethoscope } from "lucide-react";
import { CreateEquipmentSchema } from "../../types";
import type { CreateEquipmentFormData, Equipment } from "../../types";
import ErrorMessage from "../ErrorMessage";

interface EquipmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEquipmentFormData) => void;
  initialData?: Equipment | null;
  isLoading?: boolean;
}

export const EquipmentFormModal: React.FC<EquipmentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEquipmentFormData>({
    resolver: zodResolver(CreateEquipmentSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      model: "",
      location: "",
      department: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        serialNumber: initialData.serialNumber,
        model: initialData.model,
        location: initialData.location,
        department: initialData.department,
      });
    } else {
      reset({
        name: "",
        serialNumber: "",
        model: "",
        location: "",
        department: "",
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data: CreateEquipmentFormData) => {
    onSubmit(data);
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
              <Dialog.Panel className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-bold text-white">
                        {isEditing
                          ? "Edit Medical Equipment"
                          : "Register New Equipment"}
                      </Dialog.Title>
                      <p className="text-xs text-slate-400">
                        {isEditing
                          ? "Modify the selected equipment details"
                          : "Enter details to add a new equipment to inventory"}
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
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Equipment Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3T MRI Scanner"
                      {...register("name")}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                    {errors.name && (
                      <ErrorMessage>{errors.name.message}</ErrorMessage>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Serial Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SN-MRI-902"
                        {...register("serialNumber")}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition font-mono"
                      />
                      {errors.serialNumber && (
                        <ErrorMessage>
                          {errors.serialNumber.message}
                        </ErrorMessage>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Model
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Magnetom Vida"
                        {...register("model")}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      />
                      {errors.model && (
                        <ErrorMessage>{errors.model.message}</ErrorMessage>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Department
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Radiology"
                        {...register("department")}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      />
                      {errors.department && (
                        <ErrorMessage>{errors.department.message}</ErrorMessage>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Location / Room
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Room 302"
                        {...register("location")}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      />
                      {errors.location && (
                        <ErrorMessage>{errors.location.message}</ErrorMessage>
                      )}
                    </div>
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
                      className="px-5 py-2.5 rounded-xl bg-linear-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white text-sm font-bold shadow-lg shadow-teal-500/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>
                          {isEditing ? "Save Changes" : "Register Equipment"}
                        </span>
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
};
