export const customAlert = (message, title = 'Notification') => {
    return new Promise((resolve) => {
        const event = new CustomEvent('show-dialog', {
            detail: { type: 'alert', title, message, resolve },
        });
        window.dispatchEvent(event);
    });
};

export const customConfirm = (message, title = 'Confirmation') => {
    return new Promise((resolve) => {
        const event = new CustomEvent('show-dialog', {
            detail: { type: 'confirm', title, message, resolve },
        });
        window.dispatchEvent(event);
    });
};
