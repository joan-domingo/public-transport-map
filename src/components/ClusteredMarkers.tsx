import { type Marker, MarkerClusterer } from '@googlemaps/markerclusterer';
import { useMap } from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useMemo } from 'react';
import type BusStop from '../types/busStop';
import { MarkerWithInfowindow } from './MarkerWithInfoWindow';

interface Props {
	busLineStops: BusStop[];
	handleOnMarkerClick: (stop: BusStop) => Promise<void>;
	openedBusStopMarker: number | null;
	setOpenedBusStopMarker: (id: number | null) => void;
}

const ClusteredMarkers = ({
	busLineStops,
	handleOnMarkerClick,
	openedBusStopMarker,
	setOpenedBusStopMarker,
}: Props) => {
	// create the markerClusterer once the map is available and update it when
	// the markers are changed
	const map = useMap();
	const clusterer = useMemo(() => {
		if (!map) return null;

		return new MarkerClusterer({ map });
	}, [map]);

	useEffect(() => {
		if (!clusterer) return;

		clusterer.clearMarkers();
		clusterer.addMarkers(busLineStops);
	}, [clusterer, busLineStops]);

	// this callback will effectively get passsed as ref to the markers to keep
	// tracks of markers currently on the map
	const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
		setMarkers((markers) => {
			if ((marker && markers[key]) || (!marker && !markers[key]))
				return markers;

			if (marker) {
				return { ...markers, [key]: marker };
			} else {
				const { [key]: _, ...newMarkers } = markers;


				return newMarkers;
			}
		});
	}, []);

	return busLineStops.map((stop) => (
		<MarkerWithInfowindow
			key={stop.id}
			stop={stop}
			onClick={() => handleOnMarkerClick(stop)}
			visible={openedBusStopMarker === stop.id}
			onCloseClick={() => setOpenedBusStopMarker(null)}
		/>
	));
};

export default ClusteredMarkers;
