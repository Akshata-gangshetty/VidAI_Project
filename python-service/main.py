import os
import tempfile
import subprocess
import secrets
from pathlib import Path
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, HttpUrl
from faster_whisper import WhisperModel

load_dotenv()

app = FastAPI(title="VidAI Transcription API")

API_KEY = os.getenv("TRANSCRIPTION_API_KEY")
MODEL_SIZE = os.getenv("WHISPER_MODEL", "base")

if not API_KEY:
    raise RuntimeError("TRANSCRIPTION_API_KEY is missing from .env")

whisper_model = None


class TranscriptionRequest(BaseModel):
    videoUrl: HttpUrl


def get_model():
    global whisper_model

    if whisper_model is None:
        whisper_model = WhisperModel(
            MODEL_SIZE,
            device="cpu",
            compute_type="int8"
        )

    return whisper_model


def download_video(url, destination):
    parsed = urlparse(str(url))

    if (
        parsed.scheme != "https"
        or parsed.hostname != "res.cloudinary.com"
    ):
        raise HTTPException(
            status_code=400,
            detail="Only Cloudinary URLs are accepted"
        )

    max_size = 500 * 1024 * 1024
    downloaded = 0

    try:
        with requests.get(
            str(url),
            stream=True,
            timeout=(15, 120),
            allow_redirects=False
        ) as response:

            response.raise_for_status()

            length = response.headers.get("Content-Length")

            if length and int(length) > max_size:
                raise HTTPException(
                    status_code=413,
                    detail="Video is too large"
                )

            with open(destination, "wb") as file:
                for chunk in response.iter_content(1024 * 1024):
                    if not chunk:
                        continue

                    downloaded += len(chunk)

                    if downloaded > max_size:
                        raise HTTPException(
                            status_code=413,
                            detail="Video is too large"
                        )

                    file.write(chunk)

    except requests.RequestException:
        raise HTTPException(
            status_code=400,
            detail="Unable to download Cloudinary video"
        )


@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "VidAI transcription service is running"
    }


@app.post("/transcribe")
def transcribe_video(
    request: TranscriptionRequest,
    x_transcription_key: str = Header(None)
):
    if not x_transcription_key:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    if not secrets.compare_digest(API_KEY, x_transcription_key):
        raise HTTPException(
            status_code=401,
            detail="Invalid API key"
        )

    with tempfile.TemporaryDirectory() as temp_dir:

        video_path = Path(temp_dir) / "video"
        audio_path = Path(temp_dir) / "audio.wav"

        download_video(request.videoUrl, video_path)

        try:
            subprocess.run(
                [
                    "ffmpeg",
                    "-nostdin",
                    "-y",
                    "-i", str(video_path),
                    "-vn",
                    "-ac", "1",
                    "-ar", "16000",
                    "-c:a", "pcm_s16le",
                    str(audio_path)
                ],
                check=True,
                capture_output=True,
                timeout=1800
            )

        except subprocess.TimeoutExpired:
            raise HTTPException(
                status_code=504,
                detail="Audio extraction timed out"
            )

        except subprocess.CalledProcessError:
            raise HTTPException(
                status_code=422,
                detail="Audio extraction failed"
            )

        model = get_model()

        try:
            segments, info = model.transcribe(
                str(audio_path),
                beam_size=5,
                vad_filter=True
            )

            transcript = " ".join(
                segment.text.strip()
                for segment in segments
            ).strip()

        except Exception:
            raise HTTPException(
                status_code=500,
                detail="Transcription failed"
            )

        if not transcript:
            raise HTTPException(
                status_code=422,
                detail="No speech detected"
            )

        return {
            "success": True,
            "transcript": transcript,
            "language": info.language,
            "duration": info.duration
        }