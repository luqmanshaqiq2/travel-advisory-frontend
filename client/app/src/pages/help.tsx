import React from 'react';
import logo from '../assets/img/logo.png';

const advisoryData = [
  {
    title: 'Official Travel Advisories',
    description: "It's highly recommended to consult the travel advisories from your own government before and during your trip, as they provide tailored safety advice and consular assistance information.",
    imageUrl: 'https://plus.unsplash.com/premium_photo-1683121166075-c2798623be14?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    links: [
      { name: 'Australia: Smartraveller', url: 'https://www.smartraveller.gov.au/destinations/asia/sri-lanka' },
      { name: 'Canada: Travel Advice', url: 'https://travel.gc.ca/destinations/sri-lanka' },
      { name: 'UK: FCDO Travel Advice', url: 'https://www.gov.uk/foreign-travel-advice/sri-lanka' },
      { name: 'US: State Dept. Advisory', url: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/sri-lanka-travel-advisory.html' },
      { name: 'Ireland: Dept. of Foreign Affairs', url: 'https://www.ireland.ie/en/dfa/overseas-travel/advice/sri-lanka/' },
    ]
  },
  {
    title: 'Real-Time Alerts & Notifications',
    description: "For real-time alerts within Sri Lanka, monitor local news and official channels. A combination of resources is recommended.",
    imageUrl: 'https://images.unsplash.com/photo-1606495813362-8efff01b8573?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    links: [
        { name: 'Disaster Management Centre (DMC)', url: 'http://www.dmc.gov.lk/index_english.htm' },
        { name: 'Sri Lanka Police News', url: 'https://www.police.lk/index.php/news-a-events/news' },
        { name: 'Daily Mirror', url: 'http://www.dailymirror.lk' },
        { name: 'Newsfirst', url: 'https://www.newsfirst.lk/latest-news/' },
    ]
  },
   {
    title: '24/7 Emergency Assistance',
    description: 'Save these primary hotlines to your phone. For tourist-specific issues, the Tourist Police can assist.',
    imageUrl: 'https://images.unsplash.com/photo-1603714228681-b399854b8f80?q=80&w=860&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    links: [
      { name: 'National Emergency (Police)', text: '119' },
      { name: 'Ambulance / Fire & Rescue', text: '110' },
      { name: 'Suwa Seriya Ambulance (Free)', text: '1990' },
      { name: 'Tourist Police Hotline', text: '1912' },
      { name: 'Government Info Center', text: '1919' },
    ]
  },
  {
    title: 'Documentation Matters',
    description: 'For visa, customs, and other official documentation, always refer directly to Sri Lankan government websites.',
    imageUrl: 'https://images.unsplash.com/photo-1581656702382-9ae90e68e7b7?q=80&w=681&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    links: [
        { name: 'Immigration & Emigration Dept.', url: 'https://www.immigration.gov.lk/' },
        { name: 'Online ETA Application', url: 'https://www.eta.gov.lk/slvisa/' },
        { name: 'Sri Lanka Customs', url: 'https://www.customs.gov.lk/personal/travellers/' },
        { name: 'Airport & Aviation Services', url: 'https://www.airport.lk/passenger_guide/arrival_info/customs' },
    ]
  }
];

const HelpCard: React.FC<{ title: string; description: string; links: {name: string; url?: string; text?: string}[]; imageUrl: string; }> = ({ title, description, links, imageUrl }) => (
  <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
    <div className="md:grid md:grid-cols-5 h-full">
      <div className="md:col-span-2">
        <img className="h-full w-full object-cover" src={imageUrl} alt={title} />
      </div>
      <div className="p-8 md:col-span-3">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
        <div className="mt-6">
          <ul className="space-y-3">
            {links.map((link, index) => (
              <li key={index} className="text-gray-700">
                {link.url ? (
                  <a 
                    href={link.url}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-blue-600 hover:underline"
                  >
                    {link.name}
                  </a>
                ) : (
                  <span>{link.name}: <span className="font-semibold text-blue-600">{link.text}</span></span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);


const Help: React.FC = () => {
  return (
    <div className="bg-white py-12 sm:py-16 relative">
      <img src={logo} alt="logo" className="h-10 absolute left-5 top-[15px] z-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <h2 className="text-sm font-semibold text-blue-600 tracking-widest uppercase">Resources</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Essential Traveler Information
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {advisoryData.map((item, index) => (
            <HelpCard key={index} title={item.title} description={item.description} links={item.links} imageUrl={item.imageUrl} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help; 