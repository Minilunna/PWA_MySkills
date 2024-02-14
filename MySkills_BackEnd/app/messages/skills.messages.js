module.exports = {
    skillCreationSuccess: { message: "Skill created successfully" },
    skillNotFound: { message: "Skill not found" },
    skillUpdateSuccess: { message: "Skill updated successfully" },
    skillDeleteSuccess: { message: "Skill deleted successfully" },
    serverError: (err) => ({ message: err.message })
  };