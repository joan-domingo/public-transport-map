export interface CustomBusLineJourney {
	name: string;
	real: boolean;
	minutesLeft: string;
}

export interface CustomBusLineTimetable {
	lineId: number;
	lineName: string;
	nextBuses: CustomBusLineJourney[];
	selected: boolean;
}
