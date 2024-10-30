<?php
class Gaia_AdminMapsController{
    public function __construct(){
        add_action('admin_menu', array($this,'admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts') );
        add_action( 'admin_notices', array($this,'admin_notices') );
    }

    public function admin_menu(){
        add_menu_page(
            __('Easy Maps', 'easymaps'),
            __('Easy Maps', 'easymaps'),
            'manage_options',
            'easymaps',
            array($this, 'admin_page'),
            'dashicons-admin-site',
            20
        );
    }

    public function admin_page(){
        if (!current_user_can('manage_options')) {
            return;
        }
        if(isset($_GET['map_id'])){
            $this->new_map($_GET['map_id']);
        }
        else{
            $this->list_maps();
        }
    }

    public function list_maps(){
        $mapquery = new WP_Query(array(
          'post_type' =>  'mapinco_easymaps'
        ));
        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline"><?= esc_html(get_admin_page_title()); ?></h1>
            <a href="<?php echo admin_url('admin.php?page=easymaps&map_id=new'); ?>" class="page-title-action">Ajouter</a>
            <hr class="wp-header-end">
            <?php
            if($mapquery->have_posts()){ ?>
            <table class="widefat striped" id="markers_table">
                <thead>
                    <tr>
                        <td class="col-name"><?php _e('Name','easymaps'); ?></td>
                        <td class="col-markers"><?php _e('Markers','easymaps'); ?></td>
                        <td class="col-shortcodes"><?php _e('Shortcodes', 'easymaps'); ?></td>
                        <td class="col-actions"></td>
                    </tr>
                </thead>
                <tbody>      
            <?php
              while ( $mapquery->have_posts() ){ $mapquery->the_post(); $post = $GLOBALS['post']; 
                  $markers = get_post_meta($post->ID, 'markers', true);
                  ?>
                  <tr>
                      <td><a href="<?php echo admin_url('admin.php?page=easymaps&map_id='.$post->ID); ?>"><?php echo $post->post_title; ?></a></td>
                      <td><?php echo count($markers); ?></td>
                      <td>[easymaps id="<?php echo $post->ID; ?>"]</td>
                      <td>
                          <a class="button" href="<?php echo admin_url('admin.php?page=easymaps&map_id='.$post->ID); ?>"><?php _e('Edit','easymaps'); ?></a>
                          <a class="button easymaps_delete" href="<?php echo add_query_arg(
                  [
                      'action' => 'easymaps_delete',
                      'map_id'   => $post->ID,
                      'nonce'  => wp_create_nonce('easymaps_admin_delete'),
                  ], admin_url('admin.php')); ?>"><?php _e('Delete','easymaps'); ?></a>        		
                      </td>
                  </tr>
             <?php }  ?>
              </tbody>
             </table>
              <?php
            }
            else{ ?>
                      <p><?php printf(__('No map yet ? <a href="%s">Add your first one</a>','easymaps'), admin_url('admin.php?page=easymaps&map_id=new')); ?></p>
            <?php }
            wp_reset_postdata();
            ?>
        </div>
        <?php
    }

    public function new_map($map_id){
        if($map_id == 'new'){
          $page_title = 'Add new map';
          $map_title = '';
          $map_height = 400;
          $map_zoom = 8;
          $map_zoom_control = 1;
          $map_routing  = 1;
          $map_fullscreen = 1;
          $map_basemap = array('osm_mapnik');
          $markers = array();
        }
        else{
          $page_title = 'Edit map';
          $map = get_post($map_id);
          $map_title = $map->post_title;
          $map_height = get_post_meta($map_id, 'height', true);
          $map_zoom = get_post_meta($map_id, 'zoom', true);
          $map_zoom_control = get_post_meta($map_id, 'zoom_control', true);
          $map_routing = get_post_meta($map_id, 'routing', true);
          $map_fullscreen = get_post_meta($map_id, 'fullscreen', true);
          $map_basemap = get_post_meta($map_id, 'basemap', true);
          $markers = get_post_meta($map_id, 'markers', true);
        }
        ?>
        <div class="wrap">
            <h1><?php _e($page_title, 'easymaps'); ?></h1>
            
            <?php if($map_id != 'new'){ ?>
                <p><?php printf(__('To show the map, use the following shortcode: %s', 'easymaps'), '[easymaps id="'.$map_id.'"]'); ?></p>
            <?php } ?>
      
            <form id="easymaps_form" action="<?php echo admin_url('admin.php?page=easymaps&map_id=' . $map_id); ?>" method="post">
            <?php wp_nonce_field( 'easymaps_'.$map_id, 'easymaps_nonce' ); ?>
            <input type="hidden" name="map_id" value="<?php echo $map_id; ?>">
              <div class="easymaps_settings">
                <div class="easymaps_content">
                  <p>
                    <label for="map_title"><?php _e('Map title', 'easymaps'); ?></label><br>
                    <input type="text" name="map_title" id="map_title" class="regular-text" value="<?php echo $map_title; ?>">
                  </p>
                  <p>
                    <label for="map_height"><?php _e('Height', 'easymaps'); ?></label><br>
                    <input type="text" name="map_height" id="map_height" class="regular-text" value="<?php echo $map_height; ?>">
                  </p>
                  <p>
                    <label for="map_basemap"><?php _e('Basemap', 'easymaps'); ?></label><br>
                        <select name="map_basemap[]" id="map_basemap" class="regular-text" multiple="multiple">
                            <?php 
                            $providers = GAIA_EasyMaps::getBasemaps(); 
                            foreach($providers as $provider=>$basemaps){ ?>
                            <optgroup label="<?php echo $provider; ?>">
                            <?php foreach($basemaps as $value=>$name){ ?>
                                <option value="<?php echo $value; ?>" <?php if(in_array($value,$map_basemap)) echo 'selected="selected"'; ?>><?php echo $name; ?></option>
                            <?php } ?>
                            </optgroup>
                            <?php }	?>
                        </select>             	 
                  </p>             
                  <p>
                    <label for="map_zoom"><?php _e('Zoom level', 'easymaps'); ?></label><br>
                    <input type="number" name="map_zoom" id="map_zoom" class="regular-text" value="<?php echo $map_zoom; ?>">
                  </p>
                  <p>
                    <label for="map_zoom_control">
                        <input type="checkbox" name="map_zoom_control" id="map_zoom_control" class="regular-text" <?php if($map_zoom_control) echo 'checked="checked"'; ?>">
                        <?php _e('Zoom control', 'easymaps'); ?>
                    </label>
                  </p> 
                  <?php /*<p>
                    <label for="map_routing">
                        <input type="checkbox" name="map_routing" id="map_routing" class="regular-text" <?php if($map_routing) echo 'checked="checked"'; ?>">
                        <?php _e('Routing', 'easymaps'); ?>
                    </label>
                  </p> */ ?> 
                  <p>
                    <label for="map_fullscreen">
                        <input type="checkbox" name="map_fullscreen" id="map_fullscreen" class="regular-text" <?php if($map_fullscreen) echo 'checked="checked"'; ?>">
                        <?php _e('Fullscreen', 'easymaps'); ?>
                    </label>
                  </p>                                                            
                </div>
                <div class="easymaps_view">
                  <div id="easymaps_map" style="height:<?php echo $map_height; ?>px;" 
                      attr-zoom="<?php echo $map_zoom; ?>"
                      attr-zoom-control="<?php echo (bool)$map_zoom_control; ?>"
                      attr-routing="<?php echo (bool)$map_routing; ?>"
                      attr-fullscreen="<?php echo (bool)$map_fullscreen; ?>"
                      attr-basemap="<?php echo implode(',',$map_basemap); ?>">
                      <?php if(count($markers)>0){ foreach($markers as $key=>$marker){ ?>
                          <div class="marker" 
                              attr-id="marker-<?php echo $key; ?>"
                              attr-name="<?php echo $marker['name']; ?>" 
                              attr-address="<?php echo $marker['address']; ?>" 
                              attr-coords="<?php echo $marker['coords']; ?>"
                          >
                              <div class="marker_popup">
                                  <?php echo $marker['popup']; ?>
                              </div>
                          </div>
                      <?php } } ?>
                  </div>
                </div>
              </div>
              
              <div class="easymaps_container">
                  <div class="easymaps_markers">
              
                          <h2><?php _e('Markers','easymaps'); ?></h2>
                                    
                          <table class="widefat striped" id="markers_table">
                              <thead>
                                  <tr>
                                      <td class="col-name"><?php _e('Name','easymaps'); ?></td>
                                      <td class="col-address"><?php _e('Address','easymaps'); ?></td>
                                      <td class="col-actions"></td>
                                  </tr>
                              </thead>
                              <tbody>
                              <?php if(count($markers)>0){ foreach($markers as $key=>$marker){ ?>
                              <tr id="marker-<?php echo $key; ?>">
                                  <td class="marker_name"><?php echo $marker['name']; ?></td>
                                  <td class="marker_address"><?php echo $marker['address']; ?></td>
                                  <td>
                                      <input type="hidden" class="marker_name_input" name="marker_name[]" value="<?php echo $marker['name']; ?>">
                                      <input type="hidden" class="marker_address_input" name="marker_address[]" value="<?php echo $marker['address']; ?>">
                                      <input type="hidden" class="marker_coords_input" name="marker_coords[]" value="<?php echo $marker['coords']; ?>">
                                      <textarea style="display:none;" class="marker_popup_input" name="marker_popup[]"><?php echo $marker['popup']; ?></textarea>
                                      <button class="button" name="marker_edit"><?php _e('Edit','easymaps'); ?></button>
                                      <button class="button" name="marker_delete"><?php _e('Delete','easymaps'); ?></button>
                                  </td>
                              </tr>          	
                              <?php } } ?>          	
                              </tbody>
                          </table>
                         </div>
                         
                         <div class="easymaps_addmarker">
                         
                                <h2><?php _e('Add a marker', 'easymaps'); ?></h2>
                                <div class="easymaps_container">
                                  <div id="marker_addedit">          	
                                        <div class="marker_block">
                                          <label for="marker_name"><?php _e('Name', 'easymaps'); ?></label><br>
                                          <input type="text" id="marker_name">
                                        </div>
                                        <div class="marker_block">
                                          <label for="marker_address"><?php _e('Address', 'easymaps'); ?></label><br>
                                          <input type="text" id="marker_address">
                                          <input type="text" readonly id="marker_coords">
                                        </div>
                                        <div class="marker_block">
                                            <?php wp_editor('', 'popup_content', [
                                                'media_buttons'	=>	false,
                                                'teeny'	=>	true
                                            ]); ?>
                                        </div>		        
                                        <div class="marker_block">
                                            <input type="hidden" id="marker_id">
                                            <button type="button" class="button" id="easymaps_addmarker"><?php _e('Save Marker','easymaps'); ?></button>
                                        </div>
                                  </div>
                                </div>				   
                         
                         </div>
                         
                        </div>
              <script id="marker_template" type="x-tmpl-mustache">          
                  <tr id="{{ id }}">
                      <td class="marker_name">{{ name }}</td>
                      <td class="marker_address">{{ address }}</td>
                      <td>
                          <input type="hidden" class="marker_name_input" name="marker_name[]" value="{{ name }}">
                          <input type="hidden" class="marker_address_input" name="marker_address[]" value="{{ address }}">
                          <input type="hidden" class="marker_coords_input" name="marker_coords[]" value="{{ coords }}">
                          <input type="hidden" class="marker_coords_popup" name="marker_popup[]" value="{{ popup }}">
                          <button class="button" name="marker_edit"><?php _e('Edit','easymaps'); ?></button>
                          <button class="button" name="marker_delete"><?php _e('Delete','easymaps'); ?></button>
                      </td>
                  </tr>
              </script>
              <p class="submitbox">
                  <?php $delete_url = add_query_arg(
                  [
                      'action' => 'easymaps_delete',
                      'map_id'   => $map_id,
                      'nonce'  => wp_create_nonce('easymaps_admin_delete'),
                  ], admin_url('admin.php')); ?>
                  <input type="submit" class="button button-primary" name="easymaps_submit" value="<?php _e('Save Map','easymaps'); ?>">
                  <?php if($map_id != 'new'){ ?><a href="<?php echo $delete_url; ?>" class="easymaps_delete submitdelete"><?php _e('Delete','easymaps'); ?></a><?php } ?>
              </p>
            </form>
        </div>
        <?php
    }

    public function admin_enqueue_scripts($hook){
        if($hook == 'toplevel_page_easymaps'){
            wp_enqueue_style('leaflet',GAIA_EASYMAPS_URL . 'inc/leaflet/leaflet.css');
            wp_enqueue_style('easymaps_admin', GAIA_EASYMAPS_URL . 'views/css/admin/easymaps.css');
            wp_enqueue_script('leaflet',GAIA_EASYMAPS_URL . 'inc/leaflet/leaflet.js');		
            wp_enqueue_script('gmap_api','https://maps.googleapis.com/maps/api/js?key=AIzaSyCsbzgJwljiQwFpnmun7to_9GAdk8WNgQ8&libraries=places');
            wp_enqueue_script('mustache', GAIA_EASYMAPS_URL . 'inc/mustache.min.js');
    
            // leaflet fullscreen
            wp_enqueue_style('easymaps_fullscreen', GAIA_EASYMAPS_URL . 'inc/leaflet/plugins/leaflet-fullscreen/Control.FullScreen.css');
            wp_enqueue_script('easymaps_fullscreen', GAIA_EASYMAPS_URL . 'inc/leaflet/plugins/leaflet-fullscreen/Control.FullScreen.js', array('jquery', 'leaflet'));
            
            // esri leaflet geocoder
            //wp_enqueue_style('esri_leaflet_geocoder','https://unpkg.com/esri-leaflet-geocoder@2.2.6/dist/esri-leaflet-geocoder.css');
        //wp_enqueue_script('esri_leaflet_geocoder', 'https://unpkg.com/esri-leaflet-geocoder@2.2.6', array('jquery', 'leaflet', 'esri_leaflet'));
            
            //select 2
            wp_enqueue_script('select2', GAIA_EASYMAPS_URL . 'inc/select2/select2.full.min.js');
            wp_enqueue_style('select2', GAIA_EASYMAPS_URL . 'inc/select2/select2.min.css');
            
            wp_enqueue_script('easymaps_admin', GAIA_EASYMAPS_URL . 'views/js/admin/easymaps.js', array(
                'jquery', 
                'select2',
                'leaflet',
                /*'esri_leaflet', 
                'esri_leaflet_geocoder',*/
                'gmap_api','mustache', 
                'easymaps_fullscreen'
            ));
            
        }
    }

    public function admin_notices() {
        if(isset($_GET['page'])){
    
            if($_GET['page'] == 'easymaps' && isset($_GET['msg'])){
        
                switch($_GET['msg']){
                    case 'delete':
                        $class = 'notice notice-success';
                        $message = __( 'Map deleted.', 'easymaps' );			
                    break;
                    case 'new':
                        $class = 'notice notice-success';
                        $message = __( 'Map added.', 'easymaps' );				
                    break;
                    case 'edit':
                        $class = 'notice notice-success';
                        $message = __( 'Map edited.', 'easymaps' );				
                    break;
                }
        
                printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) ); 
            } 
        
        }   
    }
}
new Gaia_AdminMapsController();