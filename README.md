when making a command check:

1. who can call that command 
- only owner
- members
- only a certain role + owner ?


tsc
npm run build
then publish for final

npm run dev for production


- just do `tsc` and then `npm run build` and push along with the `/dist` folder


# Note for starting the bot

`dev`
- **Command:** `npm run dev` or `nodemon`

- **Description:** Starts the development server. This command typically watches for changes in your source files (`src/index.ts` in this case) and automatically restarts the server, allowing for a rapid development workflow. It uses tsx watch for this purpose, indicating a TypeScript execution environment.

`build`
- **Command:** `npm run build`

- **Description:** Compiles the TypeScript source code and copies necessary assets using `node dist/copyAssets.js`. After compilation, this script is executed to copy any static assets (like images, CSS, or other non-TypeScript files) from your source directory to the build output directory, ensuring they are included in the final build. 

`start`
- **Command:** `npm run start`

- **Description:** Runs the compiled application. This command is used to start ( `dist/src/index.js` ) after it has been build using `npm run build`.

`sql`
- **Command:** `npm run sql`

- **Description:** Executes only the `dist/src/sql.js` for doing any query related stuff.