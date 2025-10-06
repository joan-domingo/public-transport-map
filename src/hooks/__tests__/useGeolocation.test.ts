import { beforeEach, describe, expect, test } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import { useGeolocation } from '../useGeolocation';

describe('useGeolocation', () => {
	let mockGeolocation: any;
	let getCurrentPositionCalls: any[] = [];
	let watchPositionCalls: any[] = [];
	let clearWatchCalls: any[] = [];

	beforeEach(() => {
		getCurrentPositionCalls = [];
		watchPositionCalls = [];
		clearWatchCalls = [];

		mockGeolocation = {
			getCurrentPosition: (success: any, error: any, options: any) => {
				getCurrentPositionCalls.push({ success, error, options });
			},
			watchPosition: (success: any, error: any, options: any) => {
				watchPositionCalls.push({ success, error, options });
				return 123; // Mock watch ID
			},
			clearWatch: (id: number) => {
				clearWatchCalls.push({ id });
			},
		};

		Object.defineProperty(global.navigator, 'geolocation', {
			value: mockGeolocation,
			writable: true,
			configurable: true,
		});
	});

	test('initializes with default location and loading state', () => {
		const { result } = renderHook(() => useGeolocation());

		expect(result.current.location).toEqual({
			lat: 41.4912314,
			lng: 2.1403111,
		});
		expect(result.current.error).toBeNull();
		expect(result.current.isLoading).toBe(true);
	});

	test('handles successful geolocation', () => {
		const { result } = renderHook(() => useGeolocation());

		const mockPosition = {
			coords: {
				latitude: 41.5,
				longitude: 2.2,
			},
		};

		act(() => {
			const successCallback = getCurrentPositionCalls[0]?.success;
			if (successCallback) successCallback(mockPosition);
		});

		expect(result.current.location).toEqual({
			lat: 41.5,
			lng: 2.2,
		});
		expect(result.current.error).toBeNull();
		expect(result.current.isLoading).toBe(false);
	});

	test('handles geolocation permission denied error', () => {
		const { result } = renderHook(() => useGeolocation());

		act(() => {
			const errorCallback = getCurrentPositionCalls[0]?.error;
			if (errorCallback)
				errorCallback({
					code: 1,
					PERMISSION_DENIED: 1,
					POSITION_UNAVAILABLE: 2,
					TIMEOUT: 3,
				}); // PERMISSION_DENIED
		});

		expect(result.current.error).toBe('Location access denied by user');
		expect(result.current.isLoading).toBe(false);
	});

	test('handles geolocation position unavailable error', () => {
		const { result } = renderHook(() => useGeolocation());

		act(() => {
			const errorCallback = getCurrentPositionCalls[0]?.error;
			if (errorCallback)
				errorCallback({
					code: 2,
					PERMISSION_DENIED: 1,
					POSITION_UNAVAILABLE: 2,
					TIMEOUT: 3,
				}); // POSITION_UNAVAILABLE
		});

		expect(result.current.error).toBe('Location information unavailable');
		expect(result.current.isLoading).toBe(false);
	});

	test('handles geolocation timeout error', () => {
		const { result } = renderHook(() => useGeolocation());

		act(() => {
			const errorCallback = getCurrentPositionCalls[0]?.error;
			if (errorCallback)
				errorCallback({
					code: 3,
					PERMISSION_DENIED: 1,
					POSITION_UNAVAILABLE: 2,
					TIMEOUT: 3,
				}); // TIMEOUT
		});

		expect(result.current.error).toBe('Location request timed out');
		expect(result.current.isLoading).toBe(false);
	});

	test('handles unsupported geolocation', () => {
		Object.defineProperty(global.navigator, 'geolocation', {
			value: undefined,
			writable: true,
		});

		const { result } = renderHook(() => useGeolocation());

		expect(result.current.error).toBe(
			'Geolocation is not supported by this browser',
		);
		expect(result.current.isLoading).toBe(false);
	});

	test('calls both getCurrentPosition and watchPosition', () => {
		renderHook(() => useGeolocation());

		expect(getCurrentPositionCalls).toHaveLength(1);
		expect(watchPositionCalls).toHaveLength(1);

		const expectedOptions = {
			enableHighAccuracy: false,
			timeout: 3000,
			maximumAge: 600000,
		};

		expect(getCurrentPositionCalls[0]?.options).toEqual(expectedOptions);
		expect(watchPositionCalls[0]?.options).toEqual(expectedOptions);
	});

	test('cleans up watch on unmount', () => {
		const { unmount } = renderHook(() => useGeolocation());

		unmount();

		expect(clearWatchCalls).toHaveLength(1);
		expect(clearWatchCalls[0]?.id).toBe(123);
	});

	test('updates location when watch position triggers', () => {
		const { result } = renderHook(() => useGeolocation());

		const newPosition = {
			coords: {
				latitude: 41.6,
				longitude: 2.3,
			},
		};

		act(() => {
			const watchSuccessCallback = watchPositionCalls[0]?.success;
			if (watchSuccessCallback) watchSuccessCallback(newPosition);
		});

		expect(result.current.location).toEqual({
			lat: 41.6,
			lng: 2.3,
		});
		expect(result.current.error).toBeNull();
		expect(result.current.isLoading).toBe(false);
	});
});
