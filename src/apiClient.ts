import type BusLineStopTimetable from './types/busStopTimetable';

class ApiClient {
	static async fetchBusStopTimetable(
		stopId: number,
		lineId: number,
		zoneId: number,
	): Promise<BusLineStopTimetable[]> {
		const response = await fetch(
			`/api/json/GetTiemposParada/es/${stopId}/${lineId}/${zoneId}`,
		);
		return await response.json();
	}
}

export default ApiClient;
