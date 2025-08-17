import { useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import type BusStop from '../types/busStop';
import { MarkerWithInfowindow } from './MarkerWithInfoWindow';

interface SimpleBusStopMarkersProps {
	stops: BusStop[];
	selectedStopId: number | null;
	onStopClick: (stop: BusStop) => void;
	onCloseClick: () => void;
}

export const SimpleBusStopMarkers = ({
	stops,
	selectedStopId,
	onStopClick,
	onCloseClick,
}: SimpleBusStopMarkersProps) => {
	const map = useMap();
	const [visibleStops, setVisibleStops] = useState<BusStop[]>(stops);

	// Filter stops based on viewport and zoom for performance
	useEffect(() => {
		if (!map) {
			setVisibleStops(stops);
			return;
		}

		const updateVisibleStops = () => {
			const bounds = map.getBounds();
			const zoom = map.getZoom() || 15;

			if (!bounds) {
				setVisibleStops(stops);
				return;
			}

			// More generous marker limits based on zoom level
			const maxMarkers =
				zoom < 10
					? 50
					: zoom < 12
						? 200
						: zoom < 14
							? 500
							: zoom < 16
								? 1000
								: 2000;

			// Expand bounds by 20% to include markers slightly outside viewport
			const ne = bounds.getNorthEast();
			const sw = bounds.getSouthWest();
			const latSpan = ne.lat() - sw.lat();
			const lngSpan = ne.lng() - sw.lng();
			const expansion = 0.2; // 20% expansion

			const expandedBounds = new google.maps.LatLngBounds(
				new google.maps.LatLng(
					sw.lat() - latSpan * expansion,
					sw.lng() - lngSpan * expansion,
				),
				new google.maps.LatLng(
					ne.lat() + latSpan * expansion,
					ne.lng() + lngSpan * expansion,
				),
			);

			// Filter stops in expanded viewport
			const stopsInViewport = stops.filter((stop) => {
				const position = new google.maps.LatLng(stop.lat, stop.lon);
				return expandedBounds.contains(position);
			});

			// Always include selected stop
			const selectedStop = selectedStopId
				? stops.find((s) => s.id === selectedStopId)
				: null;

			let filteredStops = stopsInViewport.slice(0, maxMarkers);

			// Ensure selected stop is included
			if (selectedStop && !filteredStops.includes(selectedStop)) {
				filteredStops = [
					selectedStop,
					...filteredStops.slice(0, maxMarkers - 1),
				];
			}

			// Fallback: if we have very few markers, show more from the general area
			if (filteredStops.length < 20 && zoom >= 14) {
				const center = bounds.getCenter();
				const centerLat = center.lat();
				const centerLng = center.lng();

				// Simple distance calculation (Euclidean distance for performance)
				const nearbyStops = stops
					.map((stop) => ({
						stop,
						distance: Math.sqrt(
							Math.pow(stop.lat - centerLat, 2) +
								Math.pow(stop.lon - centerLng, 2),
						),
					}))
					.sort((a, b) => a.distance - b.distance)
					.slice(0, Math.min(100, maxMarkers))
					.map((item) => item.stop);

				// Merge with existing, avoiding duplicates
				const combined = [...filteredStops];
				for (const stop of nearbyStops) {
					if (!combined.find((s) => s.id === stop.id)) {
						combined.push(stop);
						if (combined.length >= maxMarkers) break;
					}
				}
				filteredStops = combined;
			}

			setVisibleStops(filteredStops);
		};

		// Initial update
		updateVisibleStops();

		// Listen for map changes with debouncing for better performance
		let timeoutId: NodeJS.Timeout;
		const debouncedUpdate = () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(updateVisibleStops, 150);
		};

		const boundsListener = map.addListener('bounds_changed', debouncedUpdate);
		const zoomListener = map.addListener('zoom_changed', updateVisibleStops); // Immediate for zoom

		return () => {
			clearTimeout(timeoutId);
			boundsListener.remove();
			zoomListener.remove();
		};
	}, [map, stops, selectedStopId]);

	return (
		<>
			{visibleStops.map((stop) => (
				<MarkerWithInfowindow
					key={stop.id}
					stop={stop}
					onClick={() => onStopClick(stop)}
					visible={selectedStopId === stop.id}
					onCloseClick={onCloseClick}
				/>
			))}
		</>
	);
};
