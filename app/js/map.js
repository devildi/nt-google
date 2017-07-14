var map
var pos
var isiPhone = navigator.userAgent.toLocaleLowerCase().match(/iPhone/i)
var point = {}
var thisMarker 

function initMap() {
	let userdata = {
    play: [[{
      name:'故宫',
      des:'沈阳必玩沈阳必玩沈阳必玩沈阳必玩沈阳必玩沈阳必玩沈阳必玩沈阳必玩沈阳必玩沈阳必玩',
      location:{lat: 41.797087, lng: 123.45573999999999}
    },
    {
      name:'颐和园',
      des:'沈阳必玩沈阳必玩沈阳',
      location:{lat: 41.80236722739665, lng: 123.4043384233398}
    },
    {
      name:'颐',
      des:'沈阳必玩沈阳必玩沈阳必玩沈阳必玩沈阳必玩',
      location:{lat: 41.80236722739665, lng: 123.5043385233398}
    }]],
    dinner: []
  }

  var playData = function(arr){
      let newarray = []
      for (var i = 0; i < arr.length; i++){
        for(var j = 0; j < arr[i].length; j++){
          newarray.push(arr[i][j])
        }
      }
      return newarray
    }

  var node = function(arr){
    var string = ''
    for (var i = 0; i < arr.length; i++){
      string+='<a href="#" class="list-group-item">'+arr[i].name+'</a>'
    }
    return string
  }

  for (var i = 0; i < userdata.play.length; i++){
    $('.panel-group').append('<div class="panel panel-default">'+
      '<div class="panel-heading" role="tab" id="headingOne">'+
        '<h4 class="panel-title">'+
          '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">'+
            'day'+ (i+1) +
          '</a>'+
        '</h4>'+
      '</div>'+
      '<div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">'+
        '<div class="panel-body">'+
          '<div class="list-group">'+
            node(userdata.play[i])+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>')
  }

  $('.list-group').delegate('a', 'click', function(e) {
  	for( v in point){
  		point[v][0].close()
  	}
    var lable = e.target.innerHTML
      for ( key in point) {
        if ( lable == key) {
          thisMarker = point[key]
          break
        } else {
          continue
        }
      }
      thisMarker[0].open(map, thisMarker[1])
      var sidebar = $('.sidebar')
      sidebar.css('right',-250)
  })

	if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(complete, error)
  }
  function complete(position) {
    //路线服务
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer

    pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    map = new google.maps.Map(document.getElementById('map'), {
      center: pos,
      zoom: 12,
      streetViewControl: false
    })
    directionsDisplay.setMap(map)
    var myloc = new google.maps.Marker({
      clickable: false,
      icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                      new google.maps.Size(22,22),
                                                      new google.maps.Point(0,18),
                                                      new google.maps.Point(11,11)),
      shadow: null,
      position: pos,
      zIndex: 999,
      map: map
    })

    playData(userdata.play).map(function(item, index){
      function createInfoWindow(title, that) {
          var info = document.createElement("div")
          info.id = "content"

          var top = document.createElement("h3")
          top.id = "firstHeading"
          top.className = "firstHeading"
          top.innerHTML = title.name

          var titleD = document.createElement("div")
          var topC = document.createElement("p")
          topC.innerHTML = title.des
          titleD.appendChild(topC)

          var middle = document.createElement("div")
          
          var pWalk = document.createElement("p")
          pWalk.className = "btnLeft"
          var pA = document.createElement("a")
          pA.className = "btn btn-primary"
          pA.id = "walk"
          pA.href = "#"
          pA.role = "button"
          pA.innerHTML = "步行"
          pWalk.appendChild(pA)

          var pBus = document.createElement("p")
          pBus.className = "btnRight"
          var pB = document.createElement("a")
          pB.className = "btn btn-success"
          pB.id = "bus"
          pB.href = "#"
          pB.role = "button"
          pB.innerHTML = "公交"
          pBus.appendChild(pB)

          middle.appendChild(pWalk)
          middle.appendChild(pBus)
          //步行路线
          pA.onclick = function(){
            directionsService.route({
              origin: pos,
              destination: item.location,
              travelMode: 'WALKING'
            }, function(response, status) {
              if (status === 'OK') {
                directionsDisplay.setDirections(response)
                topC.innerHTML = '需步行'+response.routes[0].legs[0].distance.text +'/大约用时'+ response.routes[0].legs[0].duration.text
              } else {
                window.alert('Directions request failed due to ' + status);
              }
            })
          }
          //公交路线
          pB.onclick = function(){
            directionsService.route({
              origin: pos,
              destination: item.location,
              travelMode: 'TRANSIT'
            }, function(response, status) {
              if (status === 'OK') {
                directionsDisplay.setDirections(response)
                topC.innerHTML = '距离'+response.routes[0].legs[0].distance.text +'/大约用时'+ response.routes[0].legs[0].duration.text
              } else {
                window.alert('Directions request failed due to ' + status);
              }
            })
          }
          
          info.appendChild(top)
          info.appendChild(titleD)
          info.appendChild(middle)

          // 定义底部内容
          var bottom = document.createElement("div")
          bottom.className = "info-bottom"
          bottom.style.position = 'relative'
          bottom.style.top = '0px'
          bottom.style.margin = '0 auto'
          var sharp = document.createElement("img")
          sharp.src = "http://webapi.amap.com/images/sharp.png"
          bottom.appendChild(sharp)
          info.appendChild(bottom)
          return info
      }
      var infowindow = new google.maps.InfoWindow({
        content: createInfoWindow(item, this),
        maxWidth: 300
      })
      var marker = new google.maps.Marker({
        position: item.location,
        title: item.name,
        animation: google.maps.Animation.DROP
      })
      point[item.name] = [infowindow,marker]
      marker.setMap(map)
      marker.addListener('click', function(){
        for( v in point){
          point[v][0].close()
        }
        infowindow.open(map, marker)
      })
    })
  }
  function error(){
    alert('error')
  }
}