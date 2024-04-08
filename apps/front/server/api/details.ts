import { placeDetailsUrl, PlacesDetailsRes } from '@roadtrip/google-api';

type PlaceDetailsQueryType = {
  place_id: string;
};

export default defineEventHandler(async (event): Promise<PlacesDetailsRes> => {
  const config = useRuntimeConfig(event);
  const query: PlaceDetailsQueryType = getQuery(event);
  return await $fetch(placeDetailsUrl, {
    method: 'GET',
    query: {
      place_id: query.place_id,
      key: config.googleApiKey,
    },
  });
});
