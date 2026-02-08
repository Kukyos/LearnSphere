/**
 * LearnSphere Accessibility Command Service
 * Adapted from Nullistant (AccessNull project)
 * 
 * Uses Groq AI (Llama 3.1) to intelligently match natural language
 * commands to clickable DOM elements on the current page.
 * Falls back to local scoring when Groq is unavailable.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

// ── Types ─────────────────────────────────────────────────────

export interface ElementInfo {
  element: HTMLElement;
  index: number;
  text: string;
  tag: string;
  type: string;
  role: string;
  ariaLabel: string;
  placeholder: string;
  href: string;
  isVisible: boolean;
  rect: DOMRect;
}

export interface CommandResult {
  success: boolean;
  action: string;
  target: string;
  message: string;
  confidence: number;
}

interface GroqAction {
  action: 'click' | 'navigate' | 'scroll' | 'type' | 'search' | 'help' | 'go_back' | 'toggle_theme' | 'close' | 'none';
  element_index: number;    // -1 if not an element action
  navigate_to?: string;     // path for navigate actions
  scroll_direction?: string;
  type_value?: string;      // text to type
  search_value?: string;    // search query
  explanation: string;
  confidence: number;
}

// ── Groq API key ──────────────────────────────────────────────
function getGroqApiKey(): string | null {
  // 1. localStorage override (user can paste key in settings)
  const stored = localStorage.getItem('learnsphere_groq_key');
  if (stored && stored.startsWith('gsk_')) return stored;
  // 2. Vite env variable
  const envKey = (import.meta as any).env?.VITE_GROQ_API_KEY;
  if (envKey && envKey.startsWith('gsk_')) return envKey;
  return null;
}

export function setGroqApiKey(key: string): void {
  localStorage.setItem('learnsphere_groq_key', key);
}

export function hasGroqKey(): boolean {
  return getGroqApiKey() !== null;
}

// ── Groq Whisper speech-to-text ───────────────────────────────
const GROQ_WHISPER_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const apiKey = getGroqApiKey();
  if (!apiKey) throw new Error('No Groq API key configured');

  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-large-v3-turbo');
  formData.append('language', 'en');
  formData.append('response_format', 'json');

  const res = await fetch(GROQ_WHISPER_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('[Whisper] Error:', res.status, errorText);
    throw new Error(`Whisper API error: ${res.status}`);
  }

  const data = await res.json();
  return (data.text || '').trim();
}

// ── Page context for help ─────────────────────────────────────
const PAGE_HELP: Record<string, string> = {
  '/': 'You are on the home page. You can say "explore courses", "sign in", "search for React", or click on any course card.',
  '/explore': 'You are on the Explore page. You can search for courses, filter by tags, or click on a course to view details.',
  '/login': 'You are on the login page. You can say "sign in", "create account", "continue as guest", or "forgot password".',
  '/my-courses': 'You are on My Courses. You can see your enrolled courses, click on one to continue, or explore more courses.',
  '/courses': 'You are on the instructor dashboard. You can create a course, switch between kanban and list view, or search courses.',
  '/reporting': 'You are on the reporting dashboard. You can filter by status, sort columns, or search participants.',
  '/settings': 'You are on the settings page. You can switch tabs for Profile, Notifications, Privacy, Appearance, and Admin.',
};

function getPageHelp(pathname: string): string {
  if (PAGE_HELP[pathname]) return PAGE_HELP[pathname];
  if (pathname.startsWith('/course/')) return 'You are viewing a course. You can enroll, view lessons, read reviews, or go back.';
  if (pathname.startsWith('/lesson/')) return 'You are in the lesson player. You can navigate between lessons, mark complete, or go back to the course.';
  if (pathname.startsWith('/course-form')) return 'You are editing a course. You can switch tabs, add lessons, manage tags, preview, or save.';
  if (pathname.startsWith('/quiz-builder')) return 'You are building a quiz. You can add questions, set correct answers, configure rewards, or save.';
  return 'You can ask me to click any button, navigate to a page, scroll, or get help with what\'s on screen.';
}

// ── DOM scanning ──────────────────────────────────────────────
function getPageElements(): ElementInfo[] {
  const elements: ElementInfo[] = [];
  const allEls = document.querySelectorAll(
    'button, a, [role="button"], [role="link"], [role="tab"], [role="menuitem"], ' +
    'input, select, textarea, [onclick], [tabindex], summary, label[for], ' +
    '[role="checkbox"], [role="switch"], [role="option"], [role="radio"], ' +
    '[data-course-title]'
  );

  let idx = 0;
  const seen = new Set<HTMLElement>();
  allEls.forEach(el => {
    const htmlEl = el as HTMLElement;
    if (seen.has(htmlEl)) return;
    seen.add(htmlEl);
    const style = window.getComputedStyle(htmlEl);
    if (style.display === 'none' || style.visibility === 'hidden') return;
    // Allow opacity 0 for course cards (Netflix hover effect hides base card)
    const isCourseCard = htmlEl.hasAttribute('data-course-title');
    if (style.opacity === '0' && !isCourseCard) return;
    if (htmlEl.closest('[data-accessibility-chatbot]')) return;
    const rect = htmlEl.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    // For course cards, use the data attribute as the primary label
    const courseTitle = htmlEl.getAttribute('data-course-title') || '';

    elements.push({
      element: htmlEl,
      index: idx++,
      text: courseTitle || (htmlEl.textContent || '').trim().substring(0, 120),
      tag: htmlEl.tagName.toLowerCase(),
      type: (htmlEl as HTMLInputElement).type || '',
      role: htmlEl.getAttribute('role') || '',
      ariaLabel: htmlEl.getAttribute('aria-label') || courseTitle || '',
      placeholder: (htmlEl as HTMLInputElement).placeholder || '',
      href: (htmlEl as HTMLAnchorElement).href || '',
      // Course cards in horizontal scroll may be offscreen horizontally — still mark as visible
      isVisible: isCourseCard ? true : (rect.top < window.innerHeight && rect.bottom > 0),
      rect,
    });
  });

  return elements;
}

// ── Build element descriptions for Groq ───────────────────────
function describeElements(elements: ElementInfo[]): string {
  return elements
    .filter(el => el.isVisible)
    .map(el => {
      const parts: string[] = [`[${el.index}]`];
      parts.push(`<${el.tag}>`);
      if (el.type) parts.push(`type="${el.type}"`);
      if (el.role) parts.push(`role="${el.role}"`);
      if (el.ariaLabel) parts.push(`aria-label="${el.ariaLabel}"`);
      if (el.placeholder) parts.push(`placeholder="${el.placeholder}"`);
      if (el.text && el.text.length > 0) parts.push(`text="${el.text.substring(0, 80)}"`);
      if (el.href && el.tag === 'a') {
        try {
          const url = new URL(el.href);
          parts.push(`href="${url.pathname}"`);
        } catch {
          parts.push(`href="${el.href.substring(0, 60)}"`);
        }
      }
      return parts.join(' ');
    })
    .join('\n');
}

// ── Groq system prompt ────────────────────────────────────────
function buildSystemPrompt(pathname: string, elementList: string): string {
  return `You are LearnSphere's accessibility click assistant. Your job is to interpret the user's voice/text command and match it to the correct interactive element on the current page, or perform a navigation/scroll/type action.

CURRENT PAGE: ${pathname}
PAGE CONTEXT: ${getPageHelp(pathname)}

AVAILABLE INTERACTIVE ELEMENTS ON THIS PAGE:
${elementList}

AVAILABLE NAVIGATION ROUTES:
/ — Home page
/explore — Browse all courses
/login — Sign in page
/my-courses — My enrolled courses
/settings — User settings
/courses — Instructor dashboard
/reporting — Reports dashboard

INSTRUCTIONS:
1. Analyze the user's command (could be voice-transcribed, so handle typos/speech artifacts like "uh", "um").
2. Elements with aria-label like "Open course: <title>" are clickable course cards. If the user says a course name (even partially), match it to the closest course card.
3. Determine the best action:
   - "click" — click a specific element. Set element_index to the [index] number from the list above.
   - "navigate" — go to a different page. Set navigate_to to the route path.
   - "scroll" — scroll the page. Set scroll_direction to "up" or "down".
   - "type" — type text into an input. Set element_index to the input's index, and type_value to the text.
   - "search" — find a search input and type into it. Set search_value to the query.
   - "toggle_theme" — switch dark/light mode.
   - "go_back" — go to previous page.
   - "close" — close a modal or menu (find a close/X/cancel button).
   - "help" — list what the user can do on this page.
   - "none" — if the command doesn't match anything.
3. Be smart about matching: "sign out" = Log Out button, "enroll" = Enroll Now button, "next lesson" = Next button, etc.
4. Set confidence from 0.0 to 1.0 based on how certain you are.

RESPOND WITH ONLY valid JSON (no markdown, no code fences):
{"action":"click","element_index":5,"explanation":"Clicking the Enroll Now button","confidence":0.95}`;
}

// ── Call Groq API ─────────────────────────────────────────────
async function callGroq(userCommand: string, pathname: string, elements: ElementInfo[]): Promise<GroqAction | null> {
  const apiKey = getGroqApiKey();
  if (!apiKey) return null;

  const elementList = describeElements(elements);
  if (!elementList.trim()) return null;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt(pathname, elementList) },
          { role: 'user', content: userCommand },
        ],
        max_tokens: 200,
        temperature: 0.1,
        top_p: 0.9,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.warn('Groq API error:', response.status);
      return null;
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim();
    if (!raw) return null;

    // Parse JSON — strip any accidental code fences
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned) as GroqAction;
    return parsed;
  } catch (err) {
    console.warn('Groq call failed, falling back to local:', err);
    return null;
  }
}

// ── Local fallback: simple scoring ────────────────────────────
function localScoreElement(el: ElementInfo, target: string): number {
  let score = 0;
  const t = target.toLowerCase();
  const elText = el.text.toLowerCase();
  const elLabel = el.ariaLabel.toLowerCase();
  const elPlaceholder = el.placeholder.toLowerCase();

  if (elText === t) score += 100;
  else if (elLabel === t) score += 95;
  else if (elText.startsWith(t)) score += 80;
  else if (elText.includes(t)) score += 60;
  else if (elLabel.includes(t)) score += 55;
  else if (elPlaceholder.includes(t)) score += 40;
  else if (el.href.toLowerCase().includes(t)) score += 30;
  else {
    const targetWords = t.split(/\s+/);
    const elWords = `${elText} ${elLabel}`.split(/\s+/);
    let matches = 0;
    for (const tw of targetWords) {
      if (tw.length < 2) continue;
      if (elWords.some(ew => ew.includes(tw) || tw.includes(ew))) matches++;
    }
    if (matches > 0) score += (matches / targetWords.length) * 50;
  }

  if (el.tag === 'button' || el.role === 'button') score += 10;
  if (el.tag === 'a') score += 8;
  if (el.isVisible) score += 5;
  if (elText.length > 50) score -= 10;

  return score;
}

function localFallbackClick(target: string, elements: ElementInfo[]): CommandResult {
  let bestScore = 0;
  let bestElement: ElementInfo | null = null;

  for (const el of elements) {
    const s = localScoreElement(el, target);
    if (s > bestScore) { bestScore = s; bestElement = el; }
  }

  // Also try individual words
  if (bestScore < 20) {
    const words = target.split(/\s+/).filter(w => w.length > 2);
    for (const word of words) {
      for (const el of elements) {
        const s = localScoreElement(el, word);
        if (s > bestScore) { bestScore = s; bestElement = el; }
      }
    }
  }

  if (bestElement && bestScore >= 15) {
    const label = bestElement.ariaLabel || bestElement.text.substring(0, 40) || bestElement.tag;
    robustClick(bestElement.element);
    const conf = Math.min(bestScore / 100, 1);
    const msg = `Clicking "${label}" (local match, ${Math.round(conf * 100)}%).`;
    speak(msg);
    return { success: true, action: 'click', target: label, message: msg, confidence: conf };
  }

  const msg = `Sorry, I couldn't find "${target}" on this page. Try "help" to see what's available.`;
  speak(msg);
  return { success: false, action: 'click', target, message: msg, confidence: 0 };
}

// ── Multi-method click ────────────────────────────────────────
function robustClick(el: HTMLElement): void {
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const originalOutline = el.style.outline;
  const originalOutlineOffset = el.style.outlineOffset;
  el.style.outline = '3px solid #5c7f4c';
  el.style.outlineOffset = '2px';
  setTimeout(() => {
    el.style.outline = originalOutline;
    el.style.outlineOffset = originalOutlineOffset;
  }, 1500);

  setTimeout(() => {
    try {
      el.focus();
      el.click();
    } catch {
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: x, clientY: y }));
      el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: x, clientY: y }));
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }));
    }
  }, 300);
}

// ── Set value on an input (React-friendly) ────────────────────
function setInputValue(input: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  robustClick(input);
  setTimeout(() => {
    const nativeSet = Object.getOwnPropertyDescriptor(
      input.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
      'value'
    )?.set;
    if (nativeSet) {
      nativeSet.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, 400);
}

// ── TTS speak ─────────────────────────────────────────────────
function speak(text: string): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 0.8;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
  );
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

// ── Execute a Groq action ─────────────────────────────────────
function executeGroqAction(action: GroqAction, elements: ElementInfo[]): CommandResult {
  switch (action.action) {
    case 'click': {
      const el = elements.find(e => e.index === action.element_index);
      if (el) {
        robustClick(el.element);
        const label = el.ariaLabel || el.text.substring(0, 40) || el.tag;
        const msg = `${action.explanation}`;
        speak(msg);
        return { success: true, action: 'click', target: label, message: msg, confidence: action.confidence };
      }
      return { success: false, action: 'click', target: '', message: 'Element not found.', confidence: 0 };
    }

    case 'navigate': {
      const path = action.navigate_to || '/';
      // Try to find a link first
      const link = elements.find(el => el.tag === 'a' && el.href.endsWith(path));
      if (link) {
        robustClick(link.element);
      } else {
        window.location.href = path;
      }
      const msg = action.explanation || `Navigating to ${path}.`;
      speak(msg);
      return { success: true, action: 'navigate', target: path, message: msg, confidence: action.confidence };
    }

    case 'scroll': {
      const dir = action.scroll_direction || 'down';
      const amount = 400;
      window.scrollBy({ top: dir === 'up' ? -amount : amount, behavior: 'smooth' });
      const msg = action.explanation || `Scrolling ${dir}.`;
      speak(msg);
      return { success: true, action: 'scroll', target: dir, message: msg, confidence: action.confidence };
    }

    case 'type': {
      const el = elements.find(e => e.index === action.element_index);
      if (el && action.type_value) {
        setInputValue(el.element as HTMLInputElement, action.type_value);
        const msg = action.explanation || `Typing "${action.type_value}".`;
        speak(msg);
        return { success: true, action: 'type', target: action.type_value, message: msg, confidence: action.confidence };
      }
      return { success: false, action: 'type', target: '', message: 'No input field found.', confidence: 0 };
    }

    case 'search': {
      const query = action.search_value || '';
      // Groq may have identified the search input
      if (action.element_index >= 0) {
        const el = elements.find(e => e.index === action.element_index);
        if (el) {
          setInputValue(el.element as HTMLInputElement, query);
          const msg = action.explanation || `Searching for "${query}".`;
          speak(msg);
          return { success: true, action: 'search', target: query, message: msg, confidence: action.confidence };
        }
      }
      // Fallback: find any search input
      const searchEl = elements.find(el =>
        el.tag === 'input' && (el.placeholder.toLowerCase().includes('search') || el.placeholder.toLowerCase().includes('find'))
      );
      if (searchEl) {
        setInputValue(searchEl.element as HTMLInputElement, query);
        const msg = action.explanation || `Searching for "${query}".`;
        speak(msg);
        return { success: true, action: 'search', target: query, message: msg, confidence: action.confidence };
      }
      return { success: false, action: 'search', target: query, message: 'No search field found.', confidence: 0 };
    }

    case 'toggle_theme': {
      const themeBtn = elements.find(el =>
        el.ariaLabel.toLowerCase().includes('theme') || el.ariaLabel.toLowerCase().includes('toggle')
      );
      if (themeBtn) {
        robustClick(themeBtn.element);
        const msg = action.explanation || 'Toggling theme.';
        speak(msg);
        return { success: true, action: 'toggle', target: 'theme', message: msg, confidence: action.confidence };
      }
      return { success: false, action: 'toggle', target: 'theme', message: 'Theme toggle not found.', confidence: 0 };
    }

    case 'go_back': {
      window.history.back();
      const msg = action.explanation || 'Going back.';
      speak(msg);
      return { success: true, action: 'go_back', target: '', message: msg, confidence: action.confidence };
    }

    case 'close': {
      // Find close/X/cancel button
      if (action.element_index >= 0) {
        const el = elements.find(e => e.index === action.element_index);
        if (el) {
          robustClick(el.element);
          const msg = action.explanation || 'Closing.';
          speak(msg);
          return { success: true, action: 'close', target: '', message: msg, confidence: action.confidence };
        }
      }
      const closeBtn = elements.find(el =>
        el.ariaLabel.toLowerCase().includes('close') ||
        el.text.toLowerCase() === 'x' ||
        el.text.toLowerCase().includes('cancel')
      );
      if (closeBtn) {
        robustClick(closeBtn.element);
        const msg = action.explanation || 'Closing.';
        speak(msg);
        return { success: true, action: 'close', target: '', message: msg, confidence: action.confidence };
      }
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      return { success: true, action: 'close', target: '', message: 'Sent Escape key.', confidence: 0.5 };
    }

    case 'help': {
      const helpText = getPageHelp(window.location.pathname);
      speak(helpText);
      return { success: true, action: 'help', target: '', message: helpText, confidence: 1.0 };
    }

    case 'none':
    default: {
      const msg = action.explanation || 'I couldn\'t match that to any action. Try "help" for options.';
      speak(msg);
      return { success: false, action: 'none', target: '', message: msg, confidence: 0 };
    }
  }
}

// ══════════════════════════════════════════════════════════════
// ── Main command execution (async — uses Groq AI) ─────────────
// ══════════════════════════════════════════════════════════════
export async function executeCommand(rawCommand: string): Promise<CommandResult> {
  const elements = getPageElements();
  const pathname = window.location.pathname;

  // ── Try Groq AI first ──────────────────────────────────────
  const groqAction = await callGroq(rawCommand, pathname, elements);

  if (groqAction) {
    return executeGroqAction(groqAction, elements);
  }

  // ── Fallback: lightweight local matching ────────────────────
  const text = rawCommand.toLowerCase().replace(/\b(uh|um|er|ah|like|you know)\b/gi, '').trim();

  // Help
  if (/\b(help|what can i do|what's here|assist)\b/.test(text)) {
    const helpText = getPageHelp(pathname);
    speak(helpText);
    return { success: true, action: 'help', target: '', message: helpText, confidence: 0.95 };
  }
  // Go back
  if (/\b(go back|back|previous page|return)\b/.test(text) && !/\b(previous lesson)\b/.test(text)) {
    window.history.back();
    speak('Going back.');
    return { success: true, action: 'go_back', target: '', message: 'Going back to the previous page.', confidence: 0.9 };
  }
  // Scroll
  if (/\bscroll\s*(up|down|top|bottom)\b/.test(text)) {
    const dir = text.includes('up') || text.includes('top') ? 'up' : 'down';
    window.scrollBy({ top: dir === 'up' ? -400 : 400, behavior: 'smooth' });
    speak(`Scrolling ${dir}.`);
    return { success: true, action: 'scroll', target: dir, message: `Scrolling ${dir}.`, confidence: 0.9 };
  }
  // Theme toggle
  if (/\b(dark mode|light mode|toggle theme|switch theme)\b/.test(text)) {
    const themeBtn = elements.find(el => el.ariaLabel.toLowerCase().includes('theme'));
    if (themeBtn) { robustClick(themeBtn.element); speak('Toggling theme.'); }
    return { success: !!themeBtn, action: 'toggle', target: 'theme', message: themeBtn ? 'Toggling theme.' : 'Theme button not found.', confidence: 0.9 };
  }
  // Search
  const searchMatch = text.match(/\b(?:search|find|look for)\s+(?:for\s+)?(.+)/);
  if (searchMatch) {
    const query = searchMatch[1].trim();
    const searchEl = elements.find(el =>
      el.tag === 'input' && (el.placeholder.toLowerCase().includes('search') || el.placeholder.toLowerCase().includes('find'))
    );
    if (searchEl) {
      setInputValue(searchEl.element as HTMLInputElement, query);
      speak(`Searching for "${query}".`);
      return { success: true, action: 'search', target: query, message: `Searching for "${query}".`, confidence: 0.85 };
    }
  }
  // Navigate
  const navMap: [RegExp, string][] = [
    [/\b(go to |navigate to |open )?(home|landing)\b/, '/'],
    [/\b(go to |navigate to |open )?explore\b/, '/explore'],
    [/\b(go to |navigate to |open )?(sign ?in|log ?in|login)\b/, '/login'],
    [/\b(go to |navigate to |open )?my ?courses\b/, '/my-courses'],
    [/\b(go to |navigate to |open )?dashboard\b/, '/courses'],
    [/\b(go to |navigate to |open )?reporting\b/, '/reporting'],
    [/\b(go to |navigate to |open )?settings\b/, '/settings'],
  ];
  for (const [pattern, path] of navMap) {
    if (pattern.test(text)) {
      const link = elements.find(el => el.tag === 'a' && el.href.endsWith(path));
      if (link) robustClick(link.element);
      else window.location.href = path;
      speak(`Navigating to ${path}.`);
      return { success: true, action: 'navigate', target: path, message: `Navigating to ${path}.`, confidence: 0.9 };
    }
  }

  // Default: try local click match
  const clickTarget = text.replace(/\b(click|press|tap|hit|select|choose|pick)\s+(on\s+|the\s+)?/g, '').trim() || text;
  return localFallbackClick(clickTarget, elements);
}

// ── List available actions on current page ────────────────────
export function getAvailableActions(): string[] {
  const elements = getPageElements();
  const actions: string[] = [];

  for (const el of elements) {
    if (!el.isVisible) continue;
    const label = el.ariaLabel || el.text;
    if (!label || label.length < 2 || label.length > 60) continue;
    const cleaned = label.trim().replace(/\s+/g, ' ');
    if (!actions.includes(cleaned)) {
      actions.push(cleaned);
    }
  }

  return actions.slice(0, 30);
}

// ── Voice Recognition (Web Speech API) ────────────────────────
// Forces mic permission via getUserMedia, then uses SpeechRecognition.
export class VoiceRecognizer {
  private recognition: any = null;
  private _isListening = false;
  private autoMode = false;
  private enabled = true;
  private micGranted = false;
  private restartTimer: ReturnType<typeof setTimeout> | null = null;
  public onResult: ((text: string) => void) | null = null;
  public onStateChange: ((listening: boolean) => void) | null = null;
  public onError: ((error: string) => void) | null = null;

  constructor() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    this.recognition = new SR();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this._isListening = true;
      this.onStateChange?.(true);
    };

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      const text = finalTranscript.trim();
      if (text) {
        this.onResult?.(text);
      }
    };

    this.recognition.onerror = (event: any) => {
      this._isListening = false;
      this.onStateChange?.(false);
      if (event.error === 'not-allowed') {
        this.autoMode = false;
        this.micGranted = false;
        this.onError?.('not-allowed');
        return;
      }
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        this.onError?.(event.error);
      }
      if (this.autoMode && this.enabled) {
        this.scheduleRestart(2000);
      }
    };

    this.recognition.onend = () => {
      this._isListening = false;
      this.onStateChange?.(false);
      if (this.autoMode && this.enabled) {
        this.scheduleRestart(2000);
      }
    };
  }

  /**
   * Force the browser to show the microphone permission prompt
   * by calling getUserMedia. SpeechRecognition.start() alone does NOT
   * show the prompt in Chrome when called outside a user gesture.
   */
  async requestMicPermission(): Promise<boolean> {
    if (this.micGranted) return true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Permission granted — release the stream immediately
      stream.getTracks().forEach(t => t.stop());
      this.micGranted = true;
      return true;
    } catch (err) {
      console.warn('Mic permission denied:', err);
      this.micGranted = false;
      this.onError?.('not-allowed');
      return false;
    }
  }

  private scheduleRestart(delay: number): void {
    if (this.restartTimer) clearTimeout(this.restartTimer);
    this.restartTimer = setTimeout(() => {
      if (this.autoMode && this.enabled && !this._isListening) {
        this.doStart();
      }
    }, delay);
  }

  private doStart(): void {
    if (!this.recognition || this._isListening) return;
    try {
      this.recognition.start();
    } catch (e) {
      if (this.autoMode && this.enabled) {
        this.scheduleRestart(3000);
      }
    }
  }

  get available(): boolean {
    return this.recognition !== null;
  }

  get listening(): boolean {
    return this._isListening;
  }

  get isAutoMode(): boolean {
    return this.autoMode;
  }

  /** Request mic permission, then start always-on listening. */
  async startAuto(): Promise<void> {
    if (!this.recognition) return;
    this.autoMode = true;
    this.enabled = true;
    // Force mic permission prompt via getUserMedia first
    const granted = await this.requestMicPermission();
    if (granted) {
      this.doStart();
    }
  }

  stopAuto(): void {
    this.autoMode = false;
    this.enabled = false;
    if (this.restartTimer) { clearTimeout(this.restartTimer); this.restartTimer = null; }
    this.stop();
  }

  async start(): Promise<void> {
    this.enabled = true;
    const granted = await this.requestMicPermission();
    if (granted) this.doStart();
  }

  stop(): void {
    if (!this.recognition) return;
    try { this.recognition.stop(); } catch {}
    this._isListening = false;
    this.onStateChange?.(false);
  }

  notifyCommandDone(): void {
    if (this.autoMode && this.enabled && !this._isListening) {
      this.scheduleRestart(3000);
    }
  }
}

// ── Stop TTS ──────────────────────────────────────────────────
export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
