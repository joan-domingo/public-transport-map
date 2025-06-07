const busLinesEndpoint = 'https://www.moventis.es/es/moventis/ca/lines';

try {
	console.log('Downloading all bus lines data...');
	// fetch data
	const response = await fetch(busLinesEndpoint);
	const busLinesDataList = await response.json();

	// Map data
	const busLinesData = {};
	for (const line of busLinesDataList) {
		// Assuming each line has a unique 'id' property
		busLinesData[line.ID_LINEA] = line;
	}

	// store data
	await Bun.write('data/bus-lines.json', JSON.stringify(busLinesData, null, 2));

	// const busLinesData = await Bun.file('data/bus-lines.json').text();

	const busLines = {
		648: 103,
		a4: 12,
		b2: 15,
		b7: 184,
		e3: 299,
		su1: 33,
		su2: 34,
		su3: 167,
	};

	// Download bus line stops, line by line
	for (let i = 0; i < Object.keys(busLines).length; i++) {
		const key = Object.keys(busLines)[i];
		const value = Object.values(busLines)[i];

		console.log(`Downloading ${key} bus line stops...`);
		const response = await fetch(
			`https://www.moventis.es/api/json/GetTrayectos/${value}/${busLinesData[value].DIAS_QUE_CIRCULA}`,
		);
		const body = await response.json();

		await Bun.write(`data/${key}.json`, JSON.stringify(body, null, 2));
	}

	// Convert data to something useful
	// Only one list of bus stops per bus line
	for (let i = 0; i < Object.keys(busLines).length; i++) {
		const key = Object.keys(busLines)[i];
		console.log(`Preparing ${key} bus line stops...`);

		const linesArray = await Bun.file(`data/${key}.json`).text();

		const busLineStops = JSON.parse(linesArray).flatMap(
			(item) => item.TrayectosDet,
		);

		// Remove duplicates from busLineStops
		const uniqueStops = new Map();
		for (const stop of busLineStops) {
			uniqueStops.set(stop.ID_PARADA, stop);
		}
		const busLineStopsArray = Array.from(uniqueStops.values());

		await Bun.write(
			`public/stops/${key}.json`,
			JSON.stringify(busLineStopsArray, null, 2),
		);
	}

	// Create a file with all bus stops
	console.log('Preparing all bus stops...');
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let allBusStops: any[] = [];

	for (let i = 0; i < Object.keys(busLines).length; i++) {
		const key = Object.keys(busLines)[i];
		const busLineStops = await Bun.file(`public/stops/${key}.json`).text();
		allBusStops = [...allBusStops, ...JSON.parse(busLineStops)];
	}

	// Remove duplicates from all bus stops data
	const uniqueStops = new Map();
	for (const stop of allBusStops) {
		uniqueStops.set(stop.ID_PARADA, stop);
	}
	const uniqueBusLineStopsArray = Array.from(uniqueStops.values());

	// Add new field with all the buses that stop at that stop
	for (const stop of uniqueBusLineStopsArray) {
		stop.buses = [];
		for (const [key, value] of Object.entries(busLines)) {
			const lineStops = await Bun.file(`public/stops/${key}.json`).text();
			const lineStopsArray = JSON.parse(lineStops);
			if (lineStopsArray.some((s) => s.ID_PARADA === stop.ID_PARADA)) {
				stop.buses.push(key);
			}
		}
	}

	// Reduce the array to only the necessary fields
	const busLineStopsArray = uniqueBusLineStopsArray.map((stop) => ({
		id: stop.ID_PARADA,
		name: stop.Parada.DESC_PARADA,
		lat: stop.Parada.LATITUD,
		lon: stop.Parada.LONGITUD,
		buses: stop.buses,
		lineId: stop.ID_LINEA,
		zoneId: stop.Parada.ID_ZONA,
	}));

	
	// Write the final data to a file
	await Bun.write(
		'public/stops/all.json',
		JSON.stringify(busLineStopsArray, null, 2),
	);
	console.log('All bus lines data downloaded and prepared successfully.');
} catch (err) {
	console.error('Error:', err);
}
export {};
