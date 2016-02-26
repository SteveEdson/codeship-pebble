/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

ajax({
    url: 'https://codeship.com/api/v1/projects.json?api_key=833f1e01a8fc53c286007531620559ad59fd144f18a4795fc35b6e944c1d',
    type: 'json'
}, function(data, status, request) {
    
    var items = [];
    
    for(var i = 0; i < data.projects.length; i++) {
        var project = data.projects[i];
        
        items.push({
            title: project.repository_name            
        });    
    }
    
    var menu = new UI.Menu({
        sections: [{
            items: items
        }]
    });
    
    menu.on('select', function(e) {
        console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
        console.log('The item is titled "' + e.item.title + '"');
        
        var projectMeta = data.projects[e.itemIndex];
        
        var projectCard = new UI.Card({
            title: "Loading..."                
        });
        
            
        projectCard.show();
        
        ajax({
            url: 'https://codeship.com/api/v1/projects/'+projectMeta.id+'.json?api_key=833f1e01a8fc53c286007531620559ad59fd144f18a4795fc35b6e944c1d',
            type: 'json'
        }, function(data, status, request) {
            

            
            if(data.builds[0].status == "success") {
                var colour = '#008000';
            } else {
                var colour = '#ff0000';
            }
            
            projectCard.title(projectMeta.repository_name);
            projectCard.subtitle(data.builds[0].status);
            projectCard.body(data.builds[0].message);
            projectCard.bodyColor(colour);
            
            projectCard.show();
        }, function(error, status, request) {
            
        });
    });
    
    menu.show();
},
     function(error, status, request) {
         console.log('The ajax request failed: ' + error);
     });


// var main = new UI.Card({
//   title: 'Pebble.js',
//   icon: 'images/menu_icon.png',
//   subtitle: 'Hello World!',
//   body: 'Press any button.',
//   subtitleColor: 'indigo', // Named colors
//   bodyColor: '#9a0036' // Hex colors
// });

// main.show();

// main.on('click', 'up', function(e) {
//   var menu = new UI.Menu({
//     sections: [{
//       items: [{
//         title: 'Pebble.js',
//         icon: 'images/menu_icon.png',
//         subtitle: 'Can do Menus'
//       }, {
//         title: 'Second Item',
//         subtitle: 'Subtitle Text'
//       }]
//     }]
//   });
//   menu.on('select', function(e) {
//     console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
//     console.log('The item is titled "' + e.item.title + '"');
//   });
//   menu.show();
// });

// main.on('click', 'select', function(e) {
//   var wind = new UI.Window({
//     fullscreen: true,
//   });
//   var textfield = new UI.Text({
//     position: new Vector2(0, 65),
//     size: new Vector2(144, 30),
//     font: 'gothic-24-bold',
//     text: 'Text Anywhere!',
//     textAlign: 'center'
//   });
//   wind.add(textfield);
//   wind.show();
// });

// main.on('click', 'down', function(e) {
//   var card = new UI.Card();
//   card.title('A Card');
//   card.subtitle('Is a Window');
//   card.body('The simplest window type in Pebble.js.');
//   card.show();
// });