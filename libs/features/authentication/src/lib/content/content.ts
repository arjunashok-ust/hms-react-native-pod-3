export const buildEnglishContent = () => ({
  // components
  authInputTextContent: {},
  authSubmitTextContent: {},
  // screens
  loginContent: {
    welcome: {
      text1: "Welcome To,",
      text2: "HMS",
      text3: "Please login to your account",
    },
    fields: {
      email: "Email",
      password: "Password",
    },
    submitButton: {
      login: "Login",
      loggingIn: "Logging In...",
    },
    footer: {
      prompt: "Don't have an account?",
      action: " Signup",
    },
    toast: {
      validationFailed: {
        title: "Validation Failed",
        message: "Please check the input fields",
      },
      success: {
        title: "Success.",
        message: "Login Sucessfull",
      },
    },
  },
  signupContent: {
    welcome: {
      text1: "New To,",
      text2: "HMS?",
      text3: "Create your account to get started.",
    },
    fields: {
      name: "Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      phone: "Phone",
      address: "Address",
      allergies: "Allergies",
      dob: "DOB",
      emergencyContact: "Emergency Contact",
    },
    gender: {
      placeholder: "Gender",
      male: "Male",
      female: "Female",
    },
    bloodGroup: {
      placeholder: "Blood Group",
    },
    // labels passed to validateRequired(...)
    requiredLabels: {
      gender: "Gender",
      address: "Address",
      bloodGroup: "Blood group",
    },
    submitButton: {
      signup: "Signup",
      signingUp: "Signing In...",
    },
    footer: {
      prompt: "Already have an account?",
      action: " Login",
    },
    toast: {
      success: {
        title: "Success.",
        message: "Account created successfully.",
      },
      validationFailed: {
        title: "Validation failed.",
        message: "Please check your input and try again.",
      },
    },
  },
});

export type AuthenticationLanguage = "en";
export type AuthenticationContent = ReturnType<typeof buildEnglishContent>;

export const defaultContent: Record<
  AuthenticationLanguage,
  () => AuthenticationContent
> = {
  en: buildEnglishContent,
};

// Static (non-context) content used directly by screens.
export const content: AuthenticationContent = defaultContent.en();
