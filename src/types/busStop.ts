interface BusStop {
	Parada: {
		DESC_PARADA: string;
		COD_PARADA: number;
		ID_PARADA: number;
		LATITUD: number;
		LONGITUD: number;
		ID_ZONA: number;
	};
	ID_GRUPO: number;
	ID_LINEA: number;
	ID_TRAYECTO: number;
	SECUENCIA: number;
	ID_PARADA: number;
}

export default BusStop;
