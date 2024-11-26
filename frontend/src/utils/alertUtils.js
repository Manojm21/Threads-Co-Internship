// src/utils/alertUtils.js
export const showAlert = (message, type = 'info') => {
    switch (type) {
      case 'success':
        alert(`✅ Success: ${message}`);
        break;
      case 'error':
        alert(`❌ Error: ${message}`);
        break;
      case 'warning':
        alert(`⚠️ Warning: ${message}`);
        break;
      default:
        alert(`ℹ️ Info: ${message}`);
    }
  };
  