import { Map as GoogleMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import appStore from '../store/appStore';
import type BusStop from '../types/busStop';
import { MarkerWithInfowindow } from './MarkerWithInfoWindow';

interface Props {
	busLineId: string;
}

const Map = ({ busLineId }: Props) => {
	const {
		loadBusStops,
		busLineStops,
		loadBusStopTimeTable,
		clearSelectedBusStopTimetable,
	} = appStore(
		useShallow((state) => ({
			loadBusStops: state.loadBusStops,
			busLineStops: state.busLineStops,
			loadBusStopTimeTable: state.loadBusStopTimeTable,
			clearSelectedBusStopTimetable: state.clearSelectedBusStopTimetable,
		})),
	);

	const [openedBusStopMarker, setOpenedBusStopMarker] = useState<null | number>(
		null,
	);

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

	const handleOnMarkerClick = async (stop: BusStop) => {
		const {
			ID_PARADA,
			ID_LINEA,
			Parada: { ID_ZONA },
		} = stop;
		clearSelectedBusStopTimetable();
		setOpenedBusStopMarker(ID_PARADA);
		await loadBusStopTimeTable(ID_PARADA, ID_LINEA, ID_ZONA);
	};

	return (
		<GoogleMap
			style={{ width: '100vw', height: '100vh' }}
			defaultCenter={userLocation} //{ lat: 41.390205, lng: 2.154007 }
			// center={userLocation}
			defaultZoom={15}
			// zoom={18}
			gestureHandling={'greedy'}
			disableDefaultUI={true}
			mapId="DEMO_MAP_ID"
		>
			{busLineStops.map((stop) => (
				<MarkerWithInfowindow
					key={stop.ID_PARADA}
					position={{ lat: stop.Parada.LATITUD, lng: stop.Parada.LONGITUD }}
					onClick={() => handleOnMarkerClick(stop)}
					visible={openedBusStopMarker === stop.ID_PARADA}
					onCloseClick={() => setOpenedBusStopMarker(null)}
				/>
			))}
		</GoogleMap>
	);
};

export default Map;
