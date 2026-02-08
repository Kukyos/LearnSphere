import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX, ChevronDown, Sparkles, HelpCircle, MousePointerClick, Zap, Key } from 'lucide-react';
import {
  executeCommand,
  getAvailableActions,
  stopSpeaking,
  hasGroqKey,
  setGroqApiKey,
  transcribeAudio,
  type CommandResult,
} from '../services/accessibilityCommandService';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
  result?: CommandResult;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  type: 'assistant',
  text: 'Hi! I\'m your AI accessibility assistant. I\'m always listening — just speak naturally and I\'ll find and click the right button for you. Try saying "help" to see what\'s available!',
  timestamp: new Date(),
};

const QUICK_COMMANDS = [
  { label: 'Help', command: 'help', icon: '❓' },
  { label: 'Explore', command: 'go to explore', icon: '🧭' },
  { label: 'My Courses', command: 'go to my courses', icon: '📚' },
  { label: 'Scroll Down', command: 'scroll down', icon: '⬇️' },
  { label: 'Go Back', command: 'go back', icon: '↩️' },
  { label: 'Dark Mode', command: 'toggle theme', icon: '🌙' },
];

const AccessibilityChatbot: React.FC = () => {
  const isDark = false; // Light mode only for now

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoListenEnabled, setAutoListenEnabled] = useState(true);
  const [spokenText, setSpokenText] = useState('');
  const [micLevel, setMicLevel] = useState(0);  // 0-100 volume level
  const [isMuted, setIsMuted] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [showActionList, setShowActionList] = useState(false);
  const [pulseIcon, setPulseIcon] = useState(true);
  const [groqAvailable, setGroqAvailable] = useState(hasGroqKey());
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput, setKeyInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoListenRef = useRef(true);
  const isListeningRef = useRef(false);
  const handleCommandRef = useRef<(text: string) => Promise<void>>(async () => {});
  const micStreamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSpeakingRef = useRef(false);  // true while user is talking
  const processingRef = useRef(false);  // true while sending to Whisper

  // Keep refs in sync with state
  useEffect(() => { autoListenRef.current = autoListenEnabled; }, [autoListenEnabled]);

  // ─── Voice Recognition via MediaRecorder + Groq Whisper ───
  useEffect(() => {
    let dead = false;
    let audioCtx: AudioContext | null = null;

    // Calibration: we measure ambient noise for the first ~1s, then set thresholds above it
    let ambientLevel = 0;
    let calibrationSamples = 0;
    const CALIBRATION_FRAMES = 60; // ~1 second at 60fps
    let speechThreshold = 25;      // will be recalculated after calibration
    const SILENCE_TIMEOUT = 1800;  // ms of silence after speech before sending
    const MAX_RECORD_MS = 8000;    // force-send after 8 seconds of recording
    let recordStartTime = 0;

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        });
        if (dead) { stream.getTracks().forEach(t => t.stop()); return; }
        micStreamRef.current = stream;

        // ── Audio analysis (volume meter) ──
        audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.5;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function monitorVolume() {
          if (dead) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length;
          const level = Math.min(100, Math.round((avg / 128) * 100));
          setMicLevel(level);

          // ── Phase 1: Calibrate ambient noise (~1 second) ──
          if (calibrationSamples < CALIBRATION_FRAMES) {
            ambientLevel = ((ambientLevel * calibrationSamples) + avg) / (calibrationSamples + 1);
            calibrationSamples++;
            if (calibrationSamples === CALIBRATION_FRAMES) {
              // Set speech threshold at 2x ambient (minimum 15)
              speechThreshold = Math.max(15, ambientLevel * 2);
            }
            animFrameRef.current = requestAnimationFrame(monitorVolume);
            return;
          }

          // ── Phase 2: Voice Activity Detection ──
          const isSpeech = avg > speechThreshold;
          const isSilence = avg < (speechThreshold * 0.6); // silence = below 60% of speech threshold

          if (isSpeakingRef.current) {
            // Currently recording
            const elapsed = Date.now() - recordStartTime;

            // Force-send after max duration
            if (elapsed > MAX_RECORD_MS) {
              if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
              stopAndSend();
            }
            // If silence detected, start countdown to send
            else if (isSilence) {
              if (!silenceTimerRef.current) {
                silenceTimerRef.current = setTimeout(() => {
                  silenceTimerRef.current = null;
                  if (isSpeakingRef.current) {
                    stopAndSend();
                  }
                }, SILENCE_TIMEOUT);
              }
            } else {
              // Still speaking — cancel silence timer
              if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = null;
              }
            }

            // Update status with recording time
            if (isSpeakingRef.current) {
              const secs = (elapsed / 1000).toFixed(1);
              setSpokenText(`🗣️ Recording... ${secs}s`);
            }

          } else if (isSpeech && !processingRef.current) {
            // Speech detected — start recording
            startRecording(stream);
          }

          animFrameRef.current = requestAnimationFrame(monitorVolume);
        }
        monitorVolume();

        setIsListening(true);
        isListeningRef.current = true;
      } catch (err) {
        console.error('[Mic] getUserMedia failed:', err);
        setAutoListenEnabled(false);
      }
    }

    function startRecording(stream: MediaStream) {
      if (recorderRef.current?.state === 'recording') return;

      audioChunksRef.current = [];
      recordStartTime = Date.now();

      // Pick a supported mime type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start(250); // get data every 250ms
      isSpeakingRef.current = true;
      setSpokenText('🗣️ Hearing you...');
    }

    async function stopAndSend() {
      // Set processing FIRST to prevent monitorVolume from starting a new recording
      processingRef.current = true;
      isSpeakingRef.current = false;
      const recorder = recorderRef.current;
      if (!recorder || recorder.state !== 'recording') {
        processingRef.current = false;
        setSpokenText('');
        return;
      }

      setSpokenText('⏳ Transcribing...');

      // Stop recording and collect final data
      await new Promise<void>(resolve => {
        recorder.onstop = () => resolve();
        recorder.stop();
      });

      const chunks = audioChunksRef.current;
      audioChunksRef.current = [];

      if (chunks.length === 0) {
        processingRef.current = false;
        setSpokenText('');
        return;
      }

      const blob = new Blob(chunks, { type: recorder.mimeType });

      // Skip very short clips (likely just noise)
      if (blob.size < 1000) {
        processingRef.current = false;
        setSpokenText('');
        return;
      }

      try {
        const text = await transcribeAudio(blob);
        if (text && !dead) {
          setSpokenText(`"${text}"`);
          // Process the command
          await handleCommandRef.current(text);
        } else {
        }
      } catch (err: any) {
        console.error('[Voice] Whisper error:', err);
        // Show error in chat so user can see it
        setSpokenText(`❌ ${err?.message || 'Transcription failed'}`);
        await new Promise(r => setTimeout(r, 2000));
      } finally {
        processingRef.current = false;
        if (!dead) setSpokenText('');
      }
    }

    if (autoListenRef.current) {
      init();
    }

    return () => {
      dead = true;
      cancelAnimationFrame(animFrameRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      try { recorderRef.current?.stop(); } catch {}
      try { audioCtx?.close(); } catch {}
      micStreamRef.current?.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
      stopSpeaking();
    };
  }, []);

  // Stop the icon pulse after first open
  useEffect(() => {
    if (isOpen) setPulseIcon(false);
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const addMessage = useCallback((type: ChatMessage['type'], text: string, result?: CommandResult) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type,
      text,
      timestamp: new Date(),
      result,
    }]);
  }, []);

  const handleCommand = useCallback(async (text: string) => {
    if (!text.trim()) return;

    addMessage('user', text);
    setIsProcessing(true);
    setShowQuickActions(false);

    // Mute TTS if user toggled it off
    if (isMuted) stopSpeaking();

    try {
      const result = await executeCommand(text);

      // If muted, stop the speech that executeCommand triggered
      if (isMuted) {
        setTimeout(() => stopSpeaking(), 50);
      }

      addMessage('assistant', result.message, result);
    } catch (err) {
      addMessage('system', 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [addMessage, isMuted]);

  // Keep the ref pointing to latest handleCommand
  useEffect(() => { handleCommandRef.current = handleCommand; }, [handleCommand]);

  const handleSaveKey = () => {
    if (keyInput.trim().startsWith('gsk_')) {
      setGroqApiKey(keyInput.trim());
      setGroqAvailable(true);
      setShowKeyInput(false);
      setKeyInput('');
      addMessage('system', '\u2705 Groq API key saved! AI-powered matching is now active.');
    } else {
      addMessage('system', 'Invalid key. Groq keys start with "gsk_". Get one free at console.groq.com/keys');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    handleCommand(inputText.trim());
    setInputText('');
  };

  const handleVoiceToggle = () => {
    if (autoListenEnabled) {
      setAutoListenEnabled(false);
      // Stop everything
      cancelAnimationFrame(animFrameRef.current);
      if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
      try { recorderRef.current?.stop(); } catch {}
      micStreamRef.current?.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
      isSpeakingRef.current = false;
      processingRef.current = false;
      setIsListening(false);
      isListeningRef.current = false;
      setSpokenText('');
      setMicLevel(0);
      addMessage('system', '🔇 Auto-listen paused. Tap mic to resume.');
    } else {
      setAutoListenEnabled(true);
      addMessage('system', '🎤 Resuming — speak naturally.');
      // Re-init mic with same calibration logic as initial mount
      navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      }).then(stream => {
        micStreamRef.current = stream;
        setIsListening(true);
        isListeningRef.current = true;

        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.5;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let ambientLevel = 0;
        let calibrationSamples = 0;
        const CALIBRATION_FRAMES = 60;
        let speechThreshold = 25;
        const SILENCE_TIMEOUT = 1800;
        const MAX_RECORD_MS = 8000;
        let recordStartTime = 0;

        function monitor() {
          if (!autoListenRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length;
          setMicLevel(Math.min(100, Math.round((avg / 128) * 100)));

          // Calibration phase
          if (calibrationSamples < CALIBRATION_FRAMES) {
            ambientLevel = ((ambientLevel * calibrationSamples) + avg) / (calibrationSamples + 1);
            calibrationSamples++;
            if (calibrationSamples === CALIBRATION_FRAMES) {
              speechThreshold = Math.max(15, ambientLevel * 2);
            }
            animFrameRef.current = requestAnimationFrame(monitor);
            return;
          }

          const isSpeech = avg > speechThreshold;
          const isSilence = avg < (speechThreshold * 0.6);

          if (isSpeakingRef.current) {
            const elapsed = Date.now() - recordStartTime;
            if (elapsed > MAX_RECORD_MS) {
              if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
              finishAndSend();
            } else if (isSilence) {
              if (!silenceTimerRef.current) {
                silenceTimerRef.current = setTimeout(() => {
                  silenceTimerRef.current = null;
                  if (isSpeakingRef.current) finishAndSend();
                }, SILENCE_TIMEOUT);
              }
            } else {
              if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
            }
            if (isSpeakingRef.current) {
              setSpokenText(`🗣️ Recording... ${(elapsed / 1000).toFixed(1)}s`);
            }
          } else if (isSpeech && !processingRef.current) {
            // Start recording
            audioChunksRef.current = [];
            recordStartTime = Date.now();
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
              ? 'audio/webm;codecs=opus' : 'audio/webm';
            const rec = new MediaRecorder(stream, { mimeType });
            recorderRef.current = rec;
            rec.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
            rec.start(250);
            isSpeakingRef.current = true;
          }

          animFrameRef.current = requestAnimationFrame(monitor);
        }

        async function finishAndSend() {
          isSpeakingRef.current = false;
          processingRef.current = true;
          setSpokenText('⏳ Transcribing...');
          const rec = recorderRef.current;
          if (rec?.state === 'recording') {
            await new Promise<void>(r => { rec.onstop = () => r(); rec.stop(); });
          }
          const chunks = audioChunksRef.current;
          audioChunksRef.current = [];
          if (chunks.length > 0) {
            const blob = new Blob(chunks, { type: rec?.mimeType || 'audio/webm' });
            if (blob.size > 1000) {
              try {
                const text = await transcribeAudio(blob);
                if (text) { setSpokenText(`"${text}"`); await handleCommandRef.current(text); }
              } catch (err: any) {
                setSpokenText(`❌ ${err?.message || 'Failed'}`);
                await new Promise(r => setTimeout(r, 2000));
              }
            }
          }
          processingRef.current = false;
          setSpokenText('');
        }

        monitor();
      }).catch(() => { setAutoListenEnabled(false); });
    }
  };

  const handleShowActions = () => {
    const actions = getAvailableActions();
    setAvailableActions(actions);
    setShowActionList(!showActionList);
  };

  const handleQuickCommand = (command: string) => {
    handleCommand(command);
  };

  const handleActionClick = (action: string) => {
    handleCommand(`click ${action}`);
    setShowActionList(false);
  };

  const getResultIcon = (result?: CommandResult) => {
    if (!result) return null;
    if (result.success) return '✅';
    return '❌';
  };

  const getConfidenceBadge = (result?: CommandResult) => {
    if (!result || !result.success) return null;
    const pct = Math.round(result.confidence * 100);
    const color = pct >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : pct >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    return (
      <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${color}`}>
        {pct}%
      </span>
    );
  };

  return (
    <div data-accessibility-chatbot="true" className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl border overflow-hidden flex flex-col transition-all duration-300 ${
            isDark
              ? 'bg-brand-900 border-brand-700 shadow-black/40'
              : 'bg-white border-brand-200 shadow-brand-900/10'
          }`}
          style={{ maxHeight: 'min(600px, calc(100vh - 120px))' }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${
            isDark ? 'bg-brand-800 border-brand-700' : 'bg-brand-600 border-brand-500'
          }`}>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white leading-none">Accessibility Assistant</h3>
                  {groqAvailable ? (
                    <span className="flex items-center gap-0.5 bg-white/20 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full">
                      <Zap size={8} /> AI
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-white/50 bg-white/10 px-1.5 py-0.5 rounded-full">Local</span>
                  )}
                </div>
                <p className="text-[10px] text-white/70 mt-0.5">{groqAvailable ? 'Groq AI-powered click matching' : 'Set Groq key for AI matching'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                className={`p-1.5 rounded-lg hover:bg-white/20 transition-colors ${showKeyInput ? 'bg-white/20' : ''}`}
                title={groqAvailable ? 'Groq API key configured' : 'Set Groq API key'}
              >
                <Key size={14} className={groqAvailable ? 'text-green-300' : 'text-yellow-300'} />
              </button>
              <button
                onClick={() => { isMuted ? setIsMuted(false) : (stopSpeaking(), setIsMuted(true)); }}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                title={isMuted ? 'Unmute voice' : 'Mute voice'}
              >
                {isMuted ? <VolumeX size={14} className="text-white/70" /> : <Volume2 size={14} className="text-white" />}
              </button>
              <button
                onClick={handleShowActions}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                title="Show clickable elements"
              >
                <MousePointerClick size={14} className="text-white" />
              </button>
              <button
                onClick={() => { setIsOpen(false); stopSpeaking(); }}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                title="Close assistant"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          </div>

          {/* Groq API Key Input */}
          {showKeyInput && (
            <div className={`border-b px-3 py-2.5 ${isDark ? 'bg-brand-800/70 border-brand-700' : 'bg-brand-50 border-brand-200'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-brand-400' : 'text-brand-500'}`}>
                {groqAvailable ? '\u2705 Groq AI Active' : '\u26A1 Set Groq API Key for AI Matching'}
              </p>
              <div className="flex gap-1.5">
                <input
                  type="password"
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  placeholder="gsk_..."
                  className={`flex-1 text-xs px-2.5 py-1.5 rounded-lg border outline-none ${isDark ? 'bg-brand-900 border-brand-700 text-white placeholder-brand-600' : 'bg-white border-brand-200 text-brand-900 placeholder-brand-400'}`}
                  onKeyDown={e => e.key === 'Enter' && handleSaveKey()}
                />
                <button
                  onClick={handleSaveKey}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-500 transition-colors"
                >
                  Save
                </button>
              </div>
              <p className={`text-[10px] mt-1 ${isDark ? 'text-brand-500' : 'text-brand-400'}`}>
                Free key from <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="underline">console.groq.com/keys</a>
              </p>
            </div>
          )}

          {/* Action List Overlay */}
          {showActionList && (
            <div className={`border-b px-3 py-2 max-h-40 overflow-y-auto ${
              isDark ? 'bg-brand-800/50 border-brand-700' : 'bg-brand-50 border-brand-200'
            }`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-brand-400' : 'text-brand-500'
              }`}>
                Clickable Elements on This Page
              </p>
              <div className="flex flex-wrap gap-1">
                {availableActions.length === 0 ? (
                  <p className={`text-xs ${isDark ? 'text-brand-500' : 'text-brand-400'}`}>No elements found.</p>
                ) : (
                  availableActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleActionClick(action)}
                      className={`text-[11px] px-2 py-1 rounded-lg border transition-colors truncate max-w-[160px] ${
                        isDark
                          ? 'border-brand-700 bg-brand-800 text-brand-200 hover:bg-brand-700 hover:text-white'
                          : 'border-brand-200 bg-white text-brand-700 hover:bg-brand-100 hover:text-brand-900'
                      }`}
                      title={action}
                    >
                      {action}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto px-4 py-3 space-y-3 ${
            isDark ? 'bg-brand-900' : 'bg-brand-50/30'
          }`} style={{ minHeight: '200px', maxHeight: '360px' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.type === 'user'
                    ? isDark
                      ? 'bg-brand-600 text-white rounded-br-md'
                      : 'bg-brand-600 text-white rounded-br-md'
                    : msg.type === 'system'
                    ? isDark
                      ? 'bg-brand-800/60 text-brand-400 rounded-bl-md text-xs italic'
                      : 'bg-brand-100/60 text-brand-500 rounded-bl-md text-xs italic'
                    : isDark
                      ? 'bg-brand-800 text-brand-100 rounded-bl-md'
                      : 'bg-white text-brand-800 rounded-bl-md shadow-sm border border-brand-100'
                }`}>
                  <div className="flex items-start gap-1.5">
                    {msg.type === 'assistant' && msg.result && (
                      <span className="mt-0.5 text-xs shrink-0">{getResultIcon(msg.result)}</span>
                    )}
                    <span>{msg.text}</span>
                  </div>
                  {msg.result && getConfidenceBadge(msg.result)}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className={`rounded-2xl rounded-bl-md px-4 py-3 ${
                  isDark ? 'bg-brand-800' : 'bg-white border border-brand-100 shadow-sm'
                }`}>
                  <div className="flex gap-1.5">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-brand-400' : 'bg-brand-500'}`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-brand-400' : 'bg-brand-500'}`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-brand-400' : 'bg-brand-500'}`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Commands */}
          {showQuickActions && messages.length <= 2 && (
            <div className={`border-t px-3 py-2 ${isDark ? 'border-brand-700' : 'border-brand-200'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-brand-500' : 'text-brand-400'
              }`}>Quick Commands</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_COMMANDS.map(cmd => (
                  <button
                    key={cmd.command}
                    onClick={() => handleQuickCommand(cmd.command)}
                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${
                      isDark
                        ? 'border-brand-700 bg-brand-800 text-brand-200 hover:bg-brand-700 hover:text-white'
                        : 'border-brand-200 bg-white text-brand-700 hover:bg-brand-100 hover:text-brand-900'
                    }`}
                  >
                    <span>{cmd.icon}</span>
                    <span>{cmd.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div>
            {/* Volume Level Indicator */}
            {autoListenEnabled && isListening && (
              <div className={`px-3 pt-2 pb-0 ${isDark ? 'bg-brand-800/50' : 'bg-white'}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium shrink-0 ${micLevel > 10 ? 'text-green-500' : isDark ? 'text-brand-500' : 'text-brand-400'}`}>
                    {spokenText || (micLevel > 20 ? '🎤 Speak now...' : '🔇 Quiet — waiting for speech')}
                  </span>
                  <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-brand-700' : 'bg-brand-200'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-75 ${
                        micLevel > 30 ? 'bg-green-500' : micLevel > 10 ? 'bg-yellow-500' : isDark ? 'bg-brand-600' : 'bg-brand-300'
                      }`}
                      style={{ width: `${micLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              className={`flex items-center gap-2 px-3 py-3 border-t ${
                isDark ? 'border-brand-700 bg-brand-800/50' : 'border-brand-200 bg-white'
              }`}
            >
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`shrink-0 p-2.5 rounded-xl transition-all ${
                autoListenEnabled
                  ? isListening
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-green-600/80 text-white'
                  : isDark
                    ? 'bg-brand-700 text-brand-200 hover:bg-brand-600 hover:text-white'
                    : 'bg-brand-100 text-brand-600 hover:bg-brand-200 hover:text-brand-800'
              }`}
              title={autoListenEnabled ? 'Auto-listening ON — click to pause' : 'Auto-listen paused — click to resume'}
            >
              {autoListenEnabled ? (
                <span className="relative flex">
                  <Mic size={16} />
                  {isListening && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-300 animate-ping" />}
                </span>
              ) : <MicOff size={16} />}
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={isListening ? (spokenText || '🎤 Listening... speak now') : 'Type a command...'}
              disabled={isProcessing}
              className={`flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-colors ${
                isDark
                  ? 'bg-brand-900 text-white placeholder-brand-600 border border-brand-700 focus:border-brand-500'
                  : 'bg-brand-50 text-brand-900 placeholder-brand-400 border border-brand-200 focus:border-brand-400'
              }`}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className={`shrink-0 p-2.5 rounded-xl transition-all ${
                inputText.trim() && !isProcessing
                  ? 'bg-brand-600 text-white hover:bg-brand-500 shadow-md'
                  : isDark
                    ? 'bg-brand-800 text-brand-600'
                    : 'bg-brand-100 text-brand-300'
              }`}
              title="Send command"
            >
              <Send size={16} />
            </button>
          </form>
          </div>
        </div>
      )}

      {/* Floating Icon Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={`group relative p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen
            ? isDark
              ? 'bg-brand-700 hover:bg-brand-600'
              : 'bg-brand-600 hover:bg-brand-700'
            : isDark
              ? 'bg-brand-600 hover:bg-brand-500'
              : 'bg-brand-500 hover:bg-brand-600'
        }`}
        title={isOpen ? 'Close assistant' : 'Open accessibility assistant'}
        aria-label={isOpen ? 'Close accessibility assistant' : 'Open accessibility assistant'}
      >
        {isOpen ? (
          <ChevronDown className="text-white" size={28} />
        ) : (
          <MessageCircle className="text-white" size={28} />
        )}

        {/* Pulse ring on first load */}
        {pulseIcon && !isOpen && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping bg-brand-400/40" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-brand-300 items-center justify-center">
                <Sparkles size={8} className="text-brand-800" />
              </span>
            </span>
          </>
        )}

        {/* Listening indicator — always-on */}
        {autoListenEnabled && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${isListening ? 'bg-green-400' : 'bg-green-600'}`} />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500 items-center justify-center">
              <Mic size={8} className="text-white" />
            </span>
          </span>
        )}
      </button>
    </div>
  );
};

export default AccessibilityChatbot;
