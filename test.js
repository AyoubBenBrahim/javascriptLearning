let msg = "hello";

let person = {
  name: "Ayoub",
  school: 1337,
};

console.log(person);

let arr = ["red", "balck", "blue"];

console.log(arr);
console.log(arr[1]);

function hello(msg1, msg2) {
  return msg1 + " " + msg2;
}

let str = hello("sbah", "lkhir");

console.log(str);

console.log(hello("bonjour"));
var s = 'this is a quote "the answer is 42" ';
console.log(s);

s = 'this is a quote "the answer is 42" ';
console.log(s);

/*
******************************************************************
*/

console.log();
arr = ["red", "blue", 122, 3.14, true, [1, 2, 3], function () {console.log("hello from Array");}];
console.log(arr);

arr[6](); // call the function 

/*
******************************************************************
*/

console.log();

arr = ["black", "beard"];
console.log(arr);

arr.push("red", "blue");
console.log(arr);
removed = arr.pop();
console.log("poped = " + removed);
console.log(arr);

/*
******************************************************************
*/
console.log();

var student = {
  name: "Ayoub",
  age: 21,
  birthdate: "01/01/1999",
  school: "1337",
  projects: [
    "shell",
    "c",
    "c++",
    "network",
    "algorithm",
    "javascript",
    "react",
  ],
  grades: {
    shell: 100,
    c: 100,
    cpp: 100,
    network: 100,
  },
  favoriteQuote: "work hard play hard",
  isMarried: false,
};

student["grades"]["shell"] = 125;
student["new_propriety"] = "2024";
console.log(student);

/*
******************************************************************
*/

function getCapitales(country) {
  let capitales = {
    france: "paris",
    maroc: "rabat",
    algerie: "alger",
    tunisie: "tunis",
    espagne: "madrid",
    portugal: "lisbonne",
    italie: "rome",
    angleterre: "londre",
    belgique: "bruxelle",
    allemagne: "berlin",
  };
  return capitales[country];
}

console.log(
  (() => {
    var cap = getCapitales("maroco");
    return cap === undefined ? "capital not found" : cap;
  })()
);

/*
******************************************************************
*/
console.log();

function sumArray(arr) {
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      sum += arr[i][j];
    }
  }
  return sum;
}
var sum = sumArray([[1, 2], 3, 4, [5, 6, 7], 8]);
console.log("sum = " + sum);

/*
******************************************************************
*/
console.log();

function nestedTernary(num) {
	return num > 0
	  ? "positive"
	  : num === 0
	  ? "zero"
	  : typeof num === "number"
	  ? "number"
	  : "negative";
  }

console.log("0 is " + nestedTernary(0));
console.log("1 is " + nestedTernary(1));
console.log("-1 is " + nestedTernary(-1));
console.log("a is " + nestedTernary("a"));

/*
******************************************************************
*/
console.log();

// Traditional function expression
const square = function(num) {
  return num * num;
};

// Arrow function with a single parameter
const _square = num => num * num;

console.log(square(2));

/*
******************************************************************
*/
console.log();

var date = function (date) {
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

console.log(date(new Date()));

var _date = (date) => date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

console.log(_date(new Date()));

/*
******************************************************************
*/
console.log();

// Traditional function expression
const multiply = function(a, b) {
  return a * b;
};

// Arrow function with implicit return
const _multiply = (a, b) => a * b;

console.log(multiply(2, 3));

/*
******************************************************************
*/
console.log();

var capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

console.log(capitalize("ayoub"));

/*
******************************************************************
*/
console.log();

var concat = (str1, str2) => str1 + str2;

console.log(concat("hello ", "test"));

/*
******************************************************************
*/
console.log();

const testIntegers = [1, 5.6, -9.8, 3.14, 42, 88.9, -100, -5.5];

const fillteredList = (arr) => {
  const result = arr.filter((num) => Number.isInteger(num) && num > 0);
  return result;
};

console.log("filltred list = " + fillteredList(testIntegers));

/*
******************************************************************
*/
console.log();

const increment = (function () {
  return function increment (nbr, val = 1) {
    return nbr + val;
  };
})();

console.log(increment(5, 2));
console.log(increment(5));

/*
******************************************************************
*/
console.log();

const sumArgs = (function () {
  return function sum(...args) {
    return args.reduce((a, b) => a + b, 0);
  };
}
)();
console.log("sum is = " + sumArgs(1, 2, 3, 4, 1));

/*
******************************************************************
*/
console.log();

const arr1 = ["JAN", "FEB", "MAR", "APR", "MAY"];
let arr2;

arr2 = [...arr1]; // Change this line

// console.log(arr2);

/*
******************************************************************
*/

// destructuring assignment from object

console.log();

var coords = { x: 1, y: 2, z: 3 };
var { x, y, z } = coords;

console.log(
  "x = " + x + " y = " + y + " z = " + z
  );
  
/*
******************************************************************
*/
console.log();

const HIGH_TEMPERATURES = {
  yesterday: 75,
  today: 77,
  tomorrow: 80,
};

function getTempOfTmrw(temp) {
  const { tomorrow: tempOfTomorrow } = temp;
  return tempOfTomorrow;
}

console.log("temp of tomorrow is = " + getTempOfTmrw(HIGH_TEMPERATURES));

/*
******************************************************************
*/
console.log();

var students = ['Ayoub', 'Youssef', 'Yassine', 'Younes', 'Youness', 'Yassir'];

function getStudentsNames(students) {
  const [first, second, third] = students;
  return [first, second, third];
}

console.log(getStudentsNames(students));

removeFirstTwo = (list) => {
  // remove first two elements using destructuring and rest operator, return the rest of the array
  const [, , ...arr] = list; 
  // same as [first, second, ...arr] = list;
  return arr;
};

console.log(removeFirstTwo(students));

/*
******************************************************************
*/
console.log();
const killer = {
  name: "Jack the Ripper",
  age: 56,
  victims: 30,
};

const card = `Hello, my name is ${killer.name}!
I am ${killer.age} years old.
i killed ${killer.victims} victims`;

console.log(card);

/*
******************************************************************
*/
console.log();

function Alien(name, age, planet) {
  this.name = name;
  this.age = age;
  this.planet = planet;

  this.sayHello = function () {
    msg = `Hello, my name is ${this.name}
           I am ${this.age} years old.
           I am from ${this.planet}`;
    console.log(msg);
  };
}

let alien1 = new Alien("Ayoub", 210, "Earth");
alien1.sayHello();

console.log();

let alien2 = new Alien("zx589", 1245, "Centauri");
alien2.sayHello();


/*
******************************************************************
*/
console.log();

class Book {
  constructor(author) {
    this._author = author;
  }
  // getter
  get writer() {
    return this._author;
  }
  // setter
  set writer(updatedAuthor) {
    this._author = updatedAuthor;
  }
}

const novel = new Book("Mobydick");
console.log(novel.writer);
novel.writer = "Uknown";
console.log(novel.writer);
novel._author = "Herman Melville";
console.log(novel.writer);


/*
******************************************************************
*/
console.log();

var text = "one two three";
let pattern = /two/;
let result = text.match(pattern);
console.log(result);

/*
******************************************************************
*/

text = "the lazy fox is dead";
let substring = text.substring(9, 20);
console.log(substring);
substring = text.slice(9, text.length);
console.log(substring);
substring = text.slice(9);
console.log(substring);

/*
******************************************************************
*/
console.log();

const numbers = [1, 2, 3, 4, 5];
console.log(numbers);
const slicedNumbers = numbers.slice(2, 4);

console.log(slicedNumbers);  // [3, 4]

/*
******************************************************************
*/
console.log();

const fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
const myBest = fruits.slice(-3, -1);

console.log(myBest);

/*
******************************************************************
*/

console.log();

let xx = 10;
let zz = '11';
console.log(xx + zz);

console.log(xx + '5');

console.log(xx + +zz);

/*
******************************************************************
*/

let ff = {
  name: 'ayoub',
  nested_obj1: {
    name: 'youssef',
    nested_obj2: {
      name: 'yassine',
    }
  }
}

console.log(ff.nested_obj1.name);
console.log(ff.nested_obj1.nested_obj2.name);

console.log();


