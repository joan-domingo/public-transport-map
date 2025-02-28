import { useEffect, useState } from 'react';
import './App.css';
import {
	APIProvider,
	AdvancedMarker,
	Map as GoogleMap,
} from '@vis.gl/react-google-maps';

// https://visgl.github.io/react-google-maps/

const App = () => {
	const position = { lat: 53.54992, lng: 10.00678 };
	const [userLocation, setUserLocation] = useState<
		| {
				lat: number;
				lng: number;
		  }
		| undefined
	>(undefined);

	// define the function that finds the users geolocation
	const getUserLocation = () => {
		// if geolocation is supported by the users browser
		if (navigator.geolocation) {
			// get the current users location
			navigator.geolocation.getCurrentPosition(
				(position) => {
					// save the geolocation coordinates in two variables
					const { latitude, longitude } = position.coords;
					// update the value of userlocation variable
					setUserLocation({ lat: latitude, lng: longitude });
				},
				// if there was an error getting the users location
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

	useEffect(() => getUserLocation(), []);

	return (
		<APIProvider apiKey="AIzaSyBh3nxoDyeQ0aUPugjXndE4LnVWCJO7YgU">
			<GoogleMap
				style={{ width: '100vw', height: '100vh' }}
				defaultCenter={userLocation}
				defaultZoom={18}
				gestureHandling={'greedy'}
				disableDefaultUI={true}
				mapId="DEMO_MAP_ID"
			>
				<AdvancedMarker position={userLocation} />
			</GoogleMap>
		</APIProvider>
	);
};

export default App;
