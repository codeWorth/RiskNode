const WebSocket = require('ws');
const mysql = require('mysql');
var util = require('util');

const con = mysql.createConnection({
	host: "localhost",
	user: "risk_game",
	password: "",
	database: "riskdb"
});
con.connect();

const wss = new WebSocket.Server({ port: 3000 });

var continents = ['asia', 'europe', 'north america', 'africa', 'australia', 'south america', 'greenland'];
var cont_troop = [7, 6, 5, 3, 2, 2, 0];
var cont_terrs = [12, 7, 8, 6, 4, 4, 2];
var country_cont = [0, 2, 2, 5, 5, 0, 3, 3, 4, 1, 2, 3, 1, 6, 1, 0, 4, 0, 0, 0, 3, 2, 0, 0, 4, 3, 1, 2, 2, 5, 2, 1, 0, 0, 3, 1, 0, 5, 4, 1, 2, 0];
var img_names = ['afghanistan', 'alaska', 'alberta', 'argentina', 'brazil', 'china', 'congo', 'east_africa', 'eastern_australia', 'eastern_europe', 'eastern_us', 'egypt', 'great_britian', 'greenland', 'iceland', 'india', 'indonesia', 'irkutsk', 'japan', 'kamchatka', 'madagascar', 'mexico', 'middle_eat', 'mongolia', 'new_guinea', 'north_africa', 'northern_europe', 'northwest', 'ontario', 'peru', 'quebec', 'scandinavia', 'siam', 'siberia', 'south_africa', 'ukraine', 'ural', 'venezuela', 'western_australia', 'western_europe', 'western_us', 'yakutsk'];

var adjacencies = [[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0], [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0], [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]];
var adjacent_indecies = [[5, 15, 22, 35, 36],[2, 19, 27],[1, 27, 28, 40],[4, 29],[3, 25, 29, 37],[0, 15, 23, 32, 33, 36],[7, 25, 34],[6, 11, 20, 22, 25, 34],[24, 38],[11, 22, 25, 26, 35, 39],[21, 28, 30, 40],[7, 9, 22, 25],[14, 26, 31, 39],[14, 27, 28, 30],[12, 31],[0, 5, 22, 32],[24, 32, 38],[19, 23, 33, 41],[19, 23, 24],[17, 18, 23, 41],[7, 34],[10, 37, 40],[0, 7, 9, 11, 15, 35],[5, 17, 19, 33],[8, 16, 18, 32, 38],[4, 6, 7, 9, 11, 39],[9, 12, 31, 35, 39],[1, 2, 13, 28],[2, 10, 13, 27, 30, 40],[3, 4, 37],[10, 13, 28],[12, 14, 26, 35],[5, 15, 16],[5, 17, 23, 36, 41],[6, 7, 20],[0, 9, 22, 26, 31, 36],[0, 5, 33, 35],[4, 21, 29],[8, 16, 24],[9, 12, 25, 26],[2, 10, 21, 28],[17, 19, 33]];

var games = {};


function decode(data, gameData) {
	gameID = data.game_id;
	gameData.gameName = data.game_name;

	var parts = data.game_data.split("||");

	gameData.currentIndex = parseInt(parts[0]);

	var indecies = parts[1].split(",");
	gameData.playerOrder = indecies.map(n => parseInt(n));
	gameData.userID = gameData.playerOrder[gameData.currentIndex];

	var ownerStrings = parts[2].split(",");
	var troopsStrings = parts[3].split(",");
	gameData.ownerIndex = ownerStrings.map(n => parseInt(n));
	gameData.troopsOn = troopsStrings.map(n => parseInt(n));

	gameData.stage = parseInt(parts[4]);

	var startingSpare = parts[5].split(",");
	gameData.startingSpare = startingSpare.map(n => parseInt(n));

	gameData.startingPhase = gameData.ownerIndex.includes(-1) || (gameData.startingSpare.filter(n => n != 0).length > 0);
}

function encode(gameData) {
	var str = gameData.currentIndex.toString() + "||";
	str += gameData.playerOrder.toString() + "||";
	str += gameData.ownerIndex.toString() + "||";
	str += gameData.troopsOn.toString() + "||";
	str += gameData.stage.toString() + "||";
	str += gameData.startingSpare.toString();

	return str;
}

function checkConnected(source, dest, gameData) {
	options = [];
	visited = [];

	for (var i = 0; i < adjacencies.length; i++) {
		visited.push(0);
	}
	for (var i = 0; i < adjacent_indecies[source].length; i++) {
		var ind = adjacent_indecies[source][i];
		if (gameData.ownerIndex[ind] == gameData.userID) {
			options.push(ind);
		}
	}
	visited[source] = 1;

	while (options.length > 0) {
		var last = options[options.length-1];

		if (last == dest) {
			return true;
		}

		visited[last] = 1;

		var found = false;
		for (var i = 0; i < adjacent_indecies[last].length; i++) {
			var ind = adjacent_indecies[last][i];
			if (visited[ind] == 0 && gameData.ownerIndex[ind] == gameData.userID) {
				options.push(ind);
				found = true;
				break;
			}
		}

		if (!found) {
			options.splice(options.length-1, 1);
		}
	}

	return false;
}

function adjacent(source, dest, gameData) {
	// if (gameData.stage === 2) {
	// 	return checkConnected(source, dest, gameData);
	// } else {
	// 	return adjacencies[source][dest] == 1;
	// }
	return adjacencies[source][dest] == 1;
}

function mouseDown (index, gameData) {	
	if (index == 255 || gameData.highlightedCountry == -1 || gameData.highlightedCountry != index) {
		return;
	}

	if (gameData.startingPhase) {
		if (gameData.targetCountry == -1) {
			gameData.spareTroops--;
			gameData.targetCountry = index;
			gameData.ownerIndex[index] = gameData.userID;
			gameData.troopsOn[index]++;
		} else if (gameData.targetCountry == index) {
			if (gameData.ownerIndex.includes(-1)) {
				gameData.ownerIndex[gameData.targetCountry] = -1;
			}
			gameData.troopsOn[gameData.targetCountry]--;
			gameData.targetCountry = -1;
			gameData.spareTroops++;
		} else {
			if (gameData.ownerIndex.includes(-1)) {
				gameData.ownerIndex[gameData.targetCountry] = -1;
				gameData.troopsOn[gameData.targetCountry] = 0;
				gameData.targetCountry = index;
				gameData.ownerIndex[index] = gameData.userID;
				gameData.troopsOn[gameData.targetCountry] = 1;
			} else {
				gameData.troopsOn[gameData.targetCountry]--;
				gameData.targetCountry = index;
				gameData.troopsOn[gameData.targetCountry]++;
			}
		}
	} else if (gameData.shouldLocations) {
		if (gameData.shiftDown) {
			if (gameData.sourceCountry == -1 || adjacent(gameData.sourceCountry, index, gameData)) {
				gameData.targetCountry = index;
			}
		} else {
			gameData.sourceCountry = index;
			if (gameData.targetCountry != -1 && !adjacent(gameData.sourceCountry, gameData.targetCountry, gameData)) {
				gameData.targetCountry = -1;
			}
		}
	} else if (gameData.shouldDeploy) {
		if (gameData.shiftDown) {
			if (gameData.troopsOn[index] > gameData.savedTroopsOn[index]) {
				gameData.troopsOn[index] -= 1;
				gameData.spareTroops++;
			}
		} else if (gameData.spareTroops > 0) {
			gameData.troopsOn[index] += 1;
			gameData.spareTroops--;
		}
	} else if (gameData.shouldTransfer) {
		if (index == gameData.sourceCountry && gameData.troopsOn[gameData.targetCountry] > 1) {
			gameData.troopsOn[gameData.targetCountry]--;
			gameData.troopsOn[gameData.sourceCountry]++;
		} else if (index == gameData.targetCountry && gameData.troopsOn[gameData.sourceCountry] > 1) {
			gameData.troopsOn[gameData.sourceCountry]--;
			gameData.troopsOn[gameData.targetCountry]++;
		}
	}
}

function checkHighlightable(index, gameData) {
	if (index == 255) {
		gameData.highlightedCountry = -1;
	} else if (gameData.startingPhase) {
		if (gameData.ownerIndex.includes(-1)) {
			if (gameData.ownerIndex[index] == -1 || index == gameData.targetCountry) {
				gameData.highlightedCountry = index;
			} else {
				gameData.highlightedCountry = -1;
			}
		} else {
			if (gameData.ownerIndex[index] == gameData.userID) {
				gameData.highlightedCountry = index;
			} else {
				gameData.highlightedCountry = -1;
			}
		}
	} else {   
		if (gameData.shouldLocations) {
			if (gameData.shiftDown) {
				if (gameData.targetFriendly && gameData.ownerIndex[index] != gameData.userID) {
					gameData.highlightedCountry = -1;
				} else if (!gameData.targetFriendly && gameData.ownerIndex[index] == gameData.userID) {
					gameData.highlightedCountry = -1;
				} else if (gameData.sourceCountry != -1 && !adjacent(gameData.sourceCountry, index, gameData)) {
					gameData.highlightedCountry = -1;
				} else {
					gameData.highlightedCountry = index;
				}
			} else {
				if (gameData.ownerIndex[index] != gameData.userID || gameData.troopsOn[index] <= 1) {
					gameData.highlightedCountry = -1;
				} else {
					gameData.highlightedCountry = index;
				}
			}
		} else if (gameData.shouldDeploy) {
			if (gameData.ownerIndex[index] == gameData.userID) {
				gameData.highlightedCountry = index;
			} else {
				gameData.highlightedCountry = -1;
			}
		} else if (gameData.shouldTransfer) {
			if (index == gameData.sourceCountry || index == gameData.targetCountry) {
				gameData.highlightedCountry = index;
			} else {
				gameData.highlightedCountry = -1;
			}
		} else {
			gameData.highlightedCountry = -1;
		}
	}
}

function troopsPerTurn(gameData) {
	if (gameData.startingPhase) {
		return 1;
	}

	var terrs = 0;
	var conts = [];
	for (var i = 0; i < cont_terrs.length; i++) {
		conts.push(0);
	}

	for (var i = 0; i < gameData.ownerIndex.length; i++) {
		if (gameData.ownerIndex[i] == gameData.userID) {
			terrs++;
			conts[country_cont[i]]++;
		}
	}

	var troops = Math.floor(terrs / 3);

	for (var i = 0; i < conts.length; i++) {
		if (conts[i] == cont_terrs[i]) {
			troops += cont_troop[i];
		}
	}

	return troops;
}

function saveTroopsOn(gameData) {
	gameData.troopsOn.map((n, i) => gameData.savedTroopsOn[i] = n);
}

function restoreTroopsOn(gameData) {
	gameData.savedTroopsOn.map((n, i) => gameData.troopsOn[i] = n);
}

function performAttack(source, dest, gameData) {
	var attackDice = Math.min(gameData.troopsOn[source], 3);
	var attackRoles = [];
	var defendDice = Math.min(gameData.troopsOn[dest], 2);
	var defendRoles = [];

	for (var i = 0; i < attackDice; i++) {
		var roll = Math.floor(Math.random() * 6) + 1;
		attackRoles.push(roll);
	}

	for (var i = 0; i < defendDice; i++) {
		var roll = Math.floor(Math.random() * 6) + 1;
		defendRoles.push(roll);
	}

	attackRoles.sort((a, b) => b - a);
	defendRoles.sort((a, b) => b - a);

	var i = 0;
	var attackerDmg = 0;
	var defenderDmg = 0;
	while (i < attackRoles.length && i < defendRoles.length) {
		var attack = attackRoles[i];
		var defend = defendRoles[i];

		if (attack > defend) {
			attackerDmg++;
		} else {
			defenderDmg++;
		}

		i++;
	}

	attackerDmg = Math.min(attackerDmg, gameData.troopsOn[dest]);
	defenderDmg = Math.min(defenderDmg, gameData.troopsOn[source]-1);

	takeDamage(dest, attackerDmg, gameData);
	takeDamage(source, defenderDmg, gameData);
}

function takeDamage(terr, dmg, gameData) {
	gameData.troopsOn[terr] -= dmg;
}

function transfer(gameData, ws) {
	gameData.shouldDeploy = false;
	gameData.shouldLocations = false;
	gameData.shouldTransfer = true;

	saveTroopsOn(gameData);

	broadcast(gameData, "data||" + JSON.stringify(gameData, gameDataR));
	ws.send("transfer||");
}

function cancel_transfer(gameData, ws) {
	restoreTroopsOn(gameData);
	gameData.callback(gameData, ws);
}

function endTurn(gameData, ws) {
	gameData.shouldLocations = false;
	gameData.shouldDeploy = false;
	gameData.shouldTransfer = false;
	gameData.sourceCountry = -1;
	gameData.targetCountry = -1;
	ws.send("end||");
}

function playTurn(gameData, ws) {
	saveTroopsOn(gameData);
	gameData.startingPhase = gameData.ownerIndex.includes(-1) || (gameData.startingSpare.filter(n => n != 0).length > 0);
	gameData.stage = 0;
	gameData.userID = gameData.playerOrder[gameData.currentIndex];
	gameData.shouldLocations = false;
	gameData.shouldDeploy = true;
	gameData.spareTroops = troopsPerTurn(gameData);
	updateDatabase(gameData);

	ws.send("playTurn||");
	broadcast(gameData, "data||" + JSON.stringify(gameData));
}

function confirm_deploy(gameData, ws) {
	if (gameData.spareTroops == 0) {
		if (gameData.startingPhase) {
			if (!gameData.ownerIndex.includes(-1)) {
				gameData.startingSpare[gameData.currentIndex]--;
			}

			gameData.currentIndex++;
			if (gameData.currentIndex >= gameData.playerOrder.length) {
				gameData.currentIndex = 0;
			}

			updateDatabase(gameData);
			endTurn(gameData, ws);

			broadcast(gameData, "data||" + JSON.stringify(gameData, gameDataR));

			var newUID = gameData.playerOrder[gameData.currentIndex];
			if (newUID in gameData.connected) {
				ws = gameData.connected[newUID];
				playTurn(gameData, ws);
			}
		} else {
			playAttack(gameData, ws);
		}
	} else if (gameData.startingPhase && gameData.spareTroops == gameData.startingSpare[gameData.currentIndex] - 1) {

	}
}

function playAttack(gameData, ws) {
	gameData.stage = 1;
	gameData.shouldLocations = true;
	gameData.shouldDeploy = false;
	gameData.targetFriendly = false;
	updateDatabase(gameData);

	broadcast(gameData, "data||" + JSON.stringify(gameData, gameDataR));
	ws.send("playAttack||");
}

function confirm_attack(gameData, ws) {
	if (gameData.sourceCountry != -1 && gameData.targetCountry != -1) {
		performAttack(gameData.sourceCountry, gameData.targetCountry, gameData);

		if (gameData.troopsOn[gameData.targetCountry] == 0) {
			gameData.ownerIndex[gameData.targetCountry] = gameData.userID;
			gameData.troopsOn[gameData.targetCountry] = 1;
			gameData.troopsOn[gameData.sourceCountry]--;
			gameData.callback = function (gameData, ws) {
				gameData.sourceCountry = -1;
				gameData.targetCountry = -1;
				playAttack(gameData, ws);
			}
			transfer(gameData, ws);
		} else {
			if (gameData.troopsOn[gameData.sourceCountry] == 1) {
				gameData.sourceCountry = -1;
				gameData.targetCountry = -1;
			}
			broadcast(gameData, "data||" + JSON.stringify(gameData, gameDataR));
		}
	}
}

function cancel_attack(gameData, ws) {
	gameData.sourceCountry = -1;
	gameData.targetCountry = -1;
	broadcast(gameData, "data||" + JSON.stringify(gameData, gameDataR));
}

function finish_attack(gameData, ws) {
	if (gameData.sourceCountry != -1 || gameData.targetCountry != -1) {
		gameData.sourceCountry = -1;
		gameData.targetCountry = -1;
		broadcast(gameData, "data||" + JSON.stringify(gameData, gameDataR));
	} else {
		playReinforce(gameData, ws);
	}
}

function playReinforce(gameData, ws) {
	if (gameData.stage === 2) {
		finish_reinforce(gameData, ws);
		return;
	}

	gameData.stage = 2;
	gameData.sourceCountry = -1;
	gameData.targetCountry = -1;

	gameData.shouldLocations = true;
	gameData.shouldDeploy = false;
	gameData.targetFriendly = true;
	updateDatabase(gameData);

	broadcast(gameData, "data||" + JSON.stringify(gameData, gameDataR));
	ws.send("playReinforce||");
}

function confirm_reinforce(gameData, ws) {
	if (gameData.sourceCountry != -1 && gameData.targetCountry != -1) {
		gameData.callback = playReinforce;
		transfer(gameData, ws);
	}
}

function finish_reinforce(gameData, ws) {
	gameData.currentIndex++;
	if (gameData.currentIndex >= gameData.playerOrder.length) {
		gameData.currentIndex = 0;
	}

	updateDatabase(gameData);
	endTurn(gameData, ws);

	broadcast(gameData, "data||" + JSON.stringify(gameData, gameDataR));

	var newUID = gameData.playerOrder[gameData.currentIndex];
	if (newUID in gameData.connected) {
		ws = gameData.connected[newUID];
		playTurn(gameData, ws);
	}
}

var allowedTag = 1;

function cookieToDict(cookie) {
	var out = {};
	var parts = cookie.split(";");

	for (var i = 0; i < parts.length; i++) {
		parts[i] = parts[i].trim();
		var kv = parts[i].split("=");
		out[kv[0]] = kv[1];
	}

	return out;
}

function broadcast(gameData, msg) {
	for (const uid of Object.keys(gameData.connected)) {
		gameData.connected[uid].send(msg);
	}
}

function connectionEnded(ws) {
	if (!(ws.gid in games)) {
		return;
	}

	var gameData = games[ws.gid];
	var uid = ws.uid;

	if (uid in gameData.connected) {
		console.log("Deleted user: " + uid.toString());
		delete gameData.connected[uid];
	}

	if (Object.keys(gameData.connected).length === 0) {
		console.log("Deleted game: " + gameData.gid.toString());
		delete games[gameData.gid];
	}
}

function gameDataR(key, value) {
	if (key == "connected" || key == "callback") {
		return undefined;
	} else {
		return value;
	}
}

function updateDatabase(gameData) {
	var newData = encode(gameData);
	var gid = gameData.gid;
	con.query("UPDATE games SET `game_data`=? WHERE `game_id`=?;", [newData, gid], function (error, results, fields) {
		var success = results.affectedRows > 0;
		if (!success) {
			broadcast(gameData, "dc||")
			for (const uid of Object.keys(gameData.connected)) {
				connectionEnded(gameData.connected[uid]);
			}
		}
	});
}

wss.on('connection', function (ws) {

	var gameData = {
		gid: 0,
		highlightedCountry:-1, 
		sourceCountry:-1, 
		targetCountry:-1, 
		ownerIndex:[], 
		troopsOn:[], 
		savedTroopsOn:[],
		userID:0, 
		playerOrder:[], 
		currentIndex:0, 
		gameName:"", 
		startingPhase:false, 
		spareTroops:0, 
		shouldLocations:false, 
		shouldDeploy:true, 
		shouldTransfer:false,
		targetFriendly:false,
		shiftDown:false,
		startingSpare:[],
		callback:null,
		stage: 0,
		connected:{}
	};
	ws.uid = -1;
	ws.isAlive = true;
	ws.gid = 0;

	ws.on('close', function() {
		connectionEnded(ws);
	})

	ws.on('pong', function () {
		ws.isAlive = true;
	});

	ws.on('message', function (_message) {
		msgs = [];
		if (_message.indexOf("~~") === -1) {
			msgs.push(_message);
		} else {
			msgs = _message.split("~~");
		}

		for (var i = 0; i < msgs.length; i++) {
			var message = msgs[i];
			var parts = message.split("||");
			var k = parts[0];
			var v = parts[1];

			if (k == "begin") {
				var user = cookieToDict(v);
				con.query('SELECT `user_id`,`current_game` FROM players WHERE `user_name`=? AND `user_password`=?;', [user.name, user.pass], function (error, results, fields) {
					var gid = results[0].current_game;
					ws.uid = parseInt(results[0].user_id);
					ws.send("id||" + ws.uid.toString());
					console.log(ws.uid.toString() + ": id||" + ws.uid.toString());

					if (gid in games) {

						gameData = games[gid];
						gameData.connected[ws.uid] = ws;
						console.log("added player " + ws.uid.toString() + " to game " + gid.toString());

						if (gameData.userID == ws.uid) {
							if (gameData.stage === 0) {
								playTurn(gameData, ws);
							} else if (gameData.stage === 1) {
								playAttack(gameData, ws);
							} else if (gameData.stage === 2) {
								playReinforce(gameData, ws);
							}
						} else {
							ws.send("data||" + JSON.stringify(gameData, gameDataR));
							console.log(ws.uid.toString() + ": data||...");
						}

					} else {

						con.query('SELECT * FROM games WHERE `game_id`=?;', gid, function (error, results, fields) {
							decode(results[0], gameData);
							gameData.gid = gid;
							ws.gid = gid;
							gameData.connected[ws.uid] = ws;
							games[gid] = gameData;

							console.log("created game " + gid.toString() + " and added player " + ws.uid.toString());

							if (gameData.userID == ws.uid) {
								console.log("user " + gameData.userID.toString() + " turn");
								if (gameData.stage === 0) {
									playTurn(gameData, ws);
								} else if (gameData.stage === 1) {
									playAttack(gameData, ws);
								} else if (gameData.stage === 2) {
									playReinforce(gameData, ws);
								}
							} else {
								ws.send("data||" + JSON.stringify(gameData, gameDataR));
								console.log(ws.uid.toString() + ": data||...");
							}
						});

					}
				});
			} else if (k === "move") {
				var index = parseInt(v);
				checkHighlightable(index, gameData);
				ws.send("data||" + JSON.stringify(gameData, gameDataR));
			} else if (k === "shift") {
				gameData.shiftDown = (v === "true");
			} else if (k === "down") {
				var index = parseInt(v);
				mouseDown(index, gameData);
				ws.send("data||" + JSON.stringify(gameData, gameDataR));
			} else if (k === "confirmDeploy") {
				confirm_deploy(gameData, ws);
			} else if (k === "confirmAttack") {
				confirm_attack(gameData, ws);
			} else if (k === "cancelAttack") {
				cancel_attack(gameData, ws);
			} else if (k === "finishAttack") {
				finish_attack(gameData, ws);
			} else if (k === "callback") {
				gameData.callback(gameData, ws);
			} else if (k === "cancelTransfer") {
				cancel_transfer(gameData, ws);
			} else if (k === "confirmReinforce") {
				confirm_reinforce(gameData, ws);
			} else {
				console.log("UNHANDELED: " + k);
			}
		}
	});

	console.log("client connected");

});

const interval = setInterval(function ping() {
	wss.clients.forEach(function (ws) {
		if (ws.isAlive === false) {
			connectionEnded(ws);
			ws.terminate();
		} else {
			ws.isAlive = false;
			ws.ping();
		}
	});
}, 30000);