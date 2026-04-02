import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import { CreateRunPanel, type RunFormData } from "..";
import { createRun, completeRun, type RunStatus } from "../../../services/run";
import { useRuns } from "../hooks/index.ts";
import { useOrders } from "../../orders/hooks/useOrders";
import { getDecodedToken } from "../../../services/auth";
import { confirmToast } from "../../../components/toast/confirmToast";
import { toast } from "sonner";
import { getStatusMeta } from "../../dashboard/utils/runStatusMeta";

const STATUS_RANK: Record<RunStatus, number> = {
  IN_PROGRESS: 0,
  OPEN: 1,
  CLOSED: 3,
  COMPLETED: 4,
};

const parseNumericParam = (value?: string) => {
  if (value === undefined) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const toDateTimeLocalValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatDeadlineLabel = (deadline?: Date) => {
  if (!deadline || Number.isNaN(deadline.getTime())) {
    return "Closes soon";
  }
  return deadline.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

function Runs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { runId: runIdParam } = useParams<{ runId?: string }>();
  const routeRunId = parseNumericParam(runIdParam);
  const { enrichedRuns, refetch } = useRuns();
  const { orders } = useOrders();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const isEditingRoute = routeRunId !== undefined;
  const orderedRunIds = useMemo(
    () => new Set(orders.map((order) => order.foodRun)),
    [orders],
  );

  const sortedRuns = useMemo(() => {
    return [...enrichedRuns].sort((a, b) => {
      const scoreA = STATUS_RANK[a.status];
      const scoreB = STATUS_RANK[b.status];
      if (scoreA !== scoreB) {
        return scoreA - scoreB;
      }
      const timeA = a.deadline ? new Date(a.deadline).getTime() : 0;
      const timeB = b.deadline ? new Date(b.deadline).getTime() : 0;
      return timeB - timeA;
    });
  }, [enrichedRuns]);

  const activeRun =
    routeRunId !== undefined
      ? enrichedRuns.find((run) => run.id === routeRunId)
      : undefined;
  const currentUserId = useMemo(() => {
    try {
      return getDecodedToken().user_id;
    } catch {
      return null;
    }
  }, []);
  const canCompleteRun =
    Boolean(activeRun) &&
    Number(activeRun?.organizerId) === Number(currentUserId) &&
    activeRun?.status !== "COMPLETED";

  useEffect(() => {
    if (isEditingRoute) {
      setIsCreateOpen(false);
    }
  }, [isEditingRoute]);

  useEffect(() => {
    if (isEditingRoute) {
      return;
    }
    const state = location.state as { openCreate?: boolean } | null;
    if (state?.openCreate) {
      setIsCreateOpen(true);
      navigate("/runs", { replace: true, state: {} });
    }
  }, [isEditingRoute, location.state, navigate]);

  useEffect(() => {
    if (routeRunId !== undefined && enrichedRuns.length > 0 && !activeRun) {
      navigate("/runs", { replace: true });
    }
  }, [activeRun, navigate, routeRunId, enrichedRuns]);

  const handleSubmitRun = async (payload: RunFormData) => {
    const createdRun = await createRun({
      name: payload.name,
      description: "",
      restaurant_id: payload.restaurantId,
      deadline: payload.deadline,
      status: "OPEN",
    });

    if (!createdRun.id) throw new Error("Created run is missing an id");

    toast.success("Run created successfully!");
    navigate("/runs");
  };

  const handleOpenCreatePanel = () => {
    setIsCreateOpen(true);
  };

  const handleOpenEditPanel = (runId: number) => {
    navigate(`/runs/${runId}`);
  };

  const handleClosePanel = () => {
    if (isEditingRoute) {
      navigate("/runs");
      return;
    }
    setIsCreateOpen(false);
  };

  const handleCompleteRun = async () => {
    if (!activeRun || !canCompleteRun) {
      return;
    }

    const confirmed = await confirmToast({
      title: "Complete this run?",
      description:
        "This will mark the run as completed for everyone in this food run.",
      confirmLabel: "Complete run",
      cancelLabel: "Cancel",
    });

    if (!confirmed) {
      return;
    }

    setIsCompleting(true);
    try {
      await completeRun(activeRun.id);
      await refetch();
      toast.success("Run marked as completed.");
      navigate("/runs", { replace: true });
    } catch (error) {
      console.error("Failed to complete run", error);
      toast.error("Could not complete the run. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  const editInitialValues = activeRun
    ? {
        id: activeRun.id,
        name: activeRun.name,
        restaurantId: activeRun.restaurant.id,
        restaurantLabel: activeRun.restaurant.name,
        deadline: toDateTimeLocalValue(activeRun.deadline),
      }
    : undefined;

  const isPanelVisible = isCreateOpen || isEditingRoute;
  const panelMode = isEditingRoute ? "edit" : "create";
  const isRunLocked = panelMode === "edit" && activeRun?.status === "COMPLETED";
  const disableCreateButton = isPanelVisible;
  const shouldShowPanel =
    isPanelVisible && (!isEditingRoute || Boolean(activeRun));

  return (
    <div className="dashboard">
      <Sidebar activeItem="runs" />
      <div className="workspace">
        {shouldShowPanel ? (
          <CreateRunPanel
            mode={panelMode}
            initialValues={panelMode === "edit" ? editInitialValues : undefined}
            isLocked={isRunLocked}
            onSubmit={isRunLocked ? undefined : handleSubmitRun}
            onClose={handleClosePanel}
            actionSlot={
              panelMode === "edit" && canCompleteRun ? (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleCompleteRun}
                  disabled={isCompleting}
                >
                  {isCompleting ? "Completing..." : "Complete run"}
                </button>
              ) : undefined
            }
          />
        ) : (
          <section className="panel runs-panel full-panel">
            <div className="panel-head">
              <div className="panel-head-main">
                <div className="panel-title-stack">
                  <div className="panel-title-row">
                    <h2>My Runs</h2>
                  </div>
                  <p className="panel-subtitle">
                    Track the runs you've organized and their completion status.
                  </p>
                </div>
              </div>
              <div className="panel-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={handleOpenCreatePanel}
                  disabled={disableCreateButton}
                >
                  Create run
                </button>
              </div>
            </div>

            <div className="runs-list scrollable">
              {sortedRuns.length > 0 ? (
                sortedRuns.map((run) => {
                  const statusMeta = getStatusMeta(run.status) ?? {
                    label: run.status,
                    tone: "muted" as const,
                  };
                  const deadlineLabel = formatDeadlineLabel(run.deadline);
                  const organizerLabel =
                    run.organizerName?.trim() ||
                    `Organizer #${run.organizerId}`;
                  return (
                    <button
                      key={run.id}
                      type="button"
                      className={`list-card run-card ${orderedRunIds.has(run.id) ? "is-ordered" : ""}`}
                      onClick={() => handleOpenEditPanel(run.id)}
                    >
                      <div className="run-card-head">
                        <h3>{run.name}</h3>
                        <span className={`status-pill ${statusMeta.tone}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                      <p>{run.restaurant.name}</p>
                      <div className="run-meta">
                        {orderedRunIds.has(run.id) && (
                          <span className="status-pill ordered">Ordered</span>
                        )}
                        <span>{organizerLabel}</span>
                        <span>{deadlineLabel}</span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="blank-state">
                  <p className="muted-label">
                    No runs yet. Create one to get lunch moving.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Runs;
