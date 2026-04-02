import type { RunStatus } from "../../../services/run";

type StatusTone = "success" | "progress" | "muted";

type StatusMeta = {
  label: string;
  tone: StatusTone;
};

export const RUN_STATUS_META: Record<RunStatus, StatusMeta> = {
  OPEN: { label: "Open", tone: "success" },
  IN_PROGRESS: { label: "In progress", tone: "progress" },
  CLOSED: { label: "Closed", tone: "muted" },
  COMPLETED: { label: "Completed", tone: "success" },
};

export function getStatusMeta(status?: RunStatus) {
  if (!status) {
    return undefined;
  }
  return RUN_STATUS_META[status];
}
