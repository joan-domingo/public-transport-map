import './App.css';
import { APIProvider } from '@vis.gl/react-google-maps';
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
