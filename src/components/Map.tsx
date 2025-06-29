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

const Footer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
	position: absolute;
	bottom: 0;
	right: 0;
	left: 0;
	background: rgba(255, 255, 255, 0.8);
	color: black;
`;

const Header = styled.header`
    display: flex;
	flex-direction: column;
    background-color:rgba(8, 139, 159, 0.8);
    align-items: center;
    justify-content: center;
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	padding: 4px;
`;

const Title = styled.h1`
    color: white;
	font-size: 1rem;
	margin: 0;
`;

const Description = styled.div`
    color: white;
    justify-content: center;
    align-items: center;
	font-size: 0.8rem;
`;

interface Props {
	userLocation: { lat: number; lng: number };
}

// https://visgl.github.io/react-google-maps/
const Map = ({ userLocation }: Props) => {
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
				loadBusStops('all');
			}
		};

		loadBusStops('all');
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
								zIndex: 99
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
			<Footer>
				Dades proporcionades per
				<a
					href="https://www.moventis.es/ca/temps-real"
					target="_blank"
					rel="noreferrer"
					style={{ marginLeft: '4px' }}
				>
					Moventis
				</a>
			</Footer>
			<Header>
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
					<Title>QuanTriga.com</Title>
				</div>
				<Description>
					Consulta en temps real l'arribada dels propers busos.
				</Description>
			</Header>
		</div>
	);
};

export default Map;
