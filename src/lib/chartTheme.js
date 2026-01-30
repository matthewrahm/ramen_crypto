export function getChartColors(theme) {
  if (theme === 'light') {
    return {
      textColor: '#555570',
      gridColor: 'rgba(0, 0, 0, 0.06)',
      borderColor: '#d1d1db',
    }
  }
  return {
    textColor: '#8888aa',
    gridColor: 'rgba(42, 42, 62, 0.3)',
    borderColor: '#2a2a3e',
  }
}
