# Setting up the Backend Development Environment

## Installation and Setup
1. If you haven't cloned the repo yet, run `git clone https://github.com/youngbryanyu/Fitnesse.git` in your desired parent directory to clone the repository (or fork the repo).
2. Run `cd Fitnesse/backend && npm install -g pnpm && pnpm install` to install [pnpm](https://pnpm.io/installation) as the package manager globally and install necessary dependencies in the backend server directory. You may need to run the command with `sudo` to have the permissions to install pnpm globally.
3. Create a `.env.development` file in the `/backend` directory and populate it with contents from [this](https://docs.google.com/document/d/1v_2SooRcI1OW46AoKvayGLqSEkgcaWslZUnSvw_SDfc/edit) file 
4. Create a `docker-compose.dev.yml` and populate it with the contents from [this](https://docs.google.com/document/d/13BkNwY7EvtMokR7mbsy5fC4E3dUUal1gqnXJnTizIZY/edit) file

Email youngyu19@gmail.com.com or aaronkim0928@gmail.com for access to the Google Drive files.

## pnpm Scripts
Below are the scripts we use in the backend (must be run from within the `/backend` directory):
- `pnpm run lint`: runs the ESLint linter on the TypeScript /src directory
- `pnpm run prettier`: runs prettier to automatically fix format code based on the `.prettierrc` file.
- `pnpm run test`: runs all unit tests
- `pnpm run start`: starts the backend server.
- `pnpm run dev`: starts the backend server using nodemon for convenience of auto-restarting server when changes are made. 
- `pnpm run build`: builds the TypeScript files in the /src directory into JavaScript in the /dst directory

## Docker Scripts
Below are scripts for local testing
- `docker-compose -f docker-compose.dev.yml up --build`: docker-compose command to build and run the docker container locally