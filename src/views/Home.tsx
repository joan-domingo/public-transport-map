import { useNavigate } from 'react-router';
import BusLineSelector from '../components/BusLineSelector';
import type BusLine from '../types/busLine';

const busLines: BusLine[] = [
	{ id: 'all', name: 'ALL' },
	{ id: '648', name: '648' },
	{ id: 'a4', name: 'A4' },
	{ id: 'b2', name: 'B2' },
	{ id: 'b7', name: 'B7' },
	{ id: 'e3', name: 'e3' },
	{ id: 'su1', name: 'SU1' },
	{ id: 'su2', name: 'SU2' },
	{ id: 'su3', name: 'SU3' },
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
