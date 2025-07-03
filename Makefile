# Variables
NODE_VERSION := 20
CLI_PATH := ./your-cli-executable

# Colors for output
BLUE := \033[34m
GREEN := \033[32m
RED := \033[31m
YELLOW := \033[33m
RESET := \033[0m

# Default target
.DEFAULT_GOAL := help

.PHONY: help setup install build test clean lint test-watch test-ci test-local test-dev test-stage test-local-watch test-dev-watch test-stage-watch test-local-ci test-dev-ci test-stage-ci validate-config

# Show help
help:
	@echo "$(BLUE)Available commands:$(RESET)"
	@echo "  $(GREEN)make setup$(RESET)          - Initial project setup"
	@echo "  $(GREEN)make install$(RESET)        - Install dependencies"
	@echo "  $(GREEN)make build$(RESET)          - Build TypeScript project"
	@echo "  $(GREEN)make validate-config$(RESET) - Validate environment configuration"
	@echo "  $(GREEN)make test$(RESET)           - Run tests (default environment)"
	@echo "  $(GREEN)make test-local$(RESET)     - Run tests for local environment"
	@echo "  $(GREEN)make test-dev$(RESET)       - Run tests for dev environment"
	@echo "  $(GREEN)make test-stage$(RESET)     - Run tests for stage environment"
	@echo "  $(GREEN)make test-watch$(RESET)     - Run tests in watch mode"
	@echo "  $(GREEN)make test-local-watch$(RESET) - Run local tests in watch mode"
	@echo "  $(GREEN)make test-dev-watch$(RESET) - Run dev tests in watch mode"
	@echo "  $(GREEN)make test-stage-watch$(RESET) - Run stage tests in watch mode"
	@echo "  $(GREEN)make test-ci$(RESET)        - Run tests with coverage and reports"
	@echo "  $(GREEN)make test-local-ci$(RESET)  - Run local tests with coverage"
	@echo "  $(GREEN)make test-dev-ci$(RESET)    - Run dev tests with coverage"
	@echo "  $(GREEN)make test-stage-ci$(RESET)  - Run stage tests with coverage"
	@echo "  $(GREEN)make clean$(RESET)          - Clean build artifacts"
	@echo "  $(GREEN)make lint$(RESET)           - Run TypeScript linting"

# Initial setup
setup: install build validate-config
	@echo "$(GREEN)Project setup completed!$(RESET)"

# Install dependencies
install:
	@echo "$(BLUE)Installing dependencies...$(RESET)"
	@if command -v node >/dev/null 2>&1; then \
		if [ "$$(node -v | cut -d. -f1 | tr -d 'v')" -lt "$(NODE_VERSION)" ]; then \
			echo "$(RED)Node.js version $(NODE_VERSION) or higher is required$(RESET)"; \
			exit 1; \
		fi \
	else \
		echo "$(RED)Node.js is not installed$(RESET)"; \
		exit 1; \
	fi
	npm ci
	@echo "$(GREEN)Dependencies installed successfully!$(RESET)"

# Build TypeScript project
build:
	@echo "$(BLUE)Building TypeScript project...$(RESET)"
	npm run build
	@echo "$(GREEN)Build completed!$(RESET)"

# Validate environment configuration
validate-config:
	@echo "$(BLUE)Validating environment configuration...$(RESET)"
	npm run validate-config
	@echo "$(GREEN)Configuration validation completed!$(RESET)"

# Run tests (default environment)
test:
	@echo "$(BLUE)Running tests...$(RESET)"
	npm test
	@echo "$(GREEN)Tests completed!$(RESET)"

# Run tests for local environment
test-local:
	@echo "$(BLUE)Running tests for $(YELLOW)local$(BLUE) environment...$(RESET)"
	npm run test:local
	@echo "$(GREEN)Local tests completed!$(RESET)"

# Run tests for dev environment
test-dev:
	@echo "$(BLUE)Running tests for $(YELLOW)dev$(BLUE) environment...$(RESET)"
	npm run test:dev
	@echo "$(GREEN)Dev tests completed!$(RESET)"

# Run tests for stage environment
test-stage:
	@echo "$(BLUE)Running tests for $(YELLOW)stage$(BLUE) environment...$(RESET)"
	npm run test:stage
	@echo "$(GREEN)Stage tests completed!$(RESET)"

# Run tests in watch mode
test-watch:
	@echo "$(BLUE)Running tests in watch mode...$(RESET)"
	npm run test:watch
	@echo "$(GREEN)Tests completed!$(RESET)"

# Run local tests in watch mode
test-local-watch:
	@echo "$(BLUE)Running $(YELLOW)local$(BLUE) tests in watch mode...$(RESET)"
	npm run test:local:watch
	@echo "$(GREEN)Local tests completed!$(RESET)"

# Run dev tests in watch mode
test-dev-watch:
	@echo "$(BLUE)Running $(YELLOW)dev$(BLUE) tests in watch mode...$(RESET)"
	npm run test:dev:watch
	@echo "$(GREEN)Dev tests completed!$(RESET)"

# Run stage tests in watch mode
test-stage-watch:
	@echo "$(BLUE)Running $(YELLOW)stage$(BLUE) tests in watch mode...$(RESET)"
	npm run test:stage:watch
	@echo "$(GREEN)Stage tests completed!$(RESET)"

# Run tests with coverage and reports
test-ci:
	@echo "$(BLUE)Running tests with coverage and reports...$(RESET)"
	npm run test:ci
	@echo "$(GREEN)CI tests completed!$(RESET)"

# Run local tests with coverage and reports
test-local-ci:
	@echo "$(BLUE)Running $(YELLOW)local$(BLUE) tests with coverage and reports...$(RESET)"
	npm run test:local:ci
	@echo "$(GREEN)Local CI tests completed!$(RESET)"

# Run dev tests with coverage and reports
test-dev-ci:
	@echo "$(BLUE)Running $(YELLOW)dev$(BLUE) tests with coverage and reports...$(RESET)"
	npm run test:dev:ci
	@echo "$(GREEN)Dev CI tests completed!$(RESET)"

# Run stage tests with coverage and reports
test-stage-ci:
	@echo "$(BLUE)Running $(YELLOW)stage$(BLUE) tests with coverage and reports...$(RESET)"
	npm run test:stage:ci
	@echo "$(GREEN)Stage CI tests completed!$(RESET)"

# Clean build artifacts
clean:
	@echo "$(BLUE)Cleaning build artifacts...$(RESET)"
	rm -rf dist/
	rm -rf coverage/
	rm -rf test-results/
	rm -rf node_modules/
	@echo "$(GREEN)Clean completed!$(RESET)"

# Run TypeScript linting
lint:
	@echo "$(BLUE)Running TypeScript linting...$(RESET)"
	npx tsc --noEmit
	@echo "$(GREEN)Linting completed!$(RESET)"

# Validate CLI path
validate-cli:
	@if [ ! -f "$(CLI_PATH)" ]; then \
		echo "$(RED)Error: CLI executable not found at $(CLI_PATH)$(RESET)"; \
		echo "Please update the CLI_PATH in the Makefile to point to your CLI executable"; \
		exit 1; \
	fi
	@echo "$(GREEN)CLI executable found!$(RESET)"

# Run all checks
check: validate-cli lint validate-config test
	@echo "$(GREEN)All checks passed!$(RESET)"

# Run environment-specific checks
check-local: validate-cli lint validate-config test-local
	@echo "$(GREEN)All local environment checks passed!$(RESET)"

check-dev: validate-cli lint validate-config test-dev
	@echo "$(GREEN)All dev environment checks passed!$(RESET)"

check-stage: validate-cli lint validate-config test-stage
	@echo "$(GREEN)All stage environment checks passed!$(RESET)" 