var map;

var markers = [];
var holder = [];
//created an array of all the details or the locations that we need to create on map.
var locations = [{
        title: 'Gulmarg',
        location: {
            lat: 34.0483700,
            lng: 74.3804790
        }
    }, {
        title: 'Udhampur',
        location: {
            lat: 32.9159850,
            lng: 75.1416170
        }
    }, {
        title: 'Manali',
        location: {
            lat: 32.2396330,
            lng: 77.1887150
        }
    }, {
        title: 'Amritsar',
        location: {
            lat: 31.6339790,
            lng: 74.8722640
        }
    }, {
        title: 'Dehradun',
        location: {
            lat: 30.3164950,
            lng: 78.0321920
        }
    }, {
        title: 'Sonipat',
        location: {
            lat: 28.9287740,
            lng: 77.0912810
        }
    }, {
        title: 'Gurgaon',
        location: {
            lat: 28.4594970,
            lng: 77.0266380
        }
    }, {
        title: 'Chennai',
        location: {
            lat: 13.0826800,
            lng: 80.2707180
        }
    }, {
        title: 'Bengaluru',
        location: {
            lat: 12.9715990,
            lng: 77.5945630
        }
    }, {
        title: 'Mysore',
        location: {
            lat: 12.2958100,
            lng: 76.6393810
        }
    }


];

//refrenced the code from the google map api class of udacity.
initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 22.9734230,
            lng: 78.6568940
        },
        zoom: 14
    });

    var informationWindow = new google.maps.InfoWindow();

    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;

        //Now we will create markers for each location.
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i

        });
        markers.push(marker);
        //this onclick event opens the info window.
        marker.addListener('click', function() {
            bounce(this);
            showInfoWindow(this, informationWindow);
        });

    }
    //refrenced this from here https://students.cs.byu.edu/~clement/CS360/jquery/Lab3.html
    var wheaterTimeout = setTimeout(function() {
        alert('unable to load wheater data');
    }, 8000);

    markers.forEach(function(val) {
        var myurl = "http://api.wunderground.com/api/3b4f5103c2d331f2/conditions/q/IN/";
        myurl += val.title
        myurl += ".json";
        console.log(myurl);

        $.ajax({
            url: myurl,
            dataType: "jsonp",
            async: true,
            success: function(parsed_json) {

                var temp_string = parsed_json['current_observation']['temperature_string'];
                var current_weather = parsed_json['current_observation']['weather'];
                val.everything = "<ul>";
                val.everything += "<li>Temperature: " + temp_string;
                val.everything += "<li>Weather: " + current_weather;
                val.everything += "</ul>";
                clearTimeout(wheaterTimeout);
            }
        });
    });



    //this function keeps all the markers within a defined boundary so no matter what the screen size you can see all the markers.
    function createBounds() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }
    createBounds();

    function showInfoWindow(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<h3>' + marker.title + '</h3>' + '<h5> Location: ' + marker.position + '</h5>' + marker.everything);
            infowindow.open(map, marker);
        }
    }
    //this function makes the markers to bounce upon click.
    function bounce(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        window.setTimeout(function() {
            marker.setAnimation(null);
        }, 1400);
    }

};
window.addEventListener('load', initMap);

var ViewModel = function() {
    var self = this;
    this.locationName = ko.observableArray(locations);
    this.searchBox = ko.observable("");
    this.markerItem = ko.observableArray(markers);
    //referenced this link on the udacity forums https://discussions.udacity.com/t/filtering-my-list-of-locations-with-ko/38858/4
    //and found another useful link http://opensoul.org/2011/06/23/live-search-with-knockoutjs/ which helped a lot.
    this.search = function(value) {
        self.locationName([]);
        for (var x in locations) {
            if (locations[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.locationName.push(locations[x]);
                markers[x].setVisible(true);
            } else markers[x].setVisible(false);
        }

    };
    this.searchBox.subscribe(self.search);

//makes the markers to bounce when the list view is clicked
    self.select = function() {
        console.log(this);

        for (i = 0; i < locations.length; i++) {
            holder.push(locations[i].title);
        }
        current = holder.indexOf(this.title);
        google.maps.event.trigger(markers[current], 'click');

    };



};

ko.applyBindings(new ViewModel());

window.onerror = function() {
    alert('failed to load google check your connection');

}