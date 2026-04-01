import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { fetchRestaurants } from "../../services/restaurant/restaurant.service";
import type { Restaurant } from "../../services/restaurant";
import CreateRunForm from "./CreateRunForm";
import type { RestaurantOption, RunFormData, RunInitialValues } from "./types";

type CreateRunPanelProps = {
  mode: "create" | "edit";
  initialValues?: RunInitialValues;
  isLocked?: boolean;
  onSubmit?: (payload: RunFormData) => Promise<void> | void;
  onClose?: () => void;
  actionSlot?: ReactNode;
};

function CreateRunPanel({
  mode,
  initialValues,
  isLocked = false,
  onSubmit,
  onClose,
  actionSlot,
}: CreateRunPanelProps) {
  const [restaurants, setRestaurants] = useState<RestaurantOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const mapToOptions = (items: Restaurant[]): RestaurantOption[] =>
    items.map((restaurant) => ({ id: restaurant.id, label: restaurant.name }));

  const loadRestaurants = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await fetchRestaurants();
      setRestaurants(mapToOptions(response));
    } catch (error) {
      console.error("Failed to load restaurants", error);
      setFetchError("Unable to load your restaurants right now.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const panelTitle = mode === "create" ? "Create a run" : "Edit run";
  const panelSubtitle = useMemo(() => {
    if (mode === "create") {
      return "Pick a restaurant, set the cutoff, and we will notify teammates.";
    }
    return initialValues?.name
      ? `Update the details for ${initialValues.name}.`
      : "Update run details.";
  }, [initialValues, mode]);

  const handleSubmit = useCallback(
    async (payload: RunFormData) => {
      if (!onSubmit) {
        return;
      }
      await onSubmit(payload);
      onClose?.();
    },
    [onClose, onSubmit],
  );

  return (
    <section className="panel create-run-panel">
      <div className="panel-head">
        <div className="panel-head-main">
          <button type="button" className="back-link" onClick={onClose}>
            ← Back to runs
          </button>
          <div className="panel-title-stack">
            <div className="panel-title-row">
              <h2>{panelTitle}</h2>
            </div>
            <p className="panel-subtitle">{panelSubtitle}</p>
          </div>
        </div>
        {actionSlot ? <div className="panel-actions">{actionSlot}</div> : null}
      </div>

      {fetchError ? (
        <div className="field-error">
          {fetchError}{" "}
          <button type="button" onClick={loadRestaurants}>
            Try again
          </button>
        </div>
      ) : null}

      <CreateRunForm
        mode={mode}
        restaurants={restaurants}
        isLoadingRestaurants={isLoading}
        isLocked={isLocked}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </section>
  );
}

export default CreateRunPanel;
