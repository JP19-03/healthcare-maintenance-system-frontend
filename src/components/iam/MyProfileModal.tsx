import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { X, User, Building2, Shield, Calendar, Mail } from "lucide-react";
import { authService } from "../../services/authService";

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyProfileModal({
  isOpen,
  onClose,
}: MyProfileModalProps) {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: authService.getMyProfile,
    enabled: isOpen,
  });

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "ROLE_ADMIN":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Shield className="w-3.5 h-3.5" />
            ADMINISTRATOR
          </span>
        );
      case "ROLE_MANAGER":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            DEPARTMENT HEAD
          </span>
        );
      case "ROLE_TECH":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
            BIOMEDICAL TECHNICIAN
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
              <Dialog.Panel className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-bold text-white">
                        User Profile
                      </Dialog.Title>
                      <p className="text-xs text-slate-400">
                        My account credentials & role permissions
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

                {/* Profile Details */}
                {isLoading ? (
                  <div className="py-8 text-center text-slate-400 text-sm animate-pulse">
                    Loading profile information...
                  </div>
                ) : profile ? (
                  <div className="space-y-5">
                    {/* User Avatar Card */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="w-14 h-14 rounded-full bg-linear-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-teal-500/20 shrink-0">
                        {profile.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-white truncate">
                          {profile.fullName}
                        </h3>
                        <p className="text-xs font-mono text-teal-400 truncate">
                          @{profile.username}
                        </p>
                        <div className="mt-1.5">
                          {getRoleBadge(profile.role)}
                        </div>
                      </div>
                    </div>

                    {/* Metadata Specs */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                          <Building2 className="w-4 h-4 text-teal-400" />
                          <span>Department</span>
                        </div>
                        <span className="font-semibold text-slate-200 text-xs">
                          {profile.department}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                          <Mail className="w-4 h-4 text-cyan-400" />
                          <span>System Access</span>
                        </div>
                        <span className="font-semibold text-slate-200 text-xs">
                          Active JWT Session
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span>Member Since</span>
                        </div>
                        <span className="font-semibold text-slate-200 text-xs">
                          {profile.createdAt
                            ? new Date(profile.createdAt).toLocaleDateString(
                                "en-US",
                              )
                            : "Active"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-rose-400 text-sm">
                    Failed to load profile details.
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex items-center justify-end border-t border-slate-800 pt-5 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                  >
                    Close Profile
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
