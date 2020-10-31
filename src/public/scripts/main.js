/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * PUT_YOUR_NAME_HERE
 */

/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.variableName = "";

rhit.startFirebaseUI = () =>{
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

rhit.initializePage = ()=>{
	// const urlParams = new URLSearchParams(window.location.search);
	// const photoId = urlParams.get("id");
	if(document.querySelector("#loginPage")){
		console.log("object");
			rhit.startFirebaseUI();
			// new rhit.LoginPageController();
		}

		// if(document.querySelector("#PhotoPage")){
		// 	const uid = urlParams.get('uid');
		// 	rhit.photoManager = new rhit.PhotoManager(uid);
		// 	new rhit.PhotoPageController();
		// }

		// if(document.querySelector("#detailPage")){


		// 	if (!photoId){
		// 		window.location.href = "/";
		// 	}

		// 	rhit.singlePhotoManager = new rhit.SinglePhotoManager(photoId);
		// 	new rhit.DetailPageController();
		// }
};

rhit.ClassName = class {
	constructor() {

	}

	methodName() {

	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	rhit.initializePage();
};

rhit.main();
