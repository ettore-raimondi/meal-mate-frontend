import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { CreateRunPanel, type RunFormData } from ".";
import {
  createRun,
  fetchRuns,
  type Run,
  type RunStatus,
} from "../../services/run";
import { toast } from "sonner";
import { fetchRestaurants, type Restaurant } from "../../services/restaurant";
import { getStatusMeta } from "../dashboard/runStatusMeta";

const STATUS_RANK: Record<RunStatus, number> = {
  IN_PROGRESS: 0,
  OPEN: 1,
  CLOSED: 3,
  COMPLETED: 4,
};

const formatDeadlineLabel = (deadline: string) => {
  const parsed = new Date(deadline);
  if (Number.isNaN(parsed.getTime())) {
    return "Closes soon";
  }
  const dateLabel = parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const timeLabel = parsed.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  return `Closes ${dateLabel} · ${timeLabel}`;
};

const parseNumericParam = (value?: string) => {
  if (value === undefined) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

function Runs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { runId: runIdParam } = useParams<{ runId?: string }>();
  const routeRunId = parseNumericParam(runIdParam);
  const [runs, setRuns] = useState<Run[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const isEditingRoute = routeRunId !== undefined;

  const restaurantsMap = useMemo(() => {
    const map = new Map<number, Restaurant>();
    restaurants.forEach((restaurant) => {
      map.set(restaurant.id, restaurant);
    });
    return map;
  }, [restaurants]);

  const sortedRuns = useMemo(() => {
    return [...runs].sort((a, b) => {
      const scoreA = STATUS_RANK[a.status];
      const scoreB = STATUS_RANK[b.status];
      if (scoreA !== scoreB) {
        return scoreA - scoreB;
      }
      const timeA = a.deadline ? new Date(a.deadline).getTime() : 0;
      const timeB = b.deadline ? new Date(b.deadline).getTime() : 0;
      return timeB - timeA;
    });
  }, [runs]);

  const activeRun =
    routeRunId !== undefined
      ? runs.find((run) => run.id === routeRunId)
      : undefined;

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
    if (routeRunId !== undefined && runs.length > 0 && !activeRun) {
      navigate("/runs", { replace: true });
    }
  }, [activeRun, navigate, routeRunId, runs]);

  const handleSubmitRun = async (payload: RunFormData) => {
    const createdRun = await createRun({
      name: payload.name,
      description: "",
      restaurant_id: payload.restaurantId,
      deadline: payload.deadline,
      status: "OPEN",
    });

    if (createdRun.id) {
      try {
        const updatedRestaurants = await fetchRestaurants();
        setRestaurants(updatedRestaurants);
      } catch (error) {
        console.error("Failed to refresh restaurants", error);
      }
      toast.success("Run created successfully!");
      navigate("/runs");
      return;
    }
    setIsCreateOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const runs = await fetchRuns();
      const restaurants = await fetchRestaurants();

      setRestaurants(restaurants);
      setRuns(runs);
    };
    fetchData();
  }, []);

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

  const editInitialValues = activeRun
    ? {
        id: activeRun.id,
        name: activeRun.name,
        restaurantId: activeRun.restaurantId,
        restaurantLabel:
          restaurantsMap.get(activeRun.restaurantId)?.name ??
          "Unknown restaurant",
        deadline: activeRun.deadline,
      }
    : undefined;

  const isPanelVisible = isCreateOpen || isEditingRoute;
  const panelMode = isEditingRoute ? "edit" : "create";
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
            onSubmit={handleSubmitRun}
            onClose={handleClosePanel}
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
                  const restaurant = restaurantsMap.get(run.restaurantId) ?? {
                    name: "Unknown restaurant",
                  };
                  const statusMeta = getStatusMeta(run.status) ?? {
                    label: run.status,
                    tone: "muted" as const,
                  };
                  return (
                    <button
                      key={run.id}
                      type="button"
                      className="list-card run-history-card"
                      onClick={() => handleOpenEditPanel(run.id)}
                    >
                      <div className="run-history-card-head">
                        <div className="run-history-card-title">
                          <h3>{run.name}</h3>
                          <p>{restaurant.name}</p>
                        </div>
                        <span className={`status-pill ${statusMeta.tone}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                      <div className="run-history-card-meta">
                        <span className="muted-label">{run.deliveredAt}</span>
                        <strong>{run.total}</strong>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="blank-state">
                  <p className="muted-label">You haven't led any runs yet.</p>
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
