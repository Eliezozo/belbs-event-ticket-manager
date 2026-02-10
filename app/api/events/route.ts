import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {db, eventsTable} from "@/db/schema";
import {nanoid} from "nanoid";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession();

        // @ts-ignore
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({error: "Non autorisé"}, {status: 401});
        }

        const formData = await req.formData();
        const name = formData.get('name') as string;
        const date = formData.get('date') as string;
        const time = formData.get('time') as string;
        const description = formData.get('description') as string;
        const place = formData.get('place') as string;
        const participantsLimit = formData.get('participantsLimit') as string;
        const picture = formData.get('picture') as File;

        if (!name || !date || !time || !place || !participantsLimit) {
            return NextResponse.json({error: "Champs requis manquants"}, {status: 400});
        }

        const eventDateTime = new Date(`${date}T${time}`);

        let pictureUrl = ''
        if (picture) {
            const bytes = await picture.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const response = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({}, (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                }).end(buffer)
            });
            // @ts-ignore
            pictureUrl = response.secure_url;
        }

        const newEvent = {
            slug: nanoid(),
            name: name,
            date: eventDateTime.toDateString(),
            time: eventDateTime.toTimeString(),
            description: description,
            place: place,
            participantsLimit: parseInt(participantsLimit),
            pictureUrl: pictureUrl,
        };

        await db.insert(eventsTable).values(newEvent);

        return NextResponse.json(newEvent, {status: 201});

    } catch (error) {
        console.error("Event Creation API Error:", error);
        return NextResponse.json({error: "Erreur interne du serveur"}, {status: 500});
    }
}
