import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  Clock,
  Building2,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { analyticsService } from "../services/analyticsService";
import { ticketService } from "../services/ticketService";
import { useAuth } from "../context/AuthContext";

export default function DashboardView() {
  const { user } = useAuth();

  // Fetch Live Analytics Dashboard Summary
  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["analytics-dashboard"],
    queryFn: analyticsService.getDashboardSummary,
  });

  // Fetch Recent Breakdown Tickets for Live Stream Feed
  const { data: tickets = [] } = useQuery({
    queryKey: ["tickets"],
    queryFn: ticketService.getAllTickets,
  });

  const activeBreakdowns = tickets.filter(
    (t) => t.status === "OPEN" || t.status === "IN_PROGRESS",
  );

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            CRITICAL
          </span>
        );
      case "HIGH":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
            HIGH
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            LOW
          </span>
        );
    }
  };

  const eqStats = summary?.equipmentStats;
  const tkStats = summary?.ticketStats;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-slate-900 via-slate-900/90 to-teal-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30 uppercase tracking-wider">
              System Overview
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-medium">
              Welcome back, <strong className="text-slate-200">{user?.fullName}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-7 h-7 sm:w-8 sm:h-8 text-teal-400" />
            Hospital Operations Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time equipment readiness metrics, ticket workloads, and technician analytics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/equipment"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-2 border border-slate-700"
          >
            <Stethoscope className="w-4 h-4 text-teal-400" />
            <span>Equipment Catalog</span>
          </Link>
          {(user?.role === "ROLE_ADMIN" || user?.role === "ROLE_MANAGER") && (
            <Link
              to="/tickets"
              className="px-4 py-2.5 rounded-xl bg-linear-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold text-xs transition shadow-lg shadow-teal-500/20 flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>Work Orders</span>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      {isSummaryLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Operational Readiness Rate */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                Operational Readiness
              </span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-emerald-400">
                {eqStats?.operationalRatePercentage || 0}%
              </p>
              <span className="text-xs text-slate-400 font-semibold flex items-center text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                Optimal
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {eqStats?.activeCount || 0} of {eqStats?.totalCount || 0} machines active
            </p>
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition" />
          </div>

          {/* Critical Failures & Urgent Alerts */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                Critical Breakdown Alerts
              </span>
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-rose-400">
                {tkStats?.criticalPriorityTickets || 0}
              </p>
              <span className="text-xs text-rose-400 font-semibold">Urgent Action</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {eqStats?.brokenCount || 0} machine(s) marked broken
            </p>
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition" />
          </div>

          {/* Mean Time To Resolution (MTTR) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                Avg Resolution (MTTR)
              </span>
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-cyan-400">
                {summary?.meanTimeToResolutionHours || 0} <span className="text-sm font-semibold">hrs</span>
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Average repair cycle duration
            </p>
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition" />
          </div>

          {/* Total Work Orders */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                Total Work Orders
              </span>
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-white">
                {tkStats?.totalTickets || 0}
              </p>
              <span className="text-xs text-amber-400 font-semibold">
                {tkStats?.inProgressTickets || 0} in repair
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {tkStats?.resolvedTickets || 0} resolved • {tkStats?.closedTickets || 0} closed
            </p>
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition" />
          </div>
        </div>
      )}

      {/* Analytics Main Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Department Distribution & Technician Workload */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equipment Distribution by Department */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-400" />
                  Equipment Distribution by Hospital Unit
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Machine count density across hospital departments.
                </p>
              </div>
              <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
                {summary?.equipmentByDepartment?.length || 0} Units
              </span>
            </div>

            {summary?.equipmentByDepartment?.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-6">
                No departmental data registered.
              </p>
            ) : (
              <div className="space-y-4">
                {summary?.equipmentByDepartment.map((item) => {
                  const maxCount = eqStats?.totalCount || 1;
                  const percentage = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item.department} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">
                          {item.department}
                        </span>
                        <span className="text-slate-400 font-mono">
                          {item.count} machine(s) ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Technician Productivity Matrix */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-cyan-400" />
                  Technician Repair Performance & Workload
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total tickets assigned vs successfully resolved per biomedical engineer.
                </p>
              </div>
            </div>

            {summary?.technicianPerformance?.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-6">
                No technicians registered in system.
              </p>
            ) : (
              <div className="space-y-4">
                {summary?.technicianPerformance.map((tech) => {
                  const completionRate =
                    tech.totalAssigned > 0
                      ? Math.round((tech.resolvedCount / tech.totalAssigned) * 100)
                      : 100;
                  return (
                    <div
                      key={tech.techUserId}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center text-sm shrink-0">
                          {tech.techName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {tech.techName}
                          </h4>
                          <p className="text-xs text-slate-400">
                            Assigned Work Orders: <strong className="text-slate-200">{tech.totalAssigned}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-400 block">
                            {tech.resolvedCount} Resolved
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {completionRate}% Completion
                          </span>
                        </div>
                        <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Active Breakdown Live Alert Stream */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Active Breakdown Stream
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                {activeBreakdowns.length} Active
              </span>
            </div>

            {activeBreakdowns.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs my-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-slate-300">All Systems Operational!</p>
                <p className="text-slate-500 mt-1">No open breakdowns currently reported.</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-120 pr-1">
                {activeBreakdowns.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-teal-400 font-bold text-xs">
                        #TK-{t.id}
                      </span>
                      {getPriorityBadge(t.priority)}
                    </div>
                    <p className="text-xs font-semibold text-slate-200 line-clamp-2">
                      {t.issueDescription}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>{t.equipmentName || `Equipment #${t.equipmentId}`}</span>
                      <span className="font-semibold text-amber-400">{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-800">
              <Link
                to="/tickets"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>Manage Work Orders</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}