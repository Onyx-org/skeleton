# Onyx

## Overview

PHP application skeleton based on Silex 2. Promote framework agnostic conception.

## Getting started

### Requirements

* docker, executable by your user (see official documentation to set it up)
* php >= 7.1.0

### Installation

Download deps, configure, ...
```bash
 make install
 make wizard-set-namespace
```
**Note :** In *wizard-set-namespace*, use **::** as namespace delimiter (ex: *Onyx::Cool::App*)


Launching web server (choose your port with WEB_PORT parameter, 80 if omitted)
```bash
 cd docker
 make WEB_PORT=82 up
```

See home page at http://localhost:82
