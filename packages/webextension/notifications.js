import browser from 'webextension-polyfill'

function notificationOnClicked(notificationId) {
  if (notificationId.startsWith('https://')) {
    browser.tabs.create({url: notificationId})
  }
}

function subscribeToNotificationClicked() {
  // none browser env
  if (typeof window === 'undefined') return
  if (typeof global !== 'undefined') return
  if (!browser.notifications.onClicked.hasListener(notificationOnClicked)) {
    browser.notifications.onClicked.addListener(notificationOnClicked)
  }
}

export function create(id, options = {}) {
  const {
    type = 'basic',
    message = '',
    title = 'Fluent wallet',
    iconUrl = 'images/icon-64.png',
  } = options
  subscribeToNotificationClicked()
  return browser.notifications.create(id ?? undefined, {
    ...options,
    type,
    message,
    title,
    iconUrl,
  })
}
