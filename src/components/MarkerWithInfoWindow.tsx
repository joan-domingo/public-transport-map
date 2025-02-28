import {
	AdvancedMarker,
	InfoWindow,
	useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { useState } from 'react';

interface Props {
	position: { lat: number; lng: number };
}

export const MarkerWithInfowindow = ({ position }: Props) => {
	const [infowindowOpen, setInfowindowOpen] = useState(false);
	const [markerRef, marker] = useAdvancedMarkerRef();

	return (
		<>
			<AdvancedMarker
				ref={markerRef}
				onClick={() => setInfowindowOpen(true)}
				position={position}
				title={'AdvancedMarker that opens an Infowindow when clicked.'}
			/>
			{infowindowOpen && (
				<InfoWindow
					anchor={marker}
					maxWidth={400}
					onCloseClick={() => setInfowindowOpen(false)}
				>
					This is an example for the{' '}
					<code style={{ whiteSpace: 'nowrap' }}>&lt;AdvancedMarker /&gt;</code>{' '}
					combined with an Infowindow.
				</InfoWindow>
			)}
		</>
	);
};
