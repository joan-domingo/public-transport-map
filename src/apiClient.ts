import type BusLineStopTimetable from './types/busStopTimetable';

class ApiClient {
	static async fetchBusStopTimetable(
		stopId: number,
		lineId: number,
		zoneId: number,
	): Promise<BusLineStopTimetable[]> {
		const response = await fetch(
			`https://glo6ir56yyjdlmdtig4ztnqu7q0dcwlz.lambda-url.eu-central-1.on.aws/api/json/GetTiemposParada/es/${stopId}/${lineId}/${zoneId}`,
		);
		return await response.json();
	}
}

export default ApiClient;
