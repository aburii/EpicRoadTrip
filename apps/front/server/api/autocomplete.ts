import { autocompleteUrl } from '@roadtrip/google-api';

type AutocompleteReturnValue = {
  predictions: { description: string; place_id: string }[];
  error_message?: string;
};
export default defineEventHandler(async (event) => {
  const { googleApiKey: key } = useRuntimeConfig();
  const { input, lang } = getQuery(event);

  if (!input) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing input query parameter',
    });
  }

  if (!lang) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing lang query parameter',
    });
  }

  const result: AutocompleteReturnValue = await $fetch(autocompleteUrl, {
    method: 'GET',
    query: {
      input,
      language: lang,
      types: '(cities)',
      key,
    },
  });

  if (result.error_message) {
    throw createError({
      statusCode: 500,
      statusMessage: result.error_message,
    });
  }

  return result.predictions.map((pred) => ({
    name: pred.description,
    id: pred.place_id,
  }));
});
