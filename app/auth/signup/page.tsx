'use client';

import {useState} from "react";

export default function SignupPage() {
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
            const response = await fetch('/api/auth/signup', {
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
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstName">Prénoms</label>
                    <input type="text" id="firstName" name="firstName" required/>
                </div>
                <div>
                    <label htmlFor="lastName">Nom</label>
                    <input type="text" id="lastName" name="lastName" required/>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required/>
                </div>
                <div>
                    <label htmlFor="phoneNumber">Numéro de telephone</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" required/>
                </div>
                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" id="password" name="password" required/>
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Création du compte...' : 'S\'inscrire'}
                </button>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {success && <p style={{color: 'green'}}>Compte créé avec succès ! Vous pouvez maintenant vous connecter.</p>}
            </form>
        </div>
    );
}
