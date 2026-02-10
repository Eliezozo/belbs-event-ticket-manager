'use client';

import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import styles from './scanner.module.css';

type ScanStatus = "scanning" | "loading" | "success" | "invalid" | "error";

export default function QRScannerPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const scannerRef = useRef<QrScanner | null>(null);
    const [status, setStatus] = useState<ScanStatus>("scanning");

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        scannerRef.current = new QrScanner(
            videoElement,
            async (result) => {
                scannerRef.current?.stop();
                setStatus("loading");
                try {
                    const response = await fetch(`/api/scan`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ participationId: result.data }),
                    });
                    if (response.ok) {
                        setStatus("success");
                    } else if (response.status === 404) {
                        setStatus("invalid");
                    } else {
                        setStatus("error");
                    }
                } catch (error) {
                    setStatus("error");
                }
            },
            {
                highlightCodeOutline: true,
                preferredCamera: 'environment',
            }
        );

        scannerRef.current.start().catch(() => setStatus("error"));

        return () => {
            scannerRef.current?.destroy();
        };
    }, []);

    const handleReset = () => {
        setStatus("scanning");
        scannerRef.current?.start();
    };

    const getStatusMessage = () => {
        switch (status) {
            case "scanning":
                return "Alignez le code QR";
            case "loading":
                return "Scan en cours...";
            case "success":
                return "Participation confirmée";
            case "invalid":
                return "QR code invalide";
            case "error":
                return "Erreur";
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>SCANNEUR QR</h1>
                <p>{getStatusMessage()}</p>
            </header>

            <div className={styles.videoWrapper}>
                <video ref={videoRef} className={styles.video} playsInline muted style={{ display: status === 'scanning' ? 'block' : 'none' }} />
                
                {status === 'scanning' && (
                    <div className={styles.overlay}>
                        <div className={styles.viewfinder}>
                            <div className={`${styles.corner} ${styles.topL}`}></div>
                            <div className={`${styles.corner} ${styles.topR}`}></div>
                            <div className={`${styles.corner} ${styles.botL}`}></div>
                            <div className={`${styles.corner} ${styles.botR}`}></div>
                            <div className={styles.laser}></div>
                        </div>
                    </div>
                )}
            </div>

            {status !== 'scanning' && (
                <div className={styles.resultCard}>
                    <h3 style={{ margin: 0 }}>{getStatusMessage()}</h3>
                    <button className={styles.btnPrimary} onClick={handleReset}>
                        Scanner à nouveau
                    </button>
                </div>
            )}
        </div>
    );
}