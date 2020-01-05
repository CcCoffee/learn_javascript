# this的使用
## 箭头函数中的this和普通函数中的this对比
1. 普通函数下的this为定义该函数的对象:
   * 在普通函数中的this总是代表定义该函数的对象，在默认情况下，this指的是window/global
   * 在严格模式下,没有直接调用者的函数中的this是 undefined使用
   * call,apply,bind(ES5新增)绑定的,this指的是 绑定的对象
2. 箭头函数中的this为宿主对象:
   * 箭头函数没有自己的this, 它的this是继承而来; 箭头表达式函数没有自己的this，它的this默认指向定义了该箭头表达式函数的函数它的this对象
## node环境与broswer环境的区别
1. 非严格模式下全局环境/全局函数中this的指向
   * node中this指向global
   * 浏览器中this指向window
2. 严格模式下全局环境/全局函数中this的指向
   * node中this为undefined
3. setTimeout中第一个function参数中this不同
   * node中this为Timeout对象
   * 浏览器中this为Window对象



参考：[箭头函数中的this和普通函数中的this对比](https://www.cnblogs.com/fanzhanxiang/p/8888963.html "cnblogs")