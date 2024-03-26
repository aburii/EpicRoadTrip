interface GeocodedWaypoint {
  geocoder_status: string;
  place_id: string;
  types: string[];
}

interface Distance {
  text: string;
  value: number;
}

interface Duration {
  text: string;
  value: number;
}

interface EndLocation {
  lat: number;
  lng: number;
}

interface Distance2 {
  text: string;
  value: number;
}

interface Duration2 {
  text: string;
  value: number;
}

interface Southwest {
  lat: number;
  lng: number;
}

interface Northeast {
  lat: number;
  lng: number;
}

interface Bounds {
  northeast: Northeast;
  southwest: Southwest;
}

interface StartLocation {
  lat: number;
  lng: number;
}

interface EndLocation2 {
  lat: number;
  lng: number;
}

interface Polyline {
  points: string;
}

interface StartLocation2 {
  lat: number;
  lng: number;
}

interface OverviewPolyline {
  points: string;
}

interface Step {
  distance: Distance2;
  duration: Duration2;
  end_location: EndLocation2;
  html_instructions: string;
  polyline: Polyline;
  start_location: StartLocation2;
  travel_mode: string;
  maneuver?: string;
}

interface Leg {
  distance: Distance;
  duration: Duration;
  end_address: string;
  end_location: EndLocation;
  start_address: string;
  start_location: StartLocation;
  steps: Step[];
  traffic_speed_entry: any[];
  via_waypoint: any[];
}

interface Route {
  bounds: Bounds;
  copyrights: string;
  legs: Leg[];
  overview_polyline: OverviewPolyline;
  summary: string;
  warnings: any[];
  waypoint_order: number[];
}

export interface DirectionsRes {
  geocoded_waypoints: GeocodedWaypoint[];
  routes: Route[];
  status: string;
}
