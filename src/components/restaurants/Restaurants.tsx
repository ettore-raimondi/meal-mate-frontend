import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import { MenuItem, Restaurant } from "../homeTypes";
import { restaurantSeed } from "../../data/restaurants";
import RestaurantList from "./RestaurantList";
import RestaurantFormFields from "./RestaurantFormFields";
import RestaurantMenuSection from "./RestaurantMenuSection";
import RestaurantMenuEditor from "./RestaurantMenuEditor";
import {
  emptyMenuDraft,
  emptyRestaurantForm,
  MenuDraftMode,
  MenuDraftState,
  RestaurantFormState,
} from "./types";
import {
  createRestaurant,
  fetchRestaurants,
} from "../../services/restaurant/restaurant.service";
import { fetchCoordinates } from "../../helpers/get-coordinates";
import { type RestaurantFormData } from "../../services/restaurant/types";

const RESTAURANT_PREFIX = "rest-";
const MENU_PREFIX = "m-";
const NEW_RESTAURANT_SLUG = "new";

const toRouteSegment = (id: string, prefix: string) =>
  id.replace(new RegExp(`^${prefix}`, "i"), "");

const fromRouteSegment = (segment: string | undefined, prefix: string) => {
  if (!segment) {
    return undefined;
  }
  return segment.startsWith(prefix) ? segment : `${prefix}${segment}`;
};

function Restaurants() {
  const navigate = useNavigate();
  const { restaurantNumber } = useParams<{ restaurantNumber?: string }>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>(restaurantSeed);
  const [restaurantsNearMe, setRestaurantsNearMe] = useState<Restaurant[]>([]);
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(
    restaurantSeed[0]?.id ?? null,
  );
  const [menuEditorMode, setMenuEditorMode] = useState<MenuDraftMode | null>(
    null,
  );
  const [menuEditor, setMenuEditor] = useState<MenuDraftState>(emptyMenuDraft);
  const [restaurantForm, setRestaurantForm] =
    useState<RestaurantFormState>(emptyRestaurantForm);
  const [newRestaurantMenu, setNewRestaurantMenu] = useState<MenuItem[]>([]);

  const isCreatingRestaurant = restaurantNumber === NEW_RESTAURANT_SLUG;
  const routeRestaurantId = isCreatingRestaurant
    ? undefined
    : fromRouteSegment(restaurantNumber, RESTAURANT_PREFIX);
  const effectiveRestaurantId =
    routeRestaurantId ?? (isCreatingRestaurant ? null : activeRestaurantId);
  const viewingDetail = Boolean(routeRestaurantId) || isCreatingRestaurant;
  const activeRestaurant = useMemo(
    () =>
      restaurants.find((restaurant) => restaurant.id === effectiveRestaurantId),
    [restaurants, effectiveRestaurantId],
  );
  const currentMenuItems = isCreatingRestaurant
    ? newRestaurantMenu
    : (activeRestaurant?.menu ?? []);

  useEffect(() => {
    if (routeRestaurantId) {
      const exists = restaurants.some(
        (restaurant) => restaurant.id === routeRestaurantId,
      );
      if (exists) {
        setActiveRestaurantId(routeRestaurantId);
      } else {
        navigate("/restaurants", { replace: true });
      }
    }
  }, [routeRestaurantId, restaurants, navigate]);

  useEffect(() => {
    if (!routeRestaurantId && !activeRestaurantId && restaurants.length > 0) {
      setActiveRestaurantId(restaurants[0].id);
    }
  }, [routeRestaurantId, activeRestaurantId, restaurants]);

  useEffect(() => {
    if (isCreatingRestaurant) {
      setRestaurantForm(emptyRestaurantForm);
      setNewRestaurantMenu([]);
      return;
    }
    if (activeRestaurant) {
      setRestaurantForm({
        name: activeRestaurant.name,
        address: activeRestaurant.address,
        phoneNumber: activeRestaurant.phoneNumber,
        websiteUrl: activeRestaurant.websiteUrl,
        description: activeRestaurant.description,
        cuisine: activeRestaurant.cuisine,
      });
    } else {
      setRestaurantForm(emptyRestaurantForm);
    }
  }, [activeRestaurant, isCreatingRestaurant]);

  useEffect(() => {
    setMenuEditorMode(null);
    setMenuEditor(emptyMenuDraft);
  }, [activeRestaurantId]);

  useEffect(() => {
    if (!viewingDetail) {
      setMenuEditorMode(null);
      setMenuEditor(emptyMenuDraft);
    }
  }, [viewingDetail]);

  useEffect(() => {
    const fetchData = async () => {
      // Gets coordinates and fetches nearby restaurants
      const coordinates = await fetchCoordinates();
      if (coordinates) {
        const { latitude, longitude } = coordinates;
        const restaurants = await fetchRestaurants(latitude, longitude);
        setRestaurantsNearMe(restaurants);
      }
    };
    fetchData();
  }, []);

  const isEditingMenu = Boolean(menuEditorMode);

  const panelTitle = isCreatingRestaurant
    ? "Add Restaurant"
    : viewingDetail && activeRestaurant && !isEditingMenu
      ? activeRestaurant.name
      : "Restaurants";

  const panelSubtitle = isCreatingRestaurant
    ? "List a new kitchen and get it ready for runs."
    : viewingDetail && activeRestaurant && !isEditingMenu
      ? `${activeRestaurant.address} · ${activeRestaurant.cuisine}`
      : "Browse all partner kitchens.";

  const handleSelectRestaurant = (restaurantId: string) => {
    setActiveRestaurantId(restaurantId);
    const slug = toRouteSegment(restaurantId, RESTAURANT_PREFIX);
    navigate(`/restaurants/${slug}`);
  };

  const handleBackToRestaurants = () => {
    navigate("/restaurants");
  };

  const handleBeginCreateRestaurant = () => {
    setMenuEditorMode(null);
    setMenuEditor(emptyMenuDraft);
    navigate(`/restaurants/${NEW_RESTAURANT_SLUG}`);
  };

  const handleDeleteRestaurant = (restaurantId: string) => {
    setRestaurants((prev) => {
      const next = prev.filter((rest) => rest.id !== restaurantId);
      if (effectiveRestaurantId === restaurantId) {
        const fallback = next[0];
        setActiveRestaurantId(fallback?.id ?? null);
        navigate("/restaurants");
      }
      return next;
    });
  };

  const handleRestaurantFormChange = (
    field: keyof RestaurantFormState,
    value: string,
  ) => {
    setRestaurantForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateMenuItems = (updater: (previous: MenuItem[]) => MenuItem[]) => {
    if (isCreatingRestaurant) {
      setNewRestaurantMenu((prev) => updater(prev));
      return;
    }
    if (!effectiveRestaurantId) {
      return;
    }
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === effectiveRestaurantId
          ? { ...restaurant, menu: updater(restaurant.menu) }
          : restaurant,
      ),
    );
  };

  const beginAddMenuItem = () => {
    setMenuEditor(emptyMenuDraft);
    setMenuEditorMode({ type: "add" });
  };

  const beginEditMenuItem = (item: MenuItem) => {
    setMenuEditor({
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl ?? "",
      description: item.description,
    });
    setMenuEditorMode({ type: "edit", itemId: item.id });
  };

  const cancelMenuEditor = () => {
    setMenuEditor(emptyMenuDraft);
    setMenuEditorMode(null);
  };

  const handleMenuEditorChange = (
    field: keyof MenuDraftState,
    value: string,
  ) => {
    setMenuEditor((prev) => ({ ...prev, [field]: value }));
  };

  const handleMenuEditorSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!menuEditor.name || !menuEditor.price || !menuEditorMode) {
      return;
    }

    if (menuEditorMode.type === "edit") {
      const targetId = menuEditorMode.itemId;
      updateMenuItems((prevMenu) =>
        prevMenu.map((item) =>
          item.id === targetId ? { ...item, ...menuEditor } : item,
        ),
      );
      cancelMenuEditor();
      return;
    }

    const randomId = globalThis.crypto?.randomUUID?.() ?? Date.now().toString();
    const newItem: MenuItem = {
      id: `${MENU_PREFIX}${randomId}`,
      name: menuEditor.name,
      price: menuEditor.price,
      description: menuEditor.description,
      imageUrl: menuEditor.imageUrl,
      available: true,
    };
    updateMenuItems((prevMenu) => [newItem, ...prevMenu]);
    cancelMenuEditor();
  };

  const handleDeleteMenuItem = (itemId: string) => {
    updateMenuItems((prevMenu) =>
      prevMenu.filter((item) => item.id !== itemId),
    );
    if (menuEditorMode?.type === "edit" && menuEditorMode.itemId === itemId) {
      cancelMenuEditor();
    }
  };

  const handleRestaurantFormSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (isCreatingRestaurant) {
      if (
        !restaurantForm.name ||
        !restaurantForm.address ||
        !restaurantForm.phoneNumber
      ) {
        return;
      }
      const newRestaurant: RestaurantFormData = {
        name: restaurantForm.name,
        address: restaurantForm.address,
        phoneNumber: restaurantForm.phoneNumber,
        websiteUrl: restaurantForm.websiteUrl,
        description: restaurantForm.description,
      };

      // Try to save this restaurant
      const createdRestaurant = await createRestaurant(newRestaurant);

      setRestaurants((prev) => [createdRestaurant, ...prev]);
      setActiveRestaurantId(createdRestaurant.id);
      setNewRestaurantMenu([]);
      const slug = toRouteSegment(createdRestaurant.id, RESTAURANT_PREFIX);
      navigate(`/restaurants/${slug}`);
      return;
    }
    if (!activeRestaurant) {
      return;
    }
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === activeRestaurant.id
          ? {
              ...restaurant,
              name: restaurantForm.name,
              address: restaurantForm.address,
              phoneNumber: restaurantForm.phoneNumber,
              websiteUrl: restaurantForm.websiteUrl,
              description: restaurantForm.description,
              cuisine: restaurantForm.cuisine,
            }
          : restaurant,
      ),
    );
  };

  return (
    <div className="dashboard">
      <Sidebar activeItem="restaurants" />
      <div className="workspace">
        <section className="panel runs-panel full-panel">
          <div className="panel-head">
            <div className="panel-head-main">
              {viewingDetail && (
                <button
                  className="back-link"
                  onClick={
                    isEditingMenu ? cancelMenuEditor : handleBackToRestaurants
                  }
                  type="button"
                >
                  <span className="back-link-icon" aria-hidden="true">
                    ←
                  </span>
                  <span>
                    {isEditingMenu
                      ? `Back to ${activeRestaurant?.name ?? "details"}`
                      : "Back to restaurants"}
                  </span>
                </button>
              )}
              {!isEditingMenu && (
                <div className="panel-title-stack">
                  <div className="panel-title-row">
                    <h2>{panelTitle}</h2>
                  </div>
                  <p className="panel-subtitle">{panelSubtitle}</p>
                </div>
              )}
            </div>
            {!viewingDetail && (
              <div className="panel-head-actions">
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={handleBeginCreateRestaurant}
                >
                  New restaurant
                </button>
              </div>
            )}
          </div>

          <div className="runs-grid">
            {!viewingDetail && (
              <div className="restaurant-directory scrollable">
                <section className="restaurant-directory-section">
                  <div className="restaurant-list-head">
                    <div>
                      <h3>My Restaurants</h3>
                      <p className="muted-label">
                        Manage kitchens you already partner with.
                      </p>
                    </div>
                    <span className="count-pill">{restaurants.length}</span>
                  </div>
                  <RestaurantList
                    restaurants={restaurants}
                    onSelect={handleSelectRestaurant}
                    emptyMessage="No restaurants yet. Add one to begin."
                  />
                </section>

                <section className="restaurant-directory-section">
                  <div className="restaurant-list-head">
                    <div>
                      <h3>Restaurants Near Me</h3>
                      <p className="muted-label">
                        Suggestions pulled from your current location.
                      </p>
                    </div>
                  </div>
                  <RestaurantList
                    restaurants={restaurantsNearMe}
                    emptyMessage="No nearby suggestions yet."
                  />
                </section>
              </div>
            )}

            {viewingDetail && (
              <div className="run-detail scrollable restaurant-detail">
                {isCreatingRestaurant ? (
                  menuEditorMode ? (
                    <RestaurantMenuEditor
                      mode={menuEditorMode}
                      draft={menuEditor}
                      onChange={handleMenuEditorChange}
                      onSubmit={handleMenuEditorSubmit}
                      onDelete={
                        menuEditorMode.type === "edit"
                          ? () => handleDeleteMenuItem(menuEditorMode.itemId)
                          : undefined
                      }
                    />
                  ) : (
                    <div className="restaurant-detail-stack">
                      <form
                        id="restaurant-meta-form"
                        className="restaurant-meta-form"
                        onSubmit={handleRestaurantFormSubmit}
                      >
                        <RestaurantFormFields
                          values={restaurantForm}
                          onChange={handleRestaurantFormChange}
                        />
                      </form>

                      <RestaurantMenuSection
                        menu={currentMenuItems}
                        title="Menu Items"
                        description="Build the starter lineup; items save with the restaurant."
                        onAddItem={beginAddMenuItem}
                        onSelectItem={beginEditMenuItem}
                      />

                      <div className="restaurant-meta-actions">
                        <div className="restaurant-meta-actions-primary">
                          <button
                            className="btn"
                            type="submit"
                            form="restaurant-meta-form"
                          >
                            Create restaurant
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                ) : activeRestaurant ? (
                  menuEditorMode ? (
                    <RestaurantMenuEditor
                      mode={menuEditorMode}
                      draft={menuEditor}
                      onChange={handleMenuEditorChange}
                      onSubmit={handleMenuEditorSubmit}
                      onDelete={
                        menuEditorMode.type === "edit"
                          ? () => handleDeleteMenuItem(menuEditorMode.itemId)
                          : undefined
                      }
                    />
                  ) : (
                    <div className="restaurant-detail-stack">
                      <form
                        id="restaurant-meta-form"
                        className="restaurant-meta-form"
                        onSubmit={handleRestaurantFormSubmit}
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
                          onChange={handleRestaurantFormChange}
                        />
                      </form>

                      <RestaurantMenuSection
                        menu={currentMenuItems}
                        onAddItem={beginAddMenuItem}
                        onSelectItem={beginEditMenuItem}
                      />

                      <div className="restaurant-meta-actions">
                        <div className="restaurant-meta-actions-primary">
                          <button
                            className="btn"
                            type="submit"
                            form="restaurant-meta-form"
                          >
                            Save details
                          </button>
                        </div>
                        <div className="restaurant-meta-actions-danger">
                          <button
                            className="btn btn-outline btn-danger"
                            type="button"
                            onClick={() =>
                              handleDeleteRestaurant(activeRestaurant.id)
                            }
                          >
                            Delete restaurant
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="blank-state">
                    <p className="muted-label">
                      Add a restaurant to begin managing menus.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Restaurants;
