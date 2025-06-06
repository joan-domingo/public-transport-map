interface BusStop {
	id: number;
	name: string;
	lat: number;
	lon: number;
	buses: string[];
	lineId: number;
	zoneId: number;
}

export default BusStop;
