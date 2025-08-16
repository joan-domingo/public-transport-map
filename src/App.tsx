import './App.css';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Route, Routes } from 'react-router';
import { useGeolocation } from './hooks/useGeolocation';
import BusStopsMap from './views/BusStopsMap';

const App = () => {
	const { location: userLocation, error: locationError } = useGeolocation();

	// Show error if geolocation fails
	if (locationError) {
		console.warn('Geolocation error:', locationError);
	}

	return (
		<APIProvider
			apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
			language="ca"
		>
			<Routes>
				<Route index element={<BusStopsMap currentLocation={userLocation} />} />
			</Routes>
		</APIProvider>
	);
};

export default App;
