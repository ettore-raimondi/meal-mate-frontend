import { type FormEvent } from "react";
import type { MenuItem, Restaurant } from "../../homeTypes";
import RestaurantFormFields from "../RestaurantFormFields";
import RestaurantMenuEditor from "../RestaurantMenuEditor";
import RestaurantMenuSection from "../RestaurantMenuSection";
import type {
  MenuDraftMode,
  MenuDraftState,
  RestaurantFormState,
} from "../types";

export type RestaurantDetailState = {
  viewingDetail: boolean;
  isCreatingRestaurant: boolean;
  menuEditorMode: MenuDraftMode | null;
  menuEditor: MenuDraftState;
  restaurantForm: RestaurantFormState;
  currentMenuItems: MenuItem[];
  activeRestaurant?: Restaurant;
  isNearbyRestaurantDetail: boolean;
  isSavingNearby: boolean;
};

export type RestaurantDetailActions = {
  onMenuEditorChange: (field: keyof MenuDraftState, value: string) => void;
  onMenuEditorSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onMenuEditorDelete?: () => void;
  onCancelMenuEditor: () => void;
  onRestaurantFormChange: (
    field: keyof RestaurantFormState,
    value: string,
  ) => void;
  onRestaurantFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  beginAddMenuItem: () => void;
  beginEditMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (item: MenuItem) => void;
  onSaveNearbyRestaurant: () => void;
  onDeleteRestaurant?: () => void;
  onScrapeMenuItems: (websiteUrl: string) => void;
};

type RestaurantDetailPanelProps = {
  state: RestaurantDetailState;
  actions: RestaurantDetailActions;
};

function RestaurantDetailPanel({ state, actions }: RestaurantDetailPanelProps) {
  if (!state.viewingDetail) {
    return null;
  }

  if (state.menuEditorMode) {
    return (
      <div className="run-detail scrollable restaurant-detail">
        <RestaurantMenuEditor
          mode={state.menuEditorMode}
          draft={state.menuEditor}
          onChange={actions.onMenuEditorChange}
          onSubmit={actions.onMenuEditorSubmit}
          onDelete={actions.onMenuEditorDelete}
          onCancel={actions.onCancelMenuEditor}
        />
      </div>
    );
  }

  if (state.isCreatingRestaurant) {
    return (
      <div className="run-detail scrollable restaurant-detail">
        <CreateRestaurantView
          restaurantForm={state.restaurantForm}
          onRestaurantFormChange={actions.onRestaurantFormChange}
          onRestaurantFormSubmit={actions.onRestaurantFormSubmit}
          currentMenuItems={state.currentMenuItems}
          beginAddMenuItem={actions.beginAddMenuItem}
          beginEditMenuItem={actions.beginEditMenuItem}
          onDeleteMenuItem={actions.onDeleteMenuItem}
        />
      </div>
    );
  }

  if (!state.activeRestaurant) {
    return (
      <div className="run-detail scrollable restaurant-detail">
        <div className="blank-state">
          <p className="muted-label">
            Add a restaurant to begin managing menus.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="run-detail scrollable restaurant-detail">
      <ExistingRestaurantView
        restaurantForm={state.restaurantForm}
        onRestaurantFormChange={actions.onRestaurantFormChange}
        onRestaurantFormSubmit={actions.onRestaurantFormSubmit}
        currentMenuItems={state.currentMenuItems}
        beginAddMenuItem={actions.beginAddMenuItem}
        beginEditMenuItem={actions.beginEditMenuItem}
        onDeleteMenuItem={actions.onDeleteMenuItem}
        isNearbyRestaurantDetail={state.isNearbyRestaurantDetail}
        isSavingNearby={state.isSavingNearby}
        onSaveNearbyRestaurant={actions.onSaveNearbyRestaurant}
        onDeleteRestaurant={actions.onDeleteRestaurant}
        onScrapeMenuItems={actions.onScrapeMenuItems}
        activeRestaurant={state.activeRestaurant}
      />
    </div>
  );
}

function CreateRestaurantView({
  restaurantForm,
  onRestaurantFormChange,
  onRestaurantFormSubmit,
  currentMenuItems,
  beginAddMenuItem,
  beginEditMenuItem,
  onDeleteMenuItem,
}: CreateRestaurantViewProps) {
  return (
    <div className="restaurant-detail-stack">
      <form
        id="restaurant-meta-form"
        className="restaurant-meta-form"
        onSubmit={onRestaurantFormSubmit}
      >
        <RestaurantFormFields
          values={restaurantForm}
          onChange={onRestaurantFormChange}
        />
      </form>

      <RestaurantMenuSection
        menu={currentMenuItems}
        title="Menu Items"
        description="Build the starter lineup; items save with the restaurant."
        onAddItem={beginAddMenuItem}
        onSelectItem={beginEditMenuItem}
        onDeleteItem={onDeleteMenuItem}
      />

      <div className="restaurant-meta-actions">
        <div className="restaurant-meta-actions-primary">
          <button className="btn" type="submit" form="restaurant-meta-form">
            Create restaurant
          </button>
        </div>
      </div>
    </div>
  );
}

function ExistingRestaurantView({
  restaurantForm,
  onRestaurantFormChange,
  onRestaurantFormSubmit,
  currentMenuItems,
  beginAddMenuItem,
  beginEditMenuItem,
  onDeleteMenuItem,
  isNearbyRestaurantDetail,
  isSavingNearby,
  onSaveNearbyRestaurant,
  onDeleteRestaurant,
  onScrapeMenuItems,
  activeRestaurant,
}: ExistingRestaurantViewProps) {
  const menuSecondaryAction = (() => {
    if (!activeRestaurant || isNearbyRestaurantDetail) {
      return undefined;
    }
    const hasWebsite = Boolean(activeRestaurant.websiteUrl);
    return {
      label: "Scrape menu",
      disabled: !hasWebsite,
      tooltip: hasWebsite ? undefined : "Add a website URL to enable scraping.",
      onClick: () => {
        if (activeRestaurant.websiteUrl) {
          onScrapeMenuItems(activeRestaurant.websiteUrl);
        }
      },
    };
  })();

  return (
    <div className="restaurant-detail-stack">
      <form
        id="restaurant-meta-form"
        className="restaurant-meta-form"
        onSubmit={onRestaurantFormSubmit}
      >
        <div className="restaurant-meta-form-head">
          <div>
            <h3>Edit Restaurant</h3>
            <p className="muted-label">
              Update the basics before managing the menu.
            </p>
          </div>
        </div>
        <RestaurantFormFields
          values={restaurantForm}
          onChange={onRestaurantFormChange}
        />
      </form>

      <RestaurantMenuSection
        menu={currentMenuItems}
        onAddItem={beginAddMenuItem}
        onSelectItem={beginEditMenuItem}
        onDeleteItem={onDeleteMenuItem}
        description={
          isNearbyRestaurantDetail
            ? "Scrape the public menu to auto-populate dishes, or add your own."
            : undefined
        }
        secondaryAction={menuSecondaryAction}
      />

      <div className="restaurant-meta-actions">
        <div className="restaurant-meta-actions-primary">
          {isNearbyRestaurantDetail ? (
            <button
              className="btn"
              type="button"
              onClick={onSaveNearbyRestaurant}
              disabled={isSavingNearby}
            >
              {isSavingNearby
                ? "Saving to My Restaurants..."
                : "Save to My Restaurants"}
            </button>
          ) : (
            <button className="btn" type="submit" form="restaurant-meta-form">
              Save details
            </button>
          )}
        </div>
        <div className="restaurant-meta-actions-danger">
          <button
            className="btn btn-outline btn-danger"
            type="button"
            onClick={onDeleteRestaurant}
          >
            {isNearbyRestaurantDetail
              ? "Remove suggestion"
              : "Delete restaurant"}
          </button>
        </div>
      </div>
    </div>
  );
}

type CreateRestaurantViewProps = {
  restaurantForm: RestaurantFormState;
  onRestaurantFormChange: (
    field: keyof RestaurantFormState,
    value: string,
  ) => void;
  onRestaurantFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  currentMenuItems: MenuItem[];
  beginAddMenuItem: () => void;
  beginEditMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (item: MenuItem) => void;
};

type ExistingRestaurantViewProps = {
  restaurantForm: RestaurantFormState;
  onRestaurantFormChange: (
    field: keyof RestaurantFormState,
    value: string,
  ) => void;
  onRestaurantFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  currentMenuItems: MenuItem[];
  beginAddMenuItem: () => void;
  beginEditMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (item: MenuItem) => void;
  isNearbyRestaurantDetail: boolean;
  isSavingNearby: boolean;
  onSaveNearbyRestaurant: () => void;
  onDeleteRestaurant?: () => void;
  onScrapeMenuItems: (websiteUrl: string) => void;
  activeRestaurant: Restaurant;
};

export default RestaurantDetailPanel;
