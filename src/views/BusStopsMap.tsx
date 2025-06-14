import Map from '../components/Map';

interface Props {
	currentLocation: { lat: number; lng: number };
}

const BusStopsMap = ({ currentLocation }: Props) => {
	if (currentLocation === null) {
		return <div>Geolocation is not supported by this browser.</div>;
	}

	return (
		<div style={{ display: 'flex', width: '100%', height: '100%' }}>
			<Map userLocation={currentLocation} />
		</div>
	);
};

export default BusStopsMap;
