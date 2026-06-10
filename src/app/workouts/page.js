'use client';
import { useEffect, useState } from 'react';
import './Workout.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const muscleImages = {
  abdominals: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  biceps: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
  chest: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  lats: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=800&q=80",
  lower_back: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  quadriceps: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&q=80",
  calves: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80",
  triceps: "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=800&q=80",
  shoulders: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  default: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"
};

export default function WorkoutsPage() {
  const API_KEY = process.env.NEXT_PUBLIC_NINJAS_API_KEY;
  const [workouts, setWorkouts] = useState([]);
  const [muscle, setMuscle] = useState('biceps');
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const muscles = [
    'abdominals', 'biceps', 'calves', 'chest', 'forearms', 'glutes',
    'hamstrings', 'lats', 'lower_back', 'middle_back', 'neck', 'quadriceps', 'traps', 'triceps'
  ];

  useEffect(() => {
    Aos.init({ duration: 600 });
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/auth/login');
  }, [session, status, router]);

  useEffect(() => {
    if (!API_KEY || status !== 'authenticated') return;

    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
          method: 'GET',
          headers: { 'X-Api-Key': API_KEY },
        });
        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error('Error fetching API Ninjas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [API_KEY, muscle, status]);

  if (status === 'loading') return <p style={{ textAlign: 'center', paddingTop: '10rem', color: '#fff' }}>Loading Workouts...</p>;

  return (
    <div className="workouts-container">
      <h1>Workout Gallery</h1>

      <div className="filter-section">
        <label htmlFor="muscle">Select Muscle Group:</label>
        <select
          id="muscle"
          value={muscle}
          onChange={(e) => setMuscle(e.target.value)}
        >
          {muscles.map((m) => (
            <option key={m} value={m}>
              {m.charAt(0).toUpperCase() + m.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {!API_KEY ? (
        <p style={{ textAlign: 'center', color: '#ff4d4f', marginTop: '2rem' }}>
          Please add NEXT_PUBLIC_NINJAS_API_KEY to your .env file to view exercises.
        </p>
      ) : loading ? (
        <p style={{ textAlign: 'center', color: '#a0a4c0', marginTop: '2rem' }}>Loading exercises...</p>
      ) : (
        <div className="workout-grid">
          {workouts.map((w, i) => (
            <div key={i} className="workout-card" data-aos="fade-up">
              <img
                src={muscleImages[w.muscle] || muscleImages.default}
                alt={w.name}
                className="workout-image"
                loading="lazy"
              />
              <h3>{w.name}</h3>
              <p><strong>Difficulty:</strong> {w.difficulty ? w.difficulty.charAt(0).toUpperCase() + w.difficulty.slice(1) : 'Unknown'}</p>
              <p><strong>Equipment:</strong> {w.equipments && w.equipments.length > 0 ? w.equipments.join(', ').replace(/_/g, ' ') : 'None'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
