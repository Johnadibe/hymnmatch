export function explainLoadPassageError(message: string): {
  title: string
  message: string
  hint: string
} {
  const lower = message.toLowerCase()
  if (
    lower.includes('could not find') ||
    lower.includes('enter a bible reference') ||
    lower.includes('returned no verse')
  ) {
    return {
      title: 'Check the reference',
      message,
      hint: 'Use book chapter:verse, e.g. Romans 12:1-2 or John 3:16.',
    }
  }
  if (
    lower.includes('network request failed') ||
    lower.includes('failed to fetch') ||
    lower.includes('unable to resolve host') ||
    lower.includes('timed out') ||
    lower.includes('could not reach the scripture service')
  ) {
    return {
      title: 'Connection issue',
      message: 'We could not reach the Scripture service from this device.',
      hint: 'Check Wi‑Fi or mobile data, try opening https://bible-api.com in your phone browser, then tap Try again.',
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
  if (
    lower.includes('no longer available') ||
    lower.includes('models/gemini') ||
    lower.includes('invalid model')
  ) {
    return {
      title: 'Suggestions temporarily unavailable',
      message:
        'The hymn matching service could not connect with the configured model. The app will try other models automatically, or use catalogue matching.',
      hint: 'Tap Try again. Set EXPO_PUBLIC_GEMINI_MODEL=gemini-3.8-flash in apps/expo/.env and restart Expo (yarn native -c).',
    }
  }
  if (lower.includes('api key') || lower.includes('403') || lower.includes('401')) {
    return {
      title: 'Suggestions unavailable',
      message: 'Hymn matching is not configured on this build.',
      hint: 'Add EXPO_PUBLIC_GEMINI_API_KEY in apps/expo/.env and restart with yarn native.',
    }
  }
  if (lower.includes('429') || lower.includes('quota') || lower.includes('rate')) {
    return {
      title: 'Please wait a moment',
      message: 'Too many suggestion requests were sent in a short time.',
      hint: 'Wait a few minutes and try again.',
    }
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return {
      title: 'Connection issue',
      message: 'We could not load hymn suggestions right now.',
      hint: 'Check your connection. Your Scripture reading is still on this device.',
    }
  }
  return {
    title: 'Could not suggest hymns',
    message,
    hint: 'Tap Try again. If it persists, check your internet connection.',
  }
}
