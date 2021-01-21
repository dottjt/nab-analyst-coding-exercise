## NAB coding challenge

Hello!

My name is Julius. Thank you for looking into my code! I basically spent a few hours hacking it together, I hope you think it's awesome. :grin:

## Structure

Here are the main folders:
  - `src` - UI application source code
  - `tests` - UI application test code
  - `server` - server application source code

## Setup

In the root directory run:
  - `npm install` - this will install all the Node.js libraries
  - Please install Node.js onto your machine if you have not already i.e. `https://nodejs.org/en/download/`

## Running

To run the application, please enter in two separate terminals:
  - `npm run start-client` - this will start the client
  - `npm run start-server` - this will start the server
  - Once they are both up and running, please head to `http://localhost:3000/`

To run the tests, please enter:
  - `npm test`
  - You may need to install watchman onto your machine. I know I had issues with it for whatever reason i.e. `brew install watchman` (assuming you have brew installed)

## Future Improvements

- Separate server and client folders with their own `package.json` files and `src` folder structures so it's not as messy.
- Implement some kind of GraphQL server for retrieving the weather data.
- Extend tests to the server, and provide more unit tests
- Create integration testing
- Sufficient mobile responsiveness
