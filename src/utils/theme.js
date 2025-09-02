// 主题切换工具函数

// 可用的主题列表
export const themes = {
  light: 'light',
  dark: 'dark',
  blue: 'blue'
}

// 默认主题
export const defaultTheme = themes.dark

// 获取当前主题
export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || defaultTheme
}

// 设置主题
export function setTheme(themeName) {
  if (!themes[themeName]) {
    console.warn(`Theme "${themeName}" not found, using default theme`)
    themeName = defaultTheme
  }
  
  document.documentElement.setAttribute('data-theme', themeName)
  localStorage.setItem('theme', themeName)
  
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
  return theme
}

// 获取主题信息
export function getThemeInfo(themeName) {
  const themeNames = {
    light: '浅色主题',
    dark: '深色主题',
    blue: '蓝色主题'
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

