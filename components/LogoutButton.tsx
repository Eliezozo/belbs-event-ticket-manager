'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout');
        router.push('/login');
    };

    return (
        <button onClick={handleLogout} className="header__nav-link">Logout</button>
    );
}
