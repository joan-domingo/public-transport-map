import { useNavigate } from 'react-router';
import BusLineSelector from '../components/BusLineSelector';
import type BusLine from '../types/busLine';

const busLines: BusLine[] = [
	{ id: 'a4', name: 'A4' },
	{ id: 'b2', name: 'B2' },
	{ id: 'e3', name: 'e3' },
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
