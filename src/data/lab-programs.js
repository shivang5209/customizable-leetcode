// Database containing the 12 syllabus programs of Analysis and Design of Algorithms Lab (BCSL404)

export const LAB_PROGRAMS = [
  {
    id: 'kruskal',
    title: '1. Kruskal\'s Algorithm',
    problemStatement: 'Design and implement C/C++ Program to find Minimum Cost Spanning Tree of a given connected undirected graph using Kruskal\'s algorithm.',
    paradigm: 'Greedy Technique',
    difficulty: 'Medium',
    prerequisites: `
### Prerequisite Concepts for Kruskal's Algorithm:
1. **Adjacency Matrix Representation**:
   Graphs are represented as a 2D array \`c[MAX][MAX]\`, where \`c[i][j]\` stores the weight of the edge between vertex \`i\` and \`j\`. If there is no edge, it is marked as \`999\` (representing Infinity).
2. **Disjoint Set Union (DSU) / Union-Find**:
   To avoid cycles in the spanning tree, we keep track of connected components:
   - \`find(v)\`: Travels up the parent array \`p\` to find the root representative of vertex \`v\`.
   - \`union1(i, j)\`: Connects component \`j\` to component \`i\` by setting \`p[j] = i\`.
3. **Greedy Edge Selection**:
   In each step, we look for the edge with the absolute minimum cost (\`c[i][j] < min\`). We then check if the two endpoints belong to different components (\`u != v\`). If they are different, we select the edge and union the components.
`,
    code: `#include <stdio.h>
#define INF 999
#define MAX 100

int p[MAX], c[MAX][MAX], t[MAX][2];

int find(int v) {
    while (p[v])
        v = p[v];
    return v;
}

void union1(int i, int j) {
    p[j] = i;
}

void kruskal(int n) {
    int i, j, k, u, v, min, res1, res2, sum = 0;
    for (k = 1; k < n; k++) {
        min = INF;
        for (i = 1; i <= n; i++) {
            for (j = 1; j <= n; j++) {
                if (i == j) continue;
                if (c[i][j] < min) {
                    u = find(i);
                    v = find(j);
                    if (u != v) {
                        res1 = i;
                        res2 = j;
                        min = c[i][j];
                    }
                }
            }
        }
        union1(res1, find(res2));
        t[k][1] = res1;
        t[k][2] = res2;
        sum = sum + min;
    }
    printf("\\nCost of spanning tree is=%d", sum);
    printf("\\nEdges of spanning tree are:\\n");
    for (i = 1; i < n; i++)
        printf("%d -> %d\\n", t[i][1], t[i][2]);
}

int main() {
    int i, j, n;
    printf("\\nEnter the n value:");
    if (scanf("%d", &n) != 1) return 1;
    
    // Initialize parent array
    for (i = 1; i <= n; i++)
        p[i] = 0;
        
    printf("\\nEnter the graph data:\\n");
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= n; j++) {
            if (scanf("%d", &c[i][j]) != 1) return 1;
        }
    }
    kruskal(n);
    return 0;
}
`,
    sampleInput: `5
1 3 4 6 2
1 7 6 9 3
5 2 8 99 45
1 44 66 33 6
12 4 3 2 0`,
    sampleOutput: `Cost of spanning tree is=11
Edges of spanning tree are:
2 -> 1
1 -> 5
3 -> 2
1 -> 4`
  },
  {
    id: 'prim',
    title: '2. Prim\'s Algorithm',
    problemStatement: 'Design and implement C/C++ Program to find Minimum Cost Spanning Tree of a given connected undirected graph using Prim\'s algorithm.',
    paradigm: 'Greedy Technique',
    difficulty: 'Medium',
    prerequisites: `
### Prerequisite Concepts for Prim's Algorithm:
1. **Source Node Selection**:
   Prim's algorithm starts from an arbitrary source node \`s\` and expands the spanning tree edge-by-edge.
2. **Key helper arrays**:
   - \`v[10]\` (visited): \`1\` if the node is already part of the tree, else \`0\`.
   - \`d[10]\` (distance): Stores the minimum weight to connect each node to the growing tree.
   - \`ver[10]\` (parent representation): Stores which parent node connects node \`i\` to the tree.
3. **Relaxation / Tree Expansion**:
   In each of the \`n-1\` iterations:
   - Find the unvisited node \`u\` with the minimum distance (\`d[j]\`).
   - Add \`u\` to the tree (\`v[u] = 1\`).
   - For all unvisited neighbors \`j\`, if the edge \`c[u][j]\` is smaller than their current distance (\`d[j]\`), update \`d[j] = c[u][j]\` and point parent \`ver[j] = u\`.
`,
    code: `#include <stdio.h>
#define INF 999

int prim(int c[10][10], int n, int s) {
    int v[10], i, j, sum = 0, ver[10], d[10], min, u;
    for (i = 1; i <= n; i++) {
        ver[i] = s;
        d[i] = c[s][i];
        v[i] = 0;
    }
    v[s] = 1;
    for (i = 1; i <= n - 1; i++) {
        min = INF;
        for (j = 1; j <= n; j++) {
            if (v[j] == 0 && d[j] < min) {
                min = d[j];
                u = j;
            }
        }
        v[u] = 1;
        sum = sum + d[u];
        printf("\\n%d -> %d sum=%d", ver[u], u, sum);
        for (j = 1; j <= n; j++) {
            if (v[j] == 0 && c[u][j] < d[j]) {
                d[j] = c[u][j];
                ver[j] = u;
            }
        }
    }
    return sum;
}

int main() {
    int c[10][10], i, j, res, s, n;
    printf("\\nEnter n value:");
    if (scanf("%d", &n) != 1) return 1;
    printf("\\nEnter the graph data:\\n");
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= n; j++) {
            if (scanf("%d", &c[i][j]) != 1) return 1;
        }
    }
    printf("\\nEnter the source node:");
    if (scanf("%d", &s) != 1) return 1;
    res = prim(c, n, s);
    printf("\\nCost=%d\\n", res);
    return 0;
}
`,
    sampleInput: `4
4 5 2 1
7 5 9 2
1 7 6 9
0 2 8 5
4`,
    sampleOutput: `4 -> 1 sum=0
4 -> 2 sum=2
1 -> 3 sum=4
Cost=4`
  },
  {
    id: 'floyd',
    title: '3a. Floyd\'s Algorithm',
    problemStatement: 'Design and implement C/C++ Program to solve All-Pairs Shortest Paths problem using Floyd\'s algorithm.',
    paradigm: 'Dynamic Programming',
    difficulty: 'Easy',
    prerequisites: `
### Prerequisite Concepts for Floyd's Algorithm:
1. **All-Pairs Shortest Path**:
   Floyd's algorithm calculates the shortest path between *all* pairs of vertices.
2. **DP State / Distance Update**:
   Let \`p[i][j]\` be the weight matrix. At step \`k\`, we check if path from \`i\` to \`j\` passing through intermediate vertex \`k\` is shorter than the direct path \`p[i][j]\`:
   \`p[i][j] = min(p[i][j], p[i][k] + p[k][j])\`
3. **Triple Nested Loops**:
   Notice that the outer loop must be the intermediate vertex \`k\`:
   - \`k\` from 1 to \`n\` (intermediate node)
   - \`i\` from 1 to \`n\` (source node)
   - \`j\` from 1 to \`n\` (destination node)
`,
    code: `#include <stdio.h>
#define INF 999

int min(int a, int b) {
    return (a < b) ? a : b;
}

void floyd(int p[][10], int n) {
    int i, j, k;
    for (k = 1; k <= n; k++) {
        for (i = 1; i <= n; i++) {
            for (j = 1; j <= n; j++) {
                p[i][j] = min(p[i][j], p[i][k] + p[k][j]);
            }
        }
    }
}

int main() {
    int a[10][10], n, i, j;
    printf("\\nEnter the n value:");
    if (scanf("%d", &n) != 1) return 1;
    printf("\\nEnter the graph data:\\n");
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= n; j++) {
            if (scanf("%d", &a[i][j]) != 1) return 1;
        }
    }
    floyd(a, n);
    printf("\\nShortest path matrix:\\n");
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= n; j++) {
            printf("%d ", a[i][j]);
        }
        printf("\\n");
    }
    return 0;
}
`,
    sampleInput: `4
0 999 3 999
2 0 999 999
999 7 0 1
6 999 999 0`,
    sampleOutput: `Shortest path matrix
0 10 3 4 
2 0 5 6 
7 7 0 1 
6 16 9 0 `
  },
  {
    id: 'warshall',
    title: '3b. Warshall\'s Algorithm',
    problemStatement: 'Design and implement C/C++ Program to find the transitive closure using Warshall\'s algorithm.',
    paradigm: 'Dynamic Programming',
    difficulty: 'Easy',
    prerequisites: `
### Prerequisite Concepts for Warshall\'s Algorithm:
1. **Transitive Closure**:
   Determines if there is a path of *any* length from vertex \`i\` to \`j\`. The output is a boolean adjacency matrix where \`1\` means reachable and \`0\` means unreachable.
2. **Boolean DP Update**:
   We update connectivity using the logical OR (\`||\`) and logical AND (\`&&\`):
   \`p[i][j] = p[i][j] || (p[i][k] && p[k][j])\`
   Which reads: vertex \`i\` can reach \`j\` if it already can, OR if \`i\` can reach an intermediate vertex \`k\` AND \`k\` can reach \`j\`.
`,
    code: `#include <stdio.h>

void warsh(int p[][10], int n) {
    int i, j, k;
    for (k = 1; k <= n; k++) {
        for (i = 1; i <= n; i++) {
            for (j = 1; j <= n; j++) {
                p[i][j] = p[i][j] || (p[i][k] && p[k][j]);
            }
        }
    }
}

int main() {
    int a[10][10], n, i, j;
    printf("\\nEnter the n value:");
    if (scanf("%d", &n) != 1) return 1;
    printf("\\nEnter the graph data:\\n");
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= n; j++) {
            if (scanf("%d", &a[i][j]) != 1) return 1;
        }
    }
    warsh(a, n);
    printf("\\nResultant path matrix\\n");
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= n; j++) {
            printf("%d ", a[i][j]);
        }
        printf("\\n");
    }
    return 0;
}
`,
    sampleInput: `4
0 1 0 0
0 0 0 1
0 0 0 0
1 0 1 0`,
    sampleOutput: `Resultant path matrix
1 1 1 1 
1 1 1 1 
0 0 0 0 
1 1 1 1 `
  },
  {
    id: 'dijkstra',
    title: '4. Dijkstra\'s Algorithm',
    problemStatement: 'Design and implement C/C++ Program to find shortest paths from a given vertex in a weighted connected graph to other vertices using Dijkstra\'s algorithm.',
    paradigm: 'Greedy Technique',
    difficulty: 'Medium',
    prerequisites: `
### Prerequisite Concepts for Dijkstra's Algorithm:
1. **Single-Source Shortest Path**:
   Computes the shortest path from a starting vertex \`s\` to all other vertices in a weighted graph (non-negative edge weights).
2. **Helper Arrays**:
   - \`d[10]\`: Stores the shortest distance from \`s\` to each node.
   - \`v[10]\`: Visited status (visited = \`1\`, unvisited = \`0\`).
3. **Dijkstra Loop Execution**:
   - Initialize distances: \`d[i] = c[s][i]\`, visit state \`v[i] = 0\`.
   - Mark source visited: \`v[s] = 1\`.
   - Iterative Step:
     1. Find unvisited node \`u\` with the absolute minimum distance \`d[u]\`.
     2. Visit \`u\` (\`v[u] = 1\`).
     3. For every unvisited neighbor \`j\`, relax the edge: if \`d[u] + c[u][j] < d[j]\`, update \`d[j] = d[u] + c[u][j]\`.
`,
    code: `#include <stdio.h>
#define INF 999

void dijkstra(int c[10][10], int n, int s, int d[10]) {
    int v[10], min, u, i, j;
    for (i = 1; i <= n; i++) {
        d[i] = c[s][i];
        v[i] = 0;
    }
    v[s] = 1;
    for (i = 1; i <= n; i++) {
        min = INF;
        for (j = 1; j <= n; j++) {
            if (v[j] == 0 && d[j] < min) {
                min = d[j];
                u = j;
            }
        }
        v[u] = 1;
        for (j = 1; j <= n; j++) {
            if (v[j] == 0 && (d[u] + c[u][j]) < d[j]) {
                d[j] = d[u] + c[u][j];
            }
        }
    }
}

int main() {
    int c[10][10], d[10], i, j, s, n;
    printf("\\nEnter n value:");
    if (scanf("%d", &n) != 1) return 1;
    printf("\\nEnter the graph data:\\n");
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= n; j++) {
            if (scanf("%d", &c[i][j]) != 1) return 1;
        }
    }
    printf("\\nEnter the source node:");
    if (scanf("%d", &s) != 1) return 1;
    dijkstra(c, n, s, d);
    for (i = 1; i <= n; i++) {
        printf("\\nShortest distance from %d to %d is %d", s, i, d[i]);
    }
    printf("\\n");
    return 0;
}
`,
    sampleInput: `4
444 767 987 12
999 87 56 45
1 0 999 678
444 678 235 0
1`,
    sampleOutput: `Shortest distance from 1 to 1 is 444
Shortest distance from 1 to 2 is 247
Shortest distance from 1 to 3 is 247
Shortest distance from 1 to 4 is 12`
  },
  {
    id: 'topo',
    title: '5. Topological Sorting',
    problemStatement: 'Design and implement C/C++ Program to obtain the Topological ordering of vertices in a given digraph.',
    paradigm: 'Graph Algorithm',
    difficulty: 'Medium',
    prerequisites: `
### Prerequisite Concepts for Topological Sorting:
1. **DAG requirement**:
   Topological sorting is only possible on Directed Acyclic Graphs (DAGs).
2. **In-Degree calculation**:
   In-degree of a vertex \`j\` is the number of edges pointing towards it. Calculated as: if \`a[i][j] == 1\`, increase \`id[j]\`.
3. **Queue/Stack Sort Technique (Kahn's style)**:
   - Identify vertices with \`in-degree == 0\` (i.e. no dependencies).
   - Place them in our sorting array \`temp\`, and set \`id[i] = -1\` to mark as resolved.
   - For every out-neighbor \`j\` of the resolved vertex, decrement their in-degree (\`id[j]--\`).
   - Repeat until all nodes are ordered. If sorted nodes count \`k != n\`, a cycle exists (not a DAG!).
`,
    code: `#include <stdio.h>

int temp[10], k = 0;

void sort(int a[][10], int id[], int n) {
    int i, j;
    for (i = 1; i <= n; i++) {
        if (id[i] == 0) {
            id[i] = -1;
            temp[++k] = i;
            for (j = 1; j <= n; j++) {
                if (a[i][j] == 1 && id[j] != -1) {
                    id[j]--;
                }
            }
            i = 0; // Reset search from first node
        }
    }
}

int main() {
    int a[10][10], id[10], n, i, j;
    printf("\\nEnter the n value:");
    if (scanf("%d", &n) != 1) return 1;
    for (i = 1; i <= n; i++)
        id[i] = 0;
        
    printf("\\nEnter the graph data:\\n");
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= n; j++) {
            if (scanf("%d", &a[i][j]) != 1) return 1;
            if (a[i][j] == 1) {
                id[j]++;
            }
        }
    }
    sort(a, id, n);
    if (k != n) {
        printf("\\nTopological ordering not possible\\n");
    } else {
        printf("\\nTopological ordering is: ");
        for (i = 1; i <= k; i++) {
            printf("%d ", temp[i]);
        }
        printf("\\n");
    }
    return 0;
}
`,
    sampleInput: `6
0 0 1 1 0 0
0 0 0 1 1 0
0 0 0 1 0 1
0 0 0 0 0 1
0 0 0 0 0 1
0 0 0 0 0 0`,
    sampleOutput: `Topological ordering is: 1 2 3 4 5 6`
  },
  {
    id: 'knapsack-dp',
    title: '6. 0/1 Knapsack (DP)',
    problemStatement: 'Design and implement C/C++ Program to solve 0/1 Knapsack problem using Dynamic Programming method.',
    paradigm: 'Dynamic Programming',
    difficulty: 'Medium',
    prerequisites: `
### Prerequisite Concepts for 0/1 Knapsack:
1. **0/1 State**:
   You can either pick an entire item (1) or ignore it (0). No fractional items are allowed.
2. **Recursive Choices**:
   For item \`i\` with weight \`w[i]\` and profit \`p[i]\`:
   - If \`w[i] > m\` (capacity \`m\` is exceeded): we cannot select \`i\`. Solve for remaining items: \`knap(i+1, m)\`.
   - Else, we choose the maximum of two scenarios:
     1. Exclude the item: \`knap(i+1, m)\`
     2. Include the item: \`knap(i+1, m - w[i]) + p[i]\`
`,
    code: `#include <stdio.h>

int w[10], p[10], n;

int max(int a, int b) {
    return (a > b) ? a : b;
}

int knap(int i, int m) {
    if (i == n) 
        return (w[i] > m) ? 0 : p[i];
    if (w[i] > m) 
        return knap(i + 1, m);
    return max(knap(i + 1, m), knap(i + 1, m - w[i]) + p[i]);
}

int main() {
    int m, i, max_profit;
    printf("\\nEnter the no. of objects:");
    if (scanf("%d", &n) != 1) return 1;
    printf("\\nEnter the knapsack capacity:");
    if (scanf("%d", &m) != 1) return 1;
    printf("\\nEnter profit followed by weight:\\n");
    for (i = 1; i <= n; i++) {
        if (scanf("%d %d", &p[i], &w[i]) != 2) return 1;
    }
    max_profit = knap(1, m);
    printf("\\nMax profit=%d\\n", max_profit);
    return 0;
}
`,
    sampleInput: `4
5
12 3
43 5
45 2
55 3`,
    sampleOutput: `Max profit=100`
  },
  {
    id: 'knapsack-greedy',
    title: '7. Greedy Knapsack',
    problemStatement: 'Design and implement C/C++ Program to solve discrete Knapsack and continuous Knapsack problems using greedy approximation method.',
    paradigm: 'Greedy Technique',
    difficulty: 'Medium',
    prerequisites: `
### Prerequisite Concepts for Greedy Knapsack:
1. **Profit-to-Weight Ratio**:
   Greedy strategy dictates that we should choose items with the highest value-for-weight density first:
   \`ratio[i] = profit[i] / weight[i]\`
2. **Sorting descending**:
   Sort items by their profit-to-weight ratio in non-increasing order.
3. **Discrete vs. Continuous**:
   - If the item fits: select it fully (\`x[i] = 1\`, deduct weight, add profit).
   - If it doesn't fit fully: take the fractional remaining part (\`x[i] = (m - currentWeight) / w[i]\`, break).
`,
    code: `#include <stdio.h>
#define MAX 50

int p[MAX], w[MAX];
double x[MAX];
double maxprofit;
int n, m, i;

void greedyKnapsack(int n, int w[], int p[], int m) {
    double ratio[MAX];
    // Calculate ratio
    for (i = 0; i < n; i++) {
        ratio[i] = (double)p[i] / w[i];
    }
    // Bubble sort by ratio descending
    for (i = 0; i < n - 1; i++) {
        for (int j = i + 1; j < n; j++) {
            if (ratio[i] < ratio[j]) {
                double temp = ratio[i];
                ratio[i] = ratio[j];
                ratio[j] = temp;
                
                int temp2 = w[i];
                w[i] = w[j];
                w[j] = temp2;
                
                temp2 = p[i];
                p[i] = p[j];
                p[j] = temp2;
            }
        }
    }
    
    int currentWeight = 0;
    maxprofit = 0.0;
    for (i = 0; i < n; i++) {
        x[i] = 0;
    }
    
    for (i = 0; i < n; i++) {
        if (currentWeight + w[i] <= m) {
            x[i] = 1.0;
            currentWeight += w[i];
            maxprofit += p[i];
        } else {
            x[i] = (double)(m - currentWeight) / w[i];
            maxprofit += x[i] * p[i];
            break;
        }
    }
    printf("\\nOptimal solution for greedy method: %.1f", maxprofit);
    printf("\\nSolution vector for greedy method: ");
    for (i = 0; i < n; i++) {
        printf("%.0f\\t", x[i]);
    }
    printf("\\n");
}

int main() {
    printf("\\nEnter the number of objects: ");
    if (scanf("%d", &n) != 1) return 1;
    printf("\\nEnter the objects\' weights: ");
    for (i = 0; i < n; i++) {
        if (scanf("%d", &w[i]) != 1) return 1;
    }
    printf("\\nEnter the objects\' profits: ");
    for (i = 0; i < n; i++) {
        if (scanf("%d", &p[i]) != 1) return 1;
    }
    printf("\\nEnter the maximum capacity: ");
    if (scanf("%d", &m) != 1) return 1;
    greedyKnapsack(n, w, p, m);
    return 0;
}
`,
    sampleInput: `4
56 78 98 78
23 45 76 78
100`,
    sampleOutput: `Optimal solution for greedy method: 78.0
Solution vector for greedy method: 1	0	0	0`
  },
  {
    id: 'subset-sum',
    title: '8. Subset Sum Problem',
    problemStatement: 'Design and implement C/C++ Program to find a subset of a given set S = {s1, s2, ..., sn} of n positive integers whose sum is equal to a given positive integer d.',
    paradigm: 'Backtracking',
    difficulty: 'Medium',
    prerequisites: `
### Prerequisite Concepts for Subset Sum:
1. **Backtracking / Inclusion-Exclusion**:
   For every number \`s[k]\`, we try two options:
   - Add to subset (\`x[k] = 1\`, recursive call).
   - Don't add to subset (\`x[k] = 0\`, recursive call).
2. **State Variables**:
   - \`p\`: Cumulative sum of chosen elements so far.
   - \`k\`: Index of current element being considered.
   - \`r\`: Sum of all remaining elements available to select.
3. **Bounding Conditions (Pruning)**:
   - If \`p + s[k] == d\`: Print solution, backtrack.
   - If \`p + s[k] + s[k+1] <= d\`: Keep going down left child (include \`s[k]\`).
   - If \`p + r - s[k] >= d && p + s[k+1] <= d\`: Keep going down right child (exclude \`s[k]\`).
`,
    code: `#include <stdio.h>
#define MAX 10

int s[MAX], x[MAX], d;

void sumofsub(int p, int k, int r) {
    int i;
    x[k] = 1;
    if ((p + s[k]) == d) {
        for (i = 1; i <= k; i++) {
            if (x[i] == 1) {
                printf("%d ", s[i]);
            }
        }
        printf("\\n");
    } else if (p + s[k] + s[k + 1] <= d) {
        sumofsub(p + s[k], k + 1, r - s[k]);
    }
    if ((p + r - s[k] >= d) && (p + s[k + 1] <= d)) {
        x[k] = 0;
        sumofsub(p, k + 1, r - s[k]);
    }
}

int main() {
    int i, n, sum = 0;
    printf("\\nEnter the n value:");
    if (scanf("%d", &n) != 1) return 1;
    printf("\\nEnter the set in increasing order:\\n");
    for (i = 1; i <= n; i++) {
        if (scanf("%d", &s[i]) != 1) return 1;
        sum += s[i];
    }
    printf("\\nEnter the max subset value:");
    if (scanf("%d", &d) != 1) return 1;
    if (sum < d || s[1] > d) {
        printf("\\nNo subset possible\\n");
    } else {
        sumofsub(0, 1, sum);
    }
    return 0;
}
`,
    sampleInput: `9
1 2 3 4 5 6 7 8 9
9`,
    sampleOutput: `1 2 6 
1 3 5 
1 8 
2 3 4 
2 7 
3 6 
4 5 
9 `
  },
  {
    id: 'selection-sort',
    title: '9. Selection Sort',
    problemStatement: 'Design and implement C/C++ Program to sort a given set of n integer elements using Selection Sort method and compute its time complexity. Plot graphs for sorted outputs.',
    paradigm: 'Sorting / Divide & Conquer',
    difficulty: 'Easy',
    prerequisites: `
### Prerequisite Concepts for Selection Sort:
1. **Finding Minimum**:
   Selection sort divides array into sorted and unsorted parts. It repeatedly finds the smallest element in the unsorted section and swaps it with the first unsorted element.
2. **Double Loops**:
   - Outer loop \`i\` from 0 to \`n-2\`.
   - Inner loop \`j\` from \`i+1\` to \`n-1\` looks for any index \`j\` where \`arr[j] < arr[min_idx]\`.
3. **Complexity Plotting**:
   Using C's \`<time.h>\` to measure execution clock cycles with \`clock()\`. We run tests with size \`n > 5000\` using random number generations to draw complexity trends.
`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <time.h>

void selectionSort(int arr[], int n) {
    int i, j, min_idx;
    for (i = 0; i < n - 1; i++) {
        min_idx = i;
        for (j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}

void generateRandomNumbers(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        arr[i] = rand() % 10000;
    }
}

int main() {
    int n;
    printf("Enter number of elements: ");
    if (scanf("%d", &n) != 1) return 1;
    if (n <= 5000) {
        printf("Please enter a value greater than 5000\\n");
        return 1;
    }
    int *arr = (int *)malloc(n * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed\\n");
        return 1;
    }
    generateRandomNumbers(arr, n);
    clock_t start = clock();
    selectionSort(arr, n);
    clock_t end = clock();
    double time_taken = ((double)(end - start)) / CLOCKS_PER_SEC;
    printf("Time taken to sort %d elements: %f seconds\\n", n, time_taken);
    free(arr);
    return 0;
}
`,
    sampleInput: `6000`,
    sampleOutput: `Time taken to sort 6000 elements: 0.031000 seconds`
  },
  {
    id: 'quick-sort',
    title: '10. Quick Sort',
    problemStatement: 'Design and implement C/C++ Program to sort a given set of n integer elements using Quick Sort method and compute its time complexity.',
    paradigm: 'Divide and Conquer',
    difficulty: 'Medium',
    prerequisites: `
### Prerequisite Concepts for Quick Sort:
1. **Partitioning Scheme**:
   Chooses a pivot element (e.g., \`arr[high]\`) and aligns elements smaller than the pivot to its left, and larger elements to its right.
2. **Recursive Sorting**:
   - Divide: Find partition index \`pi\` using \`partition()\`.
   - Conquer: Recursively sort left subarray \`quickSort(arr, low, pi-1)\` and right subarray \`quickSort(arr, pi+1, high)\`.
3. **Partition Pointer swap**:
   Keep track of index \`i = low - 1\`. For any element \`arr[j] < pivot\`, increment \`i\` and swap \`arr[i]\` and \`arr[j]\`. Finally swap pivot into correct index \`i+1\`.
`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <time.h>

void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

void generateRandomNumbers(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        arr[i] = rand() % 100000;
    }
}

int main() {
    int n;
    printf("Enter number of elements: ");
    if (scanf("%d", &n) != 1) return 1;
    if (n <= 5000) {
        printf("Please enter a value greater than 5000\\n");
        return 1;
    }
    int *arr = (int *)malloc(n * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed\\n");
        return 1;
    }
    generateRandomNumbers(arr, n);
    clock_t start = clock();
    quickSort(arr, 0, n - 1);
    clock_t end = clock();
    double time_taken = ((double)(end - start)) / CLOCKS_PER_SEC;
    printf("Time taken to sort %d elements: %f seconds\\n", n, time_taken);
    free(arr);
    return 0;
}
`,
    sampleInput: `10000`,
    sampleOutput: `Time taken to sort 10000 elements: 0.002000 seconds`
  },
  {
    id: 'merge-sort',
    title: '11. Merge Sort',
    problemStatement: 'Design and implement C/C++ Program to sort a given set of n integer elements using Merge Sort method and compute its time complexity.',
    paradigm: 'Divide and Conquer',
    difficulty: 'Medium',
    prerequisites: `
### Prerequisite Concepts for Merge Sort:
1. **Divide and Conquer**:
   Divides array into two halves, recursively sorts them, and then merges the sorted halves back together.
2. **Merging Logic**:
   - Allocate temporary arrays \`L\` and \`R\` to hold the sub-parts.
   - Using pointers \`i\` and \`j\`, select the smaller of \`L[i]\` and \`R[j]\` and copy it back to the original array \`arr[k]\`.
   - Copy any leftover elements from \`L\` or \`R\`.
3. **Mid Calculation**:
   \`mid = left + (right - left) / 2\` (prevents integer overflow compared to \`(left + right) / 2\`).
`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <time.h>

void merge(int arr[], int left, int mid, int right) {
    int i, j, k;
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int *L = (int *)malloc(n1 * sizeof(int));
    int *R = (int *)malloc(n2 * sizeof(int));
    for (i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];
    i = 0;
    j = 0;
    k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
    free(L);
    free(R);
}

void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void generateRandomArray(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        arr[i] = rand() % 100000;
    }
}

int main() {
    int n;
    printf("Enter the number of elements: ");
    if (scanf("%d", &n) != 1) return 1;
    if (n <= 5000) {
        printf("Please enter a value greater than 5000\\n");
        return 1;
    }
    int *arr = (int *)malloc(n * sizeof(int));
    if (arr == NULL) {
        return 1;
    }
    generateRandomArray(arr, n);
    clock_t start = clock();
    for (int i = 0; i < 100; i++) { // Repeat for better timing accuracy
        mergeSort(arr, 0, n - 1);
    }
    clock_t end = clock();
    double time_taken = ((double)(end - start)) / CLOCKS_PER_SEC / 100.0;
    printf("Time taken to sort %d elements: %f seconds\\n", n, time_taken);
    free(arr);
    return 0;
}
`,
    sampleInput: `6000`,
    sampleOutput: `Time taken to sort 6000 elements: 0.000709 seconds`
  },
  {
    id: 'nqueens',
    title: '12. N-Queens Problem',
    problemStatement: 'Design and implement C/C++ Program for N Queen\'s problem using Backtracking.',
    paradigm: 'Backtracking',
    difficulty: 'Hard',
    prerequisites: `
### Prerequisite Concepts for N-Queens:
1. **Safety Checking**:
   We place queens column-by-column. Before placing a queen at \`board[row][col]\`, we check if it is safe from attacks:
   - Check current row on left: \`board[row][i]\`
   - Check upper-left diagonal: \`board[row-i][col-i]\`
   - Check lower-left diagonal: \`board[row+i][col-i]\`
2. **Backtracking State Change**:
   If a placement is valid:
   - Place queen: \`board[row][col] = 1\`
   - Recurse to next column: \`solveNQUtil(board, N, col + 1)\`
   - If recursion fails (no solution found): remove queen (backtrack): \`board[row][col] = 0\`
3. **Dynamic 2D Arrays in C**:
   Rows are allocated dynamically as an array of pointers: \`int** board = malloc(N * sizeof(int*))\`.
`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

void printSolution(int **board, int N) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            printf("%s ", board[i][j] ? "Q" : "#");
        }
        printf("\\n");
    }
}

bool isSafe(int **board, int N, int row, int col) {
    int i, j;
    for (i = 0; i < col; i++) {
        if (board[row][i]) return false;
    }
    for (i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j]) return false;
    }
    for (i = row, j = col; j >= 0 && i < N; i++, j--) {
        if (board[i][j]) return false;
    }
    return true;
}

bool solveNQUtil(int **board, int N, int col) {
    if (col >= N) return true;
    for (int i = 0; i < N; i++) {
        if (isSafe(board, N, i, col)) {
            board[i][col] = 1;
            if (solveNQUtil(board, N, col + 1)) return true;
            board[i][col] = 0; // Backtrack
        }
    }
    return false;
}

bool solveNQ(int N) {
    int **board = (int **)malloc(N * sizeof(int *));
    for (int i = 0; i < N; i++) {
        board[i] = (int *)malloc(N * sizeof(int));
        for (int j = 0; j < N; j++) {
            board[i][j] = 0;
        }
    }
    if (!solveNQUtil(board, N, 0)) {
        printf("Solution does not exist\\n");
        for (int i = 0; i < N; i++) free(board[i]);
        free(board);
        return false;
    }
    printSolution(board, N);
    for (int i = 0; i < N; i++) free(board[i]);
    free(board);
    return true;
}

int main() {
    int N;
    printf("Enter the number of queens: ");
    if (scanf("%d", &N) != 1) return 1;
    solveNQ(N);
    return 0;
}
`,
    sampleInput: `4`,
    sampleOutput: `# # Q # 
Q # # # 
# # # Q 
# Q # # `
  }
];
