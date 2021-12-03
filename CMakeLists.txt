cmake_minimum_required(VERSION 3.4.1)

project(townforge-wasm)

# build with exception whitelist from file
file(STRINGS wasm_exception_whitelist.txt WASM_EXCEPTION_WHITELIST)
string(REPLACE ";" "," WASM_EXCEPTION_WHITELIST "${WASM_EXCEPTION_WHITELIST}")
SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -Oz --bind -s EXCEPTION_CATCHING_ALLOWED='[${WASM_EXCEPTION_WHITELIST}]'")
add_definitions(-DAUTO_INITIALIZE_EASYLOGGINGPP -DNO_AES)

##############
# C++ bridge
##############

include_directories("src/cpp")

#####################
# monero-cpp
#####################

set(MONERO_CPP "external/monero-cpp")
set(MONERO_CPP_SRC "${MONERO_CPP}/src")

# headers
include_directories("${MONERO_CPP_SRC}")
include_directories("${MONERO_CPP}/external/libsodium/include")
include_directories("${MONERO_CPP}/external/libsodium/include/sodium")

##################
# townforge
##################

set(TOWNFORGE "${MONERO_CPP}/external/townforge")
set(TOWNFORGE_SRC "${TOWNFORGE}/src")

# headers
include_directories("src/main/cpp")
include_directories("${TOWNFORGE_SRC}/")
include_directories("${TOWNFORGE_SRC}/checkpoints")
include_directories("${TOWNFORGE_SRC}/common")
#include_directories("${TOWNFORGE_SRC}/crypto")
#include_directories("${TOWNFORGE_SRC}/crypto/crypto_ops_builder/include/")    # DISABLED?
#include_directories("${TOWNFORGE_SRC}/crypto/crypto_ops_builder/include/sodium")    # DISABLED?
include_directories("${TOWNFORGE_SRC}/cryptonote_basic")
#include_directories("${TOWNFORGE_SRC}/multisig")
#include_directories("${TOWNFORGE_SRC}/cryptonote_core")
#include_directories("${TOWNFORGE_SRC}/cryptonote_protocol")
#include_directories("${TOWNFORGE_SRC}/wallet")
#include_directories("${TOWNFORGE_SRC}/rpc")
#include_directories("${TOWNFORGE_SRC}/mnemonics")
include_directories("${TOWNFORGE}/external/")
include_directories("${TOWNFORGE}/external/easylogging++")
include_directories("${TOWNFORGE}/external/rapidjson/include")
include_directories("${TOWNFORGE}/external/unbound/libunbound")
include_directories("${TOWNFORGE}/external/db_drivers/liblmdb")
include_directories("${TOWNFORGE}/contrib/epee/include")
include_directories("${TOWNFORGE}/contrib/epee/include/net")

#include_directories("${CMAKE_CURRENT_BINARY_DIR}")
#include_directories("${TOWNFORGE_SRC}/wallet/api")

include_directories("${TOWNFORGE}/build/release/translations")
include_directories("${TOWNFORGE}/build/release/generated_include")

#############
# OpenSSL
#############

#find_package(OpenSSL REQUIRED)
#message(STATUS "Using OpenSSL include dir at ${OPENSSL}")

set(OPENSSL ${CMAKE_SOURCE_DIR}/build/openssl)
include_directories("${OPENSSL}")
include_directories("${OPENSSL}/include") # must exist already - run bin/build-openssl-emscripten.sh

add_library(openssl_crypto STATIC IMPORTED)
set_target_properties(
    openssl_crypto PROPERTIES IMPORTED_LOCATION
    ${OPENSSL}/lib/libcrypto.a
)

add_library(openssl_ssl STATIC IMPORTED)
set_target_properties(
    openssl_ssl PROPERTIES IMPORTED_LOCATION
    ${OPENSSL}/lib/libssl.a
)

#############
# Boost
#############

set(BOOST ${CMAKE_SOURCE_DIR}/build/boost)
include_directories("${BOOST}")
include_directories("${BOOST}/include") # must exist already - run bin/build-boost-emscripten.sh

add_library(boost_chrono STATIC IMPORTED)
set_target_properties(
    boost_chrono PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_chrono.a
)

add_library(boost_system STATIC IMPORTED)
set_target_properties(
    boost_system PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_system.a
)

add_library(boost_thread STATIC IMPORTED)
set_target_properties(
    boost_thread PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_thread.a
)

add_library(boost_serialization STATIC IMPORTED)
set_target_properties(
    boost_serialization PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_serialization.a
)

add_library(boost_filesystem STATIC IMPORTED)
set_target_properties(
    boost_filesystem PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_filesystem.a
)

add_library(boost_regex STATIC IMPORTED)
set_target_properties(
    boost_regex PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_regex.a
)

#add_library(boost_atomic STATIC IMPORTED)
#set_target_properties(
    #boost_atomic PROPERTIES IMPORTED_LOCATION
    #${BOOST}/lib/libboost_atomic.a
#)

################################
# Keys-only wallet source files
################################

set(
    MONERO_WALLET_KEYS_SRC_FILES
    
    # monero-javascript WASM bridge
    #src/main/cpp/index.cpp
    #src/main/cpp/monero_wasm_bridge.cpp
    
    # monero-cpp (modified for WASM)
    # TODO update these for townforge if use case
    #${MONERO_CPP_SRC}/utils/monero_utils.cpp
    #${MONERO_CPP_SRC}/daemon/monero_daemon_model.cpp
    #${MONERO_CPP_SRC}/wallet/monero_wallet_model.cpp
    #${MONERO_CPP_SRC}/wallet/monero_wallet_keys.cpp
    ${MONERO_CPP}/external/libsodium/src/crypto_verify/verify.c
    
    # townforge wallet (modified for WASM)
    ${TOWNFORGE_SRC}/cryptonote_basic/cryptonote_basic_impl.cpp
    ${TOWNFORGE_SRC}/cryptonote_basic/account.cpp
    ${TOWNFORGE_SRC}/cryptonote_basic/cryptonote_format_utils.cpp
    #${TOWNFORGE_SRC}/cryptonote_basic/cryptonote_format_utils_basic.cpp # TODO: including this without monero-javascript source causes duplicate definition
    ${TOWNFORGE_SRC}/crypto/crypto.cpp
    ${TOWNFORGE_SRC}/crypto/hash.c
    ${TOWNFORGE_SRC}/crypto/slow-hash.c
    ${TOWNFORGE_SRC}/crypto/oaes_lib.c
    ${TOWNFORGE_SRC}/crypto/crypto-ops.c
    ${TOWNFORGE_SRC}/crypto/crypto-ops-data.c
    ${TOWNFORGE_SRC}/crypto/keccak.c
    ${TOWNFORGE_SRC}/crypto/chacha.c
    ${TOWNFORGE_SRC}/crypto/random.c
    ${TOWNFORGE_SRC}/crypto/aesb.c
    ${TOWNFORGE_SRC}/crypto/tree-hash.c
    ${TOWNFORGE_SRC}/crypto/hash-extra-blake.c
    ${TOWNFORGE_SRC}/crypto/blake256.c
    ${TOWNFORGE_SRC}/crypto/hash-extra-groestl.c
    ${TOWNFORGE_SRC}/crypto/hash-extra-jh.c
    ${TOWNFORGE_SRC}/crypto/hash-extra-skein.c
    ${TOWNFORGE_SRC}/crypto/groestl.c
    ${TOWNFORGE_SRC}/crypto/jh.c
    ${TOWNFORGE_SRC}/crypto/skein.c
    ${TOWNFORGE_SRC}/cryptonote_core/cryptonote_tx_utils.cpp
    ${TOWNFORGE}/contrib/epee/src/byte_stream.cpp
    ${TOWNFORGE}/contrib/epee/src/byte_slice.cpp
    ${TOWNFORGE}/contrib/epee/src/hex.cpp
    ${TOWNFORGE}/contrib/epee/src/string_tools.cpp
    ${TOWNFORGE}/contrib/epee/src/memwipe.c
    ${TOWNFORGE}/contrib/epee/src/mlocker.cpp
    ${TOWNFORGE}/contrib/epee/src/wipeable_string.cpp
    ${TOWNFORGE_SRC}/common/base58.cpp
    ${TOWNFORGE_SRC}/device/device.cpp
    ${TOWNFORGE_SRC}/device/device_default.cpp
    ${TOWNFORGE_SRC}/multisig/multisig.cpp
    ${TOWNFORGE_SRC}/ringct/rctOps.cpp
    ${TOWNFORGE_SRC}/ringct/rctTypes.cpp
    ${TOWNFORGE_SRC}/ringct/rctCryptoOps.c
    ${TOWNFORGE_SRC}/ringct/rctSigs.cpp
    ${TOWNFORGE_SRC}/ringct/bulletproofs.cc
    ${TOWNFORGE_SRC}/ringct/multiexp.cc
    ${TOWNFORGE_SRC}/mnemonics/electrum-words.cpp
    ${TOWNFORGE}/external/easylogging++/easylogging++.cc
)

################################
# Full wallet source files
################################

set(
    MONERO_WALLET_FULL_SRC_FILES
    
    # monero-javascript WASM bridge
    src/main/cpp/http_client_wasm.cpp
    
    # monero-cpp (modified for WASM)
    #${MONERO_CPP_SRC}/wallet/monero_wallet_full.cpp # TODO: update for townforge if use case
    
    # townforge
    ${TOWNFORGE}/external/db_drivers/liblmdb/mdb.c
    ${TOWNFORGE}/external/db_drivers/liblmdb/midl.c
    ${TOWNFORGE}/contrib/epee/src/abstract_http_client.cpp
    #${TOWNFORGE}/contrib/epee/src/http_auth.cpp
    ${TOWNFORGE_SRC}/wallet/wallet2.cpp
    ${TOWNFORGE_SRC}/wallet/message_store.cpp
    ${TOWNFORGE_SRC}/wallet/message_transporter.cpp
    ${TOWNFORGE_SRC}/wallet/node_rpc_proxy.cpp
    ${TOWNFORGE_SRC}/wallet/wallet_rpc_payments.cpp
    #${TOWNFORGE_SRC}/blockchain_db/lmdb/db_lmdb.cpp
    ${TOWNFORGE_SRC}/cryptonote_core/cryptonote_tx_utils.cpp
    ${TOWNFORGE_SRC}/checkpoints/checkpoints.cpp
    ${TOWNFORGE_SRC}/common/perf_timer.cpp
    ${TOWNFORGE_SRC}/common/threadpool.cpp
    ${TOWNFORGE_SRC}/common/aligned.c
    ${TOWNFORGE_SRC}/common/util.cpp
    ${TOWNFORGE_SRC}/common/i18n.cpp
    ${TOWNFORGE_SRC}/common/combinator.cpp
    ${TOWNFORGE_SRC}/rpc/rpc_payment_signature.cpp
    ${TOWNFORGE_SRC}/wallet/ringdb.cpp
    ${TOWNFORGE_SRC}/cryptonote_basic/miner.cpp
    ${TOWNFORGE_SRC}/cryptonote_basic/difficulty.cpp
    ${TOWNFORGE_SRC}/cryptonote_core/tx_sanity_check.cpp
)

set(
    TOWNFORGE_SRC_FILES
    
    ${TOWNFORGE_SRC}/cryptonote_basic/cc_command_defs.cpp
)

####################
# Build parameters
####################

#-s USE_PTHREADS=1 \
#-s PTHREAD_POOL_SIZE=2 \
#-s PROXY_TO_PTHREAD \
#-s DISABLE_EXCEPTION_CATCHING=0 \
#-s ASYNCIFY=1 \
#-s 'ASYNCIFY_IMPORTS=[\"js_send_json_request\",\"js_send_binary_request\",\"emscripten_sleep\"]' \
#-s ALLOW_MEMORY_GROWTH=0 \
#-s INITIAL_MEMORY=1536MB \

set (
EMCC_LINKER_FLAGS_BASE

# unsure if the -I...boost..include is necessary here due to include above
# TODO? does EXPORT_NAME need to be the same for both targets? (or should it be set per-target with …_WASM, …_ASMJS?)

"-Wall -Werror -std=c++11 -Oz \
--bind -s MODULARIZE=1 \
-s 'EXPORT_NAME=\"townforge\"' \
-s ERROR_ON_UNDEFINED_SYMBOLS=0 \
-s ASSERTIONS=0 \
-s EXIT_RUNTIME=0 \
-s PRECISE_F32=1 \
-s EXCEPTION_DEBUG=0 \
-s DEMANGLE_SUPPORT=0 \
-s NO_DYNAMIC_EXECUTION=1 \
-s NODEJS_CATCH_EXIT=0 \
-s RESERVED_FUNCTION_POINTERS=5 \
-s EXPORTED_RUNTIME_METHODS='[\"UTF8ToString\",\"stringToUTF8\",\"lengthBytesUTF8\",\"intArrayToString\",\"getTempRet0\",\"addFunction\"]' \
-s WASM=1 \
-s ALLOW_MEMORY_GROWTH=1 \
"
    # • Disabling exception catching does not introduce silent failures 
    # • Probably don't need PRECISE_F32 but wouldn't want to not use it
    #
    #
    # -s SAFE_HEAP=1 \
    # -g \
)

set(
EMCC_LINKER_FLAGS_KEYS
"${EMCC_LINKER_FLAGS_BASE} \
"
)

set(
EMCC_LINKER_FLAGS_FULL
"${EMCC_LINKER_FLAGS_BASE} \
-s ASYNCIFY=1 \
-s 'ASYNCIFY_IMPORTS=[\"js_send_json_request\",\"js_send_binary_request\",\"emscripten_sleep\"]' \
"
)

message(STATUS "EMCC_LINKER_FLAGS_KEYS ${EMCC_LINKER_FLAGS_KEYS}")
message(STATUS "EMCC_LINKER_FLAGS_FULL ${EMCC_LINKER_FLAGS_FULL}")

####################
# Build target
####################

add_executable(townforge ${TOWNFORGE_SRC_FILES} ${MONERO_WALLET_FULL_SRC_FILES} ${MONERO_WALLET_KEYS_SRC_FILES})
set_target_properties(townforge PROPERTIES LINK_FLAGS "${EMCC_LINKER_FLAGS_FULL}")
target_compile_definitions(townforge PRIVATE BUILD_WALLET_FULL=1)
target_link_libraries(
    townforge
    #
    #openssl_ssl
    #openssl_crypto
    #
    boost_chrono
    boost_system
    boost_thread
    boost_serialization
    #boost_filesystem
    boost_regex
    #boost_atomic
    #
    ${log-lib}
)

# build to bitcode instead of wasm
#SET(CMAKE_EXECUTABLE_SUFFIX ".bc")