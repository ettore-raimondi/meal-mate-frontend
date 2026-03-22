import { RestaurantFormState } from "./types";

type RestaurantFormFieldsProps = {
  values: RestaurantFormState;
  onChange: (field: keyof RestaurantFormState, value: string) => void;
};

function RestaurantFormFields({ values, onChange }: RestaurantFormFieldsProps) {
  return (
    <>
      <div className="restaurant-meta-grid">
        <label>
          Name
          <input
            value={values.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="Restaurant name"
            required
          />
        </label>
        <label>
          Address
          <input
            value={values.address}
            onChange={(event) => onChange("address", event.target.value)}
            placeholder="Street, neighborhood, or campus"
            required
          />
        </label>
        <label>
          Phone number
          <input
            value={values.phoneNumber}
            onChange={(event) => onChange("phoneNumber", event.target.value)}
            placeholder="(555) 123-4567"
            required
          />
        </label>
        <label>
          Website URL
          <input
            value={values.websiteUrl}
            onChange={(event) => onChange("websiteUrl", event.target.value)}
            placeholder="https://example.com"
          />
        </label>
      </div>
      <label>
        Description
        <textarea
          value={values.description}
          onChange={(event) => onChange("description", event.target.value)}
          rows={3}
          placeholder="Short blurb about the kitchen"
        />
      </label>
    </>
  );
}

export default RestaurantFormFields;
