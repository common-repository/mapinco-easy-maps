<?php
class Gaia_FrontMapsController{
    public function __construct(){
        add_action( 'wp_enqueue_scripts', array($this, 'wp_enqueue_scripts') );
        add_shortcode('easymaps', array($this, 'easymaps_shortcode'));
    }

    public function wp_enqueue_scripts(){
        wp_enqueue_style('leaflet',GAIA_EASYMAPS_URL . 'inc/leaflet/leaflet.css');
        wp_enqueue_script('leaflet',GAIA_EASYMAPS_URL . 'inc/leaflet/leaflet.js');		
        
        // leaflet fullscreen
        wp_enqueue_style('easymaps_fullscreen', GAIA_EASYMAPS_URL . 'inc/leaflet/plugins/leaflet-fullscreen/Control.FullScreen.css');
        wp_enqueue_script('easymaps_fullscreen', GAIA_EASYMAPS_URL . 'inc/leaflet/plugins/leaflet-fullscreen/Control.FullScreen.js', array('jquery', 'leaflet'));	
        
        wp_enqueue_script('easymaps', GAIA_EASYMAPS_URL . 'views/js/front/easymaps.js', array('jquery', 'leaflet','easymaps_fullscreen'));
    }

    public function easymaps_shortcode($atts){
        $ret = '';
        if(isset($atts['id'])){
            $map = get_post($atts['id']);
            if($map->post_type == 'mapinco_easymaps'){
                $height = get_post_meta($map->ID, 'height', true);
                $zoom = get_post_meta($map->ID, 'zoom', true);
                $zoom_control = get_post_meta($map->ID, 'zoom_control', true);
                $routing = get_post_meta($map->ID, 'routing', true);
                $fullscreen = get_post_meta($map->ID, 'fullscreen', true);
                $basemap = get_post_meta($map->ID, 'basemap', true);
                $markers = get_post_meta($map->ID, 'markers', true);
                $ret .= '<div class="easymaps" style="margin:10px 0;height:'.$height.'px" 
                    attr-zoom="'.$zoom.'" 
                    attr-zoom-control="'.(bool)$zoom_control.'"
                    attr-routing="'.(bool)$routing.'"
                    attr-fullscreen="'.(bool)$fullscreen.'"
                    attr-basemap="'.implode(',',$basemap).'"
                    >';
                if(count($markers)>0){
                    foreach($markers as $key=>$marker){
               $ret .= '<div class="marker" 
                            attr-id="marker-'.$key.'"
                            attr-name="'.$marker['name'].'" 
                            attr-address="'.$marker['address'].'" 
                            attr-coords="'.$marker['coords'].'"
                        >';
                $ret .= '<div class="marker_popup">' . $marker['popup'] . '</div>';
                $ret .= '</div>';
                    }
                }
                $ret .= '</div>';
            }
        }
        return $ret;
    }

}
new Gaia_FrontMapsController();