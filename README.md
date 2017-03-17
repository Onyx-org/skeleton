# Onyx  ![PHP >= 7.1](https://img.shields.io/badge/php-%3E%3D%207.1-lightgrey.svg?colorB=476daa)

## Overview

PHP application skeleton based on Silex 2. Promote framework agnostic conception.

## Getting started

### Requirements

* docker, executable by your user (see official documentation to set it up)
* php >= 7.1.0 (and some ext)

### Installation

Download deps, configure, ...
```bash
 make
 make wizard-set-namespace
```
**Note :** In *wizard-set-namespace*, use **::** as namespace delimiter (ex: *Onyx::Cool::App*)


Launching web server (choose your port with WEB_PORT parameter, 80 if omitted)
```bash
 make WEB_PORT=82 up
```

See home page at http://localhost:82


### Settings

Tired of typing WEB_PORT each time ? Try this :
```
 mv .settings.mk.example .settings.mk
 vi .settings.mk
```
