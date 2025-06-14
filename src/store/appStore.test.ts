import { describe, expect, spyOn, test } from 'bun:test';
import { act, renderHook, waitFor } from '@testing-library/react';
import { create } from 'zustand';
import ApiClient from '../apiClient';
import type BusLineStopTimetable from '../types/busStopTimetable';
import appStore, { type AppStore } from './appStore';

describe('useStore', () => {
	const mockApiData: BusLineStopTimetable[] = [
		{
			idLinea: 12,
			desc_linea: 'A4 - A4-SANT  CUGAT DEL VALL\u00c8S - BARCELONA',
			trayectos: {
				Barcelona: [
					{
						minutos: '14 min 19.9087755 s',
						adaptada: null,
						real: 'S',
					},
				],
			},
			incidencias: null,
		},
		{
			idLinea: 15,
			desc_linea: 'B2 - B2-SABADELL - RIPOLLET',
			trayectos: {
				'Ripollet pel Taul\u00ed': [
					{
						minutos: '06 min 48.2632768 s',
						adaptada: null,
						real: 'S',
					},
				],
				Ripollet: [
					{
						minutos: '38 min 10.0132432 s',
						adaptada: null,
						real: 'S',
					},
				],
			},
			incidencias: null,
		},
		{
			idLinea: 33,
			desc_linea: 'UC1 - SU1-SERVEI URBA CERDANYOLA DEL VALLES 1',
			trayectos: {
				'Llu\u00eds Companys': [
					{
						minutos: '21 min 10.3210061 s',
						adaptada: null,
						real: 'S',
					},
				],
			},
			incidencias: null,
		},
		{
			idLinea: 167,
			desc_linea: 'UC3 - SU3-SERVEI URBA CERDANYOLA DEL VALLES 3',
			trayectos: {
				RENFE: [
					{
						minutos: '09 min 12.4398867 s',
						adaptada: null,
						real: 'S',
					},
				],
			},
			incidencias: null,
		},
		{
			idLinea: 184,
			desc_linea: 'B7 - B7-CERDANYOLA - S.CUGAT - RUB\u00cd',
			trayectos: {
				'Rub\u00ed': [
					{
						minutos: '19 min 16.0794519 s',
						adaptada: null,
						real: 'S',
					},
				],
			},
			incidencias: null,
		},
		{
			idLinea: 299,
			desc_linea: 'e3 - E3-BARCELONA - CERDANYOLA - UAB',
			trayectos: {
				Barcelona: [
					{
						minutos: '01 min 51.5944683 s',
						adaptada: null,
						real: 'S',
					},
					{
						minutos: '20 min 47.1168515 s',
						adaptada: null,
						real: 'S',
					},
					{
						minutos: '31 min 07.2044386 s',
						adaptada: null,
						real: 'S',
					},
				],
			},
			incidencias: null,
		},
	];

	const expectedCustomData = [
		{
			lineId: 12,
			lineName: 'A4 - A4-SANT  CUGAT DEL VALLÈS - BARCELONA',
			nextBuses: [
				{
					minutesLeft: '14 min 19 seg',
					name: 'Barcelona',
					real: true,
				},
			],
		},
		{
			lineId: 15,
			lineName: 'B2 - B2-SABADELL - RIPOLLET',
			nextBuses: [
				{
					minutesLeft: '06 min 48 seg',
					name: 'Ripollet pel Taulí',
					real: true,
				},
				{
					minutesLeft: '38 min 10 seg',
					name: 'Ripollet',
					real: true,
				},
			],
		},
		{
			lineId: 33,
			lineName: 'UC1 - SU1-SERVEI URBA CERDANYOLA DEL VALLES 1',
			nextBuses: [
				{
					minutesLeft: '21 min 10 seg',
					name: 'Lluís Companys',
					real: true,
				},
			],
		},
		{
			lineId: 167,
			lineName: 'UC3 - SU3-SERVEI URBA CERDANYOLA DEL VALLES 3',
			nextBuses: [
				{
					minutesLeft: '09 min 12 seg',
					name: 'RENFE',
					real: true,
				},
			],
		},
		{
			lineId: 184,
			lineName: 'B7 - B7-CERDANYOLA - S.CUGAT - RUBÍ',
			nextBuses: [
				{
					minutesLeft: '19 min 16 seg',
					name: 'Rubí',
					real: true,
				},
			],
		},
		{
			lineId: 299,
			lineName: 'e3 - E3-BARCELONA - CERDANYOLA - UAB',
			nextBuses: [
				{
					minutesLeft: '01 min 51 seg',
					name: 'Barcelona',
					real: true,
				},
				{
					minutesLeft: '20 min 47 seg',
					name: 'Barcelona',
					real: true,
				},
				{
					minutesLeft: '31 min 07 seg',
					name: 'Barcelona',
					real: true,
				},
			],
		},
	];

	test('filters out non-real time data', async () => {
		spyOn(ApiClient, 'fetchBusStopTimetable').mockResolvedValue(mockApiData);
		const { result } = renderHook(() => create<AppStore>(appStore));

		act(() => {
			result.current.getState().loadBusStopTimeTable(1, 2, 3);
		});

		await waitFor(() =>
			expect(ApiClient.fetchBusStopTimetable).toHaveBeenCalledWith(1, 2, 3),
		);

		expect(result.current.getState().selectedStopTimetable).toEqual(
			expectedCustomData,
		);
	});

	test('data to custom data', () => {
		const { result } = renderHook(() => create<AppStore>(appStore));

		act(() => {
			const customData = result.current
				.getState()
				.dataToCustomData(mockApiData);
			expect(customData).toEqual(expectedCustomData);
		});
	});
});
