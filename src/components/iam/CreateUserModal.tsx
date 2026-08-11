import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { X, UserPlus, Shield, User, Lock, Building2 } from "lucide-react";
import { SignUpSchema, type SignUpFormData } from "../../types";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SignUpFormData) => void;
  isLoading?: boolean;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
      department: "Radiología",
      role: "ROLE_TECH",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        fullName: "",
        username: "",
        password: "",
        department: "Radiología",
        role: "ROLE_TECH",
      });
    }
  }, [isOpen, reset]);

  const handleInvalid = (fieldErrors: any) => {
    const firstErrorKey = Object.keys(fieldErrors)[0];
    if (firstErrorKey && fieldErrors[firstErrorKey]?.message) {
      toast.error(fieldErrors[firstErrorKey].message);
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
              <Dialog.Panel className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-bold text-white">
                        Register New Staff Account
                      </Dialog.Title>
                      <p className="text-xs text-slate-400">
                        Create user credentials and assign system role
                        permissions.
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

                {/* Form */}
                <form
                  onSubmit={handleSubmit(onSubmit, handleInvalid)}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Dr. Carlos Mendoza"
                        {...register("fullName")}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-rose-400 mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <span className="text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm">
                        @
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. cmendoza"
                        {...register("username")}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
                      />
                    </div>
                    {errors.username && (
                      <p className="text-xs text-rose-400 mt-1">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Initial Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...register("password")}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-xs text-rose-400 mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Department & Role Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Department */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Department
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. Radiología"
                          {...register("department")}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
                        />
                      </div>
                      {errors.department && (
                        <p className="text-xs text-rose-400 mt-1">
                          {errors.department.message}
                        </p>
                      )}
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        System Role
                      </label>
                      <div className="relative">
                        <Shield className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <select
                          {...register("role")}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition cursor-pointer appearance-none"
                        >
                          <option value="ROLE_TECH">
                            Biomedical Technician
                          </option>
                          <option value="ROLE_MANAGER">
                            Department Head (Manager)
                          </option>
                          <option value="ROLE_ADMIN">Administrator</option>
                        </select>
                      </div>
                      {errors.role && (
                        <p className="text-xs text-rose-400 mt-1">
                          {errors.role.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-5 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-5 py-2.5 rounded-xl bg-linear-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold text-xs transition shadow-lg shadow-teal-500/20 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? "Creating User..." : "Create Staff Account"}
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
