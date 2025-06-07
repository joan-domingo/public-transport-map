import { AdvancedMarker, Map as GoogleMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useShallow } from 'zustand/shallow';
import appStore from '../store/appStore';
import type BusStop from '../types/busStop';
import { MarkerWithInfowindow } from './MarkerWithInfoWindow';

const RecenterButton = styled.button`
	position: absolute;
	bottom: 0;
	right: 0;
	background: white;
	border: 2px solid #aaa;
	cursor: pointer;
	display: flex;
	align-itmes: center;
	justify-content: center;
	margin: 36px 24px;
	padding: 12px;
	border-radius: 50%;
`;

interface Props {
	busLineId: string;
	userLocation: { lat: number; lng: number };
}

// https://visgl.github.io/react-google-maps/
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
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				loadBusStops(busLineId);
			}
		};

		loadBusStops(busLineId);
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	const handleOnMarkerClick = async (stop: BusStop) => {
		const { id, lineId, zoneId } = stop;
		clearSelectedBusStopTimetable();
		setOpenedBusStopMarker(id);
		await loadBusStopTimeTable(id, lineId, zoneId);
	};

	return (
		<div style={{ display: 'flex', flex: '1' }}>
			<GoogleMap
				style={{ width: '100%', height: '100%' }}
				defaultCenter={userLocation}
				center={isDragging ? undefined : userLocation}
				defaultZoom={15}
				gestureHandling={'greedy'}
				disableDefaultUI={true}
				mapId="public-transport-map"
				onDragstart={() => setIsDragging(true)}
			>
				{busLineStops.map((stop) => (
					<MarkerWithInfowindow
						key={stop.id}
						stop={stop}
						onClick={() => handleOnMarkerClick(stop)}
						visible={openedBusStopMarker === stop.id}
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
			<RecenterButton
				onClick={() => {
					setIsDragging(false);
				}}
			>
				<img
					src="/location.svg"
					alt="Centrar mapa"
					style={{
						width: '36px',
						height: '36px',
						...(!isDragging && {
							filter:
								'invert(27%) sepia(90%) saturate(7400%) hue-rotate(200deg)',
						}),
					}}
				/>
			</RecenterButton>
			<a href="https://quantriga.com" aria-label="Torna a la pàgina principal">
				<img
					src="/busIcon.svg"
					alt="Icona QuanTriga.com"
					style={{
						width: '48px',
						height: '48px',
						position: 'absolute',
						top: 0,
						left: 0,
						padding: '24px',
					}}
				/>
			</a>
		</div>
	);
};

export default Map;
