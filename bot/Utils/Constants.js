module.exports = {
	PerspectiveAttributes: {
		ATTACK_ON_AUTHOR: {
			name: 'Attack on Author',
			description: 'Attack on author of original article or post.'
		},
		ATTACK_ON_COMMENTER: {
			name: 'Attack on Commenter',
			description: 'Attack on fellow commenter.'
		},
		INCOHERENT: {
			name: 'Incoherent',
			description: 'Difficult to understand, nonsensical.'
		},
		INFLAMMATORY: {
			name: 'Inflammatory',
			description: 'Intending to provoke or inflame.'
		},
		LIKELY_TO_REJECT: {
			name: 'Likely to Reject',
			description: 'Overall measure of the likelihood for the comment to be rejected according by the NYT\'s moderation.'
		},
		OBSCENE: {
			name: 'Obscene',
			description: 'Obscene or vulgar language such as cursing.'
		},
		SEVERE_TOXICITY: {
			name: 'Severe Toxicity',
			description: 'This model uses the same deep-CNN algorithm as the TOXICITY model, but is trained to recognise examples that were considered to be \'very toxic\' by crowdworkers. This makes it much less sensitive to comments that include positive uses of curse-words for example. A labelled dataset and details of the methodolgy can be found in the same toxicity dataset that is available for the toxicity model.'
		},
		SPAM: {
			name: 'Spam',
			description: 'Irrelevant and unsolicited commercial content.'
		},
		TOXICITY: {
			name: 'Toxicity',
			description: 'Rude, Disrespectful, or Unreasonable comment that is likely to make people leave a discussion.'
		},
		UNSUBSTANTIAL: {
			name: 'Unsubstantial',
			description: 'Trivial or short comments.'
		}
	}
};