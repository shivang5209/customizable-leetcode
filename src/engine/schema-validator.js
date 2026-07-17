// Helper to validate and normalize JSON import data

export function validateProblemJSON(jsonString) {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (err) {
    return {
      isValid: false,
      error: `Invalid JSON syntax: ${err.message}`
    };
  }

  const errors = [];

  // Required top-level fields
  const requiredFields = ['title', 'difficulty', 'description', 'examples', 'constraints', 'function_signature', 'test_cases'];
  
  requiredFields.forEach(field => {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`Missing required field: "${field}"`);
    }
  });

  if (errors.length > 0) {
    return { isValid: false, errors, data };
  }

  // Type validation
  if (typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('"title" must be a non-empty string');
  }

  if (typeof data.difficulty !== 'string') {
    errors.push('"difficulty" must be a string (e.g., "Easy", "Medium", "Hard")');
  }

  if (typeof data.description !== 'string' || !data.description.trim()) {
    errors.push('"description" must be a non-empty string');
  }

  if (!Array.isArray(data.examples)) {
    errors.push('"examples" must be an array');
  } else {
    data.examples.forEach((example, idx) => {
      if (!example.input || !example.output) {
        errors.push(`Example at index ${idx} must contain "input" and "output" strings`);
      }
    });
  }

  if (!Array.isArray(data.constraints)) {
    errors.push('"constraints" must be an array of strings');
  }

  // Validate function signature
  const sig = data.function_signature;
  if (sig && typeof sig === 'object') {
    if (typeof sig.name !== 'string' || !sig.name.trim()) {
      errors.push('"function_signature.name" must be a non-empty string representing the function name');
    }
    if (!Array.isArray(sig.parameters)) {
      errors.push('"function_signature.parameters" must be an array of parameter objects');
    } else {
      sig.parameters.forEach((param, idx) => {
        if (typeof param.name !== 'string' || typeof param.type !== 'string') {
          errors.push(`Parameter at index ${idx} must have "name" and "type" properties`);
        }
      });
    }
    if (typeof sig.return_type !== 'string') {
      errors.push('"function_signature.return_type" must be a string (e.g., "int", "void", "string")');
    }
  } else {
    errors.push('"function_signature" must be an object with name, parameters, and return_type');
  }

  // Validate test cases
  if (!Array.isArray(data.test_cases) || data.test_cases.length === 0) {
    errors.push('"test_cases" must be a non-empty array');
  } else {
    data.test_cases.forEach((tc, idx) => {
      if (tc.input === undefined || tc.expected_output === undefined) {
        errors.push(`Test case at index ${idx} must contain "input" and "expected_output"`);
      }
    });
  }

  // Optional normalizing: topics should be an array
  if (data.topics && !Array.isArray(data.topics)) {
    data.topics = [data.topics];
  } else if (!data.topics) {
    data.topics = [];
  }

  return {
    isValid: errors.length === 0,
    errors,
    data
  };
}
