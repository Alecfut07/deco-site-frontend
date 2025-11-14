const fallbackNotify = ({ title, description, variant }) => {
    const message = [title, description].filter(Boolean).join(' - ') || 'Action completed';
    if (variant === 'destructive') {
        console.error(message);
        if (typeof window !== 'undefined' && window.alert) window.alert(message);
    } else {
        console.log(message);
    }
};

export const notify = (config = {}) => {
    if (typeof window !== 'undefined' && typeof window.appToast === 'function') {
        window.appToast(config);
        return;
    }
    fallbackNotify(config);
};