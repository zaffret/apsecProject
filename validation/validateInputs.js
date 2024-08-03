const isNotString = (input, name) => {
  if (typeof input !== "string" || input.trim() === "") {
    return "Invalid " + name;
  }
  return null;
};

const isNotNumber = (input, name) => {
  if (
    typeof input !== "number" ||
    isNaN(input) ||
    Number.isInteger(input) === false
  ) {
    return "Invalid " + name;
  }
  return null;
};

const isNotEmail = (input) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!input) {
    return "Email is required";
  }

  if (!emailRegex.test(input)) {
    return "Invalid email format";
  }
  return null;
};

const isNotPsw = (input) => {
  const pswRegex =
    /(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  if (!input) {
    return "Password is required";
  }

  if (!pswRegex.test(input)) {
    return "Invalid password format";
  }

  return null;
};

const isNotURL = (url) => {
  try {
    new URL(url);
  } catch (err) {
    return "Invalid URL";
  }
  return null;
};

module.exports = {
  isNotString,
  isNotNumber,
  isNotEmail,
  isNotURL,
  isNotPsw,
};
