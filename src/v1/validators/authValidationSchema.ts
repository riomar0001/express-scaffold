export const registrationValidators = {
  email: {
    matches: {
      options: /^[a-z]\.[a-z]+\.\d{6}@umindanao\.edu\.ph$/,
      errorMessage: "Invalid Umindanao Email Address",
    },
    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
    isEmail: {
      errorMessage: "Invalid Email Address",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: "Password must be at least 8 characters",
    },
  },
};

export const authenticationValidators = {
  email: {
    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
    isEmail: {
      errorMessage: "Invalid Email Address",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
  },
};
