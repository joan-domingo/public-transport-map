import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import ApiClient from '../apiClient';
import type BusStop from '../types/busStop';
import type BusLineStopTimetable from '../types/busStopTimetable';
import type {
	CustomBusLineJourney,
	CustomBusLineTimetable,
} from '../types/customTimetable';

export interface AppStore {
	selectedBusLineId: string | undefined;
	busLineStops: BusStop[];
	selectedStopTimetable: CustomBusLineTimetable[];
	selectedStopTimetableIsLoading: boolean;
	selectedStopTimetableIsLoaded: boolean;
	setBusLineId: (busLineId: string) => void;
	loadBusStops: (busLineId: string) => Promise<void>;
	loadBusStopTimeTable: (
		stopId: number,
		lineId: number,
		zoneId: number,
	) => Promise<void>;
	dataToCustomData: (data: BusLineStopTimetable[]) => CustomBusLineTimetable[];
	clearSelectedBusStopTimetable: () => void;
	setSelectedStopTimetableIsLoading: (isLoading: boolean) => void;
	setSelectedStopTimetableIsLoaded: (isLoaded: boolean) => void;
}

const appStore = create<AppStore>()(
	devtools(
		(set, get) => ({
			selectedBusLineId: undefined,
			busLineStops: [],
			selectedStopTimetable: [],
			setBusLineId: (busLineId: string) => {
				set({ selectedBusLineId: busLineId }, false, 'setSelectedBusLineId');
			},
			loadBusStops: async (busLineId: string) => {
				const response = await fetch(`./stops/${busLineId}.json`);
				const data: BusStop[] = await response.json();
				set({ busLineStops: data }, false, 'setBusLineStops');
			},
			loadBusStopTimeTable: async (stopId, lineId, zoneId) => {
				set(
					{ selectedStopTimetable: undefined },
					false,
					'setSelectedStopTimetable',
				);
				get().setSelectedStopTimetableIsLoading(true);
				get().setSelectedStopTimetableIsLoaded(false);
				try {
					const data = await ApiClient.fetchBusStopTimetable(
						stopId,
						lineId,
						zoneId,
					);

					const filteredData = get()
						.dataToCustomData(data)
						.filter((busLine) => busLine.nextBuses.length > 0)
						.sort((a, b) => {
							if (a.selected) {
								return -1;
							}
							if (b.selected) {
								return 1;
							}
							return 0;
						});

					set(
						{ selectedStopTimetable: filteredData },
						false,
						'setSelectedStopTimetable',
					);
				} catch (error) {
				} finally {
					get().setSelectedStopTimetableIsLoading(false);
					get().setSelectedStopTimetableIsLoaded(true);
				}
			},
			dataToCustomData: (data) => {
				return data.map((busLineStopTimetable) => {
					const { idLinea, desc_linea, selected } = busLineStopTimetable;

					const journeyNextBusesByDestination = Object.values(
						busLineStopTimetable.trayectos,
					);
					const journeyDestinations = Object.keys(
						busLineStopTimetable.trayectos,
					);
					const nextBuses: CustomBusLineJourney[] = [];

					for (let i = 0, len = journeyDestinations.length; i < len; i++) {
						const journeyDestination = journeyDestinations[i];
						const journeyNextBuses = journeyNextBusesByDestination[i];

						if (Array.isArray(journeyNextBuses)) {
							for (let i = 0, len = journeyNextBuses.length; i < len; i++) {
								const journeyNextBus = journeyNextBuses[i];
								if (journeyNextBus) {
									nextBuses.push({
										name: journeyDestination,
										real: journeyNextBus.real && journeyNextBus.real === 'S',
										minutesLeft: `${journeyNextBus.minutos.split('.')[0]} seg`,
									});
								}
							}
						}
					}

					return {
						lineId: idLinea,
						lineName: desc_linea,
						nextBuses,
						selected: selected === 1,
					};
				});
			},
			clearSelectedBusStopTimetable: () => {
				set(
					{ selectedStopTimetable: [] },
					false,
					'clearSelectedBusStopTimetable',
				);
			},
			setSelectedStopTimetableIsLoading: (isLoading: boolean) => {
				set(
					{ selectedStopTimetableIsLoading: isLoading },
					false,
					'setSelectedStopTimetableIsLoading',
				);
			},
			setSelectedStopTimetableIsLoaded: (isLoaded: boolean) => {
				set(
					{ selectedStopTimetableIsLoaded: isLoaded },
					false,
					'setSelectedStopTimetableIsLoaded',
				);
			},
		}),
		{ name: 'appStore' },
	),
);

export default appStore;
