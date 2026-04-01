import { FormEvent, useEffect, useMemo, useState } from "react";
import RunFormField from "./RunFormField";
import type {
  RestaurantOption,
  RunFormData,
  RunFormValues,
  RunInitialValues,
} from "./types";

type CreateRunFormProps = {
  mode: "create" | "edit";
  restaurants: RestaurantOption[];
  isLoadingRestaurants?: boolean;
  initialValues?: RunInitialValues;
  onSubmit?: (payload: RunFormData) => Promise<void> | void;
  onCancel?: () => void;
};

const INITIAL_FORM_STATE: RunFormValues = {
  name: "",
  restaurantId: 0,
  deadline: "",
};

const INITIAL_TOUCHED_STATE = {
  name: false,
  restaurantId: false,
  deadline: false,
};

type FormFieldKey = keyof typeof INITIAL_FORM_STATE;

type FormErrors = Record<FormFieldKey, string>;

function CreateRunForm({
  mode,
  restaurants,
  isLoadingRestaurants = false,
  initialValues,
  onSubmit,
  onCancel,
}: CreateRunFormProps) {
  const [formState, setFormState] = useState<RunFormValues>(INITIAL_FORM_STATE);
  const [touched, setTouched] = useState(INITIAL_TOUCHED_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormState({
        name: initialValues.name,
        restaurantId: initialValues.restaurantId,
        deadline: initialValues.deadline,
      });
    } else {
      setFormState(INITIAL_FORM_STATE);
    }
    setTouched(INITIAL_TOUCHED_STATE);
  }, [initialValues]);

  const errors: FormErrors = useMemo(
    () => ({
      name: formState.name ? "" : "Give this run a friendly name.",
      restaurantId: formState.restaurantId ? "" : "Select a restaurant.",
      deadline: formState.deadline ? "" : "Add a cutoff time.",
    }),
    [formState],
  );

  const isValid = useMemo(
    () => Object.values(errors).every((error) => !error),
    [errors],
  );

  const handleBlur = (field: FormFieldKey) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: FormFieldKey, value: string | number) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const findRestaurantName = (restaurantId: number) => {
    const match = restaurants.find(
      (restaurant) => restaurant.id === restaurantId,
    );
    if (match) {
      return match.label;
    }
    if (initialValues?.restaurantId === restaurantId) {
      return initialValues?.restaurantLabel ?? "";
    }
    return "";
  };

  const getErrorForField = (field: FormFieldKey) => {
    return touched[field] ? errors[field] : "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ name: true, restaurantId: true, deadline: true });

    if (!isValid || !onSubmit) {
      return;
    }

    const restaurantName = findRestaurantName(formState.restaurantId);
    if (!restaurantName) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        id: initialValues?.id,
        name: formState.name.trim(),
        restaurantId: formState.restaurantId,
        restaurantName,
        deadline: formState.deadline,
      });
      if (mode === "create") {
        setFormState(INITIAL_FORM_STATE);
        setTouched(INITIAL_TOUCHED_STATE);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasFallbackRestaurant = Boolean(
    initialValues?.restaurantId &&
    formState.restaurantId === initialValues.restaurantId &&
    !restaurants.some((restaurant) => restaurant.id === formState.restaurantId),
  );
  const selectDisabled =
    isLoadingRestaurants ||
    (!hasFallbackRestaurant && restaurants.length === 0);
  const submitDisabled = !isValid || isSubmitting || selectDisabled;
  const submitLabel = mode === "create" ? "Create run" : "Save changes";
  const submittingLabel = mode === "create" ? "Creating..." : "Saving...";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <RunFormField
        id="run-name"
        label="Run name"
        helperText="This shows up in Slack, texts, and reminders."
        error={getErrorForField("name")}
      >
        <input
          id="run-name"
          name="name"
          type="text"
          placeholder="Finance team sushi run"
          value={formState.name}
          onChange={(event) => handleChange("name", event.target.value)}
          onBlur={() => handleBlur("name")}
          autoComplete="off"
        />
      </RunFormField>

      <RunFormField
        id="run-restaurant"
        label="Restaurant"
        helperText={
          restaurants.length > 0 || hasFallbackRestaurant
            ? "Choose from kitchens you manage."
            : "Add a restaurant to unlock run creation."
        }
        error={getErrorForField("restaurantId")}
      >
        <select
          id="run-restaurant"
          name="restaurant"
          value={formState.restaurantId}
          onChange={(event) =>
            handleChange("restaurantId", Number(event.target.value))
          }
          onBlur={() => handleBlur("restaurantId")}
          disabled={selectDisabled}
        >
          <option value="" disabled>
            {isLoadingRestaurants
              ? "Loading your restaurants..."
              : "Select a restaurant"}
          </option>
          {hasFallbackRestaurant && initialValues ? (
            <option value={initialValues.restaurantId}>
              {initialValues.restaurantLabel ?? "Current restaurant"}
            </option>
          ) : null}
          {restaurants.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.label}
            </option>
          ))}
        </select>
      </RunFormField>

      <RunFormField
        id="run-deadline"
        label="Order deadline"
        helperText="We will send nudges 15 minutes before this cutoff."
        error={getErrorForField("deadline")}
      >
        <input
          id="run-deadline"
          name="deadline"
          type="datetime-local"
          value={formState.deadline}
          onChange={(event) => handleChange("deadline", event.target.value)}
          onBlur={() => handleBlur("deadline")}
        />
      </RunFormField>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Close
        </button>
        <button className="btn" type="submit" disabled={submitDisabled}>
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default CreateRunForm;
