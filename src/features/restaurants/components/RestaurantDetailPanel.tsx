import { type FormEvent } from "react";
import { toast } from "sonner";
import type { MenuItem } from "../../../services/menu-item";
import type { RestaurantEnriched } from "../../../services/restaurant";
import RestaurantFormFields from "./RestaurantFormFields";
import RestaurantMenuEditor from "./RestaurantMenuEditor";
import RestaurantMenuSection from "./RestaurantMenuSection";
import type {
  MenuDraftMode,
  MenuDraftState,
  RestaurantFormState,
} from "../utils/index.ts";

export type RestaurantDetailState = {
  viewingDetail: boolean;
  isCreatingRestaurant: boolean;
  menuEditorMode: MenuDraftMode | null;
  menuEditor: MenuDraftState;
  restaurantForm: RestaurantFormState;
  currentMenuItems: MenuItem[];
  activeRestaurant?: RestaurantEnriched;
  isNearbyRestaurantDetail: boolean;
  isSavingNearby: boolean;
  showingMenuView: boolean;
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
  onSaveRestaurantDetails: () => Promise<string | undefined>;
  onSaveNearbyRestaurant: () => void;
  onDeleteRestaurant?: () => void;
  onScrapeMenuItems: (websiteUrl: string) => void;
  setShowingMenuView: (showing: boolean) => void;
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
        currentMenuItems={state.currentMenuItems}
        beginAddMenuItem={actions.beginAddMenuItem}
        beginEditMenuItem={actions.beginEditMenuItem}
        onDeleteMenuItem={actions.onDeleteMenuItem}
        onSaveRestaurantDetails={actions.onSaveRestaurantDetails}
        isNearbyRestaurantDetail={state.isNearbyRestaurantDetail}
        isSavingNearby={state.isSavingNearby}
        onSaveNearbyRestaurant={actions.onSaveNearbyRestaurant}
        onDeleteRestaurant={actions.onDeleteRestaurant}
        onScrapeMenuItems={actions.onScrapeMenuItems}
        activeRestaurant={state.activeRestaurant}
        showingMenuView={state.showingMenuView}
        setShowingMenuView={actions.setShowingMenuView}
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
  currentMenuItems,
  beginAddMenuItem,
  beginEditMenuItem,
  onDeleteMenuItem,
  onSaveRestaurantDetails,
  isNearbyRestaurantDetail,
  isSavingNearby,
  onSaveNearbyRestaurant,
  onDeleteRestaurant,
  onScrapeMenuItems,
  activeRestaurant,
  showingMenuView,
  setShowingMenuView,
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

  const saveRestaurantDetails = async () => {
    try {
      const name = await onSaveRestaurantDetails();
      toast.success(`${name ?? activeRestaurant.name} has been updated.`);
    } catch (error) {
      console.error("Failed to update restaurant", error);
      toast.error("Could not update restaurant. Please try again.");
    }
  };

  const onExistingRestaurantSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void saveRestaurantDetails();
  };

  return (
    <div className="restaurant-detail-stack">
      {showingMenuView ? (
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
      ) : (
        <>
          <form
            id="restaurant-meta-form"
            className="restaurant-meta-form"
            onSubmit={onExistingRestaurantSubmit}
          >
            <div className="restaurant-meta-form-head">
              <div>
                <h3 style={{ marginTop: "0px" }}>Edit Restaurant</h3>
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
          {!isNearbyRestaurantDetail && (
            <button
              className="btn btn-outline restaurant-menu-toggle"
              type="button"
              onClick={() => setShowingMenuView(true)}
            >
              Edit menu items →
            </button>
          )}
        </>
      )}

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
            <button
              className="btn"
              type="button"
              onClick={() => {
                void saveRestaurantDetails();
              }}
            >
              Save details
            </button>
          )}
        </div>
        {!isNearbyRestaurantDetail && (
          <div className="restaurant-meta-actions-danger">
            <button
              className="btn btn-outline btn-danger"
              type="button"
              onClick={onDeleteRestaurant}
            >
              Delete restaurant
            </button>
          </div>
        )}
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
  currentMenuItems: MenuItem[];
  beginAddMenuItem: () => void;
  beginEditMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (item: MenuItem) => void;
  onSaveRestaurantDetails: () => Promise<string | undefined>;
  isNearbyRestaurantDetail: boolean;
  isSavingNearby: boolean;
  onSaveNearbyRestaurant: () => void;
  onDeleteRestaurant?: () => void;
  onScrapeMenuItems: (websiteUrl: string) => void;
  activeRestaurant: RestaurantEnriched;
  showingMenuView: boolean;
  setShowingMenuView: (showing: boolean) => void;
};

export default RestaurantDetailPanel;
