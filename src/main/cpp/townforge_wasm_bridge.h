/**
 * Provides a bridge from WebAssembly to Townforge.
 */
#ifndef townforge_wasm_bridge_h
#define townforge_wasm_bridge_h

#include <emscripten/bind.h>
#include <string>

using namespace std;
using namespace emscripten;

namespace townforge_wasm_bridge
{
  string start_townforge(string config);
}

#endif /* townforge_wasm_bridge_h */
