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
    normalizeEmail: true,
  },
  first_name: {
    notEmpty: {
      errorMessage: "First name cannot be empty",
    },
    isLength: {
      options: {
        min: 2,
        max: 50,
      },
      errorMessage: "First name must be between 2 and 50 characters",
    },
    trim: true,
  },
  last_name: {
    notEmpty: {
      errorMessage: "Last name cannot be empty",
    },
    isLength: {
      options: {
        min: 2,
        max: 50,
      },
      errorMessage: "Last name must be between 2 and 50 characters",
    },
    trim: true,
  },
  password: {
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
    isLength: {
      options: {
        min: 8,
        max: 128,
      },
      errorMessage: "Password must be between 8 and 128 characters",
    },
    isStrongPassword: {
      options: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      },
      errorMessage:
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol",
    },
  },
  confirm_password: {
    notEmpty: {
      errorMessage: "Confirm password cannot be empty",
    },
    isLength: {
      options: {
        min: 8,
        max: 128,
      },
      errorMessage: "Password must be between 8 and 128 characters",
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
