function Validation(values) {
  let error = {};

  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern = /^.{8,}$/;

  // PATIENT NAME
  if (values.name !== undefined) {
    if (!values.name.trim()) error.name = "Name cannot be empty";
    else error.name = "";
  }

  // DOCTOR FULL NAME
  if (values.fullName !== undefined) {
    if (!values.fullName.trim()) error.fullName = "Full Name cannot be empty";
    else error.fullName = "";
  }

  // EMAIL
  if (!values.email.trim()) {
    error.email = "Email cannot be empty";
  } 
  else if (!email_pattern.test(values.email)) {
    error.email = "Invalid email format";
  }
  else {
    error.email = "";
  }

  // PASSWORD
  if (!values.password.trim()) {
    error.password = "Password cannot be empty";
  }
  else if (!password_pattern.test(values.password)) {
    error.password = "Minimum password length is 8";
  }
  else {
    error.password = "";
  }

  return error;
}

export default Validation;
