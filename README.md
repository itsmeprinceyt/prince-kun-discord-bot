# Prince‑kun Discord Bot 🤖
Prince-kun is a custom-built Discord bot developed with TypeScript to serve as the all-in-one solution for managing my personal Discord [server](https://discord.gg/HgXNs4p5cx). Designed with both automation and interactivity in mind, the bot handles essential server moderation, user management, and provides a fully integrated backend for ItsMe Prince Shop powered by a MySQL database.

From banning users and sending automated updates to distributing giveaway codes and managing a shop leaderboard, Prince-kun blends practical utility with personal touches. It supports both slash commands and prefix-based commands, and includes rich support for accessing social links, game items, livestream codes, and purchase profiles — making it an essential hub for both server members and clients.

### Showcase Website: https://prince-kun.vercel.app/
Please visit the showcase website above to know all of these:
- Prince-kun Discord Bot Repository `<- You are here`
- Prince-kun Website Repository
- Prince-kun Website Backend Repository
- Prince-kun Showcase Website Repository

# 🚀 Features
## 🛡️ Server Management
- Ban/Kick users (user moderation)
- Purge/delete bulk messages
- Announce server changes and bot updates automatically
- Notify when a user donates a card or item for giveaways
- Send live stream codes for ongoing game events
- Send embed messages when game items are in stock for sale
- Post redeem codes from YouTube
- Assign and remove server roles:
  - Leaker
  - Mod
  - Bot Tester
  - Client
  - Code Poster
  - Shop Manager
## 🛒 ItsMe Prince Shop
- Admin panel to manage users in the shop’s MySQL database
- Delete user data from the database
- Log item purchases
- Maintain a leaderboard of top buyers
- Modify user data (manual/admin edits)
- Let users view their own profile with:
- Purchase history
- Registered data
- Register as a new user
- Update or reset personal data
## 🎮 Utility & Fun Commands
Explore a variety of useful and entertaining commands to enhance your Discord experience.
Some commands will provide information about me, such as social media links and in-game account numbers.
- 🎨 View bot's artwork
- 🖼️ Display your or another user's avatar
- ❌ Delete messages or content with precision ( only restricted to Karuta/Sofi/Mazoku/Lumina )
- 📱 Check prince's device-related information
- 🎮 Get prince's game IDs
- 🐙 Show prince's GitHub profile or repository data
- 📸 View prince's Instagram posts or profiles
- ☕ Support me via Ko-fi
- ➗ Perform basic math operations
- 💳 Show prince's PayPal or UPI details
- 🖥️ Display prince's PC specifications
- 📜 View Sofi bot guides
- 📞 Access prince's WhatsApp contact or details
- 💼 Karuta's worker assistance
- 📺 Get updates from my YouTube channel or clips

# Installation Structure/Contribute
1. Clone the Repository
```bash
git clone https://github.com/itsmeprinceyt/prince-kun-discord-bot.git
cd prince-kun-discord-bot
```
2. Install Dependencies
```bash
npm install
```
3. **Create a New Branch:** Before making changes, create a new branch:
4. Commit with proper message and description
5. Push to your fork
```bash
git push origin feature/your-feature-name
```
6. Create a Pull Request


# Development Commands
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

### Video
TBA