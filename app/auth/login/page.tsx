'use client';

import {useState} from "react";
import {useRouter} from "next/navigation";

export default function LoginPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData(event.currentTarget);
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                router.push('/');
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
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required/>
                </div>
                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" id="password" name="password" required/>
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                </button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
        </div>
    );
}
