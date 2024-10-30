jQuery(function($) {


  var placeSearch, autocomplete, map, markers, layersControl, basemaps, layers; 
  
  function activateFullscreen(){
		L.control.fullscreen({
			position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, defaut topleft
			title: 'Show the map in fullscreen', // change the title of the button, default Full Screen
			titleCancel: 'Exit fullscreen', // change the title of the button when fullscreen is on, default Exit Full Screen
			content: null, // change the content of the button, can be HTML, default null
			forceSeparateButton: true, // force seperate button to detach from zoom buttons, default false
			forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
			fullscreenElement: false // Dom element to render in full screen, false by default, fallback to map._container
		}).addTo(map);  
  }
  
  function getBaseMap(name){
  	switch(name){
  		case 'google_hybrid':
  			name = 'Google Hybrid';
  			tile = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
  				name:'google_hybrid',
    			maxZoom: 20,
    			subdomains:['mt0','mt1','mt2','mt3'],
    			attribution:'&copy; Google'
				});
				break;
			case 'google_satellite':
  			name = "Google Satellite";
  			tile = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  				name:'google_satellite',
    			maxZoom: 20,
    			subdomains:['mt0','mt1','mt2','mt3'],
    			attribution:'&copy; Google'
				});	
				break;				
			case 'google_streets':
  			name = "Google Streets";
  			tile = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    			name:'google_streets',
    			maxZoom: 20,
    			subdomains:['mt0','mt1','mt2','mt3'],
    			attribution:'&copy; Google'
				});	
				break;	
			case 'google_terrain':
  			name = "Google Terrain";
  			tile = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    			name:'google_terrain',
    			maxZoom: 20,
    			subdomains:['mt0','mt1','mt2','mt3'],
    			attribution:'&copy; Google'
				});		
				break;	
			case 'osm_mapnik':
  			name = "OpenStreetMap Mapnik";
  			tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					name:'osm_mapnik',
					maxZoom: 19,
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				});
				break;	
			case 'osm_fr':
  			name = "OpenStreetMap France";
  			tile = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
					name:'osm_fr',
					maxZoom: 20,
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				});
				break;	
			case 'osm_gray':
  			name = "OpenStreetMap Grayscale";
  			tile = L.tileLayer('https://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
					name:'osm_gray',
					maxZoom: 18,
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				});
				break;	
			case 'osm_bzh':
  			name = "OpenStreetMap Breizh";
  			tile = L.tileLayer('http://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png', {
					name:'osm_bzh',
					maxZoom: 19,
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				});			
				break;
			case 'osm_topo':
  			name = "OpenStreetMap Topo";
  			tile = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
					name:'osm_topo',
					maxZoom: 17,
					attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
				});			
				break;	
			case 'stamen_toner':
				name="Stamen Toner";
				tile = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',{
					attribution:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
				});
				break;
			case 'stamen_terrain':
				name="Stamen Terrain";
				tile = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',{
					attribution:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
				});
				break;
			case 'stamen_watercolor':
				name="Stamen Watercolor";
				tile = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',{
					attribution:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
				});
				break;	
			case 'esri_streetmap':
				name="Street Map";
				tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
				});
			break;
			case 'esri_topomap':
				name="Topo Map";
				tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
				});
			break;
			case 'esri_delorme':
				name="De Lorme";
				tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; Copyright: &copy;2012 DeLorme',
					minZoom: 1,
					maxZoom: 11
				});
			break;
			case 'esri_imagery':
				name="Imagery";
				tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
				});
			break;
			case 'esri_terrain':
				name="Terrain";
				tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
					maxZoom: 13
				});
			break;
			case 'esri_physical':
				name="Physical";
				tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
					maxZoom: 8
				});
			break;
			case 'esri_ocean':
				name="Ocean";
				tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
					maxZoom: 13
				});
			break;
			case 'esri_natgeo':
				name="Nat Geo";
				tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
					maxZoom: 16
				});
			break;
			case 'esri_gray':
				name="Grayscale";
				tile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
					maxZoom: 16
				});
			break;						
																												
  	}  	
  	return [name, tile];
  }
  
  function loadBaseMap(name, basemaps, layers){
  	var ret = getBaseMap(name);
  	name = ret[0];
  	tile = ret[1];
  	basemaps[name] = tile;
  	layers.push(tile);
  	return [basemaps, layers];
  }

	$(document).ready( function(){
	
		$('.easymaps_delete').click(function(e){
			if(confirm('Delete map?')){
				return true;
			} 
			return false;
		});	
		if($('#easymaps_map').length > 0){
	
			$('#map_basemap').select2();
	
			markers = new Array();
			var that = $('#easymaps_map');
			var zoom = that.attr('attr-zoom');
			var zoom_control = that.attr('attr-zoom-control');
			var routing = that.attr('attr-routing');
			var fullscreen = that.attr('attr-fullscreen');
			var basemap = that.attr('attr-basemap');
				
			var basemap_names = basemap.split(',');
			baseMaps = {};
			layers = [];
			for(i in basemap_names){
				var ret = loadBaseMap(basemap_names[i], baseMaps, layers);
				baseMaps = ret[0];
				layers = ret[1];			
			}
			map = L.map('easymaps_map',{
				center:	[48.8589, 2.3469],
				zoom:	zoom,
				zoomControl:	zoom_control,
				layers:layers
			});
			layersControl = L.control.layers(baseMaps);
			layersControl.addTo(map);
		
	
		
			if(fullscreen){
				activateFullscreen();		
			}
		  
		  $('#map_height').on('change', function(){
				that.height($(this).val()); 	
				map.invalidateSize();
				/*zoom = map.getZoom();
				var group = L.featureGroup(markers);		
				map.setView(group.getBounds().getCenter(), zoom);					*/
		  }); 
		  
		  $('#map_zoom').on('change', function(){
				map.setZoom($(this).val()); 	
		  });        
		  
		  $('#map_basemap').on('change', function(){
		  	var basemap_names = $(this).val();
		  	var existLayers = [];
				map.eachLayer(function(layer){
					var pane = layer.getPane();
					if($(pane).hasClass('leaflet-tile-pane')){
						var layer_name = layer.options.name;
						// si le fond de carte existant n'est pas dans la sélection, on le supprime
						if(basemap_names.indexOf(layer_name) === -1){
							map.removeLayer(layer);
							layersControl.removeLayer(layer);
						}
						else{
							existLayers.push(layer_name);
						}					
					}					
				});
				for(i in basemap_names){
					// Si le fond de carte sélectionné n'est pas dans la liste des existants, on l'ajoute
					if(existLayers.indexOf(basemap_names[i]) === -1){
						var ret = getBaseMap(basemap_names[i]);
						baseMaps[ret[0]] = ret[1];
						layers.push(ret[1]);	
						map.addLayer(ret[1]);	
						layersControl.addBaseLayer(ret[1], ret[0]);		
					}
				}  	   	
		  });
		  
		  $('#map_zoom_control').on('change', function(){
		  	if('checked' == $(this).attr('checked')){
		  		that.find('.leaflet-control-zoom').show();	  		
		  	}
		  	else{
		  		that.find('.leaflet-control-zoom').hide();
		  	}  	
		  });

		  $('#map_fullscreen').on('change', function(){
		  	if('checked' == $(this).attr('checked')){
		  		if(that.find('.leaflet-control-zoom-fullscreen').length > 0){
		  			that.find('.leaflet-control-zoom-fullscreen').parent().show();
		  		}
		  		else{
		  			activateFullscreen();
		  		}	  		
		  	}
		  	else{
		  		that.find('.leaflet-control-zoom-fullscreen').parent().hide();
		  	}  	
		  });        
		  
		
		
			$('#easymaps_map').find('.marker').each(function(){
				var id = $(this).attr('attr-id');
				var name = $(this).attr('attr-name');
				var address = $(this).attr('attr-address');
				var coords = $(this).attr('attr-coords').split(',');
				var popup_content = $(this).find('.marker_popup').html();
			
				var marker = L.marker([coords[0], coords[1]],{
					'id':	id,
					'title':	name
				});
				if(popup_content.trim().length > 0){
					var popup = L.popup({}, marker).setContent(popup_content);
					marker.bindPopup(popup);
				}
				markers.push(marker);
				map.addLayer(marker);			
			});
		
			if(markers.length > 0){
				var group = L.featureGroup(markers);		
				map.setView(group.getBounds().getCenter(), zoom);				
			}

	
			initAutocomplete();
		
			// Action sur le bouton de suppression d'un marqueur
			$(document).on('click', 'button[name=marker_delete]', function(e){
				e.preventDefault();
				if(confirm('Delete marker?')){				
					var tr = $(this).parents('tr');	
					for(i in markers){
						marker = markers[i];
						if(marker.options.id == tr.attr('id')){
							map.removeLayer(marker);
							markers.splice(i, 1);
						}
					}		
					$(this).parents('tr').remove();		
					
					zoom = map.getZoom();
					var group = L.featureGroup(markers);		
					map.setView(group.getBounds().getCenter(), zoom);								
						
				} 					
			});
		
			// Action sur le bouton de modification d'un marqueur
			$(document).on('click','button[name=marker_edit]', function(e){
				e.preventDefault();
				var tr = $(this).parents('tr');	
				var id = tr.attr('id');
				var name = tr.find('.marker_name_input').val();
				var address = tr.find('.marker_address_input').val();
				var coords = tr.find('.marker_coords_input').val();		
				var popup_content = tr.find('.marker_popup_input').val();			
			
				var marker_edit = $('#marker_addedit');
				marker_edit.find('#marker_name').val(name);
				marker_edit.find('#marker_address').val(address);
				marker_edit.find('#marker_coords').val(coords);
				marker_edit.find('#marker_id').val(id);	
				tinymce.get('popup_content').setContent('');
				tinymce.get('popup_content').setContent(popup_content);	
			
				scrolltop = $('#marker_addedit').offset().top;
				$('html, body').animate({
					scrollTop:scrolltop
				}, 'slow');			
			});		
		
			$('#easymaps_addmarker').click(function(){

				var name = $('#marker_name').val();
				var address = $('#marker_address').val();
				var coords = $('#marker_coords').val();
				var popup_content = tinymce.get('popup_content').getContent();
				var id = $('#marker_id').val();
			
				if(id.length == 0){
			
						// nouveau marqueur
										
						var id = 'marker-' + $('#markers_table').find('tbody tr').length;
			
						var template = $('#marker_template').html();
						Mustache.parse(template); 
						var rendered = Mustache.render(template, {
							id:	id,
							name: name,
							address:address,
							coords:coords,
							popup: popup_content
						});  		
						$(rendered).appendTo($('#markers_table').find('tbody')); 
						  					
				}
				else{
			
					// marqueur modifié
				
					var tr = $('#' + id);
					tr.find('.marker_name').text(name);
					tr.find('.marker_address').text(address);
					tr.find('.marker_name_input').val(name);
					tr.find('.marker_address_input').val(address);
					tr.find('.marker_coords_input').val(coords);
					tr.find('.marker_popup_input').val(popup_content);
				
					for(i in markers){
						marker = markers[i];
						if(marker.options.id == id){
							map.removeLayer(marker);
						}
					}						
				
				}
			
				var coords = coords.split(',');
				var marker = L.marker([coords[0], coords[1]],{
					'id': id,
					'title':	name
				});
				var popup = L.popup({}, marker)
					.setContent(popup_content);
				marker.bindPopup(popup); 
				markers.push(marker);
				map.addLayer(marker);	
				
				if(markers.length > 0){
					zoom = map.getZoom();
					var group = L.featureGroup(markers);		
					map.setView(group.getBounds().getCenter(), zoom);				
				}							
				 					
		
				$('#marker_name').val('');
				$('#marker_address').val('');	
				$('#marker_coords').val('');
				$('#marker_id').val('');  
				tinymce.get('popup_content').setContent('');
				
			
			});	
		
		}
	
	}); 

  function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('marker_address')),
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
  }

  function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    var lat = roundDecimal(place.geometry.location.lat(),5);
    var lng = roundDecimal(place.geometry.location.lng(),5);
    document.getElementById('marker_coords').value = lat + ',' + lng;

  }
  function roundDecimal(nombre, precision){
			var precision = precision || 2;
			var tmp = Math.pow(10, precision);
			return Math.round( nombre*tmp )/tmp;
	}  
});
