import { Map as GoogleMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import useStore from '../store/useStore';
import { MarkerWithInfowindow } from './MarkerWithInfoWindow';

interface Props {
	busLineId: string;
}

const Map = ({ busLineId }: Props) => {
	const { loadBusStops, busLineStops } = useStore(
		useShallow((state) => ({
			loadBusStops: state.loadBusStops,
			busLineStops: state.busLineStops,
		})),
	);

	const position = { lat: 53.54992, lng: 10.00678 };
	const [userLocation, setUserLocation] = useState<
		| {
				lat: number;
				lng: number;
		  }
		| undefined
	>(undefined);

	// define the function that finds the users geolocation
	const getUserLocation = () => {
		// if geolocation is supported by the users browser
		if (navigator.geolocation) {
			// get the current users location
			navigator.geolocation.getCurrentPosition(
				(position) => {
					// save the geolocation coordinates in two variables
					const { latitude, longitude } = position.coords;
					// update the value of userlocation variable
					setUserLocation({ lat: latitude, lng: longitude });
				},
				// if there was an error getting the users location
				(error) => {
					console.error('Error getting user location:', error);
				},
			);
		}
		// if geolocation is not supported by the users browser
		else {
			console.error('Geolocation is not supported by this browser.');
		}
	};

	useEffect(() => getUserLocation(), []);

	useEffect(() => {
		loadBusStops(busLineId);
	}, [busLineId]);

	return (
		<GoogleMap
			style={{ width: '100vw', height: '100vh' }}
			defaultCenter={userLocation || { lat: 41.390205, lng: 2.154007 }}
			// center={userLocation}
			defaultZoom={18}
			// zoom={18}
			gestureHandling={'greedy'}
			disableDefaultUI={true}
			mapId="DEMO_MAP_ID"
		>
			{busLineStops.map((stop) => (
				<MarkerWithInfowindow
					key={stop.ID_PARADA}
					position={{ lat: stop.Parada.LATITUD, lng: stop.Parada.LONGITUD }}
					stopId={stop.ID_PARADA}
					lineId={stop.ID_LINEA}
					zoneId={stop.Parada.ID_ZONA}
				/>
			))}
			{/* <AdvancedMarker position={userLocation} /> */}
		</GoogleMap>
	);
};

export default Map;
