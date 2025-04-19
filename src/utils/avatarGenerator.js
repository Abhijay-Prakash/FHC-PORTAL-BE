export const generateAvatar = (name, gender) => {
    const encodedUsername = encodeURIComponent(name);
    
    if (gender === "male") {
        return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodedUsername}`;
    } else if (gender === "female") {
        return `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${encodedUsername}`;
    } else {
        return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodedUsername}`;
    }
};
