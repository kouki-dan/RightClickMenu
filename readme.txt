
JavaScriptで右クリックメニューを提供します。


<script src="./RightClickMenu.js" type="text/javascript"></script>

で読み込んだ後、

<script>
  var rightClickMenu = new RightClickMenu(document.body);
   
  rightClickMenu.addDefault();
  rightClickMenu.add("print A",function(){
    console.log("A");
  });
  var b = rightClickMenu.add("print B",function(){
    console.log("B");
  });
  b.disable();
  
  rightClickMenu.add("enable B",function(){
    console.log("b");
    b.enable();
    that.rightClickMenu.remove(a);
  });
</script>

こんな感じで使います（面倒になった

MenuItemGroupクラスを使ってグループ化する事ができます。

var rightClickMenu = new RightClickMenu(element);
var group = new MenuItemGroup();
var item1 = new MenuItem("doSomething",func1);
var item2 = new MenuItem("doSomething2",func2);
group.add(item1);
group.add(item2);
rightClickMenu.addDefault();
rightClickMenu.add(group);

こんな感じでつかう。




