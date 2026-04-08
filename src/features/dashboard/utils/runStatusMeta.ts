import type { RunStatus } from "../../../services/run";

type StatusTone = "success" | "progress" | "muted" | "info";

type StatusMeta = {
  label: string;
  tone: StatusTone;
};

export const RUN_STATUS_META: Record<RunStatus, StatusMeta> = {
  OPEN: { label: "Open", tone: "info" },
  IN_PROGRESS: { label: "In progress", tone: "progress" },
  COMPLETED: { label: "Completed", tone: "success" },
};

export function getStatusMeta(status?: RunStatus) {
  if (!status) {
    return undefined;
  }
  return RUN_STATUS_META[status];
}
