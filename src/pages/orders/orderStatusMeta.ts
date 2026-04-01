import type { Order } from "../../services/order/order.types";

type OrderStatus = Order["status"];
type StatusTone = "success" | "progress" | "muted";

type StatusMeta = {
  label: string;
  tone: StatusTone;
};

const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
  in_progress: { label: "In progress", tone: "progress" },
  completed: { label: "Completed", tone: "success" },
  cancelled: { label: "Cancelled", tone: "muted" },
};

export function getOrderStatusMeta(status?: OrderStatus) {
  if (!status) {
    return undefined;
  }
  return ORDER_STATUS_META[status];
}
