import {
	AdvancedMarker,
	InfoWindow,
	useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import useStore from '../store/useStore';

interface Props {
	position: { lat: number; lng: number };
	stopId: number;
	lineId: number;
	zoneId: number;
}

export const MarkerWithInfowindow = ({
	position,
	stopId,
	lineId,
	zoneId,
}: Props) => {
	const { loadBusStopTimeTable } = useStore(
		useShallow((state) => ({
			loadBusStopTimeTable: state.loadBusStopTimeTable,
		})),
	);
	const [infowindowOpen, setInfowindowOpen] = useState(false);
	const [markerRef, marker] = useAdvancedMarkerRef();

	const handleMarkerClick = async () => {
		setInfowindowOpen(true);
		await loadBusStopTimeTable(stopId, lineId, zoneId);
	};

	return (
		<>
			<AdvancedMarker
				ref={markerRef}
				onClick={() => handleMarkerClick()}
				position={position}
				title={'AdvancedMarker that opens an Infowindow when clicked.'}
			/>
			{infowindowOpen && (
				<InfoWindow
					anchor={marker}
					maxWidth={400}
					onCloseClick={() => setInfowindowOpen(false)}
				>
					This is an example for the{' '}
					<code style={{ whiteSpace: 'nowrap' }}>&lt;AdvancedMarker /&gt;</code>{' '}
					combined with an Infowindow.
				</InfoWindow>
			)}
		</>
	);
};
