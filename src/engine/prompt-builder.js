// Utility to build LLM prompts for generating coding challenges

export function buildPrompt({ topics, difficulty, language, customDetails }) {
  const topicsList = topics && topics.length > 0 ? topics.join(', ') : 'Any data structures/algorithms topics';
  const selectedLang = language || 'JavaScript';
  
  const jsonSchemaExample = {
    title: "Problem Name",
    difficulty: difficulty || "Medium",
    topics: topics || ["Arrays"],
    description: "Detailed problem description. Support basic Markdown, e.g. code blocks, bullet points, headers.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9"
    ],
    function_signature: {
      name: "twoSum",
      parameters: [
        { name: "nums", type: "int[]" },
        { name: "target", type: "int" }
      ],
      return_type: "int[]"
    },
    test_cases: [
      {
        input: { nums: [2,7,11,15], target: 9 },
        expected_output: [0, 1]
      },
      {
        input: { nums: [3,2,4], target: 6 },
        expected_output: [1, 2]
      },
      {
        input: { nums: [3,3], target: 6 },
        expected_output: [0, 1]
      }
    ],
    hints: [
      "Try using a hash map to look up targets.",
      "Is it possible to solve in O(n) time?"
    ],
    time_complexity: "O(n)",
    space_complexity: "O(n)"
  };

  let prompt = `Act as an expert computer science professor and competitive programmer.
I want you to generate a new, custom, high-quality coding practice problem that fits these specifications:
- **Topics**: ${topicsList}
- **Difficulty**: ${difficulty}
- **Primary Programming Language**: ${selectedLang}
${customDetails ? `- **Custom instructions/rules**: ${customDetails}\n` : ''}
The question must NOT be a direct duplicate of existing LeetCode or HackerRank questions, but should feel like a premium question you would encounter in a high-profile coding interview. Ensure the question covers the specified concepts deeply, checks edge cases, and provides robust examples.

### RESPONSE FORMAT
You must respond ONLY with a raw JSON block. Do not wrap the JSON in Markdown backticks (e.g. do NOT use \`\`\`json). Do not add any text before or after the JSON.
Your JSON must strictly adhere to the following schema:

${JSON.stringify(jsonSchemaExample, null, 2)}

### CRITICAL REQUIREMENTS FOR THE JSON:
1. **function_signature**: The parameter types and names should match the language conventions. The parameter names in \`function_signature.parameters\` MUST correspond EXACTLY to the keys in the \`test_cases[].input\` object. For example, if you have a parameter named \`nums\`, each test case input must contain a \`nums\` key.
2. **test_cases**: Provide 3 to 6 test cases. At least one must test an edge case (empty array, negative numbers, extreme inputs, etc.). The inputs must be valid JSON values representing the parameters. The expected output must be the literal return value of the function.
3. **No extra text**: Make sure your output is purely parseable JSON so I can paste it directly into my compiler tool. Any explanation should go into the "explanation" field of the examples or the "description" field.`;

  return prompt;
}
