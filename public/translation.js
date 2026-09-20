document.addEventListener('click', event => {
  const button = event.target.closest('[data-translate-language]')
  if (!button) return

  const menu = button.closest('[data-canonical-path]')
  if (!menu) return

  const language = button.dataset.translateLanguage
  const path = menu.dataset.canonicalPath
  const original = `https://vitalychait.com${path}`

  if (language === 'en') {
    window.top.location.replace(original)
    return
  }

  const translated = `https://vitalychait-com.translate.goog${path}?_x_tr_sl=en&_x_tr_tl=${encodeURIComponent(language)}&_x_tr_hl=en-US`
  window.top.location.replace(translated)
})
