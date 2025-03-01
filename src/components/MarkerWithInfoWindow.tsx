import {
	AdvancedMarker,
	InfoWindow,
	useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { useShallow } from 'zustand/shallow';
import appStore from '../store/appStore';

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
	const { selectedStopTimetable } = appStore(
		useShallow((state) => ({
			selectedStopTimetable: state.selectedStopTimetable,
		})),
	);
	const [markerRef, marker] = useAdvancedMarkerRef();

	return (
		<>
			<AdvancedMarker ref={markerRef} onClick={onClick} position={position} />
			{visible && (
				<InfoWindow anchor={marker} maxWidth={400} onCloseClick={onCloseClick}>
					{selectedStopTimetable.map((stop) => {
						return (
							<div key={stop.lineId}>
								<h5>{stop.lineName}</h5>
								{stop.nextBuses.map((bus) => {
									return (
										<div key={bus.name}>
											<p>{bus.name}</p>
											<p>{bus.minutesLeft}</p>
										</div>
									);
								})}
							</div>
						);
					})}
				</InfoWindow>
			)}
		</>
	);
};
