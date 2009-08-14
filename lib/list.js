function List(arr) {
 this.$_$ = arr || new Array();
 this.length = this.$_$.length;
 this.add = List.$add;
 this.remove = List.$remove;
 this.toString = List.$toString;

}

List.$add = function(m,i) {
 if (('number' != typeof i)||(i >= this.$_$.length)) {
  this.$_$.push(m);
 }
 else if ((i<0)||(parseInt(i,10)!=i)){
  throw new Error('Invalid index');
  // as a "problem hiding" option can be implied:
  // i = Math.abs(parseInt(i,10));
 }
 else {
  this.$_$.splice(i,0,m);
 }
 this.length = this.$_$.length;

}

List.$remove = function(i) {
 if (('number' != typeof i)||(i >= this.$_$.length)) {
  return null;
 }
 else if (parseInt(i,10) != i){
  throw new Error('Invalid index');
  // as a "problem hiding" option can be implied:
  // i = (parseInt(i,10);
 }
 else {
  if (i<0) {i-= this.$_$.length;}
  var ret = this.$_$.splice(i,1)[0];
  this.length = this.$_$.length;
  return ret;
 }

}

List.$toString = function() {
 return this.$_$.toString();

}
