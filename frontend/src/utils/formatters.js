export const formatCurrency = (value) => {
  const amount = Number(value || 0);

  return `Rs. ${amount.toLocaleString("en-IN")}`;
};

export const splitSkills = (skills) => {
  if (!skills) {
    return [];
  }

  return String(skills)
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
};
