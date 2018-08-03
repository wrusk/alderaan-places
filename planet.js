#!/usr/bin/env node

/* a planet in the Star Wars Universe */

function planet(name,url,residents){
    this.name = name;
    this.url = url;
    this.residents = residents;
    this.output = function(){
        let outputString = "Name: " + this.name + " SW URL: " + this.url + "\n";
        outputString += "Resident URLs: \n";
        for(let i = 0; i < residents.length; i++){
            outputString += residents[i] + "\n";
        }
        return outputString;
    }
} 

module.exports = planet;