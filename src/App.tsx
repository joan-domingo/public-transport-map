import './App.css';
import { APIProvider } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import BusLineSelector from './components/BusLineSelector';
import Map from './components/Map';
import appStore from './store/appStore';

// https://visgl.github.io/react-google-maps/

const App = () => {
	const { fetchData, busLineId } = appStore(
		useShallow((state) => ({
			fetchData: state.fetchData,
			busLineId: state.selectedBusLineId,
		})),
	);

	useEffect(() => {
		// fetchData();
	}, []);

	if (!busLineId) {
		return <BusLineSelector />;
	}

	return (
		<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
			<Map busLineId={busLineId} />
		</APIProvider>
	);
};

export default App;
