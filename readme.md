# Lounge

Command line style chat application and multi-user dungeon

![Screenshot](https://rawgit.com/danielpquinn/lounge/master/lounge.png "Lounge")

### Install

    cd lounge
    npm install

### Run tests

    npm test

### Configure

    cp config.example.js config.js

Edit `config.js` to change site title, banner and email client configuration

### Bootstrap

Bootstrap an environment with a few example rooms

    node tools/bootstrap

Point your browser to localhost:3000. The bootstrap script will have created an admin user with an email address __admin@lounge.com__ and a password __admin__. To log in as the admin user enter the following command into the prompt

    /signin -email admin@lounge.com -password admin

### Admin commands

(Not available from user facing help menu)

__createenvironment__  
Creates a new environment  
Example: `/createenvironment -name Entrance -description Entrance to an old dusty dungeon`

__createitem__  
Creates a new item which can be picked up and dropped by users  
Example: `/createitem -name Sceptre -description A magical relic`

__addrequirement__  
Require an item to enter a room.  
Example: `/addrequirement -environment Entrance -item Sceptre`

__connectenvironments__  
Connect two environments. This will allow users to move from place to place.  
Example: `/connectenvironments -environment Entrance -item Sceptre`