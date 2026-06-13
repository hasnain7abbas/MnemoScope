import { useEffect, useRef, useState } from "react";
import { Mic, Square, Waves } from "lucide-react";

type SpeechRecognitionEventLike = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type RecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
};

type VoiceWindow = Window & {
  SpeechRecognition?: new () => RecognitionLike;
  webkitSpeechRecognition?: new () => RecognitionLike;
};

type VoiceCaptureProps = {
  onTranscriptChange: (value: string) => void;
  onRecordingReady: (audioDataUrl: string | null, durationSeconds: number) => void;
};

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
}

export function VoiceCapture({
  onTranscriptChange,
  onRecordingReady,
}: VoiceCaptureProps) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 250);
    return () => window.clearInterval(timer);
  }, [recording]);

  const stopRecording = () => {
    recognitionRef.current?.stop();
    recorderRef.current?.stop();
    setRecording(false);
  };

  const startRecording = async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("Voice recording is unavailable here. You can still type a transcript.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        const durationSeconds = Math.max(
          1,
          Math.round((Date.now() - startedAtRef.current) / 1000)
        );
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const audioDataUrl = blob.size ? await blobToDataUrl(blob) : null;
        onRecordingReady(audioDataUrl, durationSeconds);
        stream.getTracks().forEach((track) => track.stop());
      };

      const voiceWindow = window as VoiceWindow;
      const Recognition =
        voiceWindow.SpeechRecognition ?? voiceWindow.webkitSpeechRecognition;
      if (Recognition) {
        const recognition = new Recognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.onresult = (event) => {
          const next = Array.from(event.results)
            .map((result) => result[0]?.transcript ?? "")
            .join(" ");
          onTranscriptChange(next.trim());
        };
        recognition.start();
        recognitionRef.current = recognition;
      }

      recorderRef.current = recorder;
      startedAtRef.current = Date.now();
      setElapsed(0);
      recorder.start();
      setRecording(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Microphone access was not available."
      );
    }
  };

  return (
    <div className="voice-capture">
      <div className={`voice-orbit${recording ? " is-recording" : ""}`}>
        <div className="voice-orbit__bars" aria-hidden="true">
          {Array.from({ length: 17 }, (_, index) => (
            <span key={index} style={{ animationDelay: `${index * -0.06}s` }} />
          ))}
        </div>
        <button
          type="button"
          className="voice-record-button"
          onClick={recording ? stopRecording : () => void startRecording()}
          aria-label={recording ? "Stop recording" : "Start recording"}
        >
          {recording ? <Square size={19} fill="currentColor" /> : <Mic size={23} />}
        </button>
      </div>
      <div className="voice-capture__status">
        <span>{recording ? "Recording memory" : "Voice thought"}</span>
        <strong>
          {recording
            ? `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(
                elapsed % 60
              ).padStart(2, "0")}`
            : "Ready when you are"}
        </strong>
        <small>
          <Waves size={12} />
          Live transcription where supported
        </small>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
