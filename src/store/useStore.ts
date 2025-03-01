import { create } from 'zustand';
import type { BusStop } from '../types/busStop';

interface StoreState {
	selectedBusLineId: string | undefined;
	busLineStops: BusStop[];
	setBusLineId: (busLineId: string) => void;
	loadBusStops: (busLineId: string) => Promise<void>;
	loadBusStopTimeTable: (
		stopId: number,
		lineId: number,
		zoneId: number,
	) => Promise<void>;
}

const useStore = create<StoreState>()((set) => ({
	selectedBusLineId: undefined,
	busLineStops: [],
	setBusLineId: (busLineId: string) => {
		set({ selectedBusLineId: busLineId });
	},
	loadBusStops: async (busLineId: string) => {
		const response = await fetch(`./stops/${busLineId}.json`);
		const data = await response.json();
		set({ busLineStops: data });
	},
	loadBusStopTimeTable: async (stopId, lineId, zoneId) => {
		const response = await fetch(
			`/api/json/GetTiemposParada/es/${stopId}/${lineId}/${zoneId}`,
		);
		const data = await response.json();
		console.log(data);
	},
}));

export default useStore;
