const ReviewModel = require("../model/reviewModel");

exports.getReviewsPage = async (req, res) => {
    try {
        const reviews = await ReviewModel.retrieveAll();
        console.log(reviews);
        res.render("allReviews", { reviews });
    } catch (error) {
        console.error(error);
        res.send("Error reading database review songs")
    }
}