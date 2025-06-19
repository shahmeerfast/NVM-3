interface Location {
  address: string;
  latitude: number;
  longitude: number;
  is_mountain_location: boolean;
}

interface ContactInfo {
  phone: string;
  email: string;
  website: string;
}

interface TastingInfo {
  price_range: [number, number];
  available_times: string[];
  wine_types: string[];
  number_of_wines_per_tasting: [number, number];
  special_features: string[];
  food_pairings_available: boolean;
}

interface WineDetail {
  wine_id: string;
  name: string;
  type: string;
  year: number;
  tasting_notes: string;
  pairing_suggestions: string[];
}

interface BookingSlot {
  date: string;
  times: string[];
}

interface DynamicPricing {
  enabled: boolean;
  weekend_multiplier: number;
}

interface BookingInfo {
  booking_enabled: boolean;
  max_guests_per_slot: number;
  dynamic_pricing: DynamicPricing;
  available_slots: string[];
}

interface Amenities {
  virtual_sommelier: boolean;
  augmented_reality_tours: boolean;
  handicap_accessible: boolean;
}

interface UserReview {
  review_id: string;
  user_id: string;
  rating: number;
  comment: string;
}

interface Transportation {
  uber_availability: boolean;
  lyft_availability: boolean;
  distance_from_user: number;
}

export interface Winery {
  _id?: string;
  name: string;
  location: Location;
  contact_info: ContactInfo;
  description: string;
  images: string[];
  tasting_info: TastingInfo;
  wine_details: WineDetail[];
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