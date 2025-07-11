import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  isVisible: boolean;
  onClose: () => void;
}

interface LocationDetails {
  address: string;
  placeName: string;
  placeType: string;
  city: string;
  country: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ isVisible, onClose }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = 'AIzaSyCu7e_JI24_lQGTLIYnk5LuYh9XF0WSFZA';

  const getLocationDetails = async (lat: number, lng: number): Promise<LocationDetails> => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const addressComponents = result.address_components;
      
      let placeName = '';
      let placeType = '';
      let city = '';
      let country = '';

      const establishment = addressComponents.find((comp: any) => 
        comp.types.includes('establishment') || 
        comp.types.includes('point_of_interest') ||
        comp.types.includes('route')
      );
      
      if (establishment) {
        placeName = establishment.long_name;
        placeType = establishment.types[0];
      } else {
        const locality = addressComponents.find((comp: any) => 
          comp.types.includes('locality') || 
          comp.types.includes('sublocality')
        );
        if (locality) {
          placeName = locality.long_name;
          placeType = 'area';
        }
      }

      const cityComponent = addressComponents.find((comp: any) => 
        comp.types.includes('locality') || 
        comp.types.includes('administrative_area_level_2')
      );
      if (cityComponent) {
        city = cityComponent.long_name;
      }

      const countryComponent = addressComponents.find((comp: any) => 
        comp.types.includes('country')
      );
      if (countryComponent) {
        country = countryComponent.long_name;
      }

      return {
        address: result.formatted_address,
        placeName: placeName || 'Current Location',
        placeType: placeType || 'location',
        city: city || 'Unknown City',
        country: country || 'Unknown Country'
      };
    }

    return {
      address: 'Unknown Address',
      placeName: 'Current Location',
      placeType: 'location',
      city: 'Unknown City',
      country: 'Unknown Country'
    };
  };

  const getPlaceTypeIcon = (placeType: string) => {
    switch (placeType.toLowerCase()) {
      case 'restaurant':
      case 'food':
        return '🍽️';
      case 'park':
      case 'natural_feature':
        return '🌳';
      case 'church':
      case 'mosque':
      case 'temple':
      case 'synagogue':
      case 'place_of_worship':
        return '⛪';
      case 'hospital':
      case 'health':
        return '🏥';
      case 'school':
      case 'university':
      case 'education':
        return '🎓';
      case 'shopping_mall':
      case 'store':
      case 'commercial':
        return '🛍️';
      case 'hotel':
      case 'lodging':
        return '🏨';
      case 'bank':
      case 'finance':
        return '🏦';
      case 'gas_station':
        return '⛽';
      case 'route':
      case 'street':
        return '🛣️';
      default:
        return '📍';
    }
  };

  const formatPlaceType = (placeType: string) => {
    const typeMap: { [key: string]: string } = {
      'establishment': 'Business',
      'point_of_interest': 'Point of Interest',
      'restaurant': 'Restaurant',
      'food': 'Food Establishment',
      'park': 'Park',
      'natural_feature': 'Natural Feature',
      'church': 'Church',
      'mosque': 'Mosque',
      'temple': 'Temple',
      'synagogue': 'Synagogue',
      'place_of_worship': 'Religious Place',
      'hospital': 'Hospital',
      'health': 'Healthcare',
      'school': 'School',
      'university': 'University',
      'education': 'Educational Institution',
      'shopping_mall': 'Shopping Mall',
      'store': 'Store',
      'commercial': 'Commercial Area',
      'hotel': 'Hotel',
      'lodging': 'Lodging',
      'bank': 'Bank',
      'finance': 'Financial Institution',
      'gas_station': 'Gas Station',
      'route': 'Street',
      'street': 'Street',
      'locality': 'City Area',
      'sublocality': 'Neighborhood',
      'area': 'Area',
      'location': 'Location'
    };

    return typeMap[placeType] || placeType.charAt(0).toUpperCase() + placeType.slice(1);
  };

  useEffect(() => {
    if (!isVisible || !mapRef.current) return;

    const initMap = async () => {
      setLoading(true);
      
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          });
        });

        const { latitude, longitude } = position.coords;

        const details = await getLocationDetails(latitude, longitude);
        setLocationDetails(details);

        const loader = new Loader({
          apiKey: API_KEY,
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();
        
        const mapInstance = new google.maps.Map(mapRef.current!, {
          center: { lat: latitude, lng: longitude },
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstance,
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 12)
          }
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        const defaultLocation = { lat: 6.9271, lng: 79.8612 };
        
        try {
          const details = await getLocationDetails(defaultLocation.lat, defaultLocation.lng);
          setLocationDetails(details);
        } catch (geocodeError) {
          console.error('Error getting location details:', geocodeError);
          setLocationDetails({
            address: 'Colombo, Sri Lanka',
            placeName: 'Colombo',
            placeType: 'city',
            city: 'Colombo',
            country: 'Sri Lanka'
          });
        }
        
        const loader = new Loader({
          apiKey: API_KEY,
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();
        
        const mapInstance = new google.maps.Map(mapRef.current!, {
          center: defaultLocation,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
        });

        new google.maps.Marker({
          position: defaultLocation,
          map: mapInstance,
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 12)
          }
        });

      } finally {
        setLoading(false);
      }
    };

    initMap();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-40">
      <div className="relative w-full h-full">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-600">Getting your location...</p>
            </div>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="w-full h-full"
        />
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 hover:text-gray-900 rounded-full p-2 shadow-lg transition-all duration-200"
        aria-label="Close map"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {locationDetails && (
        <div className="absolute bottom-4 left-4 z-50 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{getPlaceTypeIcon(locationDetails.placeType)}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{locationDetails.placeName}</h3>
              <p className="text-sm text-gray-600">{formatPlaceType(locationDetails.placeType)}</p>
              <p className="text-xs text-gray-500 mt-1">{locationDetails.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
