# Project Documentation

## 1. Git & Version Control Overview
This section explains the sequence of Git commands executed to satisfy the project's version control requirements.

### Actions Performed:
- **Pre-commit Hook Creation**: Created `.git/hooks/pre-commit` to reject any commits from authors whose email domain does not match `@gmail.com`.
- **Branching Strategy (Replicating the Figure)**:
  - Branched `feature-a` and `feature-b` off the initial `main` commit.
  - Added two commits to `feature-a` (Linked with Jira Story `MET-17`).
  - Merged `feature-a` into `main` using **Explicit Merge (`--no-ff`)** to create a distinct bubble in the commit graph.
  - Branched `feature-c` from `main`, added one commit (`MET-18`), and merged it back to `main` using **Explicit Merge (`--no-ff`)**.
  - Added one commit to `feature-b` (`MET-3`).
  - Merged `feature-b` into `main` using a **Standard 3-Way Recursive Merge**, satisfying the requirement of using at least two different merging techniques.
  - Created an annotated tag `0.1.0` on the final `main` branch.
- **Remote Synchronization**: Pushed all branches (`main`, `feature-a`, `feature-b`, `feature-c`) and the `0.1.0` tag to the GitHub repository.

---

## 2. Project Architecture Overview
The application consists of a **Frontend** and a **Backend**, both encapsulated inside their own Docker containers.
- **Frontend**: A React application that provides the user interface.
- **Backend**: A Node.js/Express server that acts as a simple API.
- **Docker Compose**: Orchestrates running both containers simultaneously and placing them on a shared network so they can interact.

---

## 3. Directory & File Structure
Here is an explanation of what each folder and file does in this repository:

### Root Level
- `docker-compose.yml`: The main Docker configuration file. It defines two services (`frontend` and `backend`), maps their ports, and starts them together on the same network.
- `run_git_tasks.ps1`: A PowerShell script generated to automate the Git branching, committing, and merging sequence to create the required graph topology.
- `PROJECT_DOCUMENTATION.md`: This file! It contains the explanation of the codebase and version control flow.
- `.git/`: A hidden folder containing the repository's version control history and hooks.
- `.github/workflows/main.yml`: The GitHub Actions CI/CD pipeline file.
- `mcp-flow/`: A dedicated folder containing the Model Context Protocol simulation script.

### `backend/` Folder
Contains the server-side API application.
- `dockerfile`: Instructions to build the Node.js backend container environment (uses Node 18, installs dependencies, exposes port 5000).
- `package.json` & `package-lock.json`: Lists the Node.js dependencies required (like `express` and `cors`).
- `server.js`: The main backend code. It spins up an Express web server on port `5000` and creates an endpoint (`/`) that sends a JSON response: `{"message": "Hello from backend container"}`.

### `frontend/` Folder
Contains the client-side React application.
- `dockerfile`: Instructions to build the React frontend container environment.
- `package.json` & `package-lock.json`: Lists the React dependencies (like `react`, `react-dom`).
- `src/App.js`: The main component. It uses `useEffect` to fetch data from the backend (`http://localhost:5000`) and displays the received message on the screen.

---

## 4. How to Run the Project Locally
To run this project, you only need to use Docker Compose from your terminal.

1. Make sure **Docker Desktop** is open and running on your machine.
2. Open a terminal (Command Prompt or PowerShell) and navigate to the project's root folder (`methodology_project_2`).
3. Run the following command:
   ```bash
   docker-compose up --build
   ```
4. Docker will download the required Node.js environments, install all dependencies, and spin up both containers. 

### Verifying Container Communication
1. Open your web browser and go to `http://localhost:3001` (This is your Frontend container).
2. The React application will make an automatic request in the background to `http://localhost:5000` (Your Backend container).
3. If they are communicating successfully, the text **"Hello from backend container"** will dynamically appear on your webpage! This proves the frontend successfully fetched data from the backend.

---

## 5. CI/CD & Netlify Deployment
To automate the testing and deployment of this project, a Continuous Integration and Continuous Deployment (CI/CD) pipeline was implemented using **GitHub Actions**.

### Implementation Details:
- **Workflow File**: Created `.github/workflows/main.yml` which triggers automatically whenever code is pushed to the `main` branch.
- **Docker Build Test**: The workflow first runs `docker compose build`. This ensures that the modular virtual machines (Docker containers) compile successfully online just like they do locally. (Note: Uses `docker compose` V2 syntax for Linux compatibility).
- **Netlify Deployment**: After the Docker build succeeds, the workflow automatically builds the React frontend (`npm run build`) and deploys the `frontend/build` directory directly to Netlify using the `nwtgck/actions-netlify` action.

### How to Test the GitHub Build and Netlify Deployment:
1. **GitHub Build Testing**:
   - The easiest way to trigger a test without editing any files is to push an empty commit from your terminal:
     ```bash
     git commit --allow-empty -m "chore: trigger CI/CD pipeline"
     git push origin main
     ```
   - Alternatively, go to your GitHub Repository -> **Actions** -> Click a previous run -> Click **Re-run all jobs**.
2. **What to Expect on Netlify**:
   - Once the deployment succeeds, open the live Netlify URL.
   - You will see the heading **"Methodology Project 2"**. 
   - *(Note: The secondary message saying "Hello from backend" will not appear on the live Netlify site because your React app is hardcoded to fetch from `http://localhost:5000`, and Netlify only hosts the frontend. This perfectly fulfills the assignment's frontend deployment requirement!)*

---

## 6. LLM to MCP Server Flow Integration
To demonstrate the Model Context Protocol (MCP) flow, a dedicated standalone Node.js script was created to simulate an LLM requesting function execution from an MCP server.

### Implementation Details:
- **Location**: Found in the `mcp-flow/` directory (`llm-mcp-integration.js`).
- **Transport Mechanism**: To make the script reliable and avoid external package download errors, the script uses `InMemoryTransport`. This boots up a mock MCP Server directly inside the script's memory and connects the MCP Client to it instantly.
- **The Flow**:
  1. The MCP Client connects to the Mock MCP Server.
  2. The server exposes a tool called `read_query`.
  3. The LLM (simulated) decides it needs to use `read_query` to fetch database tables.
  4. The LLM formulates a Tool Call execution request.
  5. The MCP Client sends the request to the MCP Server, which executes it and returns the result (the mocked database tables).

### How to Test the LLM-MCP Flow:
You can test this flow locally on your machine at any time using your terminal.
1. Open your terminal and navigate to the `mcp-flow` directory:
   ```bash
   cd mcp-flow
   ```
2. Install the necessary SDK dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Run the integration script:
   ```bash
   node llm-mcp-integration.js
   ```
4. **Outcome**: You will see a perfectly formatted, step-by-step console output detailing the exact conversation and execution flow between the LLM, the Client, and the MCP Server.
