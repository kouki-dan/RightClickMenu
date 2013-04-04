var MENU_ITEM_CLASS_NAME = "RightClickMenuItemASJF";
var MENU_ITEM_ID_HEAD = "RightClickMenuItemFOEIAFF";
var MOUSEOVER_BACKGROUND_COLOR = "#56f"
var MOUSEOVER_COLOR = "#fff";
var NORMAL_BACKGROUND_COLOR = "#fff";
var NORMAL_COLOR = "#000";
var DISABLE_COLOR = "#999";
var DISABLE_ITEM_CLASS_NAME = "DisableItemClassNamefaio"
var BORDER_RADIUS_VALUE = "4px";

var RightClickMenu = function(target){
  this.initListeners(target);

  this.root = new MenuItemMaster();

};
RightClickMenu.prototype.add = function(text,func){
  //引数が1個の時はMenuItemかMenuItemGroupが入ってるとする。
  if(MenuItemGroup.prototype.isPrototypeOf(text) ||
      MenuItem.prototype.isPrototypeOf(text) ){
    this.root.add(text);
    return text;
  }
  else{
    var item = new MenuItem(text,func);
    this.root.add(item);
    return item;
  }
};
RightClickMenu.prototype.remove = function(removeItem){
  this.root.remove(removeItem);
};
RightClickMenu.prototype.addDefault = function(){
  this.root.addDefault();
};
RightClickMenu.prototype.rightClick = function(point){
  this.root.render(point);
};
RightClickMenu.prototype.click = function(e){
  if(e.target.className.split(" ").indexOf(MENU_ITEM_CLASS_NAME) >= 0){
    //クリックした時の動作
    //enableだったら何もしない(探索するのが面倒だからスタイルを使用
    if(e.target.className.split(" ").indexOf(DISABLE_ITEM_CLASS_NAME) >= 0){
      return ;
    }

    var that = this;
    e.target.style.backgroundColor = NORMAL_BACKGROUND_COLOR;
    e.target.style.color = NORMAL_COLOR;
    setTimeout(function(){
      e.target.style.backgroundColor = MOUSEOVER_BACKGROUND_COLOR;
      e.target.style.color = MOUSEOVER_COLOR;
      setTimeout(function(){
        e.target.style.backgroundColor = NORMAL_BACKGROUND_COLOR;
        e.target.style.color = NORMAL_COLOR;
        that.root.close();
      },80);
    },100);
  }
  else{
    //閉じる
    this.root.close();
  }
}
RightClickMenu.prototype.initListeners = function(target){
  var that = this;
  target.addEventListener("contextmenu",function(e){
    e.preventDefault();
  },true);
  target.addEventListener("mousedown",function(e){
    if(e.button == 2){
      if(!that.root.visible){
        that.rightClick(new Point(e.pageX,e.pageY));
      }
    }
  },true);
  window.addEventListener("mousedown",function(e){
    e.preventDefault();
    if(e.button == 0){
      that.click(e);
    }
  },true);    
};

var MenuItemMaster = function(){
  this.items = [];
  this.sectionLines = [];
  this.visible = false;

  this.box = document.createElement("ul");
  this.box.style.listStyle = "none";
  this.box.style.margin = "0";
  this.box.style.padding = BORDER_RADIUS_VALUE + " 0";
  this.box.style.position = "absolute";
  this.box.style.cursor = "default";
  this.box.style.backgroundColor = NORMAL_BACKGROUND_COLOR;
  this.box.style.borderRadius = BORDER_RADIUS_VALUE;
  this.box.style.webkitBorderRadius = BORDER_RADIUS_VALUE;
  this.box.style.mozBorderRadius = BORDER_RADIUS_VALUE;
  this.box.style.border = "1px solid #ccc";
  this.box.style.boxShadow = "0px 5px 13px rgba(0,0,0,0.2)";

};
MenuItemMaster.prototype.addDefault = function(){
  //戻る、進む、リロードを実装する。
  var itemGroup = new MenuItemGroup();
  
  var items = [];
  
  items.push(new MenuItem("戻る",function(){
    history.back();
  }));
  items.push(new MenuItem("進む",function(){
    history.forward();
  }));
  items.push(new MenuItem("再読み込み",function(){
    location.reload();
  }));

  for(var i = 0; i < items.length; i++){
    itemGroup.add(items[i]);
  }
  
  this.add(itemGroup);

};
MenuItemMaster.prototype.add = function(item){
  this.items.push(item);
};
MenuItemMaster.prototype.remove = function(removeItem){
  for(var i = 0; i < this.items.length; i++){
    if(this.items[i] == removeItem){
      this.items.splice(i,1);
      this.box.removeChild(removeItem.elm);
      i--;
    }
  }
};
MenuItemMaster.prototype.close = function(){
  if(this.visible){
    var opacity = 1.0;
    var diff = 0.1;
    var that = this;
    var timerId = setInterval(function(){
      opacity -= diff;
      
      that.box.style.opacity = opacity;
      if(opacity <= 0){
        document.body.removeChild(that.box);
        that.box.style.opacity = 1.0;
        that.visible = false;
        clearInterval(timerId);
       
        var line;
        while((line = that.sectionLines.pop() ) != null){
          that.box.removeChild(line.elm);
        }
        that.iterate( function(item){
          that.box.removeChild(item.elm);
        });
        
      }
    },1000/60);
  }
};
MenuItemMaster.prototype.render = function(point,parent){
  this.box.style.top = point.y + "px";
  this.box.style.left = point.x + "px";
  
  if(parent == null){
    document.body.appendChild(this.box);
  }
  else{
    parent.appendChild(this.box);
  }
  var that = this;
  this.iterate( function(item){
    item.render(that.box);
  },function(){
    //区切り線を入れる
    var line = new SectionLine();
    that.sectionLines.push(line);
    line.render(that.box);
  });
  this.visible = true;
};
MenuItemMaster.prototype.iterate = function( itemFunc, groupFunc ){
  groupFunc = groupFunc || function(){};
  var first = false;
  for(var i = 0; i < this.items.length; i++){
    var item = this.items[i];
    if(MenuItemGroup.prototype.isPrototypeOf(item)){
      if(first){
        groupFunc()
      }
      var items = item.getItems();
      for(var j = 0; j < items.length; j++){
        itemFunc(items[j]);
      }
      if(i != this.items.length - 1){
        groupFunc();
        first = false;
      }
    }
    else{
      itemFunc(item);
      first = true;
    }
  }  
};

var MenuItemGroup = function(){
  this.items = [];

};
MenuItemGroup.prototype.add = function(item){
  this.items.push(item);
  return item;
};
MenuItemGroup.prototype.getItems = function(){
  return this.items;
};


var MenuItem = function(text,func){
  this.text = text;
  this.func = func;
  this.isEnable = true;
  this.elm = document.createElement("li");
  this.elm.classList.add(MENU_ITEM_CLASS_NAME);
  this.elm.style.backgroundColor = NORMAL_BACKGROUND_COLOR;
  this.elm.style.padding = "0 20px";
  this.elm.style.fontSize = "15px";
  this.elm.style.lineHeight = "17px";
  this.elm.style.height = "17px";

  //いつかやる気があったら実装
  this.child = null;

  var that = this;
  this.elm.onclick = function(){
    if(that.isEnable){
      that.func();
    }
  };
  this.elm.onmouseover = function(){
    if(that.isEnable){
      that.elm.style.backgroundColor = MOUSEOVER_BACKGROUND_COLOR;
      that.elm.style.color = MOUSEOVER_COLOR;
    }
  };
  this.elm.onmouseout = function(){
    if(that.isEnable){
      that.elm.style.backgroundColor = NORMAL_BACKGROUND_COLOR;
      that.elm.style.color = NORMAL_COLOR;
    }
  };
 
};
MenuItem.prototype.render = function(parent){
  this.elm.innerHTML = this.text;
  if(this.isEnable){
    this.elm.style.color = NORMAL_COLOR;
  }
  else{
    this.elm.style.color = DISABLE_COLOR;
  }

  parent.appendChild(this.elm);
};
MenuItem.prototype.enable = function(){
  this.isEnable = true;
  this.elm.classList.remove(DISABLE_ITEM_CLASS_NAME);
  this.elm.style.color = NORMAL_COLOR;
};
MenuItem.prototype.disable = function(){
  this.isEnable = false;
  this.elm.classList.add(DISABLE_ITEM_CLASS_NAME);
  this.elm.style.backgroundColor = NORMAL_BACKGROUND_COLOR;
  this.elm.style.color = DISABLE_COLOR;
  
};


var SectionLine = function(){
  MenuItem.apply(this, arguments);

  this.elm.style.padding = "0";
  this.elm.style.height = "10px";
  this.elm.style.lineHeight = "normal";
  this.text = "";

  this.canvas = document.createElement("canvas");
  this.canvas.width = 1;
  this.canvas.height = 10;
  var ctx = this.canvas.getContext("2d");
  ctx.fillStyle = "#aaa";
  ctx.fillRect(0,4,1,1);
  
  this.elm.style.backgroundImage = "url(" + this.canvas.toDataURL() + ")";

  this.elm.onclick =  this.elm.onmouseover = this.elm.onmouseout = 
    function(){};
  this.disable();
  
};
//SectionLine.prototype = new MenuItem();
SectionLine.prototype = Object.create(MenuItem.prototype);
SectionLine.prototype.constructor = SectionLine;

