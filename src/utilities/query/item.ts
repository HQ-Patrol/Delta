import { items } from "../../data/json/items.json";

export function findItem(itemName: string) {
	return items.find((i) => i.name.toLowerCase() === itemName || i.name2.toLowerCase() === itemName || i.alias.toLowerCase() === itemName);
}

// credits: badosz from dank memer
function similarityBetween(s1: string, s2: string) {
	let longer = s1;
	let shorter = s2;
	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}
	const longerLength = longer.length;
	if (longerLength === 0) {
		return 1.0;
	}
	return (
		(longerLength - editDistance(longer, shorter)) /
		parseFloat(String(longerLength))
	);
}

function editDistance(s1: string, s2: string) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	const costs = [];
	for (let i = 0; i <= s1.length; i++) {
		let lastValue = i;
		for (let j = 0; j <= s2.length; j++) {
			if (i === 0) {
				costs[j] = j;
			} else {
				if (j > 0) {
					let newValue = costs[j - 1];
					if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
						newValue =
							Math.min(
								Math.min(newValue, lastValue),
								costs[j]
							) + 1;
					}
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0) {
			costs[s2.length] = lastValue;
		}
	}
	return costs[s2.length];
}

const trimmedItems = items.map((i) => ({
	name: i.name,
	id: i.name2,
	alias: i.alias
}));

export function searchForItem(query: string, target = trimmedItems) {
	const candidates = [];

	for (const item in target) {
		const candidate = {
			item: target[item],
			similarity: 0,
		};

		// cutt off some branches to make it a bit faster
		const name = candidate.item.name.toLowerCase().trim();
		const id = candidate.item.id.toLowerCase().trim();
		const alias = candidate.item.alias.toLowerCase().trim();
		if (id === query) {
			candidate.similarity = 1;
		} else if (name === query) {
			candidate.similarity = 0.999;
		} else if (
			alias === query
		) {
			candidate.similarity = 0.998;
		} else if (
			name.includes(query) ||
			id.includes(query) ||
			alias.includes(query)
		) {
			candidate.similarity = 0.997;
		} else {
			const similarity = similarityBetween(
				query,
				candidate.item.name
			);
			candidate.similarity = similarity;
		}

		candidates.push(candidate);
	}
	return candidates.length
		? candidates.sort((a, b) => b.similarity - a.similarity)
		: false;
}