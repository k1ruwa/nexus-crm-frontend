import { useState, useRef } from 'react';
import { Mic, Play, Pause, Trash2, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number, transcript?: string) => void;
  title?: string;
}

export function VoiceRecorder({ onRecordingComplete, title = 'Voice Recorder' }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const [duration, setDuration] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      transcriptRef.current = '';

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setDuration(recordingTime);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start Web Speech API transcription in parallel (no API key needed)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.onresult = (e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) {
              transcriptRef.current += e.results[i][0].transcript + ' ';
            }
          }
        };
        recognition.onerror = () => { /* silently ignore — transcript will be empty */ };
        try { recognition.start(); } catch { /* recognition may not be available */ }
        recognitionRef.current = recognition;
      }
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      try { recognitionRef.current?.stop(); } catch { /* ignore */ }
    }
  };

  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      try { recognitionRef.current?.start(); } catch { /* ignore */ }
    } else {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      try { recognitionRef.current?.stop(); } catch { /* ignore */ }
    }
    setIsPaused(!isPaused);
  };

  const deleteRecording = () => {
    setAudioURL('');
    setDuration(0);
    setRecordingTime(0);
    audioChunksRef.current = [];
    transcriptRef.current = '';
  };

  const handleSave = () => {
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      onRecordingComplete(audioBlob, duration, transcriptRef.current.trim() || undefined);
      deleteRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {title && (
        <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>
      )}

      {/* Timer */}
      <div className="text-3xl font-semibold tracking-tight text-slate-800 font-mono">
        {formatTime(recordingTime)}
      </div>

      {/* Wave animation when recording */}
      {isRecording && !isPaused && (
        <div className="flex items-end gap-1 h-8">
          {[0, 1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-emerald-500"
              animate={{ height: ['20%', '100%', '20%'] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {audioURL && !isRecording && (
        <div className="w-full rounded-2xl bg-slate-50/50 p-3">
          <audio src={audioURL} controls className="w-full" />
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        {!isRecording && !audioURL && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-slate-900 bg-gradient-to-tr from-slate-800 to-slate-950 text-white shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-slate-700/50"
          >
            <Mic className="h-7 w-7 stroke-[1.5]" />
          </motion.button>
        )}

        {isRecording && (
          <>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={togglePause}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-slate-600"
            >
              {isPaused ? <Play className="h-5 w-5 stroke-[1.5]" /> : <Pause className="h-5 w-5 stroke-[1.5]" />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
              className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-emerald-500 bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-[0_0_40px_rgba(16,185,129,0.4)] border border-emerald-400"
            >
              <div className="w-5 h-5 rounded-sm bg-white" />
            </motion.button>
          </>
        )}

        {audioURL && !isRecording && (
          <>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={deleteRecording}
              className="flex h-12 items-center gap-2 px-5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_4px_16px_rgba(0,0,0,0.02)] text-slate-600"
            >
              <Trash2 className="h-4 w-4 stroke-[1.5]" />
              <span className="text-[13px] font-medium">Delete</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex h-12 items-center gap-2 px-5 rounded-2xl bg-emerald-500 text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <Check className="h-4 w-4 stroke-[1.5]" />
              <span className="text-[13px] font-medium">Save</span>
            </motion.button>
          </>
        )}
      </div>

      {isRecording && (
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {isPaused ? 'Paused' : 'Recording'}
        </span>
      )}
    </div>
  );
}
