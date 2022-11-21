# Typescript React project boilerplate with ESLint and Prettier

Starting point for a Typescript React project with full setup ESLint and Prettier for linting and formatting (airbnb styleguide).

## Stack
- TypeScript
- React (17+)
- react-scripts (createReactApp)
- TypeScript (4+)
- ESLint (8+)
- Prettier
- Airbnb style guide enforced by ESLint & Prettier

## Get Started

### Clone and install

```bash
git clone git@gitlab.com:almog6666/react-typescript-eslint-prettier-boilerplate.git APP_NAME
cd APP_NAME
npm install
```

## Runtime envs for react
Edit the .env file to change envs

## Development Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

### `npm run dbmock`

Launches [json-server](https://www.npmjs.com/package/json-server) mock server @ [http://localhost:5000](http://localhost:5000)

to emulate all of your server API endpoints and custom responses. (`check /mocks folder`)

default script comes with a 1.5 seconds delay to emulate real-time server responses.



### `npm run startdevclient`

Launches client with local env that redirects endpoints at (`/src/config.ts`) to the mock server

### `npm run lint:fix`

Launches the linter for code to check for code layout errors or warnings, and fixes the ones that can be fixed automatically.

### `npm run lint`

Launches eslint to check for linting errors without auto fix.

## Production Scripts

### `npm run build`

Builds the app for production to the build folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
