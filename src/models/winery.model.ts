import mongoose from "mongoose";

// Winery Schema
const WinerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    is_mountain_location: { type: Boolean, required: true },
  },
  contact_info: {
    phone: { type: String },
    email: { type: String },
    website: { type: String },
  },
  description: { type: String },
  images: [{ type: String }],
  tasting_info: {
    price_range: [{ type: Number, min: 0 }],
    available_times: [{ type: String }],
    wine_types: [{ type: String }],
    number_of_wines_per_tasting: [{ type: Number, min: 0 }],
    special_features: [{ type: String }],
    food_pairings_available: { type: Boolean, default: false },
    tasting_options: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        price_per_guest: { type: Number, required: true, min: 0 },
      },
    ],
    food_pairing_options: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
  },
  wine_details: [
    {
      name: { type: String, required: true },
      type: { type: String },
      year: { type: Number, min: 0 },
      tasting_notes: { type: String },
      pairing_suggestions: [{ type: String }],
    },
  ],
  ava: { type: String },
  booking_info: {
    booking_enabled: { type: Boolean, default: false },
    max_guests_per_slot: { type: Number, min: 0 },
    number_of_people: { type: Number, min: 1, default: 1 },
    dynamic_pricing: {
      enabled: { type: Boolean, default: false },
      weekend_multiplier: { type: Number, min: 0 },
    },
    available_slots: [{ type: Date }],
    external_booking_link: { type: String },
  },
  amenities: {
    virtual_sommelier: { type: Boolean, default: false },
    augmented_reality_tours: { type: Boolean, default: false },
    handicap_accessible: { type: Boolean, default: false },
  },
  user_reviews: [
    {
      review_id: { type: String },
      user_id: { type: String },
      rating: { type: Number, min: 0, max: 5 },
      comment: { type: String },
    },
  ],
  transportation: {
    uber_availability: { type: Boolean, default: false },
    lyft_availability: { type: Boolean, default: false },
    distance_from_user: { type: Number, min: 0 },
  },
});

// Check if the model is already defined
const Winery = mongoose.models.Winery || mongoose.model("Winery", WinerySchema);

export default Winery;