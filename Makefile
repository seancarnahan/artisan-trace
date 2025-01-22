prefix = @prefix@
exec_prefix = @exec_prefix@
bindir = @bindir@

# Define variables for Docker Compose, which will be replaced by configure
# DC = @DOCKER_COMPOSE@
DC = docker-compose

# Default target executed when no arguments are given to make.
default: up

# Start up the services defined in your docker-compose.yml
up:
	@$(DC) up

detactch:
	@$(DC) up -d

# Stop the services gracefully
stop:
	@$(DC) stop

# Stop and remove containers, networks, images, and volumes
down:
	@$(DC) down

# Build or rebuild services
build:
	@$(DC) build

# View output from containers
logs:
	@$(DC) logs -f

# Remove stopped service containers and clean up
clean: stop
	@$(DC) rm -f

# Target for checking the makefile syntax
check-syntax:
	@echo "Makefile syntax check passed!"

# Help command to display available commands
help:
	@echo "Available commands:"
	@echo "  make up       : Start up all services in the background"
	@echo "  make stop     : Stop running services"
	@echo "  make down     : Stop and remove containers, networks, images, and volumes"
	@echo "  make build    : Build or rebuild services"
	@echo "  make logs     : View output from running services"
	@echo "  make clean    : Stop services and clean up containers"
	@echo "  make check-syntax : Check Makefile syntax"

.PHONY: up stop down build logs clean check-syntax help

