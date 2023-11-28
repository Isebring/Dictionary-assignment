export const validateInput = (input: string) => {
    let errors = {};
  
    if (!input.trim()) {
      errors = { ...errors, empty: 'Please enter a word!' };
    } else if (!/^[\w\s]+$/.test(input)) {
      errors = { ...errors, specialChars: 'Input contains special characters!' };
    }
  
    return errors;
  };