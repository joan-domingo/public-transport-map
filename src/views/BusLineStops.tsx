import { APIProvider } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Map from '../components/Map';

const BusLineStops = () => {
	const { busLineId } = useParams();
	const navigate = useNavigate();

	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	}>({ lat: 41.4912314, lng: 2.1403111 });

	const watchPosition = () => {
		if (navigator.geolocation) {
			// get the current users location
			navigator.geolocation.watchPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setUserLocation({ lat: latitude, lng: longitude });
				},
				(error) => {
					console.error('Error getting user location:', error);
				},
			);
		}
		// if geolocation is not supported by the users browser
		else {
			console.error('Geolocation is not supported by this browser.');
		}
	};

	useEffect(() => {
		if (!busLineId) {
			navigate('/');
		}
	}, []);

	if (userLocation === null) {
		return <div>Geolocation is not supported by this browser.</div>;
	}

	return (
		<APIProvider
			apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
			language="ca"
			onLoad={watchPosition}
		>
			<div style={{ display: 'flex', width: '100%', height: '100%' }}>
				<Map busLineId={busLineId!} userLocation={userLocation} />
			</div>
		</APIProvider>
	);
};

export default BusLineStops;
