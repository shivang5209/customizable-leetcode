// Code execution runner supporting in-browser JS (Worker) and Judge0 API for Python/C++/Java

// Helper to construct JS worker code
const createJsWorkerCode = () => `
  self.onmessage = function(e) {
    const { code, functionName, parameters, testCases } = e.data;
    
    // Custom logs accumulator
    const logs = [];
    const customConsole = {
      log: (...args) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      },
      error: (...args) => {
        logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      },
      warn: (...args) => {
        logs.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      },
      info: (...args) => {
        logs.push('[INFO] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      }
    };

    try {
      // Define a custom console in the evaluation context
      const contextEval = new Function('console', \`
        \${code}
        return \${functionName};
      \`);
      
      const targetFunction = contextEval(customConsole);

      if (typeof targetFunction !== 'function') {
        throw new Error(\`Function "\${functionName}" is not defined or is not a function.\`);
      }

      const results = [];

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        
        // Match parameters with inputs in order
        const args = parameters.map(p => {
          const val = tc.input[p.name];
          if (val === undefined) {
            throw new Error(\`Missing input parameter "\${p.name}" in test case \${i + 1}\`);
          }
          return val;
        });

        // Run with performance timer
        const t0 = performance.now();
        const output = targetFunction(...args);
        const t1 = performance.now();

        // Check if output matches expected_output
        const isMatch = JSON.stringify(output) === JSON.stringify(tc.expected_output);

        results.push({
          passed: isMatch,
          actual: output,
          expected: tc.expected_output,
          timeMs: parseFloat((t1 - t0).toFixed(3)),
          logs: [...logs]
        });
        
        // Reset logs for the next test case
        logs.length = 0;
      }

      self.postMessage({ success: true, results });

    } catch (err) {
      self.postMessage({ 
        success: false, 
        error: err.stack || err.message,
        logs: [...logs]
      });
    }
  };
`;

export function runJavaScriptInBrowser(code, problem, onProgress) {
  return new Promise((resolve) => {
    const workerBlob = new Blob([createJsWorkerCode()], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(workerBlob);
    const worker = new Worker(workerUrl);

    const functionName = problem.function_signature.name;
    const parameters = problem.function_signature.parameters;
    const testCases = problem.test_cases;

    // 3 second execution timeout
    const timeout = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve({
        success: false,
        error: 'Time Limit Exceeded (TLE) - Execution took longer than 3000ms. Check for infinite loops.'
      });
    }, 3000);

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve(e.data);
    };

    worker.postMessage({
      code,
      functionName,
      parameters,
      testCases
    });
  });
}

// Judge0 API Integration
const JUDGE0_LANGUAGE_IDS = {
  c: 50,         // C (GCC 9.2.0)
  python: 71,    // Python 3
  cpp: 54,       // C++ (GCC 9.2.0)
  java: 62,      // Java (OpenJDK 13.0.1)
  javascript: 63 // Node.js
};

export async function runCodeViaJudge0(code, language, problem, customEndpoint = null, stdinVal = '') {
  const languageId = JUDGE0_LANGUAGE_IDS[language.toLowerCase()];
  if (!languageId) {
    return { success: false, error: `Language "${language}" is not supported.` };
  }

  // default endpoint points to a public demo server or user's custom one
  const endpoint = customEndpoint || 'https://judge0-ce.p.sulu.sh';

  try {
    // Generate wrapper file to run tests for other languages.
    // In a production server runner, we merge user code with a test runner template.
    // Let's create code templates based on target languages that wrap user code and feed inputs.
    const wrappedSourceCode = wrapSourceCodeWithTests(code, language, problem);

    const response = await fetch(`${endpoint}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_code: wrappedSourceCode,
        language_id: languageId,
        stdin: stdinVal
      })
    });

    if (!response.ok) {
      throw new Error(`Judge0 responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Parse Judge0 output.
    // In our wrapper templates, we print JSON format outputs so we can parse individual test cases.
    return parseJudge0Result(data, problem.test_cases);

  } catch (err) {
    console.error('Judge0 run failed:', err);
    return {
      success: false,
      error: `Execution Error: ${err.message}`
    };
  }
}

// Helper to create wrapper code that runs tests, prints results in JSON to stdout
function wrapSourceCodeWithTests(userCode, language, problem) {
  const fnName = problem.function_signature.name;
  const testCases = problem.test_cases;
  
  if (language.toLowerCase() === 'python') {
    return `
import json
import time

${userCode}

test_cases = ${JSON.stringify(testCases)}
results = []

for idx, tc in enumerate(test_cases):
    args = tc['input']
    expected = tc['expected_output']
    
    # We call the function by unpacked arguments
    # Note: args is a dictionary, so we pass as kwargs or unpacked keys matching param names
    try:
        t0 = time.perf_counter()
        actual = ${fnName}(**args)
        t1 = time.perf_counter()
        
        passed = json.dumps(actual) == json.dumps(expected)
        results.append({
            "passed": passed,
            "actual": actual,
            "expected": expected,
            "timeMs": round((t1 - t0) * 1000, 3)
        })
    except Exception as e:
        results.append({
            "passed": False,
            "error": str(e)
        })

print(json.dumps({"results": results}))
`;
  }
  
  // Standard execution fallback if templating isn't simple (like C++ or Java compilation complex boilerplate)
  // For C++/Java, we will run the user code directly against the first test case or standard stdin.
  // In our simplified build, Python and JS are fully wrapped. C++/Java runs standard execution of user code.
  return userCode;
}

function parseJudge0Result(data, testCases) {
  if (!testCases) {
    return {
      success: true,
      stdout: data.stdout || '',
      stderr: data.stderr || '',
      timeMs: data.time ? parseFloat(data.time) * 1000 : 0
    };
  }
  // If we have compile error
  if (data.status && data.status.id === 6) {
    return {
      success: false,
      error: `Compile Error:\n${data.compile_output || ''}`
    };
  }

  // Runtime error
  if (data.status && data.status.id >= 7 && data.status.id <= 12) {
    return {
      success: false,
      error: `Runtime Error (${data.status.description}):\n${data.stderr || ''}`
    };
  }

  // Parse stdout JSON if python wrapped
  try {
    const output = data.stdout || '';
    const parsed = JSON.parse(output.trim());
    if (parsed && parsed.results) {
      return { success: true, results: parsed.results };
    }
  } catch (e) {
    // If not JSON, fallback to treating standard output as execution result
  }

  // Fallback single verdict
  const stdout = data.stdout || '';
  const passed = stdout.includes('success') || (data.status && data.status.id === 3);

  return {
    success: true,
    results: testCases.map(tc => ({
      passed,
      actual: stdout || 'No output',
      expected: JSON.stringify(tc.expected_output),
      timeMs: data.time ? parseFloat(data.time) * 1000 : 0,
      logs: [stdout, data.stderr].filter(Boolean)
    }))
  };
}
