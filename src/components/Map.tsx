import { Map as GoogleMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { useBusStopSelection } from '../hooks/useBusStopSelection';
import appStore from '../store/appStore';
import { SimpleBusStopMarkers } from './SimpleBusStopMarkers';
import { UserLocationMarker } from './UserLocationMarker';

interface Props {
	userLocation: { lat: number; lng: number };
}

// https://visgl.github.io/react-google-maps/
const Map = ({ userLocation }: Props) => {
	const { loadBusStops, busLineStops } = appStore(
		useShallow((state) => ({
			loadBusStops: state.loadBusStops,
			busLineStops: state.busLineStops,
		})),
	);

	const { selectedStopId, selectStop, clearSelection } = useBusStopSelection();
	const [isDragging, setIsDragging] = useState(false);
	const [zoom, setZoom] = useState(15);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				loadBusStops('all');
			}
		};

		loadBusStops('all');
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	return (
		<div style={{ display: 'flex', flex: '1' }}>
			<GoogleMap
				style={{ width: '100%', height: '100%' }}
				defaultCenter={userLocation}
				center={isDragging ? undefined : userLocation}
				defaultZoom={15}
				zoom={zoom}
				onZoomChanged={(event) => setZoom(event.detail.zoom)}
				gestureHandling={'greedy'}
				disableDefaultUI={true}
				mapId="public-transport-map"
				onDragstart={() => setIsDragging(true)}
			>
				<SimpleBusStopMarkers
					stops={busLineStops}
					selectedStopId={selectedStopId}
					onStopClick={selectStop}
					onCloseClick={clearSelection}
				/>
				{userLocation && <UserLocationMarker location={userLocation} />}
			</GoogleMap>
			<button
				className="absolute bottom-0 right-0 bg-white border-2 border-gray-400 cursor-pointer flex items-center justify-center m-9 mr-6 p-3 rounded-full"
				onClick={() => {
					setIsDragging(false);
					setZoom(18);
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
			</button>
			<div className="flex justify-center items-center absolute bottom-0 right-0 left-0 bg-white/80 text-black">
				Dades proporcionades per
				<a
					href="https://www.moventis.es/ca/temps-real"
					target="_blank"
					rel="noreferrer"
					style={{ marginLeft: '4px' }}
				>
					Moventis
				</a>
			</div>
			<header
				className="flex flex-col items-center justify-center absolute top-0 right-0 left-0 p-1"
				style={{ backgroundColor: 'rgba(8, 139, 159, 0.8)' }}
			>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<a href="https://quantriga.com">
						<img
							src="/busIcon.svg"
							alt="Icona QuanTriga.com"
							style={{
								height: '32px',
								paddingRight: '8px',
							}}
						/>
					</a>
					<h1 className="text-white font-bold m-0" style={{ fontSize: '1rem' }}>
						QuanTriga.com
					</h1>
				</div>
				<div className="text-white justify-center items-center text-xs mt-1">
					Consulta en temps real l'arribada dels propers busos.
				</div>
			</header>
		</div>
	);
};

export default Map;
