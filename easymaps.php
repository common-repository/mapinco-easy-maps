<?php
/*
Plugin Name:  Easy Maps
Plugin URI:
Description:	Create simple and personalized maps based on Leafletjs.
Version:      0.3
Author:       Gaïasphère.net
Author URI:   https://gaiasphere.net
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  easymaps
Domain Path:  /languages
*/
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );


define( 'GAIA_EASYMAPS_PATH', plugin_dir_path( __FILE__ ) );
define( 'GAIA_EASYMAPS_URL', plugin_dir_url( __FILE__ ) );

require_once(GAIA_EASYMAPS_PATH.'/controllers/admin/AdminMapsController.php');
require_once(GAIA_EASYMAPS_PATH.'/controllers/front/FrontMapsController.php');


if ( !class_exists( 'GAIA_EasyMaps' ) ) {
    class GAIA_EasyMaps
    {
      public function __construct(){
          add_action('init', array($this, 'init'));
          add_action( 'plugins_loaded', array($this, 'plugins_loaded') );
          add_filter('script_loader_tag', function($tag, $handle, $src){
            if ( strpos($handle, 'module') === false) {
                return $tag;
            }
            $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
            return $tag;
        } , 10, 3);
      }

      public function plugins_loaded() {
          load_plugin_textdomain( 'easymaps', FALSE, basename( dirname( __FILE__ ) ) . '/languages/' );
      }

      public function init(){
        register_post_type('mapinco_easymaps', array( 'public'      => false  ));
      
          
          if (isset($_GET['action']) && isset($_GET['nonce']) &&
                  $_GET['action'] === 'easymaps_delete' &&
            wp_verify_nonce($_GET['nonce'], 'easymaps_admin_delete')
          ){
          
              $post_id = (isset($_GET['map_id'])) ? ($_GET['map_id']) : (null);
        
              $post = get_post((int)$post_id);
              if (empty($post)) {
                  return;
              }
        
              // delete the post
              wp_delete_post($post_id, true);
        
              // redirect to admin page
              $redirect = admin_url('admin.php?page=easymaps&msg=delete');
              wp_safe_redirect($redirect);
              die;    
          
          }	
          
      
        if(isset($_POST['easymaps_submit'])){
          $map_id = $_POST['map_id'];
          check_admin_referer( 'easymaps_' . $map_id, 'easymaps_nonce' );
      
          $error = false;
          // Titre de la carte
          $title = sanitize_text_field($_POST['map_title']);
          if(empty($title)){
            $error = true;
          }
          // Hauteur de la carte
          $height = sanitize_text_field($_POST['map_height']);
          if(empty($height)){
            $error = true;
          }
          $zoom = sanitize_text_field($_POST['map_zoom']);
          
          $zoom_control = $_POST['map_zoom_control'];    
          if($zoom_control == 'on') $zoom_control = 1;
          else $zoom_control = 0;
          
          $routing = $_POST['map_routing'];
          $fullscreen = $_POST['map_fullscreen'];
          $basemap = $_POST['map_basemap'];
          
          if(false == $error){
            $args = array(
              'post_type' =>  'mapinco_easymaps',
              'post_title'  =>  $title,
              'post_status' =>  'publish'
            );
            if($map_id == 'new'){
              $map_id = wp_insert_post($args);
              $message = 'new';
            }
            else{
              $args['ID'] = $map_id;
              $map_id = wp_update_post($args);
              $message = 'edit';
            }
            update_post_meta($map_id, 'height', $height);
            update_post_meta($map_id, 'zoom', $zoom);
            update_post_meta($map_id, 'zoom_control', $zoom_control);
            update_post_meta($map_id, 'routing', $routing);
            update_post_meta($map_id, 'fullscreen', $fullscreen);
            update_post_meta($map_id, 'basemap', $basemap);
            
            $markers = array();
            if(isset($_POST['marker_name'])){
                foreach($_POST['marker_name'] as $key => $name){
                    $markers[] = array(
                        'name'	=>	$name,
                        'address'	=>	$_POST['marker_address'][$key],
                        'coords'	=>	$_POST['marker_coords'][$key],
                        'popup'		=>	$_POST['marker_popup'][$key]
                    );
                }
            }
            update_post_meta($map_id, 'markers', $markers);
            
            wp_redirect(admin_url('admin.php?page=easymaps&map_id=' . $map_id . '&msg=' . $message)); exit;
      
          }
          else{
            add_action( 'admin_notices', 'easymaps_error' );
            function easymaps_error() {
                $class = 'notice notice-error';
                $message = __( 'Error!', 'easymaps' );
                printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) );
            }
          }
      
        }
      }

      public static function getBasemaps(){
        $basemaps = array(
          'Google'	=>	array(
            'google_hybrid'	=>	'Hybrid',
            'google_satellite'	=>	'Satellite',
            'google_streets'	=>	'Streets',
            'google_terrain'	=>	'Terrain'
          ),
          'OpenStreetMap'	=>	array(
            'osm_mapnik'	=>	'Mapnik',
            'osm_fr'	=>	'France',
            'osm_gray'	=>	'Grayscale',
            'osm_bzh'	=>	'Breizh',
            'osm_topo'	=>	'Topo Map'
          ),
          'Stamen'	=>	array(
            'stamen_toner'	=>	'Toner',
            'stamen_terrain'	=>	'Terrain',
            'stamen_watercolor'	=>	'Watercolor'
          ),
          'ESRI'	=>	array(
            'esri_streetmap'	=>	'Street Map',
            'esri_topomap'	=>	'Topo Map',
            'esri_delorme'	=>	'De Lorme',
            'esri_imagery'	=>	'Imagery',
            'esri_terrain'	=>	'Terrain',
            'esri_physical'	=>	'Physical',
            'esri_ocean'	=>	'Ocean',
            'esri_natgeo'	=>	'Natgeo',
            'esri_gray'	=>	'Grayscale'
          )
        );
        return apply_filters('easymaps_basemaps', $basemaps);
      }
    }
    new GAIA_EasyMaps();
}

