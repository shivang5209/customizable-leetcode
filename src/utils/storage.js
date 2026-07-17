// Local storage utility for managing problems and submissions

const PROBLEMS_KEY = 'custom_leetcode_problems';
const SUBMISSIONS_KEY = 'custom_leetcode_submissions';

export function getProblems() {
  try {
    const data = localStorage.getItem(PROBLEMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse problems from localStorage', e);
    return [];
  }
}

export function saveProblem(problem) {
  try {
    const problems = getProblems();
    
    // Generate a unique ID if it doesn't exist
    if (!problem.id) {
      problem.id = 'prob_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    // Add created timestamp
    if (!problem.createdAt) {
      problem.createdAt = new Date().toISOString();
    }
    
    // Update or insert
    const index = problems.findIndex(p => p.id === problem.id);
    if (index >= 0) {
      problems[index] = problem;
    } else {
      problems.push(problem);
    }
    
    localStorage.setItem(PROBLEMS_KEY, JSON.stringify(problems));
    return problem.id;
  } catch (e) {
    console.error('Failed to save problem to localStorage', e);
    throw new Error('Failed to save problem');
  }
}

export function getProblem(id) {
  const problems = getProblems();
  return problems.find(p => p.id === id) || null;
}

export function deleteProblem(id) {
  try {
    const problems = getProblems();
    const filtered = problems.filter(p => p.id !== id);
    localStorage.setItem(PROBLEMS_KEY, JSON.stringify(filtered));
    
    // Also clean up submission for this problem
    deleteSubmission(id);
    return true;
  } catch (e) {
    console.error('Failed to delete problem', e);
    return false;
  }
}

export function getSubmissions() {
  try {
    const data = localStorage.getItem(SUBMISSIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Failed to parse submissions', e);
    return {};
  }
}

export function saveSubmission(problemId, submission) {
  try {
    const submissions = getSubmissions();
    submissions[problemId] = {
      ...submissions[problemId],
      ...submission,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.error('Failed to save submission', e);
  }
}

export function getSubmission(problemId) {
  const submissions = getSubmissions();
  return submissions[problemId] || null;
}

export function deleteSubmission(problemId) {
  try {
    const submissions = getSubmissions();
    if (submissions[problemId]) {
      delete submissions[problemId];
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
    }
  } catch (e) {
    console.error('Failed to delete submission', e);
  }
}
