import { FoodRun, Restaurant } from "../../components/homeTypes";

type RunListProps = {
  runs: FoodRun[];
  activeRunId: string;
  restaurantMap: Map<string, Restaurant>;
  onSelect: (runId: string) => void;
};

function RunList({ runs, activeRunId, restaurantMap, onSelect }: RunListProps) {
  return (
    <div className="runs-list scrollable">
      {runs.map((run) => {
        const runRest = restaurantMap.get(run.restaurantId);
        return (
          <button
            key={run.id}
            className={`list-card run-card ${run.id === activeRunId ? "is-active" : ""}`}
            onClick={() => onSelect(run.id)}
            type="button"
          >
            <div className="run-card-head">
              <h3>{run.name}</h3>
              <span
                className={`status-pill ${run.status === "Open" ? "success" : "muted"}`}
              >
                {run.status}
              </span>
            </div>
            <p>{runRest?.name}</p>
            <div className="run-meta">
              <span>{run.organizer}</span>
              <span>{run.cutoff}</span>
              <span>{run.orders} orders</span>
              <span>{run.eta}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default RunList;
