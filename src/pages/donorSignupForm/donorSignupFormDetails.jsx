export const donorSignupFormDetails = {
    legalName: {
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
          required: "Please enter your mobile number",
          pattern: "Mobile number must be exactly 10 digits",
        },
      },
    },
    email: {
      validation: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        errorMessages: {
          required: "Please enter your email address",
          pattern: "Please enter a valid email address",
        },
      },
    },
    fullPostalAddress: {
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
    connectedTo: {
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
      panNumber:{
        validation:{
          required: false,
          pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
          errorMessages:{
            pattern: "Please enter a valid PAN number",
          },
        },
      }
    },
  };