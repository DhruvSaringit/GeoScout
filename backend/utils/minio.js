import { minioClient, BUCKET } from '../config/minio.js';
import { v4 as uuid } from 'uuid';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveImageAndGetObjectKey = async (file) => {
    const ext = file.originalname.split('.').pop();
    const objectKey = `uploads/${uuid()}.${ext}`;
    await minioClient.putObject(BUCKET, objectKey, file.buffer);
    return objectKey;
};

export const getPresignedUrl = async (key) => {
    const url = await minioClient.presignedGetObject(
        BUCKET,
        key,
        3600
    );

    return url;
};

export const getImageBase64 = async (key) => {
    return new Promise((resolve, reject) => {
        minioClient.getObject(BUCKET, key, (err, dataStream) => {
            if (err) return reject(err);
            const chunks = [];
            dataStream.on('data', chunk => chunks.push(chunk));
            dataStream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const ext = key.split('.').pop() || 'png';
                resolve(`data:image/${ext};base64,${buffer.toString('base64')}`);
            });
            dataStream.on('error', reject);
        });
    });
};

export const downscaleBase64IfNeeded = async (b64) => {
    if (!b64 || b64.length < 1200000) return b64;
    try {
        const pythonPath = path.resolve(__dirname, '../../.venv/Scripts/python.exe');
        const scriptPath = path.resolve(__dirname, '../scripts/resize_b64.py');
        if (!fs.existsSync(pythonPath) || !fs.existsSync(scriptPath)) return b64;

        const tempDir = path.resolve(__dirname, '../uploads/temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const tempFile = path.resolve(tempDir, `b64_${Date.now()}_${Math.random().toString(36).substring(7)}.txt`);
        fs.writeFileSync(tempFile, b64, 'utf-8');

        await new Promise((resolve, reject) => {
            const proc = spawn(pythonPath, [scriptPath, tempFile]);
            proc.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`Resizer exited with code ${code}`));
            });
            proc.on('error', reject);
        });

        const optimizedB64 = fs.readFileSync(tempFile, 'utf-8');
        try { fs.unlinkSync(tempFile); } catch (_) { }
        console.log(`Auto-downscaled base64 from ${b64.length} to ${optimizedB64.length} bytes for GPU safety.`);
        return optimizedB64;
    } catch (err) {
        console.warn('Base64 downscale error:', err.message);
        return b64;
    }
};

export const getBase64FromUrlOrKey = async (urlOrKey) => {
    if (!urlOrKey || urlOrKey === 'dummy') {
        return urlOrKey;
    }
    if (urlOrKey.startsWith('data:image')) {
        return await downscaleBase64IfNeeded(urlOrKey);
    }
    let key = urlOrKey;
    if (key.includes('/' + BUCKET + '/')) {
        key = key.split('/' + BUCKET + '/')[1].split('?')[0];
    } else if (key.includes('/chat-images/')) {
        key = key.split('/chat-images/')[1].split('?')[0];
    }
    try {
        const b64 = await getImageBase64(key);
        return await downscaleBase64IfNeeded(b64);
    } catch (err) {
        console.warn('Direct MinIO SDK base64 read failed for key:', key, err.message);
        return urlOrKey;
    }
};
