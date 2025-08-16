import type BusStop from '../types/busStop';
import { MarkerWithInfowindow } from './MarkerWithInfoWindow';

interface BusStopMarkersProps {
	stops: BusStop[];
	selectedStopId: number | null;
	onStopClick: (stop: BusStop) => void;
	onCloseClick: () => void;
}

export const BusStopMarkers = ({
	stops,
	selectedStopId,
	onStopClick,
	onCloseClick,
}: BusStopMarkersProps) => {
	return (
		<>
			{stops.map((stop) => (
				<MarkerWithInfowindow
					key={stop.id}
					stop={stop}
					onClick={() => onStopClick(stop)}
					visible={selectedStopId === stop.id}
					onCloseClick={onCloseClick}
				/>
			))}
		</>
	);
};
