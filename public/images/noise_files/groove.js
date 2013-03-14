/*
 * © Groove Ads
 * http://grooveads.com
 */

GROOVE = {
  init : function(){
    var self = this;
    this.apply_styling();
    this.fetch_public_key();
    this.setup_voting();

    window.setInterval(function(){
      if(typeof _GRV === 'object'){
        for(var i=0; i<_GRV.length; i++){
          var params = _GRV[i];
          _GRV.shift();
          var action = params[0];
          params.shift();
          self[action].apply(self, params);
        }
      }
    }, 200);
  },
  
  publisher : {
    public_key : null
  },
 
  dispatch_ad : function(e, categories){
    if(!this.publisher.public_key){
      this.log('Please set a public key.');
    }else if(document.getElementById(e)){
      this.ijax('//grooveads.com/groove/dispatch_ad.js', {
        display_e : e,
        categories : this.any_to_array(categories).join(','),
        public_key : this.publisher.public_key
      });
    }else{
      this.log('Element (#'+e+') does not exist, Maybe in a parallel universe?');
    }
  },
  
  display : function(e, html){
    var e = this.$(e);
    e.innerHTML = html;
  },

  fetch_public_key : function(){
    for(var i=0; i<_GRV.length; i++){
      var params = _GRV[i];
      if(params[0] == "_set_public_key"){
        this._set_public_key(params[1]);
        _GRV.splice(i, 1);
      }
    }
  },

  _set_public_key : function(key){
    this.publisher.public_key = key;
  },

  apply_styling: function(){
    var styling = ".ad-wrapper .ad-content .ad-creative .ad-voting{position:absolute;opacity:0;-webkit-transition:all 0.2s ease;-moz-transition:all 0.2s ease;-o-transition:all 0.2s ease;transition:all 0.2s ease}.ad-wrapper .ad-content .ad-creative .ad-voting .ad-thumbs-up{width:22px;height:22px;background:url(//da7l8i6tjlon8.cloudfront.net/assets/like.png) center center no-repeat;background-color:#555;background-color:rgba(0,0,0,0.35);-moz-border-radius-bottomright:4px;-webkit-border-bottom-right-radius:4px;border-bottom-right-radius:4px;-moz-border-radius-topleft:4px;-webkit-border-top-left-radius:4px;border-top-left-radius:4px}.ad-wrapper .ad-content .ad-creative .ad-voting .ad-thumbs-up:hover{background-color:#333;background-color:rgba(0,0,0,0.5)}.ad-wrapper .ad-content .ad-creative .ad-voting .ad-thumbs-up.ad-chosen-vote{background-color:yellowgreen}.ad-wrapper .ad-content:hover .ad-voting{opacity:1}";

    var css = document.createElement('style');
    css.type = 'text/css';

    if(css.styleSheet){
      css.styleSheet.cssText = styling;
    }else{
      css.appendChild(document.createTextNode(styling));
    }

    document.getElementsByTagName("head")[0].appendChild(css);
  },

  setup_voting : function(){
    var self = this;

    this.live("ad-thumbs-up", "click", function(e, ev){
      ev.preventDefault();
      var ad_id = self.get_element_attribute(e, "data-ad-id");

      if(e.className.match(/\bad-chosen-vote\b/)){
        self.ijax('//grooveads.com/groove/ad/' + ad_id + '/unvote.js');
      }else{
        self.ijax('//grooveads.com/groove/ad/' + ad_id + '/vote/up.js');
      }
    });
  },

  load_pixels : function(p){
    p = this.any_to_array(p);
    for(var i=0; i<p.length; i++){
      var img = new Image();
      img.src = p[i];
    }
  },
  
  /* Helper functions */
 
  ijax : function(url, params){
    params    = this.any_to_hash(params);
    params._e = Math.random() * 10000000000000000; // Cache buster

    var url = url+'?'+this.hash_to_query(params);
    
    var fs = document.getElementsByTagName('script')[0];
    var script = document.createElement('script');
    script.type  = 'text/javascript';
    script.async = true;
    script.src   = url;
    fs.parentNode.insertBefore(script, fs)
  },
  
  hash_to_query : function(obj, prefix){
    var str = [];
    for(var p in obj) {
        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
        str.push(typeof v == "object" ? 
            this.hash_to_query(v, k) :
            encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
    return str.join("&");
  },

  any_to_array : function(e){
    if(e instanceof Array){
      return e;
    }else if(e !== undefined){
      return [e];
    }else{
      return [];
    }
  },

  any_to_hash : function(e){
    if(typeof e === "object"){
      return e;
    }else{
      return {};
    }
  },

  live : function(class_name, event_name, callback){
    var regex = new RegExp('(?:\\s|^)' + class_name + '(?:\\s|$)');

    if(document.addEventListener){
      document.addEventListener(event_name, function(ev) {
        var el = ev.target;
        if(!!el.className.match(regex)) {
          callback(el, ev);
        }
      }, false);
    }else{
      document.attachEvent('on' + event_name, function(ev) {
        var el = ev.target;
        if(!!el.className.match(regex)) {
          callback(el, ev);
        }
      });
    }
  },
  
  get_element_attribute: function(e, attr) {
    var result = (e.getAttribute && e.getAttribute(attr)) || null;
    if(!result){
      var attrs = e.attributes;
      var length = attrs.length;
      for(var i = 0; i < length; i++){
        if(attrs[i].nodeName === attr){
          result = attrs[i].nodeValue;
        }
      }
    }
    return result;
  },

  log : function(msg){
    window.console
      && typeof console.log === "function"
      && console.log('[GrooveAds] '+msg);
  },

  $ : function(s){
    return document.getElementById(s);
  }
};

(function(){
  if(document.loaded) {
    GROOVE.init();
  }else{
    if(window.addEventListener){  
      window.addEventListener('load', function(){GROOVE.init()}, false);
    }else{
      window.attachEvent('onload', function(){GROOVE.init()});
    }
  }
}());