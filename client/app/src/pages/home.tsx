import { useState } from 'react'
import { Link } from 'react-router-dom'
import GoogleMap from '../components/GoogleMap'
import Guides from '../components/Guides'
import travelClip from '../assets/vid/travel-clip.mp4';
import logo from '../assets/img/logo.png';

interface LocationDetails {
  city: string;
  country: string;
}

function Home() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [guidesUnlocked, setGuidesUnlocked] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<LocationDetails | null>(null);

  const getLocationDetails = async (lat: number, lng: number): Promise<LocationDetails> => {
    const API_KEY = 'AIzaSyCu7e_JI24_lQGTLIYnk5LuYh9XF0WSFZA';
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const addressComponents = result.address_components;
      
      let city = '';
      let country = '';

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
        city: city || 'Unknown City',
        country: country || 'Unknown Country'
      };
    }

    return {
      city: 'Unknown City',
      country: 'Unknown Country'
    };
  };

  const handleActivate = async () => {
    setShowMap(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      
      const locationDetails = await getLocationDetails(latitude, longitude);
      setUserLocation(locationDetails);
      setGuidesUnlocked(true);
    } catch (error) {
      console.error('Error getting location:', error);
      setUserLocation({
        city: 'Colombo',
        country: 'Sri Lanka'
      });
      setGuidesUnlocked(true);
    }
  };

  return (
    <>
    <div className='App'>
      <nav className='bg-white shadow-md p-4'>
        <div className='max-w-7xl mx-auto flex justify-center items-center text-center'>
        <img src={logo} alt="logo" className='h-10 absolute left-5 top-[15px] z-20' />

        <ul className='hidden md:flex space-x-10 text-gray-700 font-medium'>
          <li>
            <Link to="/feed" className='hover:text-blue-500 cursor-pointer'>Feed</Link>
          </li>
          <li>
            <Link to="/help" className='hover:text-blue-500 cursor-pointer'>Help</Link>
          </li>
        </ul>

      <div className='md:hidden'>
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label='Toggle Menu'>
          <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
        </button>
      </div>
      </div>

      {menuOpen && (
        <ul className='md:hidden flex flex-col space-y-2 mt-4 text-gray-500 font-medium'>
          <li>
            <Link to="/feed" className='hover:text-blue-500 cursor-pointer'>Feed</Link>
          </li>
          <li>
            <Link to="/help" className='hover:text-blue-500 cursor-pointer'>Help</Link>
          </li>
        </ul>
      )}

      </nav>

      <main className="relative p-6 h-[80vh] bg-cover bg-center text-white flex flex-col justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={travelClip}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-10" />
        
        <GoogleMap isVisible={showMap} onClose={() => setShowMap(false)} />
        
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-0.5 bg-amber-400"></div>
            <span className="text-white-100 text-sm font-medium tracking-widest uppercase">
              A Srilankan Guide 
            </span>
          </div>
        </div>
        
        <div className="relative z-10 max-w-4xl ml-auto text-right">
          <h1 className="text-5xl lg:text-5xl font-bold text-white leading-tight">
            Be Prepared For The<br />
            Travel And Beyond!
          </h1>
          <button 
            className='bg-amber-400 px-6 py-3 rounded-lg hover:bg-amber-300 text-black mt-4 cursor-pointer transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105'
            onClick={handleActivate}
          >
            Activate
          </button>
        </div>
      </main>
      </div>    

      <Guides isUnlocked={guidesUnlocked} place={userLocation ? `${userLocation.city}, ${userLocation.country}` : 'Unknown Location'} />

<Link to="/report">
  <button
    className="fixed bottom-6 right-6 text-white font-semibold px-5 py-3 rounded-lg 
              bg-gradient-to-r from-red-500 via-blue-600 to-blue-700
              shadow-lg shadow-red-400/50 active:scale-95 
              transform transition-all duration-300 cursor-pointer"
  >
    🚨 Report
  </button>
</Link>

    </>
  )
}

export default Home;
