# Classify

不支持ES6 Class spec 的情况下，提供一个基础的面向Javascript 对象编程的方式。

不是一个完备的JS 工具库，单纯从项目中抽取出来的而已。

然后，这个库是摘抄自[aralejs-class](https://github.com/aralejs/class)。

## 使用

```typescript
import classify = require('./index');

const Animal = classify.create({
    initialize(name, category) {
        this.name = name;
      	this.category = category || 'animal';
    },
  	foo() {
        return `i'm an animal ${this.name}`;
    }
});

const Dog = Animal.extend({
    initialize(name) {
	      this._super(name, 'dog');
    },
  	foo() {
        return `i'm a dog ${this.name}`;
    }
});

Dog.implement({
    wow() {
        return `wow, i'm a big big dog ${this.name}`;
    }
})

const animalBar = new Animal('bar');
const dogBaz = new Dog('baz');

console.log(animalBar.foo());
console.log(dogBaz.foo());
console.log(dogBaz.wow());
```

