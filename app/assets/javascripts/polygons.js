var draw = false;
var polygons = [];
var edit_polygon;
var index = 0;
var ID = 0;
var Qatar = [{"lat":29.937748,"lng":69.373000}];
var map_focus = Qatar;
var polygonIndex;
var zoom = 6;

function polygon_marker(){
  google.maps.event.addListener(handler.map.getServiceObject(),'click',function(event){
     if (draw == true)
     {
        if (index == 0)
        {
           handler.bounds.extendWith(handler.addPolygons(
              [[
                 { lat: event.latLng.lat(), lng: event.latLng.lng() },
                 { lat: event.latLng.lat(), lng: event.latLng.lng() }
              ]],{ strokeColor: '#FFBF00'}
           ));
        }
        else
        {
           handler.bounds.extendWith(
              handler.addPolygons(
              [
                 [
                    {lat: polygons[index-1]['lat'], lng: polygons[index-1]['lng']},
                    {lat: event.latLng.lat(), lng: event.latLng.lng()}
                 ]
              ],{ strokeColor: '#FFBF00'}
           ));
        }
       polygons.push({lat:event.latLng.lat(), lng:event.latLng.lng()});
       index += 1;
     }
  });
  handler.fitMapToBounds();
  handler.getMap().setZoom(zoom);
  // handler.getMap().setOptions({styles});
  handler.map.centerOn(map_focus);
}

function save_polygons(){
   draw = !draw;
   if (draw == false)
   {
      document.getElementById("cancel_btn").style.display = "none";
      document.getElementById("draw_btn").className = "btn btn-info";
      document.getElementById("draw_icon").className = "fa fa-pencil";
      if (index != 0)
      {
        $("#polygon_name").modal();
        handler.bounds.extendWith(handler.addPolygons(
          [
            [
              {lat:  polygons[index-1]['lat'], lng: polygons[index-1]['lng']},
              {lat:  polygons[0]['lat'], lng: polygons[0]['lng']}
            ]
          ],{ strokeColor: '#FFBF00'}
        ));
        handler.bounds.extendWith(handler.addPolygons([polygons],{ strokeColor: '#FFBF00'}));
      }
   }
   else
   {
      document.getElementById("cancel_btn").style.display = "block";
      document.getElementById("draw_btn").className = "btn btn-success";
      document.getElementById("draw_icon").className = "fa fa-save (alias)";
   }
}

function send_polygons(){
  name_filed = document.getElementById("name_field");
  name = name_field.value;
  jQuery.ajax({
    data: ({name: name, polygons: polygons}),
    type: 'get',
    url: "/save_polygon"
  });
  name_field.value = "";
  polygons = [];
  index = 0;
  location.reload(true);
}

function edit_polygons(id,index,lat,lng){
  polygonIndex = index;
  ID = id;
  console.log(id);
  document.getElementById("save_btn").style.display = "block";
  document.getElementById("cancel_btn").style.display = "block";
  document.getElementById("draw_btn").style.display = "none";
  map_focus = [{"lat": lat ,"lng": lng }];
  zoom = 8;
  make_map(index);
}

function update_polygons(){
  polygons = [];
  var arr = edit_polygon.serviceObject.latLngs.b[0].b;
  for (var i=0; i<edit_polygon.serviceObject.latLngs.b[0].length; i++)
  {
    polygons.push({lat: arr[i].lat(), lng: arr[i].lng()});
  }
  document.getElementById("save_btn").style.display = "none";
  document.getElementById("draw_btn").style.display = "block";
  jQuery.ajax({
    data: ({ id: ID, polygons: polygons }),
    type: 'post',
    url: "/update_polygon"
  });
  location.reload(true);
}

function cancel_update(){
  document.getElementById("save_btn").style.display = "none";
  document.getElementById("cancel_btn").style.display = "none";
  document.getElementById("draw_btn").style.display = "block";
  document.getElementById("draw_btn").className = "btn btn-info";
  document.getElementById("draw_icon").className = "fa fa-pencil";
  name_field.value = "";
  polygons = [];
  index = 0;
  draw = false;
  map_focus = Qatar;
  zoom = 9;
  make_map(null);
}