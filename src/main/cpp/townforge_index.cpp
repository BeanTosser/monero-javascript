#include <stdio.h>
#include <emscripten/bind.h>

#include "townforge_wasm_bridge.h"

// register bindings from JS to C++ using emscripten
EMSCRIPTEN_BINDINGS(module)
{
  emscripten::function("start_townforge", &townforge_wasm_bridge::start_townforge);
}
extern "C"
{
}
