const generateKey = (num: number) => {
    let text = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < num; i += 1) { text += chars.charAt(Math.floor(Math.random() * chars.length)); }
    return text;
};

export default generateKey;
