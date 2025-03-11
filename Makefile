# Variables
NODE_VERSION := 20
CLI_PATH := ./your-cli-executable

# Colors for output
BLUE := \033[34m
GREEN := \033[32m
RED := \033[31m
RESET := \033[0m

# Default target
.DEFAULT_GOAL := help

.PHONY: help setup install build test clean lint test-watch test-ci

# Show help
help:
	@echo "$(BLUE)Available commands:$(RESET)"
	@echo "  $(GREEN)make setup$(RESET)     - Initial project setup"
	@echo "  $(GREEN)make install$(RESET)   - Install dependencies"
	@echo "  $(GREEN)make build$(RESET)     - Build TypeScript project"
	@echo "  $(GREEN)make test$(RESET)      - Run tests"
	@echo "  $(GREEN)make test-watch$(RESET) - Run tests in watch mode"
	@echo "  $(GREEN)make test-ci$(RESET)   - Run tests with coverage and reports"
	@echo "  $(GREEN)make clean$(RESET)     - Clean build artifacts"
	@echo "  $(GREEN)make lint$(RESET)      - Run TypeScript linting"

# Initial setup
setup: install build
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

# Run tests
test:
	@echo "$(BLUE)Running tests...$(RESET)"
	npm test
	@echo "$(GREEN)Tests completed!$(RESET)"

# Run tests in watch mode
test-watch:
	@echo "$(BLUE)Running tests in watch mode...$(RESET)"
	npm run test:watch
	@echo "$(GREEN)Tests completed!$(RESET)"

# Run tests with coverage and reports
test-ci:
	@echo "$(BLUE)Running tests with coverage and reports...$(RESET)"
	npm run test:ci
	@echo "$(GREEN)CI tests completed!$(RESET)"

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
check: validate-cli lint test
	@echo "$(GREEN)All checks passed!$(RESET)" 