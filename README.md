IMPACTJS MARKETJS PLATFORM
==========================
### A cleaner, simpler approach to building HTML5 games

#### GUIDE, DOCS & REFS:
* ##### [ImpactJS](http://impactjs.com/documentation)
* ##### [Storage Manager Plugin](https://docs.google.com/document/d/14kzaC8yl2QbJzMFEIkIJWviY78GW0Cnz7WF9GRh9Klg/edit?usp=sharing)
* ##### [FAQ](https://bit.ly/mjs-faq)


#### Notes: 

##### Security related
As of October 23rd 2017 anti-piracy security updates, jscrambler obfuscation is now part of the game compilation process ( '-b' task from push.sh). 

In push.sh, added secure_strong and secure_regular: 

- secure_regular excludes framebreaker and copyright message (for clients typically -> easier for integration)  
- secure_strong has all the goods
