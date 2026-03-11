import { Restaurant } from "../components/homeTypes";

export const restaurantSeed: Restaurant[] = [
  {
    id: "rest-1",
    name: "Pasta & Co.",
    address: "214 Market St, Downtown",
    phoneNumber: "(415) 555-0110",
    websiteUrl: "https://pastaandco.example",
    description: "Handmade pasta counter with rotating chef specials.",
    cuisine: "Italian",
    menu: [
      {
        id: "m-1",
        name: "Truffle Tagliatelle",
        price: "$18",
        available: true,
        imageUrl: "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f5ab?auto=format&fit=crop&w=400&q=80",
        description: "Hand-cut pasta, black truffle butter, parmesan snow.",
      },
      {
        id: "m-2",
        name: "Citrus Burrata",
        price: "$12",
        available: true,
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        description: "Blood orange, basil oil, toasted pistachio crumble.",
      },
      {
        id: "m-3",
        name: "Lemon Tiramisu",
        price: "$9",
        available: false,
        imageUrl: "https://images.unsplash.com/photo-1505253216365-2ec6c369ce78?auto=format&fit=crop&w=400&q=80",
        description: "Meyer lemon curd, mascarpone cloud, white chocolate dust.",
      },
    ],
  },
  {
    id: "rest-2",
    name: "Bao District",
    address: "98 Grove Ave, Uptown",
    phoneNumber: "(415) 555-0152",
    websiteUrl: "https://baodistrict.example",
    description: "Playful bao shop serving modern Asian street food.",
    cuisine: "Asian Street Food",
    menu: [
      {
        id: "m-4",
        name: "Miso Glazed Bao",
        price: "$11",
        available: true,
        imageUrl: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=400&q=80",
        description: "Steamed bao, caramelized miso glaze, pickled daikon.",
      },
      {
        id: "m-5",
        name: "Sesame Crunch Salad",
        price: "$10",
        available: true,
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",
        description:
          "Shaved cabbage, toasted sesame brittle, chili-lime vinaigrette.",
      },
    ],
  },
  {
    id: "rest-3",
    name: "Harvest Bowl",
    address: "455 Greenway, Midtown",
    phoneNumber: "(415) 555-0176",
    websiteUrl: "https://harvestbowl.example",
    description: "Seasonal bowls, hearty grains, and plant-forward sides.",
    cuisine: "Healthy Bowls",
    menu: [
      {
        id: "m-6",
        name: "Tahini Power Bowl",
        price: "$13",
        available: true,
        imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80",
        description: "Roasted sweet potato, chickpeas, lemon tahini drizzle.",
      },
      {
        id: "m-7",
        name: "Roasted Veggie Stack",
        price: "$14",
        available: true,
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        description: "Layered squash, herb pesto, smoked sea salt finish.",
      },
    ],
  },
];
