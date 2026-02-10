import { auth } from '@/lib/auth';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default async function Header() {
    const session = await auth.api.getSession();
    // @ts-ignore
    const isAdmin = session?.user?.role === 'admin';
    const isLoggedIn = !!session;

    return (
        <header className="header">
            <div className="header__container">
                <Link href="/" className="header__logo">EventApp</Link>
                <nav className="header__nav">
                    <ul className="header__nav-list">
                        <li className="header__nav-item">
                            <Link href="/events" className="header__nav-link">Events</Link>
                        </li>
                        {isLoggedIn ? (
                            <>
                                <li className="header__nav-item">
                                    <Link href="/my-events" className="header__nav-link">My Events</Link>
                                </li>
                                {isAdmin && (
                                    <li className="header__nav-item">
                                        <Link href="/admin" className="header__nav-link header__nav-link--admin">Aller dans admin</Link>
                                    </li>
                                )}
                                <li className="header__nav-item">
                                    <LogoutButton />
                                </li>
                            </>
                        ) : (
                            <li className="header__nav-item">
                                <Link href="/login" className="header__nav-link">Login</Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
