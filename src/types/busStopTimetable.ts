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
}

export default BusLineStopTimetable;
