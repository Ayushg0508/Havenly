// Load dotenv at the very top
// This line checks a setting called NODE_ENV to see if the app is running in "production" mode
// (production mode is for when the app is live and being used by real users).
// The !== means "not equal to," so this runs only if we're NOT in production mode (like during development or testing).
if (process.env.NODE_ENV !== "production") {
    
    // 'require('dotenv')' loads a tool called dotenv, which helps read a file named '.env'.
    // The .env file is a special file where we store secret info like API keys, passwords, or database details.
    // '.config()' tells dotenv to actually load that file and make its contents available to the app.
    // We store the result of this action in a variable called 'result' to check if it worked.
    const result = require('dotenv').config();
    
    // 'result.error' will have a value if something went wrong while loading the .env file.
    // If it’s not empty (meaning there’s an error), we go inside this block.
    if (result.error) {
        // 'console.error' prints a message to the console (a place where developers see logs or errors).
        // This helps us know exactly what went wrong (e.g., file not found, wrong format, etc.).
        console.error("Error loading .env file:", result.error);
        
        // 'throw result.error' stops the app completely by "throwing" the error.
        // This is like saying, "Something’s broken, and we can’t continue without the .env file!"
        // It’s important because the app might need those secrets to work properly.
        throw result.error;
    
    // If there’s no error (meaning 'result.error' is empty), we go into this 'else' block instead.
    } else {
        // 'console.log' prints a friendly message to the console to let us know everything worked.
        // 'result.parsed' is an object (like a list) with all the key-value pairs from the .env file.
        // For example, if .env has "DB_PASSWORD=secret123", it might show { DB_PASSWORD: "secret123" }.
        console.log("Environment variables loaded:", result.parsed);
    }
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override"); //This line imports the method-override package, which allows browsers (that only support GET and POST) to send PUT, PATCH, and DELETE requests in Express apps. 
const ejsMate=require("ejs-mate");
const ExpressError = require("../MIDDELWARES/ExpressError.js");
// const cookieParser=require("cookie-parser");
const session=require("express-session"); 
//const MongoStore = require('connect-mongo');

const flash=require("connect-flash");     // Importing the `connect-flash` middleware, which allows temporary messages to be stored in the session
// Import the 'passport' module, which is used for authentication in Node.js applications.
const passport = require("passport");

// Import the 'passport-local' strategy, which allows authentication using a username and password.
const LocalStrategy = require("passport-local");

// Import the 'User' model, which represents the user schema in the database.
// This is needed to find and authenticate users.
const User = require("./models/user.js");



//below routers are required

const user=require("./routes/user.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

//expalnation of above two lines
// Importing route handlers (modularized route files) for "listings" and "reviews"

// In Express, routes define the various endpoints (URLs) where users can send requests. 
// Instead of writing all routes in the main file (app.js), we organize them into separate files inside the "routes" folder. 
// This keeps the code clean, modular, and maintainable. 

// The "listings.js" file contains all the routes related to managing property listings (e.g., creating, updating, deleting, fetching listings).
// The "review.js" file contains all the routes related to reviews (e.g., adding, updating, deleting reviews for specific listings).

// require("./routes/listing.js") loads the "listing.js" file from the "routes" folder and assigns it to the "listings" variable.
// require("./routes/review.js") loads the "review.js" file from the "routes" folder and assigns it to the "reviews" variable.

// Later in the code, we use `app.use("/listings", listings);` to tell Express that all routes inside "listing.js" 
// should be prefixed with "/listings". This means if "listing.js" defines a route like `router.get("/")`, 
// it will be available as "/listings" in the main application.

// Similarly, `app.use("/listings/:id", reviews);` applies all routes from "review.js" under "/listings/:id", 
// ensuring that reviews are associated with specific listings.




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); //to parse the data comming in request url
app.use(express.json()); // Parses JSON data
app.use(methodOverride("_method")); //This line tells Express to use method-override, allowing HTML forms to send PUT, PATCH, or DELETE requests by appending ?_method=PUT (or PATCH/DELETE) to the form action URL
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
// app.use(cookieParser("secretKey"));




//below code connects your Node.js application to a MongoDB database named "wanderlust"
//After connection, all MongoDB operations (like inserting, updating, or querying data) will happen inside the "wanderlust" database(you dont have to specify the name of the database with every function).


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

// const dbUrl=process.env.ATLASDB_URL;





main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log("not connected to db",err); 
})

async function main(){
    await mongoose.connect(MONGO_URL);
}


// const store=MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
//         secret:process.env.SECRET,
//     },
//     touchAfter:24*3600,
// })

// store.on("error",(err)=>{
//     console.log("ERROR in MONGO SESSION STORE",err);
// });

// Apply session middleware to the Express app
app.use(session({

  //  store:store,

    secret: process.env.SECRET, // A secret key used to sign the session ID cookie (can be any string, keep it strong for security)

    resave: false, // If false, the session is not saved again if it hasn't been modified in a request (improves performance)

    saveUninitialized: true, // Forces an uninitialized session (new but not modified) to be stored in the session store

    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Set cookie expiration time (7 days from now)

        maxAge: 7 * 24 * 60 * 60 * 1000, // Maximum lifetime of the session in milliseconds (7 days)

        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie (enhances security)
    }
}));






// Register the `connect-flash` middleware in the Express app
app.use(flash());



   
// Setting up Passport for authentication
app.use(passport.initialize());
// This starts Passport, allowing it to manage authentication in the app.

// Enabling session support for Passport
app.use(passport.session());
// This allows Passport to use sessions, so users stay logged in even after refreshing the page.

// Using the Local Strategy for username-password login
passport.use(new LocalStrategy(User.authenticate()));
// This tells Passport to use the Local Strategy, meaning users will log in with a username and password.
// `User.authenticate()` automatically checks if the entered password matches the stored password in the database.

// Storing user details in the session
passport.serializeUser(User.serializeUser());
// This saves the user's ID in the session, so they stay logged in without entering credentials repeatedly.

// Retrieving user details from the session
passport.deserializeUser(User.deserializeUser());
// This fetches the full user details from the session using the stored user ID.




//below there is a home page  route which will render the home page and in home page we have provided the option of login and signup and by clicking on that an request is send to login or signup route (which is handeled in user.js)
app.get("/",(req,res)=>{
    res.render("listings/home.ejs");
})


    // Below is the Custom Middleware to make flash messages available in every response
    // --------------------------------------------------------------------
    // - Flash messages are only available for one request and then disappear.
    // - This middleware runs on every request to store flash messages in `res.locals`.
    // - This ensures that messages can be accessed in all views without explicitly passing them in each route.

app.use((req, res, next) => {
    // Store flash messages in `res.locals.success` so they can be accessed in views (e.g., EJS, Pug)
    res.locals.success = req.flash("success");

    // Store error messages in `res.locals.error` for easy access in templates
    res.locals.error = req.flash("error");

    // Log the success message to the console for debugging purposes
    console.log(res.locals.success);

    res.locals.currUser=req.user;

    // Move to the next middleware in the request-response cycle
    next();
});



// Defining a route to create a demo user
// app.get("/demouser", async (req, res) => {
//     // Creating a new user object (not yet saved in the database)
//     let fakeUser = new User({
//         email: "thegautamayush@gmail.com",  // Setting the email of the user
//         username: "delta-student"          // Setting the username
//     });
//     // Registering the user with a password and saving it in the database
//     let registeredUser = await User.register(fakeUser, "hellooworld");
//     // Explanation:
//     // - `User.register()` is provided by `passport-local-mongoose`.
//     // - It hashes the password ("hellooworld") before storing it securely.
//     // - The user is then saved in the database.
//     console.log(registeredUser); // Logging the newly registered user details to the console
// });




app.use("/listings", listings);
//explanation of above line:-
// Mounting the "listings" router
// This means that any request that starts with "/listings" will be handled by the routes defined in "listing.js".
// For example:
//   - GET "/listings" → Will fetch all listings
//   - POST "/listings" → Will create a new listing
//   - GET "/listings/:id" → Will fetch a specific listing based on its ID
// This makes the code modular and keeps route handling organized.


app.use("/listings/:id", reviews);
//expalnation of above line:-
// Mounting the "reviews" router under "/listings/:id"
// This ensures that all review-related routes are associated with a specific listing.
// For example:
//   - POST "/listings/123/reviews" → Will add a review to the listing with ID "123"
//   - DELETE "/listings/123/reviews/456" → Will delete the review with ID "456" from listing "123"
// This structure helps in maintaining a proper relationship between listings and their reviews.


app.use("/",user);



// Load the Sentiment library, which analyzes text to figure out if it’s positive, negative, or neutral
const Sentiment = require("sentiment");
// Load the Listing model, which connects to the database to work with listing data (like properties for rent)
const Listing = require("./models/listing.js");

// Set up a route for when the user submits a form to get recommendations (POST request to "/listings/recommend")
app.post("/listings/recommend", async (req, res) => {
    try {
        // Get the user’s input (their preferences) from the form they submitted
        // 'req.body' holds the data sent from the form, and we grab 'userPreference' from it
        const { userPreference } = req.body;

        // Check if the user didn’t type anything in the preferences field
        if (!userPreference) {
            // If it’s empty, show an error message using 'flash' (a way to show temporary messages)
            req.flash("error", "Please enter your preferences.");
            // Send the user back to the recommendation page to try again
            return res.redirect("/listings/ai-recommend");
        }

        // Create a new Sentiment object to analyze the user’s input
        const sentiment = new Sentiment();
        // Analyze the text in 'userPreference' to get a result (like a score showing positive/negative feelings)
        const sentimentResult = sentiment.analyze(userPreference);
        // Get the sentiment score (-ve means negative, +ve means positive, 0 means neutral)
        const sentimentScore = sentimentResult.score;

        // Turn the user’s input into lowercase and split it into individual words
        // Then filter out short words (less than 4 letters) to focus on meaningful ones
        const keywords = userPreference.toLowerCase().split(' ').filter(word => word.length > 3);
        
        // List of words related to budget we’ll look for in the user’s input
        const budgetKeywords = ['low', 'budget', 'cheap', 'affordable', 'expensive', 'luxury'];
        // List of words related to property type we’ll look for
        const typeKeywords = ['beachfront', 'cottage', 'modern', 'loft', 'mountain', 'retreat'];

        // Set default preferences to 'all' (meaning no specific filter yet)
        let budgetPreference = 'all'; // For price range
        let typePreference = 'all';  // For property type

        // Check the user’s words to guess their budget preference
        if (keywords.includes('low') || keywords.includes('budget') || keywords.includes('cheap') || keywords.includes('affordable')) {
            // If they use words like "cheap" or "budget," assume they want cheaper listings (under $1500)
            budgetPreference = 'under-1500';
        } else if (keywords.includes('expensive') || keywords.includes('luxury')) {
            // If they use "expensive" or "luxury," assume they want pricier listings (over $1500)
            budgetPreference = 'above-1500';
        }

        // Check the user’s words to guess their property type preference
        if (keywords.includes('beachfront') || keywords.includes('cottage')) {
            // Words like "beachfront" or "cottage" mean they might want a beach house or cottage
            typePreference = 'beachfront-cottage';
        } else if (keywords.includes('modern') || keywords.includes('loft')) {
            // "Modern" or "loft" suggests they want a modern loft-style place
            typePreference = 'modern-loft';
        } else if (keywords.includes('mountain') || keywords.includes('retreat')) {
            // "Mountain" or "retreat" suggests a mountain getaway
            typePreference = 'mountain-retreat';
        }

        // Use the sentiment score to add an extra filter based on mood
        let sentimentFilter = 'all'; // Default is no mood filter
        if (sentimentScore > 0) {
            // Positive score (happy words) means filter for "positive" listings
            sentimentFilter = 'positive';
        } else if (sentimentScore < 0) {
            // Negative score (sad or angry words) means filter for "negative" listings
            sentimentFilter = 'negative';
        }

        // Get all listings from the database (this waits for the data to come back, hence 'await')
        const allListings = await Listing.find({});

        // Filter the listings based on the user’s preferences
        let recommendedListings = allListings.filter(listing => {
            // Get the price and title of the current listing (title is made lowercase for easier matching)
            const price = listing.price;
            const title = listing.title.toLowerCase();

            // Check if the listing matches the budget preference
            let matchesBudget = true; // Start by assuming it matches
            if (budgetPreference !== 'all') { // If there’s a specific budget filter
                if (budgetPreference === 'under-1500' && price > 1500) matchesBudget = false; // Too expensive
                if (budgetPreference === 'above-1500' && price <= 1500) matchesBudget = false; // Too cheap
            }

            // Check if the listing matches the property type preference
            let matchesType = true; // Start by assuming it matches
            if (typePreference !== 'all') { // If there’s a specific type filter
                // Check if the title contains the exact phrase we’re looking for
                if (typePreference === 'beachfront-cottage' && !title.includes('beachfront cottage')) matchesType = false;
                if (typePreference === 'modern-loft' && !title.includes('modern loft')) matchesType = false;
                if (typePreference === 'mountain-retreat' && !title.includes('mountain retreat')) matchesType = false;
            }

            // Check if the listing matches the sentiment filter (mood-based)
            let matchesSentiment = true; // Start by assuming it matches
            if (sentimentFilter !== 'all') { // If there’s a mood filter
                // Positive mood: exclude modern lofts (just an example rule)
                if (sentimentFilter === 'positive' && title.includes('modern loft')) {
                    matchesSentiment = false;
                }
                // Negative mood: exclude cozy or retreat listings (another example rule)
                if (sentimentFilter === 'negative' && (title.includes('cozy') || title.includes('retreat'))) {
                    matchesSentiment = false;
                }
            }

            // The listing must match ALL filters (budget, type, and sentiment) to be included
            return matchesBudget && matchesType && matchesSentiment;
        });

        // Show the filtered listings on a page called "ai-results" (a template file)
        // Pass the 'recommendedListings' to the page so it can display them
        res.render("listings/ai-results", { recommendedListings });

    } catch (err) {
        // If anything goes wrong (like database failure), this block runs
        // Print the error to the console for debugging
        console.error("Error in /listings/recommend:", err);
        // Show an error message to the user
        req.flash("error", "Something went wrong while fetching recommendations.");
        // Send them back to the recommendation page to try again
        res.redirect("/listings/ai-recommend");
    }
});










// This middleware runs for all routes that haven't been matched earlier.
app.all("*", (req, res, next) => {
    // Creates a new error with a 404 status and "page not found" message
    // and passes it to the next middleware (error handler).
    next(new ExpressError(404, "page not found"));
});


// Global error-handling middleware
app.use((err, req, res, next) => {
    // Extracts the status code from the error object, defaulting to 500 if not provided
    // Extracts the message from the error object, defaulting to "something went wrong"
    let { statusCode = 500, message = "something went wrong" } = err;

    // below code: to Sends the simple response with the extracted status code and error message
 //   res.status(statusCode).send(message);

    res.status(statusCode).render("listings/error.ejs",{message});

    // Alternative response (commented out) to send a generic error message
    // res.send("something went wrong!");
});




//connection to the port
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})







