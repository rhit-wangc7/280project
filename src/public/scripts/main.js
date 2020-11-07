/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * PUT_YOUR_NAME_HERE
 */

/** namespace. */
var rhit = rhit || {};
rhit.FB_COLLECTION_POSTS = "Posts";
rhit.FB_COLLECTION_USERS = "Users";
rhit.FB_KEY_DESCRIPTION = "Description";
rhit.FB_KEY_CONDITION = "Condition";
rhit.FB_KEY_IMAGE_URL = "imageUrl";
rhit.FB_KEY_TYPE = "Type";
rhit.FB_KEY_NAME = "Name";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.FB_KEY_OWNER = "Owner";
rhit.fbItemsManager = null;
rhit.fbDetailItemManager = null;
rhit.fbSavedListManager = null;
rhit.fbMyPostManager = null;
rhit.inListingPage = false;
/** globals */
rhit.variableName = "";


rhit.startFirebaseUI = () => {
	// FirebaseUI config.
	var uiConfig = {
		signInSuccessUrl: '/',
		signInOptions: [
			// Leave the lines as is for the providers you want to offer your users.
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
			firebase.auth.PhoneAuthProvider.PROVIDER_ID,
			firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
		]

	};

	var ui = new firebaseui.auth.AuthUI(firebase.auth());
	// The start method will wait until the DOM is loaded.
	ui.start('#firebaseui-auth-container', uiConfig);
}

//Page Controller Begins
rhit.HomePageController = class {
	constructor() {


		$("#account").click(() => {
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`;
			} else {
				window.location.href = `accountPage.html`;
			}
		})


		$("#myListButton").click(() => {
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`
			} else {
				// console.log("clicked");
				// $("#myList").css("color", "#FF5722");
				// $("#discovery").css("color", "grey");

				window.location.href = "/savedList.html";
			}
		});

	}

}

rhit.ListPageController = class {
	constructor() {
		$("#account").click(() => {
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`
			} else {
				window.location.href = `accountPage.html`
			}
		})

		document.querySelector("#fab").addEventListener("click", (event) => {
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`
			} else {
				window.location.href = `addItem.html`
			}
		});

		rhit.fbItemsManager.beginListening(this.updateList.bind(this));
	}

	updateList() {
		console.log("need to update list.");
		console.log(`Num of items = ${rhit.fbItemsManager.length}`);
		// console.log("Example quote = ", rhit.fbItemsManager.getMovieQuoteAtIndex(0) );

		// new List 
		const newList = htmlToElement(' <div id="Container"></div>');
		for (let i = 0; i < rhit.fbItemsManager.length; i++) {
			const item = rhit.fbItemsManager.getItemAtIndex(i);
			console.log(item.name);
			const newItem = this._createItem(item);

			newItem.onclick = (event) => {
				console.log(`you clicked on ${item.id}`);
				window.location.href = `/DetailPage.html?id=${item.id}`;
				console.log("you are in the detail page");

			}
			newList.appendChild(newItem);
		}
		const oldList = document.querySelector("#Container");
		// Put in the new quoteListContainer
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);

	}
	_createItem(Post) {
		return htmlToElement(` <div class = "post px-0 my-4">
		<img style = "border-radius: 2em;" src="${Post.url}"alt="${Post.name}">
		<div class="text-center h2 col-7" style="padding-right: 10%;">${Post.name}</div></div>`);
	};


}

rhit.DetailPageController = class {
	constructor(id) {
		$("#account").click(() => {
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`
			} else {
				window.location.href = `accountPage.html`
			}
		})

		$("#favoriteBut").click(() => {
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`
			}
			else {
				rhit.fbDetailItemManager.saveToList();
				console.log("Clicked Svaed");

			}
		})

		$("#menuEdit").click(() => {
			if (rhit.authManager.isSignedIn) {
				window.location.href = `addItem.html?id=${id}`;
			}
		})


		$("#contactBut").click(() => {
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`
			}
		})

		$("#submitDeleteItem").click((event) => {
			rhit.fbDetailItemManager.delete().then(() => {
				window.history.back(-1);
			}).catch((error) =>{
				console.log('Error');
			});;
		});

		rhit.fbDetailItemManager.beginListening(this.updateView.bind(this));
	}

	updateView() {
		console.log(rhit.fbDetailItemManager.Description);
		document.getElementById("Name").innerText = `Name:${rhit.fbDetailItemManager.Name}`;
		document.getElementById("Owner").innerText = `Owner:${rhit.fbDetailItemManager.Owner}`;
		// document.getElementById("Email").innerText = `Owner:${rhit.fbDetailItemManager.Email}`;
		document.getElementById("Condition").innerText = `Condition: ${rhit.fbDetailItemManager.Condition}`;
		document.getElementById("Description").innerText = `Description: ${rhit.fbDetailItemManager.Description}`;
		document.getElementById("myImg").src = rhit.fbDetailItemManager.url;


	}

}





rhit.LoginPageController = class {
	constructor() {
		$("#loginButton").click(() => {
			rhit.authManager.signIn();
		})

		$("#loginback").click(() => {
			if (rhit.authManager.isSignedIn) {
				window.history.back(-1);
				// console.log("Oh!");
			} else {
				window.location.href = "/";
			}
		})
	}
}


rhit.accountPageController = class {
	constructor() {
		const name = rhit.authManager.name;
		const email = rhit.authManager.email;
		const URL = rhit.authManager.photoURL;


		$("#nameInput").val(name);
		$("#emailInput").val(email);
		$("#urlInput").val(URL);
		$(".userImage").attr('src', URL);


		$("#submitInfoChange").click(() => {
			const newName = $("#nameInput").val();
			const newEmail = $("#emailInput").val();
			const newURL = $("#urlInput").val();



			if (newEmail && email != newEmail) {
				console.log("Email");
				rhit.authManager.setEmail(newEmail, () => {
					$("#emailInput").val(email);
				});
			}
			console.log((name || URL));
			if ((newName && name != newName) || (newURL && URL != newURL)) {
				console.log("Name");
				rhit.authManager.setProfile(newName, newURL, () => {
					$(".userImage").attr('src', newURL);
				}, () => {
					$("#nameInput").val(name);
					$("#urlInput").val(URL);
				});
			}

			// window.history.back(-1);



		})


		// Button Listener
		$("#saveListButton").click(() => {
			window.location.href = "/savedList.html";
		});

		$("#myPostButton").click(() => {
			window.location.href = `listPage.html?uid=${rhit.authManager.uid}`;
		});

		$("#signOutButton").click(() => {
			rhit.authManager.signOut();
			window.location.href = "/loginPage.html";
		});


	}

}


rhit.SavedListController = class {
	constructor() {
		$("#account").click(() => {
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`
			} else {
				window.location.href = `accountPage.html`
			}
		})
		// console.log(rhit.authManager.saveList);
		rhit.fbItemsManager.beginListening(this.updateList.bind(this));

	}

	updateList() {
		const array = rhit.authManager.saveList;
		console.log( rhit.authManager.userInfo.saveList);


		// new List 
		const newList = htmlToElement(' <div id="Container"></div>');
		for (let i = 0; i < rhit.fbItemsManager.length; i++) {
			const item = rhit.fbItemsManager.getItemAtIndex(i);
			if (!array.includes(item.id)) {
				continue;
			}
			const newItem = this._createItem(item);

			newItem.onclick = (event) => {
				console.log(`you clicked on ${item.id}`);
				window.location.href = `/DetailPage.html?id=${item.id}`;
				console.log("you are in the detail page");

			}
			newList.appendChild(newItem);
		}
		const oldList = document.querySelector("#Container");
		// Put in the new quoteListContainer
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);

	}
	_createItem(Post) {
		return htmlToElement(` <div class = "post px-0 my-4">
		<img style = "border-radius: 2em;" src="${Post.url}"alt="${Post.name}">
		<div class="text-center h2 col-7" style="padding-right: 10%;">${Post.name}</div></div>`);
	};

}

rhit.AddItemController = class {
	constructor(id) {
		this.itemId = id;
		$("#account").click(() => {
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`
			} else {
				window.location.href = `accountPage.html`
			}
		});
		$("#submitButton").click(() => {
			if (!this.itemId) {
				const url = $("#inputImageUrl").val();
				const condition = $("#inputCondition").val();
				const item = document.querySelector("#inputItem").value;
				const category = document.querySelector("#inputCat").value;
				const desc = document.querySelector("#inputDes").value;
				rhit.fbItemsManager.add(url, condition, item, category, desc)
					.then(function () {
						console.log("Document successfully written!");
						window.location.href = `ListPage.html`;

					})
					.catch(function (error) {
						console.error("Error writing document: ", error);
					});
				// window.location.href = `ListPage.html`;
			
			}else{
				const url = $("#inputImageUrl").val();
				const condition = $("#inputCondition").val();
				const item = document.querySelector("#inputItem").value;
				const category = document.querySelector("#inputCat").value;
				const desc = document.querySelector("#inputDes").value;
				rhit.fbDetailItemManager.update(condition, item,desc ,url);
				}
			});
			

	}
	updateView(){
		if(!this.itemId){
			console.log("No id");
			return;
		}
		console.log(this.itemId);
		var docRef = firebase.firestore().collection("Posts").doc(this.itemId);
		docRef.get().then(function(doc) {
			if (doc.exists) {
				console.log("Document data:", doc.data());
				$("#inputItem").val(doc.data().Name);
				$("#inputImageUrl").val(doc.data().imageUrl);
				$("#inputCat").val(doc.data().imageUrl);
				$("#inputDes").val(doc.data().Description);
				$("#inputCondition").val(doc.data().Condition);
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		}).catch(function(error) {
			console.log("Error getting document:", error);
		});

		// document.querySelector("#input-item").innerHTML = rhit.fbItemsManager.Name;
		// document.querySelector("#input-cat").innerHTML = rhit.fbItemsManager.Category;
		// document.querySelector("#input-des").innerHTML = rhit.fbItemsManager.Description;
		// document.querySelector("#input-condition").innerHTML = rhit.fbItemsManager.Condition;
	}
		
}


//Page Controller Ends




//Managers Begin

rhit.FbItemsManager = class {
	constructor(uid) {
		this._uid = uid;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_POSTS);
		console.log(this._ref);
		this._documentSnapshots = [];
		this._unsubscribe = null;
	}

	add(url, name, category, description, condition) {
		return this._ref.add({
			[rhit.FB_KEY_IMAGE_URL]: url,
			[rhit.FB_KEY_NAME]: name,
			[rhit.FB_KEY_CONDITION]: condition,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			[rhit.FB_KEY_DESCRIPTION]: description,
			[rhit.FB_KEY_CATEGORY]: category,

			"Owner": rhit.authManager.uid
		});
	}

	beginListening(changeListener) {
		let query = this._ref.limit(100);
		if (this._uid) {
			query = query.where(rhit.FB_KEY_OWNER, "==", this._uid);
		}

		this._unsubscribe = query
			.onSnapshot((querySnapshot) => {
				console.log("Movie Quote update");
				this._documentSnapshots = querySnapshot.docs;
				changeListener();
			});
	}

	stopListening() {
		this._unsubscribe();
	}

	getItemAtIndex(index) {
		const docSnapchot = this._documentSnapshots[index];
		const oneitem = new rhit.Post(
			docSnapchot.id,
			docSnapchot.get(rhit.FB_KEY_NAME),
			docSnapchot.get(rhit.FB_KEY_IMAGE_URL),
		);
		return oneitem;
	}

	get length() {
		return this._documentSnapshots.length;
	}
}

rhit.FbSavedListManager = class {
	constructor() {
		this.users = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_POSTS);
		console.log(this._ref);
		this._documentSnapshots = [];
		this._unsubscribe = null;
	}

	add(name, url) {
		this._ref.add({
			[rhit.FB_KEY_IMAGE_URL]: url,
			[rhit.FB_KEY_NAME]: name,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.onSnapshot((querySnapshot) => {
			console.log("test update");
			this._documentSnapshots = querySnapshot.docs;
			console.log(this._documentSnapshots);
			changeListener();
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	getItemAtIndex(index) {
		const docSnapchot = this._documentSnapshots[index];
		const oneitem = new rhit.Post(
			docSnapchot.id,
			docSnapchot.get(rhit.FB_KEY_NAME),
			docSnapchot.get(rhit.FB_KEY_IMAGE_URL),
		);
		return oneitem;
	}

	get length() {
		return this._documentSnapshots.length;
	}
}

rhit.FbDetailItemManager = class {
	constructor(id) {
		this._id = id;
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_POSTS).doc(id);
		console.log(`Listening to ${this._ref.path}`);
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Document data:", doc.data());
				this._documentSnapshot = doc;
				changeListener();
			} else {
				console.log("No such document");
			}
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	saveToList(){
		rhit.authManager.saveToList(this._id);
		console.log("Called authManager");
	}

	delete(){
		return this._ref.delete();
	}

	update(Condition, Name, Description, url) {
		this._ref.update({
			// [rhit.FB_KEY_CATEGORY]: Type,
			[rhit.FB_KEY_NAME]: Name,
			[rhit.FB_KEY_CONDITION]: Condition,
			[rhit.FB_KEY_DESCRIPTION]: Description,
			[rhit.FB_KEY_IMAGE_URL]: url,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
			.then(() => {
				console.log("Document successfully updated!");
			})
			.catch(function (error) {
				console.error("Error writing document: ", error);
			});

	}


	get url() {
		return this._documentSnapshot.get(rhit.FB_KEY_IMAGE_URL);
	}

	get Owner() {
		return this._documentSnapshot.get(rhit.FB_KEY_OWNER);
	}

	get Name() {
		return this._documentSnapshot.get(rhit.FB_KEY_NAME);
	}

	get Condition() {
		return this._documentSnapshot.get(rhit.FB_KEY_CONDITION);
	}

	get Description() {
		return this._documentSnapshot.get(rhit.FB_KEY_DESCRIPTION);
	}
}



rhit.UsersManager = class {
	constructor() {
		this._ref = firebase.firestore().collection("Users");
		this._users = null;
		// this._user = null;
	}

	beginListening(changeListener) {

		this._ref.onSnapshot((querySnapshot) => {
			this._users = querySnapshot.docs;
			// console.log(this._users);
			changeListener();
		});
	}

	add(user) {
		return this._ref.doc(user.uid).set({
			"saveList": user.saveList,
			"uid": user.uid,
		});
	}

	update(user) {
		console.log("about to update");
		this._ref.doc(user.uid).update({
			"saveList": user.saveList

		}).then(() => {
			console.log("Successful!");
		})
			.catch(function (error) {
				console.error("Error editing document: ", error);
			});
	}

	getUser(uid, changeListener) {
		this._ref.where("uid", "==", uid).onSnapshot((snapshot) => {
			const doc = snapshot.docs;
			// console.log("IN GET USER",doc[0].get("uid"),!doc[0]);
			if (!doc || !doc[0]) {
				// console.log("TODO: add");
				// const email = rhit.authManager.email ? rhit.authManager.email : null;
				// const name = rhit.authManager.name ? rhit.authManager.name : null;
				const currentUser = new rhit.User(uid,[]);
				this.add(currentUser).then(function (docRef) {
					// this._exist.add(user.uid);
					// console.log("Document written with ID: ", docRef.id);
					rhit.authManager.userInfo = currentUser;
					
				}).catch(function (error) {
					console.error("Error adding document: ", error);
				});
			} else {
				const user = new rhit.User(
					doc[0].get("uid"),
					doc[0].get("saveList")
					)
					// console.log("Return from data base. User:", user.saveList);
				rhit.authManager.userInfo = user;
			}
			console.log("");
			changeListener();
		});
	}


}

rhit.AuthManager = class {
	constructor() {
		this._user = null;
		this._ref = null;
		this.userInfo = null;
		this._initializePage = null;
	}

	get isSignedIn() { return !!this._user; }
	get email() { return this._user.email; }
	get name() { return this._user.displayName; }
	get isSignedIn() { return !!this._user; }
	get uid() { return this._user.uid; }
	get photoURL() { return this._user.photoURL; }
	get phoneNum() { return this._user.phoneNum; }
	get saveList() { return this.userInfo.saveList; }

	saveToList(id) {
		this.userInfo.addToSaveList(id);
		console.log("To call usermanager with: ", this.userInfo);
		rhit.usersManager.update(this.userInfo);
	}

	setProfile(name, url, success, fail) {
		this._user.updateProfile({
			displayName: name,
			photoURL: url
		}).then(function () {
			success();
			alert("Updated Successfully");
		}).catch(function (error) {
			console.error("Fail to update", error);
			alert(`Fail to update`);
			fail();
		});
	}

	setEmail(value, fail) {
		this._user.updateEmail(value).then(function () {
			alert("Updated Successfully");
		}).catch(function (error) {
			console.error("Fail to update", error);
			alert("Fail to update.");
			fail();
		});
	}




	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			this.initializePage = changeListener;
			
			this.updateUsers();
			if(!user){
				changeListener();
			}
			
		});
	}



	updateUsers() {
		if (this._user) {
			rhit.usersManager.getUser(this._user.uid, this.displayUserInfo.bind(this));
			// console.log("IN auth",this._user, !this._user);
			// console.log(user.uid);
			// if (!this._user) {
			// 	const currentUser = new rhit.User(user.uid, "EMAIL", "NAME")
			// 	// rhit.usersManager.add(currentUser);
			// 	this._user = currentUser;
			// }
		}
	}

	displayUserInfo() {
		console.log("Redirecting");
		this.initializePage(); //call initialize page after all auth things finished
	}




	signIn() {
		Rosefire.signIn("74985a80-f480-41ce-84da-50c75363cbe0", (err, rfUser) => {
			if (err) {
				console.log("Rosefire error!", err);
				return;
			}
			console.log("Rosefire success!", rfUser);

			// Next use the Rosefire token with Firebase auth.
			firebase.auth().signInWithCustomToken(rfUser.token).catch((error) => {
				if (error.code === 'auth/invalid-custom-token') {
					console.log("The token you provided is not valid.");
				} else {
					console.log("signInWithCustomToken error", error.message);
				}
			}); // Note: Success should be handled by an onAuthStateChanged listener.
		});

	}

	signOut() {
		firebase.auth().signOut().catch(function (error) {
			console.log("error");
		});
	}

}
//Managers End


// Objects begins
rhit.User = class {
	constructor(uid,saveList) {
		this.uid = uid;
		this.saveList = saveList;
	}

	addToSaveList(id) {
		console.log(this.saveList, " should add ",id);
		this.saveList.push(id);
	}
}


rhit.Post = class {
	constructor(id, name, url) {
		this.id = id;
		this.name = name;
		this.url = url;
	}
}
//Objects end

//Functions begins

// From https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.initializePage = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get("id");
	const uid = urlParams.get("uid");

	console.log("Current user: ", rhit.authManager._user);
	if (document.querySelector("#loginPage")) {
		rhit.startFirebaseUI();
		new rhit.LoginPageController();
	}

	if (document.querySelector("#mainPage")) {
		new rhit.HomePageController();
	}

	if (document.querySelector("#ListPage")) {
		console.log("You are on the List page");
		rhit.fbItemsManager = new rhit.FbItemsManager(uid);
		new rhit.ListPageController();
	}

	if (document.querySelector("#detailPage")) {
		rhit.fbDetailItemManager = new rhit.FbDetailItemManager(id);
		new rhit.DetailPageController(id);

	}

	if (document.querySelector("#accountPage")) {
		new rhit.accountPageController();

	}

	if (document.querySelector("#savedListPage")) {
		console.log("You are on the saveList page");
		rhit.fbItemsManager = new rhit.FbItemsManager();
		new rhit.SavedListController();
	}

	if (document.querySelector("#addItem")) {
		rhit.addItemController = new rhit.AddItemController(id);
		rhit.addItemController.updateView();
		rhit.fbItemsManager = new rhit.FbItemsManager(uid);
		rhit.fbDetailItemManager = new rhit.FbDetailItemManager(id);
	}

	// if(document.querySelector("#detailPage")){


	// 	if (!photoId){
	// 		window.location.href = "/";
	// 	}

	// 	rhit.singlePhotoManager = new rhit.SinglePhotoManager(photoId);
	// 	new rhit.DetailPageController();
	// }
};

rhit.checkForRedirects = () => {
	if (document.querySelector("#loginPage") && rhit.authManager.isSignedIn) {
		window.location.href = "javascript:history.back(-1)";
		console.log(rhit.authManager._user);
	}

	if (!document.querySelector("#loginPage") && !document.querySelector("#mainPage") && !document.querySelector("#ListPage")
		&& !document.querySelector("#detailPage") && !rhit.authManager.isSignedIn) {
		window.location.href = "/";
	}
}
//Functions end


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	rhit.usersManager = new rhit.UsersManager();
	rhit.usersManager.beginListening(() => { });
	rhit.authManager = new rhit.AuthManager();
	// rhit.authManager.signOut();
	rhit.authManager.beginListening(() => {
		rhit.checkForRedirects();
		rhit.initializePage();
	});
};

rhit.main();
