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


// From https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

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
				window.location.href = `loginPage.html`
			} else {
				rhit.authManager.signOut();
			}
		})
	}

}

rhit.ListPageController = class {
	constructor() {
		$("#account").click(() => {
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`
			} else{
				window.location.href = `accountPage.html`
			}
		})

		document.querySelector("#fab").addEventListener("click", (event) => {
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`
			} else{
				window.location.href = `addItem.html`
			}
		});

		rhit.fbItemsManager.beginListening(this.updateList.bind(this));
	}

	updateList(){
		console.log("need to update list.");
		console.log(`Num of items = ${rhit.fbItemsManager.length}`);
		// console.log("Example quote = ", rhit.fbItemsManager.getMovieQuoteAtIndex(0) );

		// new List 
		const newList = htmlToElement(' <div id="Container"></div>');
		for (let i =0; i<rhit.fbItemsManager.length;i++){
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
	_createItem(Post){
		return htmlToElement(` <div class = "post px-0 my-4"><img style = "border-radius: 5px;" src="${Post.url}"alt="${Post.name}">
		<div class="text-center h2 col-7" style="padding-right: 10%;">${Post.name}</div></div>`);
	};


}

rhit.DetailPageController = class {
	constructor(){
		$("#account").click(()=>
		{if (!rhit.authManager.isSignedIn) {
			window.location.href = `loginPage.html`
		} else{
			window.location.href = `accountPage.html`
		}
		})

		$("#favoriteBut").click(()=>{
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`
			}
			else{
				if(rhit.inListingPage){
					window.location.href = `ListPage.html`
				}else{
					window.location.href = `savedList.html`
				}
				
			}
			
		})

		$("#contactBut").click(()=>{
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`
			} 
		})

		

		rhit.fbDetailItemManager.beginListening(this.updateView.bind(this));
	}
	
	updateView(){
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
	}
}

rhit.MyPostPageController = class{
	constructor() {
		$("#account").click(() => {
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`
			} else{
				window.location.href = `accountPage.html`
			}
		})
		rhit.fbItemsManager.beginListening(this.updateList.bind(this));
	}

	updateList(){
		console.log("need to update list.");
		console.log(`Num of items = ${rhit.fbItemsManager.length}`);
		rhit.inListingPage=true;
		// console.log("Example quote = ", rhit.fbItemsManager.getMovieQuoteAtIndex(0) );

		// new List 
		const newList = htmlToElement(' <div id="Container"></div>');
		for (let i =0; i<rhit.fbItemsManager.length;i++){
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
	_createItem(Post){
		return htmlToElement(`  <div class = "myPost px-0 my-4">
		<img style = "border-radius: 5px;" src="${Post.url}"alt="${Post.name}">
		<div class="text-center h2 col-7">${Post.name}</div>
	</div>`);
	};
}

rhit.SavedListController = class {
	constructor() {
		$("#account").click(() => {
			if (!rhit.authManager.isSignedIn) {
				window.location.href = `loginPage.html`
			} else{
				window.location.href = `accountPage.html`
			}
		})
		rhit.fbSavedListManager.beginListening(this.updateList.bind(this));
	}

	updateList(){
		console.log("need to update list.");
		console.log(`Num of items = ${rhit.fbSavedListManager.length}`);
		rhit.inListingPage=true;
		// console.log("Example quote = ", rhit.fbItemsManager.getMovieQuoteAtIndex(0) );

		// new List 
		const newList = htmlToElement(' <div id="Container"></div>');
		for (let i =0; i<rhit.fbSavedListManager.length;i++){
			const item = rhit.fbSavedListManager.getItemAtIndex(i);
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
	_createItem(Post){
		return htmlToElement(` <div class = "post px-0 my-4"><img style = "border-radius: 5px;" src="${Post.url}"alt="${Post.name}">
		<div class="text-center h2 col-7" style="padding-right: 10%;">${Post.name}</div></div>`);
	};
}




//Page Controller Ends




//Managers Begin

rhit.FbItemsManager = class {
	constructor(uid){
		this._uid =uid;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_POSTS);
		console.log(this._ref);
		this._documentSnapshots = [];
		this._unsubscribe = null;
	}

	add(name,url){
		this._ref.add({
			[rhit.FB_KEY_IMAGE_URL]: url,
			[rhit.FB_KEY_NAME]: name,
			[rhit.FB_KEY_OWNER]:rhit.fbAuthManager.uid,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(function() {
			console.log("Document successfully written!");
		})
		.catch(function(error) {
			console.error("Error writing document: ", error);
		});
	}

	beginListening(changeListener) {  
		// this._unsubscribe = this._ref.onSnapshot((querySnapshot)=> {
		// 	console.log("test update");
		// 	this._documentSnapshots = querySnapshot.docs;
		// 	   console.log(this._documentSnapshots);
		// 	changeListener();    
		//    });
		let query = this._ref.limit(100);
		if(this._uid){
			query =query.where(rhit.FB_KEY_OWNER, "==", this._uid );
		}

		this._unsubscribe = query
		.onSnapshot((querySnapshot)=> {
			console.log("Movie Quote update");
			this._documentSnapshots = querySnapshot.docs;
			changeListener();    
   		 });
	}

	stopListening() {  
		this._unsubscribe();
	}

	getItemAtIndex(index){
		const docSnapchot = this._documentSnapshots[index];
		const oneitem = new rhit.Post(
			docSnapchot.id,
			docSnapchot.get(rhit.FB_KEY_NAME),
			docSnapchot.get(rhit.FB_KEY_IMAGE_URL),
		);
		return oneitem;
	}

	get length(){
		return this._documentSnapshots.length;
	}
}

rhit.FbSavedListManager = class {
	constructor(){
		this.users = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_POSTS);
		console.log(this._ref);
		this._documentSnapshots = [];
		this._unsubscribe = null;
	}

	add(name,url){
		this._ref.add({
			[rhit.FB_KEY_IMAGE_URL]: url,
			[rhit.FB_KEY_NAME]: name,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
	}

	beginListening(changeListener) {  
		this._unsubscribe = this._ref.onSnapshot((querySnapshot)=> {
			console.log("test update");
			this._documentSnapshots = querySnapshot.docs;
			   console.log(this._documentSnapshots);
			changeListener();    
   		});
	}

	stopListening() {  
		this._unsubscribe();
	}

	getItemAtIndex(index){
		const docSnapchot = this._documentSnapshots[index];
		const oneitem = new rhit.Post(
			docSnapchot.id,
			docSnapchot.get(rhit.FB_KEY_NAME),
			docSnapchot.get(rhit.FB_KEY_IMAGE_URL),
		);
		return oneitem;
	}

	get length(){
		return this._documentSnapshots.length;
	}
}

// rhit.FbMyPostManager = class {
// 	constructor(){
// 		this.users = null;
// 		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_POSTS);
// 		console.log(this._ref);
// 		this._documentSnapshots = [];
// 		this._unsubscribe = null;
// 	}

// 	add(name,url){
// 		this._ref.add({
// 			[rhit.FB_KEY_IMAGE_URL]: url,
// 			[rhit.FB_KEY_NAME]: name,
// 			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
// 		})
// 	}

// 	beginListening(changeListener) {  
// 		this._unsubscribe = this._ref.onSnapshot((querySnapshot)=> {
// 			console.log("test update");
// 			this._documentSnapshots = querySnapshot.docs;
// 			   console.log(this._documentSnapshots);
// 			changeListener();    
//    		});
// 	}

// 	stopListening() {  
// 		this._unsubscribe();
// 	}

// 	getItemAtIndex(index){
// 		const docSnapchot = this._documentSnapshots[index];
// 		const oneitem = new rhit.Post(
// 			docSnapchot.id,
// 			docSnapchot.get(rhit.FB_KEY_OWNER),
// 			docSnapchot.get(rhit.FB_KEY_IMAGE_URL),
// 		);
// 		return oneitem;
// 	}

// 	get length(){
// 		return this._documentSnapshots.length;
// 	}
// }

rhit.FbDetailItemManager = class {
	constructor(id){
	   this._documentSnapshot = {};
	   this._unsubscribe = null;
	   this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_POSTS).doc(id);
		console.log(`Listening to ${this._ref.path}`);
	}

	beginListening(changeListener) {
	   this._unsubscribe = this._ref.onSnapshot((doc) =>{
		   if(doc.exists){
			   console.log("Document data:", doc.data());
			   this._documentSnapshot=doc;
			   changeListener();
		   }else{
			   console.log("No such document");
		   }
	   });
   }

   stopListening() {
	   this._unsubscribe();
   }

   update(Owner, Condition, Name, Description,url ,Type ){
	   this._ref.update({
		   [rhit.FB_KEY_TYPE]: Type,
		   [rhit.FB_KEY_OWNER]: Owner,
		   [rhit.FB_KEY_NAME]: Name,
		   [rhit.FB_KEY_CONDITION]:Condition,
		   [rhit.FB_KEY_DESCRIPTION]: Description,
		   [rhit.FB_KEY_IMAGE_URL]: url,
		   [rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
	   })
	   .then(() => {
		   console.log("Document successfully updated!");
	   })
	   .catch(function(error) {
		   console.error("Error writing document: ", error);
	   });
   
   }

//    delete(){
// 	   return this._ref.delete();
//    }

   get url(){
	   return this._documentSnapshot.get(rhit.FB_KEY_IMAGE_URL);
   }

   get Owner(){
		return this._documentSnapshot.get(rhit.FB_KEY_OWNER);
   }

   get Name(){
		return this._documentSnapshot.get(rhit.FB_KEY_NAME);
   }

   get Condition(){
		return this._documentSnapshot.get(rhit.FB_KEY_CONDITION);
   }

   get Description(){
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
			console.log(this._users);
			changeListener();
		});
	}

	add(user) {
		this._ref.add({
			"name": user.name,
			"uid": user.uid,
			"email": user.email,
		}).then(function (docRef) {
			// this._exist.add(user.uid);
			console.log("Document written with ID: ", docRef.id);
		})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});
	}

	getUser(uid, changeListener) {
		this._ref.where("uid", "==", uid).onSnapshot((snapshot) => {
			const doc = snapshot.docs;
			// console.log("IN GET USER",doc[0].get("uid"),!doc[0]);
			if (!doc || !doc[0]) {
				console.log("TODO: add");
				const currentUser = new rhit.User(uid, "EMAIL", "NAME");
				this.add(currentUser);
			} else {
				const user = new rhit.User(
					doc[0].get("uid"),
					doc[0].get("email"),
					doc[0].get("name")
					);
				rhit.authManager.userInfo = user;
				changeListener();
			}
		});
	}


}

rhit.AuthManager = class {
	constructor() {
		this._user = null;
		this._ref = null;
		this.userInfo = null;
	}

	get isSignedIn() { return !!this._user; }

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged( (user) => {
			this._user = user;
			
			changeListener();

			this.updateUsers();
		});
	}

	updateUsers(){
		if (this._user) {
			rhit.usersManager.getUser(this._user.uid,this.displayUserInfo.bind(this));
			// console.log("IN auth",this._user, !this._user);
			// console.log(user.uid);
			// if (!this._user) {
			// 	const currentUser = new rhit.User(user.uid, "EMAIL", "NAME")
			// 	// rhit.usersManager.add(currentUser);
			// 	this._user = currentUser;
			// }
		}
	}

	displayUserInfo(){
		console.log(this.userInfo);
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
	
	get isSignedIn() { return !!this._user; }
	get uid() { return this._user.uid; }
}
//Managers End


// Objects begins
rhit.User = class {
	constructor(uid, email, name) {
		this.uid = uid;
		this.email = email;
		this.name = name;
	}

	methodName() {

	}
}


rhit.Post = class{
	constructor(id, name, url){
		this.id = id;
		this.name = name;
		this.url = url;
	}
}
//Objects end

//Functions begins
rhit.initializePage = () => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const id = urlParams.get("id");
	// const uid = urlParams.get("uid");
	
	console.log("Current user: ",rhit.authManager._user);
	if (document.querySelector("#loginPage")) {
		console.log("object");
		rhit.startFirebaseUI();
		new rhit.LoginPageController();
	}

	if (document.querySelector("#mainPage")) {
		new rhit.HomePageController();
	}

	if(document.querySelector("#ListPage")){
		console.log("You are on the List page");
		const uid = urlParams.get("uid");
		rhit.fbItemsManager = new rhit.FbItemsManager(uid);
		new rhit.ListPageController();
	}

	if(document.querySelector("#detailPage")){
		rhit.fbDetailItemManager = new rhit.FbDetailItemManager(id);
		new rhit.DetailPageController();
	}

	if(document.querySelector("#savedListPage")){
		console.log("You are on the saveList page");
		rhit.fbSavedListManager = new rhit.FbSavedListManager();
		new rhit.SavedListController();
	}

	if(document.querySelector("#myPostPage")){
		console.log("You are on the post page");
		const uid = urlParams.get("uid");
		rhit.fbItemsManager = new rhit.FbItemsManager(uid);
		new rhit.MyPostPageController();
		// new rhit.ListPageController();
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

	// if(!document.querySelector("#loginPage") && !rhit.authManager.isSignedIn){
	// 	window.location.href = "/";
	// }
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
