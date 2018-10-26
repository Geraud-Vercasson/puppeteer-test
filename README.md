Tests avec puppeteer
====================

[![Build Status](https://travis-ci.org/campus-digital-grenoble/module-test-puppeteer.svg?branch=master)](https://travis-ci.org/campus-digital-grenoble/module-test-puppeteer)

Quick start
-----------

```bash
# installer puppeteer à partir du packagge.json
npm install

# lancer les tests
npm run pouetpouet
```

Ce qu'il faut regarder
----------------------

Les premiers fichiers à regarder sont dans l'ordre :

* tests/basic.test.js
* tests/shorten.test.js

Principe
--------

Ces tests utilisent 2 outils :

* Jest : c'est l'outil de tests utilisé principalement par React (un framework JS, comme VueJS)
* Puppeteer : un outil qui permet de contrôler le navigateur chrome à distance
