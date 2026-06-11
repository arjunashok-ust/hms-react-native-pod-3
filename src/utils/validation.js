export const validateField = (
  value,
  fieldName,
  type
) => {
  const val = value?.trim() || "";

  switch (type) {
    case "required":
      return val ? "" : `${fieldName} is required`;

    case "name":
      if (!val) return "Name is required";
      return /^[A-Za-z ]+$/.test(val)
        ? ""
        : "Only alphabets allowed";

    case "email":
      if (!val) return "Email is required";
      return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        val
      )
        ? ""
        : "Invalid email";

    case "password":
      if (!val) return "Password is required";
      return /^(?=.*\d).{8,}$/.test(val)
        ? ""
        : "Minimum 8 characters and 1 number required";

    case "phone":
      if (!val) return `${fieldName} is required`;
      return /^\d{10}$/.test(val)
        ? ""
        : "Enter valid 10 digit number";

    case "optionalPhone":
      if (!val) return "";
      return /^\d{10}$/.test(val)
        ? ""
        : "Enter valid 10 digit number";

    case "city":
      if (!val) return "City is required";
      return /^[A-Za-z ]+$/.test(val)
        ? ""
        : "Only alphabets allowed";

    case "address":
      if (!val) return "Address is required";
      return /^[A-Za-z0-9\s,.-]+$/.test(val)
        ? ""
        : "Invalid address";

    case "postcode":
      if (!val) return "Postcode is required";
      return /^\d{6}$/.test(val)
        ? ""
        : "Enter valid 6 digit postcode";

    case "dob":
      if (!value) return "Date of Birth is required";

      const selected = new Date(value);
      const today = new Date();

      return selected <= today
        ? ""
        : "Future date not allowed";

    default:
      return "";
  }
};