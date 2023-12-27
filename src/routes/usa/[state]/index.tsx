import { component$, useStyles$, useSignal } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { states } from "./states";
import leafletStyles from "../../../../node_modules/leaflet/dist/leaflet.css?inline";
import { LeafletMap } from "~/components/leaflet-map";
import type { LocationsProps } from "~/models/location";

export const useStateRoute = routeLoader$(async ({ params, status }) => {
  const stateCode = params.state.toUpperCase();
  const state = states.find(([st]) => st === stateCode);
  if (!state) {
    status(404);
  }
  return state;
});

export default component$(() => {
  const { value } = useStateRoute();
  if (!value) {
    return <div>State not found</div>;
  }
  // prettier-ignore
  const [/* stateCode */, stateName, /* capitolName */, lat, lng] = value;
  useStyles$(leafletStyles);
  const currentLocation = useSignal<LocationsProps>({
    name: stateName,
    point: toDecimalDegress(lat, lng),
    /**
     * Define rectangle with: Southwest lat, South West Lng, North East lat,  North East lng points.
     * Very interesting when use to filter in OpenStreetMap API to take POIs
     * Example: https://qwik-osm-poc.netlify.app/
     */
    boundaryBox:
      "43.14658914559456,-2.4765586853027344,43.202923523094725,-2.3467826843261723",
    zoom: 9,
    marker: true,
  });
  return <LeafletMap location={currentLocation} />;
});

function toDecimalDegress(latText: string, lngText: string) {
  const latDMS = parseDMS(latText);
  const lngDMS = parseDMS(lngText);

  const [latDegrees, latMinutes, latSeconds, latHemisphere] = latDMS;
  const [lngDegrees, lngMinutes, lngSeconds, lngHemisphere] = lngDMS;

  let lat = latDegrees + latMinutes / 60 + latSeconds / 3600;
  let lng = lngDegrees + lngMinutes / 60 + lngSeconds / 3600;

  // If the latitude or longitude is in the southern or western hemisphere, negate the result
  if (latHemisphere.toUpperCase() === "S") {
    lat = -lat;
  }
  if (lngHemisphere.toUpperCase() === "W") {
    lng = -lng;
  }
  console.log([latDegrees, latMinutes, latSeconds, latHemisphere, lat]);
  console.log([lngDegrees, lngMinutes, lngSeconds, lngHemisphere, lng]);
  return [lat, lng] as [number, number];
}

function parseDMS(input: string) {
  const parts = input.split(/\s+/);
  const degrees = Number(parts[0]);
  const minutes = Number(parts[1]);
  const seconds = Number(parts[2]);
  const hemisphere = parts[3];
  return [degrees, minutes, seconds, hemisphere] as const;
}
