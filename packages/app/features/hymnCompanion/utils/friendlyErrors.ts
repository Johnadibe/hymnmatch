export function explainLoadPassageError(message: string): {
  title: string
  message: string
  hint: string
} {
  const lower = message.toLowerCase()
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('connection')) {
    return {
      title: 'No internet connection',
      message: 'We could not load the Scripture passage right now.',
      hint: 'Check Wi‑Fi or mobile data, then tap Try again.',
    }
  }
  return {
    title: 'Scripture could not load',
    message,
    hint: 'Try a simpler reference like "John 3:16" or pull to refresh.',
  }
}

export function explainMatchError(message: string): {
  title: string
  message: string
  hint: string
} {
  const lower = message.toLowerCase()
  if (lower.includes('api key') || lower.includes('403') || lower.includes('401')) {
    return {
      title: 'AI key problem',
      message: 'Gemini could not authorize your request.',
      hint: 'Add EXPO_PUBLIC_GEMINI_API_KEY in apps/expo/.env and restart the app with yarn native.',
    }
  }
  if (lower.includes('429') || lower.includes('quota') || lower.includes('rate')) {
    return {
      title: 'Too many requests',
      message: 'The free Gemini quota was exceeded for now.',
      hint: 'Wait a few minutes and retry, or use offline fallback by removing the key temporarily.',
    }
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return {
      title: 'Connection issue',
      message: 'We could not reach Google Gemini.',
      hint: 'Check your connection. Saved Scripture on this device is still available.',
    }
  }
  return {
    title: 'Could not suggest hymns',
    message,
    hint: 'Tap Try again. If it persists, check your Gemini key and internet.',
  }
}
