const User = require('../models/employeeSchema');
const Review = require('../models/reviewSchema');

// home page after login
module.exports.home = async function (req, res) {
    try {
        if (!req.isAuthenticated()) {
            return res.redirect('/employee/signin');
        }
        const user = await User.findById(req.user._id);
        let toReview = [];

        for (let i = 0; i < user.myEvaluations.length; i++) {
            let id = user.myEvaluations[i];
            let review = await User.findById(id);
            if (!review) {
                continue;
            }
            toReview.push(review);
        }

        let allReviews = await Review.find({ to: req.user._id });

        let myReviews = [];

        for (let i = 0; i < allReviews.length; i++) {
            let id = allReviews[i].from;
            let reviewer = await User.findById(id);
            if (!reviewer) {
                continue;
            }
            let obj = {
                name: reviewer.name,
                review: allReviews[i].review,
            };
            myReviews.push(obj);
        }

        return res.render('home', {
            title: 'Home',
            toReview,
            myReviews
        });
    } catch (error) {
        console.log(`Error in rendering home: ${error}`);
        return res.redirect('back');
    }
};
