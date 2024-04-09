import { DirectionsRes, directionsUrl, PlacesRes, placesUrl } from '@roadtrip/google-api';

type QueryType = {
  places_type?: 'lodging' | 'museum' | 'restaurant';
  origin: string;
  destination: string;
  waypoints?: string;
  date_start?: Date;
  date_end?: Date;
};

type StepType = {
  distance: number;
  start_location: {
    lat: number;
    lng: number;
  };
  end_location: {
    lat: number;
    lng: number;
  };
};

type RouteType = {
  name: string;
  lat: number;
  long: number;
  steps: StepType[];
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
  formatted_address?: string;
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

  if (directions.status !== 'OK') {
    return {
      status: directions.status,
      routes,
      places,
    };
  }

  let roadDistance = 0;
  directions?.routes[0].legs.forEach((leg) => {
    roadDistance += leg.distance.value / 1000;
  });

  directions?.routes[0]?.legs.forEach((leg) => {
    const steps = leg.steps.map((step) => ({
      distance: Math.round(step.distance.value / 1000),
      start_location: {
        lat: step.start_location.lat,
        lng: step.start_location.lng,
      },
      end_location: {
        lat: step.end_location.lat,
        lng: step.end_location.lng,
      },
      polyline: step.polyline.points,
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

  const placesSteps: StepType[] = [];
  const allSteps: StepType[] = routes.reduce<StepType[]>(
    (acc, route) => acc.concat(route.steps),
    [],
  );
  for (let i = 0; i < allSteps.length; i++) {
    let sum = 0;
    if (allSteps[i].distance + sum >= roadDistance / 10) {
      placesSteps.push(allSteps[i]);
      sum = 0;
    }
    sum += allSteps[i].distance;
  }

  const lastRoute = routes[routes.length - 1];
  routes = routes.filter((route) => route.steps.length > 0);
  routes.push(lastRoute);

  for (let i = 0; i < placesSteps.length; i++) {
    const placesStep = placesSteps[i];
    const placesFetched: PlacesRes = await $fetch(placesUrl, {
      method: 'GET',
      query: {
        location: `${i % 2 === 0 ? placesStep.start_location.lat : placesStep.end_location.lat},${i % 2 === 0 ? placesStep.start_location.lng : placesStep.end_location.lng}`,
        type: 'museum',
        radius: 10000,
        key: config.googleApiKey,
      },
    });
    for (let j = 0; j < placesFetched.results.length; j++) {
      const result = placesFetched.results[j];
      places.push({
        name: result.name,
        lat: result.geometry.location.lat,
        long: result.geometry.location.lng,
        rating: result.rating,
        isOpen: result.opening_hours?.open_now as boolean,
        imgRef: result.photos ? result.photos[0].photo_reference : '',
        price_level: result.price_level as number,
        types: result.types,
        formatted_address: result.vicinity,
      });
    }
  }

  return {
    status: directions.status === 'OK' ? 'OK' : 'FAIL',
    routes,
    places,
  };
});
