import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { MenuItem, Restaurant } from "./homeTypes";
import { restaurantSeed } from "../data/restaurants";

const RESTAURANT_PREFIX = "rest-";
const MENU_PREFIX = "m-";

const toRouteSegment = (id: string, prefix: string) =>
  id.replace(new RegExp(`^${prefix}`, "i"), "");

const fromRouteSegment = (segment: string | undefined, prefix: string) => {
  if (!segment) {
    return undefined;
  }
  return segment.startsWith(prefix) ? segment : `${prefix}${segment}`;
};

const emptyMenuDraft = {
  name: "",
  price: "",
  imageUrl: "",
  description: "",
};

const emptyRestaurantForm = {
  name: "",
  address: "",
  phoneNumber: "",
  websiteUrl: "",
  description: "",
  cuisine: "",
};

type MenuDraftState = typeof emptyMenuDraft;
type RestaurantFormState = typeof emptyRestaurantForm;
type MenuDraftMode = { type: "add" } | { type: "edit"; itemId: string };

function Restaurants() {
  const navigate = useNavigate();
  const { restaurantNumber } = useParams<{ restaurantNumber?: string }>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>(restaurantSeed);
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(
    restaurantSeed[0]?.id ?? null,
  );
  const [menuDraftMode, setMenuDraftMode] = useState<MenuDraftMode | null>(
    null,
  );
  const [menuDraft, setMenuDraft] = useState<MenuDraftState>(emptyMenuDraft);
  const [restaurantForm, setRestaurantForm] =
    useState<RestaurantFormState>(emptyRestaurantForm);

  const routeRestaurantId = fromRouteSegment(
    restaurantNumber,
    RESTAURANT_PREFIX,
  );
  const effectiveRestaurantId = routeRestaurantId ?? activeRestaurantId;
  const viewingDetail = Boolean(routeRestaurantId);
  const activeRestaurant = useMemo(
    () =>
      restaurants.find((restaurant) => restaurant.id === effectiveRestaurantId),
    [restaurants, effectiveRestaurantId],
  );

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
    setMenuDraftMode(null);
    setMenuDraft(emptyMenuDraft);
  }, [activeRestaurantId]);

  useEffect(() => {
    if (!viewingDetail) {
      setMenuDraftMode(null);
      setMenuDraft(emptyMenuDraft);
    }
  }, [viewingDetail]);

  useEffect(() => {
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
  }, [activeRestaurant]);

  const isEditingMenu = Boolean(menuDraftMode);

  const panelTitle =
    viewingDetail && activeRestaurant && !isEditingMenu
      ? activeRestaurant.name
      : "Restaurants";

  const panelSubtitle =
    viewingDetail && activeRestaurant && !isEditingMenu
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

  const updateRestaurantMenu = (
    updater: (previous: MenuItem[], restaurant: Restaurant) => MenuItem[],
  ) => {
    if (!effectiveRestaurantId) {
      return;
    }
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === effectiveRestaurantId
          ? { ...restaurant, menu: updater(restaurant.menu, restaurant) }
          : restaurant,
      ),
    );
  };

  const beginAddMenuItem = () => {
    setMenuDraft(emptyMenuDraft);
    setMenuDraftMode({ type: "add" });
  };

  const beginEditMenuItem = (item: MenuItem) => {
    setMenuDraft({
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl ?? "",
      description: item.description,
    });
    setMenuDraftMode({ type: "edit", itemId: item.id });
  };

  const cancelMenuDraft = () => {
    setMenuDraft(emptyMenuDraft);
    setMenuDraftMode(null);
  };

  const handleMenuDraftChange = (
    field: keyof MenuDraftState,
    value: string,
  ) => {
    setMenuDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleMenuDraftSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !menuDraft.name ||
      !menuDraft.price ||
      !effectiveRestaurantId ||
      !menuDraftMode
    ) {
      return;
    }

    if (menuDraftMode.type === "edit") {
      const targetId = menuDraftMode.itemId;
      updateRestaurantMenu((prevMenu) =>
        prevMenu.map((item) =>
          item.id === targetId ? { ...item, ...menuDraft } : item,
        ),
      );
      cancelMenuDraft();
      return;
    }

    const randomId = globalThis.crypto?.randomUUID?.() ?? Date.now().toString();
    const newItem: MenuItem = {
      id: `${MENU_PREFIX}${randomId}`,
      name: menuDraft.name,
      price: menuDraft.price,
      description: menuDraft.description,
      imageUrl: menuDraft.imageUrl,
      available: true,
    };
    updateRestaurantMenu((prevMenu) => [newItem, ...prevMenu]);
    cancelMenuDraft();
  };

  const handleDeleteMenuItem = (itemId: string) => {
    updateRestaurantMenu((prevMenu) => {
      const nextMenu = prevMenu.filter((item) => item.id !== itemId);
      return nextMenu;
    });
    if (menuDraftMode?.type === "edit" && menuDraftMode.itemId === itemId) {
      cancelMenuDraft();
    }
  };

  const handleRestaurantFormChange = (
    field: keyof RestaurantFormState,
    value: string,
  ) => {
    setRestaurantForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRestaurantFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
                    menuDraftMode ? cancelMenuDraft : handleBackToRestaurants
                  }
                  type="button"
                >
                  <span className="back-link-icon" aria-hidden="true">
                    ←
                  </span>
                  <span>
                    {menuDraftMode
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
          </div>

          <div className="runs-grid">
            {!viewingDetail && (
              <div className="runs-list scrollable">
                {restaurants.length > 0 ? (
                  restaurants.map((restaurant) => (
                    <button
                      key={restaurant.id}
                      className="list-card run-card"
                      type="button"
                      onClick={() => handleSelectRestaurant(restaurant.id)}
                    >
                      <div className="run-card-head">
                        <h3>{restaurant.name}</h3>
                        <span className="muted-label">
                          {restaurant.menu.length} item
                          {restaurant.menu.length === 1 ? "" : "s"}
                        </span>
                      </div>
                      <p>{restaurant.cuisine}</p>
                      <div className="run-meta">
                        <span>{restaurant.address}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="blank-state">
                    <p className="muted-label">
                      No restaurants yet. Add one to begin.
                    </p>
                  </div>
                )}
              </div>
            )}

            {viewingDetail && (
              <div className="run-detail scrollable restaurant-detail">
                {activeRestaurant ? (
                  menuDraftMode ? (
                    <div className="restaurant-menu-editor">
                      <div className="menu-editor-header">
                        <h3>
                          {menuDraftMode.type === "edit"
                            ? "Edit menu item"
                            : "Add menu item"}
                        </h3>
                        <p className="muted-label">
                          {menuDraftMode.type === "edit"
                            ? "Update the details and save your changes."
                            : "Create a new dish for this restaurant."}
                        </p>
                      </div>
                      <form
                        className="menu-editor-card"
                        onSubmit={handleMenuDraftSubmit}
                      >
                        <div className="menu-inline-row">
                          <label>
                            Name
                            <input
                              value={menuDraft.name}
                              onChange={(event) =>
                                handleMenuDraftChange(
                                  "name",
                                  event.target.value,
                                )
                              }
                              placeholder="Menu item name"
                              required
                            />
                          </label>
                          <label>
                            Price
                            <input
                              value={menuDraft.price}
                              onChange={(event) =>
                                handleMenuDraftChange(
                                  "price",
                                  event.target.value,
                                )
                              }
                              placeholder="$12.00"
                              required
                            />
                          </label>
                        </div>
                        <label>
                          Image URL
                          <input
                            value={menuDraft.imageUrl}
                            onChange={(event) =>
                              handleMenuDraftChange(
                                "imageUrl",
                                event.target.value,
                              )
                            }
                            placeholder="https://example.com/photo.jpg"
                          />
                        </label>
                        <label>
                          Description
                          <textarea
                            value={menuDraft.description}
                            onChange={(event) =>
                              handleMenuDraftChange(
                                "description",
                                event.target.value,
                              )
                            }
                            rows={3}
                            placeholder="Describe the dish"
                          />
                        </label>
                        <div className="menu-inline-actions">
                          <div className="menu-inline-actions-primary">
                            <button className="btn" type="submit">
                              {menuDraftMode.type === "edit"
                                ? "Save item"
                                : "Create item"}
                            </button>
                          </div>
                          {menuDraftMode.type === "edit" && (
                            <div className="menu-inline-actions-danger">
                              <button
                                className="btn btn-outline btn-danger"
                                type="button"
                                onClick={() =>
                                  handleDeleteMenuItem(menuDraftMode.itemId)
                                }
                              >
                                Delete item
                              </button>
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
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
                        <div className="restaurant-meta-grid">
                          <label>
                            Name
                            <input
                              value={restaurantForm.name}
                              onChange={(event) =>
                                handleRestaurantFormChange(
                                  "name",
                                  event.target.value,
                                )
                              }
                              placeholder="Restaurant name"
                              required
                            />
                          </label>
                          <label>
                            Address
                            <input
                              value={restaurantForm.address}
                              onChange={(event) =>
                                handleRestaurantFormChange(
                                  "address",
                                  event.target.value,
                                )
                              }
                              placeholder="Street, neighborhood, or campus"
                              required
                            />
                          </label>
                          <label>
                            Phone number
                            <input
                              value={restaurantForm.phoneNumber}
                              onChange={(event) =>
                                handleRestaurantFormChange(
                                  "phoneNumber",
                                  event.target.value,
                                )
                              }
                              placeholder="(555) 123-4567"
                              required
                            />
                          </label>
                          <label>
                            Website URL
                            <input
                              value={restaurantForm.websiteUrl}
                              onChange={(event) =>
                                handleRestaurantFormChange(
                                  "websiteUrl",
                                  event.target.value,
                                )
                              }
                              placeholder="https://example.com"
                            />
                          </label>
                          <label>
                            Cuisine
                            <input
                              value={restaurantForm.cuisine}
                              onChange={(event) =>
                                handleRestaurantFormChange(
                                  "cuisine",
                                  event.target.value,
                                )
                              }
                              placeholder="Cuisine style"
                            />
                          </label>
                        </div>
                        <label>
                          Description
                          <textarea
                            value={restaurantForm.description}
                            onChange={(event) =>
                              handleRestaurantFormChange(
                                "description",
                                event.target.value,
                              )
                            }
                            rows={3}
                            placeholder="Short blurb about the kitchen"
                          />
                        </label>
                      </form>

                      <div className="restaurant-menu-layout">
                        <div className="menu-section-head">
                          <div>
                            <h4>Menu Items</h4>
                            <p className="muted-label">
                              Keep this restaurant lineup current.
                            </p>
                          </div>
                          <button
                            className="btn btn-ghost"
                            type="button"
                            onClick={beginAddMenuItem}
                          >
                            Add item
                          </button>
                        </div>
                        <p className="muted-label">
                          {activeRestaurant.menu.length} item
                          {activeRestaurant.menu.length === 1 ? "" : "s"}
                        </p>

                        <div className="restaurant-menu-list-panel">
                          {activeRestaurant.menu.length > 0 ? (
                            <div className="restaurant-menu-grid menu-grid">
                              {activeRestaurant.menu.map((item) => (
                                <article
                                  key={item.id}
                                  className="menu-card list-card list-card--inline"
                                  onClick={() => beginEditMenuItem(item)}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === "Enter" ||
                                      event.key === " "
                                    ) {
                                      event.preventDefault();
                                      beginEditMenuItem(item);
                                    }
                                  }}
                                >
                                  <div className="menu-card-info">
                                    <h4>{item.name}</h4>
                                    <p>{item.price}</p>
                                  </div>
                                  <span
                                    className={`availability ${item.available ? "is-available" : "is-soldout"}`}
                                  >
                                    {item.available ? "Active" : "Hidden"}
                                  </span>
                                </article>
                              ))}
                            </div>
                          ) : (
                            <p className="muted-label">No menu items yet.</p>
                          )}
                        </div>
                      </div>

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
