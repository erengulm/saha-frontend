
export const getCSRFToken = () => {
    const token = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (!token) {
        // If no meta tag, try getting from cookie
        const cookies = document.cookie.split(';');
        const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
        return csrfCookie ? csrfCookie.split('=')[1] : null;
    }
    return token;
};
