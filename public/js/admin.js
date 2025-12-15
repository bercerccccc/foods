let allowedEmails = ['admin', 'root'];

let email = formData.get('email');
if (!email.includes('@') && !allowedEmails.includes(email)) {
    showError('Email должен содержать @');
    return;
}
