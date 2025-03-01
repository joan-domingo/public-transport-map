export interface Journey {
	minutos: string;
	real: 'S' | 'N';
	adaptada: unknown;
	hora?: string;
	tiempo?: string;
}

interface BusLineStopTimetable {
	idLinea: number;
	desc_linea: string;
	trayectos: Record<string, Journey[]>;
	incidencias: unknown;
	selected: 0 | 1; // It's part of the selected bus line
}

export default BusLineStopTimetable;
