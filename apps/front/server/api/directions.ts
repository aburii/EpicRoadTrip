import { DirectionsRes, directionsUrl } from "@roadtrip/google-api";

type QueryType = {
  origin: string;
  destination: string;
  waipoints?: string | null;
};

export default defineEventHandler(async (event): Promise<DirectionsRes> => {
  const config = useRuntimeConfig(event);
  const query: QueryType = getQuery(event);
  return await $fetch(directionsUrl, {
    method: "GET",
    query: {
      origin: query.origin,
      destination: query.destination,
      waypoints: query.waipoints,
      key: config.googleApiKey,
    },
  });
});
