import { Contact } from './db';

export const enrichFromBusinessCard = async (imageData: string): Promise<Partial<Contact>> => {
  try {
    const res = await fetch('/api/enrich-card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: imageData, mediaType: 'image/jpeg' }),
    });
    if (!res.ok) return {};
    return (await res.json()) as Partial<Contact>;
  } catch (err) {
    console.error('[AI] enrichFromBusinessCard failed:', err);
    return {};
  }
};

export const enrichFromVoiceTranscript = async (transcript: string): Promise<Partial<Contact>> => {
  try {
    const res = await fetch('/api/extract-voice-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
    });
    if (!res.ok) return {};
    return (await res.json()) as Partial<Contact>;
  } catch (err) {
    console.error('[AI] enrichFromVoiceTranscript failed:', err);
    return {};
  }
};

export const enrichProfile = async (email?: string, name?: string): Promise<Partial<Contact>> => {
  if (!email && !name) return {};
  try {
    const res = await fetch('/api/enrich-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    if (!res.ok) return {};
    return (await res.json()) as Partial<Contact>;
  } catch (err) {
    console.error('[AI] enrichProfile failed:', err);
    return {};
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    const res = await fetch('/api/transcribe-voice', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) return '';
    const data = (await res.json()) as { transcript: string };
    return data.transcript ?? '';
  } catch (err) {
    console.error('[AI] transcribeAudio failed:', err);
    return '';
  }
};
