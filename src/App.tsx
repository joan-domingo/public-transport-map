import './App.css';
import { Route, Routes } from 'react-router';
import BusLineStops from './views/BusLineStops';
import Home from './views/Home';

const App = () => {
	return (
		<Routes>
			<Route index element={<Home />} />
			<Route path="/:busLineId" element={<BusLineStops />} />
		</Routes>
	);
};

export default App;
