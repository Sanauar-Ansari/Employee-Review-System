const Review = require("../models/reviewSchema");
const User = require("../models/employeeSchema");
const moment = require("moment");

// render review view
module.exports.viewReview = async function (req, res) {
  try {
    const reviews = await Review.find({})
      .sort("-createdAt")
      .populate("from")
      .populate("to");
    return res.render("view-review", {
      title: "View Review",
      reviews,
      moment,
    });
  } catch (error) {
    console.log(`Error in showing records: ${error}`);
    res.redirect("back");
  }
};

// render add review page
module.exports.addReview = async function (req, res) {
  try {
    const users = await User.find({});
    return res.render("add_review", {
      title: "Add Review",
      users,
    });
  } catch (error) {
    console.log(`Error in adding review: ${error}`);
    res.redirect("back");
  }
};

// delete review
module.exports.deleteReview = async function (req, res) {
  try {
    let review = await Review.findById(req.params.id);
    let employeeId = review.to;
    let reviewerId = review.from;

    review.remove();
    let user = User.findByIdAndUpdate(employeeId, {
      $pull: { myReviews: reviewerId },
    });

    res.redirect("back");
  } catch (error) {
    console.log(`Error in deleting Review: ${error}`);
    res.redirect("back");
  }
};

// Update review view
module.exports.updateReview = async function (req, res) {
  try {
    const review = await Review.findById(req.params.id).populate("to");
    return res.render("update_review", {
      title: "Update Review",
      review,
    });
  } catch (error) {
    console.log(`Error in updating review :  ${error}`);
    res.redirect("back");
  }
};

// update review action
module.exports.updateReviewAction = async function (req, res) {
  try {
    await Review.findByIdAndUpdate(req.params.id, {
      review: req.body.review,
    });
    return res.redirect("/admin/view-review");
  } catch (error) {
    console.log(`Error in updating review :  ${error}`);
    res.redirect("back");
  }
};

// create review
module.exports.createReview = async function (req, res) {
  const { id } = req.params;
  const { employee, review } = req.body;

  try {
    const toUser = await User.findById(id ?? employee);
    const fromUser = req.user;

    await Review.create({
      review: review,
      from: fromUser,
      to: toUser,
    });

    // remove the review form
    if (id) {
      const idx = req.user.myEvaluations.indexOf(id);
      req.user.myEvaluations.splice(idx, 1);
      req.user.save();
      return res.redirect("back");
    }

    return res.redirect("/admin/view-review");
  } catch (error) {
    console.log(`Error in creating review: ${error}`);
    res.redirect("back");
  }
};
