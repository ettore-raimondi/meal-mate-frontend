import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import type { MenuItem, Restaurant } from "../../components/homeTypes";
import {
  emptyMenuDraft,
  emptyRestaurantForm,
  type MenuDraftMode,
  type MenuDraftState,
  type RestaurantFormState,
} from "./types";
import {
  createRestaurant,
  deleteRestaurant,
  fetchRestaurants,
  fetchRestaurantsNearMe,
  updateRestaurant,
} from "../../services/restaurant/restaurant.service";
import { fetchCoordinates } from "../../helpers/get-coordinates";
import {
  deleteMenuItem,
  getMenuItemsForRestaurant,
  saveMenuItems,
  scrapeMenuItems,
  updateMenuItems as updateMenuItemsService,
} from "../../services/menu-item";
import { confirmToast } from "../../components/toast/confirmToast";
import { toast } from "sonner";
import PanelHeader from "./components/PanelHeader";
import RestaurantDirectoryPanel from "./components/RestaurantDirectoryPanel";
import RestaurantDetailPanel, {
  type RestaurantDetailActions,
  type RestaurantDetailState,
} from "./components/RestaurantDetailPanel";
import {
  NEW_RESTAURANT_SLUG,
  type RestaurantCollection,
  useRestaurantCollections,
  useRestaurantSelection,
} from "./hooks";
import type { RestaurantFormData } from "../../services/restaurant";

let nextTempMenuItemId = -1;
const generateMenuItemTempId = () => nextTempMenuItemId--;

const toRestaurantFormState = (
  restaurant?: Partial<Restaurant> | null,
): RestaurantFormState => ({
  name: restaurant?.name ?? "",
  address: restaurant?.address ?? "",
  phoneNumber: restaurant?.phoneNumber ?? "",
  websiteUrl: restaurant?.websiteUrl ?? "",
  description: restaurant?.description ?? "",
});

function Restaurants() {
  const navigate = useNavigate();
  const { restaurantNumber } = useParams<{ restaurantNumber?: string }>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantsNearMe, setRestaurantsNearMe] = useState<Restaurant[]>([]);
  const [menuEditorMode, setMenuEditorMode] = useState<MenuDraftMode | null>(
    null,
  );
  const [menuEditor, setMenuEditor] = useState<MenuDraftState>(emptyMenuDraft);
  const [restaurantForm, setRestaurantForm] =
    useState<RestaurantFormState>(emptyRestaurantForm);
  const [newRestaurantMenu, setNewRestaurantMenu] = useState<MenuItem[]>([]);
  const [isSavingNearby, setIsSavingNearby] = useState(false);

  const {
    addRestaurantToCollection,
    updateRestaurantInCollection,
    removeRestaurantFromCollection,
  } = useRestaurantCollections(setRestaurants, setRestaurantsNearMe);

  const {
    isCreatingRestaurant,
    viewingDetail,
    restaurantRouteId,
    activeRestaurant,
    activeRestaurantSource,
  } = useRestaurantSelection(restaurantNumber, restaurants, restaurantsNearMe);

  const currentMenuItems = isCreatingRestaurant
    ? newRestaurantMenu
    : (activeRestaurant?.menu ?? []);
  const isNearbyRestaurantDetail =
    activeRestaurantSource === "nearby" &&
    viewingDetail &&
    !isCreatingRestaurant;
  const isEditingMenu = Boolean(menuEditorMode);

  useEffect(() => {
    if (!restaurantRouteId) {
      return;
    }
    if (
      !activeRestaurant &&
      (restaurants.length > 0 || restaurantsNearMe.length > 0)
    ) {
      navigate("/restaurants", { replace: true });
    }
  }, [
    restaurantRouteId,
    activeRestaurant,
    restaurants.length,
    restaurantsNearMe.length,
    navigate,
  ]);

  useEffect(() => {
    if (isCreatingRestaurant) {
      setRestaurantForm(emptyRestaurantForm);
      setNewRestaurantMenu([]);
      return;
    }
    if (activeRestaurant) {
      setRestaurantForm(toRestaurantFormState(activeRestaurant));
    } else {
      setRestaurantForm(emptyRestaurantForm);
    }
  }, [activeRestaurant, isCreatingRestaurant]);

  useEffect(() => {
    setMenuEditorMode(null);
    setMenuEditor(emptyMenuDraft);
  }, [restaurantNumber]);

  useEffect(() => {
    if (!viewingDetail) {
      setMenuEditorMode(null);
      setMenuEditor(emptyMenuDraft);
    }
  }, [viewingDetail]);

  useEffect(() => {
    const fetchData = async () => {
      const coordinates = await fetchCoordinates();
      if (coordinates) {
        const { latitude, longitude } = coordinates;
        const nearbyRestaurants = await fetchRestaurantsNearMe(
          latitude,
          longitude,
        );
        const normalized = nearbyRestaurants.map((restaurant) => ({
          ...restaurant,
          menu: restaurant.menu ?? [],
        }));
        setRestaurantsNearMe(normalized);
      }

      const restaurants = await fetchRestaurants();
      setRestaurants(restaurants);
    };
    fetchData();
  }, []);

  const panelTitle = isCreatingRestaurant
    ? "Add Restaurant"
    : viewingDetail && activeRestaurant && !isEditingMenu
      ? activeRestaurant.name
      : "Restaurants";

  const panelSubtitle = isCreatingRestaurant
    ? "List a new kitchen and get it ready for runs."
    : viewingDetail && activeRestaurant && !isEditingMenu
      ? isNearbyRestaurantDetail
        ? `${activeRestaurant.address} · Suggested nearby kitchen`
        : `${activeRestaurant.address} · ${activeRestaurant.cuisine}`
      : "Browse all partner kitchens.";

  const handleSelectRestaurant = async (restaurantId: number) => {
    try {
      const menuItems = await getMenuItemsForRestaurant(restaurantId);
      updateRestaurantInCollection("owned", restaurantId, (restaurant) => ({
        ...restaurant,
        menu: menuItems,
      }));
    } catch (error) {
      console.error("Failed to load menu items:", error);
      toast.error("Couldn't load the latest menu items.");
    } finally {
      navigate(`/restaurants/${restaurantId}`);
    }
  };

  const handleSelectNearbyRestaurant = (restaurantId: number) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  const handleBackToRestaurants = () => {
    navigate("/restaurants");
  };

  const handleBeginCreateRestaurant = () => {
    setMenuEditorMode(null);
    setMenuEditor(emptyMenuDraft);
    navigate(`/restaurants/${NEW_RESTAURANT_SLUG}`);
  };

  const validateRequiredFields = (
    context: "create" | "saveNearby",
  ): boolean => {
    const missingField =
      (!restaurantForm.name && "name") ||
      (!restaurantForm.address && "address") ||
      (!restaurantForm.phoneNumber && "phone number");

    if (missingField) {
      const intent =
        context === "create"
          ? "creating a restaurant"
          : "saving to My Restaurants";
      toast.error(`Add a ${missingField} before ${intent}.`);
      return false;
    }
    return true;
  };

  const requestRestaurantDeletion = async () => {
    if (!activeRestaurant) {
      return;
    }
    const confirmed = await confirmToast({
      title: isNearbyRestaurantDetail
        ? "Remove suggestion?"
        : "Delete restaurant?",
      description: isNearbyRestaurantDetail
        ? `This only removes ${activeRestaurant.name} from nearby suggestions.`
        : `This permanently deletes ${activeRestaurant.name} and its menu items.`,
      confirmLabel: isNearbyRestaurantDetail ? "Remove" : "Delete",
      cancelLabel: "Cancel",
      tone: "danger",
    });
    if (!confirmed) {
      return;
    }
    await handleDeleteRestaurant(activeRestaurant.id);
  };

  const handleDeleteRestaurant = async (restaurantId: number) => {
    const source: RestaurantCollection =
      activeRestaurantSource ??
      (restaurantsNearMe.some((restaurant) => restaurant.id === restaurantId)
        ? "nearby"
        : "owned");

    try {
      await deleteRestaurant(restaurantId);
      removeRestaurantFromCollection(source, restaurantId);
      navigate("/restaurants");
    } catch (error) {
      console.error("Failed to delete restaurant:", error);
    }
  };

  const handleScrapeMenuItems = async (websiteUrl: string) => {
    const menuItems = await scrapeMenuItems(websiteUrl);
    console.log("Scraped menu items:", menuItems);
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
    if (!activeRestaurant || !activeRestaurantSource) {
      return;
    }
    updateRestaurantInCollection(
      activeRestaurantSource,
      activeRestaurant.id,
      (restaurant) => ({
        ...restaurant,
        menu: updater(restaurant.menu ?? []),
      }),
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
        prevMenu.map((item) => {
          if (item.id !== targetId) {
            return item;
          }
          const nextClientState =
            item.clientState === "new" ? "new" : "toUpdate";
          return { ...item, ...menuEditor, clientState: nextClientState };
        }),
      );
      cancelMenuEditor();
      return;
    }

    const newItem: MenuItem = {
      id: generateMenuItemTempId(),
      name: menuEditor.name,
      price: menuEditor.price,
      description: menuEditor.description,
      imageUrl: menuEditor.imageUrl,
      clientState: "new",
    };
    updateMenuItems((prevMenu) => [newItem, ...prevMenu]);
    cancelMenuEditor();
  };

  const handleDeleteMenuItem = async (itemId: number) => {
    const sourceMenu = isCreatingRestaurant
      ? newRestaurantMenu
      : (activeRestaurant?.menu ?? []);
    const targetItem = sourceMenu.find((item) => item.id === itemId);

    const confirmed = await confirmToast({
      title: "Delete menu item?",
      description: targetItem
        ? `This removes ${targetItem.name} from the menu.`
        : "This removes the item from the menu.",
      confirmLabel: "Delete item",
      cancelLabel: "Cancel",
      tone: "danger",
    });

    if (!confirmed) {
      return;
    }

    if (itemId > 0) {
      await deleteMenuItem(itemId);
    }

    updateMenuItems((prevMenu) =>
      prevMenu.filter((item) => item.id !== itemId),
    );
    if (menuEditorMode?.type === "edit" && menuEditorMode.itemId === itemId) {
      cancelMenuEditor();
    }
  };

  const handleCreateRestaurant = async (restaurantForm: RestaurantFormData) => {
    if (!validateRequiredFields("create")) {
      return;
    }

    const createdRestaurant = await createRestaurant(restaurantForm);
    let createdMenuItems: MenuItem[] = [];
    if (newRestaurantMenu.length > 0) {
      createdMenuItems = await saveMenuItems(
        createdRestaurant.id,
        newRestaurantMenu,
      );
    }

    addRestaurantToCollection("owned", {
      ...createdRestaurant,
      menu: createdMenuItems,
    });
    setNewRestaurantMenu([]);
    navigate(`/restaurants/${createdRestaurant.id}`);
    toast.success(`${createdRestaurant.name} has been created.`);
  };

  const handleUpdateRestaurant = async (restaurantForm: RestaurantFormData) => {
    if (!activeRestaurant || !activeRestaurantSource) {
      return;
    }

    const updatedRestaurant = await updateRestaurant(
      activeRestaurant.id,
      restaurantForm,
    );

    const updatedMenuItems = await updateMenuItemsService(
      activeRestaurant.id,
      activeRestaurant.menu ?? [],
    );

    updateRestaurantInCollection(
      activeRestaurantSource,
      activeRestaurant.id,
      (restaurant) => ({
        ...restaurant,
        ...updatedRestaurant,
        menu: updatedMenuItems,
      }),
    );
    toast.success(`${updatedRestaurant.name} has been updated.`);
  };

  const handleRestaurantFormSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (isCreatingRestaurant) {
      await handleCreateRestaurant(restaurantForm);
      return;
    }
    await handleUpdateRestaurant(restaurantForm);
  };

  const handleSaveNearbyRestaurant = async () => {
    if (
      !activeRestaurant ||
      activeRestaurantSource !== "nearby" ||
      isSavingNearby
    ) {
      return;
    }
    if (!validateRequiredFields("saveNearby")) {
      return;
    }
    setIsSavingNearby(true);
    try {
      const payload: RestaurantFormData = {
        name: restaurantForm.name,
        address: restaurantForm.address,
        phoneNumber: restaurantForm.phoneNumber,
        websiteUrl: restaurantForm.websiteUrl,
        description: restaurantForm.description,
        ...(activeRestaurant.googlePlacesId
          ? { googlePlacesId: activeRestaurant.googlePlacesId }
          : {}),
      };
      const createdRestaurant = await createRestaurant(payload);
      addRestaurantToCollection("owned", createdRestaurant);
      removeRestaurantFromCollection("nearby", activeRestaurant.id);
      navigate(`/restaurants/${createdRestaurant.id}`);
      toast.success(`${createdRestaurant.name} saved to My Restaurants.`);
    } catch (error) {
      console.error("Failed to save nearby restaurant", error);
      toast.error("Could not save that restaurant. Please try again.");
    } finally {
      setIsSavingNearby(false);
    }
  };

  const detailState: RestaurantDetailState = {
    viewingDetail,
    isCreatingRestaurant,
    menuEditorMode,
    menuEditor,
    restaurantForm,
    currentMenuItems,
    activeRestaurant,
    isNearbyRestaurantDetail,
    isSavingNearby,
  };

  const detailActions: RestaurantDetailActions = {
    onMenuEditorChange: handleMenuEditorChange,
    onMenuEditorSubmit: handleMenuEditorSubmit,
    onMenuEditorDelete:
      menuEditorMode?.type === "edit"
        ? () => {
            void handleDeleteMenuItem(menuEditorMode.itemId);
          }
        : undefined,
    onCancelMenuEditor: cancelMenuEditor,
    onRestaurantFormChange: handleRestaurantFormChange,
    onRestaurantFormSubmit: handleRestaurantFormSubmit,
    beginAddMenuItem,
    beginEditMenuItem,
    onDeleteMenuItem: (item) => {
      void handleDeleteMenuItem(item.id);
    },
    onSaveNearbyRestaurant: handleSaveNearbyRestaurant,
    onDeleteRestaurant: activeRestaurant
      ? requestRestaurantDeletion
      : undefined,
    onScrapeMenuItems: handleScrapeMenuItems,
  };

  return (
    <div className="dashboard">
      <Sidebar activeItem="restaurants" />
      <div className="workspace">
        <section className="panel runs-panel full-panel">
          <PanelHeader
            viewingDetail={viewingDetail}
            isEditingMenu={isEditingMenu}
            panelTitle={panelTitle}
            panelSubtitle={panelSubtitle}
            activeRestaurantName={activeRestaurant?.name}
            onBack={isEditingMenu ? cancelMenuEditor : handleBackToRestaurants}
            onBeginCreate={handleBeginCreateRestaurant}
          />

          <div className="runs-grid">
            {viewingDetail ? (
              <RestaurantDetailPanel
                state={detailState}
                actions={detailActions}
              />
            ) : (
              <RestaurantDirectoryPanel
                owned={restaurants}
                nearby={restaurantsNearMe}
                onSelectOwned={handleSelectRestaurant}
                onSelectNearby={handleSelectNearbyRestaurant}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
export default Restaurants;
