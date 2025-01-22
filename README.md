# artisan-trace

This application uses Docker Compose for managing its services. This document provides instructions on how to set up, run, and manage the application using the provided `Makefile`.

## Prerequisites

Ensure the following software is installed on your system:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/)
- [Node (Recommended LTS Version)](https://nodejs.org/en/download)
To verify if Node.js is installed run:
```bash
node --version
```
If not installed, download if from the [official Node.js Website](https://nodejs.org/en/download) or 
install it using packaged manager of your choice.

-   [Nix (optional, for environemnt management)](https://nixos.wiki/wiki/Main_Page)
## Getting Started

The `Makefile` provided simplifies common Docker Compose commands. Below is a guide on how to use it.

### 1. Starting the Application

To start the application and its associated services:

#### Starting the application (services)
```bash
make up
```
#### Stoppping the application (services)
```bash
make stop
```

#### Stoppping and Removing containers
```bash
make down
```
#### Build the application
```bash
make build
```
#### Viewing Logs
```bash
make logs
```
#### Clean Up
```bash
make clean
```
#### Syntax Check
```bash
make check-syntax
```
#### Help Command
```bash
make help
```

Additional Notes
-   All commands are aliases for `docker-compose` commands, so feel free to use
Docker Compose directly if preffered

-   Ensure Docker and Docker Compose are propertly installed and running before
using the above commands
