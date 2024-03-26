import { PlacesRes, placesUrl } from "@roadtrip/google-api";

type QueryType = {
  location_lat: string;
  location_long: string;
  radius: number;
  type: string;
};

export default defineEventHandler(async (event): Promise<PlacesRes> => {
  const config = useRuntimeConfig(event);
  const query: QueryType = getQuery(event);
  const data: PlacesRes = await $fetch(placesUrl, {
    method: "GET",
    query: {
      location: `${query.location_lat},${query.location_long}`,
      type: query.type,
      radius: query.radius,
      key: config.googleApiKey,
    },
  });
  return data;
});
