import { PlacesRes } from '@roadtrip/google-api';
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
    const res = await fetch(getApiUrl('/places'), {
      method: 'GET',
    });
    const data: PlacesRes = await res.json();
    expect(data.status).toBe('INVALID_REQUEST');
  });

  await test('success - request with queries', async () => {
    const res = await fetch(
      getApiUrl('/places', {
        location_lat: '-33.8670522',
        location_long: '151.1957362',
        type: 'restaurant',
        radius: 50000,
      }),
      { method: 'GET' },
    );
    const data: PlacesRes = await res.json();
    expect(data.status).toBe('OK');
  });
});
