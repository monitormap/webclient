"use strict";angular.module("monitormapApp",["config","ui.router","btford.socket-io","leaflet-directive","tableSort"]).config(["$urlRouterProvider",function(a){a.otherwise("/")}]).factory("socket",["socketFactory","config",function(a,b){return a({prefix:"",ioSocket:io.connect(b.HOST,{path:"/ws"})})}]),angular.module("monitormapApp").config(["$stateProvider",function(a){a.state("passphrase",{url:"/passphrase",templateUrl:"app/passphrase.html",controller:"PassphraseCtrl"})}]),angular.module("monitormapApp").controller("DetailCtrl",["$scope","$stateParams","$rootScope","socket",function(a,b,c,d){a.obj={};var e=function(){d.emit("node:list",function(c){if(c.list)for(var d=0;d<c.list.length;d++)c.list[d].mac===b.mac&&(a.obj=c.list[d])})};e(),a.set=function(){d.emit("node:set",c.passphrase,a.obj,function(){e()})}}]),angular.module("monitormapApp").controller("DetailGroupCtrl",["$scope","$stateParams","$rootScope","socket",function(a,b,c,d){a.obj={},a.list=[],"global"===b.name&&(a.obj.name="global"),d.emit("node:group:list",function(c){if(c.list)for(var d=0;d<c.list.length;d++)c.list[d].name===b.name&&(a.obj=c.list[d])}),d.emit("node:list",function(b){a.list=b.list})}]),angular.module("monitormapApp").controller("GroupCtrl",["$scope","$rootScope","socket",function(a,b,c){a.list=[],a.glist=[];var d={"new":!1};a.obj=d,a.setObj=function(b){b=JSON.parse(JSON.stringify(b)),a.obj=b},c.emit("node:list",function(b){a.list=b.list});var e=function(){c.emit("node:group:list",function(b){a.glist=b.list})};e(),a.set=function(){c.emit("node:group:set",b.passphrase,a.obj,function(b){b.s&&a.setObj(d),e()})}}]),angular.module("monitormapApp").config(["$stateProvider",function(a){a.state("node",{url:"/node",templateUrl:"app/node/index.html"}).state("node.list",{url:"/list",templateUrl:"app/node/list.html",controller:"ListCtrl"}).state("node.detail",{url:"/detail/:mac",templateUrl:"app/node/detail.html",controller:"DetailCtrl"}).state("node.group",{url:"/group",templateUrl:"app/node/list_group.html",controller:"GroupCtrl"}).state("node.detailgroup",{url:"/group/:name",templateUrl:"app/node/detail_group.html",controller:"DetailGroupCtrl"}).state("node.new",{url:"/new",templateUrl:"app/node/list.html",controller:"NewCtrl"})}]),angular.module("monitormapApp").controller("ListCtrl",["$scope","$rootScope","socket","config",function(a,b,c,d){a.list=[];var e=function(){c.emit("node:list",function(b){a.list=b.list})};e(),a.status=function(a){return new Date(a).getTime()>new Date((new Date).getTime()-d.offlineTime).getTime()?!0:!1},a.count=function(b){var c=0;if(a.list)for(var d=0;d<a.list.length;d++)c+=a.list[d][b];return c},a.set=function(a){c.emit("node:set",b.passphrase,a,function(){e()})}}]),angular.module("monitormapApp").controller("NewCtrl",["$scope","$rootScope","socket","config",function(a,b,c,d){a.list=[];var e=function(){c.emit("node:list:new",function(b){b.s&&(a.list=b.list)})};e(),c.on("event::node:set:create",function(b){a.list.push(b)}),a.status=function(a){return new Date(a).getTime()>new Date((new Date).getTime()-d.offlineTime).getTime()?!0:!1},a.count=function(b){var c=0;if(a.list)for(var d=0;d<a.list.length;d++)c+=a.list[d][b];return c},a.set=function(a){c.emit("node:set",b.passphrase,a,function(){e()})}}]),angular.module("monitormapApp").controller("PassphraseCtrl",["$scope","$rootScope",function(a,b){a.newPassphrase="*",a.set=function(){b.passphrase=a.newPassphrase}}]),angular.module("monitormapApp").directive("dropdown",["$timeout",function(a){return{restrict:"C",link:function(b,c,d){d["class"].indexOf("ui")>=0&&a(function(){$(c).dropdown().dropdown("setting",{onChange:function(a){b.$parent[d.ngModel]=a,b.$parent.$apply()}})},0)}}}]),angular.module("monitormapApp").directive("rrd",["config",function(a){var b=1;return{restrict:"E",transclude:!0,scope:{path:"@"},link:function(c,d){function e(a){var b=null;try{b=new RRDFile(a)}catch(c){alert("File is not a valid RRD archive!")}null!==b&&(h=b,f())}function f(){var a=new rrdFlot(g,h,{legend:{noColumns:6},lines:{show:!0},yaxis:{autoscaleMargin:.2},tooltip:!0,tooltipOpts:{content:"<h4>%s</h4> Value: %y.3 - %x"}},{},{graph_only:!1,num_cb_rows:9,use_element_buttons:!0,multi_ds:!1,multi_rra:!0,use_rra:!1,rra:0,use_checked_DSs:!1,checked_DSs:[],use_windows:!1,graph_width:"700px",graph_height:"300px",scale_width:"350px",scale_height:"200px"});$("#graph_time_sel").val("+2"),a.callback_timezone_changed(),a.scale.clearSelection()}var g="rrd"+b++;d.attr("id",g);var h=null;try{FetchBinaryURLAsync(a.RRD+c.path,e)}catch(i){alert("Failed loading rrd\n"+i),console.log(a.RRD+c.path)}}}}]),angular.module("monitormapApp").run(["$templateCache",function(a){a.put("app/node/detail.html",'<h1 class=header><div class=content>{{obj.name}}<div class="ui sub header">{{obj.mac}}</div></div></h1><h4>RRD</h4><rrd ng-if=obj.mac path=/node/{{obj.mac}}.rrd></rrd>'),a.put("app/node/detail_group.html",'<h1>{{obj.name}}</h1><h4>RRD</h4><rrd ng-if=obj.name path=/node/{{obj.name}}.rrd></rrd><h4>Devices:</h4><table class="ui table"><thead><tr><th>Name</th><th>Mac</th></tr></thead><tbody><tr ng-repeat="i in obj.nodes"><td ng-repeat="li in list" ng-if="li.mac==i">{{li.name}}</td><td>{{i}}</td></tr></tbody></table>'),a.put("app/node/index.html",'<div ui-view=""></div>'),a.put("app/node/list.html",'<div class=scrolltable><table ts-wrapper=ts-wrapper class="ui small orange compact table striped"><thead><tr><th ts-criteria=name|lowercase ts-default=ts-default rowspan=2>Name</th><th ts-criteria=updatedAt|lowercase ts-default=ts-default rowspan=2>Status</th><th colspan=3>2.4 Ghz</th><th colspan=3>5 Ghz</th><th colspan=2>Eth</th><th></th></tr><tr><th ts-criteria=channel_24|lowercase ts-default=ts-default>Channel</th><th ts-criteria=channel_24_power|lowercase ts-default=ts-default>Power</th><th ts-criteria=client_24|lowercase ts-default=ts-default>Client</th><th ts-criteria=channel_50|lowercase ts-default=ts-default>Channel</th><th ts-criteria=channel_50_power|lowercase ts-default=ts-default>Power</th><th ts-criteria=client_50|lowercase ts-default=ts-default>Client</th><th ts-criteria=ports_gb|lowercase ts-default=ts-default>Gbit%</th><th ts-criteria=ports|lowercase ts-default=ts-default>All</th><th></th></tr></thead><tbody><tr ng-repeat="item in list" ts-repeat=ts-repeat><td><a ui-sref=node.detail({mac:item.mac}) class="ui header">{{item.name}}</a><div class="sub header">{{item.mac}}</div></td><td><i ng-if=status(item.timedate) class="icon green check"></i><i ng-if=!status(item.timedate) class="icon red delete"></i></td><td ng-if=!passphrase class="right aligned warning">{{item.channel_24}}</td><td ng-if=passphrase class=warning><div class="ui input fluid"><input type=number ng-model="item.channel_24"></div></td><td ng-if=!passphrase class="right aligned">{{item.channel_24_power}}</td><td ng-if=passphrase><div class="ui input fluid"><input type=number ng-model="item.channel_24_power"></div></td><td class="right aligned positive">{{item.client_24}}</td><td ng-if=!passphrase class="right aligned warning">{{item.channel_50}}</td><td ng-if=passphrase class="right aligned warning"><div class="ui input fluid"><input type=number ng-model="item.channel_50"></div></td><td ng-if=!passphrase class="right aligned">{{item.channel_50_power}}</td><td ng-if=passphrase class="right aligned"><div class="ui input fluid"><input type=number ng-model="item.channel_50_power"></div></td><td class="right aligned positive">{{item.client_50}}</td><td class="right aligned">{{item.ports>0?(item.ports_gb*100)/item.ports:0}}</td><td class="right aligned">{{item.ports}}</td><td><button ng-if=passphrase ng-click=set(item) class="ui button icon"><i class="icon save"></i></button></td></tr></tbody><tfoot><tr><th colspan=2>{{list.length}}</th><th colspan=3 class="right aligned">{{count(\'client_24\')}}</th><th colspan=3 class="right aligned">{{count(\'client_50\')}}</th><th colspan=2 class="right aligned">{{count(\'ports_gb\')}}/{{count(\'ports\')}}</th><th></th></tr></tfoot></table></div>'),a.put("app/node/list_group.html",'<table class="ui table striped"><thead><tr><th>Name</th><th>Devices</th><th><button ng-click=setObj({new:true}) ng-if=passphrase class="ui button icon"><i class="icon add"></i></button></th></tr></thead><tbody><tr ng-if=obj.new><td colspan=3><form form=form ng-submit=set() class="ui form"><div class=field><label>Name</label><input ng-model="obj.name"></div><div class=field><label>Devices</label><select ng-model=obj.macs ng-options="i.nodes as i.name for i in list" multiple class="ui search dropdown"></select></div><button ng-class={&quot;loading&quot;:loading} class="ui button labeled icon"><i class="icon save"></i>Save</button></form></td></tr><tr ng-repeat="item in glist"><td ng-if="obj.id==item.id" colspan=3><form form=form ng-submit=set() class="ui form"><div class=field><label>Name</label><input ng-model="obj.name"></div><div class=field><label>Devices</label><select ng-model=obj.nodes ng-options="i.mac as i.name for i in list" multiple class="ui search dropdown"></select></div><button ng-class={&quot;loading&quot;:loading} class="ui button labeled icon"><i class="icon save"></i>Save</button></form></td><td ng-if="obj.id!=item.id"><a ui-sref=node.detailgroup({name:item.name})>{{item.name}}</a></td><td ng-if="obj.id!=item.id"><div ng-repeat="i in item.nodes" class="ui label"><span ng-repeat="li in list" ng-if="li.mac==i">{{li.name}}</span></div></td><td ng-if="obj.id!=item.id"><button ng-click=setObj(item) ng-if=passphrase class="ui button icon"><i class="icon edit"></i></button></td></tr></tbody><tfoot><tr><th colspan=3>count: {{glist.length}}</th></tr></tfoot></table>'),a.put("app/passphrase.html",'<form form=form ng-submit=set() class="ui form"><div class=field><label>Passphrase</label><input ng-model="newPassphrase"></div><button ng-class={&quot;loading&quot;:loading} class="ui button labeled icon"><i class="icon save"></i>Unlock</button></form>')}]);