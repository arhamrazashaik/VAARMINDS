import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MapComponent = ({
  origin,
  destination,
  height = '400px',
  width = '100%',
  showRoute = true,
  interactive = true,
  className = ''
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize the map
  useEffect(() => {
    // Safely initialize the map with error handling
    const initializeMap = () => {
      try {
        // Default to Bangalore if no origin is provided
        const defaultLocation = { lat: 12.9716, lng: 77.5946 }; // Bangalore

        const originLocation = origin?.lat && origin?.lng
          ? { lat: origin.lat, lng: origin.lng }
          : defaultLocation;

        // Create a fallback map if Google Maps fails
        if (!window.google || !window.google.maps) {
          setLoading(false);
          return;
        }

        const mapOptions = {
          center: originLocation,
          zoom: 13,
          mapTypeControl: interactive,
          streetViewControl: interactive,
          zoomControl: interactive,
          fullscreenControl: interactive,
          gestureHandling: interactive ? 'auto' : 'none',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        };

        const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
        setMap(newMap);

        // Add markers and route if both origin and destination are provided
        if (showRoute && origin && destination) {
          addMarkersAndRoute(newMap, origin, destination);
        } else if (origin) {
          // Just add origin marker if only origin is provided
          addMarker(newMap, originLocation, 'Origin');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map');
        setLoading(false);
      }
    };

    // Try to load Google Maps API if not already loaded
    if (!window.google || !window.google.maps) {
      try {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDHlM6-39YYVj7iVlbTKZZN91jql4piJd4&libraries=places&callback=initMapCallback`;
        script.async = true;
        script.defer = true;

        // Create a global callback function
        window.initMapCallback = () => {
          initializeMap();
        };

        script.onerror = () => {
          console.error('Failed to load Google Maps API');
          setError('Failed to load Google Maps API');
          setLoading(false);
        };

        document.head.appendChild(script);

        return () => {
          // Clean up
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
          delete window.initMapCallback;
        };
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps API');
        setLoading(false);
      }
    } else {
      // Google Maps already loaded
      initializeMap();
    }
  }, [origin, destination, interactive, showRoute]);

  // Update map when origin or destination changes
  useEffect(() => {
    if (map && showRoute && origin && destination) {
      // Clear previous markers and routes
      map.data.forEach(feature => {
        map.data.remove(feature);
      });

      // Add new markers and route
      addMarkersAndRoute(map, origin, destination);
    }
  }, [map, origin, destination, showRoute]);

  function addMarker(map, position, title) {
    const marker = new window.google.maps.Marker({
      position,
      map,
      title,
      animation: window.google.maps.Animation.DROP
    });

    return marker;
  }

  function addMarkersAndRoute(map, origin, destination) {
    // Add origin marker
    const originPosition = origin.lat && origin.lng
      ? { lat: origin.lat, lng: origin.lng }
      : getPositionFromAddress(origin.address);

    const originMarker = addMarker(map, originPosition, 'Origin');

    // Add destination marker
    const destinationPosition = destination.lat && destination.lng
      ? { lat: destination.lat, lng: destination.lng }
      : getPositionFromAddress(destination.address);

    const destinationMarker = addMarker(map, destinationPosition, 'Destination');

    // Draw route between markers
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true, // We already have markers
      polylineOptions: {
        strokeColor: '#8b5cf6', // Primary color
        strokeWeight: 5,
        strokeOpacity: 0.7
      }
    });

    directionsService.route({
      origin: originPosition,
      destination: destinationPosition,
      travelMode: window.google.maps.TravelMode.DRIVING
    }, (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);

        // Fit map to show both markers and route
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(originPosition);
        bounds.extend(destinationPosition);
        map.fitBounds(bounds);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  }

  function getPositionFromAddress(address) {
    // This is a dummy function that returns a position near Bangalore
    // In a real app, you would use the Geocoding API to convert address to coordinates

    // Generate a random position near Bangalore for demo purposes
    const bangaloreCenter = { lat: 12.9716, lng: 77.5946 };
    const lat = bangaloreCenter.lat + (Math.random() - 0.5) * 0.1;
    const lng = bangaloreCenter.lng + (Math.random() - 0.5) * 0.1;

    return { lat, lng };
  }

  if (error) {
    return (
      <div className={`bg-gray-100 p-4 rounded-lg ${className}`} style={{ height, width }}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700">Route Map</h3>
            <p className="text-gray-500 mt-2">
              {origin?.address && destination?.address ?
                `From ${origin.address} to ${destination.address}` :
                'Route information'
              }
            </p>
            <p className="text-sm text-gray-500 mt-4">
              {error}. Please check your internet connection and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`relative rounded-lg overflow-hidden shadow-lg ${className}`}
      style={{ height, width }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      )}
    </motion.div>
  );
};

export default MapComponent;
