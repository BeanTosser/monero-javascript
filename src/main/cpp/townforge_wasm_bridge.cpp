#include <iostream>
#include "townforge_wasm_bridge.h"
#include "http_client_wasm.h"

using namespace std;
using namespace townforge_wasm_bridge;

string townforge_wasm_bridge::start_townforge()
{
  std::cout << "Bridge ready to call townforge source!" << std::endl;
  try {
    throw std::runtime_error("calling townforge source not implemented");
  } catch (exception& e) {
    return e.what();
  }
}
