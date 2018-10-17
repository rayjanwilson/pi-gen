const exec = require("child_process").exec;

module.exports = function(cmd_options, callback) {
  // Handle case where no options are passed in
  if (typeof(cmd_options) == "function" && typeof(callback) == "undefined") {
    callback = cmd_options;
    cmd_options = "";
  }

  let fields_to_extract = {
    "ssid": /ESSID:\"(.*)\"/,
    "quality": /Quality=(\d+\/\d+)/,
    "signal_strength": /.*Signal level=(.*)/,
    "group_cipher": /Group Cipher \: (\w+)/,
    "pairwise_cipher": /Pairwise Ciphers.*: (.*)/,
    "802.11": /IE: IEEE (.*)/,
    "auth_suite": /Authentication Suites.*: (.*)/,
    "encrypted": /Encryption key:(on)/,
    "open": /Encryption key:(off)/
  };

  exec("iwlist scan", (error, stdout, stderr) => {
    // Handle errors from running "iwlist scan"
    if (error) {
      return callback(error, output)
    }

    /* The output structure looks like this:
        [
            {
                interface: "wlan0",
                scan_results: [
                    { ssid: "WifiB", address: "...", "signal_strength": 57 },
                    { ssid: "WifiA", address: "...", "signal_strength": 35 }
                ]
            },
            ...
        ] */
    let output = [],
      interface_entry = null,
      current_cell = null;

    function append_previous_cell() {
      if (current_cell != null && interface_entry != null) {
        if (typeof(current_cell["ssid"]) != "undefined" && current_cell["ssid"] != "") {
          interface_entry["scan_results"].push(current_cell);
        }
        current_cell = null;
      }
    }

    function append_previous_interface() {
      append_previous_cell();
      if (interface_entry != null) {
        output.push(interface_entry);
        interface_entry = null;
      }
    }

    // Parse the result, build return object
    lines = stdout.split("\n");
    for (let idx in lines) {
      line = lines[idx].trim();
      console.log(line)
      // Detect new interface
      let re_new_interface = line.match(/([^\s]+)\s+Scan completed :/);
      if (re_new_interface) {
        console.log("Found new interface: " + re_new_interface[1]);
        append_previous_interface();
        interface_entry = {
          "interface": re_new_interface[1],
          "scan_results": []
        };
        continue;
      }

      // Detect new cell
      let re_new_cell = line.match(/Cell ([0-9]+) - Address: (.*)/);
      if (re_new_cell) {
        append_previous_cell();
        current_cell = {
          "cell_id": parseInt(re_new_cell[1]),
          "address": re_new_cell[2]
        };
        continue;
      }

      // Handle other fields we want to extract
      for (let key in fields_to_extract) {
        let match = line.match(fields_to_extract[key]);
        if (match) {
          current_cell[key] = match[1];
        }
      }
    }

    // Add the last item we tracked
    append_previous_interface();

    return callback(null, output);
  });

}
