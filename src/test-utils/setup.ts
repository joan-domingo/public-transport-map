// Mock geolocation for tests
export const mockGeolocation = {
	getCurrentPosition: () => {},
	watchPosition: () => 123, // Return a mock watch ID
	clearWatch: () => {},
};

// Track calls manually
export const mockCalls = {
	getCurrentPosition: [] as any[],
	watchPosition: [] as any[],
	clearWatch: [] as any[],
};

// Mock successful position
export const mockPosition = {
	coords: {
		latitude: 41.4912314,
		longitude: 2.1403111,
		accuracy: 100,
		altitude: null,
		altitudeAccuracy: null,
		heading: null,
		speed: null,
	},
	timestamp: Date.now(),
};

// Mock geolocation error
export const mockPositionError = {
	code: 1, // PERMISSION_DENIED
	message: 'User denied geolocation',
};

// Setup geolocation mock
export const setupGeolocationMock = () => {
	Object.defineProperty(global.navigator, 'geolocation', {
		value: {
			getCurrentPosition: (success: any, error: any, options: any) => {
				mockCalls.getCurrentPosition.push({ success, error, options });
			},
			watchPosition: (success: any, error: any, options: any) => {
				mockCalls.watchPosition.push({ success, error, options });
				return 123; // Mock watch ID
			},
			clearWatch: (id: number) => {
				mockCalls.clearWatch.push({ id });
			},
		},
		writable: true,
		configurable: true,
	});
};

// Reset all mocks
export const resetMocks = () => {
	mockCalls.getCurrentPosition.length = 0;
	mockCalls.watchPosition.length = 0;
	mockCalls.clearWatch.length = 0;
};
