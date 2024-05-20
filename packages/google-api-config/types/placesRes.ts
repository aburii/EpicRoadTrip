export interface PlacesRes {
  html_attributions: any[];
  next_page_token: string;
  results: Result[];
  status: string;
}

interface Result {
  business_status: string;
  geometry: Geometry;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  opening_hours?: OpeningHours;
  photos: Photo[];
  place_id: string;
  plus_code: PlusCode;
  rating: number;
  reference: string;
  scope: string;
  types: string[];
  user_ratings_total: number;
  vicinity: string;
  price_level?: number;
  permanently_closed?: boolean;
}

export interface NearbyRes {
  summary: NearbySummary;
  results: NearbyResult[];
}

export interface NearbySummary {
  numResults: number;
  totalResults: number;
}

export interface NearbyResult {
  type: "POI";
  id: string;
  poi: {
    name: string;
    phone: string;
    brands: { brands: string }[];
    url: string;
    categorySet: string;
    categories: string[];
    classifications: string[];
  };
  address: {
    streetName: string;
    streetNumber: string;
    municipality: string;
    countryCode: string;
    country: string;
    freeFormAddress: string;
    localName: string;
  };
  position: {
    lat: number;
    lon: number;
  };
}

interface Geometry {
  location: Location;
  viewport: Viewport;
}

interface Location {
  lat: number;
  lng: number;
}

interface Viewport {
  northeast: Northeast;
  southwest: Southwest;
}

interface Northeast {
  lat: number;
  lng: number;
}

interface Southwest {
  lat: number;
  lng: number;
}

interface OpeningHours {
  open_now: boolean;
}

interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

interface PlusCode {
  compound_code: string;
  global_code: string;
}
