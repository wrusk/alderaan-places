#!/usr/bin/env node

/* Bring in dependencies */
const request = require('request');
const optimist = require('optimist');
const swPlanet = require("./planet");
const swPerson = require("./person");
const listPlanet = optimist.argv["planet"];

const planetsApiUrl = "https://swapi.co/api/planets/";
const peopleApiUrl = "https://swapi.co/api/people/";
let swPeople = [];
let swPlanets = [];
let swPlanetMapping = []; // A map of people to planets

const app = {
    // init(listPlanet) - to validate listPlanet and initiate api call
    init: function(listPlanet){
      that = this;//maintain this through asynch calls
      if(listPlanet){
        //A planet name has been provided return list of people for that planet
        that.initControl();
      }else{
        console.log("Useage: 'node app.js --planet {planet_name}' for a list of people from a specific planet");  
        return false;
      }
    },
    //async function to handle workflow
    initControl: function(){
        try{
            let firstCall = that.initPlanets();
            let secondCall = that.initPeople();
            Promise.all([firstCall,secondCall]).then(that.swFinalize());    
        } catch (err) {
            console.log(err);
        }    
    },
    //initPlanets() - initiate API rewuests
    initPlanets: function(){
        that = this;
        //first let's grab the data on the planets
        return new Promise(function(resolve, reject) {
            try{
                request.get(planetsApiUrl, function(err,response,body){
                    if(err) throw err;
                    const planetArray = JSON.parse(body);
                    for(var i=0; i < planetArray.results.length; i++) {
                        let planetName = planetArray.results[i].name;
                        let planetUrl = planetArray.results[i].url;
                        let planetResidents = planetArray.results[i].residents;
                        let planetInfo = new swPlanet(planetName,planetUrl,planetResidents);
                        swPlanets.push(planetInfo);
                    }
                });
            } catch(err){
                console.log(err);
                return false;
            }
            return resolve(swPlanets);
        });    
    },
    //initPeople() - initiate People API rewuests
    initPeople: function(){
        console.log("handling init people");
        that = this;
        return new Promise(function(resolve, reject) {        
            try{
                request.get(peopleApiUrl, function(err,response,body){
                    if(err) throw err;
                    const peopleArray = JSON.parse(body);
                    for(var i=0; i < peopleArray.results.length; i++) {
                        let peopleName = peopleArray.results[i].name;
                        let peopleUrl = peopleArray.results[i].url;
                        let peopleInfo = new swPerson(peopleName,peopleUrl);
                        swPeople.push(peopleInfo);
                    }          
                });
            } catch(err){
                console.log(err);
                return false;
            }
            return resolve(swPeople);
        });     
    },
    swFinalize: function(){
        
        //this is not ideal, but there are issues with the asynchronous calls
        setTimeout(function(){
            //do what you need here
       

        console.log("Planets");
        for(let i = 0; i < swPlanets.length; i++){
            console.log(swPlanets[i].output());
        }
        console.log("");
        console.log("People");
        for(let i = 0; i < swPeople.length; i++){
            console.log(swPeople[i].output());
        }   
        
        //create a mapping function
        for(let i = 0; i < swPlanets.length; i++){
            let planet = swPlanets[i];
            let swPlanetName = planet.name;
            let swResidents = [];
            for (let j=0; j < planet.residents.length; j++){
                let residentURL = planet.residents[j];
                let swResident = swPeople.find(x => x.url === residentURL);
                if (swResident){
                    console.log("found"+swResident.name );
                    swResidents.push(swResident.name);
                }                    
            }
            //add the array of residents to the associative array
            console.log(swPlanetName + " had " +swResidents.length +" results")
            swPlanetMapping[swPlanetName] = swResidents;
        } 
    
        let planetName = listPlanet;
        let residents = swPlanetMapping[planetName];
        console.log(planetName + " residents:");
        if(residents && residents.length > 0 ){
            for(let i=0; i < residents.length; i++){
                console.log(residents[i]);
            }                        
        } 
        
        }, 12000);
        return;
    }
  }

  //init the app module with postCount
  app.init(listPlanet);
  
  module.exports = app;