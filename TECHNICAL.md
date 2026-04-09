# Nexus CRM - Technical Documentation

## Architecture Overview

### Local-First Design
Nexus is built as a **Progressive Web App (PWA)** with a local-first architecture:
- All data persists in IndexedDB
- No backend server required
- Works completely offline
- Service Worker for caching and offline support

### Tech Stack
- **Framework**: React 18.3 with TypeScript
- **Routing**: React Router v7 (Data Mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Storage**: IndexedDB
- **Build Tool**: Vite 6.3
- **Icons**: Lucide React
- **Date Utils**: date-fns
- **Notifications**: Sonner

## Project Structure

```
/src/app
├── App.tsx                   # Main app component with RouterProvider
├── routes.ts                 # React Router configuration
├── hooks/
│   └── usePWA.ts            # Service Worker registration
├── lib/
│   ├── db.ts                # IndexedDB operations
│   └── ai-enrichment.ts     # Mock AI functions (ready for real API)
├── pages/
│   ├── Dashboard.tsx        # Main contact list view
│   ├── AddContact.tsx       # Contact creation with camera/voice
│   ├── ContactDetail.tsx    # Full contact view with voice notes
│   └── Reminders.tsx        # Follow-up reminders management
└── components/
    ├── CameraCapture.tsx    # Business card scanning
    ├── VoiceRecorder.tsx    # Audio recording with playback
    ├── ContactCard.tsx      # Contact list item
    ├── QuickActions.tsx     # Empty state quick actions
    ├── InstallPrompt.tsx    # PWA install banner
    ├── OnboardingDialog.tsx # First-launch experience
    └── ui/                  # Reusable UI components
```

## Data Models

### Contact
```typescript
interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  notes?: string;
  tags?: string[];
  profileImage?: string;       // base64 or URL
  source: 'manual' | 'camera' | 'voice';
  aiEnriched?: boolean;
  linkedIn?: string;
  twitter?: string;
  website?: string;
  createdAt: number;
  updatedAt: number;
  lastContactedAt?: number;
}
```

### VoiceNote
```typescript
interface VoiceNote {
  id: string;
  contactId: string;
  audioBlob: string;           // base64 encoded audio
  transcript?: string;
  duration: number;            // in seconds
  createdAt: number;
}
```

### Reminder
```typescript
interface Reminder {
  id: string;
  contactId: string;
  title: string;
  description?: string;
  dueDate: number;
  completed: boolean;
  createdAt: number;
}
```

## IndexedDB Schema

### Stores
1. **contacts** - Contact data
   - Key: `id`
   - Indexes: `name`, `company`, `createdAt`

2. **voiceNotes** - Voice recordings
   - Key: `id`
   - Indexes: `contactId`, `createdAt`

3. **reminders** - Follow-up reminders
   - Key: `id`
   - Indexes: `contactId`, `dueDate`, `completed`

## Key Features Implementation

### Camera Capture
- Uses `navigator.mediaDevices.getUserMedia()`
- Captures video stream with `facingMode: 'environment'`
- Canvas-based image capture
- Returns base64 encoded image data

### Voice Recording
- Uses MediaRecorder API
- Supports pause/resume
- Stores as base64-encoded WebM audio
- Displays duration and playback controls

### AI Mock Functions
Mock implementations in `/src/app/lib/ai-enrichment.ts`:
- `enrichFromBusinessCard()` - OCR from card image
- `enrichFromVoiceTranscript()` - Extract contact from speech
- `enrichProfile()` - Fetch social links
- `transcribeAudio()` - Speech-to-text

### PWA Features
- **Service Worker**: `/public/sw.js` - Cache-first strategy
- **Manifest**: `/public/manifest.json` - App metadata
- **Install Prompt**: Detects `beforeinstallprompt` event
- **Offline**: Full functionality without network

## Browser APIs Used

### Required Permissions
- **Camera**: `navigator.mediaDevices.getUserMedia({ video: true })`
- **Microphone**: `navigator.mediaDevices.getUserMedia({ audio: true })`
- **IndexedDB**: Automatic, no permission needed
- **Service Worker**: Automatic on HTTPS

### Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile: iOS Safari 11.3+, Android Chrome 67+
- Desktop: All modern browsers

## Development

### Run Locally
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

### Testing PWA Features
1. Build the app: `npm run build`
2. Serve with HTTPS (required for service workers)
3. Test on mobile device or Chrome DevTools mobile emulation

## Integration Guide

### Adding Real AI APIs

#### 1. OpenAI GPT-4 Vision (Business Card OCR)
```typescript
// In /src/app/lib/ai-enrichment.ts
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4-vision-preview',
    messages: [{
      role: 'user',
      content: [
        { 
          type: 'text', 
          text: 'Extract name, email, phone, company, title from this business card as JSON' 
        },
        { type: 'image_url', image_url: { url: imageData } }
      ]
    }],
    max_tokens: 300
  })
});
```

#### 2. OpenAI Whisper (Speech-to-Text)
```typescript
const formData = new FormData();
formData.append('file', audioBlob);
formData.append('model', 'whisper-1');

const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
  body: formData
});
```

#### 3. Clearbit/FullContact (Profile Enrichment)
```typescript
const response = await fetch(
  `https://person.clearbit.com/v2/combined/find?email=${email}`,
  { headers: { 'Authorization': `Bearer ${CLEARBIT_API_KEY}` } }
);
```

### API Key Management
For production:
1. Create backend proxy to hide API keys
2. Use environment variables
3. Implement rate limiting
4. Add error handling and retry logic

### Deploying as Native App

#### Using Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
npx cap sync
```

#### Using React Native
Convert to React Native with:
1. React Native Web compatibility layer
2. Shared business logic
3. Native modules for camera/microphone

## Performance Optimizations

### Current
- Component code splitting with React Router
- IndexedDB for fast local reads
- Service Worker caching
- Virtual scrolling for large contact lists (can be added)

### Future Improvements
- Implement virtual scrolling for 1000+ contacts
- Web Workers for heavy AI processing
- Compression for voice notes
- Incremental IndexedDB queries

## Security Considerations

### Current
- Local-only data (browser storage)
- No network transmission
- User-controlled data deletion

### For Production with Backend
- HTTPS only
- API key rotation
- Rate limiting
- Input sanitization
- CSP headers
- XSS prevention

## Testing Strategy

### Manual Testing
- Camera capture on mobile
- Voice recording quality
- Offline functionality
- PWA installation
- IndexedDB persistence

### Automated Testing (Future)
- Jest for unit tests
- React Testing Library for components
- Playwright for E2E
- Lighthouse for PWA audit

## Known Limitations

1. **Storage Limits**: IndexedDB has browser-specific limits (usually 50MB-1GB)
2. **Audio Format**: WebM not supported on all iOS versions
3. **Camera Access**: Requires HTTPS in production
4. **No Cloud Sync**: Local-only means no cross-device sync
5. **Mock AI**: Needs real API integration for production

## Future Roadmap

### Phase 1 (Current)
- ✅ Local-first PWA
- ✅ Camera capture
- ✅ Voice notes
- ✅ Reminders
- ✅ Mock AI enrichment

### Phase 2
- Real AI API integration
- Export/Import contacts (vCard, CSV)
- Advanced search and filtering
- Contact deduplication
- Batch operations

### Phase 3
- Cloud sync (optional)
- Team collaboration
- Analytics and insights
- Integration with calendar apps
- Native mobile apps (iOS/Android)

### Phase 4
- CRM features (deals, pipeline)
- Email integration
- Meeting notes
- Contact scoring
- Workflow automation

## Contributing

To contribute:
1. Follow existing code style
2. Use TypeScript strict mode
3. Add JSDoc comments for complex functions
4. Test on mobile browsers
5. Ensure PWA lighthouse score > 90

## License

MIT License - See LICENSE file
