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
		| null
	>(undefined);
	console.log('userLocation:', userLocation);

	const getUserLocation = () => {
		// if geolocation is supported by the users browser
		if (navigator.geolocation) {
			// get the current users location
			navigator.geolocation.getCurrentPosition(
				(position) => {
					console.log('getCurrentPosition:', position);
					// save the geolocation coordinates in two variables
					const { latitude, longitude } = position.coords;
					// update the value of userlocation variable
					setUserLocation({ lat: latitude, lng: longitude });
				},
				// if there was an error getting the users location
				(error) => {
					console.error('Error getting user location:', error);
					setUserLocation(null);
				},
			);
		}
		// if geolocation is not supported by the users browser
		else {
			console.error('Geolocation is not supported by this browser.');
			setUserLocation(null);
		}
	};

	if (userLocation === null) {
		return <div>Geolocation is not supported by this browser.</div>;
	}

	if (!busLineId) {
		return <BusLineSelector />;
	}

	return (
		<APIProvider
			apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
			language="ca"
			onLoad={getUserLocation}
		>
			<Map busLineId={busLineId} userLocation={userLocation} />
		</APIProvider>
	);
};

export default App;
