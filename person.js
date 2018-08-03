#!/usr/bin/env node
/* A person in the Star Wars univers */

function person(name,url){
    this.name = name;
    this.url = url;

    this.output = function(){
        return "Name: " + this.name + " SW URL: " + this.url;
    }
} 

module.exports = person;
