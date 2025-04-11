import { useState } from 'react';

export default function useForm(initial = {}) {
  const [inputs, setInputs] = useState(initial);

  function handleChange(e) {
    let { value, type, name } = e.target;

    // Handle number inputs
    // Parse string value from input to a number for insertion into the DB
    if (type === 'number') {
      value = parseFloat(value);
    }

    // Handle file inputs
    if (type === 'file') {
      [value] = e.target.files;
    }
    // Spread in existing state, and add our new input name and value
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.keys(inputs).map((key) => [key, ''])
    );

    setInputs(blankState);
  }

  // Return the things we want to surface from this custom hook
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
