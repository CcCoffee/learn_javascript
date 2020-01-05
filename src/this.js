//node环境下的this

/**
 * 普通函数下的this
 */
function foo1() {
    console.log("======== foo1")
    // 在普通函数中的this总是定义该函数的对象
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
    //结果与foo1()不同，因为严格来讲，foo3方法并没有定义在global/window对象中，不符合原则1.普通函数下的this为定义该函数的对象
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
//根据原则1.普通函数下的this为定义该函数的对象
//foo4对象定义了timeout方法，定义该函数的对象，即this == foo4
//window(浏览器环境)/Timeout(node环境)对象定义了setTimeout，是定义该函数的对象，即this == window/Timeout
foo4.timeout()

/**
 * 箭头表达式函数没有自己的this，它的this默认指向定义了该箭头表达式函数的函数它的this对象
 * 本例中，bar1定义了该箭头表达式函数，而bar函数为全局函数，在非严格模式下它的this为window/global
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
        //true 'this == undefined'，因为严格来讲，bar2方法并没有定义在任何对象中
        //根据原则1.普通函数下的this为定义该函数的对象，this应该为undefined
        console.log(this == undefined, "this == undefined")
    }
    f1(); //;不能省略，否则编译器认为f1()与下面的表达式一起构成完整的表达式。
    //可简写为立即执行函数表达式（IIFE）
    (() => {
        console.log(this == undefined, "this == undefined") //true 'this == undefined'
    })()
}
bar2()

//对照foo4
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
    //根据原则3.在对象的定义中定义的箭头函数，箭头函数的this为该对象的宿主对象。
    //这里定义了箭头函数的对象为bar4，而bar4的宿主对象在浏览器中为window对象，在node中为空对象{}
    timeout: () => { //<<<<<<<<<<<<<<与foo3的不同点
        var outter_this = this
        setTimeout(() => {
            var inner_this = this
            console.log("======== bar4.timeout()")
            console.log(outter_this == global, "outter_this == global") //false 'outter_this == global'
            console.log(inner_this == global, "inner_this == global") //false 'inner_this == global'。
            console.log(inner_this == outter_this, "inner_this == outter_this") //true 'inner_this == outter_this'
            console.log("outter_this =", outter_this)
            console.log("inner_this =", inner_this)
        }, 100)
    }
}
bar4.timeout()