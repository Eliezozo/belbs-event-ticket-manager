'use client';

import {useState} from "react";

export default function CreateEventPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const formData = new FormData(event.currentTarget);
            const response = await fetch('/api/events', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setSuccess(true);
            } else {
                const data = await response.json();
                setError(data.error || 'Une erreur s\'est produite');
            }
        } catch (error) {
            setError('Une erreur s\'est produite');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Créer un événement</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nom</label>
                    <input type="text" id="name" name="name" required/>
                </div>
                <div>
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" required/>
                </div>
                <div>
                    <label htmlFor="time">Heure</label>
                    <input type="time" id="time" name="time" required/>
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description"/>
                </div>
                <div>
                    <label htmlFor="place">Lieu</label>
                    <input type="text" id="place" name="place" required/>
                </div>
                <div>
                    <label htmlFor="participantsLimit">Limite de participants (-1 pour illimité)</label>
                    <input type="number" id="participantsLimit" name="participantsLimit" defaultValue="-1" required/>
                </div>
                <div>
                    <label htmlFor="picture">Image</label>
                    <input type="file" id="picture" name="picture" accept="image/*"/>
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Création en cours...' : 'Créer un événement'}
                </button>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {success && <p style={{color: 'green'}}>Événement créé avec succès !</p>}
            </form>
        </div>
    );
}
