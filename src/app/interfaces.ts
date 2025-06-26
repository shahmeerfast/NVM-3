// Location.ts
export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  is_mountain_location: boolean;
}

// ContactInfo.ts
export interface ContactInfo {
  phone: string;
  email: string;
  website: string;
}

// FoodPairingOption.ts
export interface FoodPairingOption {
  id: string;
  name: string;
  price: number;
}

export interface Tastings {
  id: string
  name: string;
  description: string;
  price: number;
  time_slots: string;
}
// TastingInfo.ts
export interface TastingInfo {
  tasting_price: number;
  available_times: string[];
  wine_types: string[];
  number_of_wines_per_tasting: [number, number];
  special_features: string[];
}

// Tours.ts
export interface Tours {
  available: boolean;
  tour_price: number;
  tour_options: { description: string; cost: number }[];
}

// WineDetail.ts
export interface WineDetail {
  id: string;
  name: string;
  cost: number;
}


// DynamicPricing.ts
export interface DynamicPricing {
  enabled: boolean;
  weekend_multiplier: number;
}

// BookingInfo.ts
export interface BookingInfo {
  booking_enabled: boolean;
  max_guests_per_slot: number;
  number_of_people: number;
  dynamic_pricing: DynamicPricing;
  available_slots: string[];
  external_booking_link?: string;
  additional_guests: { description: string; cost: number }[];
  payment_method: string
}

// Amenities.ts
export interface Amenities {
  virtual_sommelier: boolean;
  augmented_reality_tours: boolean;
  handicap_accessible: boolean;
}

// UserReview.ts
export interface UserReview {
  review_id: string;
  user_id: string;
  rating: number;
  comment: string;
}

// Transportation.ts
export interface Transportation {
  uber_availability: boolean;
  lyft_availability: boolean;
  distance_from_user: number;
}

// Winery.ts
export interface Winery {
  _id?: string;
  name: string;
  location: Location;
  contact_info: ContactInfo;
  description: string;
  images: string[];
  tasting_info: TastingInfo;
  food_pairing_options: FoodPairingOption[];
  tours: Tours;
  wine_details: WineDetail[];
  tastings: Tastings[];
  ava: string;
  booking_info: BookingInfo;
  amenities: Amenities;
  user_reviews: UserReview[];
  transportation: Transportation;
}


// interface Winery {
//   winery_id: string;
//   name: string;
//   description: string;
//   location: {
//     address: string;
//     latitude: number;
//     longitude: number;
//     is_mountain_location: boolean;
//   };
//   contact_info: {
//     email: string;
//     phone: string;
//     website: string;
//   };
//   images: File[];
//   tasting_info: {
//     price_range: { min: number; max: number };
//     available_times: string[];
//     wine_types: string[];
//     number_of_wines_per_tasting: number;
//     special_features: string[];
//     food_pairings_available: boolean;
//   };
//   wine_details: {
//     wine_id: string;
//     name: string;
//     type: string;
//     year: number;
//     tasting_notes: string;
//     pairing_suggestions: string[];
//   }[];
//   ava: string;
//   booking_info: {
//     booking_enabled: boolean;
//     max_guests_per_slot: number;
//     dynamic_pricing: { enabled: boolean; weekend_multiplier: number };
//     available_slots: string[];
//   };
//   amenities: {
//     virtual_sommelier: boolean;
//     augmented_reality_tours: boolean;
//     handicap_accessible: boolean;
//   };
//   user_reviews: any[];
//   transportation: {
//     uber_availability: boolean;
//     lyft_availability: boolean;
//     distance_from_user: number;
//   };
// }