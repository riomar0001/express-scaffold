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
  first_name: {
    notEmpty: {
      errorMessage: "First name cannot be empty",
    },
    isLength: {
      options: {
        min: 2,
      },
      errorMessage: "First name must be at least 2 characters",
    },
  },
  last_name: {
    notEmpty: {
      errorMessage: "Last name cannot be empty",
    },
    isLength: {
      options: {
        min: 2,
      },
      errorMessage: "Last name must be at least 2 characters",
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
  confirm_password: {
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
