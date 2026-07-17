// Database of LeetCode-style prerequisite sub-challenges for BCSL404 Lab Prep

export const PREREQ_CHALLENGES = {
  kruskal: {
    id: 'kruskal_dsu',
    title: 'Disjoint Set Union (DSU)',
    description: `
Implement the core helper functions for the **Disjoint Set Union (DSU)** data structure:
1. \`find(p, v)\`: Finds the root representative node of element \`v\` by recursively traversing the parent array \`p\`.
2. \`union1(p, i, j)\`: Links element \`j\` to element \`i\` by setting \`p[j] = i\`.

### Parameters:
- \`p\`: Parent array, where \`p[v]\` is the parent of vertex \`v\` (1-indexed).
- \`v\`: Vertex index to find.
- \`i\`, \`j\`: Vertices to union.

### Expected Output:
- \`find\` should return the root representative index (integer).
- \`union1\` should modify the parent array in-place.
`,
    boilerplate: `/**
 * @param {number[]} p - Parent array
 * @param {number} v - Vertex index
 * @return {number}
 */
function find(p, v) {
    while (p[v] > 0) {
        v = p[v];
    }
    return v;
}

/**
 * @param {number[]} p - Parent array
 * @param {number} i
 * @param {number} j
 */
function union1(p, i, j) {
    // Write your DSU union logic here
    p[j] = i;
}

// Wrapper for testing
function runTest(parentArray, actions) {
    // actions: array of { type: 'find', val: 3 } or { type: 'union', u: 1, v: 2 }
    const results = [];
    actions.forEach(act => {
        if (act.type === 'find') {
            results.push(find(parentArray, act.val));
        } else if (act.type === 'union') {
            union1(parentArray, act.u, act.v);
            results.push([...parentArray]);
        }
    });
    return results;
}
`,
    functionSignature: {
      name: 'runTest',
      parameters: [
        { name: 'parentArray', type: 'int[]' },
        { name: 'actions', type: 'object[]' }
      ],
      return_type: 'any[]'
    },
    testCases: [
      {
        input: {
          parentArray: [0, 0, 0, 0, 0, 0],
          actions: [
            { type: 'find', val: 3 },
            { type: 'union', u: 1, v: 3 },
            { type: 'find', val: 3 }
          ]
        },
        expected_output: [3, [0, 0, 0, 1, 0, 0], 1]
      }
    ]
  },
  prim: {
    id: 'prim_min_key',
    title: 'Find Minimum Unvisited Distance Node',
    description: `
In Prim's algorithm, we look for the next vertex to add to the spanning tree. Given an array of distances and an array of visited status, return the index of the unvisited vertex with the minimum distance.

### Parameters:
- \`d\`: Distance array (1-indexed).
- \`v\`: Visited status array (\`1\` if visited, \`0\` if unvisited).
- \`n\`: Number of vertices.

### Expected Output:
- Return the integer index of the chosen vertex. If all vertices are visited or unreachable (infinity \`999\`), return \`-1\`.
`,
    boilerplate: `/**
 * @param {number[]} d - Distance array
 * @param {number[]} v - Visited status array
 * @param {number} n - Number of nodes
 * @return {number}
 */
function findMinNode(d, v, n) {
    let min = 999;
    let u = -1;
    
    // Write your minimum vertex search logic here
    
    return u;
}
`,
    functionSignature: {
      name: 'findMinNode',
      parameters: [
        { name: 'd', type: 'int[]' },
        { name: 'v', type: 'int[]' },
        { name: 'n', type: 'int' }
      ],
      return_type: 'int'
    },
    testCases: [
      {
        input: {
          d: [0, 12, 5, 999, 2],
          v: [0, 0, 0, 0, 0],
          n: 4
        },
        expected_output: 4
      },
      {
        input: {
          d: [0, 12, 5, 999, 2],
          v: [0, 0, 0, 0, 1],
          n: 4
        },
        expected_output: 2
      }
    ]
  },
  floyd: {
    id: 'floyd_dp_step',
    title: 'Floyd\'s DP Step Update',
    description: `
Implement a single step update of Floyd's All-Pairs Shortest Path algorithm. Given a 2D distance matrix \`p\` and an intermediate vertex \`k\`, update the distance between all pairs \`i\` and \`j\`.

Formula:
\`p[i][j] = min(p[i][j], p[i][k] + p[k][j])\`

### Parameters:
- \`p\`: 2D distance matrix (0-indexed).
- \`k\`: Intermediate node index.
- \`n\`: Number of vertices.

### Expected Output:
- Modify \`p\` in place and return it.
`,
    boilerplate: `/**
 * @param {number[][]} p - Distance matrix
 * @param {number} k - Intermediate vertex index
 * @param {number} n - Number of vertices
 * @return {number[][]}
 */
function floydStep(p, k, n) {
    // Write your nested loop matrix update here
    
    return p;
}
`,
    functionSignature: {
      name: 'floydStep',
      parameters: [
        { name: 'p', type: 'int[][]' },
        { name: 'k', type: 'int' },
        { name: 'n', type: 'int' }
      ],
      return_type: 'int[][]'
    },
    testCases: [
      {
        input: {
          p: [
            [0, 999, 3],
            [2, 0, 999],
            [999, 7, 0]
          ],
          k: 2, // intermediate vertex is index 2 (third node)
          n: 3
        },
        expected_output: [
          [0, 10, 3],
          [2, 0, 5],
          [999, 7, 0]
        ]
      }
    ]
  },
  warshall: {
    id: 'warshall_step',
    title: 'Warshall\'s Logical Transitive Update',
    description: `
Implement a single step update of Warshall\'s Transitive Closure algorithm. Given a 2D boolean reachability matrix \`p\` and an intermediate vertex \`k\`, update the reachability between all pairs \`i\` and \`j\`.

Formula:
\`p[i][j] = p[i][j] || (p[i][k] && p[k][j])\`

### Parameters:
- \`p\`: 2D connectivity matrix (0-indexed).
- \`k\`: Intermediate node index.
- \`n\`: Number of vertices.

### Expected Output:
- Modify \`p\` in place and return it.
`,
    boilerplate: `/**
 * @param {number[][]} p - Reachability matrix (0 or 1)
 * @param {number} k - Intermediate vertex index
 * @param {number} n - Number of vertices
 * @return {number[][]}
 */
function warshallStep(p, k, n) {
    // Write your nested loops logic here
    
    return p;
}
`,
    functionSignature: {
      name: 'warshallStep',
      parameters: [
        { name: 'p', type: 'int[][]' },
        { name: 'k', type: 'int' },
        { name: 'n', type: 'int' }
      ],
      return_type: 'int[][]'
    },
    testCases: [
      {
        input: {
          p: [
            [0, 1, 0],
            [0, 0, 1],
            [0, 0, 0]
          ],
          k: 1, // intermediate is index 1
          n: 3
        },
        expected_output: [
          [0, 1, 1],
          [0, 0, 1],
          [0, 0, 0]
        ]
      }
    ]
  },
  dijkstra: {
    id: 'dijkstra_relax',
    title: 'Relax Neighbor Edge Distances',
    description: `
In Dijkstra's algorithm, once we select the minimum distance node \`u\`, we relax the edge weights of its unvisited neighbors. Update the distance array \`d\` if traveling through \`u\` provides a shorter path.

Formula:
If \`v[j] == 0 && (d[u] + c[u][j]) < d[j]\`, update \`d[j] = d[u] + c[u][j]\`.

### Parameters:
- \`c\`: 2D cost adjacency matrix.
- \`d\`: Current distance array.
- \`v\`: Visited array.
- \`u\`: Index of vertex being processed.
- \`n\`: Number of nodes.

### Expected Output:
- Modify \`d\` in place and return it.
`,
    boilerplate: `/**
 * @param {number[][]} c - Cost matrix
 * @param {number[]} d - Distance array
 * @param {number[]} v - Visited array
 * @param {number} u - Processing node
 * @param {number} n - Total nodes
 * @return {number[]}
 */
function relaxNeighbors(c, d, v, u, n) {
    // Write your relaxation loop here
    
    return d;
}
`,
    functionSignature: {
      name: 'relaxNeighbors',
      parameters: [
        { name: 'c', type: 'int[][]' },
        { name: 'd', type: 'int[]' },
        { name: 'v', type: 'int[]' },
        { name: 'u', type: 'int' },
        { name: 'n', type: 'int' }
      ],
      return_type: 'int[]'
    },
    testCases: [
      {
        input: {
          c: [
            [0, 0, 0, 0],
            [0, 0, 10, 2],
            [0, 10, 0, 999],
            [0, 2, 999, 0]
          ],
          d: [0, 0, 10, 2],
          v: [0, 1, 0, 0],
          u: 3, // node 3 is visited now
          n: 3
        },
        expected_output: [0, 0, 10, 2] // since no shorter path to node 2 exists via node 3
      }
    ]
  },
  topo: {
    id: 'topo_indegree',
    title: 'Calculate Vertices In-Degree',
    description: `
Topological sorting using Kahn's algorithm relies on in-degrees of nodes. Given a 2D adjacency matrix representing a digraph, compute the in-degrees for each vertex (1-indexed).

### Parameters:
- \`a\`: 2D adjacency matrix (1-indexed, size n+1 x n+1).
- \`n\`: Number of vertices.

### Expected Output:
- Return the in-degree array where index \`i\` holds the in-degree of vertex \`i\`. Note that index 0 is ignored.
`,
    boilerplate: `/**
 * @param {number[][]} a - Adjacency matrix
 * @param {number} n - Number of vertices
 * @return {number[]}
 */
function getInDegrees(a, n) {
    const id = new Array(n + 1).fill(0);
    
    // Write your loop to count incoming edges for each node here
    
    return id;
}
`,
    functionSignature: {
      name: 'getInDegrees',
      parameters: [
        { name: 'a', type: 'int[][]' },
        { name: 'n', type: 'int' }
      ],
      return_type: 'int[]'
    },
    testCases: [
      {
        input: {
          a: [
            [0, 0, 0, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 1],
            [0, 0, 0, 0]
          ],
          n: 3
        },
        expected_output: [0, 0, 1, 2]
      }
    ]
  },
  'knapsack-dp': {
    id: 'knap_decision',
    title: 'DP Knapsack Recursive Decision',
    description: `
Implement the recursive choice logic for 0/1 Knapsack.
For item \`i\`, with weight \`w[i]\` and profit \`p[i]\`:
- If weight exceeds current capacity \`m\`: skip the item.
- Else: return the maximum profit between *skipping* the item and *taking* the item.

### Parameters:
- \`w\`: Weights array (1-indexed).
- \`p\`: Profits array (1-indexed).
- \`i\`: Current item index.
- \`m\`: Remaining capacity.
- \`n\`: Total number of items.

### Expected Output:
- Return the maximum profit value (integer).
`,
    boilerplate: `/**
 * @param {number[]} w - Weights
 * @param {number[]} p - Profits
 * @param {number} i - Current item index
 * @param {number} m - Remaining capacity
 * @param {number} n - Total items
 * @return {number}
 */
function knapRecursive(w, p, i, m, n) {
    // Base Case
    if (i > n) return 0;
    
    // Write recursion choices here
    
}
`,
    functionSignature: {
      name: 'knapRecursive',
      parameters: [
        { name: 'w', type: 'int[]' },
        { name: 'p', type: 'int[]' },
        { name: 'i', type: 'int' },
        { name: 'm', type: 'int' },
        { name: 'n', type: 'int' }
      ],
      return_type: 'int'
    },
    testCases: [
      {
        input: {
          w: [0, 3, 5, 2, 3],
          p: [0, 12, 43, 45, 55],
          i: 1,
          m: 5,
          n: 4
        },
        expected_output: 100 // By picking items 3 (weight 2) and 4 (weight 3) -> profit 45+55 = 100
      }
    ]
  },
  'knapsack-greedy': {
    id: 'knap_greedy_sort',
    title: 'Sort Objects by Value Ratio',
    description: `
In Greedy Knapsack, we want to prioritize items with high profit-to-weight density. Sort the array indexes by their value ratio in descending order.

### Parameters:
- \`w\`: Weights array.
- \`p\`: Profits array.
- \`n\`: Number of items.

### Expected Output:
- Return an array of sorted indices. E.g. if item 2 has the highest density, its index should appear first in the returned array.
`,
    boilerplate: `/**
 * @param {number[]} w - Weights
 * @param {number[]} p - Profits
 * @param {number} n - Number of items
 * @return {number[]}
 */
function sortByRatio(w, p, n) {
    const indices = [];
    for (let i = 0; i < n; i++) indices.push(i);
    
    // Sort indices by profit[i]/weight[i] ratio descending
    
    return indices;
}
`,
    functionSignature: {
      name: 'sortByRatio',
      parameters: [
        { name: 'w', type: 'int[]' },
        { name: 'p', type: 'int[]' },
        { name: 'n', type: 'int' }
      ],
      return_type: 'int[]'
    },
    testCases: [
      {
        input: {
          w: [56, 78, 98, 78],
          p: [23, 45, 76, 78],
          n: 4
        },
        expected_output: [3, 2, 1, 0] // ratios: 78/78=1.0, 76/98=0.77, 45/78=0.57, 23/56=0.41
      }
    ]
  },
  'subset-sum': {
    id: 'subset_sum_decision',
    title: 'Subset Sum Target Check',
    description: `
Implement a basic recursion function that determines if there exists a subset of positive integers whose sum equals exactly \`d\`.

### Parameters:
- \`s\`: Set of numbers (array).
- \`idx\`: Current index being processed.
- \`currentSum\`: Accumulation sum so far.
- \`d\`: Target sum.

### Expected Output:
- Return boolean \`true\` if a subset exists, otherwise \`false\`.
`,
    boilerplate: `/**
 * @param {number[]} s - The set
 * @param {number} idx - Current index
 * @param {number} currentSum - Sum so far
 * @param {number} d - Target sum
 * @return {boolean}
 */
function hasSubsetSum(s, idx, currentSum, d) {
    if (currentSum === d) return true;
    if (idx >= s.length || currentSum > d) return false;
    
    // Write inclusion/exclusion recursion branch here
    
}
`,
    functionSignature: {
      name: 'hasSubsetSum',
      parameters: [
        { name: 's', type: 'int[]' },
        { name: 'idx', type: 'int' },
        { name: 'currentSum', type: 'int' },
        { name: 'd', type: 'int' }
      ],
      return_type: 'bool'
    },
    testCases: [
      {
        input: {
          s: [1, 2, 5],
          idx: 0,
          currentSum: 0,
          d: 7
        },
        expected_output: true // subset [2, 5] sums to 7
      },
      {
        input: {
          s: [1, 2, 5],
          idx: 0,
          currentSum: 0,
          d: 4
        },
        expected_output: false
      }
    ]
  },
  'selection-sort': {
    id: 'select_min_idx',
    title: 'Find Minimum Element Index',
    description: `
In Selection Sort, we search the unsorted subarray to find the smallest element. Write a function that returns the index of the minimum element within a range \`[start, n-1]\` of an array.

### Parameters:
- \`arr\`: Array of numbers.
- \`start\`: Index to start searching from.
- \`n\`: Length of array.

### Expected Output:
- Return the integer index of the smallest element in the subarray.
`,
    boilerplate: `/**
 * @param {number[]} arr - Array
 * @param {number} start - Start search index
 * @param {number} n - Length of array
 * @return {number}
 */
function findMinIndex(arr, start, n) {
    let minIdx = start;
    
    // Write loop here to find minimum element index
    
    return minIdx;
}
`,
    functionSignature: {
      name: 'findMinIndex',
      parameters: [
        { name: 'arr', type: 'int[]' },
        { name: 'start', type: 'int' },
        { name: 'n', type: 'int' }
      ],
      return_type: 'int'
    },
    testCases: [
      {
        input: {
          arr: [5, 2, 9, 1, 6],
          start: 1,
          n: 5
        },
        expected_output: 3 // smallest from index 1 is '1' at index 3
      }
    ]
  },
  'quick-sort': {
    id: 'quick_partition',
    title: 'Quick Sort Array Partition',
    description: `
Implement the partition step of Quick Sort. Choose the last element of the array (\`arr[high]\`) as the pivot. Align all elements smaller than the pivot to its left and larger to its right, then place pivot in its final sorted index.

### Parameters:
- \`arr\`: Array of numbers.
- \`low\`: Start index of partition.
- \`high\`: End index of partition (holds the pivot).

### Expected Output:
- Modify \`arr\` in place.
- Return the final sorted index of the pivot.
`,
    boilerplate: `/**
 * @param {number[]} arr - Array
 * @param {number} low - Start index
 * @param {number} high - End index (pivot)
 * @return {number} - Pivot final index
 */
function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    // Write partition swap loops here
    
    return i + 1;
}
`,
    functionSignature: {
      name: 'partition',
      parameters: [
        { name: 'arr', type: 'int[]' },
        { name: 'low', type: 'int' },
        { name: 'high', type: 'int' }
      ],
      return_type: 'int'
    },
    testCases: [
      {
        input: {
          arr: [10, 80, 30, 90, 40, 50, 70],
          low: 0,
          high: 6
        },
        expected_output: 4 // pivot is 70. Array becomes [10, 30, 40, 50, 70, 90, 80], pivot index is 4.
      }
    ]
  },
  'merge-sort': {
    id: 'merge_arrays',
    title: 'Merge Two Sorted Arrays',
    description: `
In Merge Sort, once we divide and sort the subarrays, we merge them. Given two sorted arrays \`A\` and \`B\`, merge them into a single sorted array.

### Parameters:
- \`A\`: Sorted array of integers.
- \`B\`: Sorted array of integers.

### Expected Output:
- Return the combined sorted array.
`,
    boilerplate: `/**
 * @param {number[]} A - Sorted array
 * @param {number[]} B - Sorted array
 * @return {number[]}
 */
function merge(A, B) {
    const result = [];
    let i = 0;
    let j = 0;
    
    // Write merge pointer loop here
    
    return result;
}
`,
    functionSignature: {
      name: 'merge',
      parameters: [
        { name: 'A', type: 'int[]' },
        { name: 'B', type: 'int[]' }
      ],
      return_type: 'int[]'
    },
    testCases: [
      {
        input: {
          A: [1, 5, 8],
          B: [2, 4, 9, 10]
        },
        expected_output: [1, 2, 4, 5, 8, 9, 10]
      }
    ]
  },
  nqueens: {
    id: 'nqueens_safe',
    title: 'Chess Board Safety Check',
    description: `
In the N-Queens backtracking solver, before placing a queen at \`board[row][col]\`, we must check if that cell is safe from attacks. Since queens are placed column-by-column, we only need to check the left side of the board:
1. Current row on left: \`board[row][i]\` for \`i < col\`.
2. Upper left diagonal: \`row - i, col - i\`.
3. Lower left diagonal: \`row + i, col - i\`.

### Parameters:
- \`board\`: 2D binary grid (\`1\` represents a queen, \`0\` represents empty).
- \`row\`, \`col\`: Coordinates of target placement.
- \`n\`: Dimension of the square board.

### Expected Output:
- Return boolean \`true\` if it is safe to place a queen, otherwise \`false\`.
`,
    boilerplate: `/**
 * @param {number[][]} board - Square chess grid
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {number} n - Board dimension
 * @return {boolean}
 */
function isSafe(board, row, col, n) {
    // Write left side safety checks here
    
    return true;
}
`,
    functionSignature: {
      name: 'isSafe',
      parameters: [
        { name: 'board', type: 'int[][]' },
        { name: 'row', type: 'int' },
        { name: 'col', type: 'int' },
        { name: 'n', type: 'int' }
      ],
      return_type: 'bool'
    },
    testCases: [
      {
        input: {
          board: [
            [0, 1, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
          ],
          row: 1,
          col: 2,
          n: 4
        },
        expected_output: false // attacked by queen at board[0][1] (diagonal check)
      },
      {
        input: {
          board: [
            [0, 1, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
          ],
          row: 2,
          col: 0,
          n: 4
        },
        expected_output: true
      }
    ]
  }
};
