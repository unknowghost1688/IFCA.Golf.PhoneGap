/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //var pushNotification = window.plugins.pushNotification;
        //pushNotification.register(app.successHandler, app.errorHandler, { "senderID": "235285295508", "ecb": "app.onNotificationGCM" });
        var pushNotification = window.plugins.pushNotification;
        var iOS = false,
        p = navigator.platform;

        if (p === 'iPad' || p === 'iPhone' || p === 'iPod') {
            iOS = true;
        }
        if (iOS) {
            pushNotification.register(app.tokenHandler, app.errorHandler, { "badge": "true", "sound": "true", "alert": "true", "ecb": "app.onNotificationAPN" });
        }
        else {
            pushNotification.register(app.successHandler, app.errorHandler, { "senderID": "235285295508", "ecb": "app.onNotificationGCM" });

        }

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);

    },
    // result contains any message sent from the plugin call
    tokenHandler: function (result) {
        localStorage.setItem("DeviceKey", result);
        //alert('Callback Success! Result = '+result)

    },
    successHandler: function(result) {
        //alert('Callback Success! Result = '+result)
    },
    errorHandler:function(error) {
        alert(error);
    },
    // iOS
    onNotificationAPN: function (event) {
        var pushNotification = window.plugins.pushNotification;
        console.log("Received a notification! " + event.alert);
        console.log("event sound " + event.sound);
        console.log("event badge " + event.badge);
        console.log("event " + event);
        if (event.alert) {
            navigator.notification.alert(event.alert);
        }
        if (event.badge) {
            console.log("Set badge on  " + pushNotification);
            pushNotification.setApplicationIconBadgeNumber(app.successHandler, event.badge);
        }
        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }
    },
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {                  
                    localStorage.setItem("DeviceKey", e.regid);
                    //alert('devicekey=' + e.regid);
                }
                break;

            case 'message':
                // this is the actual push notification. its format depends on the data model from the push server
                alert(e.message);
                break;

            case 'error':
                alert('GCM error = '+e.msg);
                break;

            default:
                alert('An unknown GCM event has occurred');
                break;
        }
    }

};
