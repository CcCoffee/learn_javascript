//node环境下的this

/**
 * 普通函数下的this
 */
function foo1() {
    console.log("======== foo1")
    // 在普通函数中的this总是代表它的直接调用者
    // 在默认情况下，this指的是window(浏览器环境)/global(node环境)
    console.log(this == global, "this == global") //true
}

// ❌与浏览器表现不一致
// node中输出   `false 'foo1 == global.foo1'`。global.foo1为undefined
// 浏览器中输出  `true "foo1 == window.foo1"`
console.log(foo1 == global.foo1, "foo1 == global.foo1")
foo1() // foo1作为全局函数，挂载在global对象下，foo1()等价与global.foo1()

function foo2() {
    var outter_this = this //根据foo1()的测试可知这里的this为global对象
    setTimeout(function () {
        console.log("======== foo2")
        var inner_this = this
        //❌与浏览器表现不一致
        //node中输出   false 'inner_this == global'。inner_this为Timeout对象
        //浏览器中输出  true "inner_this == window"
        console.log(inner_this == global, "inner_this == global") //false
        console.log(outter_this == global, "outter_this == global") //true
        // console.log(inner_this) //Timeout {...}
    }, 100)
}
foo2()

/**
 * 严格模式下全局函数的this表现与非严格模式下不一致
 * 严格模式下全局函数的this为undefined
 * 非严格模式下全局函数的this为global
 */
function foo3() {
    'use strict'
    console.log("======== foo3 - foo1的严格模式版本")
    //结果与foo1()不同，因为严格来讲，foo3方法并没有直接被global/window对象调用，不符合原则1.普通函数下的this总是代表它的直接调用者
    console.log(this == undefined, "this == undefined") //undefined
}
foo3()

var foo4 = {
    timeout: function () {
        var outter_this = this
        setTimeout(function () {
            var inner_this = this
            console.log("======== foo4.timeout()")
            console.log(outter_this == foo4, "outter_this == foo4") //true 'outter_this == foo4'
            //node中inner_this为Timeout
            //浏览器中inner_this为Window
            console.log(inner_this == foo4, "inner_this == foo4") //false 'inner_this == foo4'。 
        }, 100)
    }
}
//根据原则1.普通函数下的this总是代表它的直接调用者
//foo4.timeout()时foo4就是直接调用者，所以this == foo4
//window(浏览器环境)/Timeout(node环境)对象直接调用了setTimeout，是该函数的直接调用者，所以inner_this == window/Timeout
foo4.timeout()

/**
 * 根据原则2. 箭头函数中的this默认指向定义了该箭头函数的函数它的this对象
 * 本例中，bar1定义了该箭头函数，而bar1函数为全局函数，在非严格模式下它的this为window/global。
 * 所以this = window/global
 */
function bar1() {
    console.log("======== bar1")
    var f1 = () => {
        console.log(this == global, "this == global") //true 'this == global'
    }
    f1(); //;不能省略，否则编译器认为f1()与下面的表达式一起构成完整的表达式。
    //可简写为立即执行函数表达式（IIFE）
    (() => {
        console.log(this == global, "this == global") //true 'this == global'
    })()
}
bar1()

/**
 * bar1的严格模式版本
 */
function bar2() {
    'use strict'
    console.log("======== bar2 - bar1的严格模式版本")
    var f1 = () => {
        //true 'this == undefined'
        //根据原则2. 箭头函数中的this默认指向定义了该箭头函数的函数它的this对象
        //本例中，bar2定义了该箭头函数，而bar2函数为全局函数，
        //根据原则1.普通函数下的this总是代表它的直接调用者，在严格模式下bar2并没有直接调用者，所以this == undefined。
        console.log(this == undefined, "this == undefined")
    }
    f1(); //;不能省略，否则编译器认为f1()与下面的表达式一起构成完整的表达式。
    //可简写为立即执行函数表达式（IIFE）
    (() => {
        console.log(this == undefined, "this == undefined") //true 'this == undefined'
    })()
}
bar2()

/**
 * 对照foo4
 * 根据原则2. 箭头函数中的this默认指向定义了该箭头函数的函数它的this对象
 * 本例中，timeout函数定义了该箭头函数，所以inner_this == outter_this,
 * 又因为timeout函数的直接调用者为bar3对象，即outter_this == bar3。
 * 最终有inner_this == outter_this == bar3
 */
var bar3 = {
    timeout: function () {
        var outter_this = this
        setTimeout(() => {
            var inner_this = this
            console.log("======== bar3.timeout()")
            console.log(outter_this == bar3, "outter_this == bar3") //true 'outter_this == bar3'
            console.log(inner_this == bar3, "inner_this == bar3") //true 'inner_this == bar3'。
            console.log(inner_this == outter_this, "inner_this == outter_this") //false 'inner_this == outter_this'。
        }, 100)
    }
}
bar3.timeout()

/**
 * 箭头函数的嵌套
 */
var bar4 = {
    // 根据bar3案例的解析，可知inner_this == outter_this。
    // 根据原则2.箭头函数中的this默认指向定义了该箭头函数的函数它的this对象
    // 比较特别的是定义了外层箭头函数的不是一个函数，而是一个对象bar4。
    // 根据原则3.在对象的定义中定义的箭头函数，箭头函数的this为该对象的宿主对象
    // 这里bar4的宿主对象为window/global（nodejs环境下实际打印outter_this输出了{}，不明原因）
    timeout: () => { //<<<<<<<<<<<<<<与foo3的不同点
        var outter_this = this
        setTimeout(() => {
            var inner_this = this
            console.log("======== bar4.timeout()")
            console.log(outter_this == global, "outter_this == global") //false 'outter_this == global'
            console.log(inner_this == global, "inner_this == global") //false 'inner_this == global'。
            console.log(inner_this == outter_this, "inner_this == outter_this") //true 'inner_this == outter_this'
            console.log("outter_this =", outter_this) //{}
            console.log("inner_this =", inner_this) //{}
        }, 100)
    }
}
bar4.timeout()

//TODO 为什么在node环境下bar4中执行console.log(outter_this)输出的是 {}，而在这里outter_this == global？
// 在浏览器环境下bar4与bar4_wrapper表现一致，outter_this == inner_this == window
var bar4_wrapper = function () {
    var bar4 = {
        // 根据bar3案例的解析，可知inner_this == outter_this。
        // 根据原则2.箭头函数中的this默认指向定义了该箭头函数的函数它的this对象
        // 比较特别的是定义了外层箭头函数的不是一个函数，而是一个对象bar4。
        // 根据原则3.在对象的定义中定义的箭头函数，箭头函数的this为该对象的宿主对象
        // 这里bar4为该对象，当它定义它的宿主对象为window/global
        timeout: () => { //<<<<<<<<<<<<<<与foo3的不同点
            var outter_this = this
            setTimeout(() => {
                var inner_this = this
                console.log("bar4_wrapper======== bar4.timeout()")
                console.log(outter_this == global, "outter_this == global") //true 'outter_this == global'
                console.log(inner_this == global, "inner_this == global") //true 'inner_this == global'
                console.log(inner_this == outter_this, "inner_this == outter_this") //true 'inner_this == outter_this'
            }, 100)
        }
    }
    bar4.timeout()
}

bar4_wrapper()

/**
 * 根据原则1. 普通函数下的this总是代表它的直接调用者
 * bar5中f1函数内的outter_this和inner_this指代问题可以简化为
 *  var f1 = function () {
 *      var outter_this = this
 *      setTimeout(() => {
 *          var inner_this = this
 *          console.log("======== bar5.timeout()")
 *          console.log(inner_this == global, "inner_this == global") //true 'inner_this == global'
 *          console.log(outter_this == global, "outter_this == global") //true 'outter_this == global'
 *          console.log(inner_this == outter_this, "inner_this == outter_this") //true 'inner_this == outter_this'
 *      }, 100)
 *  }
 *  f1()
 *  this的取值根据是否处于严格模式分两种情况:
 *  1) 在非严格模式下，f1函数没有直接调用者，此时f1的this(outter_this)指代window/global。
 *     再根据原则2，箭头函数的this总是定义该箭头函数的函数的this。这里即f1的this对象，所以outter_this = inner_this = window/global
 *  2) 在严格模式下，f1函数没有直接调用者，this是undefined。
 *     再根据原则2，箭头函数的this总是定义该箭头函数的函数的this。这里即f1的this对象，所以outter_this = inner_this = undefined
 */
var bar5 = {
    timeout: function () {
        var f1 = function () {
            var outter_this = this
            setTimeout(() => {
                var inner_this = this
                console.log("======== bar5.timeout()")
                console.log(inner_this == global, "inner_this == global") //true 'inner_this == global'
                console.log(outter_this == global, "outter_this == global") //true 'outter_this == global'
                console.log(inner_this == outter_this, "inner_this == outter_this") //true 'inner_this == outter_this'
            }, 100)
        }
        f1()
    }
}
bar5.timeout()

/**
 * <h4>react中需要在构造函数中显示bind绑定的原因</h4>
 * react中使用以下方式定义事件响应方法handleInputChange
 * <input type="text" value={this.state.inputText} onChange={this.handleInputChange} id="todoItem" />
 * 
 * 当handleInputChange中要使用this时会发生异常：this为undifined
 * handleInputChange(e) {
 *     let inputText = e.target.value
 *     console.log("this = ", this)
 *     this.setState(state => ({
 *         inputText
 *     }))
 * }
 *  
 * this的辨别原则1. 普通函数（非箭头函数）中，this总是指向函数的直接调用者
 *      这里handleInputChange函数想必是通过todoApp.handleInputChange(e)的方式调用（其中todoApp为TodoApp的一个实例对象）。
 *      这样直接调用者当然就是todoApp对象，也就是说this指向了定义有handleInputChange函数的todoApp对象！
 *      但是执行时却报错了，难道this的辨别原则1出现了问题？！！！
 *      答案来自官方文档https://zh-hans.reactjs.org/docs/faq-functions.html#why-is-binding-necessary-at-all
 *      >
 *      在JavaScript中，以下两种写法是不等价的：
 *      1) 直接调用方式
 *      obj.method();
 *      2) 传递后调用方式
 *      var method = obj.method;
 *      method();
 *      bind 方法确保了第二种写法与第一种写法相同。
 *      使用 React，通常只需要绑定传递给其他组件的方法。例如，<button onClick={this.handleClick}> 
 *      是在传递 this.handleClick ，所以需要绑定它。但是，没有必要绑定 render 方法或生命周期方法：
 *      我们并没有将它们传递给其他的组件。
 *
 *      翻译成白话文：React在传递事件处理函数给组件（如input组件)时采用的是方式2. 传递后调用方式
 *      根据this的分辨原则1我们知道method()并没有调用者
 *          1) 在js的非严格模式下：
 *          node环境中this取为global对象，浏览器环境中this为window对象
 *          2) 在js的严格模式下：
 *          由于method()并没有调用者，this自然就为undefined了
 *
 *      注意：react环境中的input与dom中的input不同，它在typescript中定义的类型为
 *      React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, 
 *      HTMLInputElement>
 *      
 *      结论:
 *      1. this的分辨原则1依然是正确的
 *      2. react采取的传递后调用方式事实上函数中无法获取函数对象，这里为TodoApp的一个实例，
 *         而获取实例中的其他方法和属性又是极为常见的需求。React框架必须给出解决方案——这就是
 *         在class对象的构造方法中通过bind方法显示绑定this
 *         
 *      解决方案:
 *      this.handleInputChange = this.handleInputChange.bind(this)
 */
console.log("======== var method = obj.method")
var obj = {
    method: function () {
        console.log(this == obj, "this == obj")
        console.log(this == global, "this == global")
    }
}
var method = obj.method;
console.log("> obj.method()")
//console.log(this == obj, "this == obj") 结果: true 'this == obj'
//console.log(this == global, "this == global") 结果: false 'this == global'
obj.method()

console.log("> method()")
//console.log(this == obj, "this == obj") 结果: false 'this == obj'
//console.log(this == global, "this == global") 结果: true 'this == global'
method()