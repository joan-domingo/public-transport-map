import { useCallback, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import appStore from '../store/appStore';
import type BusStop from '../types/busStop';

export const useBusStopSelection = () => {
	const [selectedStopId, setSelectedStopId] = useState<number | null>(null);

	const { loadBusStopTimeTable, clearSelectedBusStopTimetable } = appStore(
		useShallow((state) => ({
			loadBusStopTimeTable: state.loadBusStopTimeTable,
			clearSelectedBusStopTimetable: state.clearSelectedBusStopTimetable,
		})),
	);

	const selectStop = useCallback(
		async (stop: BusStop) => {
			const { id, lineId, zoneId } = stop;

			// Clear previous timetable and set new selection
			clearSelectedBusStopTimetable();
			setSelectedStopId(id);

			// Load new timetable
			await loadBusStopTimeTable(id, lineId, zoneId);
		},
		[loadBusStopTimeTable, clearSelectedBusStopTimetable],
	);

	const clearSelection = useCallback(() => {
		setSelectedStopId(null);
		clearSelectedBusStopTimetable();
	}, [clearSelectedBusStopTimetable]);

	return {
		selectedStopId,
		selectStop,
		clearSelection,
	};
};
