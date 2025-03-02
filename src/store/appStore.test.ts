import { describe, expect, spyOn, test } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import { create } from 'zustand';
import ApiClient from '../apiClient';
import type BusLineStopTimetable from '../types/busStopTimetable';
import appStore, { type AppStore } from './appStore';

describe('useStore', () => {
	const mockApiData: BusLineStopTimetable[] = [
		{
			idLinea: 299,
			desc_linea: 'e3 - E3-BARCELONA - CERDANYOLA - UAB',
			trayectos: {
				UAB: [
					{
						minutos: '06 min 46.6414571 s',
						adaptada: null,
						real: 'S',
					},
				],
			},
			incidencias: null,
			selected: 1,
		},
	];

	test('filters out non-real time data', () => {
		spyOn(ApiClient, 'fetchBusStopTimetable').mockResolvedValue(mockApiData);
		const { result } = renderHook(() => create<AppStore>(appStore));

		act(() => {
			result.current.getState().loadBusStopTimeTable(1, 2, 3);
		});

		expect(result.current.getState().selectedStopTimetable).toEqual([
			{
				lineId: 299,
				lineName: 'e3 - E3-BARCELONA - CERDANYOLA - UAB',
				nextBuses: [],
			},
		]);
		expect(ApiClient.fetchBusStopTimetable).toHaveBeenCalledWith(1, 2, 3);
	});

	test('data to custom data', () => {
		const { result } = renderHook(() => create<AppStore>(appStore));

		act(() => {
			const customData = result.current
				.getState()
				.dataToCustomData(mockApiData);
			expect(customData).toEqual([
				{
					lineId: 8,
					lineName: 'N65 - N65-BARCELONA - SABADELL - CASTELLAR',
					nextBuses: [],
				},
				{
					lineId: 37,
					lineName: 'N62 - N62-BARCELONA - UAB - SANT CUGAT',
					nextBuses: [],
				},
				{
					lineId: 39,
					lineName: 'N64 - BARCELONA - SABADELL - TERRASSA - RUBI - BARCELONA',
					nextBuses: [],
				},
				{
					lineId: 299,
					lineName: 'e3 - E3-BARCELONA - CERDANYOLA - UAB',
					nextBuses: [
						{
							minutesLeft: '06 min 46.6414571 s',
							name: 'UAB',
							real: true,
						},
					],
				},
			]);
		});
	});
});
