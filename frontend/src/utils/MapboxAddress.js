exports.getMapboxAddress = function(req, res) {
	const address = req.query.address.replace(' ', '%20') + '.json';
	const baseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address;
	const key = 'pk.eyJ1Ijoic2FyYW5zaG1hbnUiLCJhIjoiY2s4ano5cXZjMGk5eDNrbzVobW8xbjR6eSJ9.qgKTjV_vqoRqISEJNzKb9Q';
	const url = baseURL + '?proximity=-20.5937,78.9629?types=address&access_token=' + key;
	request(url, completionHandler(res, 'Fetched daily cases successfully'));
}