export default function Toast({ message, type = 'success' }) {
  const colors = {
    success: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
    error: { bg: '#fee2e2', border: '#dc2626', text: '#7f1d1d' },
    warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' }
  }
  const style = colors[type] || colors.success

  return (
    <div 
      style={{ 
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '8px',
        padding: '12px 20px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        zIndex: 1000
      }}
    >
      <p style={{ color: style.text, fontWeight: 'bold', margin: 0 }}>{message}</p>
    </div>
  )
}
