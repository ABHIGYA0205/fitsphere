'use client';
import { useEffect, useState } from 'react';
import './Favorites.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Aos.init({ duration: 600 });
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login');
    } else {
      setReady(true);
    }
  }, [session, status, router]);

  useEffect(() => {
    if (ready && session) {
      const fetchFavorites = async () => {
        try {
          const res = await fetch('/api/favorites');
          if (res.ok) {
            const vids = await res.json();
            setFavorites(vids);
          }
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      };
      fetchFavorites();
    }
  }, [ready, session]);

  const removeFromFavorites = async (videoIdToRemove) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: videoIdToRemove })
      });
      if (res.ok) {
        const updated = favorites.filter((id) => id !== videoIdToRemove);
        setFavorites(updated);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (!ready || status === 'loading') return null;

  return (
    <div className="favorites-container">
      <h1 className="favorites-title">Your Favorite Workouts</h1>

      {favorites.length === 0 ? (
        <p className="no-favorites">You haven&apos;t added any workouts to favorites yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((videoId) => (
            <div key={videoId} className="favorite-card">
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allowFullScreen
                title={`Workout ${videoId}`}
              />
              <button
                className="remove-button"
                onClick={() => removeFromFavorites(videoId)}
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
