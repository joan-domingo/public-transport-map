import { AdvancedMarker, Map as GoogleMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import appStore from '../store/appStore';
import type BusStop from '../types/busStop';
import { MarkerWithInfowindow } from './MarkerWithInfoWindow';

interface Props {
	busLineId: string;
	userLocation: { lat: number; lng: number };
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
	const [isDragging, setIsDragging] = useState(false);

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
		<>
			<GoogleMap
				style={{ width: '100vw', height: '100vh' }}
				defaultCenter={userLocation}
				center={isDragging ? undefined : userLocation}
				defaultZoom={15}
				gestureHandling={'greedy'}
				disableDefaultUI={false}
				mapId="public-transport-map"
				onDragstart={() => setIsDragging(true)}
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
								background: 'rgb(51, 48, 241)',
								border: '2px solid white',
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
				}}
				style={{
					position: 'absolute',
					bottom: '10px',
					left: '10px',
					padding: '10px',
					background: 'white',
					border: 'none',
					cursor: 'pointer',
					color: 'black',
				}}
			>
				Centrar Mapa
			</button>
		</>
	);
};

export default Map;
