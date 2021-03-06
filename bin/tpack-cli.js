#!/usr/bin/env node

var defaultTpackConfig = "tpack.config.js";

main();

function main() {
                
    var Path = require('path');

    // 优先考虑使用本地安装的 tpack 版本。
    try {
        var localCli = require.resolve(Path.resolve("node_modules/tpack/bin/tpack-cli.js"));
        if(__filename !== localCli) {
            return module.exports = require(localCli);
        }
    } catch(e) {}

    var tpack = module.exports = require('../lib/index.js');

    // 解析命令行参数。
	var options = tpack.options;

    // -v, -version, --version
    if (options.v || options.version || options["-version"]) {
        console.log(require('../package.json').version);
        return 0;
    }

    // -cwd, --cwd
    if (options.cwd || options["-cwd"]) {
        process.cwd(options.cwd || options["-cwd"]);
    }
    
    // -config, --config, 
    options.config = Path.resolve(options.config || options['-config'] || defaultTpackConfig);
    
    // 支持载入全局模块。
    try {
        require('require-global')([Path.resolve(__dirname, "../../"), Path.resolve(__dirname, "../node_modules/")]);
    } catch (e) {
    }

    // 执行 tpack.config.js
    if (require("fs").existsSync(options.config)) {
		require(options.config);
        return 0;
    }
    
    if (!tpack.builder.rules.length && (tpack.cmd === "build" || tpack.cmd === "watch")) {
        tpack.builder.error("Cannot find '{0}'. Use 'tpack init' to create it.", options.config);
        return 1;
    }
    
    tpack.run();
    return 0;
    
}
