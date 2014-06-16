/*** @jsx React.DOM */
var APP = React.createClass({
    render: function () {
        return <MainLayout store={this.props.store} />
    }
});

var MainLayout = React.createClass({
    render: function () {
        return <div className="mainLayout" onBlur={this.stopRename}>
            <NavBar />
            <div className="row">
                <div className="large-3 medium-4 columns">
                    <SideBar store={this.props.store} />
                </div>
                <div className="large-9 medium-8 columns">
                    <Content store={this.props.store} />
                </div>
            </div>
        </div>
    },
    stopRename : function  () {
        if (store.renamedFile) {
            store.renamedFile = null;
            view.forceUpdate();
        }
    }
});

var NavBar = React.createClass({
    render: function () {
        return <nav className="top-bar">
          <ul className="title-area">
            <li className="name">
              <h1><a href="#">Cubbyhole</a></h1>
            </li>
          </ul>

          <section className="top-bar-section">
            <ul className="right">
              <li>
                <a href="#">Username</a>
              </li>
              <li>
                <a href="#">
                    <i className="fi-wrench"></i>
                    <span>Settings</span>
                </a>
              </li>
              <li>
                <a href="#"><span className="alert round label">go pro !</span> Upgrade offer</a>
              </li>
            </ul>
          </section>
        </nav>
    }
});

var SideBar = React.createClass({
    render: function () {
        return <div className="page-sidebar">
            <h2>Actions</h2>
            <CreateFolder />
            <ShareFile store={this.props.store}/>
            <UploadFile />                  
        </div>
    }
});

var CreateFolder = React.createClass({
    render: function() {
        return <div>
            <h3>create folder</h3>
            <input ref="folderName" type="text" placeholder="folder name" />
            <button type="button"
                className="radius"
                onClick={this.createFolder}>
                create folder
            </button>
        </div>
    },
    createFolder: function () {
        startAction("ch.file.create", [{isFolder:true, name:this.refs.folderName.getDOMNode().value}])();
    }
});

var UploadFile = React.createClass({
    render: function  () {
        return <div>
            <h3>Upload file </h3>
            <form method="post" action={baseUrl + "/files/raw"} enctype="multipart/form-data">
                <input type="file" name="content"></input>
                <button className="radius" type="submit">Upload</button>
            </form>
        </div>
    }
})

var ShareFile = React.createClass({
    render: function() {
        return <div>
            <h3>share file</h3>
            <input ref="accountId" type="text" placeholder="account id" />
            <select ref="file">
                {
                    this.props.store.files.map(function (file) {
                        return file.isFolder === false ? <option value={file.id}>{file.name}</option> : ""
                    })
                }
            </select>
            <select ref="permission">
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
                <option value="LINK">LINK</option>
                <option value="PERM">PERM</option>
            </select>
            <button type="button"
                className="radius"
                onClick={this.shareFile}>
                share file
            </button>
        </div>
    },
    shareFile: function () {
        startAction("ch.file.share", [{
            fileId: this.refs.file.getDOMNode().value,
            accountId: this.refs.accountId.getDOMNode().value,
            permission: this.refs.permission.getDOMNode().value
        }])();
    }
})



var Content = React.createClass({
    render: function () {
        return <div className="page-content">
            <FileViewer store={this.props.store} />
            {store.showShares ? <SharesViewer store={this.props.store} /> : null}
            {store.showShareLink ? <ShareLink store={this.props.store} /> : null}
        </div>
    }
});


var SharesViewer = React.createClass({
    render: function () {
        return <div className="panel callout radius">
            <span className="closePanel" onClick={this.closePanel}>×</span>
            <h4>Shares</h4> 
            {
                this.props.store.shares.map(function (share) {
                    return <Share share={share} />
                })
            }
        </div>
    },
    closePanel : function () {
        store.showShares = false;
        view.forceUpdate();
    }
})


var Share = React.createClass({
    render: function () {
        return <div>
            <span>{store.accounts[this.props.share.account].username}&nbsp;</span>
            <span>{this.props.share.permission}&nbsp;</span>
        </div>
    }
})

var FileViewer = React.createClass({
    render: function () {
        return <div>
        <h2>Files</h2>
            {
                this.props.store.currentFile && (this.props.store.currentFile.parent !== 0) ? 
                <button onClick={this.getParent} className="radius">
                    parent folder
                </button> : null
            }

            {
                this.props.store.files.map(function (file) {
                    return <File file={file} />
                })
            }
        </div>
    },
    getParent: function () {
        startAction('ch.file.openParent')();
    }
});

var File = React.createClass({
    render: function () {
        return <div 
        className="file"
        draggable="true"
        onDragEnd={this.dragEnd}
        onDragStart={this.dragStart}
        onDragOver={this.props.file.isFolder ? this.dragOver : null}
        onDrop={this.props.file.isFolder ? this.drop : null}
        >
            <span className="fileInfos">
                <img className="fileImage" src={this.props.file.isFolder ? "app/assets/folder.png" : "app/assets/file.png"} />
                {this.props.file === store.renamedFile ? 
                    <form onSubmit={this.rename}>
                        <input type="text" ref="fileName"></input>
                    </form> : 
                    <span className="fileName" onDoubleClick={this.props.file.isFolder ? this.openFolder : null}>{this.props.file.name}&nbsp;</span>}
                <span>{this.props.file.cdate.toLocaleString()}&nbsp;</span>
            </span>
            <span className="fileActions">
                <span onClick={this.renderRenameInput}>rename&nbsp;</span>
                <span onClick={startAction("ch.file.delete", [this.props.file])}>delete&nbsp;</span>
                <span onClick={startAction("ch.file.copy", [this.props.file])}>copy&nbsp;</span>
                {this.props.file.isFolder ? null : <span onClick={this.generateShareLink}>show share link&nbsp;</span>}
                {this.props.file.isFolder ? null : <span onClick={this.getShares}>show perms&nbsp;</span>}
                {this.props.file.isFolder ? null : <span><a href={baseUrl + "/files/" + this.props.file.id + "/raw"}>download</a></span>}
            </span>
        </div>
    },
    openFolder : function () {
        startAction('ch.file.openFolder', [this.props.file])();
    },
    getShares : function () {
        startAction('ch.file.getShares', [this.props.file])();
    },
    generateShareLink : function () {
        if (this.props.file.permalink) {
            startAction('ch.file.showShareLink', [this.props.file])();
        }
        else {
            startAction('ch.file.generateShareLink', [this.props.file])();
        }
    },
    renderRenameInput : function  (e) {
        e.stopPropagation();
        store.renamedFile = this.props.file;
        view.forceUpdate();
    },
    rename : function  (e) {
        e.preventDefault();
        startAction('ch.file.rename', [{file : this.props.file , name : this.refs.fileName.getDOMNode().value}])();
    },
    dragStart: function(e) {
        e.nativeEvent.dataTransfer.setData("text", this.props.file.id);
    },
    dragEnd: function(e) {

    },
    dragOver: function(e) {
        e.preventDefault();
    },
    drop: function  (e) {
        e.preventDefault()
        var dropId = this.props.file.id;
        var fileId = Number(e.nativeEvent.dataTransfer.getData('text'))
        startAction('ch.file.drop', [{fileId: fileId, dropId: dropId}])();
    },
    download: function  () {
        startAction('ch.file.download', [this.props.file])();
    }
});


var ShareLink = React.createClass({
    render: function () {
        return <div id="sharePanel" className="panel callout radius">
        <span className="closePanel" onClick={this.closePanel}>×</span>
            <h4>Public link</h4>
            <span>{this.props.store.shareLink}</span>
        </div>
    },
    closePanel : function () {
        store.showShareLink = false;
        view.forceUpdate()
    }
});

view = React.renderComponent(<APP store={store}/>, document.getElementById('main'));
