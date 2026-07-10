export const isRequired = (value) => {
  return Boolean(String(value || '').trim());
};

export const isPasswordLongEnough = (password) => {
  return password.length >= 8;
};

export const isEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};
