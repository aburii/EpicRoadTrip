import { DirectionsRes, directionsUrl, PlacesRes, placesUrl } from '@roadtrip/google-api';

type QueryType = {
  places_type?: 'restaurant' | 'hotel' | 'activity' | 'bar';
  origin: string;
  destination: string;
  waypoints?: string;
  date_start?: Date;
  date_end?: Date;
};

type RouteType = {
  name: string;
  lat: number;
  long: number;
  steps: {
    start_location: {
      lat: number;
      lng: number;
    };
    end_location: {
      lat: number;
      lng: number;
    };
  }[];
};

type PlaceType = {
  name: string;
  lat: number;
  long: number;
  rating: number;
  imgRef: string;
  isOpen: boolean;
  price_level: number;
  types: string[];
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const places: PlaceType[] = [];
  let routes: RouteType[] = [];

  const query: QueryType = getQuery(event);
  const directions: DirectionsRes = await $fetch(directionsUrl, {
    method: 'GET',
    query: {
      origin: query.origin,
      destination: query.destination,
      waypoints: query.waypoints,
      key: config.googleApiKey,
      optimize: true,
    },
  });
  directions?.routes[0].legs.forEach((leg) => {
    const steps = leg.steps.map((step) => ({
      start_location: {
        lat: step.start_location.lat,
        lng: step.start_location.lng,
      },
      end_location: {
        lat: step.end_location.lat,
        lng: step.end_location.lng,
      },
    }));
    routes.push({
      name: leg.start_address,
      lat: leg.start_location.lat,
      long: leg.start_location.lng,
      steps,
    });
    routes.push({
      name: leg.end_address,
      lat: leg.end_location.lat,
      long: leg.end_location.lng,
      steps: [],
    });
  });

  const lastRoute = routes[routes.length - 1];
  routes = routes.filter((route) => route.steps.length > 0);
  routes.push(lastRoute);

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const place: PlacesRes = await $fetch(placesUrl, {
      method: 'GET',
      query: {
        location: `${route.lat},${route.long}`,
        type: query.places_type,
        radius: 1000,
        key: config.googleApiKey,
      },
    });
    place.results.forEach((result) => {
      places.push({
        name: result.name,
        lat: result.geometry.location.lat,
        long: result.geometry.location.lng,
        rating: result.rating,
        isOpen: result.opening_hours?.open_now as boolean,
        imgRef: result.photos ? result.photos[0].photo_reference : '',
        price_level: result.price_level as number,
        types: result.types,
      });
    });
  }

  return {
    status: directions.status === 'OK' ? 'OK' : 'FAIL',
    routes,
    places,
  };
});

/*
# QUERY

- places_type : "restaurant" | "Hotel" | "activity" | "Bar"
- origin : string
- destination : string
- waypoints : string[]
- date_debut : string
- date_fin : string

# RESPONSE

- status : "OK" | "ZERO_RESULTS" | "OVER_QUERY_LIMIT" | "REQUEST_DENIED" | "INVALID_REQUEST" | "UNKNOWN_ERROR"
- routes: Route[]
- places: Place[]

*/
