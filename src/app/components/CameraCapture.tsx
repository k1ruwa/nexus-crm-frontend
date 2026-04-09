import { useState, useRef, useEffect } from 'react';
import { Camera, X, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 },
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch {
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    setCapturedImage(canvas.toDataURL('image/jpeg', 0.8));
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stream?.getTracks().forEach(t => t.stop());
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-3xl rounded-[24px] p-6 shadow-[0_24px_48px_rgba(0,0,0,0.12)] border border-white/80 text-center">
          <p className="text-[13px] text-rose-500 mb-4">{error}</p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={onCancel}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-[13px] font-medium">Close</motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 relative">
        {!capturedImage ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
        )}
        <canvas ref={canvasRef} className="hidden" />

        {/* Scanner line animation */}
        {!capturedImage && (
          <motion.div
            animate={{ y: ['-100%', '300%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            className="absolute left-[10%] right-[10%] h-0.5 bg-emerald-400/60 blur-[1px]"
          />
        )}
      </div>

      <div className="bg-black/80 backdrop-blur-xl p-6 flex items-center justify-center gap-4">
        {!capturedImage ? (
          <>
            <motion.button whileTap={{ scale: 0.95 }} onClick={onCancel}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white">
              <X className="h-6 w-6 stroke-[1.5]" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={capturePhoto}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_8px_32px_rgba(255,255,255,0.2)]">
              <Camera className="h-8 w-8 text-black stroke-[1.5]" />
            </motion.button>
          </>
        ) : (
          <>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCapturedImage(null)}
              className="flex-1 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white text-[15px] font-medium flex items-center justify-center gap-2">
              <X className="h-5 w-5 stroke-[1.5]" /> Retake
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleConfirm}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-500 text-white text-[15px] font-medium flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
              <Check className="h-5 w-5 stroke-[1.5]" /> Use Photo
            </motion.button>
          </>
        )}
      </div>

      {/* Camera label */}
      {!capturedImage && (
        <div className="absolute top-12 left-0 right-0 flex justify-center">
          <span className="text-[9px] font-bold tracking-widest text-white/90 uppercase bg-black/30 backdrop-blur-md px-3 py-1 rounded-full">
            Scan Card
          </span>
        </div>
      )}
    </div>
  );
}
