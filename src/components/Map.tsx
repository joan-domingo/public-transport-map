import { AdvancedMarker, Map as GoogleMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import appStore from '../store/appStore';
import type BusStop from '../types/busStop';
import { MarkerWithInfowindow } from './MarkerWithInfoWindow';

interface Props {
	busLineId: string;
	userLocation: { lat: number; lng: number } | undefined;
}

const Map = ({ busLineId, userLocation }: Props) => {
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

	const [center, setCenter] = useState<
		{ lat: number; lng: number } | undefined
	>({ lat: 41.4912314, lng: 2.1403111 }); // Default: Cerdanyola
	const [isDragging, setIsDragging] = useState(false);

	useEffect(() => {
		loadBusStops(busLineId);
	}, [busLineId]);

	useEffect(() => {
		if (isDragging) {
			setCenter(undefined);
		} else {
			setCenter(userLocation);
		}
	}, [isDragging, userLocation]);

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

	const handleOnDrag = () => {
		setIsDragging(true);
	};

	console.log('center:', center);

	return (
		<>
			<GoogleMap
				style={{ width: '100vw', height: '100vh' }}
				center={center}
				defaultZoom={14}
				gestureHandling={'greedy'}
				disableDefaultUI={false}
				mapId="public-transport-map"
				onDrag={handleOnDrag}
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
				{userLocation && (
					<AdvancedMarker
						position={userLocation}
						title={'AdvancedMarker with custom html content.'}
					>
						<div
							style={{
								width: 16,
								height: 16,
								position: 'absolute',
								top: 0,
								left: 0,
								background: 'rgb(50, 47, 213)',
								border: '2px solid rgba(199, 199, 226, 0.8)',
								borderRadius: '50%',
								transform: 'translate(-50%, -50%)',
							}}
						/>
					</AdvancedMarker>
				)}
			</GoogleMap>
			<button
				onClick={() => {
					setIsDragging(false);
					navigator.geolocation.getCurrentPosition((position) => {
						setCenter({
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						});
					});
				}}
				style={{
					position: 'absolute',
					bottom: '10px',
					left: '10px',
					padding: '10px',
					background: 'white',
					border: 'none',
					cursor: 'pointer',
				}}
			>
				Recenter
			</button>
		</>
	);
};

export default Map;
