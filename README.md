# ⚡ Customizable LeetCode & ADA Lab Prep Platform (BCSL404)

An interactive, premium single-page web application featuring an **AI-powered Custom coding practice engine** and a dedicated **Analysis and Design of Algorithms Lab (BCSL404) Exam Prep Module** mapped directly to Abdul Bari's Udemy course.

Live Development Server runs locally at `http://localhost:5173/`.

---

## ✨ Features

### 1. 🤖 AI-Powered Coding Practice
- **Prompt Generator**: Select topics (DP, Trees, Arrays, Graphs, etc.), difficulty, and target language. The app generates a structured prompt with a strict JSON schema. Paste it into any LLM (ChatGPT, Gemini, Claude).
- **JSON Parser & Validator**: Paste the JSON response back. The app validates the format, cleans Markdown syntax wrappers, and adds the challenge to your local library.
- **HackerRank-Style Editor**: Solve problems inside VS Code's **Monaco Editor** with dark-mode styling, syntax highlighting, autocomplete, and persistent code caching.

### 2. 🎓 ADA Lab Exam Prep Module (BCSL404)
- **12 Syllabus Programs**: Preloaded database of all 12 C/C++ algorithms (Kruskal, Prim, Floyd, Warshall, Dijkstra, Topological Sort, Knapsack DP & Greedy, Subset Sum, Sorting, and N-Queens).
- **📺 Abdul Bari Udemy Mappings**: Recommends the exact lecture numbers and titles to watch for each program (e.g., Section 22 Graphs, Section 26 Greedy, Section 20 Sorting).
- **🎯 LeetCode-Style Prerequisite Sub-Challenges**: Solve the key sub-concepts in JavaScript (e.g., *Disjoint Set Union (DSU)* for Kruskal's, *Merge Sorted Arrays* for Merge Sort) before simulating the complete C code.
- **💻 Interactive C Simulator**: Pre-loaded syllabus reference code. Tap **"Load PDF Sample Input"** to automatically paste graph matrices and test inputs from your manual screenshots, compile via Judge0 C GCC Compiler, and compare outputs.

### 3. 📚 Storage & Navigation
- Hash-based SPA Router (Generator, JSON Import, Problems Library, Lab Prep Dashboard).
- Persistence: Saved problem entries and active solution drafts are cached in `localStorage`.

---

## 🛠️ Technology Stack

- **Core**: HTML5, Vanilla JavaScript (ES6 Modules)
- **Styling**: Vanilla CSS3 (Custom design system with glassmorphism panels, Inter and Fira Code fonts)
- **Code Editor**: Monaco Editor (`@monaco-editor/loader`)
- **Execution Sandbox**: Sandboxed browser Web Workers (JavaScript) & Judge0 API (C, C++, Java, Python)
- **Dev Tooling**: Vite

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Setup & Running

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shivang5209/customizable-leetcode.git
   cd customizable-leetcode
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173/`.

4. **Build for production**:
   ```bash
   npm run build
   ```
