import Sidebar from "./Sidebar";
import { RunStatus, userRunsSeed } from "../data/userRuns";

const STATUS_CONFIG: Record<RunStatus, { label: string; tone: string }> = {
  "in-progress": { label: "In progress", tone: "progress" },
  completed: { label: "Completed", tone: "success" },
};

const STATUS_RANK: Record<RunStatus, number> = {
  "in-progress": 0,
  completed: 1,
};

function Runs() {
  const sortedRuns = [...userRunsSeed].sort((a, b) => {
    const scoreA = STATUS_RANK[a.status];
    const scoreB = STATUS_RANK[b.status];
    if (scoreA !== scoreB) {
      return scoreA - scoreB;
    }
    return b.deliveredAt.localeCompare(a.deliveredAt);
  });

  return (
    <div className="dashboard">
      <Sidebar activeItem="runs" />
      <div className="workspace">
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
          </div>

          <div className="runs-grid">
            <div className="runs-list scrollable">
              {sortedRuns.length > 0 ? (
                sortedRuns.map((run) => {
                  const statusMeta = STATUS_CONFIG[run.status];
                  return (
                    <article
                      key={run.id}
                      className="list-card run-history-card"
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
                    </article>
                  );
                })
              ) : (
                <div className="blank-state">
                  <p className="muted-label">You haven't led any runs yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Runs;
