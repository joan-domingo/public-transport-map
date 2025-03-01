import { describe, expect, spyOn, test } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import { create } from 'zustand';
import ApiClient from '../apiClient';
import type BusLineStopTimetable from '../types/busStopTimetable';
import appStore, { type AppStore } from './appStore';

describe('useStore', () => {
	const mockApiData: BusLineStopTimetable[] = [
		{
			idLinea: 8,
			desc_linea: 'N65 - N65-BARCELONA - SABADELL - CASTELLAR',
			trayectos: {
				'BARCELONA-ST.QUIRZE-SABADELL-CASTELLAR DEL VALLES': {
					'01333': {
						minutos: '33\u0027 00\u0027\u0027',
						adaptada: null,
						real: 'N',
						hora: '00:48',
						tiempo: '13 h 33 min',
					},
					'01453': {
						minutos: '53\u0027 00\u0027\u0027',
						adaptada: null,
						real: 'N',
						hora: '02:08',
						tiempo: '14 h 53 min',
					},
					'01606': {
						minutos: '06\u0027 00\u0027\u0027',
						adaptada: null,
						real: 'N',
						hora: '03:21',
						tiempo: '16 h 06 min',
					},
					'01726': {
						minutos: '26\u0027 00\u0027\u0027',
						adaptada: null,
						real: 'N',
						hora: '04:41',
						tiempo: '17 h 26 min',
					},
				},
			},
			incidencias: null,
			selected: 0,
		},
		{
			idLinea: 37,
			desc_linea: 'N62 - N62-BARCELONA - UAB - SANT CUGAT',
			trayectos: {
				'BARCELONA - UAB - SANT CUGAT': {
					'01353': {
						minutos: '53\u0027 00\u0027\u0027',
						adaptada: null,
						real: 'N',
						hora: '01:08',
						tiempo: '13 h 53 min',
					},
					'01503': {
						minutos: '03\u0027 00\u0027\u0027',
						adaptada: null,
						real: 'N',
						hora: '02:18',
						tiempo: '15 h 03 min',
					},
					'01618': {
						minutos: '18\u0027 00\u0027\u0027',
						adaptada: null,
						real: 'N',
						hora: '03:33',
						tiempo: '16 h 18 min',
					},
					'01728': {
						minutos: '28\u0027 00\u0027\u0027',
						adaptada: null,
						real: 'N',
						hora: '04:43',
						tiempo: '17 h 28 min',
					},
				},
			},
			incidencias: null,
			selected: 0,
		},
		{
			idLinea: 39,
			desc_linea: 'N64 - BARCELONA - SABADELL - TERRASSA - RUBI - BARCELONA',
			trayectos: {
				'BARCELONA-TERRASSA (PER SABADELL)': {
					'01253': {
						minutos: '53\u0027 00\u0027\u0027',
						adaptada: null,
						real: 'N',
						hora: '00:08',
						tiempo: '12 h 53 min',
					},
					'01258': {
						minutos: '58\u0027 00\u0027\u0027',
						adaptada: null,
						real: 'N',
						hora: '00:13',
						tiempo: '12 h 58 min',
					},
					'01328': {
						minutos: '28\u0027 00\u0027\u0027',
						adaptada: null,
						real: 'N',
						hora: '00:43',
						tiempo: '13 h 28 min',
					},
					'01358': {
						minutos: '58\u0027 00\u0027\u0027',
						adaptada: null,
						real: 'N',
						hora: '01:13',
						tiempo: '13 h 58 min',
					},
					'01448': {
						minutos: '48\u0027 00\u0027\u0027',
						adaptada: null,
						real: 'N',
						hora: '02:03',
						tiempo: '14 h 48 min',
					},
				},
			},
			incidencias: null,
			selected: 0,
		},
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
