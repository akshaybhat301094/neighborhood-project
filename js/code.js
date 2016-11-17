var map;

var markers = [];

var locations = [
    {
        title: 'My Home!', 
        location: {lat:32.923246, lng:75.127999}
    },
    {   title: 'Devika',
        location: {lat:32.924933, lng:75.131099}
    },
    {   title: 'Degree College', 
        location: {lat:32.926401, lng:75.125585}
    },
    {   title: 'District Hospital', 
        location: {lat:32.919926, lng:75.132827}
    },
    {   title: 'Army Public School',
        location: {lat:32.920907, lng:75.114759}
    },
    {   title: 'Railway Station', 
        location: {lat:32.925951, lng:75.154005}
    }

];

//refrenced the code from the google map api class of udacity.
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:32.923246, lng:75.127999},
          zoom: 14
    });

    var informationWindow = new google.maps.InfoWindow();

    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
    //Now we will create markers for each location.
        var marker = new google.maps.Marker ({
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
            showInfoWindow(this,informationWindow);
        });
    }
       function showInfoWindow(marker,infowindow) {
        if(infowindow.marker != marker) {
          infowindow.marker = marker;
        infowindow.setContent ('<h3>' + marker.title + '</h3>');
        infowindow.open(map,marker);
       }
   }
   
   function bounce(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        window.setTimeout(function(){
            marker.setAnimation(null);
        },1400);
   }
   
}
window.addEventListener('load',initMap);

var ViewModel = function() {
   var self = this;
   self.locationName = ko.observableArray(locations);
   self.searchBox = ko.observable("");
//referenced this link on the udacity forums https://discussions.udacity.com/t/filtering-my-list-of-locations-with-ko/38858/4
//and found another useful link http://opensoul.org/2011/06/23/live-search-with-knockoutjs/ which helped a lot.
   self.search = function(value) {
        self.locationName([]);
        for(var x in locations) {
        if(locations[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0){
            self.locationName.push(locations[x]);
        }
        }
    
   };
   self.searchBox.subscribe(self.search);

}

ko.applyBindings(new ViewModel());