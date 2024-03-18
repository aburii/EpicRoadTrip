function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function calculateDestinationCoordinates(
  initialLatitude: number,
  initialLongitude: number,
  distance: number,
  direction: number
): { latitude: number; longitude: number } {
  const earthRadius = 6371;
  const initialLatRad = toRadians(initialLatitude);
  const initialLongRad = toRadians(initialLongitude);
  const directionRad = toRadians(direction);

  const newLatitude = Math.asin(
    Math.sin(initialLatRad) * Math.cos(distance / earthRadius) +
      Math.cos(initialLatRad) * Math.sin(distance / earthRadius) * Math.cos(directionRad)
  );

  const newLongitude =
    initialLongRad +
    Math.atan2(
      Math.sin(directionRad) * Math.sin(distance / earthRadius) * Math.cos(initialLatRad),
      Math.cos(distance / earthRadius) - Math.sin(initialLatRad) * Math.sin(newLatitude)
    );

  const newLatDeg: number = toDegrees(newLatitude);
  const newLongDeg: number = toDegrees(newLongitude);

  return { latitude: newLatDeg, longitude: newLongDeg };
}
