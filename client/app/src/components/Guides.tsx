import React, { useEffect, useState } from 'react';

interface GuidesProps {
  isUnlocked: boolean;
  place: string;
}

const Guides: React.FC<GuidesProps> = ({ isUnlocked, place }) => {
  const [dos, setDos] = useState<string[]>([]);
  const [donts, setDonts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isUnlocked && place) {
      const fetchGuides = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch('http://localhost:3001/api/guides', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ place }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch guides');
          }

          const data = await response.json();
          setDos(data.dos || []);
          setDonts(data.donts || []);
        } catch (err: any) {
          setError(err.message || 'An unexpected error occurred');
        } finally {
          setIsLoading(false);
        }
      };

      fetchGuides();
    }
  }, [isUnlocked, place]);

  const renderContent = (items: string[], type: 'dos' | 'donts') => {
    if (isLoading) {
      return (
        <ul className="space-y-3">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <li key={i} className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </ul>
      );
    }

    if (error && items.length === 0) {
      return <p className="text-red-500">{error}</p>;
    }

    return (
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={type === 'dos' ? 'text-green-500 mt-1' : 'text-red-500 mt-1'}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  if (!isUnlocked) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <img
              src="https://img.icons8.com/?size=100&id=UFlDT4TV1YTn&format=png&color=000000"
              alt="Lock"
              className="mx-auto mb-4 w-16 h-16 opacity-50"
            />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Travel Guides Locked</h2>
            <p className="text-gray-600 mb-4">
              Activate your location to unlock personalized travel guides for your destination.
            </p>
            <button className="bg-amber-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-300 transition-colors">
              Activate Location
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <img
            src="https://img.icons8.com/?size=100&id=lbcOUKB49q2a&format=png&color=000000"
            alt="Guide"
            className="mx-auto mb-4 w-16 h-16"
          />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Travel Guide</h2>
          <p className="text-gray-600">Personalized tips for {place}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
              <span className="mr-2">✅</span>
              Do's
            </h3>
            {renderContent(dos, 'dos')}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
              <span className="mr-2">❌</span>
              Don'ts
            </h3>
            {renderContent(donts, 'donts')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guides; 