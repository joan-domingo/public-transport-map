import {
	AdvancedMarker,
	InfoWindow,
	useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import styled from 'styled-components';
import { useShallow } from 'zustand/shallow';
import appStore from '../store/appStore';
import type BusStop from '../types/busStop';
import { busLineNameColor } from '../utils/lineColor';
import MarkerTimetable from './MarkerTimetable';

const InfoWindowHeader = styled.div`
	padding-bottom: 8px;
	padding-right: 4px;
	display: flex;
	font-size: 0.8rem;
	color: black;
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
	width: 24px;
	height: 24px;
	background-color: ${(props) => props.color};
	color: white;
	font-size: 12px;
	border-radius: 6px;
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
				onClick={() => !visible && onClick()}
				position={{ lat: stop.lat, lng: stop.lon }}
				zIndex={visible ? 1 : 0}
				style={{ transition: 'width 0.5s ease' }}
			>
				<>
					<BusLinesWrapper>
						{stop.buses.map((bus) => (
							<BusLineIcon key={bus} color={busLineNameColor[bus]}>
								{bus.toUpperCase()}
							</BusLineIcon>
						))}
					</BusLinesWrapper>
					<ArrowDown />
				</>
			</AdvancedMarker>
			{visible && (
				<InfoWindow
					anchor={marker}
					shouldFocus
					minWidth={320}
					onCloseClick={onCloseClick}
					headerContent={<InfoWindowHeader>{stop.name}</InfoWindowHeader>}
				>
					<MarkerTimetable
						selectedStopTimetable={selectedStopTimetable}
						isLoading={isLoading}
						isLoaded={isLoaded}
						visible={visible}
					/>
				</InfoWindow>
			)}
		</>
	);
};
