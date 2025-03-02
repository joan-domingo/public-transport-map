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
`;

const InfoContainer = styled.div`
    display: flex;
	flex-direction: column;
	position: relative;
	flex: 1;
`;

const InfoContainerHeader = styled.h4`
	margin: 8px 0 2px 0;
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
	const { selectedStopTimetable, isLoading } = appStore(
		useShallow((state) => ({
			selectedStopTimetable: state.selectedStopTimetable,
			isLoading: state.selectedStopTimetableIsLoading,
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
					{isLoading && <div>Carregant...</div>}
					{selectedStopTimetable.map((stop) => {
						return (
							<InfoContainer key={stop.lineId}>
								<InfoContainerHeader>{stop.lineName}</InfoContainerHeader>
								{stop.nextBuses.map((bus) => {
									return (
										<div key={bus.name}>
											<div>Direcció: {bus.name}</div>
											<div>{bus.minutesLeft}</div>
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
