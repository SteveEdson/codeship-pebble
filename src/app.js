/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Settings = require('settings');

ajax({
    url: 'https://codeship.com/api/v1/projects.json?api_key=' + Settings.option('api_key'),
    type: 'json'
}, function(data, status, request) {
    
    var items = [];
    
    for(var i = 0; i < data.projects.length; i++) {
        var project = data.projects[i];
        
        var repoName = project.repository_name.split('/')[1];
        
        items.push({
            title: repoName         
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
            url: 'https://codeship.com/api/v1/projects/'+projectMeta.id+'.json?api_key=' + Settings.option('api_key'),
            type: 'json'
        }, function(data, status, request) {
            
            
            if(data.builds[0].status == "success") {
                var colour = '#008000';
            } else {
                var colour = '#ff0000';
            }
            
            var repoName = projectMeta.repository_name.split('/')[1];
            
            projectCard.title(repoName);
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
         console.log('The ajax request failed for projects, URL: https://codeship.com/api/v1/projects/:id.json?api_key=' + Settings.option('api_key'));
     });

// Settings.config(
//     { url: 'https://steveedson.co.uk/codeship-pebble' },
//   function(e) {
//     console.log('opening configurable');

//   },
//   function(e) {
//       console.log('closed configurable');
      
//       JSON.stringify(e.options);
      
//       Settings.data('api_key', e.options.api_key);
      
//   }
// );

Pebble.addEventListener('showConfiguration', function(e) {
  // Show config page
  Pebble.openURL('https://steveedson.co.uk/codeship-pebble');
});

Pebble.addEventListener('webviewclosed', function(e) {
  // Decode and parse config data as JSON
  var config_data = JSON.parse(decodeURIComponent(e.response));
  console.log('Config window returned: ', decodeURIComponent(e.response));

  // Prepare AppMessage payload
  var dict = {
    'api_key': config_data['api_key']
  };


    Settings.option("api_key", dict.api_key);

  // Send settings to Pebble watchapp
  Pebble.sendAppMessage(dict, function(){
    console.log('Sent config data to Pebble');  
  }, function() {
    console.log('Failed to send config data!');
  });
});

// Settings.config(
//   { url: 'https://steveedson.co.uk/codeship-pebble' },
//   function(e) {
//     console.log('opening configurable');

//     // Reset color to red before opening the webview
//     //Settings.option('api_key', 'red');
//   },
//   function(e) {
//     console.log('closed configurable');
//       Settings.option("api_key", e.options.api_key);
//   }
// );


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