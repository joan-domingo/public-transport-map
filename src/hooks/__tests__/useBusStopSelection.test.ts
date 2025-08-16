import { beforeEach, describe, expect, test } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import type BusStop from '../../types/busStop';
import { useBusStopSelection } from '../useBusStopSelection';

// Simple test without complex module mocking - focus on hook behavior
describe('useBusStopSelection', () => {
	test('initializes with no selected stop', () => {
		const { result } = renderHook(() => useBusStopSelection());

		expect(result.current.selectedStopId).toBeNull();
		expect(typeof result.current.selectStop).toBe('function');
		expect(typeof result.current.clearSelection).toBe('function');
	});

	test('updates selected stop ID when selecting a stop', () => {
		const { result } = renderHook(() => useBusStopSelection());

		const mockStop: BusStop = {
			id: 123,
			lineId: 456,
			zoneId: 789,
			name: 'Test Stop',
			lat: 41.49,
			lon: 2.14,
			buses: ['A4'],
		};

		act(() => {
			result.current.selectStop(mockStop);
		});

		expect(result.current.selectedStopId).toBe(123);
	});

	test('clears selection when clearSelection is called', () => {
		const { result } = renderHook(() => useBusStopSelection());

		const mockStop: BusStop = {
			id: 123,
			lineId: 456,
			zoneId: 789,
			name: 'Test Stop',
			lat: 41.49,
			lon: 2.14,
			buses: ['A4'],
		};

		// First select a stop
		act(() => {
			result.current.selectStop(mockStop);
		});

		expect(result.current.selectedStopId).toBe(123);

		// Then clear selection
		act(() => {
			result.current.clearSelection();
		});

		expect(result.current.selectedStopId).toBeNull();
	});

	test('updates selection when selecting different stops', () => {
		const { result } = renderHook(() => useBusStopSelection());

		const mockStop1: BusStop = {
			id: 111,
			lineId: 222,
			zoneId: 333,
			name: 'Stop 1',
			lat: 41.49,
			lon: 2.14,
			buses: ['A4'],
		};

		const mockStop2: BusStop = {
			id: 444,
			lineId: 555,
			zoneId: 666,
			name: 'Stop 2',
			lat: 41.5,
			lon: 2.15,
			buses: ['B2'],
		};

		// Select first stop
		act(() => {
			result.current.selectStop(mockStop1);
		});

		expect(result.current.selectedStopId).toBe(111);

		// Select second stop
		act(() => {
			result.current.selectStop(mockStop2);
		});

		expect(result.current.selectedStopId).toBe(444);
	});

	test('maintains stable function references across renders', () => {
		const { result, rerender } = renderHook(() => useBusStopSelection());

		const selectStop1 = result.current.selectStop;
		const clearSelection1 = result.current.clearSelection;

		rerender();

		const selectStop2 = result.current.selectStop;
		const clearSelection2 = result.current.clearSelection;

		// Functions should be the same reference (memoized)
		expect(selectStop1).toBe(selectStop2);
		expect(clearSelection1).toBe(clearSelection2);
	});
});
