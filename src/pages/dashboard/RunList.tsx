import type { Restaurant } from "../../services/restaurant";
import type { Run } from "../../services/run";
import { RUN_STATUS_META } from "./runStatusMeta";

type RunListProps = {
  runs: Run[];
  restaurantMap: Map<number, Restaurant>;
  activeRunId: number | null;
  onSelect: (runId: number) => void;
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

function RunList({ runs, restaurantMap, activeRunId, onSelect }: RunListProps) {
  return (
    <div className="runs-list scrollable">
      {runs.map((run) => {
        const runRest = restaurantMap.get(run.restaurantId);
        const statusMeta = RUN_STATUS_META[run.status] ?? {
          label: run.status,
          tone: "muted",
        };
        const deadlineLabel = formatDeadlineLabel(run.deadline);
        const organizerLabel =
          run.organizerName?.trim() || `Organizer #${run.organizerId}`;
        return (
          <button
            key={run.id}
            className={`list-card run-card ${run.id === activeRunId ? "is-active" : ""}`}
            onClick={() => onSelect(run.id)}
            type="button"
          >
            <div className="run-card-head">
              <h3>{run.name}</h3>
              <span className={`status-pill ${statusMeta.tone}`}>
                {statusMeta.label}
              </span>
            </div>
            <p>{runRest?.name}</p>
            <div className="run-meta">
              <span>{organizerLabel}</span>
              <span>{deadlineLabel}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default RunList;
