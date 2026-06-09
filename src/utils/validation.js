
//  Common required validator (REUSABLE)
export const validateRequired = (value, fieldName = "Field") => {
  if (!value || !value.trim()) return `${fieldName} is required`;
  return "";
};

// ✅ Email
export const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
    return "Enter valid email";
  return "";
};

// ✅ Password
export const validatePassword = (password) => {
  if (!password.trim()) return "Password is required";
  if (password.length < 8) return "Min 8 characters";
  return "";
};

// ✅ Name
export const validateName = (name) => {
  if (!name.trim()) return "Name is required";
  if (name.length < 3) return "Min 3 characters";
  return "";
};

// ✅ Phone
export const validatePhone = (phone) => {
  if (!/^[0-9]{10}$/.test(phone))
    return "Enter valid 10 digit phone";
  return "";
};

// ✅ Postcode
export const validatePostcode = (postcode) => {
  if (!/^[0-9]{6}$/.test(postcode))
    return "Enter valid 6 digit code";
  return "";
};
