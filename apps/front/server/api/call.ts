import { DirectionsRes, directionsUrl, nearbySearchUrl, NearbyRes } from '@roadtrip/google-api';

type QueryType = {
  places_type?: string;
  origin: string;
  destination: string;
  waypoints?: string;
  language?: string;
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

    const placesFetched = await getNearbyPlaces(
      query,
      i % 2 === 0 ? placesStep.start_location.lat : placesStep.end_location.lat,
      i % 2 === 0 ? placesStep.start_location.lng : placesStep.end_location.lng,
      config.tomtomApiKey,
    );

    const newPlaces = placesFetched.results.map((result) => ({
      name: result.poi.name,
      lat: result.position.lat,
      long: result.position.lon,
      formatted_address:
        `${result.address.streetNumber ? result.address.streetNumber + ' ' : ''}` +
        `${result.address.streetName ? result.address.streetName + ', ' : ''}` +
        `${result.address.municipality ? result.address.municipality + ', ' : ''}` +
        `${result.address.country ? result.address.country + ' ' : ''}`,
    }));
    places.push(...newPlaces);
  }

  return {
    status: directions.status === 'OK' ? 'OK' : 'FAIL',
    routes,
    places,
  };
});

function getNearbyPlaces(query: QueryType, lat: number, lon: number, key: string) {
  return $fetch<NearbyRes>(nearbySearchUrl, {
    method: 'GET',
    query: {
      key,
      lat,
      lon,
      limit: 30,
      radius: 10000,
      language: query.language,
      categorySet: query.places_type,
      relatedPois: 'child',
    },
  });
}
