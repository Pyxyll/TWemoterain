//update here to allow more than 10 emotes per chat message
// This may be pretty intensive on the system under heavy load so please use with care.
var maxemotes = 20;
var divnumber = 0;
var er = true;
var bitsrain = false;
var subsrain = false;
var tipsrain = false;
var raidrain = false;
var hostrain = false;
var broadcastername = "";
const urlParams = new URLSearchParams(window.location.search);

function connectws() {
    if ("WebSocket" in window) {

        var noer = urlParams.get('noer');
        if (!(noer === null)) {
            er = false;

        }

        var server = urlParams.get('server');
        if (!(server === null)) {
            server = "ws://" + server + "/";
        }
        else {
            server = "ws://localhost:8080/";
        }


        const ws = new WebSocket(server);
        ws.onopen = function () {

            ws.send(JSON.stringify(
                {
                    "request": "GetBroadcaster", "id": "123"
                }));

        }
        ws.onclose = function () {
            // "connectws" is the function we defined previously
            setTimeout(connectws, 10000);
        };

        if (!(urlParams.get('bits') === null)) {
            bitsrain = true;
        }
        if (!(urlParams.get('subs') === null)) {
            subsrain = true;
        }
        if (!(urlParams.get('tips') === null)) {
            tipsrain = true;
        }
        if (!(urlParams.get('host') === null)) {
            hostrain = true;
        }
        if (!(urlParams.get('raid') === null)) {
            raidrain = true;
        }


        const rain = urlParams.get('rain');
        const welcome = urlParams.get('welcome');
        const welcomeonly = urlParams.get('welcomeonly');
        const all = urlParams.get('all');
        const lurkonly = urlParams.get('lurkonly');
        const rainimageonly = urlParams.get('rainimageonly');
        console.log(rain);
        console.log(welcome);
        console.log(all);
        //check options - if we have first words:
        if (!(lurkonly === null) || !(rainimageonly === null)) {
            console.log("running code with lurk only support");
            ws.onopen = function () {
                ws.send(JSON.stringify(
                    {
                        "request": "Subscribe",
                        "events": {
                            "Raw": [
                                "Action"
                            ],

                            "Twitch": [
                                "Sub", "Cheer",
                                "Resub",
                                "GiftSub",
                                "GiftBomb",
                                "Raid",
                                "Host"
                            ],
                            "streamlabs": [
                                "Donation"],
                            "streamElements": [
                                "Tip"]


                        },
                        "id": "123"
                    }
                ));
            };
        }
        else if (!(welcome === null) || !(all === null)) {
            console.log("running code with first word support");
            ws.onopen = function () {
                ws.send(JSON.stringify(
                    {
                        "request": "Subscribe",
                        "events": {
                            "Twitch": [
                                "ChatMessage",
                                "FirstWord",
                                "Sub", "Cheer",
                                "Resub",
                                "GiftSub",
                                "GiftBomb",
                                "Raid",
                                "Host"
                            ],
                            "streamlabs": [
                                "Donation"],
                            "streamElements": [
                                "Tip"]
                            ,
                            "Raw": [
                                "Action", "Custom"
                            ]
                            ,
                            "Misc": [
                                "Custom"
                            ]
                        },
                        "id": "123"
                    }
                ));
            };
        }
        else if (!(welcomeonly === null)) {
            console.log("running code with only first word support");
            ws.onopen = function () {
                ws.send(JSON.stringify(
                    {
                        "request": "Subscribe",
                        "events": {
                            "Twitch": [
                                "FirstWord", "Sub", "Cheer",
                                "Resub",
                                "GiftSub",
                                "GiftBomb",
                                "Raid",
                                "Host"
                            ],
                            "streamlabs": [
                                "Donation"],
                            "streamElements": [
                                "Tip"]
                            ,
                            "Raw": [
                                "Action"
                            ]
                        },
                        "id": "123"
                    }
                ));
            };
        }
        else {
            //no first words / welcome support

            ws.onopen = function () {
                ws.send(JSON.stringify(
                    {
                        "request": "Subscribe",
                        "events": {
                            "Twitch": [
                                "ChatMessage",
                                "Sub",
                                "Cheer",
                                "Resub",
                                "GiftSub",
                                "GiftBomb",
                                "Raid",
                                "Host"
                            ],
                            "streamlabs": [
                                "Donation"],
                            "streamElements": [
                                "Tip"]
                            ,
                            "Raw": [
                                "Action"
                            ]
                        },
                        "id": "123"
                    }
                ));
            };

        }

        ws.onmessage = function (event) {
            // grab message and parse JSON
            const msg = event.data;
            const wsdata = JSON.parse(msg);
            //check for broadcaster information - wsdata.data.message.channel to broadcastername
            if (typeof wsdata.data != "undefined") {
                if (typeof wsdata.data.message != "undefined") {
                    if (typeof wsdata.data.message.channel != "undefined") {
                        broadcastername = wsdata.data.message.channel;
                    }
                }
            }




            //check for lurk command

            if (typeof wsdata.event != "undefined") {
                if (typeof wsdata.event.type != "undefined") {
                    if (typeof wsdata.data.name != "undefined") {
                        if (wsdata.data.name == "VisualLurk") {

                            var username = "";
                            if (wsdata.data.user.login && wsdata.data.user.login != "undefined") {
                                username = wsdata.data.user.login;
                            }
                            else {
                                username = wsdata.data.user.name;
                            }
                            console.log("starting xmlhttp");
                            var xhttp = new XMLHttpRequest();
                            console.log("created xmlhttp object");
                            xhttp.onreadystatechange = function () {
                                if (this.readyState == 4 && this.status == 200) {
                                    // get display image for the user
                                    console.log("got a response back");
                                    //save this to cache between sessions too.
                                    var no_of_elements = 50;

                                    var warp = document.getElementById("confetti-container"),
                                        innerWidth = window.innerWidth,
                                        innerHeight = window.innerHeight;

                                    // Load into page

                                    var Div = document.createElement('div');
                                    Div.id = divnumber;
                                    divnumber++;
                                    Div.style.background = 'url(' + xhttp.responseText + ')';
                                    Div.style.backgroundSize = '100% 100%';

                                    //randomise side to peep from
                                    var random = Math.floor(Math.random() * 4) + 1;

                                    switch (random) {
                                        case 1:
                                            // left - TweenLite.set(Div, { className: 'lurking-element', x: -600, y: Randomizer(0, innerHeight-600 ), z:0 });
                                            TweenLite.set(Div, { className: 'lurking-element', x: -400, y: Randomizer(0, innerHeight - 400), z: 0 });
                                            lurking_animation_left(Div);
                                            break;
                                        case 2:
                                            // right
                                            TweenLite.set(Div, { className: 'lurking-element', x: innerWidth, y: Randomizer(0, innerHeight - 400), z: 0 });
                                            lurking_animation_right(Div);
                                            break;
                                        case 3:
                                            // top
                                            TweenLite.set(Div, { className: 'lurking-element', x: Randomizer(0, innerWidth - 400), y: -400, z: 0, rotationX: 180 });
                                            lurking_animation_top(Div);
                                            break;
                                        default:
                                            // bottom
                                            TweenLite.set(Div, { className: 'lurking-element', x: Randomizer(0, innerWidth - 400), y: innerHeight, z: 0 });
                                            lurking_animation_bottom(Div);
                                    }
                                    warp.appendChild(Div);

                                    // Run animation

                                    setTimeout("removeelement(" + Div.id + ")", 15000);

                                }
                            };
                            console.log(username);
                            xhttp.open("GET", "https://decapi.me/twitch/avatar/" + username, true);
                            xhttp.send();



                        }
                        if (wsdata.data.name == "VisualUnlurk") {

                            var username = "";
                            if (wsdata.data.user.login && wsdata.data.user.login != "undefined") {
                                username = wsdata.data.user.login;
                            }
                            else {
                                username = wsdata.data.user.name;
                            }
                            console.log("starting xmlhttp");
                            var xhttp = new XMLHttpRequest();
                            console.log("created xmlhttp object");
                            xhttp.onreadystatechange = function () {
                                if (this.readyState == 4 && this.status == 200) {
                                    // get display image for the user
                                    console.log("got a response back");
                                    //save this to cache between sessions too.
                                    var no_of_elements = 50;

                                    var warp = document.getElementById("confetti-container"),
                                        innerWidth = window.innerWidth,
                                        innerHeight = window.innerHeight;

                                    // Load into page

                                    var Div = document.createElement('div');
                                    Div.id = divnumber;
                                    divnumber++;
                                    Div.style.background = 'url(' + xhttp.responseText + ')';
                                    Div.style.backgroundSize = '100% 100%';

                                    //randomise side to peep from
                                    var random = Math.floor(Math.random() * 4) + 1;
                                    //random = 1;
                                    switch (random) {
                                        case 1:
                                            // left - TweenLite.set(Div, { className: 'lurking-element', x: -600, y: Randomizer(0, innerHeight-600 ), z:0 });
                                            TweenLite.set(Div, { className: 'lurking-element', x: -400, y: Randomizer(0, innerHeight - 400), z: 0, scale: 0.75 });
                                            unlurking_animation_left(Div);
                                            break;
                                        case 2:
                                            // right
                                            TweenLite.set(Div, { className: 'lurking-element', x: innerWidth, y: Randomizer(0, innerHeight - 400), z: 0 });
                                            unlurking_animation_right(Div);
                                            break;
                                        case 3:
                                            // top
                                            TweenLite.set(Div, { className: 'lurking-element', x: Randomizer(0, innerWidth - 400), y: -400, z: 0, rotationX: 180 });
                                            unlurking_animation_top(Div);
                                            break;
                                        default:
                                            // bottom
                                            TweenLite.set(Div, { className: 'lurking-element', x: Randomizer(0, innerWidth - 400), y: innerHeight, z: 0 });
                                            unlurking_animation_bottom(Div);
                                    }
                                    warp.appendChild(Div);

                                    // Run animation

                                    setTimeout("removeelement(" + Div.id + ")", 15000);

                                }
                            };
                            console.log(username);
                            xhttp.open("GET", "https://decapi.me/twitch/avatar/" + username, true);
                            xhttp.send();



                        }


                        if (wsdata.data.name == "VisualImageRain") {

                            var username = "";
                            if (wsdata.data.user.login && wsdata.data.user.login != "undefined") {
                                username = wsdata.data.user.login;
                            }
                            else {
                                username = wsdata.data.user.name;
                            }
                            console.log("starting xmlhttp");
                            var xhttp = new XMLHttpRequest();
                            console.log("created xmlhttp object");
                            xhttp.onreadystatechange = function () {
                                if (this.readyState == 4 && this.status == 200) {
                                    // get display image for the user
                                    console.log("got a response back");
                                    //save this to cache between sessions too.
                                    var no_of_elements = 50;

                                    var warp = document.getElementById("confetti-container"),
                                        innerWidth = window.innerWidth,
                                        innerHeight = window.innerHeight;

                                    // Load into page

                                    var Div = document.createElement('div');
                                    Div.id = divnumber;
                                    divnumber++;
                                    Div.style.background = 'url(' + xhttp.responseText + ')';
                                    Div.style.backgroundSize = '100% 100%';

                                    //randomise side to peep from
                                    var random = Math.floor(Math.random() * 4) + 1;

                                    switch (random) {
                                        case 1:
                                            // left - TweenLite.set(Div, { className: 'lurking-element', x: -600, y: Randomizer(0, innerHeight-600 ), z:0 });
                                            TweenLite.set(Div, { className: 'lurking-element', x: -400, y: Randomizer(0, innerHeight - 400), z: 0 });
                                            lurking_animation_left(Div);
                                            break;
                                        case 2:
                                            // right
                                            TweenLite.set(Div, { className: 'lurking-element', x: innerWidth, y: Randomizer(0, innerHeight - 400), z: 0 });
                                            lurking_animation_right(Div);
                                            break;
                                        case 3:
                                            // top
                                            TweenLite.set(Div, { className: 'lurking-element', x: Randomizer(0, innerWidth - 400), y: -400, z: 0, rotationX: 180 });
                                            lurking_animation_top(Div);
                                            break;
                                        default:
                                            // bottom
                                            TweenLite.set(Div, { className: 'lurking-element', x: Randomizer(0, innerWidth - 400), y: innerHeight, z: 0 });
                                            lurking_animation_bottom(Div);
                                    }
                                    warp.appendChild(Div);

                                    // Run animation

                                    setTimeout("removeelement(" + Div.id + ")", 15000);

                                }
                            };
                            console.log(username);
                            xhttp.open("GET", "https://decapi.me/twitch/avatar/" + username, true);
                            xhttp.send();



                        }

                    }
                }
            }

            // check for events to trigger
            // check for first words
            viewerrain = false;
            if (typeof wsdata.event != "undefined") {
                if (typeof wsdata.event.type != "undefined") {
                    if (wsdata.event.type == "FirstWord") {
                        viewerrain = true;
                        var username = "";
                        if (typeof wsdata.data.user != "undefined") {
                            if (typeof wsdata.data.user.login != "undefined") {
                                username = wsdata.data.user.login;
                            }
                            else if (typeof wsdata.data.user.name != "undefined") {
                                username = wsdata.data.user.name;
                            }
                        }
                        else {
                            username = wsdata.data.message.displayName;
                        }
                    }
                }
            }
            //var bitsrain = false;
            if (bitsrain) {

                if (wsdata.event.source == 'Twitch') {
                    //console.log(wsdata.event.type);
                    if (wsdata.event.type == 'Cheer') {
                        if (wsdata.data.message.isAnonymous == false) {

                            viewerrain = true;
                            username = wsdata.data.message.displayName;
                        }
                    }
                }
            }
            // Subs - wsdata.data.displayName
            if (subsrain) {
                if (wsdata.event.source == 'Twitch') {
                    if (wsdata.event.type == 'Sub' || wsdata.event.type == 'ReSub') {
                        viewerrain = true;
                        username = wsdata.data.displayName;
                    }
                    else if (wsdata.event.type == 'GiftBomb' || wsdata.event.type == 'GiftSub') {
                        if (wsdata.data.isAnonymous == false) {
                            viewerrain = true;
                            username = wsdata.data.displayName;
                        }
                    }
                }
            }

            //var raidrain = false;
            if (raidrain) {

                if (wsdata.event.source == 'Twitch') {
                    if (wsdata.event.type == 'Raid') {


                        viewerrain = true;
                        username = wsdata.data.displayName;

                    }
                }
            }


            //var hostrain = false;
            if (hostrain) {

                if (wsdata.event.source == 'Twitch') {
                    if (wsdata.event.type == 'Host') {


                        viewerrain = true;
                        username = wsdata.data.displayName;

                    }
                }
            }
            //var tipsrain = false;
            if (tipsrain) {

                if (wsdata.event.source === 'Streamlabs') {
                    if (wsdata.event.type === 'Donation') {
                        username = broadcastername;
                        viewerrain = true;
                    }
                }
                if (wsdata.event.source === 'StreamElements') {
                    if (wsdata.event.type === 'Tip') {
                        username = broadcastername;
                        viewerrain = true;


                    }
                }



            }


            if (viewerrain) {




                //var username = wsdata.data.user.login;
                console.log("starting xmlhttp");
                var xhttp = new XMLHttpRequest();
                console.log("created xmlhttp object");
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        // get display image for the user
                        console.log("got a response back");
                        //save this to cache between sessions too.
                        var no_of_elements = 50;

                        var warp = document.getElementById("confetti-container"),
                            innerWidth = window.innerWidth,
                            innerHeight = window.innerHeight;

                        // Load into page
                        for (i = 0; i < no_of_elements; i++) {
                            var Div = document.createElement('div');
                            Div.id = divnumber;
                            divnumber++;

                            TweenLite.set(Div, { className: 'falling-element', x: Randomizer(0, innerWidth), y: Randomizer(-500, -450), z: Randomizer(-200, 200) });
                            Div.style.background = 'url(' + xhttp.responseText + ')';
                            Div.style.backgroundSize = '100% 100%';

                            warp.appendChild(Div);

                            // Run animation
                            falling_animation(Div);

                            setTimeout("removeelement(" + Div.id + ")", 15000);
                        }
                    }
                };
                console.log(username);
                xhttp.open("GET", "https://decapi.me/twitch/avatar/" + username, true);
                xhttp.send();







            }
            //check for emotes wsdata.data.message.emotes
            //get user image from wsdata.data.user.login
            //Send this to emote rain
            if (typeof wsdata.data != "undefined") {
                if (typeof wsdata.data.message != "undefined") {
                    if (typeof wsdata.data.message.emotes != "undefined") {
                        if (typeof wsdata.data.message.emotes != "undefined") {



                            if (wsdata.data.message.emotes.length > 0) {
                                if (wsdata.data.message.emotes.length > maxemotes) {
                                    emotecount = maxemotes;
                                }
                                else {
                                    emotecount = wsdata.data.message.emotes.length;
                                }
                                for (i = 0; i < emotecount; i++) {
                                    //document.getElementById("lastemote").src=wsdata.data.message.emotes[i].imageUrl;
                                    var emoteraincommand = 'emoteRain("';
                                    emoteraincommand += wsdata.data.message.emotes[i].imageUrl;
                                    emoteraincommand += '")';
                                    console.log(emoteraincommand);
                                    var emoteballooncommand = 'emoteBalloon("';
                                    emoteballooncommand += wsdata.data.message.emotes[i].imageUrl;
                                    emoteballooncommand += '")';
                                    console.log(emoteballooncommand);
                                    //document.getElementById("test").innerHTML=emoteraincommand;
                                    var lowermessage = wsdata.data.message.message.toLowerCase();


                                    if (lowermessage.includes("!er rain") && wsdata.data.message.role > 1 && (!(rain === null) || !(all === null))) {
                                        if (er) {
                                            for (j = 0; j < 50; j++) {


                                                setTimeout(emoteraincommand, (j * 200));
                                            }
                                        }
                                    }
                                    if (lowermessage.includes("!er balloon") && wsdata.data.message.role > 1 && (!(rain === null) || !(all === null))) {
                                        if (er) {
                                            for (j = 0; j < 50; j++) {


                                                setTimeout(emoteballooncommand, (j * 200));
                                            }
                                        }

                                    }
                                    setTimeout(emoteraincommand, 300);





                                };
                            }
                        }
                    }
                }
            }
        }
    }
}





// Set default values for perspective property
//TweenLite.set("#confetti-container", {perspective:600})
function emoteRain(image) {

    var no_of_elements = 1;

    var warp = document.getElementById("confetti-container"),
        innerWidth = window.innerWidth,
        innerHeight = window.innerHeight;

    // Load into page
    for (i = 0; i < no_of_elements; i++) {
        var Div = document.createElement('div');
        Div.id = divnumber;
        divnumber++;

        TweenLite.set(Div, { className: 'falling-element', x: Randomizer(0, innerWidth), y: Randomizer(-500, -450), z: Randomizer(-200, 200) });
        // switch between the images.

        Div.style.background = 'url(' + image + ')';

        //

        Div.style.backgroundSize = '100% 100%';

        warp.appendChild(Div);

        // Run animation
        falling_animation(Div);
        //Destroy element after 8 seconds so we don't eat up resources over time!
        setTimeout("removeelement(" + Div.id + ")", 15000);
    }
}
function emoteBalloon(image) {

    var no_of_elements = 1;

    var warp = document.getElementById("confetti-container"),
        innerWidth = window.innerWidth,
        innerHeight = window.innerHeight;

    // Load into page
    for (i = 0; i < no_of_elements; i++) {
        var Div = document.createElement('div');
        Div.id = divnumber;
        divnumber++;

        TweenLite.set(Div, { className: 'falling-element', x: Randomizer(0, innerWidth), y: Randomizer(1600, 1450), z: Randomizer(-200, 200) });
        // switch between the images.

        Div.style.background = 'url(' + image + ')';

        //

        Div.style.backgroundSize = '100% 100%';

        warp.appendChild(Div);

        // Run animation
        rising_animation(Div);
        //Destroy element after 8 seconds so we don't eat up resources over time!
        setTimeout("removeelement(" + Div.id + ")", 15000);
    }
}
function removeelement(div) {
    document.getElementById(div).remove();
}
// Falling animation
function falling_animation(element) {
    //TweenMax.to(e, Randomizer(6, 16), {y:innerHeight+100, ease:Linear.easeNone, repeat:-1, delay:-15});
    //TweenMax.to(e, Randomizer(4, 8), {x:'+=100',rotationZ:Randomizer(0, 180), repeat:-1, yoyo:true, ease:Sine.easeInOut});
    //TweenMax.to(e,Randomizer(2, 8), {rotationX:Randomizer(0,360),rotationY:Randomizer(0,360),repeat:-1,yoyo:true,ease:Sine.easeInOut,delay:-5});

    TweenMax.to(element, Randomizer(6, 16), { y: innerHeight + 1400, ease: Linear.easeNone, repeat: 0, delay: -1 });
    TweenMax.to(element, Randomizer(4, 8), { x: '+=100', rotationZ: Randomizer(0, 180), repeat: 4, yoyo: true, ease: Sine.easeInOut });
    TweenMax.to(element, Randomizer(2, 8), { rotationX: Randomizer(0, 360), rotationY: Randomizer(0, 360), repeat: 8, yoyo: true, ease: Sine.easeInOut, delay: -5 });

}
//rising_animation
function rising_animation(element) {
    //TweenMax.to(e, Randomizer(6, 16), {y:innerHeight+100, ease:Linear.easeNone, repeat:-1, delay:-15});
    //TweenMax.to(e, Randomizer(4, 8), {x:'+=100',rotationZ:Randomizer(0, 180), repeat:-1, yoyo:true, ease:Sine.easeInOut});
    //TweenMax.to(e,Randomizer(2, 8), {rotationX:Randomizer(0,360),rotationY:Randomizer(0,360),repeat:-1,yoyo:true,ease:Sine.easeInOut,delay:-5});

    TweenMax.to(element, Randomizer(6, 16), { y: -400, ease: Linear.easeNone, repeat: 0, delay: -1 });
    TweenMax.to(element, Randomizer(4, 8), { x: '+=100', rotationZ: Randomizer(0, 180), repeat: 4, yoyo: true, ease: Sine.easeInOut });
    TweenMax.to(element, Randomizer(2, 8), { rotationX: Randomizer(0, 360), rotationY: Randomizer(0, 360), repeat: 8, yoyo: true, ease: Sine.easeInOut, delay: -5 });

}
function lurking_animation_left(element) {
    //TweenMax.to(e, Randomizer(6, 16), {y:innerHeight+100, ease:Linear.easeNone, repeat:-1, delay:-15});
    //TweenMax.to(e, Randomizer(4, 8), {x:'+=100',rotationZ:Randomizer(0, 180), repeat:-1, yoyo:true, ease:Sine.easeInOut});
    //TweenMax.to(e,Randomizer(2, 8), {rotationX:Randomizer(0,360),rotationY:Randomizer(0,360),repeat:-1,yoyo:true,ease:Sine.easeInOut,delay:-5});

    TweenMax.to(element, 1, { rotationZ: '+=40', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0 });
    TweenMax.to(element, 1, { x: '+=200', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0 });
    TweenMax.to(element, 1, { rotationZ: '-=40', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 1.5 });
    TweenMax.to(element, 1, { x: '-=200', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 1.5 });
}

function lurking_animation_right(element) {
    //TweenMax.to(e, Randomizer(6, 16), {y:innerHeight+100, ease:Linear.easeNone, repeat:-1, delay:-15});
    //TweenMax.to(e, Randomizer(4, 8), {x:'+=100',rotationZ:Randomizer(0, 180), repeat:-1, yoyo:true, ease:Sine.easeInOut});
    //TweenMax.to(e,Randomizer(2, 8), {rotationX:Randomizer(0,360),rotationY:Randomizer(0,360),repeat:-1,yoyo:true,ease:Sine.easeInOut,delay:-5});

    TweenMax.to(element, 1, { rotationZ: '-=40', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0 });
    TweenMax.to(element, 1, { x: '-=200', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0 });
    TweenMax.to(element, 1, { rotationZ: '+=40', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 1.5 });
    TweenMax.to(element, 1, { x: '+=200', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 1.5 });
}

function lurking_animation_top(element) {
    //TweenMax.to(e, Randomizer(6, 16), {y:innerHeight+100, ease:Linear.easeNone, repeat:-1, delay:-15});
    //TweenMax.to(e, Randomizer(4, 8), {x:'+=100',rotationZ:Randomizer(0, 180), repeat:-1, yoyo:true, ease:Sine.easeInOut});
    //TweenMax.to(e,Randomizer(2, 8), {rotationX:Randomizer(0,360),rotationY:Randomizer(0,360),repeat:-1,yoyo:true,ease:Sine.easeInOut,delay:-5});

    TweenMax.to(element, 1, { y: '+=250', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0 });
    TweenMax.to(element, 1, { y: '-=250', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 1.5 });

}

function lurking_animation_bottom(element) {
    //TweenMax.to(e, Randomizer(6, 16), {y:innerHeight+100, ease:Linear.easeNone, repeat:-1, delay:-15});
    //TweenMax.to(e, Randomizer(4, 8), {x:'+=100',rotationZ:Randomizer(0, 180), repeat:-1, yoyo:true, ease:Sine.easeInOut});
    //TweenMax.to(e,Randomizer(2, 8), {rotationX:Randomizer(0,360),rotationY:Randomizer(0,360),repeat:-1,yoyo:true,ease:Sine.easeInOut,delay:-5});

    TweenMax.to(element, 1, { y: '-=250', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0 });
    TweenMax.to(element, 1, { y: '+=250', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 1.5 });


}

function unlurking_animation_left(element) {
    //TweenMax.to(e, Randomizer(6, 16), {y:innerHeight+100, ease:Linear.easeNone, repeat:-1, delay:-15});
    //TweenMax.to(e, Randomizer(4, 8), {x:'+=100',rotationZ:Randomizer(0, 180), repeat:-1, yoyo:true, ease:Sine.easeInOut});
    //TweenMax.to(e,Randomizer(2, 8), {rotationX:Randomizer(0,360),rotationY:Randomizer(0,360),repeat:-1,yoyo:true,ease:Sine.easeInOut,delay:-5});


    TweenMax.to(element, 0.6, { x: '+=400', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0 });
    TweenMax.to(element, 0.15, { x: '-=50', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0.6 });
    TweenMax.to(element, 0.5, { opacity: 0, yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 1 });
}

function unlurking_animation_right(element) {
    //TweenMax.to(e, Randomizer(6, 16), {y:innerHeight+100, ease:Linear.easeNone, repeat:-1, delay:-15});
    //TweenMax.to(e, Randomizer(4, 8), {x:'+=100',rotationZ:Randomizer(0, 180), repeat:-1, yoyo:true, ease:Sine.easeInOut});
    //TweenMax.to(e,Randomizer(2, 8), {rotationX:Randomizer(0,360),rotationY:Randomizer(0,360),repeat:-1,yoyo:true,ease:Sine.easeInOut,delay:-5});

    TweenMax.to(element, 0.6, { x: '-=400', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0 });
    TweenMax.to(element, 0.15, { x: '+=50', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0.6 });
    TweenMax.to(element, 0.5, { opacity: 0, yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 1 });


    //    TweenMax.to(element, 1, { x: '-=350', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0 });
    //TweenMax.to(element, 1, { x: '+=350', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 1.5 });
}

function unlurking_animation_top(element) {
    //TweenMax.to(e, Randomizer(6, 16), {y:innerHeight+100, ease:Linear.easeNone, repeat:-1, delay:-15});
    //TweenMax.to(e, Randomizer(4, 8), {x:'+=100',rotationZ:Randomizer(0, 180), repeat:-1, yoyo:true, ease:Sine.easeInOut});
    //TweenMax.to(e,Randomizer(2, 8), {rotationX:Randomizer(0,360),rotationY:Randomizer(0,360),repeat:-1,yoyo:true,ease:Sine.easeInOut,delay:-5});

    //    TweenMax.to(element, 1, { y: '+=350', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0 });
    //TweenMax.to(element, 1, { y: '-=350', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 1.5 });
    TweenMax.to(element, 0.6, { y: '+=400', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0 });
    TweenMax.to(element, 0.15, { y: '-=50', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0.6 });
    TweenMax.to(element, 0.5, { opacity: 0, yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 1 });


}

function unlurking_animation_bottom(element) {
    //TweenMax.to(e, Randomizer(6, 16), {y:innerHeight+100, ease:Linear.easeNone, repeat:-1, delay:-15});
    //TweenMax.to(e, Randomizer(4, 8), {x:'+=100',rotationZ:Randomizer(0, 180), repeat:-1, yoyo:true, ease:Sine.easeInOut});
    //TweenMax.to(e,Randomizer(2, 8), {rotationX:Randomizer(0,360),rotationY:Randomizer(0,360),repeat:-1,yoyo:true,ease:Sine.easeInOut,delay:-5});

    // TweenMax.to(element, 1, { y: '-=300', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0 });
    //TweenMax.to(element, 1, { y: '+=300', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 1.5 });
    TweenMax.to(element, 0.6, { y: '-=400', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0 });
    TweenMax.to(element, 0.15, { y: '+=50', yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 0.6 });
    TweenMax.to(element, 0.5, { opacity: 0, yoyo: true, repeat: 0, ease: Sine.easeInOut, delay: 1 });

}


// Randomizer
function Randomizer(min, max) { return min + Math.random() * (max - min); }

function HalloweenRain() {
    //pick random number and pick image
    var random = Math.floor(Math.random() * 9) + 1;

    switch (random) {
        case 1:
            spookyImage = "https://static-cdn.jtvnw.net/emoticons/v2/461298/default/dark/3.0";
            break;
        case 2:
            spookyImage = "https://static-cdn.jtvnw.net/emoticons/v2/166263/default/dark/3.0";
            break;
        case 3:
            spookyImage = "https://static-cdn.jtvnw.net/emoticons/v2/62835/default/dark/3.0";
            break;
        case 4:
            spookyImage = "https://static-cdn.jtvnw.net/emoticons/v2/3668/default/dark/3.0";
            break;
        case 5:
            spookyImage = "https://static-cdn.jtvnw.net/emoticons/v2/116625/default/dark/3.0";
            break;
        case 6:
            spookyImage = "https://static-cdn.jtvnw.net/emoticons/v2/425688/default/dark/3.0";
            break;
        case 7:
            spookyImage = "skullsmol.png";
            break;
        case 8:
            spookyImage = "dino1.gif";
            break;
        default:
            spookyImage = "pumpkinsmol.png";
            break;
        //call emote rain
    }
    emoteRain(spookyImage);

}
if (!(urlParams.get('halloween') === null)) {
    hrDelay = urlParams.get('halloween');
    if (hrDelay == "") { hrDelay = 10; }
    setInterval(HalloweenRain, (1000 * hrDelay));
}



connectws();