'use client';
import { useEffect, useState } from 'react';
import './Workout.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 

export default function WorkoutsPage() {
  const API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState('all');

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
    if (!ready) return;

    const fetchExercisesData = async () => {
      try {
        const response = await fetch('https://exercisedb.p.rapidapi.com/exercises', {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
          },
        });
        const exercisesData = await response.json();
        setWorkouts(exercisesData);
        setFilteredWorkouts(exercisesData);

        const parts = ['all', ...new Set(exercisesData.map((ex) => ex.bodyPart))];
        setBodyParts(parts);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchExercisesData();
  }, [API_KEY, ready]);

  useEffect(() => {
    if (selectedPart === 'all') {
      setFilteredWorkouts(workouts);
    } else {
      const filtered = workouts.filter((w) => w.bodyPart === selectedPart);
      setFilteredWorkouts(filtered);
    }
  }, [selectedPart, workouts]);

  if (!ready || status === 'loading') return <p style={{ textAlign: 'center' }}>Loading...</p>;

  return (
    <div className="workouts-container">
      <h1>Workout Gallery</h1>

      <div className="filter-section">
        <label htmlFor="bodyPart">Filter by Body Part:</label>
        <select
          id="bodyPart"
          value={selectedPart}
          onChange={(e) => setSelectedPart(e.target.value)}
        >
          {bodyParts.map((part, i) => (
            <option key={i} value={part}>
              {part.charAt(0).toUpperCase() + part.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="workout-grid">
        
  {
  filteredWorkouts.map((w, i) => (
    <div key={i} className="workout-card" data-aos="fade-up">
      <img
        src={w.gifUrl || "/default-workout.png"}  
        alt={w.name || "Workout image"}
        className="workout-image"
      />
      <h3>{w.name}</h3>
      <p>Body Part: {w.bodyPart}</p>
      <p>Target: {w.target}</p>
    </div>
  ))}
</div>


    </div>
    
  );
}
