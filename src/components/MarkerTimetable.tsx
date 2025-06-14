import styled, { keyframes } from 'styled-components';
import type { CustomBusLineTimetable } from '../types/customTimetable';
import { busLineIdColor } from '../utils/lineColor';

const MarkerTimetableWrapper = styled.div`
`;

const LoadingContainer = styled.div`
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	padding: 8px;
	color: black;
`;

const InfoContainer = styled.div<{ $index: number }>`
    display: flex;
	flex-direction: column;
	flex: 1;
	background-color: ${(props) => props.$index % 2 === 0 && 'rgb(244, 244, 244)'};
	padding: 4px;
	color: black;
`;

const InfoContainerHeader = styled.div<{ $lineId: number }>`
	font-weight: bold;
	color: ${(props) => {
		return busLineIdColor[props.$lineId];
	}};
	padding: 4px 0;
`;

const loaderAnimation = keyframes`
	0% { transform: rotate(0deg); }
  	100% { transform: rotate(360deg); }
`;

const Loader = styled.div`
	border: 4px solid #f3f3f3; /* Light grey */
	border-top: 4px solid #888888; /* Blue */
	border-radius: 50%;
	width: 24px;
	height: 24px;
	animation: spin 2s linear infinite;
	animation-name: ${loaderAnimation};
`;

interface Props {
	selectedStopTimetable: CustomBusLineTimetable[];
	isLoading: boolean;
	isLoaded: boolean;
	visible: boolean;
}

const MarkerTimetable = ({
	selectedStopTimetable,
	isLoading,
	isLoaded,
	visible,
}: Props) => {
	if (!visible) {
		return null;
	}

	return (
		<MarkerTimetableWrapper>
			{isLoading && (
				<LoadingContainer>
					<Loader />
				</LoadingContainer>
			)}
			{isLoaded && !selectedStopTimetable && (
				<LoadingContainer>
					No s'han pogut carregar les dades. Si us plau, torna-ho a intentar més
					tard.
				</LoadingContainer>
			)}
			{isLoaded &&
				selectedStopTimetable &&
				selectedStopTimetable.length === 0 && (
					<LoadingContainer>Cap autobús previst properament.</LoadingContainer>
				)}
			{isLoaded &&
				selectedStopTimetable &&
				selectedStopTimetable.length > 0 &&
				selectedStopTimetable.map((stop, index) => {
					return (
						<InfoContainer key={stop.lineId} $index={index}>
							<InfoContainerHeader $lineId={stop.lineId}>
								{stop.lineName}
							</InfoContainerHeader>
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
		</MarkerTimetableWrapper>
	);
};

export default MarkerTimetable;
