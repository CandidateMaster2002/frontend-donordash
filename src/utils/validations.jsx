export const validations = {
  name: {
    validation: {
      required: true,
      errorMessages: {
        required: "Please enter your legal name",
      },
    },
  },
  mobileNumber: {
    validation: {
      required: true,
      pattern: /^[0-9]{10}$/,
      errorMessages: {
        required: "Please enter your whatsApp number",
        pattern: "WhatsApp number must be exactly 10 digits",
      },
    },
  },
  email: {
    validation: {
      required: false,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      errorMessages: {
        // required: "Please enter your email address",
        pattern: "Please enter a valid email address",
      },
    },
  },
  address: {
    validation: {
      required: true,
      errorMessages: {
        required: "Please enter your full postal address",
      },
    },
  },
  city: {
    validation: {
      required: true,
      errorMessages: {
        required: "Please select your city",
      },
    },
  },
  state: {
    validation: {
      required: true,
      errorMessages: {
        required: "Please select your state",
      },
    },
  },
  pincode: {
    validation: {
      required: true,
      pattern: /^[0-9]{6}$/,
      errorMessages: {
        required: "Please enter your pincode",
        pattern: "Pincode must be exactly 6 digits",
      },
    },
  },
  panNumber: {
    validation: {
      required: false,
      pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      errorMessages: {
        pattern: "Please enter a valid PAN number",
      },
    },
  },
  donorCultivatorId: {
    validation: {
      required: true,
      errorMessages: {
        required: "Please select who you are connected to",
      },
    },
  },
  zone: {
    validation: {
      required: false,
      errorMessages: {},
    },
  },
  password: {
    validation: {
      required: true,
      // minLength: 8,
      errorMessages: {
        required: "Please enter your password",
        // minLength: "Password must be at least 8 characters long",
      },
    },
  },
  confirmPassword: {
    validation: {
      required: true,
      validate: (value, context) => value === context.password,
      errorMessages: {
        required: "Please confirm your password",
        validate: "Passwords do not match",
      },
    },
  },
  wantPrasadam: {
    validation: {
      required: false,
      errorMessages: {},
    },
  },
  specialDays: {
    validation: {
      required: false,
      errorMessages: {},
    },
  },
  paymentMode: {
    validation: {
      required: true,
      errorMessages: {
        required: "Please select a payment method",
      },
    },
  },
};
