'use client';

import {useEffect, useState} from "react";

interface Event {
    id: number;
    name: string;
    description: string | null;
    date: string;
    time: string;
    place: string;
    pictureUrl: string | null;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events');
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data.events);
                } else {
                    setError('Failed to fetch events');
                }
            } catch (error) {
                setError('An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div style={{
                backgroundImage: `url('https://res.cloudinary.com/demo/image/upload/v1629882441/samples/landscapes/nature-mountains.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3rem',
                textAlign: 'center'
            }}>
                <h1>Events</h1>
            </div>

            <div style={{padding: '2rem'}}>
                {events.length > 0 ? (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem'}}>
                        {events.map(event => (
                            <div key={event.id} style={{border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden'}}>
                                {event.pictureUrl && <img src={event.pictureUrl} alt={event.name} style={{width: '100%', height: '200px', objectFit: 'cover'}}/>}
                                <div style={{padding: '1rem'}}>
                                    <h2>{event.name}</h2>
                                    <p>{event.description}</p>
                                    <p>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                                    <p>{event.place}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No events found.</p>
                )}
            </div>
        </div>
    );
}