import defaultSettings from '@/settings'

const title = defaultSettings.title || '帅气马哥博客后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
