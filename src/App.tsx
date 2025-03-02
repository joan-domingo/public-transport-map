import './App.css';
import { APIProvider } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import BusLineSelector from './components/BusLineSelector';
import Map from './components/Map';
import appStore from './store/appStore';

// https://visgl.github.io/react-google-maps/

const App = () => {
	const { busLineId } = appStore(
		useShallow((state) => ({
			busLineId: state.selectedBusLineId,
		})),
	);
	const [userLocation, setUserLocation] = useState<
		| {
				lat: number;
				lng: number;
		  }
		| undefined
	>(undefined);
	console.log('userLocation:', userLocation);

	const watchPosition = () => {
		if (navigator.geolocation) {
			// get the current users location
			navigator.geolocation.watchPosition(
				(position) => {
					console.log('watch position:', position);
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

	if (userLocation === null) {
		return <div>Geolocation is not supported by this browser.</div>;
	}

	return (
		<APIProvider
			apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
			language="ca"
			onLoad={watchPosition}
		>
			{!busLineId ? (
				<BusLineSelector />
			) : (
				<Map busLineId={busLineId} userLocation={userLocation} />
			)}
		</APIProvider>
	);
};

export default App;
