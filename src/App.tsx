import './App.css';
import { APIProvider } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import BusStopsMap from './views/BusStopsMap';

const App = () => {
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

	return (
		<APIProvider
			apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
			language="ca"
			onLoad={watchPosition}
		>
			<Routes>
				<Route index element={<BusStopsMap currentLocation={userLocation} />} />
			</Routes>
		</APIProvider>
	);
};

export default App;
