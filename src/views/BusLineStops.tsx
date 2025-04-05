import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import Map from '../components/Map';

interface Props {
	currentLocation: { lat: number; lng: number };
}

const BusLineStops = ({ currentLocation }: Props) => {
	const { busLineId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (!busLineId) {
			navigate('/');
		}
	}, []);

	if (currentLocation === null) {
		return <div>Geolocation is not supported by this browser.</div>;
	}

	return (
		<div style={{ display: 'flex', width: '100%', height: '100%' }}>
			<Map busLineId={busLineId!} userLocation={currentLocation} />
		</div>
	);
};

export default BusLineStops;
