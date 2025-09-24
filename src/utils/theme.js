// 主题切换工具函数

// ColorControl 存储键前缀
const STORAGE_KEY_BASE = 'colorControlThemeV1'

// 可用的主题列表
export const themes = {
  light: 'light',
  dark: 'dark'
}

// 默认主题
export const defaultTheme = themes.dark

// 读取并应用 ColorControl 持久化的颜色变量
function readColorControlForMode(mode) {
  try {
    const key = `${STORAGE_KEY_BASE}:${mode}`
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

export function applyColorControlVars(data) {
  if (!data) return
  const root = document.documentElement
  if (data.primary) root.style.setProperty('--color-primary', data.primary)
  if (data.bgCard) root.style.setProperty('--color-bg-card', data.bgCard)
  if (data.text) root.style.setProperty('--color-text-primary', data.text)
}

// 读取主题默认值（优先使用静态配置，回退到探针元素）
export function readThemeDefaults(themeName) {
  const mode = themeName === 'light' ? 'light' : 'dark'
  
  // 回退到探针元素读取
  const probe = document.createElement('div')
  probe.setAttribute('data-theme', themeName)
  probe.style.display = 'none'
  document.body.appendChild(probe)
  const cs = getComputedStyle(probe)
  const vals = {
    primary: (cs.getPropertyValue('--color-primary') || '').trim(),
    bgCard: (cs.getPropertyValue('--color-bg-card') || '').trim(),
    text: (cs.getPropertyValue('--color-text-primary') || '').trim()
  }
  document.body.removeChild(probe)
  return vals
}

// 读取 ColorControl 存储数据，如果没有存储则返回默认值
export function readColorControlFromStorage() {
  try {
    const mode = getCurrentTheme() === 'light' ? 'light' : 'dark'
    const key = `${STORAGE_KEY_BASE}:${mode}`
    const raw = localStorage.getItem(key)
    if (!raw) {
      // 没有存储数据时返回默认值
      return readThemeDefaults(mode)
    }
    return JSON.parse(raw)
  } catch (e) {
    // 解析失败时也返回默认值
    const mode = getCurrentTheme() === 'light' ? 'light' : 'dark'
    return readThemeDefaults(mode)
  }
}

// 写入 ColorControl 存储数据
export function writeColorControlToStorage(data) {
  try {
    const mode = getCurrentTheme() === 'light' ? 'light' : 'dark'
    const key = `${STORAGE_KEY_BASE}:${mode}`
    const raw = localStorage.getItem(key)
    const prev = raw ? JSON.parse(raw) : {}
    const next = { ...(prev || {}), ...(data || {}) }
    localStorage.setItem(key, JSON.stringify(next))
  } catch (e) {
    // ignore
  }
}

// 清除当前主题的 ColorControl 存储数据
export function clearColorControlStorage() {
  try {
    const mode = getCurrentTheme() === 'light' ? 'light' : 'dark'
    const key = `${STORAGE_KEY_BASE}:${mode}`
    localStorage.removeItem(key)
  } catch (e) {
    // ignore
  }
}

// 清除所有主题的 ColorControl 存储数据
export function clearAllColorControlStorage() {
  try {
    const lightKey = `${STORAGE_KEY_BASE}:light`
    const darkKey = `${STORAGE_KEY_BASE}:dark`
    localStorage.removeItem(lightKey)
    localStorage.removeItem(darkKey)
  } catch (e) {
    // ignore
  }
}

// 获取当前主题
export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || defaultTheme
}

// 设置主题
export function setTheme(themeName) {
  if (!themes[themeName]) {
    themeName = defaultTheme
  }
  
  document.documentElement.setAttribute('data-theme', themeName)
  localStorage.setItem('theme', themeName)
  
  // 应用该主题的 ColorControl 颜色设置
  const mode = themeName === 'light' ? 'light' : 'dark'
  const saved = readColorControlForMode(mode)
  if (saved) {
    applyColorControlVars(saved)
  } else {
    // 如果没有保存的颜色数据，则使用当前主题的默认颜色
    const defaults = readThemeDefaults(themeName)
    applyColorControlVars(defaults)
  }
  
  // 触发主题变化事件
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName } }))
  }
  
  return themeName
}

// 切换主题
export function toggleTheme() {
  const currentTheme = getCurrentTheme()
  const themeList = Object.values(themes)
  const currentIndex = themeList.indexOf(currentTheme)
  const nextIndex = (currentIndex + 1) % themeList.length
  const nextTheme = themeList[nextIndex]
  
  return setTheme(nextTheme)
}

// 初始化主题
export function initTheme() {
  const savedTheme = localStorage.getItem('theme')
  const theme = savedTheme && themes[savedTheme] ? savedTheme : defaultTheme
  
  setTheme(theme)
  // setTheme 已经处理了颜色应用，这里不需要重复处理
  
  return theme
}

// 获取主题信息
export function getThemeInfo(themeName) {
  const themeNames = {
    light: '浅色主题',
    dark: '深色主题'
  }
  
  return {
    name: themeName,
    displayName: themeNames[themeName] || themeName,
    isCurrent: getCurrentTheme() === themeName
  }
}

// 获取所有主题信息
export function getAllThemes() {
  return Object.values(themes).map(theme => getThemeInfo(theme))
}

// 默认无头像链接 - 使用本地文件
export const DEFAULT_NO_AVATAR_URL = '/avatars/no-avatar.png'
