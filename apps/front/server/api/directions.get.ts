type QueryType = {
  origin: string;
  destination: string;
};

export default defineEventHandler(async (event) => {
  const query: QueryType = getQuery(event);
  const data = await $fetch(String(process.env.GOOGLE_DIRECTIONS_URL), {
    method: 'GET',
    query: {
      origin: query.origin,
      destination: query.destination,
      waypoints: null,
      key: process.env.GOOGLE_API_KEY,
    },
  });
  return data;
});
