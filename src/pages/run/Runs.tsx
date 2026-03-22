import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { RunStatus, type UserRun, userRunsSeed } from "../../data/userRuns";
import { CreateRunPanel, type RunFormData } from ".";

const STATUS_CONFIG: Record<RunStatus, { label: string; tone: string }> = {
  "in-progress": { label: "In progress", tone: "progress" },
  completed: { label: "Completed", tone: "success" },
};

const STATUS_RANK: Record<RunStatus, number> = {
  "in-progress": 0,
  completed: 1,
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

function Runs() {
  const navigate = useNavigate();
  const { runId } = useParams<{ runId?: string }>();
  const [runs, setRuns] = useState<UserRun[]>(userRunsSeed);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const isEditingRoute = Boolean(runId);

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

  const activeRun = isEditingRoute
    ? runs.find((run) => run.id === runId)
    : undefined;

  useEffect(() => {
    if (isEditingRoute) {
      setIsCreateOpen(false);
    }
  }, [isEditingRoute]);

  useEffect(() => {
    if (runId && runs.length > 0 && !activeRun) {
      navigate("/runs", { replace: true });
    }
  }, [activeRun, navigate, runId, runs]);

  const handleSubmitRun = async (payload: RunFormData) => {
    if (payload.id) {
      setRuns((previous) =>
        previous.map((run) => {
          if (run.id !== payload.id) {
            return run;
          }
          return {
            ...run,
            name: payload.name,
            restaurant: payload.restaurantName,
            restaurantId: payload.restaurantId,
            deadline: payload.deadline,
            deliveredAt: formatDeadlineLabel(payload.deadline),
          };
        }),
      );
      navigate("/runs");
      return;
    }

    setRuns((previous) => [
      {
        id: `run-${Date.now()}`,
        name: payload.name,
        restaurant: payload.restaurantName,
        restaurantId: payload.restaurantId,
        total: "€0.00",
        deliveredAt: formatDeadlineLabel(payload.deadline),
        deadline: payload.deadline,
        status: "in-progress",
      },
      ...previous,
    ]);
    setIsCreateOpen(false);
  };

  const handleOpenCreatePanel = () => {
    setIsCreateOpen(true);
  };

  const handleOpenEditPanel = (runId: string) => {
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
        restaurantLabel: activeRun.restaurant,
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
                  className="btn btn-compact"
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
                  const statusMeta = STATUS_CONFIG[run.status];
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
                          <p>{run.restaurant}</p>
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
