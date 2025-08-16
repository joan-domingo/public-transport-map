import { AdvancedMarker } from '@vis.gl/react-google-maps';

interface UserLocationMarkerProps {
	location: { lat: number; lng: number };
}

export const UserLocationMarker = ({ location }: UserLocationMarkerProps) => {
	return (
		<AdvancedMarker position={location} title="Ubicació actual">
			<div className="absolute top-0 left-0 w-4 h-4 bg-blue-600 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-50" />
		</AdvancedMarker>
	);
};
