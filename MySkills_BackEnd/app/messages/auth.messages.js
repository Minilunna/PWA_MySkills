module.exports = {
    userRegistrationSuccess: { message: "User was registered successfully!" },
    userNotFound: { message: "User Not found." },
    invalidPassword: { message: "Invalid Password!" },
    signoutSuccess: { message: "You've been signed out!" },
    noTokenProvided: { message: "No token provided!" },
    unauthorized: { message: "Unauthorized!" },
    
    roleRequired: (role) => ({ message: `The Role '${role}' is Required!` })
};