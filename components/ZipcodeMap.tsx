import React from "react";
import { Dictionary, max } from "lodash";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import zipcodeGeoJSON from "data/boston-zipcodes.json";
import { geoJSON } from "leaflet";

// @ts-ignore
const mapBounds = geoJSON(zipcodeGeoJSON).getBounds();

const disableInteractions = {
  doubleClickZoom: false,
  closePopupOnClick: false,
  dragging: false,
  trackResize: false,
  touchZoom: false,
  scrollWheelZoom: false,
  zoomControl: false,
};

export interface ZipcodeMapProps {
  zipCounts: Dictionary<number>;
}

const ZipcodeMap: React.FC<ZipcodeMapProps> = ({ zipCounts }) => {
  const maxCount = max(Object.values(zipCounts)) || 0;

  const geoJSONLayer = (
    // @ts-ignore
    <GeoJSON
      data={zipcodeGeoJSON}
      onClick={console.log}
      style={(feat) => {
        if (feat) {
          const count = zipCounts[feat?.properties.ZIP5] || 0;
          return { weight: 1, fillOpacity: count / maxCount / 1.5 };
        }
      }}
    />
  );

  return (
    <Map
      bounds={mapBounds}
      style={{ height: "100%", width: "100%" }}
      {...disableInteractions}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {geoJSONLayer}
    </Map>
  );
};

export default ZipcodeMap;