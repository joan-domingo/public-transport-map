import {
	AdvancedMarker,
	InfoWindow,
	useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import styled from 'styled-components';
import { useShallow } from 'zustand/shallow';
import appStore from '../store/appStore';
import type BusStop from '../types/busStop';

const InfoWindowHeader = styled.div`
	padding-bottom: 8px;
	padding-right: 4px;
	display: flex;
	font-size: 0.8rem;
	font-weight: bold;
	color: black;
`;

const InfoContainer = styled.div<{ selected?: boolean; $index: number }>`
    display: flex;
	flex-direction: column;
	position: relative;
	flex: 1;
	color: black;
	background-color: ${(props) => props.$index % 2 === 0 && '#edebeb'};
	background-color: ${(props) => props.selected && '#e5ffe3'};

`;

const InfoContainerHeader = styled.h4`
	margin: 8px 0 2px 0;
	color: #636363;
`;

const BusLinesWrapper = styled.div`
	display: flex;
	flex-direction: row;
	background-color:rgba(0, 0, 0, 0.7);
	padding: 2px;
	gap: 2px;
	border-radius: 8px;
`;

const BusLineIcon = styled.div<{ color: string }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	background-color: ${(props) => props.color};
	color: white;
	font-size: 18px;
	border-radius: 8px;
`;

const ArrowDown = styled.div`
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-left: 8px solid transparent;
	border-right: 8px solid transparent;
	border-top: 12px solid rgba(0, 0, 0, 0.7);
`;

interface Props {
	onClick: () => void;
	onCloseClick: () => void;
	visible: boolean;
	stop: BusStop;
}

const busLineColor: Record<string, string> = {
	648: '#F70000',
	a4: '#F70008',
	b2: '#F70023',
	b7: '#F7000C',
	e3: '#0A8BAA',
	su1: '#107E00',
	su2: '#F7000C',
	su3: '#9A008D',
};

export const MarkerWithInfowindow = ({
	stop,
	onClick,
	visible,
	onCloseClick,
}: Props) => {
	const { selectedStopTimetable, isLoading, isLoaded } = appStore(
		useShallow((state) => ({
			selectedStopTimetable: state.selectedStopTimetable,
			isLoading: state.selectedStopTimetableIsLoading,
			isLoaded: state.selectedStopTimetableIsLoaded,
		})),
	);
	const [markerRef, marker] = useAdvancedMarkerRef();

	return (
		<>
			<AdvancedMarker
				ref={markerRef}
				onClick={onClick}
				position={{ lat: stop.lat, lng: stop.lon }}
			>
				<>
					<BusLinesWrapper>
						{stop.buses.map((bus) => (
							<BusLineIcon key={bus} color={busLineColor[bus]}>
								{bus.toUpperCase()}
							</BusLineIcon>
						))}
					</BusLinesWrapper>
					<ArrowDown/>
				</>
			</AdvancedMarker>
			{visible && (
				<InfoWindow
					anchor={marker}
					shouldFocus
					minWidth={320}
					onCloseClick={onCloseClick}
					headerContent={
						<InfoWindowHeader>Propers Busos - {stop.name}</InfoWindowHeader>
					}
				>
					{isLoading && <InfoContainer $index={1}>Carregant...</InfoContainer>}
					{isLoaded &&
						(!selectedStopTimetable || selectedStopTimetable.length === 0) && (
							<InfoContainer $index={1}>
								No hi ha informació disponible
							</InfoContainer>
						)}
					{isLoaded &&
						selectedStopTimetable &&
						selectedStopTimetable.map((stop, index) => {
							return (
								<InfoContainer
									key={stop.lineId}
									selected={stop.selected}
									$index={index}
								>
									<InfoContainerHeader>{stop.lineName}</InfoContainerHeader>
									{stop.nextBuses.map((bus) => {
										return (
											<div
												key={`${bus.minutesLeft}-${bus.name}`}
												style={{ display: 'flex' }}
											>
												<div style={{ fontWeight: 'bold', marginRight: '8px' }}>
													{bus.minutesLeft}
												</div>
												<div>- Direcció {bus.name}</div>
											</div>
										);
									})}
								</InfoContainer>
							);
						})}
				</InfoWindow>
			)}
		</>
	);
};
