import { Map as GoogleMap } from '@vis.gl/react-google-maps';
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
			defaultCenter={userLocation || { lat: 41.4912314, lng: 2.1403111 }}
			defaultZoom={15}
			// zoom={18}
			gestureHandling={'greedy'}
			disableDefaultUI={false}
			mapId="public-transport-map"
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
