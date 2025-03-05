import { useNavigate } from 'react-router';
import BusLineSelector from '../components/BusLineSelector';
import type BusLine from '../types/busLine';

const busLines: BusLine[] = [
	// { id: 'e1', name: 'e1' },
	// { id: 'e2.1', name: 'e2.1' },
	// { id: 'e2.2', name: 'e2.2' },
	{ id: 'b2', name: 'B2' },
	{ id: 'e3', name: 'e3' },
	// { id: 'e11.1', name: 'e11.1' },
	// { id: 'e11.2', name: 'e11.2' },
];

const Home = () => {
	const navigate = useNavigate();

	const handleOnSelectLine = (busLineId: string) => {
		navigate(`/${busLineId}`);
	};

	return (
		<BusLineSelector busLines={busLines} onSelectLine={handleOnSelectLine} />
	);
};

export default Home;
