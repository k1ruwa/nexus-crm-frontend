# Nexus - AI-Powered Networking CRM

A local-first Progressive Web App (PWA) for capturing and managing professional contacts with AI enrichment capabilities.

## Features

### Contact Capture
- **📷 Camera Capture**: Scan business cards using your device camera with AI-powered OCR
- **🎤 Voice Input**: Quickly capture contact details via voice recording
- **✍️ Manual Entry**: Traditional form-based contact creation

### AI Enrichment
- Automatic business card analysis and data extraction
- Voice-to-text transcription for contact details
- Profile enrichment with social media links (LinkedIn, Twitter)
- Smart data parsing from natural language

### Contact Management
- Full contact profiles with company, title, email, phone
- Custom tags and notes
- Profile images from business card scans
- Last contacted tracking

### Voice Notes
- Record voice memos for each contact
- Automatic transcription
- Audio playback with duration tracking

### Reminders & Follow-ups
- Set follow-up reminders for any contact
- Upcoming, overdue, and completed reminder views
- Due date notifications
- Quick status toggle

## Technology Stack

- **Frontend**: React + TypeScript + React Router
- **Styling**: Tailwind CSS v4
- **Storage**: IndexedDB (local-first, no server required)
- **PWA**: Service Worker for offline support
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Local-First Architecture

Nexus is designed as a **local-first application** - all data is stored in your browser's IndexedDB. No server required, no data leaves your device.

### Data Storage
- Contacts stored in IndexedDB
- Voice recordings stored as base64-encoded audio
- All processing happens client-side

### PWA Features
- Installable on mobile and desktop
- Works offline
- Camera and microphone access
- Responsive design

## AI Integration (Mock Implementation)

The current implementation includes mock AI functions that simulate:
- Business card OCR
- Voice-to-text transcription
- Profile enrichment

### Production Integration

To integrate real AI services, update `/src/app/lib/ai-enrichment.ts`:

#### 1. Business Card OCR
```typescript
// Use OpenAI GPT-4 Vision or Google Vision API
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${YOUR_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4-vision-preview',
    messages: [...]
  })
});
```

#### 2. Speech-to-Text
```typescript
// Use OpenAI Whisper API or Google Speech-to-Text
const formData = new FormData();
formData.append('file', audioBlob);
formData.append('model', 'whisper-1');

const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${YOUR_API_KEY}` },
  body: formData
});
```

#### 3. Profile Enrichment
```typescript
// Use Clearbit, FullContact, or similar APIs
const response = await fetch(
  `https://person.clearbit.com/v2/combined/find?email=${email}`,
  { headers: { 'Authorization': `Bearer ${YOUR_API_KEY}` } }
);
```

## Browser Permissions

Nexus requires the following permissions:
- **Camera**: For business card scanning
- **Microphone**: For voice notes and contact capture
- **Storage**: For IndexedDB (automatic)

## Future Enhancements

### App Store Distribution
The current PWA can be packaged for app stores using:
- **Capacitor**: For iOS and Android native apps
- **React Native**: Alternative native app approach

### Backend Integration (Optional)
While designed as local-first, you can add:
- Cloud sync across devices
- Backup and restore
- Team collaboration features
- Real-time AI processing

## Installation

### As PWA
1. Open the app in a browser
2. Look for "Install" or "Add to Home Screen" prompt
3. The app will work offline after installation

### Development
```bash
npm install
npm run dev
```

## Privacy & Security

- **Local-Only**: All data stays on your device
- **No Tracking**: No analytics or third-party services
- **No Server**: No backend means no data breaches
- **Your Data**: You own and control everything

## Important Notes

⚠️ **Data Persistence**: Data is stored in browser storage. Clearing browser data will delete contacts.

⚠️ **PII Warning**: This app is not designed for collecting personally identifiable information (PII) or securing sensitive data beyond what browser storage provides.

## License

MIT
