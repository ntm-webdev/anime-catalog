module.exports.calculateFeedback = (existingAnime) => {
	const numberOfFeedbacks = existingAnime.feedback.length;
	if (numberOfFeedbacks > 0) {
		const arrRatings = existingAnime.feedback.map((el) => el.rating);
		const sumOfRatings = arrRatings.reduce((a, b) => a + b, 0);
		return sumOfRatings / numberOfFeedbacks;
	} else {
		return -1;
	}
};