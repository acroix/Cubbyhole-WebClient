var view = null;
var req = (function($http, authBase64) {
    return function(config) {
        if (typeof config !== 'object')
            config = {}

        config.headers = config.headers || {};
        config.headers.Authorization = authBase64;
        config.type = 'json';
        res = $http(config);
        res.catch = res.fail;
        return res;
    }
})(reqwest, 'Basic dXNlcjpwYXNz');

var store = {}
store.files = []
store.currentFile = null;
store.shares = [];
store.accounts = {};
store.shareLink = "";
store.renamedFile = {}

var baseUrl = "http://37.187.46.33/api/v1";

var fileManager = new FileManager(baseUrl, req);
var accountManager = new AccountManager(baseUrl, req);


fileManager.list().then(function (files) {
    return files.map(function (file) {
        file.cdate = new Date(file.cdate);
        return file;
    })
}).then(function (files) {
    store.files = files;
    view.forceUpdate();
});

var dispatcher = new EventEmitter();

dispatcher.on('ch.file.create', function (opts) {
    if (opts.isFolder) {
        fileManager.add(
            opts.isFolder, 
            opts.name, store.currentFile ? store.currentFile.id : 0
        ).then(function (file) {
            store.files.push(file);
            view.forceUpdate();
        }).catch(function (error) {
            console.error(error);
        })
    }
});

dispatcher.on('ch.file.delete', function (file) {
    fileManager.delete(file.id).then(function (response) {
        store.files.splice(store.files.indexOf(file), 1);
        view.forceUpdate();
    }).catch(function (error) {
        console.error(error);
    })
});

dispatcher.on('ch.file.copy', function (file) {
    fileManager.copy(file).then(function (file) {
        store.files.push(file)
        view.forceUpdate();
    }).catch(function (error) {
        console.error(error);
    })
});

dispatcher.on('ch.file.openFolder', function (file) {
    fileManager.list(file.id).then(function (files) {
        store.showShares = false;
        store.currentFile = file;
        store.files = files;
        view.forceUpdate();
    }).catch(function (error) {
        console.error(error);
    })
});

dispatcher.on('ch.file.openParent', function (currentFile) {
    if (store.currentFile) {
        fileManager.getFileById(store.currentFile.parent).then(function (file) {
            dispatcher.trigger('ch.file.openFolder', [file]);
        })
    }
}); 

dispatcher.on('ch.file.share', function (opts) {
    fileManager.share(
        opts.fileId, 
        opts.accountId, 
        opts.permission
    ).then(function (share) {
        store.shares.push(share)
    }).catch(function (error) {
        console.error(error);
    });
});

dispatcher.on('ch.file.getShares', function (file) {
    fileManager.getShares(file.id).then(function (shares) {
        if (shares.length > 0) {
            for (var i = 0; i < shares.length; i++) {
                accountManager.getAccountById(shares[i].account)
                    .then(function (account) {
                        store.shares = shares;
                        store.accounts[account.id] = account;
                        store.showShares = true;
                        view.forceUpdate();
                    });
            }
        }
    }).catch(function (error) {
        console.error(error)
    })
});


dispatcher.on('ch.file.generateShareLink', function (file) {
    fileManager.generateShareLink(file.id).then(function (file) {
        dispatcher.trigger('ch.file.showShareLink', [file]);
    })
});

dispatcher.on('ch.file.showShareLink', function  (file) {
    store.shareLink = baseUrl + '/f/' + file.permalink;;
    store.showShareLink = true;
    view.forceUpdate();
});

dispatcher.on('ch.file.rename', function  (opts) {
    fileManager.rename(opts.file.id, opts.name).then(function  (file) {
        opts.file.name = file.name;
        store.renamedFile = null;
        view.forceUpdate();
    });
});

function startAction(name, args) {
    return function () {
        console.log('CALL TO ACTION :', name)
        dispatcher.trigger(name, args);
    }
}
