import React from "react";
import { Dictionary, max } from "lodash";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import zipcodeGeoJSON from "json/boston-zipcodes.json";
import { geoJSON } from "leaflet";
import { useSearchFilters } from "state";
import SimpleCard from "./SimpleCard";
import { Typography, Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(({ shape }) => ({
  card: {
    height: "100%",
    minHeight: 500,
  },
  mapContainer: { maxWidth: "100%" },
  map: { height: "100%", borderRadius: shape.borderRadius },
}));

// @ts-ignore
const mapBounds = geoJSON(zipcodeGeoJSON).getBounds();

export interface ZipcodeMapProps {
  zipCounts: Dictionary<number>;
}

const ZipcodeMap: React.FC<ZipcodeMapProps> = ({ zipCounts }) => {
  const classes = useStyles();
  const filters = useSearchFilters();

  const mapRef = React.useRef<Map>(null);
  // Force update the map component on window resize
  React.useEffect(() => {
    const updateMap = () => {
      if (mapRef.current) {
        mapRef.current.forceUpdate();
      }
    };
    window.addEventListener("resize", updateMap);
    return () => window.removeEventListener("resize", updateMap);
  }, []);

  const maxCount = max(Object.values(zipCounts)) || 0;
  const geoJSONLayer = (
    // @ts-ignore
    <GeoJSON
      data={zipcodeGeoJSON}
      style={(feat) => {
        if (feat) {
          const count = zipCounts[feat.properties.ZIP5] || 0;
          return { weight: 1, fillOpacity: count / maxCount / 1.5 };
        }
      }}
      onClick={({ layer: { feature } }: any) => {
        const zip = feature?.properties.ZIP5;
        if (zip) {
          filters.add({ field: "zip", query: zip });
        }
      }}
    />
  );

  return (
    <SimpleCard className={classes.card} variant="outlined">
      <Grid
        style={{ height: "100%" }}
        container
        spacing={1}
        wrap="nowrap"
        direction="column"
        alignItems="stretch"
      >
        <Grid item>
          <Typography variant="overline">Distribution by Zipcode</Typography>
        </Grid>
        <Grid className={classes.mapContainer} item xs={11}>
          <Map
            className={classes.map}
            ref={mapRef}
            bounds={mapBounds}
            zoom={11}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {geoJSONLayer}
          </Map>
        </Grid>
        <Grid item>
          <Typography variant="caption">
            Select a zipcode region to add a location filter
          </Typography>
        </Grid>
      </Grid>
    </SimpleCard>
  );
};

export default ZipcodeMap;
