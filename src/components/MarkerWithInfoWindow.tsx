import {
	AdvancedMarker,
	InfoWindow,
	useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import styled from 'styled-components';
import { useShallow } from 'zustand/shallow';
import appStore from '../store/appStore';

const InfoWindowHeader = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1rem;
	font-weight: bold;
	color: black;
`;

const InfoContainer = styled.div<{ selected?: boolean; index: number }>`
    display: flex;
	flex-direction: column;
	position: relative;
	flex: 1;
	color: black;
	background-color: ${(props) => props?.index % 2 === 0 && '#edebeb'};
	background-color: ${(props) => props.selected && '#e5ffe3'};

`;

const InfoContainerHeader = styled.h4`
	margin: 8px 0 2px 0;
	color: #636363;
`;

interface Props {
	position: { lat: number; lng: number };
	onClick: () => void;
	onCloseClick: () => void;
	visible: boolean;
}

export const MarkerWithInfowindow = ({
	position,
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
			<AdvancedMarker ref={markerRef} onClick={onClick} position={position} />
			{visible && (
				<InfoWindow
					anchor={marker}
					shouldFocus
					minWidth={320}
					onCloseClick={onCloseClick}
					headerContent={<InfoWindowHeader>PROPERS AUTOBUSOS</InfoWindowHeader>}
				>
					{isLoading && <InfoContainer index={0}>Carregant...</InfoContainer>}
					{isLoaded &&
						(!selectedStopTimetable || selectedStopTimetable.length === 0) && (
							<InfoContainer index={0}>
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
									index={index}
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
