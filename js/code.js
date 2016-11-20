var map;

var markers = [];
var holder = [];
//created an array of all the details or the locations that we need to create on map.
var locations = [
    {   title: 'Jammu and Kashmir', 
        location: {lat:33.7781750, lng:76.5761710}
    },
    {   title: 'Udhampur', 
        location: {lat:32.9159850, lng:75.1416170}   
    },
    {   title: 'Himachal Pradesh',
        location: {lat:31.1048290, lng:77.1733900}
    },
    {   title: 'Chandigarh', 
        location: {lat:30.7333150, lng:76.7794180}
    },
    {   title: 'Haryana', 
        location: {lat:29.0587760, lng:76.0856010}
    },
    {   title: 'New Delhi',
        location: {lat:28.6139390, lng:77.2090210}
    },
    {   title: 'Madhya Pradesh', 
        location: {lat:22.9734230, lng:78.6568940}
    },
    {   title: 'Gujrat', 
        location: {lat:22.2586520, lng:71.1923810}
    },
    {   title: 'Bengaluru', 
        location: {lat:12.9715990, lng:77.5945630}
    },
    {   title: 'Mysore', 
        location: {lat:12.2958100, lng:76.6393810}
    }
    
    
];

//refrenced the code from the google map api class of udacity.
initMap = function() {
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

    //this function keeps all the markers within a defined boundary so no matter what the screen size you can see all the markers.
    function createBounds() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].position);
        }
            map.fitBounds(bounds);
    } createBounds();

    function showInfoWindow(marker,infowindow) {
        if(infowindow.marker != marker) {
          infowindow.marker = marker;
        infowindow.setContent ('<h3>' + marker.title + '</h3>' + '<h5> Location: ' + marker.position + '</h5>');
        infowindow.open(map,marker);
       }
   }
   
   function bounce(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        window.setTimeout(function(){
            marker.setAnimation(null);
        },1400);
   }
   
};
window.addEventListener('load',initMap);

var ViewModel = function() {
   var self = this;
   this.locationName = ko.observableArray(locations);
   this.searchBox = ko.observable("");
   this.markerItem = ko.observableArray(markers);
//referenced this link on the udacity forums https://discussions.udacity.com/t/filtering-my-list-of-locations-with-ko/38858/4
//and found another useful link http://opensoul.org/2011/06/23/live-search-with-knockoutjs/ which helped a lot.
   this.search = function(value) {
        self.locationName([]);
        for(var x in locations) {
        if(locations[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0){
            self.locationName.push(locations[x]);
            markers[x].setVisible(true);
        }
        else markers[x].setVisible(false);
        }
    
   };
   this.searchBox.subscribe(self.search);
    

   self.select = function() {
        console.log(this);
                
                for(i = 0; i < locations.length; i++) {
                        holder.push(locations[i].title);
            }
                current = holder.indexOf(this.title);
                google.maps.event.trigger(markers[current], 'click');
              
         };
                         
    

};

ko.applyBindings(new ViewModel());