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

### `backend/` Folder
Contains the server-side API application.
- `dockerfile`: Instructions to build the Node.js backend container environment (uses Node 18, installs dependencies, exposes port 5000).
- `package.json` & `package-lock.json`: Lists the Node.js dependencies required (like `express` and `cors`).
- `server.js`: The main backend code. It spins up an Express web server on port `5000` and creates an endpoint (`/`) that sends a JSON response: `{"message": "Hello from backend container"}`.
- `node_modules/`: Contains the downloaded Node.js packages for the backend.

### `frontend/` Folder
Contains the client-side React application.
- `dockerfile`: Instructions to build the React frontend container environment.
- `package.json` & `package-lock.json`: Lists the React dependencies (like `react`, `react-dom`).
- `public/`: Contains static assets like `index.html` (the base webpage), `favicon.ico`, and `manifest.json`.
- `src/`: Contains the actual React source code.
  - `App.js`: The main component. It uses `useEffect` to fetch data from the backend (`http://localhost:5000`) and displays the received message on the screen.
  - `index.js`: The entry point that mounts the React app into the `index.html` file.
  - `App.css` & `index.css`: Styling for the application.
- `node_modules/`: Contains the downloaded Node.js packages for the frontend.

---

## 4. How to Run the Project
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
2. You will see the React application load.
3. The React application will make an automatic request in the background to `http://localhost:5000` (Your Backend container).
4. If they are communicating successfully, the text **"Hello from backend container"** will dynamically appear on your webpage! This proves the frontend successfully fetched data from the backend.
