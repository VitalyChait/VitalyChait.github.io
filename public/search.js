(() => {
  const dialog = document.querySelector('#site-search')
  const input = dialog?.querySelector('#site-search-input')
  const results = dialog?.querySelector('#site-search-results')
  const count = dialog?.querySelector('#site-search-count')
  const openButton = document.querySelector('.search-trigger')
  if (!dialog || !input || !results || !count || !openButton) return

  let indexPromise
  let previousFocus
  const normalize = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch('/search-index.json').then(response => {
        if (!response.ok) throw new Error('Search index unavailable')
        return response.json()
      }).catch(error => {
        indexPromise = null
        throw error
      })
    }
    return indexPromise
  }

  function excerpt(text, terms) {
    const lower = normalize(text)
    const hits = terms.map(term => lower.indexOf(term)).filter(position => position >= 0)
    const position = hits.length ? Math.min(...hits) : 0
    const start = Math.max(0, position - 75)
    const end = Math.min(text.length, start + 210)
    return (start ? '...' : '') + text.slice(start, end).trim() + (end < text.length ? '...' : '')
  }

  function score(page, terms) {
    const title = normalize(page.title)
    const body = normalize(page.text)
    if (!terms.every(term => title.includes(term) || body.includes(term))) return 0
    return terms.reduce((total, term) => total + (title.includes(term) ? 12 : 0) +
      Math.min(5, body.split(term).length - 1), 0) + (page.url === '/' ? 1 : 0)
  }

  async function search() {
    const query = input.value.trim()
    results.replaceChildren()
    if (!query) {
      count.textContent = 'Search the site by project, role, tool, or topic.'
      return
    }
    count.textContent = 'Searching...'
    try {
      const pages = await loadIndex()
      if (query !== input.value.trim() || !dialog.open) return
      const terms = [...new Set(normalize(query).split(/\s+/).filter(Boolean))]
      const matches = pages.map(page => ({page, rank: score(page, terms)}))
        .filter(item => item.rank > 0).sort((a, b) => b.rank - a.rank).slice(0, 10)
      count.textContent = matches.length ? `${matches.length} result${matches.length === 1 ? '' : 's'}` : 'No results. Try a shorter term.'
      for (const {page} of matches) {
        const item = document.createElement('li')
        const link = document.createElement('a')
        const title = document.createElement('strong')
        const description = document.createElement('span')
        const address = document.createElement('small')
        link.href = page.url
        title.textContent = page.title
        description.textContent = excerpt(page.text, terms)
        address.textContent = page.url
        link.append(title, description, address)
        item.append(link)
        results.append(item)
      }
    } catch {
      count.textContent = 'Search is temporarily unavailable. Use the navigation links above.'
    }
  }

  openButton.addEventListener('click', () => {
    previousFocus = document.activeElement
    dialog.showModal()
    input.focus()
    search()
  })
  dialog.querySelector('.search-close').addEventListener('click', () => dialog.close())
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close() })
  dialog.addEventListener('close', () => previousFocus?.focus())
  input.addEventListener('input', search)
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      if (!dialog.open) openButton.click()
      else input.focus()
    }
  })
})()
