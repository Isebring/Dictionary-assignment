
/**
 * Validates that the input string is non-empty and contains only word characters or whitespace.
 * @param input - The input string to validate.
 * @return An object containing error messages for each failed validation rule.
 */
export const validateInput = (input: string) => {
  let errors = {};

  if (!input.trim()) {
    errors = { ...errors, empty: 'Please enter a word!' };
  } else if (!/^[a-zA-Z\s-]+$/.test(input)) {
    errors = { ...errors, specialChars: 'Input contains invalid characters!' };
  }

  return errors;
};