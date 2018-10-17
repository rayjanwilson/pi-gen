const util = require('util');
const exec = util.promisify(require('child_process').exec);

const fields_to_extract = {
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

// we have side effects here, so this needs refactoring
let output = [];
let interface_entry = null;
let current_cell = null;

const append_previous_cell = () => {
  if (current_cell != null && interface_entry != null) {
    if (typeof(current_cell["ssid"]) != "undefined" && current_cell["ssid"] != "") {
      interface_entry["scan_results"].push(current_cell);
    }
    current_cell = null;
  }
}

const append_previous_interface = () => {
  append_previous_cell();
  if (interface_entry != null) {
    output.push(interface_entry);
    interface_entry = null;
  }
}

const parseWifis = (stdout) => {
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
}

async function iwlistAsync(){
  const { stdout, stderr } = await exec("iwlist scan");

  // Parse the result, build return object
  parseWifis(stdout);

  // Add the last item we tracked
  append_previous_interface();

  return output[0]['scan_results'];
}

module.exports = iwlistAsync;
