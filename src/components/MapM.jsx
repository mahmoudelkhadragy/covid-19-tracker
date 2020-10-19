import React from "react";
import { Map, TileLayer } from "react-leaflet";
import { showDataOnMap } from "../helpers/utils";

function MapM({ countries, casesType, center, zoom }) {
  return (
    <div className="map">
      <Map center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* loop through and draw circles on the screen*/}
        {showDataOnMap(countries, casesType)}
      </Map>
    </div>
  );
}

export default MapM;
