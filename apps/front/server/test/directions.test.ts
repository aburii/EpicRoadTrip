import { DirectionsRes } from '@roadtrip/google-api';
import { describe, expect, test } from 'bun:test';

const getApiUrl = (path: string, queryParams?: { [key: string]: string | number }) => {
  let url = `http://localhost:3000/api${path}`;
  if (queryParams) {
    const queryString = Object.keys(queryParams)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key].toString())}`)
      .join('&');
    url += `?${queryString}`;
  }
  return url;
};

describe('places route', async () => {
  await test('Fail - bad request', async () => {
    const res = await fetch(getApiUrl('/directions'), {
      method: 'GET',
    });
    const data = await res.json();
    expect(data.statusCode).toBe(400);
  });

  await test('success - request with queries', async () => {
    const res = await fetch(
      getApiUrl('/directions', {
        origin: 'Toronto',
        destination: 'Montreal',
      }),
      { method: 'GET' },
    );
    const data: DirectionsRes = await res.json();
    expect(data.status).toBe('OK');
  });
});
