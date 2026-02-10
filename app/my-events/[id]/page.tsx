'use client';

import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import QRCode from "react-qr-code";

interface ParticipationDetails {
    id: number;
    event: {
        name: string;
        date: string;
        time: string;
        place: string;
    };
}

export default function ParticipationDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const [participation, setParticipation] = useState<ParticipationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchParticipationDetails = async () => {
            try {
                const response = await fetch(`/api/participations/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setParticipation(data.participation);
                } else {
                    setError('Failed to fetch participation details');
                }
            } catch (error) {
                setError('An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchParticipationDetails();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!participation) {
        return <div>Participation not found.</div>
    }

    return (
        <div style={{padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h1>{participation.event.name}</h1>
            <p>{new Date(participation.event.date).toLocaleDateString()} at {participation.event.time}</p>
            <p>{participation.event.place}</p>
            <div style={{background: 'white', padding: '16px', marginTop: '2rem'}}>
                <QRCode value={participation.id.toString()}/>
            </div>
            <p style={{marginTop: '1rem'}}>Present this QR code at the event for check-in.</p>
        </div>
    );
}