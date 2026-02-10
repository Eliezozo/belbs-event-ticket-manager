'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

interface Participation {
    id: number;
    event: {
        id: number;
        name: string;
        date: string;
        time: string;
        place: string;
    }
}

export default function MyEventsPage() {
    const [participations, setParticipations] = useState<Participation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                const response = await fetch('/api/participations');
                if (response.ok) {
                    const data = await response.json();
                    setParticipations(data.participations);
                } else if (response.status === 401) {
                    router.push('/auth/login');
                } else {
                    setError('Failed to fetch your events');
                }
            } catch (error) {
                setError('An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchMyEvents();
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{padding: '2rem'}}>
            <h1>My Events</h1>
            {participations.length > 0 ? (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem'}}>
                    {participations.map(participation => (
                        <div key={participation.id} style={{border: '1px solid #ccc', borderRadius: '8px', padding: '1rem'}}>
                            <h2>{participation.event.name}</h2>
                            <p>{new Date(participation.event.date).toLocaleDateString()} at {participation.event.time}</p>
                            <p>{participation.event.place}</p>
                            <button onClick={() => router.push(`/my-events/${participation.id}`)}>
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have not signed up for any events yet.</p>
            )}
        </div>
    );
}