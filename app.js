var jangle=angular.module("jangle",["ngRoute","app.aboutView","app.chrome","app.directives","app.portfolioView","app.postView","app.services"]).config(["$routeProvider",function(a){a.otherwise({redirectTo:"/portfolio"})}]);angular.module("app.aboutView",["ngRoute"]).config(["$routeProvider",function(a){a.when("/about",{templateUrl:"about-view/about-view.html"})}]),angular.module("app.chrome",[]).controller("ChromeCtrl",function(){this.closeDelay=45,this.timeLastOpened=Date.now(),this.drawerEnabled=!1;this.toggleDrawer=function(){this.drawerEnabled=!this.drawerEnabled,this.drawerEnabled===!0&&(this.timeLastOpened=Date.now())},this.closeDrawer=function(){Date.now()-this.timeLastOpened>this.closeDelay&&this.drawerEnabled&&(this.drawerEnabled=!1)}}),angular.module("app.directives",[]),angular.module("app.services",[]),angular.module("app.directives").directive("jngActiveLink",["$location",function(a){return{restrict:"A",link:function(b,c,d){{var e=d.href,f=function(b){return b===a.path()?!0:!1};b.$on("$routeChangeSuccess",function(){f(e)?c.addClass(d.jngActiveLink):c.removeClass(d.jngActiveLink)})}if(!e)throw"No href exists on the element";e=e.replace(/^\.\/#/,""),f(e)&&c.addClass(d.jngActiveLink)}}}]),angular.module("app.directives").directive("clickedElsewhere",["$document","$parse",function(a,b){return{restrict:"A",link:function(c,d,e){var f=b(e.clickedElsewhere);a.on("click",function(a){d[0].contains(a.target)||(f(c),c.$apply())})}}}]),angular.module("app.directives").directive("jngFixToParent",["$window",function(a){return{restrict:"A",link:function(b,c){console.log("fixed with loaded");var d=c.parent(),e=angular.element(a);b._width=d[0].offsetWidth+"px",c.css("width",b._width),e.on("resize",function(){b.$apply(function(){b._width=d[0].offsetWidth+"px",c.css("width",b._width)})})}}}]),angular.module("app.directives").directive("jngOnScroll",["$window",function(a){return{restrict:"A",link:function(b,c,d){var e,f=function(){return a.pageYOffset},g=f(),h=f(),i=d.threshold?+d.threshold:0;a.onscroll=function(){h=f(),e=h-g,e>0?Math.abs(e)>i&&(c.addClass("scrolled-down"),c.removeClass("scrolled-up")):0>e&&Math.abs(e)>i&&(c.addClass("scrolled-up"),c.removeClass("scrolled-down")),g=h}}}}]),angular.module("app.services").factory("manifest",["$http","$q",function(a,b){var c=b.defer(),d={getManifest:function(b){return a.get(b).success(function(a){c.resolve(e(a))}).error(function(a){c.reject(a)}),c.promise}},e=function(a,b){var c,d=a.files,f=a.directories,g=[];for(c=0;c<d.length;c++)g.push(a.root+"/"+d[c]);if(b)for(c=0;c<f.length;c++)subdirFiles=e(f[c]),g=g.concat(subdirFiles);return g};return d}]),angular.module("app.portfolioView",["ngRoute"]).config(["$routeProvider",function(a){a.when("/portfolio",{templateUrl:"portfolio-view/portfolio-view.html"})}]).controller("PortfolioCtrl",["$http","manifest",function(a,b){var c=this;this.rows=[];var d=b.getManifest("./posts/manifest.json").then(function(a){return a},function(a){return a});d.then(function(b){var d=[];b.forEach(function(e,f){a.get(e).success(function(a){a.id=e.replace(/\.json$/,""),d.push(a),3===d.length?(c.rows.push(d),d=[]):f===b.length-1&&c.rows.push(d)})})},function(a){console.error(a)})}]),angular.module("app.blogView",["ngRoute"]).controller("BlogViewCtrl",["manifest",function(a){var b=this;a.getManifest("./posts/manifest.json").then(function(a){b.metaUrls=a},function(a){console.error("There was an error fetching the manifest:"+a)})}]),angular.module("app.postView",["ngRoute"]).config(["$routeProvider",function(a){a.when("/posts/:postId",{templateUrl:"post-view/post-view.html",controller:"PostViewCtrl",controllerAs:"currentPost"})}]).controller("PostViewCtrl",["$routeParams",function(a){this.meta="posts/"+a.postId+".json",console.log("postview controller initialized"),console.log(this.meta)}]),angular.module("app.postView").directive("post",function(){return{templateUrl:"post-view/post.directive.template.html",restrict:"AE",scope:{metaUrl:"@"},bindToController:!0,controller:["$http","$sce",function(a,b){var c=this;a.get(c.metaUrl).success(function(d){c.title=d.title,c.date=d.date,c.tags=d.tags,c.postUrl=d.postUrl,a.get(c.postUrl).success(function(a){c.postText=b.trustAsHtml(a)}).error(function(){console.error("Something went wrong with "+c.title+" html fetch")})}).error(function(){console.error("Some regular ol' bulllshit")})}],controllerAs:"Post"}});