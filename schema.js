// Import the Joi validation library
const Joi = require("joi");

// Define a validation schema for listings for server side validation
const listingSchema = Joi.object({
    // The listing object(received through req body when user ha ssubmitted the form) should contain the following fields
    listing: Joi.object({
        // Title must be a string and is required
        title: Joi.string().required(),  

        // Description must be a string and is required
        description: Joi.string().required(),

        // Location must be a string and is required
        location: Joi.string().required(),

        // Country must be a string and is required
        country: Joi.string().required(),

        // Price must be a number, is required, and should be at least 0 (no negative values)
        price: Joi.number().required().min(0),

        // Image must be a string but can also be empty ("") or null
        image: Joi.string().allow("", null),
    }).required() // The entire listing object is required
});






const reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});


// Export the schema so it can be used in other parts of the application
module.exports = { listingSchema, reviewSchema };