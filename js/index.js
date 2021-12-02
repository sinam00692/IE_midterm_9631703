var c = null ;
let localStorage = window.localStorage;

/*This function sends a HTTP request to the given server and then returns the answer of it as a JSON query and then if there is no error,
It updates the right column boxes values (Called after submit button is clicked)*/
function submit() {
    let username = isValidName();

    if (!username)
        return false;
    
    const name_URL = "https://api.genderize.io/?name="
    const xmlHttpReq = new XMLHttpRequest();
    let url = name_URL + username;
    var responseText = {}

    xmlHttpReq.open("GET", url);
    xmlHttpReq.send();
    
    xmlHttpReq.onreadystatechange = () => {
        var num = xmlHttpReq.status / 100
        console.log(num)

        if (num != 3 && num != 2) {
            if (xmlHttpReq.status === 404) {
                err("Name not found");
                return false;
            }
            err("ERROR " + xmlHttpReq.status)
            return false;
        }
        else{
            responseText = xmlHttpReq.response;
            try {
                c = JSON.parse(xmlHttpReq.response)
                console.log(c.name);

                document.getElementById("genderType").innerHTML = c.gender;
                document.getElementById("score").innerHTML = c.probability;

                let name = localStorage.getItem(c.name);
                console.log(name);

                if(name != null){
                    let name_json = JSON.parse(name);
                    document.getElementById("savedGender").style.display = "flex";
                    document.getElementById("savedScore").style.display = "flex";

                    document.getElementById("savedGender").innerHTML = "          " + name_json.gender;
                    document.getElementById("savedScore").innerHTML = "          " + name_json.probability;
                }else{
                    document.getElementById("savedGender").style.display = "none";
                    document.getElementById("savedScore").style.display = "none";
                }
            } catch (d) {
                console.log("Nothing added to query response")
            }
        }
    }
}

/*Checks the returned response from server and stores it in the localStorage*/
function save(){
    let res = c;
    if (res != null){
        if (document.getElementById(("option-1")).checked){
            res.gender = "male";
        } else if (document.getElementById(("option-2")).checked){
            res.gender = "female";
        }
        res.probability = 1;
        localStorage.setItem(res.name, JSON.stringify(res));
    } else {
        err("No name entered! Please enter a proper name :)")
    }
}

/*Removes data from localStorage and if there is no such data in localStorage it shows a fault message in notification panel*/
function remove(){
    let res = c;
    console.log(document.getElementById("savedScore").style.display)
    if (document.getElementById("savedScore").style.display == "none" || document.getElementById("savedScore").style.display == "") {
        err("No data stored! Please save the data at first :)")
    }

    if (res != null){
        localStorage.removeItem(res.name);

        document.getElementById("savedGender").style.display = "none";
        document.getElementById("savedScore").style.display = "none";
    }
}

/*Checks if the entered name is valid or not*/
function isValidName(){
    let username = document.forms["findGender"]["username"].value;
    const pattern = /^[a-zA-Z_ ]*$/;
    if (username === ""){
        err("No name has entered! Please enter your name first :)")
        return null
    } else {
        console.log(username)

        if (username.trim().length > 255) {
            err("name is too long to be processed! Please enter a proper name :)");
            return null;
        }

        if (!pattern.test(username)){
            err("Name format is invalid! Please enter a proper name :)");
            return null;
        }

        return username;
    }
}

/*Notification error panel function that shows a message in notification panel with a transition and makes it disappeared*/
function err(message) {
    console.log(message);

    document.getElementById("notifier").style.height = "5%";
    document.getElementById("notifier").style.border = "2px solid #f4511e";
    document.getElementById("notifierText").innerHTML = message;

    setTimeout(function () {
        document.getElementById("notifier").style.height = "0";
        document.getElementById("notifier").style.border = "0";
    }, 4000);
}