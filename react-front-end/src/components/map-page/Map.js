import React, { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader
} from "@react-google-maps/api";
import { Box, CircularProgress } from "@material-ui/core";
import Locate from "./Locate";
import Forum from '../forum-page/Forum';
import InfoWindowMarker from './InfoWindow';
import mapStyles from "./mapStyles";
import useStyles from "../Styles";
import MapSearch from "./MapSearch";
import MarkSafeSpots from "./MarkSafeSpots";
import FilterButton from "../map-page/FilterButton";
import MapLegend from './Legend';
import MarkIncidents from './MarkIncidents';
import SafetyNetworkMap from "../safety-network-page/SafetyNetwork";
import "@reach/combobox/styles.css";
import "./search.css";
import AddButton from "../forum-page/AddButton";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 49.2811956,
  lng: -123.13068,
};

const libraries = ["places"];

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

const Map = () => {
  const classes = useStyles();
  const [selected, setSelected ] = useState(null);
  const [ filter, setFilter ] = useState(0);
  const [ userSn, setUserSn ] = useState([]);
  const [ newPost, setNewPost ] = useState(false);

  console.log("This si the selected:", selected);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
    libraries,
  });

  const mapRef = useRef();

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
  }, []);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return "Error loading maps";

  return (
    <div className="map">
    <Box display="flex" flexDirection="column">
      <Box className={classes.mapBox}>
        <MapSearch panTo={panTo} />
        <Locate panTo={panTo} />
      </Box>
        
      { !isLoaded && <CircularProgress color="secondary" /> }
      <Box>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={18}
        options={options}
        onLoad={onMapLoad}
        >

        <div class="legend">
          <MapLegend />
        </div>
        
        { filter < 2 ? <MarkSafeSpots selected={selected} setSelected={setSelected}/> : null }

        { !filter || filter === 3 ? <SafetyNetworkMap userSn={userSn} setUserSn={setUserSn} selected={selected} setSelected={setSelected}/> : null }

        { !filter || filter === 2 ? <MarkIncidents setSelected={setSelected} /> : null }

        { selected ? <InfoWindowMarker selected={selected} setSelected={setSelected} /> : null } 

      </GoogleMap>
      </Box>
      
      <div class="filter-button">
          <FilterButton filter={filter} setFilter={setFilter} />
          <AddButton setNewPost={setNewPost} />
      </div>
      
      <Forum newPost={newPost} setNewPost={setNewPost} selected={selected} />

    </Box>
    </div>
  );
};

export default Map;