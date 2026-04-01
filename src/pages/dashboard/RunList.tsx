import type { RunEnriched } from "../../services/run";
import { RUN_STATUS_META } from "./runStatusMeta";

type RunListProps = {
  runs: RunEnriched[];
  activeRunId: number | null;
  orderedRunIds: Set<number>;
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

function RunList({ runs, activeRunId, orderedRunIds, onSelect }: RunListProps) {
  return (
    <div className="runs-list scrollable">
      {runs.map((run) => {
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
            className={`list-card run-card ${run.id === activeRunId ? "is-active" : ""} ${orderedRunIds.has(run.id) ? "is-ordered" : ""}`}
            onClick={() => onSelect(run.id)}
            type="button"
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
      })}
    </div>
  );
}

export default RunList;
