import {
    auth,
    getAuth,
    storage,
    ref,
    db,
    onAuthStateChanged,
    updateProfile,
    updateEmail,
    uploadBytes,
    getDownloadURL,
    doc,
    setDoc,
    listAll,
    addDoc,
    getDoc,
    getDocs,
    collection
} from "../firebase.js";


function init() {


    onAuthStateChanged(auth, (user) => {
        const userName = document.getElementById("userName");
        const userEmail = document.getElementById("userEmail");
        const userPhoto = document.getElementById("userPhoto");

        const fnamePlaceholder = document.getElementById("updateFName");
        const snamePlaceholder = document.getElementById("updateSName");
        const emailPlaceholder = document.getElementById("updateEmail");


        if (user) {
            const uid = user.uid;
            //-------------get User picture--------\\
            // getDownloadURL(ref(storage, `users/${uid}/profile/photo`))
            //     .then((url) => {
            //         const userPhoto = document.getElementById("userPhoto");
            //
            //     })
            //     .catch((error) => {
            //         // Handle any errors
            //     });

            //-----------------Check Sign In user------------\\

            const displayName = user.displayName;
            const displayEmail = user.email;
            const displayPhoto = user.photoURL
                ? user.photoURL
                : "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg";
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            if (displayName !== '') {
                const [firstName, lastName] = displayName.split(' ');
                fnamePlaceholder.value = firstName;
                snamePlaceholder.value = lastName;
            }
            console.log(displayName);

            userName.innerHTML = displayName;
            userEmail.innerHTML = displayEmail;
            userPhoto.src = displayPhoto;

            emailPlaceholder.value = displayEmail;
            recipes();
        }
    });
}

updateButton.addEventListener("click", () => {
    const file = document.getElementById("photoFile").files.length;
    console.log(file);
    if (file > 0) {
        userUpdatePhoto();
        console.log('there photo');
        updateUserEmail();
    } else {
        console.log('there NO photo');
        userUpdate();
        updateUserEmail();
    }
    window.top.location.reload(true);
});

//-----------------------Upload Photo-----------------------\\

function userUpdatePhoto() {
    const photo = document.getElementById("photoFile").files[0];
    const user = auth.currentUser;
    const uid = user.uid;
    const profilePhoto = ref(storage, `users/${uid}/profile/photo`);

    if (user) {
        uploadBytes(profilePhoto, photo)
            .then((snapshot) => {
                console.log("Uploaded a blob or file!");
                getDownloadURL(ref(storage, `users/${uid}/profile/photo`))
                    .then((url) => {
                        console.log('photo updated');
                        userUpdate(url);
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log('URL photo:' + errorCode + errorMessage);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + errorMessage);
            });
    }

}

//----------------------Update User info-------------------\\
function userUpdate(photoStorage) {
    const fname = document.getElementById("updateFName").value;
    const sname = document.getElementById("updateSName").value;
    const user = auth.currentUser;
    const name = `${fname} ${sname}`;
    console.log(name);
    if (user) {

        updateProfile(user, {
            displayName: name,
            photoURL: photoStorage,
        })
            .then(() => {
                console.log('user updated');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + errorMessage);
            });
    }
}

function updateUserEmail() {
    const email = document.getElementById("updateEmail").value;
    const user = auth.currentUser;
    console.log('uhu' + email);

    if (user) {
        updateEmail(user, email).then(() => {
            console.log('email update!');
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('Code: ' + errorCode + '<br>Msg: ' + errorMessage);
        });
    }
}

//----------------------Camera Photo----------------------\\

feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;

const [play, pause, screenshot] = buttons;

const constraints = {
    video: {
        width: {
            min: 1280,
            ideal: 1920,
            max: 2560,
        },
        height: {
            min: 720,
            ideal: 1080,
            max: 1440
        },
    }
};

cameraOptions.onchange = () => {
    const updatedConstraints = {
        ...constraints,
        deviceId: {
            exact: cameraOptions.value
        }
    };

    startStream(updatedConstraints);
};

play.onclick = () => {
    if (streamStarted) {
        video.play();
        play.classList.add('d-none');
        pause.classList.remove('d-none');
        return;
    }
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        const updatedConstraints = {
            ...constraints,
            deviceId: {
                exact: cameraOptions.value
            }
        };
        startStream(updatedConstraints);
    }
};

const pauseStream = () => {
    video.pause();
    play.classList.remove('d-none');
    pause.classList.add('d-none');
};
let photoURL = ''
const doScreenshot = () => {
    const user = auth.currentUser
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    screenshotImage.src = canvas.toDataURL('image/webp');
    screenshotImage.classList.remove('d-none');
    canvas.toBlob(function (blob) {

        if (user) {
            const profilePhoto = ref(storage, `users/${auth.currentUser.uid}/recipes/${Date.now()}`);
            photoURL = Date.now();
            uploadBytes(profilePhoto, blob)
                .then((snapshot) => {
                    getDownloadURL(ref(storage, `users/${auth.currentUser.uid}/recipes/${photoURL}`))
                        .then((url) => {
                            photoURL = url;

                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.log(errorCode + errorMessage);
                        });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode + errorMessage);
                });

        }
    });
};
pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;

const startStream = async (constraints) => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream);
};


const handleStream = (stream) => {
    video.srcObject = stream;
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    screenshot.classList.remove('d-none');

};


const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const options = videoDevices.map(videoDevice => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
    cameraOptions.innerHTML = options.join('');
};

getCameraSelection();


//----------------------Create Recipe----------------------\\
async function recipeCreate(photoURL) {
    console.log(photoURL);
    const UID = auth.currentUser.uid;
    const name = document.getElementById('recipeTitle').value;
    const time = document.getElementById('cookingTime').value;
    const prep_time = document.getElementById('prepTime').value;
    const serving = document.getElementById('serving').value;
    const typeRecipe = document.getElementById('typeRecipe').value;
    const dietaryPref = document.getElementById('dietaryPref').value;
    const instructions = document.getElementById('instruction').value;
    const ingredient_1 = document.getElementById('ingredient_1').value;
    const ingredient_2 = document.getElementById('ingredient_2').value;
    const ingredient_3 = document.getElementById('ingredient_3').value;
    const ingredient_4 = document.getElementById('ingredient_4').value;
    const ingredient_5 = document.getElementById('ingredient_5').value;


    console.log('a foto veio?');
    console.log(photoURL);

    const docData = {
        name: name.toUpperCase(),
        time: time,
        photo: photoURL,
        prep_time: prep_time,
        serving: serving,
        type_recipe: typeRecipe,
        dietary_pref: dietaryPref,
        instructions: instructions,
        ingredient_1: ingredient_1,
        ingredient_2: ingredient_2,
        ingredient_3: ingredient_3,
        ingredient_4: ingredient_4,
        ingredient_5: ingredient_5,
    }

    try {

        await addDoc(collection(db, `users/${UID}/recipes`), docData);

        const resetInput = document.querySelectorAll('input');
        resetInput.forEach(item => {
            item.value = '';
        });
        document.getElementById('instruction').value = '';

    } catch
        (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage);

    }

// window.top.location.reload(true);
}

const el = document.getElementById('publish');

el.addEventListener('click', () => {
    try {
        recipeCreate(photoURL);
        alert('recipe Created');
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage);
    }
});

//----------------------Load Recipes----------------------\\
async function recipes() {
    const UID = auth.currentUser.uid;
    const recipesCards = document.getElementById("recipesCards");
    // await collection(`users/${UID}/recipes`).get()
    const snapshot = collection(db, `users/${UID}/recipes`);

    const allRecipes = await getDocs(snapshot);

    allRecipes.forEach((recipe) => {
        const cardLink = document.createElement("a");
        // cardLink.href = `#oneRecipe?${recipes[i].id}`;
        cardLink.classList.add("card-link");
        cardLink.classList.add("recipe-card");

        const card = document.createElement("div");
        card.classList.add("card");

        const cardImgContainer = document.createElement("div");
        cardImgContainer.classList.add("recipe-card__img");

        const cardButton = document.createElement("button");

        const cardImage = document.createElement("img");
        cardImage.classList.add("card-img-top");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardStars = document.createElement("div");
        cardStars.classList.add("rating-stars");

        const cardTitle = document.createElement("h3");
        cardTitle.classList.add("card-title");

        const cardTitleText = document.createTextNode(`${recipe.data().name}`);
        cardTitle.appendChild(cardTitleText);

        cardImage.src = `${recipe.data().photo}`;

        cardImgContainer.appendChild(cardButton);
        cardImgContainer.appendChild(cardImage);
        cardBody.appendChild(cardStars);
        cardBody.appendChild(cardTitle);

        card.appendChild(cardImgContainer);
        card.appendChild(cardBody);
        cardLink.appendChild(card);

        recipesCards.appendChild(cardLink);
    });
}

//----------------------Add/Remove Ingrediente Input----------------------\\
let i = 0;
/*addBtn.addEventListener('click', () => {

    const inputAppend = document.getElementById('input-ingredient');
    const inputIngredient = document.createElement('input');
    const labelIngredient = document.createElement('label');
    const inputAmount = document.createElement('input');
    const labelAmount = document.createElement('label');

    /!*Ingredients*!/
    labelIngredient.innerHTML = 'Ingredient Name'
    labelIngredient.setAttribute('for', `ingredient_${i}`);
    labelIngredient.setAttribute('id', `ingredientLabel_${i}`);
    labelIngredient.setAttribute('class', `ingredientLabel`);
    inputIngredient.setAttribute('type', 'text');
    inputIngredient.setAttribute('id', `ingredient_${i}`);
    inputIngredient.setAttribute('class', `ingredient`);

    /!*Amounts*!/
    labelAmount.innerHTML = 'Amount'
    labelAmount.setAttribute('for', `amount_${i}`);
    labelAmount.setAttribute('for', `amountLabel_${i}`);
    inputAmount.setAttribute('type', 'number');
    inputAmount.setAttribute('id', `amount_${i}`);


    inputAppend.appendChild(labelIngredient);
    inputAppend.appendChild(inputIngredient);
    inputAppend.appendChild(labelAmount);
    inputAppend.appendChild(inputAmount);
    i++;
    console.log('addbtn:' + i);
});*/

/*removeBtn.addEventListener('click', () => {
    console.log('removebtn:' + i);
    const inputsRemove = document.getElementById('input-ingredient');
    const ingredientInputRemove = document.getElementById(`ingredient_${i}`);
    const ingredientLabelRemove = document.getElementById(`ingredientLabel_${i}`);
    const amountInputRemove = document.getElementById(`amount_${i}`);
    const amountLabelRemove = document.getElementById(`amountLabel_${i}`);

    inputsRemove.remove(ingredientInputRemove);
    inputsRemove.remove(ingredientLabelRemove);
    inputsRemove.remove(amountInputRemove);
    inputsRemove.remove(amountLabelRemove);
    i--;
});*/

//----------------------Navigate Menu Pages Profile----------------------\\

const allPages = document.querySelectorAll("a.profile-menu");
const myProfile = document.getElementById("myProfile");
const myRecipes = document.getElementById("myRecipes");
const writeRecipeBtn = document.getElementById("createRecipesBtn");
const writeRecipe = document.getElementById("createRecipes");
allPages.forEach((menu) => {
    menu.addEventListener("click", () => {
        console.log("id " + menu.id);
        if (menu.id === "profileInfo") {
            myProfile.style.display = "block";
            myRecipes.style.display = "none";
            writeRecipe.style.display = "none";
            console.log("profile info");
        } else if (menu.id === "profileRecipe") {
            console.log("profile recipe");
            myProfile.style.display = "none";
            myRecipes.style.display = "block";
            writeRecipe.style.display = "none";
        }
    });
});

writeRecipeBtn.addEventListener("click", () => {
    writeRecipe.style.display = "block";
    myProfile.style.display = "none";
    myRecipes.style.display = "none";
});

//---------------------Initialization of the JS----------------------\\


init();
