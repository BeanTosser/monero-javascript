#!/usr/bin/env bash

# initialize submodules recursively
git submodule update --init --recursive

# update monero-cpp
cd ./external/monero-cpp
git checkout townforge
git pull --ff-only origin townforge

# update townforge
cd ./external/townforge
git checkout cc
git pull --ff-only origin cc
cd ../../../../