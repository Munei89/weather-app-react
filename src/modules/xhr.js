export default {
	post: (url, data) => {
		return new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', url, true);

			//Send the proper header information along with the request
			xhr.setRequestHeader(
				'Content-Type',
				'application/json'
			);

			//complete
			xhr.onreadystatechange = function() {
				//Call a function when the state changes.
				if (
					this.status === 200
				) {
					// Request finished. Do processing here.
					return resolve(this.responseText);
				}

				//we got something else
				reject(this.responseText);
			}

			//error
			xhr.onerror = function() {
				reject(this.responseText);
			}

			//send the data
			xhr.send(JSON.stringify(data));
		})
	}
}
