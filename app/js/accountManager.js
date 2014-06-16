var AccountManager = function (baseUrl, http) {
	this.http = http;
	this.baseUrl = baseUrl;
}

AccountManager.prototype.getAccountById = function(userId) {
	return this.http({
		url: this.baseUrl + '/accounts/partial/by-id/' + userId,
		method: 'GET'
	});
}

AccountManager.prototype.whoami = function () {
    return this.http({
        url: this.baseUrl + '/accounts/whoami'
    });
};
