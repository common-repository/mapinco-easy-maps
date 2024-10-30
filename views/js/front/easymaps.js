jQuery(function($) {

	$(document).ready( function(){	
		$('.easymaps').each(function(){
			var that = $(this);
			that.markers = new Array();	
			var zoom = that.attr('attr-zoom');
			var zoom_control = that.attr('attr-zoom-control');
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
			
			that.map = L.map(that.get(0), {
			center:	[48.8589, 2.3469],
			zoom:	zoom,
			zoomControl:	zoom_control,
			layers:layers
			});
			layersControl = L.control.layers(baseMaps);
			layersControl.addTo(that.map);			
			
		if(fullscreen){
			L.control.fullscreen({
				position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, defaut topleft
				title: 'Show the map in fullscreen', // change the title of the button, default Full Screen
				titleCancel: 'Exit fullscreen', // change the title of the button when fullscreen is on, default Exit Full Screen
				content: null, // change the content of the button, can be HTML, default null
				forceSeparateButton: true, // force seperate button to detach from zoom buttons, default false
				forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
				fullscreenElement: false // Dom element to render in full screen, false by default, fallback to map._container
			}).addTo(that.map);		
		}			
				
			that.find('.marker').each(function(){
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
				that.markers.push(marker);
				that.map.addLayer(marker);	
			});	
			if(that.markers.length > 0){
				that.group = L.featureGroup(that.markers);		
				that.map.setView(that.group.getBounds().getCenter(), that.zoom);				
			}			
						
		});	
		
	});
	
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
	
});
