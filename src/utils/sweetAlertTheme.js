/**
 * Get SweetAlert2 theme configuration based on current app theme
 * Ensures dark mode support across all SweetAlert dialogs
 */
export const getSwalThemeConfig = () => {
  const isDark = 
    document.documentElement.getAttribute('data-theme') === 'dark' || 
    localStorage.getItem('theme') === 'dark' ||
    document.documentElement.classList.contains('dark')
  
  return {
    background: isDark ? '#1f2937' : '#ffffff',
    color: isDark ? '#f3f4f6' : '#000000',
    didOpen: (dialog) => {
      if (isDark) {
        dialog.style.backgroundColor = '#1f2937'
        const title = dialog.querySelector('.swal2-title')
        if (title) title.style.color = '#f3f4f6'
        const content = dialog.querySelector('.swal2-html-container')
        if (content) content.style.color = '#d1d5db'
        // Ensure select dropdowns and inputs are readable in dark mode
        const select = dialog.querySelector('.swal2-select')
        if (select) {
          select.style.backgroundColor = '#111827'
          select.style.color = '#f3f4f6'
          select.style.borderColor = '#374151'
        }
        dialog.querySelectorAll('.swal2-select option').forEach((opt) => {
          opt.style.backgroundColor = '#111827'
          opt.style.color = '#f3f4f6'
        })
        const confirmButton = dialog.querySelector('.swal2-confirm')
        if (confirmButton) confirmButton.style.backgroundColor = '#EF4444'
        const cancelButton = dialog.querySelector('.swal2-cancel')
        if (cancelButton) cancelButton.style.backgroundColor = '#6B7280'
      }
    }
  }
}
