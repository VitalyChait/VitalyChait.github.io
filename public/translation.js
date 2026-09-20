document.addEventListener('click', event => {
  const button = event.target.closest('[data-translate-language]')
  if (!button) return

  const menu = button.closest('[data-canonical-path]')
  if (!menu) return

  const supportedLanguages = new Set([
    'en', 'es', 'zh-CN', 'hi', 'ar', 'pt', 'bn', 'ru', 'ja',
    'pa', 'de', 'jv', 'ko', 'fr', 'tr', 'vi', 'it', 'th',
    'gu', 'fa', 'pl', 'uk', 'id', 'nl', 'ro', 'el', 'he'
  ])
  const language = button.dataset.translateLanguage
  if (!supportedLanguages.has(language)) return

  const requestedPath = menu.dataset.canonicalPath
  const safePath = /^\/(?:[a-z0-9-]+\/)*$/i.test(requestedPath)
    ? requestedPath
    : '/'
  const path = safePath.startsWith('//') ? '/' : safePath
  const original = `https://vitalychait.com${path}`

  if (language === 'en') {
    window.top.location.replace(original)
    return
  }

  const translated = `https://vitalychait-com.translate.goog${path}?_x_tr_sl=en&_x_tr_tl=${encodeURIComponent(language)}&_x_tr_hl=en-US`
  window.top.location.replace(translated)
})
